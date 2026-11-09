/**
 * Target 3: the native demo app on the iOS Simulator (macOS with Xcode only).
 * Pick the simulator with IOS_DEVICE and IOS_VERSION (see `xcrun simctl list devices available`).
 */
import { join } from 'node:path';
import { shared } from './wdio.shared.conf.js';

export const config: WebdriverIO.Config = {
  ...shared,
  specs: ['../test/app/**/*.spec.ts'],
  capabilities: [{
    platformName: 'iOS',
    'appium:automationName': 'XCUITest',
    'appium:deviceName': process.env.IOS_DEVICE || 'iPhone 16',
    ...(process.env.IOS_VERSION ? { 'appium:platformVersion': process.env.IOS_VERSION } : {}),
    'appium:app': join(process.cwd(), 'apps', 'ios', 'wdiodemoapp.app'),
    'appium:newCommandTimeout': 240,
    'appium:wdaLaunchTimeout': 600_000,
    'appium:simulatorStartupTimeout': 600_000,
  }],
};
