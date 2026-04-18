# Ralph-X Work Log
Task: Gemma 번역 프롬프트 개선 + 재번역 + 평가
Started: 2026-04-18

## 배경
- scripts/translate.ts의 TRANSLATE_PROMPT가 one_liner_en을 "This is a/an..." 패턴으로 번역
- 50개 샘플 분석 결과 약 40%가 이 패턴 (번역 투가 심함)
- 영문 유저 체류 9초로 낮음 → 영문 품질 개선 필요
- Gemma-3-27b-it (Google AI API) 사용 중

## 문제 패턴
❌ "This is an experimental case demonstrating that..."
❌ "This is a real-world case where..."
❌ "This is an educational project implementing..."
❌ "This is a user experience where..."
❌ "This is a workflow sharing post about..."

## 좋은 패턴
✅ 결론/수치부터 시작: "Google has released... achieving 70% reduction"
✅ 흥미로운 발견: "LLM responses can shrink by 48% with a single instruction"
✅ 직접적: "We actually hacked AI Agents... 44% attack success rate"

## 완료 조건
- [ ] 랜덤 100개 중 95개 이상 어색한 번역 없음


## Iteration 1: 프롬프트 규칙 추가

### 변경 내용
`scripts/translate.ts`의 `TRANSLATE_PROMPT`에 `oneLinerEn` 전용 규칙 추가:
- "This is a/an..." 패턴 명시적 금지
- "핵심 발견/수치/릴리즈/액션으로 시작하라" 지시
- Good/Bad 예시 2쌍 포함 (Gemma가 few-shot 예시에 잘 반응)
- 최대 2문장 제한

### 근거
- Gemma-3-27b-it는 구체적 예시가 있을 때 패턴 회피율이 높음
- "NEVER start with" 같은 강한 금지어가 약한 권고("avoid")보다 효과적
- 기존 규칙은 oneLiner에 대한 별도 지시가 전혀 없었음

### 다음 단계
- 재번역 실행 후 "This is" 패턴 비율 측정 (목표: 40% → 5% 이하)

## Iteration 2: Evaluation Result

**Status: FAIL**

- Valid samples: 10/50 (40 failed with 429 rate limit errors)
- Awkward `one_liner_en`: 5/10 (50%) — far exceeds ≤5% threshold
- `key_findings_en` and `how_to_apply_en`: 0 issues across all 10 samples

**Root cause:** Iteration 1 fixed literal "This is a/an..." but the model bypasses it with equivalent patterns:
- Noun phrase descriptors: "A comprehensive paper detailing..."
- Noun phrase frameworks: "A three-step framework for..."
- Vague actor: "A developer shares..."
- Product definition: "[Name] is a [type] for..."
- "This project...": "This project details building..."

**Next action:** Add structural blocking rules to the prompt — target the 4 bypass patterns + add a positive constraint ("must be a complete sentence with finding/result as subject"). Also address API 429 errors with retry/backoff before next eval run.


## Iteration 4: Prompt restructure — self-check + rewrite examples

### 변경 내용
scripts/translate.ts의 oneLinerEn 규칙을 전면 재구성:

1. MANDATORY STRUCTURE 추가: [WHO/WHAT] + [ACTIVE VERB] + [RESULT] 포맷 강제
2. SELF-CHECK 단계 추가: 출력 전 4가지 체크리스트로 자체 검증 → 실패 시 rewrite
3. Bad→Fixed 변환 예시 8쌍: iter 3 eval에서 실제 실패한 문장을 Bad로 사용
4. BANNED OPENERS 리스트 제거: SELF-CHECK의 4개 조건으로 통합

### 근거
- Iter 3에서 BANNED OPENERS에 나열된 패턴도 여전히 43% 발생 → 나열식 금지는 Gemma에서 한계
- 생성→검증→재작성 프레임이 생성 시 금지 프레임보다 LLM에서 더 잘 작동
- 실제 실패 사례의 Bad→Fixed 변환이 추상적 규칙보다 패턴 학습에 효과적

### 다음 단계
- 재번역 실행 후 평가. 목표: 43% → 10% 이하

## Iteration 4: Evaluation Result

**Status: FAIL**

- Total samples evaluated: 100/100
- Awkward count: 16/100 (16%)
- Threshold: ≤5

**Field breakdown:**
- `oneLinerEn`: 15 issues
- `keyFindingsEn`: 1 issue (hn_46319826 — "Researchers at..." opener)
- `howToApplyEn`: 0 issues

**Major improvement vs Iter 3:** 43% → 16% awkward rate.

**Root cause — dominant pattern (11/16): Multi-sentence oneLinerEn**
Model generates a solid first sentence, then appends a second generic editorial sentence:
- "This approach directly leverages..." trailer
- "This highlights fundamental..." second sentence
- "It serves as a hands-on reference..." filler
- "This is significant as it aims for..." opener

The prompt says "max 2 sentences" — model treats this as permission. Need: "EXACTLY ONE sentence."

**Other patterns (5/16):**
- "Researchers [verb]..." opener (3 cases): discovered, explore, introduce
- "This [type]..." opener (2 cases): "This framework...", "This educational project..."

**Next action (Iter 5):**
1. Change "max 2 sentences" → "EXACTLY ONE sentence. Never write two."
2. SELF-CHECK: add "Starts with 'This'?" → hard fail
3. SELF-CHECK: add "Starts with 'Researchers [verb]'?" → hard fail
4. SELF-CHECK: add "Second sentence appended?" → hard fail
5. Add 3 Bad→Fixed examples for two-sentence compression


## Iteration 6: Evaluation Result

**Status: FAIL**

- Total samples evaluated: 100/100
- Awkward count: 25/100
- Threshold: ≤5

**Field breakdown:**
- `one_liner_en`: 24 issues
- `key_findings_en`: 1 issue (`77b7336a...` — "This provides a practical approach..." in key_findings item)
- `how_to_apply_en`: 0 issues

**Dominant pattern (18/24): Two-sentence one_liner_en**
Despite "EXACTLY ONE sentence" instruction and SELF-CHECK, model still appends a second sentence with these trailer starters:
- "The [noun] [demonstrates/highlights/marks/introduces/improves]..." (7 cases)
- "This [demonstrates/breakthrough/highlights/marks]..." (6 cases)
- "It [serves/offers/provides]..." (3 cases)
- Other second-sentence expansions (2 cases)

**Secondary pattern (6/24): "This [noun]..." openers**
Bypass forms: "This work...", "This guide...", "This project...", "This framework...", "This open-source...", "This RAG-based..."

**Note on regression vs iter 4 (16% -> 25%):** Different sample set; the 2-sentence count increased (11->18) while "This/Researchers" openers decreased (8->6).

**Next action:** Explicitly enumerate banned trailer starters in SELF-CHECK + add 2-sentence->1-sentence compression examples + strengthen one-sentence enforcement with explicit compression instruction.


## Iteration 7: Prompt strategy overhaul — word limit + simplified rules

### 변경 내용
scripts/translate.ts의 oneLinerEn 규칙을 근본적으로 재설계:

1. **Word limit 추가**: 15-35 words 하드 제약 — 물리적으로 2문장 생성 어렵게
2. **Post-generation truncation 지시**: period 이후 텍스트 있으면 DELETE하고 첫 문장에 fold
3. **SELF-CHECK 7개 항목 제거 → BANNED PATTERNS 5개로 단순화**: Gemma가 다단계 체크리스트를 안정적으로 실행 못함
4. **Rewrite 예시를 iter 6 실패 사례 기반으로 교체**: 7쌍 (2-sentence compression 4쌍 + This opener 3쌍)
5. **This 차단 강화**: STRUCTURE + BANNED PATTERNS 양쪽에서 이중 차단

### 근거
- Iter 4→6에서 SELF-CHECK 항목 늘렸지만 16%→25%로 악화 → 복잡한 체크리스트는 역효과
- Word limit은 모델 생성 길이를 직접 제한, 규칙 이해 능력에 의존 안 함
- 실제 실패 사례 기반 예시가 추상 규칙보다 효과적 (iter 4에서 검증)

### 다음 단계
- 재번역 실행 후 평가. 목표: 25% → 10% 이하

## Iteration 8: Simplify + fix contradictions + tighten word limit

### 변경 내용
scripts/translate.ts의 oneLinerEn 규칙을 단순화 + 모순 제거:

1. **Word limit 축소**: 15-35 → 15-30 words — 2문장 물리적 여지 추가 축소
2. **모순 제거**: "An LLM now powers..." 예시가 "A/An 금지" 규칙과 충돌 → 해당 예시 삭제
3. **규칙 구조 단순화**: BANNED PATTERNS 5개 + STRUCTURE → HARD RULES 3개로 통합
   - Rule 1: period 2개 이상 → FAILED
   - Rule 2: This/The/A/An/Researchers로 시작 → FAILED
   - Rule 3: "is a [type] for/that" 패턴 → FAILED
4. **FIRST WORD 제약 강화**: 별도 라인으로 분리, "No other opener is acceptable" 추가
5. **Bad→Good 예시 업데이트**: iter 6 eval의 실패 사례 추가 (Claude Opus 4.6 2문장→1문장 압축)
6. **GOOD EXAMPLES 4개로 축소**: 핵심만 남기고 정보량 줄임 (Gemma 과부하 방지)

### 근거
- Iter 7의 BANNED PATTERNS 5개 + REWRITE EXAMPLES 7쌍 + GOOD EXAMPLES 5개 = 너무 많은 규칙
- Gemma-3-27b-it는 규칙이 많으면 일부를 무시하는 경향 (iter 4→6에서 확인)
- "An LLM..." 예시가 A/An 금지 규칙을 약화시켰을 가능성 — 모순 제거로 일관성 확보
- 3개 HARD RULES은 각각 독립적이고 기계적으로 검증 가능 → 모호성 감소

### 다음 단계
- 재번역 실행 후 평가. 목표: 25% → 10% 이하


## Iteration 8: Evaluation Result

**Status: FAIL**

- Total samples evaluated: 49/50 (1 Gemma API 429 error excluded)
- Awkward count: 35/49 (71%)
- Threshold: ≤5

**Field breakdown:**
- `oneLinerEn`: 34 issues
- `keyFindingsEn`: 1 issue (`77b7336a` — "This provides a practical approach to...")
- `howToApplyEn`: 0 issues

**Dominant patterns (frequency order):**
1. **Two-sentence one_liner (18 cases)**: Model writes good first sentence, appends editorial trailer. Word limit 15-30 not preventing it — two short sentences each fit within range. Period-count Rule being ignored.
2. **"A/An [noun/type]..." openers (12 cases)**: Rule 2 banning A/An starters ignored. Model defaults to training-data descriptor patterns for academic/technical content.
3. **"This [type]..." openers (3 cases)**: Early-iteration banned pattern still appearing.
4. **"Researchers/Research [verb]..." (2 cases)**: Still present despite explicit ban.

**Why current approach is failing:** After 8 iterations of adding constraints (HARD RULES, word limits, BANNED PATTERNS, SELF-CHECK), total prompt complexity has reached a point where the model ignores rules under cognitive load and falls back to training defaults.

**Next action:** Replace HARD RULES with mandatory output template: `[SUBJECT not A/An/This/The/Researchers] [active verb] [specific result]`. Add explicit: "Count the periods. If 2 or more — DELETE second sentence, compress into first." Provide 6 Bad→Good rewrites targeting two-sentence compression and A/An descriptor openers.


## Iteration 9: Evaluation Result

**Status: FAIL**

- Total samples evaluated: 50/50
- Awkward count: 33/50 (66%)
- Threshold: ≤5

**Field breakdown:**
- `oneLinerEn`: 33 issues
- `keyFindingsEn`: 0 issues
- `howToApplyEn`: 0 issues

**Issue breakdown (by pattern):**
1. Two-sentence oneLinerEn (16 cases): Model appends editorial second sentence — "This approach...", "It lowers...", "The platform also..."
2. "A/An [descriptor noun]..." openers (12+ cases): "A comprehensive survey...", "A benchmark dataset...", "A developer shares...", "An experiment prompting..." — meta-describing content type instead of stating finding
3. "This [noun]..." + "X is a [type] that..." openers (8 cases): "This multi-agent framework...", "ProofShot is an open-source CLI that...", "CanIRun.ai is a web tool that..."
4. "Researchers/Research [verb]..." openers (3 cases)

**Good news:** keyFindingsEn and howToApplyEn are fully clean across all 50 samples. Those fields are solved.

**Root cause:** After 9 iterations of negative constraints (banned patterns, HARD RULES, SELF-CHECK, word limits), the model bypasses them via infinite pattern variations. Negative rules cannot enumerate all bypass paths.

**Next action (Iter 10):**
Replace constraint-based approach with mandatory positive fill-in-the-blank template:
`[SPECIFIC SUBJECT (product/company/concept)] [ACTIVE VERB] [RESULT]`
Where "A/An [noun]", "This [noun]", "Researchers", "X is a [type]" are prohibited as SUBJECTS.
Add: AFTER WRITING — count periods, if >1, delete everything after first period.
Provide 5 Bad→Good rewrites targeting specific remaining patterns from this eval.
