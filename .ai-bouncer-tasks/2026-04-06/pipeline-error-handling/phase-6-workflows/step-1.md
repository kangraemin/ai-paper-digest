# Step 1: 코드 리뷰 검증 — 워크플로우

## 대상 파일
- `.github/workflows/redeploy.yml` — curl --fail + retry + 시크릿 체크
- `.github/workflows/summarize.yml` — translate continue-on-error

## 테스트 케이스

| TC | 파일 | 검증 항목 | 기대 결과 | 상태 |
|----|------|----------|----------|------|
| TC-01 | redeploy.yml | curl에 --fail 플래그 | L14 `curl --fail` | ✅ |
| TC-02 | redeploy.yml | curl에 --retry 3 --retry-delay 5 | L14 `--retry 3 --retry-delay 5` | ✅ |
| TC-03 | redeploy.yml | HOOK_URL 빈 값 체크 | L13 `if [ -z "$HOOK_URL" ]; then echo "❌ ..."; exit 1; fi` | ✅ |
| TC-04 | redeploy.yml | 시크릿을 env로 분리 | L16 `env: HOOK_URL: ${{ secrets.VERCEL_DEPLOY_HOOK }}` | ✅ |
| TC-05 | summarize.yml | translate 스텝에 continue-on-error | L37 `continue-on-error: true` | ✅ |

## 리뷰 소견

### 확인 완료 (Good)
- **redeploy.yml**: `curl --fail --retry 3 --retry-delay 5 -X POST "$HOOK_URL"` (L14) + 빈 값 체크 (L13) + env 블록으로 시크릿 분리 (L15-16) — 모두 적용
- **summarize.yml**: Translate 스텝에 `continue-on-error: true` (L37) — 번역 실패해도 워크플로우 계속 진행

## 실행출력

**QA 코드 리뷰 검증 완료**

**결과: 5/5 TC 통과 ✅**
