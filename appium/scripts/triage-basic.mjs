#!/usr/bin/env node
/**
 * A basic failure sorter, for teaching. Reads the Allure results of a run and puts every failed test into
 * a bucket by looking ONLY at the error text:
 *
 *   environment   the device or Appium never got going
 *   test issue    the locator matched several elements
 *   check it      an element wasn't found (renamed id? app crash? slow screen? the text can't tell)
 *   flaky         failed, then passed on retry
 *   other         everything else
 *
 * Exercise: run it after a red run (npm run triage). Why does "element wasn't found" land in "check it"?
 * What extra information would you need to decide? (Hint: what was on the screen, and was the app still running?)
 *
 * Usage: node scripts/triage-basic.mjs [allure-results]
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const dir = process.argv[2] ?? 'allure-results';
if (!existsSync(dir)) {
  console.log(`No ${dir} folder. Run the tests first.`);
  process.exit(0);
}

const RULES = [
  ['environment', /session not created|could not start|ECONNREFUSED|device offline|WebDriverAgent/i],
  ['test issue', /strict|matches \d+ elements/i],
  ['check it', /wasn't found|not displayed|still not existing|no such element/i],
];

const results = readdirSync(dir)
  .filter((f) => f.endsWith('-result.json'))
  .map((f) => JSON.parse(readFileSync(join(dir, f), 'utf8')));

// One line per test: the last attempt decides pass/fail, earlier failures mean flaky.
const byTest = new Map();
for (const r of results.sort((a, b) => (a.start ?? 0) - (b.start ?? 0))) {
  const key = r.historyId ?? r.fullName ?? r.name;
  const prev = byTest.get(key);
  byTest.set(key, { ...r, failedBefore: (prev && prev.status !== 'passed') || prev?.failedBefore });
}

const rows = [];
for (const r of byTest.values()) {
  const message = r.statusDetails?.message ?? '';
  let bucket;
  if (r.status === 'passed') bucket = r.failedBefore ? 'flaky' : null;
  else bucket = RULES.find(([, re]) => re.test(message))?.[0] ?? 'other';
  if (bucket) rows.push({ test: r.name, bucket, error: message.split('\n')[0].slice(0, 90) });
}

if (!rows.length) console.log('No failed or flaky tests.');
else console.table(rows);
