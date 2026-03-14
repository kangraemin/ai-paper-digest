# PaperCard "For:" 라벨 수정

## 변경 파일별 상세
### `src/components/paper-card.tsx`
- **변경 이유**: targetAudience 장문 → aiCategory 기반 짧은 라벨 매핑
- **Before**: `For: {targetAudience}` (2~3문장 장문 표시)
- **After**: `For: {audienceLabel[aiCategory]}` ("AI Engineers" 등 짧은 라벨)

## 검증
- `npm run build` 성공
