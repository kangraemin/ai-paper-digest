import { describe, it, expect } from 'vitest';

describe('요약 파이프라인 에러핸들링', () => {
  describe('extractJson 방어', () => {
    it('코드블록 안의 JSON 추출', () => {
      const text = 'some text ```json\n{"key": "value"}\n``` more text';
      const match = text.includes('```')
        ? text.split('```')[1].replace(/^json/, '').trim()
        : text;
      expect(JSON.parse(match)).toEqual({ key: 'value' });
    });

    it('깨진 JSON → JSON.parse 실패', () => {
      const broken = '{"key": "value"';
      expect(() => JSON.parse(broken)).toThrow();
    });

    it('JSON 없는 텍스트 → match null', () => {
      const text = 'Sorry, I cannot help with that.';
      const match = text.match(/\{[\s\S]*\}/);
      expect(match).toBeNull();
    });
  });

  describe('Claude runner JSON fallback', () => {
    it('envelope 파싱 실패 시 raw text 반환', () => {
      const stdout = 'This is plain text, not JSON';
      let result;
      try {
        const envelope = JSON.parse(stdout.trim());
        result = envelope.result ?? '';
      } catch {
        result = stdout.trim();
      }
      expect(result).toBe('This is plain text, not JSON');
    });
  });
});
