# Step 1: content-fetcher.ts 구현

## TC (Test Cases)

| # | 테스트 | 입력 | 기대 결과 |
|---|--------|------|-----------|
| TC-1 | 정상 HTML → 텍스트 | HTML 문자열 포함 URL | script/style 제거, 태그 제거된 텍스트 반환 |
| TC-2 | maxChars 제한 | 긴 콘텐츠 + maxChars=100 | 100자 이내 반환 |
| TC-3 | fetch 실패 시 | 404 URL | 빈 문자열 반환 |
| TC-4 | 타임아웃 | 느린 URL | 빈 문자열 반환 (에러 안 남) |

## 실행출력

```
TC-1: PASS - length: 142
TC-2: PASS - length: 100
TC-3: PASS - empty: true
TC-4: PASS - empty: true
```

✅ **결과: 4/4 PASS**
