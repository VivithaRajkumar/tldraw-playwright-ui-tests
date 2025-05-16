import { Page } from '@playwright/test';
import fs from 'fs';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

export async function saveScreenshot(page: Page, filePath: string) {
  const buffer = await page.screenshot({ fullPage: false });
  fs.writeFileSync(filePath, buffer);
}

export async function compareScreenshots(
  baselinePath: string,
  currentPath: string,
  diffPath: string
): Promise<number> {
  const img1 = PNG.sync.read(fs.readFileSync(baselinePath));
  const img2 = PNG.sync.read(fs.readFileSync(currentPath));
  const { width, height } = img1;
  const diff = new PNG({ width, height });

  const diffPixels = pixelmatch(img1.data, img2.data, diff.data, width, height, {
    threshold: 1,
  });

  fs.writeFileSync(diffPath, PNG.sync.write(diff));
  return diffPixels;
}
