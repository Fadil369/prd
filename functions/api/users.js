/**
 * User Management API Routes
 * Handles user profile, subscription, and usage data
 */

import { Hono } from 'hono';

const app = new Hono();

// Get user profile
app.get('/profile', async (c) => {
  try {
    const userId = c.get('jwtPayload')?.sub;
    const locale = c.get('locale') || 'ar-SA';
    const isArabic = locale === 'ar-SA';

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

    return c.json({
      success: true,
      data: {
        user: {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          phone: userData.phone,
          locale: userData.locale,
          subscription: userData.subscription,
          subscriptionStatus: userData.subscriptionStatus,
          trialDaysLeft: userData.trialDaysLeft,
          isTrialActive: userData.isTrialActive,
          features: userData.features,
          usage: userData.usage,
          preferences: userData.preferences,
          createdAt: userData.createdAt,
          lastLoginAt: userData.lastLoginAt
        }
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    
    const isArabic = c.get('locale') === 'ar-SA';
    return c.json({
      success: false,
      error: {
        message: isArabic ? 'فشل في جلب بيانات المستخدم' : 'Failed to get user profile',
        code: 'PROFILE_ERROR'
      }
    }, 500);
  }
});

// Update user profile
app.put('/profile', async (c) => {
  try {
    const userId = c.get('jwtPayload')?.sub;
    const { name, phone, preferences } = await c.req.json();
    const locale = c.get('locale') || 'ar-SA';
    const isArabic = locale === 'ar-SA';

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

    // Update fields
    if (name) userData.name = name;
    if (phone) {
      if (!validateSaudiPhone(phone)) {
        return c.json({
          success: false,
          error: {
            message: isArabic ? 'رقم الهاتف السعودي غير صحيح' : 'Invalid Saudi phone number',
            code: 'INVALID_PHONE'
          }
        }, 400);
      }
      userData.phone = phone;
    }
    if (preferences) {
      userData.preferences = { ...userData.preferences, ...preferences };
    }

    userData.updatedAt = Date.now();

    await c.env.USER_DATA.put(`user_${userId}`, JSON.stringify(userData));

    return c.json({
      success: true,
      data: {
        message: isArabic ? 'تم تحديث الملف الشخصي بنجاح' : 'Profile updated successfully'
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    
    const isArabic = c.get('locale') === 'ar-SA';
    return c.json({
      success: false,
      error: {
        message: isArabic ? 'فشل في تحديث الملف الشخصي' : 'Failed to update profile',
        code: 'UPDATE_PROFILE_ERROR'
      }
    }, 500);
  }
});

// Get user usage statistics
app.get('/usage', async (c) => {
  try {
    const userId = c.get('jwtPayload')?.sub;
    const locale = c.get('locale') || 'ar-SA';

    const userDataString = await c.env.USER_DATA.get(`user_${userId}`);
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
        usage: userData.usage,
        subscription: userData.subscription,
        features: userData.features,
        limits: getPlanLimits(userData.subscription)
      }
    });

  } catch (error) {
    console.error('Get usage error:', error);
    
    return c.json({
      success: false,
      error: { message: 'Failed to get usage data', code: 'USAGE_ERROR' }
    }, 500);
  }
});

function validateSaudiPhone(phone) {
  const saudiPhoneRegex = /^(\+966|0)?5[0-9]{8}$/;
  return saudiPhoneRegex.test(phone.replace(/\s/g, ''));
}

function getPlanLimits(subscription) {
  const limits = {
    free: {
      brainstormSessions: 3,
      prdDocuments: 1,
      prototypesGenerated: 1
    },
    starter: {
      brainstormSessions: 20,
      prdDocuments: 10,
      prototypesGenerated: 5
    },
    professional: {
      brainstormSessions: 100,
      prdDocuments: 50,
      prototypesGenerated: 25
    },
    enterprise: {
      brainstormSessions: -1, // unlimited
      prdDocuments: -1,
      prototypesGenerated: -1
    }
  };

  return limits[subscription] || limits.free;
}

export { app as userRoutes };