/**
 * Target 2: the native demo app on Android.
 * Appium installs the .apk from ./apps on the emulator or phone, then starts it.
 */
import { join } from 'node:path';
import { shared } from './wdio.shared.conf.js';

export const config: WebdriverIO.Config = {
  ...shared,
  specs: ['../test/app/**/*.spec.ts'],
  capabilities: [{
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:deviceName': 'Android Emulator',
    'appium:app': join(process.cwd(), 'apps', 'android.wdio.native.app.v1.0.8.apk'),
    'appium:appWaitActivity': 'com.wdiodemoapp.MainActivity',
    'appium:autoGrantPermissions': true,
    'appium:newCommandTimeout': 240,
  }],
};
