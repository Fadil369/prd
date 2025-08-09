import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E Testing Configuration
 * Optimized for Saudi market testing with Arabic RTL support
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }]
  ],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    locale: 'ar-SA',
    timezoneId: 'Asia/Riyadh'
  },

  projects: [
    // Desktop browsers
    {
      name: 'chromium-desktop-ar',
      use: { 
        ...devices['Desktop Chrome'],
        locale: 'ar-SA',
        timezoneId: 'Asia/Riyadh',
        contextOptions: {
          geolocation: { latitude: 24.7136, longitude: 46.6753 }, // Riyadh
          permissions: ['geolocation']
        }
      },
    },
    {
      name: 'chromium-desktop-en',
      use: { 
        ...devices['Desktop Chrome'],
        locale: 'en-US',
        timezoneId: 'Asia/Riyadh'
      },
    },
    {
      name: 'firefox-desktop',
      use: { 
        ...devices['Desktop Firefox'],
        locale: 'ar-SA',
        timezoneId: 'Asia/Riyadh'
      },
    },

    // Mobile devices (popular in Saudi Arabia)
    {
      name: 'mobile-chrome-ar',
      use: { 
        ...devices['Pixel 5'],
        locale: 'ar-SA',
        timezoneId: 'Asia/Riyadh',
        contextOptions: {
          geolocation: { latitude: 24.7136, longitude: 46.6753 },
          permissions: ['geolocation']
        }
      },
    },
    {
      name: 'mobile-safari-ar',
      use: { 
        ...devices['iPhone 14'],
        locale: 'ar-SA',
        timezoneId: 'Asia/Riyadh'
      },
    },

    // iPad (popular in Saudi market)
    {
      name: 'ipad-ar',
      use: { 
        ...devices['iPad Pro'],
        locale: 'ar-SA',
        timezoneId: 'Asia/Riyadh'
      },
    },

    // Edge cases for RTL testing
    {
      name: 'rtl-edge-cases',
      use: {
        ...devices['Desktop Chrome'],
        locale: 'ar-SA',
        timezoneId: 'Asia/Riyadh',
        viewport: { width: 1200, height: 800 },
        hasTouch: false
      }
    }
  ],

  webServer: process.env.CI ? undefined : {
    command: 'npm run preview',
    port: 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000
  }
});