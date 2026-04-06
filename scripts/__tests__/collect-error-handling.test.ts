import { describe, it, expect, vi } from 'vitest';

describe('수집 파이프라인 에러핸들링', () => {
  describe('HF API retry', () => {
    it('HF API 503 시 3회 재시도 후 성공', async () => {
      let attempt = 0;
      const mockFetch = vi.fn(async () => {
        attempt++;
        if (attempt < 3) return { ok: false, status: 503 } as Response;
        return { ok: true, json: async () => [] } as Response;
      });
      const original = globalThis.fetch;
      globalThis.fetch = mockFetch as typeof fetch;
      try {
        const { withRetry } = await import('../../src/lib/utils/retry');
        const result = await withRetry(async () => {
          const res = await fetch('https://huggingface.co/api/papers');
          if (!res.ok) throw new Error(`HF API error: ${res.status}`);
          return await res.json();
        }, { retries: 3, baseDelay: 10, label: 'test-HF' });
        expect(result).toEqual([]);
        expect(attempt).toBe(3);
      } finally {
        globalThis.fetch = original;
      }
    });
  });

  describe('Promise.allSettled partial success', () => {
    it('하나가 실패해도 나머지 결과 유지', async () => {
      const [a, b] = await Promise.allSettled([
        Promise.resolve(new Map([['id1', { pass: true, score: 8, reason: 'good' }]])),
        Promise.reject(new Error('API timeout')),
      ]);
      const resultsA = a.status === 'fulfilled' ? a.value : new Map();
      const resultsB = b.status === 'fulfilled' ? b.value : new Map();
      expect(resultsA.size).toBe(1);
      expect(resultsB.size).toBe(0);
    });
  });
});
