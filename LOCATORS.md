# Finding locators in mobile apps

A locator is how a test finds an element. On mobile you choose from several strategies, and the choice decides whether your tests survive the next release and run on both Android and iOS.

## The order to try them in

| # | Strategy | WebdriverIO syntax | Works on | Use it when |
|---|---|---|---|---|
| 1 | **Accessibility id** | `$('~input-email')` | Android **and** iOS | Always first. One string for both platforms, and it also helps screen-reader users. |
| 2 | **Resource id** | `$('id=com.app:id/login')` or `$('id=android:id/alertTitle')` | Android | The element has a resource-id but no accessibility id. |
| 3 | **UiSelector** | `$('android=new UiSelector().text("OK")')` | Android | You need text, class or index matching, or scrolling (`UiScrollable`). |
| 4 | **Predicate string** | `$("-ios predicate string:type == 'XCUIElementTypeAlert'")` | iOS | Native queries by type, label, name or value. Fast. |
| 5 | **Class chain** | `` $('-ios class chain:**/XCUIElementTypeButton[`label == "OK"`]') `` | iOS | Walking the tree, like a fast, iOS-only XPath. |
| 6 | **XPath** | `$('//android.widget.Button[@text="OK"]')` | Both, but different per platform | Last resort: slow on mobile and breaks when layout changes. |

In this repo almost everything uses **accessibility ids**: the same test file runs on Android and iOS. The only exceptions are native alerts, which look different on each platform. Those live in one place, `appium/test/app/helpers/locators.ts`.

## Where accessibility ids come from

Developers set them in the app's code:

| App built with | Developer sets | Appears on Android as | Appears on iOS as |
|---|---|---|---|
| React Native | `testID` / `accessibilityLabel` | content-desc | accessibilityIdentifier / name |
| Native Android (Kotlin) | `contentDescription` | content-desc | n/a |
| Native iOS (Swift) | `accessibilityIdentifier` | n/a | name |
| Flutter | `Semantics(identifier: …)` | content-desc | name |

If an element has no id, **ask for one**. One line for a developer saves hours of brittle XPath for you. That conversation is part of the job.

## Find them with Appium Inspector

[Appium Inspector](https://github.com/appium/appium-inspector) shows the app's element tree, every attribute, and which locators would work.

1. Install it from its GitHub releases page (Mac, Windows or Linux).
2. Start Appium from the `appium/` folder: `npx appium --allow-insecure=uiautomator2:chromedriver_autodownload`
3. In Inspector, set the server to `http://127.0.0.1:4723` and paste capabilities, for example for Android:
   ```json
   {
     "platformName": "Android",
     "appium:automationName": "UiAutomator2",
     "appium:app": "/full/path/to/appium/apps/android.wdio.native.app.v1.0.8.apk"
   }
   ```
   For iOS use `"platformName": "iOS"`, `"appium:automationName": "XCUITest"`, `"appium:deviceName": "iPhone 16"` and the path to `apps/ios/wdiodemoapp.app`.
4. Click **Start Session**. Tap an element in the screenshot: the panel shows its attributes and suggested locators. Prefer the accessibility id; avoid the long XPath it offers.
5. Use **Search for element** to test a locator before you put it in code.

## Mobile website vs native app vs hybrid

- **Mobile website** (`test/web/`): it's a web page in Chrome, so you use web locators: `$('[data-testid="search-input"]')`, the same test IDs as the Playwright course.
- **Native app** (`test/app/`): native locators from the table above.
- **Hybrid** (a web page inside an app, like the demo app's Webview tab): switch context first. `await driver.getContexts()` lists `NATIVE_APP` and `WEBVIEW_…`; `await driver.switchContext(…)`, then use web locators.

## Common mistakes

- Copying the long XPath Inspector suggests. It breaks on the next layout change.
- Locating by visible text in a translated app. Text changes per language; ids don't.
- Writing separate Android and iOS tests when one test with accessibility ids would do.
- Using an id that isn't unique. On iOS, this app's Login screen has three elements named "Login" (the tab, the title and the form switch), so `$('~Login')` fails with `StrictSelectorError`: WebdriverIO refuses to guess which one you meant. Android only exposes the tab, so the same test passed there. Fixes: a unique id from the developers, a narrower locator, or (as in `openTab()`) not tapping the tab when you're already on its screen. This repo's own CI hit exactly this.
- Assuming an element is missing when it's just off-screen: scroll first (`UiScrollable` on Android, `mobile: scroll` on iOS).
