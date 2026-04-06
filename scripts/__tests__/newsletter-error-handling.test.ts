import { describe, it, expect } from 'vitest';
import { escapeHtml } from '../../src/lib/utils/safe-json';

describe('뉴스레터 에러핸들링', () => {
  describe('이메일 템플릿 XSS 방지', () => {
    it('paper 타이틀의 HTML 태그 이스케이프', () => {
      const title = '<img src=x onerror=alert(1)>';
      const escaped = escapeHtml(title);
      expect(escaped).not.toContain('<img');
      expect(escaped).toContain('&lt;img');
    });

    it('oneLiner의 스크립트 이스케이프', () => {
      const oneLiner = 'Normal text <script>alert("xss")</script>';
      const escaped = escapeHtml(oneLiner);
      expect(escaped).not.toContain('<script>');
    });

    it('정상 텍스트는 변형 없음', () => {
      const normal = 'Claude API를 사용한 RAG 파이프라인 구축';
      expect(escapeHtml(normal)).toBe(normal);
    });
  });
});
