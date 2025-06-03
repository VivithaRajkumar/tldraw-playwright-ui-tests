import { test, expect } from '@playwright/test'; 
import fs from 'fs';
import path from 'path';
import { saveScreenshot, compareScreenshots } from '../../utils/canvasUtils';

const screenshotRoot = 'screenshots';
const dirs = ['before', 'after', 'comparison/passed', 'comparison/failed'];

test.beforeAll(() => {
  dirs.forEach(dir => {
    const fullPath = path.join(screenshotRoot, dir);
    if (!fs.existsSync(fullPath)) fs.mkdirSync(fullPath, { recursive: true });
  });
});

test.beforeEach(async ({ page }) => {
  await page.goto('https://makereal.tldraw.com');
  await page.locator('button[aria-label="Close"]').click();
  console.log('▶ Headless mode:', process.env.HEADLESS);
});

const tests = [
  { id: 'tc01', name: 'Draw single line', run: async (page) => {
    await page.locator('div[style*="#chevron-up"]').click();
    await page.locator('div[style*="#tool-line"]:visible').first().click();
    await page.mouse.move(100, 100);
    await page.mouse.down();
    await page.mouse.move(200, 200);
    await page.mouse.up();
  }},
  { id: 'tc02', name: 'Draw two lines in sequence', run: async (page) => {
    for (let i = 1; i < 3; i++) {
      await page.locator('div[style*="#chevron-up"]').click();
      await page.locator('div[style*="#tool-line"]:visible').first().click();
      await page.mouse.move(100 + i * 50, 100);
      await page.mouse.down();
      await page.mouse.move(200 + i * 50, 200);
      await page.mouse.up();
    }
  }}
];

for (const t of tests) {
  test(`${t.id} - ${t.name}`, async ({ page }) => {
    await t.run(page);

    const beforePath = path.join(screenshotRoot, 'before', `${t.id}.png`);
    const afterPath = path.join(screenshotRoot, 'after', `${t.id}.png`);
    const passPath = path.join(screenshotRoot, 'comparison/passed', `${t.id}.png`);
    const failPath = path.join(screenshotRoot, 'comparison/failed', `${t.id}.png`);

    if (!fs.existsSync(beforePath)) {
      await saveScreenshot(page, beforePath);
      console.log(`✅ Baseline created for ${t.id}`);
      return;
    }

    await saveScreenshot(page, afterPath);
    const diffPixels = await compareScreenshots(beforePath, afterPath, failPath);

    const MAX_ALLOWED_DIFF = 1000;

    if (diffPixels <= MAX_ALLOWED_DIFF) {
      fs.copyFileSync(afterPath, passPath);
      console.log(`✅ ${t.id} passed with minor diff (${diffPixels} pixels)`);
    } else {
      console.warn(`❌ ${t.id} failed — ${diffPixels} pixels differ.`);
      expect(diffPixels, `${t.id} visual difference`).toBeLessThanOrEqual(MAX_ALLOWED_DIFF);
    }
  });

  test.afterEach(async ({ page }) => {
    await page.context().clearCookies();
    await page.reload();
  });
}
