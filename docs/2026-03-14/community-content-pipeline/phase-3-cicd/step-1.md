# Step 1: collect.yml에 digest step 추가

## TC (Test Cases)

| # | 테스트 | 입력 | 기대 결과 |
|---|--------|------|-----------|
| TC-1 | digest step 존재 | collect.yml | "Digest community content" step 추가됨 |
| TC-2 | 순서 정확 | collect.yml | HN 수집 후, Summarize 전에 위치 |

## 실행출력

```
TC-1: grep "Digest community" .github/workflows/collect.yml
→ line 39: "- name: Digest community content" ✅

TC-2: HN 수집(line 32) → Digest(line 39) → Summarize(line 45) 순서 확인 ✅
```

✅ **결과: 2/2 PASS**
