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
