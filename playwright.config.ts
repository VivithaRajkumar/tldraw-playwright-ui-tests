import { defineConfig } from '@playwright/test';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
dotenv.config();

type BrowserName = 'chromium' | 'firefox' | 'webkit';

const testSuite = process.env.TEST_SUITE?.trim(); // e.g. 'regression'
const HEADLESS = process.env.HEADLESS !== 'false';
const rawBrowser = process.env.BROWSER || 'chromium';
const INCLUDE_TC = process.env.TC?.split(',').map(tc => tc.trim()).filter(Boolean) || [];
const TARGET_TYPE = process.env.TARGET_TYPE || 'web';
const isValidBrowser = ['chromium', 'firefox', 'webkit'].includes(rawBrowser);
if (!isValidBrowser) {
  throw new Error(`❌ Invalid BROWSER value: "${rawBrowser}". Valid options: chromium | firefox | webkit.`);
}
const BROWSER = rawBrowser as BrowserName;
const BASE_URL = TARGET_TYPE === 'sdk' ? 'http://localhost:3000' : 'https://makereal.tldraw.com';

// DETERMINE TEST DIRECTORY
let testDir = 'tests';
if (testSuite) {
  const suitePath = `tests/${testSuite}`;
  if (!fs.existsSync(suitePath)) {
    throw new Error(`❌ TEST_SUITE folder not found: ${suitePath}`);
  }
  testDir = suitePath;
}
// ✅ Log all resolved parameters
console.log(`🔧 Configuration:`);
console.log(`🧪 TEST_SUITE  = ${testSuite || 'ALL'}`);
console.log(`📂 testDir     = ${testDir}`);
console.log(`🎯 TARGET_TYPE = ${TARGET_TYPE}`);
console.log(`🎭 BROWSER     = ${BROWSER}`);
console.log(`👁 HEADLESS    = ${HEADLESS}`);
console.log(`🔎 TC          = ${INCLUDE_TC.length > 0 ? INCLUDE_TC.join(', ') : 'ALL'}`);
console.log(`🌐 BASE_URL    = ${BASE_URL}`);
// DEFINE CONFIG
export default defineConfig({
  testDir,
  reporter: [['html', { open: 'on-failure' }]],
  use: {
    headless: HEADLESS,
    browserName: BROWSER,
    video: 'retain-on-failure',
    baseURL: BASE_URL,
    screenshot: 'only-on-failure',
    viewport: { width: 1920, height: 1080 },
  },
  // Only apply grep if TC is specified



grep: INCLUDE_TC.length > 0
  ? new RegExp(`tc(${INCLUDE_TC.map((n) => n.padStart(2, '0')).join('|')})`)
  : undefined,




});
