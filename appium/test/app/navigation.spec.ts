/** The tab bar: every tab opens its screen. Same test, same locators, on Android and iOS. */
import { expect } from '@wdio/globals';
import { a11y, openTab } from './helpers/locators.js';

describe('Demo app: navigation', () => {
  const tabs: [tab: string, screen: string][] = [
    ['Home', 'Home-screen'],
    ['Login', 'Login-screen'],
    ['Forms', 'Forms-screen'],
    ['Swipe', 'Swipe-screen'],
    ['Drag', 'Drag-drop-screen'],
  ];

  for (const [tab, screen] of tabs) {
    it(`the ${tab} tab opens its screen`, async () => {
      await openTab(tab, screen);
      await expect(a11y(screen)).toBeDisplayed();
    });
  }
});
