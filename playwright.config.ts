import { defineConfig } from '@playwright/test';
import * as dotenv from 'dotenv';
dotenv.config();

type BrowserName = 'chromium' | 'firefox' | 'webkit';

// Load environment variables
const testSuite = process.env.TEST_SUITE || 'sanity'; // sanity or regression
const HEADLESS = process.env.HEADLESS !== 'false';
const rawBrowser = process.env.BROWSER || 'chromium';
const INCLUDE_TC = process.env.TC?.split(',') || [];
const TARGET_TYPE = process.env.TARGET_TYPE || 'web';

// Validate browser input
const isValidBrowser = ['chromium', 'firefox', 'webkit'].includes(rawBrowser);
if (!isValidBrowser) {
  throw new Error(
    `❌ Invalid BROWSER value: "${rawBrowser}".\n` +
    `✅ Valid options are: chromium | firefox | webkit.`
  );
}
const BROWSER = rawBrowser as BrowserName;

// Set base URL
const BASE_URL =
  TARGET_TYPE === 'sdk'
    ? 'http://localhost:3000'
    : 'https://makereal.tldraw.com';
export default defineConfig({
  testDir: `tests/${testSuite}`,
  reporter: [['html', { open: 'on-failure' }]],  // options: 'always', 'never', 'on-failure'
  use: {
    headless: false,               // true | false — run browser in headless/headful mode
    browserName: BROWSER,             // 'chromium' | 'firefox' | 'webkit'
    video: 'retain-on-failure',       // 'on' | 'off' | 'retain-on-failure' — video recording
    baseURL: BASE_URL,                // Base URL for `page.goto('/')`
    screenshot: 'only-on-failure',    // 'on' | 'off' | 'only-on-failure' — capture screenshots
    viewport: { width: 1920, height: 1080 },  // Custom viewport size

  },
  grep: INCLUDE_TC.length
    ? new RegExp(`tc(${INCLUDE_TC.map((n) => n.padStart(2, '0')).join('|')})`)
    : undefined,
});

