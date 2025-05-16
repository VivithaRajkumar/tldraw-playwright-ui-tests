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
  await page.locator('div[style*="#chevron-up"]').click();
  await page.locator('div[style*="#tool-line"]:visible').first().click();
  await page.mouse.move(100, 100);
  await page.mouse.down();
  await page.mouse.move(200, 200);
  await page.mouse.up();
});

const tests = [
  {
    id: 'tc03',
    name: 'zoom in using UI button',
    run: async (page) => {
        page.locator("//button[@title='Toggle minimap']//div[@class='tlui-icon tlui-button__icon']").click() 
      const zoomInButton = page.locator("//button[@title='Zoom in — Ctrl =']//div[@class='tlui-icon tlui-button__icon']");
      await zoomInButton.click();
      await expect(page.locator('span', { hasText: '200%' })).toBeVisible();
    }
  },
  {
    id: 'tc04',
    name: 'zoom out using UI button',
    run: async (page) => {
        page.locator("//button[@title='Toggle minimap']//div[@class='tlui-icon tlui-button__icon']").click() 
      const zoomOutButton = page.locator("//button[@title='Zoom out — Ctrl -']//div[@class='tlui-icon tlui-button__icon']");
      await zoomOutButton.click();
      await expect(page.locator('span', { hasText: '50' })).toBeVisible();
    }
  },
  {
    id: 'tc05',
    name: 'zoom in using mouse wheel',
    run: async (page) => {
        await page.mouse.move(200, 100);
       
      await page.mouse.wheel(0, -100);
      const zoomLevel = await page.locator('.zoom-level').textContent();
      expect(zoomLevel).toContain('110%');
    }
  },
  {
    id: 'tc06',
    name: 'zoom out using mouse wheel',
    run: async (page) => {
        await page.mouse.move(100, 100);
        
      await page.mouse.wheel(0, 100);
      const zoomLevel = await page.locator('.zoom-level').textContent();
      expect(zoomLevel).toContain('90%');
    }
  }
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
