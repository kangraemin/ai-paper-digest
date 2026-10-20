import { test, expect } from '@playwright/test';

// 운영 빌드(next build && next start)에서 돌린다. dev 서버는 항상 no-store라 판정할 수 없다.
// 레이아웃이 headers()를 읽으면 ISR 페이지도 매 요청 서버에서 다시 그려 Vercel CPU를 태운다
test('ISR 페이지가 CDN 캐시 헤더(s-maxage)로 나간다', async ({ request }) => {
  for (const u of ['/en', '/ko', '/ko/trends', '/en/topics/claude']) {
    const res = await request.get(u);
    expect(res.status(), u).toBe(200);
    expect(res.headers()['cache-control'], u).toContain('s-maxage');
  }
});

test('검색 API는 CDN에 캐시되도록 s-maxage를 보낸다', async ({ request }) => {
  const res = await request.get('/api/search?q=llm');
  expect(res.status()).toBe(200);
  expect(res.headers()['cache-control']).toContain('s-maxage');
});

test('첫 화면을 미리 만들어도 주소의 필터로 목록을 다시 불러오고, 영어판은 html lang이 en이다', async ({ page }) => {
  const req = page.waitForRequest((r) => r.url().includes('/api/papers?source=community'));
  await page.goto('/en?source=community');
  await req;
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});
