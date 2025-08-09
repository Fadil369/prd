/**
 * Cloudflare Worker for Idea to Market Saudi Platform
 * Main edge function handling API routes, authentication, and middleware
 */

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { secureHeaders } from 'hono/secure-headers';
import { jwt } from 'hono/jwt';
import { rateLimiter } from 'hono/rate-limiter';

// Import route handlers
import { authRoutes } from './api/auth';
import { claudeRoutes } from './api/claude';
import { paymentRoutes } from './api/payments';
import { userRoutes } from './api/users';
import { analyticsRoutes } from './api/analytics';
import { collaborationRoutes } from './api/collaboration';

const app = new Hono();

// ===== MIDDLEWARE =====

// Security headers
app.use('*', secureHeaders({
  contentSecurityPolicy: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'", "https://www.googletagmanager.com"],
    styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    fontSrc: ["'self'", "https://fonts.gstatic.com"],
    imgSrc: ["'self'", "data:", "https:"],
    connectSrc: ["'self'", "https://api.anthropic.com", "https://api.idea-to-market.sa"],
    frameSrc: ["'none'"],
    objectSrc: ["'none'"],
    upgradeInsecureRequests: true
  },
  crossOriginEmbedderPolicy: false
}));

// CORS configuration for Saudi domain
app.use('*', cors({
  origin: (origin) => {
    const allowedOrigins = [
      'https://idea-to-market.sa',
      'https://www.idea-to-market.sa',
      'https://dev.idea-to-market.sa',
      'https://staging.idea-to-market.sa'
    ];
    return allowedOrigins.includes(origin) || origin?.endsWith('.pages.dev');
  },
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept-Language'],
  credentials: true,
  maxAge: 86400
}));

// Request logging
app.use('*', logger());

// Pretty JSON responses in development
app.use('*', prettyJSON());

// Rate limiting
app.use('/api/*', rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // requests per window
  keyGenerator: (c) => {
    return c.req.header('CF-Connecting-IP') || c.req.header('X-Forwarded-For') || 'anonymous';
  },
  skip: (c) => {
    // Skip rate limiting for Saudi IP ranges (optional)
    const ip = c.req.header('CF-Connecting-IP');
    const country = c.req.header('CF-IPCountry');
    return country === 'SA' && c.req.header('Authorization');
  }
}));

// ===== HEALTH CHECK =====
app.get('/health', (c) => {
  return c.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: c.env.ENVIRONMENT || 'development',
    region: c.req.header('CF-Ray')?.split('-')[1] || 'unknown',
    version: '1.0.0'
  });
});

// ===== API ROUTES =====

// Authentication routes (no JWT required)
app.route('/api/auth', authRoutes);

// Protected API routes (JWT required)
app.use('/api/users/*', jwt({
  secret: async (c) => c.env.JWT_SECRET || 'your-secret-key',
  cookie: 'auth-token'
}));

app.use('/api/claude/*', jwt({
  secret: async (c) => c.env.JWT_SECRET || 'your-secret-key',
  cookie: 'auth-token'
}));

app.use('/api/payments/*', jwt({
  secret: async (c) => c.env.JWT_SECRET || 'your-secret-key',
  cookie: 'auth-token'
}));

// Mount protected routes
app.route('/api/users', userRoutes);
app.route('/api/claude', claudeRoutes);
app.route('/api/payments', paymentRoutes);
app.route('/api/analytics', analyticsRoutes);
app.route('/api/collaboration', collaborationRoutes);

// ===== MIDDLEWARE FUNCTIONS =====

// Saudi-specific middleware
app.use('/api/*', async (c, next) => {
  // Add Saudi timezone
  c.set('timezone', 'Asia/Riyadh');
  
  // Add Saudi locale
  const acceptLanguage = c.req.header('Accept-Language') || 'ar-SA,ar;q=0.9,en;q=0.8';
  c.set('locale', acceptLanguage.includes('ar') ? 'ar-SA' : 'en-US');
  
  // Add Saudi currency
  c.set('currency', 'SAR');
  
  await next();
});

// Error handling
app.onError((err, c) => {
  console.error('Worker Error:', err);
  
  // Track error in analytics
  c.env.ANALYTICS?.writeDataPoint({
    blobs: [c.req.header('CF-Ray'), err.message],
    doubles: [Date.now()],
    indexes: ['error']
  });
  
  const isArabic = c.get('locale') === 'ar-SA';
  
  return c.json({
    success: false,
    error: {
      message: isArabic ? 'حدث خطأ في الخادم' : 'Internal server error',
      code: 'INTERNAL_ERROR',
      timestamp: new Date().toISOString()
    }
  }, 500);
});

// 404 handler
app.notFound((c) => {
  const isArabic = c.get('locale') === 'ar-SA';
  
  return c.json({
    success: false,
    error: {
      message: isArabic ? 'الصفحة غير موجودة' : 'Route not found',
      code: 'NOT_FOUND',
      timestamp: new Date().toISOString()
    }
  }, 404);
});

// ===== UTILITY FUNCTIONS =====

// Generate user session
async function createSession(userId, env) {
  const sessionId = crypto.randomUUID();
  const sessionData = {
    userId,
    createdAt: Date.now(),
    expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
    locale: 'ar-SA',
    timezone: 'Asia/Riyadh'
  };
  
  await env.SESSIONS.put(sessionId, JSON.stringify(sessionData), {
    expirationTtl: 24 * 60 * 60 // 24 hours
  });
  
  return sessionId;
}

// Validate Saudi phone number
function validateSaudiPhone(phone) {
  // Saudi phone format: +966XXXXXXXXX or 05XXXXXXXX
  const saudiPhoneRegex = /^(\+966|0)?5[0-9]{8}$/;
  return saudiPhoneRegex.test(phone.replace(/\s/g, ''));
}

// Format Saudi currency
function formatSaudiCurrency(amount) {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR',
    minimumFractionDigits: 2
  }).format(amount);
}

// ===== EXPORT WORKER =====
export default {
  async fetch(request, env, ctx) {
    return app.fetch(request, env, ctx);
  },
  
  async scheduled(controller, env, ctx) {
    // Cron job for cleanup and maintenance
    console.log('Running scheduled task:', controller.cron);
    
    // Clean expired sessions
    // Implementation would depend on KV listing capabilities
    
    // Generate analytics reports
    // Send daily/weekly reports to admin
  },
  
  async queue(batch, env) {
    // Handle background queue tasks
    for (const message of batch.messages) {
      try {
        const task = message.body;
        
        switch (task.type) {
          case 'send_email':
            // Handle email sending
            break;
          case 'process_payment':
            // Handle payment processing
            break;
          case 'generate_report':
            // Handle report generation
            break;
          default:
            console.log('Unknown task type:', task.type);
        }
        
        message.ack();
      } catch (error) {
        console.error('Queue processing error:', error);
        message.retry();
      }
    }
  }
};