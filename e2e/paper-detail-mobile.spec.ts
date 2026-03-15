import { test, expect } from '@playwright/test';

const PAPER_ID = 'hn_47301085';

test.describe('Paper detail — mobile responsive', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('meta row에서 bullet이 항목과 같은 flex item 안에 있어야 함', async ({ page }) => {
    await page.goto(`/papers/${PAPER_ID}`);

    const bullets = page.locator('text=•');
    const count = await bullets.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const bullet = bullets.nth(i);
      const parent = bullet.locator('xpath=..');
      const parentBox = await parent.boundingBox();
      expect(parentBox).not.toBeNull();
      // parent가 bullet만 포함하는 게 아닌지 확인 (최소 40px 이상)
      expect(parentBox!.width).toBeGreaterThan(40);
    }
  });

  test('375px 뷰포트에서 가로 스크롤 없이 렌더링됨', async ({ page }) => {
    await page.goto(`/papers/${PAPER_ID}`);

    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(375);
  });

  test('모든 meta 항목이 보여야 함', async ({ page }) => {
    await page.goto(`/papers/${PAPER_ID}`);

    await expect(page.locator('text=View Original')).toBeVisible();
    await expect(page.locator('button:has-text("북마크")')).toBeVisible();
  });
});
