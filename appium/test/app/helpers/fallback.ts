/**
 * A simple fallback locator, for teaching.
 *
 * You list the ways to find one control, best first. The first one that matches exactly ONE element wins.
 * If a fallback (not the first locator) was used, it's printed and added to the Allure report, so somebody
 * updates the test instead of relying on the fallback forever.
 *
 *   const login = await findWithFallback('Login button', [
 *     '~button-LOGIN',                                          // accessibility id (best)
 *     'android=new UiSelector().text("LOGIN")',                 // Android only
 *     "-ios predicate string:label == 'LOGIN'",                 // iOS only
 *   ]);
 *
 * Rules worth keeping even in a simple version:
 * - Never pick one of several matches. Two matches means the locator is ambiguous: fail.
 * - Always report a fallback. A silent fallback hides a real change in the app.
 * - Locators for the other platform are skipped.
 */
import allure from '@wdio/allure-reporter';

const forOtherPlatform = (locator: string) =>
  (driver.isIOS && locator.startsWith('android=')) || (driver.isAndroid && locator.startsWith('-ios '));

export async function findWithFallback(name: string, locators: string[]): Promise<WebdriverIO.Element> {
  const tried: string[] = [];
  for (const [i, locator] of locators.entries()) {
    if (forOtherPlatform(locator)) continue;
    const visible: WebdriverIO.Element[] = [];
    for (const el of await $$(locator)) if (await el.isDisplayed().catch(() => false)) visible.push(el);
    tried.push(`${locator} → ${visible.length}`);
    if (visible.length > 1) throw new Error(`${name}: ${locator} matches ${visible.length} elements; make the locator more specific`);
    if (visible.length === 1) {
      if (i > 0) {
        const note = `${name}: "${locators[0]}" not found, used fallback "${locator}". Update the test.`;
        console.warn(`  ⚠ ${note}`);
        allure.addAttachment(`Fallback used: ${name}`, note, 'text/plain');
      }
      return visible[0];
    }
  }
  throw new Error(`${name}: not found. Tried:\n  ${tried.join('\n  ')}`);
}
