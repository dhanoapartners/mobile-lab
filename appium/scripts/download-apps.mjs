/**
 * Downloads the WebdriverIO native demo app (MIT licence) for Android and the iOS Simulator into ./apps.
 * The apps are not stored in this repo; run `npm run apps` once before the native tests.
 */
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const VERSION = 'v1.0.8';
const BASE = `https://github.com/webdriverio/native-demo-app/releases/download/${VERSION}`;
const files = [`android.wdio.native.app.${VERSION}.apk`, `ios.simulator.wdio.native.app.${VERSION}.zip`];

mkdirSync('apps/ios', { recursive: true });
for (const f of files) {
  if (existsSync(`apps/${f}`)) { console.log(`✓ ${f} (already downloaded)`); continue; }
  const res = await fetch(`${BASE}/${f}`);
  if (!res.ok) throw new Error(`${f}: HTTP ${res.status}`);
  writeFileSync(`apps/${f}`, Buffer.from(await res.arrayBuffer()));
  console.log(`✓ ${f}`);
}
// The iOS zip holds Payload/wdiodemoapp.app; Appium wants the .app folder itself.
execFileSync('unzip', ['-o', '-q', `apps/ios.simulator.wdio.native.app.${VERSION}.zip`, '-d', 'apps/ios-zip']);
execFileSync('rm', ['-rf', 'apps/ios/wdiodemoapp.app']);
execFileSync('mv', ['apps/ios-zip/Payload/wdiodemoapp.app', 'apps/ios/wdiodemoapp.app']);
execFileSync('rm', ['-rf', 'apps/ios-zip']);
console.log('✓ apps/ios/wdiodemoapp.app');
