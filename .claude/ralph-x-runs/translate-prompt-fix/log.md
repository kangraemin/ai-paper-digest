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
