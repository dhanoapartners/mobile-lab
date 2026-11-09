/**
 * Target 1: the Practice Lab website in real Chrome on Android.
 * Needs a running Android emulator or phone with Chrome.
 */
import { shared } from './wdio.shared.conf.js';

export const config: WebdriverIO.Config = {
  ...shared,
  specs: ['../test/web/**/*.spec.ts'],
  baseUrl: process.env.LAB_URL || 'https://www.dhanoapartners.com',
  capabilities: [{
    platformName: 'Android',
    browserName: 'Chrome',
    'appium:automationName': 'UiAutomator2',
    'appium:deviceName': 'Android Emulator',
    'appium:newCommandTimeout': 240,
    'goog:chromeOptions': { args: ['--no-first-run', '--disable-fre', '--no-default-browser-check'] },
  }],
};
