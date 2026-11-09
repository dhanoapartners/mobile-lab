/**
 * Mobile checks that catch the bugs phones actually get: sideways scrolling, journeys done by tapping,
 * rotation, and tap targets too small for a thumb.
 * Run: npx playwright test   (both phones)   ·   npx playwright test --project=pixel-7
 */
import { test, expect } from '@playwright/test';

const SCREENS = ['hub', 'shop', 'cart', 'bank', 'playground', 'help', 'triage'];

for (const view of SCREENS) {
  test(`${view}: no sideways scrolling`, async ({ page }) => {
    await page.goto(`/?ui=v1#${view}`);
    await page.waitForLoadState('networkidle');
    const { scrollWidth, innerWidth } = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
    }));
    expect(scrollWidth, 'page is wider than the phone screen').toBeLessThanOrEqual(innerWidth);
  });
}

test('shop journey by tapping: search, open, add to cart', async ({ page }) => {
  await page.goto('/?ui=v1#shop');
  await page.getByTestId('search-input').tap();
  await page.getByTestId('search-input').fill('speaker');
  await page.getByTestId('search-suggestion').first().tap();
  await expect(page.getByTestId('product-title')).toHaveText('Bluetooth Speaker');
  await page.getByTestId('add-to-cart').tap();
  await expect(page.getByTestId('cart-count')).toHaveText('1');
});

test('rotating to landscape keeps the page usable', async ({ page, viewport }) => {
  await page.goto('/?ui=v1#shop');
  await page.setViewportSize({ width: viewport!.height, height: viewport!.width }); // rotate
  await expect(page.getByTestId('product-card').first()).toBeVisible();
  const wide = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
  expect(wide).toBe(true);
});

test('tap-target audit (reports, does not fail)', async ({ page }, testInfo) => {
  // Guidelines suggest about 44×44 CSS px for anything you tap. This lists what's smaller.
  await page.goto('/?ui=v1#shop');
  await page.waitForLoadState('networkidle');
  const small = await page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>('button, a, input, select')]
      .filter((e) => {
        const b = e.getBoundingClientRect();
        return b.width > 0 && b.height > 0 && b.height < 32 && getComputedStyle(e).visibility !== 'hidden';
      })
      .map((e) => `${e.dataset.testid ?? e.tagName.toLowerCase()} (${Math.round(e.getBoundingClientRect().height)}px tall)`),
  );
  testInfo.annotations.push({ type: 'small tap targets', description: small.join(', ') || 'none' });
  console.log(`${testInfo.project.name}: ${small.length} tap target(s) under 32px: ${small.join(', ')}`);
  // Exercise: turn this into a real check for the buttons that matter (add to cart, checkout).
});
