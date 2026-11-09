/**
 * WebdriverIO + Appium: drive the real Chrome app on an Android device or emulator.
 *
 * Before running: start an Android emulator (or plug in a phone with USB debugging on) with Chrome installed.
 * The appium service starts the Appium server for you, using the Appium and UiAutomator2 driver from this
 * folder's node_modules. Chromedriver is downloaded to match the phone's Chrome version.
 */
export const config: WebdriverIO.Config = {
  runner: 'local',
  specs: ['./test/**/*.spec.ts'],
  maxInstances: 1,
  capabilities: [{
    platformName: 'Android',
    browserName: 'Chrome',
    'appium:automationName': 'UiAutomator2',
    'appium:deviceName': 'Android Emulator',
    'appium:newCommandTimeout': 240,
    'goog:chromeOptions': { args: ['--no-first-run', '--disable-fre', '--no-default-browser-check'] },
  }],
  logLevel: 'warn',
  baseUrl: process.env.LAB_URL || 'https://www.dhanoapartners.com',
  waitforTimeout: 15_000,
  connectionRetryTimeout: 180_000,
  connectionRetryCount: 2,
  services: [['appium', {
    args: { allowInsecure: 'uiautomator2:chromedriver_autodownload', relaxedSecurity: false },
    logPath: './logs',
  }]],
  framework: 'mocha',
  reporters: ['spec'],
  mochaOpts: { ui: 'bdd', timeout: 120_000 },
};
