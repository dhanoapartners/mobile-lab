# Mobile Lab — Student Handout

*A hands-on mobile-testing lab. By Avneet Dhanoa (QualityFirstQA LLC).*

Work through this top to bottom. Each step has a **Do** (run something) and a **Check** (what you should see). Tick the checkpoints as you go — if a Check fails, stop and fix it before moving on.

**Time:** ~2–3 hours (the Appium setup is the long part). **You need:** Node.js 20+ for Part 1; Node.js 22+ and Java 17+ for Appium; Android Studio for Android; a Mac with Xcode for iOS.

> This lab has real device tooling to install. **Do the parts in order** — Part 1 needs almost nothing and teaches the core ideas, so you get a win before the heavy setup.

---

## The one idea to hold onto: call actors by name, not by seat

The same test file in this repo runs on **two stages** — Android and iOS. The app is like an actor performing the same play in two theaters with different seating.

If you find a control by **where it sits** (its position, an XPath tied to layout), your directions break the moment the stage changes — a new phone size, a platform quirk, iOS's duplicate names. If you call the actor **by name** — its **accessibility id** — the same direction works on both stages, and a screen reader can follow along too.

So the rule, top to bottom: **accessibility id first; a platform locator only where you must; XPath as a last resort you report as debt.** The full strategy is in **[LOCATORS.md](LOCATORS.md)** — read it when you hit Part 2.

There are three stages in this lab, easiest first:

| Stage | Tool | Runs on |
|---|---|---|
| Website at phone sizes | Playwright device emulation | any computer |
| Website in the **real Chrome app** | Appium + WebdriverIO | Android emulator/phone |
| A **native app** (same test, both OSes) | Appium + WebdriverIO | Android emulator, iOS Simulator (Mac) |

---

## Part 1 — Start here: Playwright device emulation (almost no setup)

**Do:**
```bash
cd playwright-mobile
npm install
npx playwright install chromium
npx playwright test          # Pixel 7 and iPhone 14 profiles
```

**Check** ☐ The run passes. It checks every main screen for **sideways scrolling**, does the shop journey by **tapping**, **rotates to landscape**, and audits **tap-target sizes**.

**Do (report):**
```bash
npm run report               # Allure report (needs Java 11+)
```
☐ Open the Allure report.

> Honest about what this is: **fast, but it's desktop Chrome pretending to be a phone.** Great for layout and tap-target checks; it can't catch anything that needs a real mobile browser or a native app. That's what Parts 2–3 are for.

---

## Part 2 — Appium: one-time setup

**Do:**
```bash
cd appium
npm install          # Appium + both drivers (UiAutomator2 for Android, XCUITest for iOS)
npm run apps         # downloads the WebdriverIO demo app for Android and iOS into ./apps
```

**Check** ☐ `./apps` now contains the demo app files. (The native app is the open-source WebdriverIO demo app, MIT-licensed, downloaded at test time — not committed here.)

☐ Now read **[LOCATORS.md](LOCATORS.md)** before you run anything. It's the whole point of the lab.

---

## Part 3 — Android (Windows, Mac or Linux)

1. ☐ Install [Android Studio](https://developer.android.com/studio). In **Device Manager**, create a phone (e.g. Pixel 6, API 34) and **start it**.
2. ☐ Confirm `ANDROID_HOME` points to your SDK and that `adb devices` **lists the emulator**.
3. **Do:**
   ```bash
   npm run test:web       # the Practice Lab website in Chrome on the emulator
   npm run test:android   # the native app: Appium installs the .apk and starts it
   ```

**Check** ☐ Both suites run on the emulator. The **same native test files** you'll run on iOS are running here on Android — that's the payoff of locating by accessibility id.

> A real Android phone works too: enable **Developer options → USB debugging**, plug in, confirm `adb devices`.

---

## Part 4 — iOS (Mac only)

1. ☐ Install **Xcode** from the App Store, open it once to finish setup, and install an iOS Simulator runtime (Xcode → Settings → Components).
2. ☐ List simulators: `xcrun simctl list devices available`.
3. **Do** (name one of them):
   ```bash
   IOS_DEVICE="iPhone 16" IOS_VERSION="18.5" npm run test:ios
   ```

**Check** ☐ The native tests pass on the Simulator. The first run **builds WebDriverAgent** and can take several minutes; later runs are quick.

☐ Same test files, two platforms, both green. Note one place the test had to handle a **platform difference** (a native alert, the keyboard, or iOS's duplicate accessibility names) in one spot rather than forking the whole test.

**Reports:** after any Appium run, `npm run report`, then open `allure-report/index.html` (a failed test has a screenshot attached).

---

## Part 5 — Three habits for when tests break

The demo-app tests include three deliberately simple helpers. These are the habits to build **before** reaching for any AI tool.

| Habit | Files | What it teaches |
|---|---|---|
| **Fallback locators** | `test/app/helpers/fallback.ts`, `fallback.spec.ts` | List the ways to find a control, best first. Use the first that matches **exactly one** element — never one of several — and **report** every fallback so the test gets fixed. |
| **Plain-English steps** | `test/app/helpers/plain-steps.ts`, `plain-steps.spec.ts` | A keyword runner: fixed sentence patterns + a table of control names → accessibility ids. Unknown words **fail loudly** instead of being guessed. |
| **Basic failure sorting** | `scripts/triage-basic.mjs` (`npm run triage`) | Sort failed tests by error text: environment / test issue / flaky / "check it." |

☐ Run `npm run triage` after a run with failures. Notice **how many land in "check it"** — the error text alone can't tell a renamed id from an app crash.

☐ **Discussion:** for each helper, what would it need to know about the **screen** (what was showing, whether the app was still running) to make a better decision? _______

---

## Part 6 — Your turn (exercises)

1. Turn the **tap-target audit** into a real check for the buttons that matter (Add to cart, Check out).
2. Add a test for the demo app's **Swipe** screen: swipe the carousel until the last card shows.
3. Open the demo app in **Appium Inspector** and find three elements that only have XPath locators. What id would you ask the developer to add? _______
4. Switch into the demo app's **Webview** tab (`driver.switchContext`) and assert something on the web page inside it.
5. Run the native tests on a **real Android phone**. What differs from the emulator? _______
6. Rename an id in `fallback.spec.ts` so that **two** fallbacks match. What does the helper do, and why is that better than tapping the first one?
7. Add a **sign-up** case to `plain-steps.spec.ts`. Which controls do you need to add to `CONTROLS`?
8. Break a test three ways (wrong id, wrong expected text, kill the app mid-test with `driver.terminateApp`) and run `npm run triage`. Which does it sort correctly? _______

---

## Done — what you should be able to say now

Tick each once you can explain it to the person next to you:

- ☐ Why you locate by **accessibility id**, not by position or XPath — and how one test file then runs on both Android and iOS.
- ☐ The trade-off between **device emulation** (fast, fake) and a **real emulator/simulator** (slow, real).
- ☐ What a **fallback locator** does, and why you must **report** every fallback it uses.
- ☐ Why **plain-English steps fail loudly** on unknown words instead of guessing.
- ☐ Why so many mobile failures need a **screenshot or app state** to triage, not just the error text.

---

*Part of a five-repo portfolio — start at [practice-lab](https://github.com/dhanoapartners/practice-lab). Built on [Practice Lab](https://www.dhanoapartners.com). The WebdriverIO demo app is © its authors (MIT) and downloaded at test time. All data synthetic.*
