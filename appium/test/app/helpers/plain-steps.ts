/**
 * Plain-English steps, for teaching: a keyword-driven runner.
 *
 * Each sentence pattern maps to one action, and each control name maps to an accessibility id that YOU
 * write down in CONTROLS. Nothing is guessed: an unknown sentence or control name fails the test and says
 * which one. This is the honest starting point before any AI: the vocabulary is small, but every step
 * does exactly what it says on both platforms.
 *
 *   Open the Login tab
 *   Type "test@webdriver.io" into Email
 *   Tap LOGIN
 *   Expect the alert "You are logged in!"
 *   Close the alert
 */
import { expect } from '@wdio/globals';
import { a11y, alert, hideKeyboard, openTab } from './locators.js';

/** Control names used in steps → accessibility ids. Add a line when you need a new control. */
export const CONTROLS: Record<string, string> = {
  'Email': 'input-email',
  'Password': 'input-password',
  'Repeat password': 'input-repeat-password',
  'LOGIN': 'button-LOGIN',
  'SIGN UP': 'button-SIGN UP',
  'Sign up form': 'button-sign-up-container',
  'Login form': 'button-login-container',
  'Text field': 'text-input',
  'Switch': 'switch',
};

const TABS: Record<string, string> = { Home: 'Home-screen', Login: 'Login-screen', Forms: 'Forms-screen', Swipe: 'Swipe-screen', Drag: 'Drag-drop-screen' };

const id = (name: string) => {
  const found = CONTROLS[name];
  if (!found) throw new Error(`Unknown control "${name}". Add it to CONTROLS in helpers/plain-steps.ts.`);
  return found;
};

export async function runStep(step: string): Promise<void> {
  let m: RegExpMatchArray | null;
  if ((m = step.match(/^Open the (\w+) tab$/))) {
    const screen = TABS[m[1]];
    if (!screen) throw new Error(`Unknown tab "${m[1]}"`);
    return openTab(m[1], screen);
  }
  if ((m = step.match(/^Type "(.*)" into (.+)$/))) {
    const field = a11y(id(m[2]));
    await field.setValue(m[1]);
    return hideKeyboard(await field);
  }
  if ((m = step.match(/^Tap (.+)$/))) return a11y(id(m[1])).click();
  if ((m = step.match(/^Expect the alert "(.*)"$/))) {
    await alert.waitForShown();
    expect(await alert.text()).toContain(m[1]);
    return;
  }
  if (step === 'Close the alert') return alert.tapButton('OK');
  throw new Error(`I don't understand the step "${step}". Known patterns are listed at the top of helpers/plain-steps.ts.`);
}

export async function runSteps(steps: string[]): Promise<void> {
  for (const step of steps) {
    console.log(`  → ${step}`);
    await runStep(step);
  }
}
