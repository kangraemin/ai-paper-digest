# Phase 2 - Step 1: AlgoliaHNHit 타입 정의

## TC

| TC | 검증 항목 | 기대 결과 | 상태 |
|----|----------|----------|------|
| TC-01 | AlgoliaHNHit export 존재 | import 가능 | ✅ |
| TC-02 | 필수 필드 포함 | objectID, title, url, points, author, created_at_i, num_comments | ✅ |
| TC-03 | 기존 HNItem 유지 | import 가능 | ✅ |

## 실행출력

TC-01~03: `npx tsx -e "import { AlgoliaHNHit, HNItem } from './src/lib/hacker-news/client'; const x: AlgoliaHNHit = { objectID: '1', title: 't', points: 1, author: 'a', created_at_i: 1, num_comments: 0 }; console.log('AlgoliaHNHit OK', typeof x); const y: HNItem = { id: 1, title: 't', score: 1, by: 'a', time: 1, descendants: 0, type: 'story' }; console.log('HNItem OK', typeof y);"`
→ AlgoliaHNHit OK object
→ HNItem OK object
