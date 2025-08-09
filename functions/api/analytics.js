/**
 * Analytics API Routes
 * Handles custom analytics tracking for Saudi market insights
 */

import { Hono } from 'hono';

const app = new Hono();

// Track custom event
app.post('/track', async (c) => {
  try {
    const { event, properties = {} } = await c.req.json();
    const userId = c.get('jwtPayload')?.sub;
    const locale = c.get('locale') || 'ar-SA';

    if (!event) {
      return c.json({
        success: false,
        error: { message: 'Event name is required', code: 'MISSING_EVENT' }
      }, 400);
    }

    // Enhanced properties with Saudi context
    const trackingData = {
      event,
      userId: userId || 'anonymous',
      timestamp: Date.now(),
      properties: {
        ...properties,
        locale,
        timezone: 'Asia/Riyadh',
        currency: 'SAR',
        country: c.req.header('CF-IPCountry'),
        region: c.req.header('CF-Ray')?.split('-')[1],
        userAgent: c.req.header('User-Agent'),
        ip: c.req.header('CF-Connecting-IP')
      },
      session: {
        referrer: c.req.header('Referer'),
        sessionId: c.req.header('X-Session-ID'),
        pageUrl: properties.pageUrl
      }
    };

    // Store in Analytics Engine
    await c.env.ANALYTICS?.writeDataPoint({
      blobs: [
        c.req.header('CF-Ray'),
        event,
        userId || 'anonymous',
        locale,
        JSON.stringify(properties)
      ],
      doubles: [
        Date.now(),
        properties.value || 0,
        properties.duration || 0
      ],
      indexes: [
        'custom_events',
        `event_${event}`,
        `user_${userId || 'anonymous'}`,
        `locale_${locale}`
      ]
    });

    return c.json({ success: true });

  } catch (error) {
    console.error('Analytics tracking error:', error);
    return c.json({
      success: false,
      error: { message: 'Failed to track event', code: 'TRACKING_ERROR' }
    }, 500);
  }
});

// Get user analytics dashboard
app.get('/dashboard', async (c) => {
  try {
    const userId = c.get('jwtPayload')?.sub;
    const locale = c.get('locale') || 'ar-SA';
    const isArabic = locale === 'ar-SA';

    if (!userId) {
      return c.json({
        success: false,
        error: { message: 'Authentication required', code: 'AUTH_REQUIRED' }
      }, 401);
    }

    // Get user data for usage stats
    const userDataString = await c.env.USER_DATA.get(`user_${userId}`);
    if (!userDataString) {
      return c.json({
        success: false,
        error: { message: 'User not found', code: 'USER_NOT_FOUND' }
      }, 404);
    }

    const userData = JSON.parse(userDataString);

    // Prepare dashboard data
    const dashboardData = {
      usage: userData.usage,
      subscription: {
        plan: userData.subscription,
        status: userData.subscriptionStatus,
        trialDaysLeft: userData.trialDaysLeft,
        isTrialActive: userData.isTrialActive
      },
      statistics: {
        accountAge: Math.floor((Date.now() - userData.createdAt) / (1000 * 60 * 60 * 24)), // days
        lastLogin: userData.lastLoginAt,
        totalSessions: userData.usage.brainstormSessions + userData.usage.prdDocuments + userData.usage.prototypesGenerated
      },
      achievements: calculateUserAchievements(userData),
      recommendations: generateUserRecommendations(userData, isArabic)
    };

    return c.json({
      success: true,
      data: dashboardData
    });

  } catch (error) {
    console.error('Dashboard analytics error:', error);
    
    const isArabic = c.get('locale') === 'ar-SA';
    return c.json({
      success: false,
      error: {
        message: isArabic ? 'فشل في جلب بيانات لوحة التحكم' : 'Failed to get dashboard data',
        code: 'DASHBOARD_ERROR'
      }
    }, 500);
  }
});

function calculateUserAchievements(userData) {
  const achievements = [];
  
  // First idea achievement
  if (userData.usage.brainstormSessions >= 1) {
    achievements.push({
      id: 'first_idea',
      nameAr: 'أول فكرة',
      nameEn: 'First Idea',
      descriptionAr: 'تم إنشاء أول فكرة تجارية',
      descriptionEn: 'Created your first business idea',
      icon: '💡',
      unlockedAt: userData.createdAt
    });
  }

  // PRD Master achievement
  if (userData.usage.prdDocuments >= 5) {
    achievements.push({
      id: 'prd_master',
      nameAr: 'خبير مستندات المتطلبات',
      nameEn: 'PRD Master',
      descriptionAr: 'أنشأت 5 مستندات متطلبات منتج',
      descriptionEn: 'Created 5 product requirement documents',
      icon: '📋',
      unlockedAt: Date.now()
    });
  }

  // Prototype Pioneer achievement
  if (userData.usage.prototypesGenerated >= 3) {
    achievements.push({
      id: 'prototype_pioneer',
      nameAr: 'رائد النماذج الأولية',
      nameEn: 'Prototype Pioneer',
      descriptionAr: 'أنشأت 3 نماذج أولية',
      descriptionEn: 'Created 3 prototypes',
      icon: '🚀',
      unlockedAt: Date.now()
    });
  }

  return achievements;
}

function generateUserRecommendations(userData, isArabic) {
  const recommendations = [];

  // Usage-based recommendations
  if (userData.usage.brainstormSessions === 0) {
    recommendations.push({
      type: 'action',
      titleAr: 'ابدأ رحلتك في ريادة الأعمال',
      titleEn: 'Start Your Entrepreneurship Journey',
      descriptionAr: 'جرب أداة عصف الأفكار لتوليد أفكار تجارية مبتكرة',
      descriptionEn: 'Try the brainstorming tool to generate innovative business ideas',
      action: 'brainstorm',
      priority: 'high'
    });
  }

  if (userData.usage.brainstormSessions > 0 && userData.usage.prdDocuments === 0) {
    recommendations.push({
      type: 'action',
      titleAr: 'حوّل فكرتك إلى مستند احترافي',
      titleEn: 'Turn Your Idea Into a Professional Document',
      descriptionAr: 'استخدم منشئ مستندات متطلبات المنتج لتطوير فكرتك',
      descriptionEn: 'Use the PRD creator to develop your idea further',
      action: 'create-prd',
      priority: 'high'
    });
  }

  // Subscription recommendations
  if (userData.subscription === 'free' && userData.usage.brainstormSessions >= 2) {
    recommendations.push({
      type: 'upgrade',
      titleAr: 'ارتقِ إلى الخطة المدفوعة',
      titleEn: 'Upgrade to Premium Plan',
      descriptionAr: 'احصل على مزيد من المشاريع والميزات المتقدمة',
      descriptionEn: 'Get more projects and advanced features',
      action: 'upgrade',
      priority: 'medium'
    });
  }

  return recommendations;
}

export { app as analyticsRoutes };