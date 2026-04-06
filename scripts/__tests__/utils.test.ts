import { describe, it, expect } from 'vitest';
import { withRetry } from '../../src/lib/utils/retry';
import { safeJsonParse, escapeHtml } from '../../src/lib/utils/safe-json';

describe('withRetry', () => {
  it('성공 시 즉시 반환', async () => {
    const result = await withRetry(() => Promise.resolve(42));
    expect(result).toBe(42);
  });

  it('실패 후 재시도하여 성공', async () => {
    let attempt = 0;
    const result = await withRetry(() => {
      attempt++;
      if (attempt < 3) throw new Error('fail');
      return Promise.resolve('ok');
    }, { retries: 3, baseDelay: 10 });
    expect(result).toBe('ok');
    expect(attempt).toBe(3);
  });

  it('최대 재시도 초과 시 throw', async () => {
    await expect(withRetry(() => Promise.reject(new Error('always fail')),
      { retries: 2, baseDelay: 10 }
    )).rejects.toThrow('always fail');
  });

  it('baseDelay만큼 대기 후 재시도', async () => {
    const start = Date.now();
    let attempt = 0;
    await withRetry(() => {
      attempt++;
      if (attempt < 2) throw new Error('fail');
      return Promise.resolve('ok');
    }, { retries: 2, baseDelay: 50 });
    expect(Date.now() - start).toBeGreaterThanOrEqual(40);
  });
});

describe('safeJsonParse', () => {
  it('정상 JSON 파싱', () => {
    expect(safeJsonParse('["a","b"]', [])).toEqual(['a', 'b']);
  });
  it('깨진 JSON → fallback', () => {
    expect(safeJsonParse('{broken', {})).toEqual({});
  });
  it('null/undefined → fallback', () => {
    expect(safeJsonParse(null, [])).toEqual([]);
    expect(safeJsonParse(undefined, 'default')).toBe('default');
  });
  it('빈 문자열 → fallback', () => {
    expect(safeJsonParse('', [])).toEqual([]);
  });
});

describe('escapeHtml', () => {
  it('HTML 특수문자 이스케이프', () => {
    expect(escapeHtml('<script>alert("xss")</script>')).toBe(
      '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
    );
  });
  it('& 이스케이프', () => {
    expect(escapeHtml('a & b')).toBe('a &amp; b');
  });
  it('일반 텍스트는 그대로', () => {
    expect(escapeHtml('hello world')).toBe('hello world');
  });
});
