import { describe, it, expect } from 'vitest';
import { firstSentence, ruleFixOneLiner, isAwkwardOneLiner, coinedNameFromTitle } from '../../src/lib/translate/one-liner-fix';

describe('firstSentence', () => {
  it('2문장째를 자른다', () => {
    expect(firstSentence('GPT-5 cuts cost by 4.1x. This highlights risk.')).toBe('GPT-5 cuts cost by 4.1x.');
  });
  it('약어 뒤에서는 자르지 않는다', () => {
    expect(firstSentence('X beats Y vs. Claude on e.g. SWE-bench.')).toBe('X beats Y vs. Claude on e.g. SWE-bench.');
  });
});

describe('coinedNameFromTitle', () => {
  it('고유 이름만 뽑는다', () => {
    expect(coinedNameFromTitle('FastAV: Efficient Token Pruning')).toBe('FastAV');
    expect(coinedNameFromTitle('Navigating Privacy Risks in Generative AI: Concerns')).toBeNull();
    expect(coinedNameFromTitle('The $\\mathbf{Y}$-Combinator for LLMs: Solving')).toBeNull();
  });
});

describe('ruleFixOneLiner', () => {
  it('A 로 시작하는 일반 명사구를 제목 이름으로 바꾼다', () => {
    const out = ruleFixOneLiner('A token pruning framework reduces compute by 40%.', 'FastAV: Efficient Token Pruning');
    expect(out).toBe('FastAV reduces compute by 40%.');
  });
  it('구체적 개체가 있는 NP 는 관사만 뗀다', () => {
    expect(ruleFixOneLiner("An 8B parameter 'Judge' model scores each step.")).toBe("8B parameter 'Judge' model scores each step.");
  });
  it('A study demonstrates 를 벗긴다', () => {
    const out = ruleFixOneLiner('A study demonstrates that while Cursor boosts speed, it slows velocity.');
    expect(out).toBe('Cursor boosts speed but slows velocity.');
  });
  it('고칠 수 없으면 어색함으로 남긴다 (LLM 재작성 대상)', () => {
    expect(isAwkwardOneLiner(ruleFixOneLiner('A technique that removes steps reduces tokens.'))).toBe(true);
  });
});
