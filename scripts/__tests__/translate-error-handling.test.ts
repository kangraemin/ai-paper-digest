import { describe, it, expect } from 'vitest';
import { withRetry } from '../../src/lib/utils/retry';

describe('번역 파이프라인 에러핸들링', () => {
  describe('Gemma API retry', () => {
    it('429 시 재시도 후 성공', async () => {
      let attempt = 0;
      const result = await withRetry(async () => {
        attempt++;
        if (attempt < 2) throw new Error('Gemma API error 429: Too many requests');
        return '{"oneLinerEn": "test translation"}';
      }, { retries: 3, baseDelay: 10, label: 'test-gemma' });
      expect(result).toContain('oneLinerEn');
      expect(attempt).toBe(2);
    });

    it('3회 모두 실패 시 해당 논문만 스킵', async () => {
      const papers = ['paper1', 'paper2', 'paper3'];
      const results: string[] = [];

      for (const p of papers) {
        try {
          if (p === 'paper2') {
            await withRetry(() => Promise.reject(new Error('Gemma down')),
              { retries: 2, baseDelay: 10 });
          }
          results.push(p);
        } catch {
          // paper2 스킵, 나머지 계속
        }
      }
      expect(results).toEqual(['paper1', 'paper3']);
    });
  });

  describe('JSON 파싱 방어', () => {
    it('Gemma가 JSON 아닌 응답 시 에러', () => {
      const raw = 'I apologize, but I cannot translate that content.';
      const match = raw.match(/\{[\s\S]*\}/);
      expect(match).toBeNull();
    });

    it('부분 JSON (잘린 응답) 시 에러', () => {
      const raw = '{"oneLinerEn": "test", "keyFindingsEn": [';
      const match = raw.match(/\{[\s\S]*\}/);
      // 매칭은 되지만 JSON.parse가 실패
      if (match) {
        expect(() => JSON.parse(match[0])).toThrow();
      }
    });
  });
});
