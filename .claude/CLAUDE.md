## 작업 후 정리
- 작업 완료 후 백그라운드 dev 서버/웹 프로세스를 모두 종료한다 (3000 포트 포함).
- `rm -rf .next` 등 빌드 캐시 삭제 후 리빌드한다.

## DB 데이터 조작
- 코드 파일 변경 없이 DB INSERT/UPDATE만 하는 작업은 `/dev-bounce` 생략하고 직접 실행한다.
- 기존 데이터 복사 + 필드 수정 요청 시 `INSERT INTO ... SELECT` 패턴을 우선 사용한다 (UPDATE 금지, 원본 보존).

# --- ai-bouncer-rule start ---
## ai-bouncer
코드 수정 / 기능 구현 / 파일 변경 / 버그 수정 등 개발 작업 시 반드시 `/dev-bounce` 스킬을 먼저 호출할 것.
# --- ai-bouncer-rule end ---
