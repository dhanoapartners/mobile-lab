/**
 * Tests written as plain-English steps (see helpers/plain-steps.ts).
 * Exercise: add a case for the sign-up form. Which controls do you need to add to CONTROLS?
 */
import { runSteps } from './helpers/plain-steps.js';

describe('Demo app: plain-English steps', () => {
  it('logs in', async () => {
    await runSteps([
      'Open the Login tab',
      'Tap Login form',
      'Type "test@webdriver.io" into Email',
      'Type "Test1234!" into Password',
      'Tap LOGIN',
      'Expect the alert "You are logged in!"',
      'Close the alert',
    ]);
  });
});
