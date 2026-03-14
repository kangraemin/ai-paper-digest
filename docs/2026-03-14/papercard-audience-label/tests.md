| TC | 검증 항목 | 기대 결과 | 상태 |
|----|----------|----------|------|
| TC-01 | audienceLabel 매핑 존재 | prompting→Prompt Engineers 등 8개 매핑 | ✅ |
| TC-02 | For: 텍스트가 짧은 라벨 | targetAudience 장문 대신 카테고리 기반 라벨 사용 | ✅ |
| TC-03 | npm run build 성공 | 빌드 에러 없음 | ✅ |

## 실행출력

TC-01: grep -c audienceLabel src/components/paper-card.tsx
→ audienceLabel 매핑 8개 확인 (prompting, rag, agent, fine-tuning, finetuning, eval, cost-speed, cost, security)

TC-02: 코드 확인 — `audienceLabel[aiCategory ?? ''] ?? 'All Devs'` 사용, targetAudience 직접 표시 제거

TC-03: npm run build
→ ✓ Compiled successfully, 빌드 에러 없음
