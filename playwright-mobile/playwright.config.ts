import { defineConfig, devices } from '@playwright/test';

/**
 * Device emulation: each project gives the page a phone's screen size, pixel ratio, user agent and touch.
 * It's fast and runs anywhere, but it's still desktop Chrome underneath. For a real phone browser, see ../appium.
 *
 * iPhone profiles normally use WebKit (Safari's engine). We run them in Chromium so CI only needs one browser;
 * set WEBKIT=1 (after `npx playwright install webkit`) to use the real Safari engine.
 */
const { defaultBrowserType: _a, ...pixel } = devices['Pixel 7'];
const { defaultBrowserType: _b, ...iphone } = devices['iPhone 14'];

export default defineConfig({
  testDir: './specs',
  timeout: 30_000,
  workers: process.env.LAB_URL?.includes('localhost') ? undefined : 2,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }], ['allure-playwright', { resultsDir: 'allure-results' }]],
  use: {
    baseURL: process.env.LAB_URL || 'https://www.dhanoapartners.com',
    trace: 'retain-on-failure',
    launchOptions: process.env.PW_CHROMIUM_PATH ? { executablePath: process.env.PW_CHROMIUM_PATH } : {},
  },
  projects: [
    { name: 'pixel-7', use: { ...pixel, browserName: 'chromium' } },
    { name: 'iphone-14', use: { ...iphone, browserName: process.env.WEBKIT ? 'webkit' : 'chromium' } },
  ],
});
