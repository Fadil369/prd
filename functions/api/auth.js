/**
 * Authentication API Routes for Idea to Market Platform
 * Handles user registration, login, and session management
 */

import { Hono } from 'hono';
import { sign, verify } from 'hono/jwt';

const app = new Hono();

// ===== USER AUTHENTICATION =====

// User registration
app.post('/register', async (c) => {
  try {
    const { email, name, phone, password, locale = 'ar-SA' } = await c.req.json();
    const isArabic = locale === 'ar-SA';

    // Validate required fields
    if (!email || !name || !password) {
      return c.json({
        success: false,
        error: {
          message: isArabic ? 'البريد الإلكتروني والاسم وكلمة المرور مطلوبة' : 'Email, name and password are required',
          code: 'MISSING_FIELDS'
        }
      }, 400);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return c.json({
        success: false,
        error: {
          message: isArabic ? 'تنسيق البريد الإلكتروني غير صحيح' : 'Invalid email format',
          code: 'INVALID_EMAIL'
        }
      }, 400);
    }

    // Validate Saudi phone number if provided
    if (phone && !validateSaudiPhone(phone)) {
      return c.json({
        success: false,
        error: {
          message: isArabic ? 'رقم الهاتف السعودي غير صحيح' : 'Invalid Saudi phone number',
          code: 'INVALID_PHONE'
        }
      }, 400);
    }

    // Check if user already exists
    const existingUser = await c.env.USER_DATA.get(`user_email_${email}`);
    if (existingUser) {
      return c.json({
        success: false,
        error: {
          message: isArabic ? 'البريد الإلكتروني مستخدم بالفعل' : 'Email already registered',
          code: 'EMAIL_EXISTS'
        }
      }, 400);
    }

    // Hash password
    const hashedPassword = await hashPassword(password);
    
    // Create user
    const userId = crypto.randomUUID();
    const now = Date.now();
    
    const userData = {
      id: userId,
      email: email.toLowerCase(),
      name,
      phone,
      locale,
      subscription: 'free',
      subscriptionStatus: 'active',
      trialDaysLeft: 1, // 1 hour trial
      isTrialActive: true,
      createdAt: now,
      updatedAt: now,
      lastLoginAt: null,
      isEmailVerified: false,
      features: ['brainstormer', 'limited_prd', 'limited_prototype'],
      usage: {
        brainstormSessions: 0,
        prdDocuments: 0,
        prototypesGenerated: 0
      },
      preferences: {
        language: locale,
        timezone: 'Asia/Riyadh',
        currency: 'SAR',
        notifications: true
      }
    };

    // Store user data
    await c.env.USER_DATA.put(`user_${userId}`, JSON.stringify(userData));
    await c.env.USER_DATA.put(`user_email_${email.toLowerCase()}`, userId);

    // Generate JWT token
    const token = await sign({
      sub: userId,
      email: email.toLowerCase(),
      name,
      subscription: 'free',
      locale,
      iat: Math.floor(now / 1000),
      exp: Math.floor((now + 24 * 60 * 60 * 1000) / 1000) // 24 hours
    }, c.env.JWT_SECRET || 'your-secret-key');

    // Track registration
    await c.env.ANALYTICS?.writeDataPoint({
      blobs: [c.req.header('CF-Ray'), 'user_registered', locale],
      doubles: [now],
      indexes: ['user_analytics']
    });

    // Set auth cookie
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: 'Lax',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/'
    };

    return c.json({
      success: true,
      data: {
        user: {
          id: userId,
          email: email.toLowerCase(),
          name,
          locale,
          subscription: 'free',
          trialDaysLeft: 1,
          isTrialActive: true
        },
        token
      }
    }, 200, {
      'Set-Cookie': `auth-token=${token}; ${Object.entries(cookieOptions).map(([k,v]) => `${k}=${v}`).join('; ')}`
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    const isArabic = c.get('locale') === 'ar-SA';
    return c.json({
      success: false,
      error: {
        message: isArabic ? 'فشل في إنشاء الحساب' : 'Failed to create account',
        code: 'REGISTRATION_ERROR'
      }
    }, 500);
  }
});

// User login
app.post('/login', async (c) => {
  try {
    const { email, password } = await c.req.json();
    const locale = c.get('locale') || 'ar-SA';
    const isArabic = locale === 'ar-SA';

    if (!email || !password) {
      return c.json({
        success: false,
        error: {
          message: isArabic ? 'البريد الإلكتروني وكلمة المرور مطلوبان' : 'Email and password are required',
          code: 'MISSING_CREDENTIALS'
        }
      }, 400);
    }

    // Get user ID from email
    const userId = await c.env.USER_DATA.get(`user_email_${email.toLowerCase()}`);
    if (!userId) {
      return c.json({
        success: false,
        error: {
          message: isArabic ? 'بيانات الدخول غير صحيحة' : 'Invalid credentials',
          code: 'INVALID_CREDENTIALS'
        }
      }, 401);
    }

    // Get user data
    const userDataString = await c.env.USER_DATA.get(`user_${userId}`);
    if (!userDataString) {
      return c.json({
        success: false,
        error: {
          message: isArabic ? 'المستخدم غير موجود' : 'User not found',
          code: 'USER_NOT_FOUND'
        }
      }, 404);
    }

    const userData = JSON.parse(userDataString);

    // Verify password
    const isValidPassword = await verifyPassword(password, userData.hashedPassword);
    if (!isValidPassword) {
      return c.json({
        success: false,
        error: {
          message: isArabic ? 'بيانات الدخول غير صحيحة' : 'Invalid credentials',
          code: 'INVALID_CREDENTIALS'
        }
      }, 401);
    }

    // Update last login
    userData.lastLoginAt = Date.now();
    userData.updatedAt = Date.now();
    await c.env.USER_DATA.put(`user_${userId}`, JSON.stringify(userData));

    // Generate JWT token
    const now = Date.now();
    const token = await sign({
      sub: userId,
      email: userData.email,
      name: userData.name,
      subscription: userData.subscription,
      locale: userData.locale,
      iat: Math.floor(now / 1000),
      exp: Math.floor((now + 24 * 60 * 60 * 1000) / 1000) // 24 hours
    }, c.env.JWT_SECRET || 'your-secret-key');

    // Track login
    await c.env.ANALYTICS?.writeDataPoint({
      blobs: [c.req.header('CF-Ray'), 'user_login', userData.locale],
      doubles: [now],
      indexes: ['user_analytics']
    });

    return c.json({
      success: true,
      data: {
        user: {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          locale: userData.locale,
          subscription: userData.subscription,
          subscriptionStatus: userData.subscriptionStatus,
          trialDaysLeft: userData.trialDaysLeft,
          isTrialActive: userData.isTrialActive,
          features: userData.features
        },
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    
    const isArabic = c.get('locale') === 'ar-SA';
    return c.json({
      success: false,
      error: {
        message: isArabic ? 'فشل في تسجيل الدخول' : 'Login failed',
        code: 'LOGIN_ERROR'
      }
    }, 500);
  }
});

// Logout
app.post('/logout', async (c) => {
  const locale = c.get('locale') || 'ar-SA';
  const isArabic = locale === 'ar-SA';

  return c.json({
    success: true,
    message: isArabic ? 'تم تسجيل الخروج بنجاح' : 'Logged out successfully'
  }, 200, {
    'Set-Cookie': 'auth-token=; HttpOnly; Secure; SameSite=Lax; Max-Age=0; Path=/'
  });
});

// Refresh token
app.post('/refresh', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const token = authHeader?.replace('Bearer ', '') || c.req.cookie('auth-token');
    
    if (!token) {
      return c.json({
        success: false,
        error: { message: 'No token provided', code: 'NO_TOKEN' }
      }, 401);
    }

    // Verify existing token
    const payload = await verify(token, c.env.JWT_SECRET || 'your-secret-key');
    
    // Get current user data
    const userDataString = await c.env.USER_DATA.get(`user_${payload.sub}`);
    if (!userDataString) {
      return c.json({
        success: false,
        error: { message: 'User not found', code: 'USER_NOT_FOUND' }
      }, 404);
    }

    const userData = JSON.parse(userDataString);

    // Generate new token
    const now = Date.now();
    const newToken = await sign({
      sub: userData.id,
      email: userData.email,
      name: userData.name,
      subscription: userData.subscription,
      locale: userData.locale,
      iat: Math.floor(now / 1000),
      exp: Math.floor((now + 24 * 60 * 60 * 1000) / 1000) // 24 hours
    }, c.env.JWT_SECRET || 'your-secret-key');

    return c.json({
      success: true,
      data: { token: newToken }
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    
    return c.json({
      success: false,
      error: { message: 'Token refresh failed', code: 'REFRESH_ERROR' }
    }, 401);
  }
});

// Verify token
app.get('/verify', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const token = authHeader?.replace('Bearer ', '') || c.req.cookie('auth-token');
    
    if (!token) {
      return c.json({
        success: false,
        error: { message: 'No token provided', code: 'NO_TOKEN' }
      }, 401);
    }

    const payload = await verify(token, c.env.JWT_SECRET || 'your-secret-key');
    
    // Get current user data
    const userDataString = await c.env.USER_DATA.get(`user_${payload.sub}`);
    if (!userDataString) {
      return c.json({
        success: false,
        error: { message: 'User not found', code: 'USER_NOT_FOUND' }
      }, 404);
    }

    const userData = JSON.parse(userDataString);

    return c.json({
      success: true,
      data: {
        user: {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          locale: userData.locale,
          subscription: userData.subscription,
          subscriptionStatus: userData.subscriptionStatus,
          trialDaysLeft: userData.trialDaysLeft,
          isTrialActive: userData.isTrialActive,
          features: userData.features
        },
        isValid: true
      }
    });

  } catch (error) {
    console.error('Token verification error:', error);
    
    return c.json({
      success: false,
      error: { message: 'Invalid token', code: 'INVALID_TOKEN' }
    }, 401);
  }
});

// ===== UTILITY FUNCTIONS =====

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'saudi_salt_2024'); // Add salt
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function verifyPassword(password, hashedPassword) {
  const hashedInput = await hashPassword(password);
  return hashedInput === hashedPassword;
}

function validateSaudiPhone(phone) {
  // Saudi phone format: +966XXXXXXXXX or 05XXXXXXXX
  const saudiPhoneRegex = /^(\+966|0)?5[0-9]{8}$/;
  return saudiPhoneRegex.test(phone.replace(/\s/g, ''));
}

export { app as authRoutes };