# Step 1: 테스트 케이스 정의 — 워크플로우

## 대상 파일
- `.github/workflows/redeploy.yml` — curl --fail + retry + 시크릿 체크
- `.github/workflows/summarize.yml` — translate continue-on-error

## 테스트 케이스

| TC | 파일 | 검증 항목 | 기대 결과 | 상태 |
|----|------|----------|----------|------|
| TC-01 | redeploy.yml | curl에 --fail 플래그 | `curl --fail` 존재 | ⬜ |
| TC-02 | redeploy.yml | curl에 --retry 3 --retry-delay 5 | 3회 재시도 + 5초 대기 | ⬜ |
| TC-03 | redeploy.yml | HOOK_URL 빈 값 체크 | 빈 값이면 에러 + early exit | ⬜ |
| TC-04 | redeploy.yml | 시크릿을 env로 분리 | `env:` 블록에서 시크릿 참조 | ⬜ |
| TC-05 | summarize.yml | translate 스텝에 continue-on-error | `continue-on-error: true` 존재 | ⬜ |

## 실행출력
(Dev가 구현 후 코드 리뷰로 채워짐)
