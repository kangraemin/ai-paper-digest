import { test, expect } from '@playwright/test';

test.describe('Slack Install Page', () => {
  test('성공 화면 — 성공 메시지와 홈 링크 표시', async ({ page }) => {
    await page.goto('/ko/install?success=true');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('link').first()).toBeVisible();
  });

  test('에러 화면 — channel_not_found 에러코드 표시', async ({ page }) => {
    await page.goto('/ko/install?error=channel_not_found');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByText('channel_not_found')).toBeVisible();
  });

  test('에러 화면 — not_in_channel 에러코드 표시', async ({ page }) => {
    await page.goto('/ko/install?error=not_in_channel');
    await expect(page.getByText('not_in_channel')).toBeVisible();
  });

  test('파라미터 없이 접근 — unknown 에러 표시', async ({ page }) => {
    await page.goto('/ko/install');
    await expect(page.getByText('unknown')).toBeVisible();
  });

  test('영어 성공 화면', async ({ page }) => {
    await page.goto('/en/install?success=true');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
});
