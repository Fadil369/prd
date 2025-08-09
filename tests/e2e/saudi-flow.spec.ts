import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Saudi Market User Flow
 * Tests the complete idea-to-market journey in Arabic and English
 */

test.describe('Saudi Market User Journey', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display Arabic interface by default', async ({ page }) => {
    // Check Arabic title
    await expect(page).toHaveTitle(/من الفكرة إلى السوق/);
    
    // Check RTL direction
    const html = page.locator('html');
    await expect(html).toHaveAttribute('dir', 'rtl');
    await expect(html).toHaveAttribute('lang', 'ar');
    
    // Check Arabic text content
    await expect(page.locator('text=من الفكرة إلى السوق')).toBeVisible();
    await expect(page.locator('text=مدعوم بـ Claude AI')).toBeVisible();
  });

  test('should switch to English interface', async ({ page }) => {
    // Click language toggle
    await page.click('[title="Language"]');
    
    // Check English content
    await expect(page.locator('text=Idea to Market')).toBeVisible();
    await expect(page.locator('text=Powered by Claude AI')).toBeVisible();
    
    // Check LTR direction
    const html = page.locator('html');
    await expect(html).toHaveAttribute('dir', 'ltr');
    await expect(html).toHaveAttribute('lang', 'en');
  });

  test('should complete brainstorming flow in Arabic', async ({ page }) => {
    // Wait for app to load
    await page.waitForLoadState('networkidle');
    
    // Skip onboarding/landing and go to brainstorming
    const startButton = page.locator('text=ابدأ رحلتك').first();
    if (await startButton.isVisible()) {
      await startButton.click();
    }
    
    // Fill brainstorming form
    await page.fill('[placeholder*="فكرة العمل"]', 'تطبيق توصيل طعام صحي للعائلات السعودية');
    await page.fill('[placeholder*="السوق المستهدف"]', 'العائلات السعودية في الرياض وجدة والدمام');
    await page.fill('[placeholder*="القيمة الفريدة"]', 'طعام صحي محضر من مكونات محلية مع توصيل سريع');
    await page.fill('[placeholder*="نموذج العمل"]', 'اشتراك شهري مع خيارات دفع متنوعة');
    await page.fill('[placeholder*="الميزة التنافسية"]', 'شراكة مع المزارعين المحليين ودعم رؤية 2030');
    
    // Click generate ideas button
    await page.click('text=إنشاء الأفكار');
    
    // Wait for AI response
    await expect(page.locator('[data-testid="generated-ideas"]')).toBeVisible({ timeout: 30000 });
    
    // Check Arabic content in response
    const generatedContent = page.locator('[data-testid="generated-ideas"]');
    await expect(generatedContent).toContainText('تحليل');
  });

  test('should handle payment flow with Saudi methods', async ({ page }) => {
    // Navigate to pricing
    await page.click('text=الأسعار');
    
    // Select Professional plan
    await page.click('[data-plan="professional"]');
    
    // Should show Saudi payment methods
    await expect(page.locator('text=مدى')).toBeVisible();
    await expect(page.locator('text=STC Pay')).toBeVisible();
    await expect(page.locator('text=Apple Pay')).toBeVisible();
    
    // Check SAR currency
    await expect(page.locator('text=299 ريال')).toBeVisible();
    await expect(page.locator('text=شهرياً')).toBeVisible();
  });

  test('should display correct Saudi cultural elements', async ({ page }) => {
    // Check Vision 2030 reference
    await expect(page.locator('text=رؤية 2030')).toBeVisible();
    
    // Check Saudi colors (green)
    const heroSection = page.locator('[data-testid="hero-section"]');
    const bgColor = await heroSection.evaluate(el => getComputedStyle(el).backgroundColor);
    expect(bgColor).toContain('rgb(5, 150, 105)'); // Saudi green
    
    // Check Arabic fonts
    const arabicText = page.locator('text=من الفكرة إلى السوق');
    const fontFamily = await arabicText.evaluate(el => getComputedStyle(el).fontFamily);
    expect(fontFamily).toContain('Cairo');
  });

  test('should work offline (PWA)', async ({ page, context }) => {
    // Go online first
    await context.setOffline(false);
    await page.reload();
    
    // Go offline
    await context.setOffline(true);
    
    // Check offline indicator
    await expect(page.locator('[data-testid="offline-indicator"]')).toBeVisible();
    
    // Basic functionality should still work
    await expect(page.locator('text=من الفكرة إلى السوق')).toBeVisible();
  });

  test('should handle mobile touch gestures', async ({ page }) => {
    // Test swipe navigation on mobile
    if (page.viewportSize()?.width && page.viewportSize()!.width < 768) {
      // Simulate swipe right to go to next step
      await page.touchscreen.tap(100, 300);
      await page.mouse.down();
      await page.mouse.move(300, 300);
      await page.mouse.up();
      
      // Should advance to next step
      await expect(page.locator('[data-step="2"]')).toBeVisible();
    }
  });
});

test.describe('Performance and Accessibility', () => {
  test('should meet Saudi accessibility standards', async ({ page }) => {
    // Check skip link for screen readers
    await expect(page.locator('text=انتقل إلى المحتوى الرئيسي')).toBeVisible();
    
    // Check ARIA labels in Arabic
    const menuButton = page.locator('[aria-label*="قائمة"]');
    if (await menuButton.count() > 0) {
      await expect(menuButton).toBeVisible();
    }
    
    // Check color contrast (basic test)
    const primaryButton = page.locator('[data-testid="primary-button"]').first();
    if (await primaryButton.count() > 0) {
      const styles = await primaryButton.evaluate(el => {
        const computed = getComputedStyle(el);
        return {
          color: computed.color,
          backgroundColor: computed.backgroundColor
        };
      });
      // Basic contrast check (should be implemented with proper contrast calculation)
      expect(styles.color).toBeTruthy();
      expect(styles.backgroundColor).toBeTruthy();
    }
  });

  test('should load quickly on Saudi network conditions', async ({ page }) => {
    // Simulate slower Saudi internet speeds
    await page.context().route('**/*', async route => {
      await new Promise(resolve => setTimeout(resolve, 100)); // Add 100ms delay
      await route.continue();
    });
    
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    // Should load within 5 seconds even with simulated delay
    expect(loadTime).toBeLessThan(5000);
  });
});

test.describe('Saudi-specific Features', () => {
  test('should display Saudi Riyadh time', async ({ page }) => {
    // Check if time display shows Saudi timezone
    const timeElement = page.locator('[data-testid="saudi-time"]');
    if (await timeElement.count() > 0) {
      const timeText = await timeElement.textContent();
      // Should be in Arabic numerals or show timezone
      expect(timeText).toBeTruthy();
    }
  });

  test('should handle Arabic number formatting', async ({ page }) => {
    // Navigate to pricing
    await page.click('text=الأسعار');
    
    // Check if numbers are formatted correctly for Arabic locale
    const priceElement = page.locator('[data-testid="price-sar"]').first();
    if (await priceElement.count() > 0) {
      const priceText = await priceElement.textContent();
      // Should contain SAR currency and proper formatting
      expect(priceText).toContain('ريال');
    }
  });

  test('should integrate with WhatsApp sharing', async ({ page }) => {
    // Check if WhatsApp sharing is available
    const whatsappButton = page.locator('[data-testid="whatsapp-share"]');
    if (await whatsappButton.count() > 0) {
      const href = await whatsappButton.getAttribute('href');
      expect(href).toContain('whatsapp.com');
      expect(href).toContain('text='); // Should contain pre-filled Arabic text
    }
  });
});