/** Native form controls: a text field that echoes what you type, and a switch. */
import { expect } from '@wdio/globals';
import { a11y, openTab, hideKeyboard } from './helpers/locators.js';

describe('Demo app: forms', () => {
  beforeEach(async () => {
    await openTab('Forms', 'Forms-screen');
  });

  it('what you type is shown back', async () => {
    const input = a11y('text-input');
    await input.setValue('Hello from Practice Lab');
    await hideKeyboard(await input);
    await expect(a11y('input-text-result')).toHaveText('Hello from Practice Lab');
  });

  it('the switch turns on and off', async () => {
    await expect(a11y('switch-text')).toHaveText('Click to turn the switch ON');
    await a11y('switch').click();
    await expect(a11y('switch-text')).toHaveText('Click to turn the switch OFF');
    await a11y('switch').click();
    await expect(a11y('switch-text')).toHaveText('Click to turn the switch ON');
  });
});
