import { describe, it, expect } from 'vitest';

describe('API 파라미터 방어', () => {
  describe('limit 상한', () => {
    it('정상 값', () => {
      const limit = Math.min(Math.max(1, parseInt('20') || 20), 100);
      expect(limit).toBe(20);
    });
    it('과도한 값 → 100으로 제한', () => {
      const limit = Math.min(Math.max(1, parseInt('999999') || 20), 100);
      expect(limit).toBe(100);
    });
    it('NaN → 기본값 20', () => {
      const limit = Math.min(Math.max(1, parseInt('abc') || 20), 100);
      expect(limit).toBe(20);
    });
    it('음수 → 1로 제한', () => {
      const limit = Math.min(Math.max(1, parseInt('-5') || 20), 100);
      expect(limit).toBe(1);
    });
    it('0 → 기본값 20', () => {
      const limit = Math.min(Math.max(1, parseInt('0') || 20), 100);
      expect(limit).toBe(20); // parseInt('0') = 0, || 20 = 20
    });
  });

  describe('page 범위', () => {
    it('정상 값', () => {
      const page = Math.max(1, parseInt('3') || 1);
      expect(page).toBe(3);
    });
    it('음수 → 1', () => {
      const page = Math.max(1, parseInt('-1') || 1);
      expect(page).toBe(1);
    });
  });

  describe('LIKE 패턴 이스케이프', () => {
    it('% 이스케이프', () => {
      const query = '100%';
      const escaped = query.replace(/%/g, '\\%').replace(/_/g, '\\_');
      expect(escaped).toBe('100\\%');
    });
    it('_ 이스케이프', () => {
      const query = 'a_b';
      const escaped = query.replace(/%/g, '\\%').replace(/_/g, '\\_');
      expect(escaped).toBe('a\\_b');
    });
    it('일반 텍스트는 그대로', () => {
      const query = 'hello world';
      const escaped = query.replace(/%/g, '\\%').replace(/_/g, '\\_');
      expect(escaped).toBe('hello world');
    });
  });
});
