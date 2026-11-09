/** Log in and sign up on the native demo app, including native alerts and the keyboard. */
import { expect } from '@wdio/globals';
import { a11y, alert, hideKeyboard } from './helpers/locators.js';

describe('Demo app: login and sign up', () => {
  beforeEach(async () => {
    await a11y('Login').click();
    await a11y('Login-screen').waitForDisplayed();
  });

  it('logs in with valid details', async () => {
    await a11y('button-login-container').click();
    await a11y('input-email').setValue('test@webdriver.io');
    const password = a11y('input-password');
    await password.setValue('Test1234!');
    await hideKeyboard(await password);
    await a11y('button-LOGIN').click();

    await alert.waitForShown();
    expect(await alert.text()).toContain('You are logged in!');
    await alert.tapButton('OK');
  });

  it('signs up with valid details', async () => {
    await a11y('button-sign-up-container').click();
    await a11y('input-email').setValue('new.user@webdriver.io');
    await a11y('input-password').setValue('Test1234!');
    const repeat = a11y('input-repeat-password');
    await repeat.setValue('Test1234!');
    await hideKeyboard(await repeat);
    await a11y('button-SIGN UP').click();

    await alert.waitForShown();
    expect(await alert.text()).toContain('You successfully signed up!');
    await alert.tapButton('OK');
  });
});
