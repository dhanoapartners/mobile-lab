/**
 * Practice Lab in Chrome on Android. Same journey as the Playwright tests, but on a real mobile browser:
 * real touch, the real on-screen keyboard and the phone's own Chrome.
 */
import { browser, $, expect } from '@wdio/globals';

const tid = (id: string) => `[data-testid="${id}"]`;

describe('Practice Lab on Android Chrome', () => {
  it('search, open a product and add it to the cart', async () => {
    await browser.url('/?ui=v1#shop');
    await $(tid('search-input')).setValue('speaker');
    await $(tid('search-suggestion')).click();
    await expect($(tid('product-title'))).toHaveText('Bluetooth Speaker');
    await $(tid('add-to-cart')).click();
    await expect($(tid('cart-count'))).toHaveText('1');
  });

  it('the shop has no sideways scrolling on the phone', async () => {
    await browser.url('/?ui=v1#shop');
    await $(tid('product-card')).waitForDisplayed();
    const fits = await browser.execute(() => document.documentElement.scrollWidth <= window.innerWidth);
    expect(fits).toBe(true);
  });

  it('reports the real device and browser', async () => {
    const ua = await browser.execute(() => navigator.userAgent);
    console.log(`Running on: ${ua}`);
    expect(ua).toContain('Android');
  });
});
