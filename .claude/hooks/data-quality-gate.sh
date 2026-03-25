#!/bin/bash
# data-quality-gate: Stop hook
# 오늘 요약한 논문/커뮤니티 데이터 품질 검사
# - glossary 형식 (object 필수, array 금지) → 자동 수정
# - 번역 필드 누락 (one_liner_en, key_findings_en, target_audience_en, tags_en, glossary_en)
# - 요약 품질 부실 (one_liner 너무 짧음, key_findings 항목 수 부족, 내용 없음)
# 문제 발견 시 세션 종료 차단

REPO_ROOT=$(git rev-parse --show-toplevel 2>/dev/null || echo ".")
ENV_FILE="$REPO_ROOT/.env"

[ -f "$ENV_FILE" ] || exit 0

export $(grep -E '^(TURSO_DATABASE_URL|TURSO_AUTH_TOKEN)' "$ENV_FILE" | xargs) 2>/dev/null
[ -z "$TURSO_DATABASE_URL" ] || [ -z "$TURSO_AUTH_TOKEN" ] && exit 0

NODE_PATH="$REPO_ROOT/node_modules"

RESULT=$(NODE_PATH="$NODE_PATH" npx --prefix "$REPO_ROOT" tsx -e "
(async () => {
  const { createClient } = await import('@libsql/client');
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  const r = await client.execute(
    \`SELECT id, source, title, glossary, glossary_en,
            one_liner_en, key_findings_en, target_audience_en, tags_en,
            evidence_en, how_to_apply_en,
            one_liner, key_findings
     FROM papers
     WHERE summarized_at >= date('now')
     ORDER BY source, collected_at DESC\`
  );

  const issues = [];
  const fixed = [];

  for (const row of r.rows) {
    const id = String(row.id);
    const title = String(row.title).slice(0, 50);

    // 1. glossary 형식 검사: 배열이면 자동 수정
    if (row.glossary) {
      try {
        const parsed = JSON.parse(String(row.glossary));
        if (Array.isArray(parsed)) {
          // 자동 수정: 'Term: Definition' → {Term: Definition}
          const obj = {};
          for (const item of parsed) {
            const s = String(item);
            const idx = s.indexOf(': ');
            if (idx > 0) {
              obj[s.slice(0, idx)] = s.slice(idx + 2);
            } else {
              obj[s] = '';
            }
          }
          await client.execute({
            sql: 'UPDATE papers SET glossary=? WHERE id=?',
            args: [JSON.stringify(obj), id],
          });
          fixed.push(id + ': glossary 배열→오브젝트 자동 수정');
        }
      } catch {}
    }

    // 2. 번역 필드 누락 검사
    const missing = [];
    if (row.one_liner && !row.one_liner_en) missing.push('one_liner_en');
    if (row.key_findings && !row.key_findings_en) missing.push('key_findings_en');
    if (row.glossary && !row.glossary_en) missing.push('glossary_en');
    if (!row.target_audience_en) missing.push('target_audience_en');
    if (!row.tags_en) missing.push('tags_en');
    if (!row.evidence_en) missing.push('evidence_en');
    if (!row.how_to_apply_en) missing.push('how_to_apply_en');

    if (missing.length > 0) {
      issues.push('[번역누락] [' + (row.source || '?') + '] ' + id + ' (' + title + '): ' + missing.join(', '));
    }

    // 3. 요약 품질 검사
    const qualityProblems = [];

    // one_liner: 30자 미만이면 부실
    const oneLiner = String(row.one_liner || '');
    if (!oneLiner || oneLiner.length < 30) {
      qualityProblems.push('one_liner 부실(' + oneLiner.length + '자)');
    }

    // key_findings: 파싱 후 항목 수 2개 미만이거나 각 항목이 20자 미만
    if (row.key_findings) {
      try {
        const findings = JSON.parse(String(row.key_findings));
        if (!Array.isArray(findings) || findings.length < 2) {
          qualityProblems.push('key_findings 항목 부족(' + (Array.isArray(findings) ? findings.length : 0) + '개)');
        } else {
          const shallow = findings.filter(f => String(f).length < 20);
          if (shallow.length > 0) qualityProblems.push('key_findings 내용 부실(' + shallow.length + '개 20자 미만)');
        }
      } catch {
        qualityProblems.push('key_findings JSON 파싱 실패');
      }
    } else {
      qualityProblems.push('key_findings 없음');
    }

    if (qualityProblems.length > 0) {
      issues.push('[품질부실] [' + (row.source || '?') + '] ' + id + ' (' + title + '): ' + qualityProblems.join(', ') + ' → 재요약 필요');
    }
  }

  const output = { issues, fixed, total: r.rows.length };
  console.log(JSON.stringify(output));
})();
" 2>/dev/null)

ISSUES=$(echo "$RESULT" | python3 -c "import json,sys; d=json.loads(sys.stdin.read()); print('\n'.join(d.get('issues',[])))" 2>/dev/null)
FIXED=$(echo "$RESULT" | python3 -c "import json,sys; d=json.loads(sys.stdin.read()); print('\n'.join(d.get('fixed',[])))" 2>/dev/null)
TOTAL=$(echo "$RESULT" | python3 -c "import json,sys; d=json.loads(sys.stdin.read()); print(d.get('total',0))" 2>/dev/null)

if [ -n "$FIXED" ]; then
  echo "✅ [data-quality-gate] 자동 수정됨:"
  echo "$FIXED"
fi

if [ -n "$ISSUES" ]; then
  echo ""
  echo "⛔ [data-quality-gate] 오늘 요약 데이터에 문제가 있습니다 (총 ${TOTAL}개 검사):"
  echo "$ISSUES"
  echo ""
  echo "[번역누락] → 번역 완료 후 종료"
  echo "[품질부실] → 해당 아이템 재요약 후 종료"
  jq -n '{decision: "block", reason: "오늘 요약 데이터에 문제가 있습니다 (번역 누락 또는 품질 부실). 위 목록을 해결한 후 종료하세요."}'
  exit 0
fi

exit 0
