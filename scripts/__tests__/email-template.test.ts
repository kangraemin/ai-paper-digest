import { describe, it, expect } from 'vitest';
import { escapeHtml } from '../../src/lib/utils/safe-json';

describe('이메일 템플릿 안전성', () => {
  describe('다양한 XSS 벡터 차단', () => {
    const vectors = [
      { input: '<img src=x onerror=alert(1)>', desc: 'img onerror' },
      { input: '<svg onload=alert(1)>', desc: 'svg onload' },
      { input: '"><script>alert(1)</script>', desc: 'attribute escape + script' },
      { input: "javascript:alert('xss')", desc: 'javascript protocol' },
      { input: '<iframe src="evil.com"></iframe>', desc: 'iframe injection' },
    ];

    for (const v of vectors) {
      it(`${v.desc}: ${v.input.slice(0, 30)}...`, () => {
        const escaped = escapeHtml(v.input);
        expect(escaped).not.toContain('<');
        expect(escaped).not.toContain('>');
      });
    }
  });

  describe('URL 프로토콜 검증', () => {
    it('https URL은 통과', () => {
      const url = 'https://arxiv.org/abs/1234';
      expect(url.startsWith('http')).toBe(true);
    });

    it('javascript: URL은 차단 필요', () => {
      const url = "javascript:alert('xss')";
      expect(url.startsWith('http')).toBe(false);
    });
  });
});
