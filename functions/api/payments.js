/**
 * Payment API Routes for Saudi Payment Methods
 * Handles Mada, STC Pay, Apple Pay integration for Idea to Market Platform
 */

import { Hono } from 'hono';

const app = new Hono();

// ===== PAYMENT PROCESSING =====

// Create payment session
app.post('/create-session', async (c) => {
  try {
    const { planType, paymentMethod, amount, currency = 'SAR' } = await c.req.json();
    const locale = c.get('locale') || 'ar-SA';
    const isArabic = locale === 'ar-SA';
    const userId = c.get('jwtPayload')?.sub;

    if (!planType || !paymentMethod || !amount) {
      return c.json({
        success: false,
        error: {
          message: isArabic ? 'معلومات الدفع مطلوبة' : 'Payment information required',
          code: 'MISSING_PAYMENT_INFO'
        }
      }, 400);
    }

    // Generate payment session ID
    const sessionId = crypto.randomUUID();
    const expiresAt = Date.now() + (30 * 60 * 1000); // 30 minutes

    // Create payment session data
    const sessionData = {
      sessionId,
      userId,
      planType,
      paymentMethod,
      amount,
      currency,
      status: 'pending',
      createdAt: Date.now(),
      expiresAt,
      locale,
      metadata: {
        userAgent: c.req.header('User-Agent'),
        ip: c.req.header('CF-Connecting-IP'),
        country: c.req.header('CF-IPCountry')
      }
    };

    // Store session in KV
    await c.env.SESSIONS.put(
      `payment_${sessionId}`,
      JSON.stringify(sessionData),
      { expirationTtl: 30 * 60 } // 30 minutes
    );

    let paymentUrl;
    let redirectData = {};

    switch (paymentMethod) {
      case 'mada':
        redirectData = await createMadaPayment(sessionData, c.env);
        break;
      case 'stc_pay':
        redirectData = await createSTCPayment(sessionData, c.env);
        break;
      case 'apple_pay':
        redirectData = await createApplePaySession(sessionData, c.env);
        break;
      case 'google_pay':
        redirectData = await createGooglePaySession(sessionData, c.env);
        break;
      default:
        throw new Error('Unsupported payment method');
    }

    // Track payment initiation
    await c.env.ANALYTICS?.writeDataPoint({
      blobs: [c.req.header('CF-Ray'), 'payment_initiated', paymentMethod, planType],
      doubles: [Date.now(), amount],
      indexes: ['payment_analytics']
    });

    return c.json({
      success: true,
      data: {
        sessionId,
        expiresAt,
        paymentMethod,
        amount,
        currency,
        ...redirectData
      }
    });

  } catch (error) {
    console.error('Payment session creation error:', error);
    
    const isArabic = c.get('locale') === 'ar-SA';
    return c.json({
      success: false,
      error: {
        message: isArabic ? 'فشل في إنشاء جلسة الدفع' : 'Failed to create payment session',
        code: 'PAYMENT_SESSION_ERROR'
      }
    }, 500);
  }
});

// Handle payment webhooks
app.post('/webhook/:provider', async (c) => {
  try {
    const provider = c.req.param('provider');
    const signature = c.req.header('X-Signature') || c.req.header('Authorization');
    const body = await c.req.text();

    // Verify webhook signature
    let isValidSignature = false;
    
    switch (provider) {
      case 'mada':
        isValidSignature = await verifyMadaWebhook(signature, body, c.env.MADA_WEBHOOK_SECRET);
        break;
      case 'stc_pay':
        isValidSignature = await verifySTCWebhook(signature, body, c.env.STC_PAY_WEBHOOK_SECRET);
        break;
      case 'stripe': // For Apple Pay/Google Pay
        isValidSignature = await verifyStripeWebhook(signature, body, c.env.STRIPE_WEBHOOK_SECRET);
        break;
    }

    if (!isValidSignature) {
      return c.json({ success: false, error: 'Invalid signature' }, 401);
    }

    const webhookData = JSON.parse(body);
    
    // Process webhook based on provider and event type
    await processPaymentWebhook(provider, webhookData, c.env);

    return c.json({ success: true });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return c.json({ success: false, error: 'Webhook processing failed' }, 500);
  }
});

// Get payment status
app.get('/status/:sessionId', async (c) => {
  try {
    const sessionId = c.req.param('sessionId');
    const locale = c.get('locale') || 'ar-SA';
    const isArabic = locale === 'ar-SA';

    const sessionData = await c.env.SESSIONS.get(`payment_${sessionId}`);
    
    if (!sessionData) {
      return c.json({
        success: false,
        error: {
          message: isArabic ? 'جلسة الدفع غير موجودة' : 'Payment session not found',
          code: 'SESSION_NOT_FOUND'
        }
      }, 404);
    }

    const session = JSON.parse(sessionData);

    return c.json({
      success: true,
      data: {
        sessionId,
        status: session.status,
        amount: session.amount,
        currency: session.currency,
        paymentMethod: session.paymentMethod,
        createdAt: session.createdAt,
        expiresAt: session.expiresAt
      }
    });

  } catch (error) {
    console.error('Payment status error:', error);
    
    const isArabic = c.get('locale') === 'ar-SA';
    return c.json({
      success: false,
      error: {
        message: isArabic ? 'فشل في جلب حالة الدفع' : 'Failed to get payment status',
        code: 'PAYMENT_STATUS_ERROR'
      }
    }, 500);
  }
});

// ===== PAYMENT PROVIDER INTEGRATIONS =====

// Mada (Saudi debit cards) integration
async function createMadaPayment(sessionData, env) {
  const madaPayload = {
    merchant_id: env.MADA_MERCHANT_ID,
    amount: sessionData.amount * 100, // Convert to halalas (cents)
    currency: 'SAR',
    order_id: sessionData.sessionId,
    description: `Idea to Market - ${sessionData.planType} Plan`,
    return_url: `${env.FRONTEND_URL}/payment/success`,
    cancel_url: `${env.FRONTEND_URL}/payment/cancel`,
    webhook_url: `${env.API_BASE_URL}/api/payments/webhook/mada`,
    customer_info: {
      locale: sessionData.locale
    }
  };

  const response = await fetch(`${env.MADA_API_URL}/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${env.MADA_API_KEY}`,
      'Accept-Language': sessionData.locale === 'ar-SA' ? 'ar' : 'en'
    },
    body: JSON.stringify(madaPayload)
  });

  if (!response.ok) {
    throw new Error(`Mada API error: ${response.status}`);
  }

  const data = await response.json();
  
  return {
    paymentUrl: data.payment_url,
    paymentId: data.payment_id
  };
}

// STC Pay integration
async function createSTCPayment(sessionData, env) {
  const stcPayload = {
    merchant_id: env.STC_PAY_MERCHANT_ID,
    amount: sessionData.amount,
    currency: 'SAR',
    reference_id: sessionData.sessionId,
    description: `من الفكرة إلى السوق - خطة ${sessionData.planType}`,
    success_url: `${env.FRONTEND_URL}/payment/success`,
    cancel_url: `${env.FRONTEND_URL}/payment/cancel`,
    webhook_url: `${env.API_BASE_URL}/api/payments/webhook/stc_pay`,
    mobile_number: sessionData.metadata.mobile // If provided
  };

  const response = await fetch(`${env.STC_PAY_API_URL}/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${env.STC_PAY_API_KEY}`,
      'Accept-Language': 'ar'
    },
    body: JSON.stringify(stcPayload)
  });

  if (!response.ok) {
    throw new Error(`STC Pay API error: ${response.status}`);
  }

  const data = await response.json();
  
  return {
    paymentUrl: data.payment_url,
    qrCode: data.qr_code,
    paymentId: data.payment_id
  };
}

// Apple Pay session creation
async function createApplePaySession(sessionData, env) {
  // Apple Pay validation endpoint
  const applePaySession = {
    countryCode: 'SA',
    currencyCode: 'SAR',
    supportedNetworks: ['visa', 'masterCard', 'mada'],
    merchantCapabilities: ['supports3DS'],
    total: {
      label: `Idea to Market - ${sessionData.planType} Plan`,
      amount: sessionData.amount.toString()
    }
  };

  return {
    applePaySession,
    merchantIdentifier: env.APPLE_PAY_MERCHANT_ID
  };
}

// Google Pay session creation
async function createGooglePaySession(sessionData, env) {
  const googlePaySession = {
    apiVersion: 2,
    apiVersionMinor: 0,
    allowedPaymentMethods: [{
      type: 'CARD',
      parameters: {
        allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
        allowedCardNetworks: ['VISA', 'MASTERCARD']
      }
    }],
    transactionInfo: {
      totalPriceStatus: 'FINAL',
      totalPrice: sessionData.amount.toString(),
      currencyCode: 'SAR',
      countryCode: 'SA'
    },
    merchantInfo: {
      merchantName: 'Idea to Market'
    }
  };

  return {
    googlePaySession
  };
}

// ===== WEBHOOK VERIFICATION =====

async function verifyMadaWebhook(signature, body, secret) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  );

  const signatureBuffer = Uint8Array.from(signature, c => c.charCodeAt(0));
  const bodyBuffer = encoder.encode(body);

  return await crypto.subtle.verify('HMAC', key, signatureBuffer, bodyBuffer);
}

async function verifySTCWebhook(signature, body, secret) {
  // STC Pay signature verification logic
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  );

  const signatureBuffer = Uint8Array.from(atob(signature), c => c.charCodeAt(0));
  const bodyBuffer = encoder.encode(body);

  return await crypto.subtle.verify('HMAC', key, signatureBuffer, bodyBuffer);
}

async function verifyStripeWebhook(signature, body, secret) {
  // Stripe webhook verification for Apple Pay/Google Pay
  const elements = signature.split(',');
  const timestamp = elements.find(el => el.startsWith('t=')).split('=')[1];
  const signatures = elements.filter(el => el.startsWith('v1='));

  const payload = `${timestamp}.${body}`;
  const encoder = new TextEncoder();
  
  for (const sig of signatures) {
    const expectedSig = sig.split('=')[1];
    
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const signatureBuffer = Uint8Array.from(expectedSig, c => c.charCodeAt(0));
    const payloadBuffer = encoder.encode(payload);

    if (await crypto.subtle.verify('HMAC', key, signatureBuffer, payloadBuffer)) {
      return true;
    }
  }
  
  return false;
}

// ===== WEBHOOK PROCESSING =====

async function processPaymentWebhook(provider, webhookData, env) {
  const sessionId = webhookData.order_id || webhookData.reference_id;
  const sessionKey = `payment_${sessionId}`;
  
  const sessionData = await env.SESSIONS.get(sessionKey);
  if (!sessionData) {
    console.error('Payment session not found:', sessionId);
    return;
  }

  const session = JSON.parse(sessionData);
  
  // Update payment status based on webhook
  let status = 'failed';
  
  switch (provider) {
    case 'mada':
      status = webhookData.status === 'completed' ? 'completed' : 'failed';
      break;
    case 'stc_pay':
      status = webhookData.payment_status === 'success' ? 'completed' : 'failed';
      break;
    case 'stripe':
      status = webhookData.type === 'payment_intent.succeeded' ? 'completed' : 'failed';
      break;
  }

  session.status = status;
  session.updatedAt = Date.now();
  session.webhookData = webhookData;

  // Update session
  await env.SESSIONS.put(sessionKey, JSON.stringify(session));

  // If payment successful, activate subscription
  if (status === 'completed') {
    await activateUserSubscription(session.userId, session.planType, env);
  }

  // Track payment completion
  await env.ANALYTICS?.writeDataPoint({
    blobs: [sessionId, 'payment_' + status, provider, session.planType],
    doubles: [Date.now(), session.amount],
    indexes: ['payment_analytics']
  });

  // Add to background queue for further processing
  await env.BACKGROUND_TASKS.send({
    type: 'payment_processed',
    sessionId,
    status,
    provider,
    userId: session.userId,
    planType: session.planType,
    amount: session.amount
  });
}

// ===== SUBSCRIPTION ACTIVATION =====

async function activateUserSubscription(userId, planType, env) {
  const subscriptionData = {
    userId,
    planType,
    status: 'active',
    activatedAt: Date.now(),
    expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 days
    features: getPlanFeatures(planType)
  };

  await env.USER_DATA.put(
    `subscription_${userId}`,
    JSON.stringify(subscriptionData)
  );

  // Update user data
  const userData = await env.USER_DATA.get(`user_${userId}`);
  if (userData) {
    const user = JSON.parse(userData);
    user.subscription = planType;
    user.subscriptionStatus = 'active';
    user.subscriptionActivatedAt = Date.now();
    
    await env.USER_DATA.put(`user_${userId}`, JSON.stringify(user));
  }
}

function getPlanFeatures(planType) {
  const features = {
    free: ['brainstormer', 'limited_prd', 'limited_prototype'],
    starter: ['brainstormer', 'prd_creator', 'basic_prototype', 'export_pdf'],
    professional: ['brainstormer', 'advanced_prd', 'advanced_prototype', 'collaboration', 'priority_support'],
    enterprise: ['all_features', 'white_label', 'api_access', 'dedicated_support', 'custom_integrations']
  };

  return features[planType] || features.free;
}

export { app as paymentRoutes };