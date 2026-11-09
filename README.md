# Mobile Lab: testing on phones

[![CI](https://github.com/dhanoapartners/mobile-lab/actions/workflows/ci.yml/badge.svg)](https://github.com/dhanoapartners/mobile-lab/actions/workflows/ci.yml)

Three kinds of mobile testing, side by side:

| What's tested | Tool | Folder | Runs on |
|---|---|---|---|
| **Practice Lab website** at phone sizes | Playwright device emulation | `playwright-mobile/` | Any computer |
| **Practice Lab website** in the real Chrome app | Appium + WebdriverIO | `appium/test/web/` | Android emulator or phone |
| **A native app** (Android and iOS) | Appium + WebdriverIO | `appium/test/app/` | Android emulator, iOS Simulator (Mac only) |

The native app is the open-source [WebdriverIO demo app](https://github.com/webdriverio/native-demo-app) (MIT licence): login, sign up, forms, swipe and drag-and-drop screens, built for practising mobile automation. The same test files run on Android and iOS.

**How to choose locators on mobile:** see **[LOCATORS.md](LOCATORS.md)**.

Every suite writes an **Allure report**.

## 1. Playwright device emulation (start here)

Needs Node.js 20+.

```bash
cd playwright-mobile
npm install
npx playwright install chromium
npx playwright test                 # Pixel 7 and iPhone 14 profiles
npm run report                      # Allure report (needs Java 11+)
```

Checks every main screen for sideways scrolling, does the shop journey by tapping, rotates to landscape, and audits tap targets. Fast, but it's desktop Chrome pretending to be a phone.

## 2. Appium: one-time setup

Needs Node.js 22+ and Java 17+.

```bash
cd appium
npm install          # installs Appium and both drivers (UiAutomator2 for Android, XCUITest for iOS) locally
npm run apps         # downloads the demo app for Android and the iOS Simulator into ./apps
```

### Android (Windows, Mac or Linux)

1. Install [Android Studio](https://developer.android.com/studio). In **Device Manager**, create a phone (for example Pixel 6, API 34) and start it.
2. Make sure `ANDROID_HOME` points to your Android SDK and `adb devices` lists the emulator.
3. Run:
   ```bash
   npm run test:web       # the Practice Lab website in Chrome on the emulator
   npm run test:android   # the native app: Appium installs the .apk and starts it
   ```

A real Android phone works too: turn on **Developer options → USB debugging**, plug it in, and check `adb devices`.

### iOS (Mac only)

1. Install **Xcode** from the App Store, open it once to finish setup, and install an iOS Simulator runtime (Xcode → Settings → Components).
2. List your simulators: `xcrun simctl list devices available`.
3. Run, naming one of them:
   ```bash
   IOS_DEVICE="iPhone 16" IOS_VERSION="18.5" npm run test:ios
   ```
   The first run builds WebDriverAgent (Appium's helper on the simulator) and can take several minutes. Later runs are quick.

Real iPhones need an Apple Developer account and code signing, so this lab uses the Simulator.

### Reports

After any Appium run: `npm run report`, then open `allure-report/index.html` (a failed test has a screenshot attached).

## 3. When tests break: three habits

The demo app tests include three small, deliberately simple helpers. They are the habits to build before reaching for any AI tool.

| Helper | File | What it teaches |
|---|---|---|
| Fallback locators | `appium/test/app/helpers/fallback.ts`, `fallback.spec.ts` | List the ways to find a control, best first. Use the first that matches exactly one element, never one of several, and **report** every fallback so the test gets fixed |
| Plain-English steps | `appium/test/app/helpers/plain-steps.ts`, `plain-steps.spec.ts` | A keyword-driven runner: fixed sentence patterns and a table of control names → accessibility ids. Unknown words fail loudly instead of being guessed |
| Basic failure sorting | `appium/scripts/triage-basic.mjs` (`npm run triage`) | Sort failed tests by error text: environment, test issue, flaky, or "check it". Notice how many land in "check it": the error text alone can't tell a renamed id from an app crash |

Discussion: for each helper, what would it need to know about the **screen** (what was showing, whether the app was still running) to make better decisions?

## How it runs in CI

`.github/workflows/ci.yml` runs three jobs on every push and every night:

| Job | Machine | Time | What happens |
|---|---|---|---|
| Playwright device emulation | Linux | ~2 min | Emulated Pixel and iPhone |
| Android emulator | Linux, with an Android emulator booted by `android-emulator-runner` | ~10 min | Website in Chrome, then the native app |
| iOS Simulator | macOS | ~15 min | The newest iPhone simulator on the machine, native app |

Each job uploads its Allure report. These are free GitHub Actions minutes for a public repo; on a private repo, macOS minutes cost more than Linux ones.

## Exercises

1. Turn the tap-target audit into a real check for the buttons that matter (Add to cart, Check out).
2. Add a test for the demo app's **Swipe** screen: swipe the carousel until the last card shows.
3. Open the demo app in Appium Inspector and find three elements that only have XPath locators. What id would you ask the developer to add?
4. Switch into the demo app's **Webview** tab (`driver.switchContext`) and assert something on the web page inside it.
5. Run the native tests on a real Android phone. What differs from the emulator?
6. Rename an id in `fallback.spec.ts` so that two fallbacks match. What does the helper do, and why is that better than tapping the first one?
7. Add a sign-up case to `plain-steps.spec.ts`. Which controls do you need to add to `CONTROLS`?
8. Break a test on purpose three different ways (wrong id, wrong expected text, kill the app mid-test with `driver.terminateApp`) and run `npm run triage`. Which ones does it sort correctly?

---

© 2026 QualityFirstQA LLC. Dhanoa Partners is a training brand of QualityFirstQA LLC. For personal learning; see LICENSE. The WebdriverIO demo app is © its authors under the MIT licence and is downloaded at test time, not included here.
