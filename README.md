# Mobile Lab: testing on phones

[![CI](https://github.com/dhanoapartners/mobile-lab/actions/workflows/ci.yml/badge.svg)](https://github.com/dhanoapartners/mobile-lab/actions/workflows/ci.yml)

Two ways to test **[Practice Lab](https://www.dhanoapartners.com)** on a phone, side by side:

| | `playwright-mobile/` | `appium/` |
|---|---|---|
| What runs | Desktop Chrome pretending to be a phone (device emulation) | The real Chrome app on Android, driven by Appium |
| Speed | Seconds | Minutes (an emulator has to boot) |
| Catches | Layout at phone sizes, touch-only flows, rotation, tap targets | Real mobile-browser behavior, the real keyboard, device quirks |
| Use it for | Most mobile checks, on every commit | A smaller set of journeys, nightly or before a release |

Most teams need both: emulation for breadth, a real device for the few journeys that must not break.

## Playwright device emulation

```bash
cd playwright-mobile
npm install
npx playwright install chromium
npx playwright test                     # Pixel 7 and iPhone 14 profiles
```

`specs/mobile.spec.ts` checks every main screen for sideways scrolling, does the shop journey by **tapping**, rotates to landscape, and audits tap targets smaller than a thumb. The audit reports and doesn't fail; turning it into a real check is an exercise.

iPhone profiles run in Chromium by default. For Safari's real engine: `npx playwright install webkit`, then `WEBKIT=1 npx playwright test`.

## Appium on Android

Needs Node.js 20+, Java 17+, the Android SDK, and a running emulator (Android Studio → Device Manager) or a phone with USB debugging on.

```bash
cd appium
npm install                 # installs Appium and the UiAutomator2 driver locally
adb devices                 # your emulator or phone should be listed
npm test                    # WebdriverIO starts Appium and runs test/shop.spec.ts
```

Chromedriver is downloaded automatically to match the phone's Chrome. In CI, an Android emulator boots on GitHub Actions and runs the same tests.

This lab tests the **mobile website** in Chrome on Android. Testing a native app uses the same Appium setup with `appium:app` pointing at an `.apk` instead of `browserName: 'Chrome'`.

## Exercises

1. Turn the tap-target audit into a real check for the buttons that matter (Add to cart, Check out). Which ones fail today?
2. Add a Playwright project for a tablet (`devices['iPad (gen 7)']`). What changes in the layout?
3. Add the checkout journey to the Appium suite. Where does the on-screen keyboard get in the way?
4. Run the Appium suite on a real phone. What differs from the emulator?

---

© 2026 QualityFirstQA LLC. Dhanoa Partners is a training brand of QualityFirstQA LLC. For personal learning; see LICENSE.
