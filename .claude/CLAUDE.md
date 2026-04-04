## 작업 후 정리
- 작업 완료 후 백그라운드 dev 서버/웹 프로세스를 모두 종료한다 (3000 포트 포함).
- `rm -rf .next` 등 빌드 캐시 삭제 후 리빌드한다.

## GitHub Actions 워크플로우 트리거 금지
- `gh workflow run` 등 워크플로우 수동 트리거는 절대 사용자 확인 없이 실행하지 않는다.
- API 비용이 발생하는 작업이므로 반드시 먼저 물어볼 것.

## 로컬 DB 금지
- 로컬 SQLite DB(`papers.db` 등)는 절대 참조하지 않는다. 존재해도 무시할 것.
- DB 확인이 필요하면 항상 리모트 DB(`.env`의 `DATABASE_URL`)를 사용한다. 사용자에게 묻지 말 것.

## Drizzle ORM 쿼리
- `.where()` 조건 조합 시 JS `&&`/`||` 연산자 사용 금지. 반드시 `and()`/`or()` 사용.
- 예: `.where(and(isNull(papers.summarizedAt), notInArray(papers.source, [...])))` (JS `&&`는 Drizzle SQL 객체를 truthy로 평가해 조건이 무시됨)

## 임시 스크립트
- 디버그/확인용 임시 스크립트는 `scripts/` 디렉토리가 아닌 `/tmp/`에 생성한다.
- 재사용 가능한 유틸리티만 `scripts/`에 커밋한다.

## DB 데이터 조작
- 코드 파일 변경 없이 DB INSERT/UPDATE만 하는 작업은 `/dev-bounce` 생략하고 직접 실행한다.
- 기존 데이터 복사 + 필드 수정 요청 시 `INSERT INTO ... SELECT` 패턴을 우선 사용한다 (UPDATE 금지, 원본 보존).
