/**
 * How these tests find elements in a native app, and why.
 *
 * 1. Accessibility id (`~name`): the first choice. It works on BOTH platforms with the same string.
 *    In React Native the developer sets it with `testID` / `accessibilityLabel`; on Android it's the
 *    content-description, on iOS the accessibilityIdentifier. Ask developers to add one to every control.
 * 2. Android resource-id (`id=android:id/alertTitle`): stable, but Android only.
 * 3. Android UiSelector (`android=new UiSelector().text("OK")`): powerful native queries, Android only.
 * 4. iOS predicate string (`-ios predicate string:type == 'XCUIElementTypeAlert'`): fast native queries, iOS only.
 * 5. XPath: last resort. Slow on mobile and breaks when the layout changes.
 *
 * Find candidates with Appium Inspector (see LOCATORS.md in the repo root).
 */

/** Accessibility id: same string on Android and iOS. */
export const a11y = (id: string) => $(`~${id}`);

/** Native alerts look different on each platform, so this is the one place with platform-specific locators. */
export const alert = {
  async waitForShown() {
    const selector = driver.isAndroid
      ? 'id=android:id/alertTitle'
      : "-ios predicate string:type == 'XCUIElementTypeAlert'";
    await $(selector).waitForExist({ timeout: 15_000 });
  },
  /** Title and message, e.g. "Success\nYou are logged in!". */
  async text(): Promise<string> {
    if (driver.isIOS) return driver.getAlertText();
    const title = await $('id=android:id/alertTitle').getText();
    const message = await $('id=android:id/message').getText();
    return `${title}\n${message}`;
  },
  async tapButton(label: string) {
    const button = driver.isAndroid ? $(`android=new UiSelector().text("${label.toUpperCase()}")`) : $(`~${label}`);
    await button.click();
    await (driver.isAndroid ? $('id=android:id/alertTitle') : $("-ios predicate string:type == 'XCUIElementTypeAlert'"))
      .waitForExist({ timeout: 10_000, reverse: true });
  },
};

/** The keyboard can cover buttons. Android has a command for it; on iOS, pressing Return closes it. */
export async function hideKeyboard(lastField: WebdriverIO.Element) {
  if (!(await driver.isKeyboardShown())) return;
  if (driver.isAndroid) await driver.hideKeyboard();
  else await lastField.addValue('\n');
}
