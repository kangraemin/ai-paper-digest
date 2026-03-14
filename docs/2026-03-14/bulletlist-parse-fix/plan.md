# parseBulletList fallback에서 `,- ` 구분자 처리 추가

## 변경 파일별 상세
### `src/app/papers/[id]/page.tsx`
- **변경 이유**: DB 레거시 데이터가 `"- 항목1,- 항목2"` 형태로 저장되어 있어 `\n` split만으로는 개별 bullet로 분리 불가
- **Before**:
```typescript
function parseBulletList(value: string): string[] {
  try {
    const arr = JSON.parse(value);
    if (Array.isArray(arr)) return arr;
  } catch {}
  return value.split('\n').filter(l => l.trim()).map(l => l.replace(/^-\s*/, ''));
}
```
- **After**:
```typescript
function parseBulletList(value: string): string[] {
  try {
    const arr = JSON.parse(value);
    if (Array.isArray(arr)) return arr;
  } catch {}
  if (value.includes(',- ')) {
    return value.split(',- ').map(l => l.replace(/^-\s*/, '').trim()).filter(Boolean);
  }
  return value.split('\n').filter(l => l.trim()).map(l => l.replace(/^-\s*/, ''));
}
```
- **영향 범위**: keyFindings, evidence, howToApply 렌더링 (동일 함수 사용)

## 검증
- 검증 명령어: `npm run build`
- 기대 결과: 빌드 성공
