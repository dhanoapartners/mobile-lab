/**
 * Fallback locators in action. The first locator in each list is an id that does NOT exist in the app
 * (pretend developers renamed it), so the test only passes thanks to the fallbacks, and the report says so.
 * Exercise: open the Allure report and find the "Fallback used" attachments.
 */
import { expect } from '@wdio/globals';
import { findWithFallback } from './helpers/fallback.js';
import { alert, hideKeyboard, openTab } from './helpers/locators.js';

describe('Demo app: fallback locators', () => {
  it('logs in although the ids were renamed', async () => {
    await openTab('Login', 'Login-screen');

    const email = await findWithFallback('Email field', ['~email-input', '~input-email']);
    await email.setValue('test@webdriver.io');
    const password = await findWithFallback('Password field', ['~password-input', '~input-password']);
    await password.setValue('Test1234!');
    await hideKeyboard(password);

    const login = await findWithFallback('Login button', [
      '~login-button',
      'android=new UiSelector().description("button-LOGIN")',
      "-ios predicate string:name == 'button-LOGIN'",
    ]);
    await login.click();

    await alert.waitForShown();
    expect(await alert.text()).toContain('You are logged in!');
    await alert.tapButton('OK');
  });

  it('fails clearly when nothing matches', async () => {
    await expect(findWithFallback('Checkout button', ['~checkout', '~button-checkout'])).rejects.toThrow(/not found/);
  });
});
