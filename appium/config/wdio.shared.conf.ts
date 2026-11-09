/**
 * Settings shared by every target (mobile website, Android app, iOS app).
 * Each target's config adds its own capabilities and specs.
 */
export const shared: Omit<WebdriverIO.Config, 'capabilities'> = {
  runner: 'local',
  maxInstances: 1,
  logLevel: 'warn',
  waitforTimeout: 20_000,
  // The first iOS session builds WebDriverAgent, which can take several minutes.
  connectionRetryTimeout: 600_000,
  connectionRetryCount: 1,
  services: [['appium', {
    args: { allowInsecure: 'uiautomator2:chromedriver_autodownload' },
    logPath: './logs',
  }]],
  framework: 'mocha',
  reporters: ['spec', ['allure', { outputDir: 'allure-results', disableWebdriverStepsReporting: true }]],
  mochaOpts: { ui: 'bdd', timeout: 180_000 },
  // Attach a screenshot to the Allure report when a test fails.
  afterTest: async function (_test, _context, { passed }) {
    if (!passed) await browser.takeScreenshot();
  },
};
