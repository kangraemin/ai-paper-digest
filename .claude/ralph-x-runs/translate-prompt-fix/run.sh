#!/bin/bash
# Ralph-X Auto-generated Loop
# Task: Gemma 번역 프롬프트 개선 + 샘플 테스트 + 평가
# Pipeline: 프롬프트 개선 → 랜덤 100개 샘플 번역(파일) → 평가+회고
# Max iterations: 10
# RUN_ID: translate-prompt-fix
# NOTE: DB에 절대 쓰지 않음. 결과는 파일로만 저장.

set -euo pipefail

RUN_DIR=".claude/ralph-x-runs/translate-prompt-fix"
LOG_FILE="$RUN_DIR/log.md"
CHECKLIST_FILE="$RUN_DIR/checklist.md"
MAX_ITER=10

PROMPT_DIR=$(mktemp -d)

cat > "$PROMPT_DIR/step1.txt" << 'S1EOF'
You are in a Ralph-X loop improving an English translation prompt.

Task: Improve the TRANSLATE_PROMPT in scripts/translate.ts so that one_liner_en reads like natural English tech writing.

Read .claude/ralph-x-runs/translate-prompt-fix/log.md for full context and previous iteration results/feedback.

What to do:
1. Read scripts/translate.ts — focus on TRANSLATE_PROMPT
2. If this is iteration 1: add a specific rule for one_liner_en (no "This is a/an...", lead with key finding/metric, max 2 sentences, good/bad examples)
   If iteration 2+: read the eval from previous iteration in .claude/ralph-x-runs/translate-prompt-fix/eval.md and refine the prompt based on what still failed
3. Edit scripts/translate.ts with the improved prompt
4. Append summary of what you changed to .claude/ralph-x-runs/translate-prompt-fix/log.md

Work autonomously. Do NOT ask questions. Do NOT commit or push.
S1EOF

cat > "$PROMPT_DIR/step2.txt" << 'S2EOF'
You are in a Ralph-X loop testing a translation prompt.

Task: Pick 100 random papers from the DB, run them through the CURRENT Gemma translation prompt (from scripts/translate.ts), and save results to a file. DO NOT write anything to the DB.

Read .claude/ralph-x-runs/translate-prompt-fix/log.md for context.

What to do:
1. Source env: `source .env`
2. Query 100 random papers from DB (one_liner only, no DB writes):
   SELECT id, title, one_liner FROM papers WHERE summarized_at IS NOT NULL AND one_liner IS NOT NULL ORDER BY RANDOM() LIMIT 100
   Use npx tsx with @libsql/client (async function pattern, not top-level await).
3. Read the current TRANSLATE_PROMPT from scripts/translate.ts
4. For each paper, call the Gemma API directly using src/lib/gemma/client.ts callGemma() to translate just the one_liner field.
   Input: { oneLiner: "<korean text>" }
   Expected output key: oneLinerEn
5. Save ALL results to .claude/ralph-x-runs/translate-prompt-fix/samples.json:
   [ { "id": "...", "title": "...", "one_liner_ko": "...", "one_liner_en": "..." }, ... ]
   OVERWRITE the file each iteration.
6. Append progress summary to .claude/ralph-x-runs/translate-prompt-fix/log.md

Work autonomously. Do NOT ask questions. Do NOT write to the DB under any circumstances.
S2EOF

cat > "$PROMPT_DIR/step3.txt" << 'S3EOF'
You are in a Ralph-X loop evaluating translation quality.

Task: Read samples.json, evaluate all 100 translations, write detailed assessment + retrospective.

Read .claude/ralph-x-runs/translate-prompt-fix/log.md and .claude/ralph-x-runs/translate-prompt-fix/checklist.md for context.

What to do:
1. Read .claude/ralph-x-runs/translate-prompt-fix/samples.json (100 translated samples)
2. Evaluate ALL fields for each sample — mark as AWKWARD if any of:
   [one_liner_en]
   - Starts with "This is a/an..." or "This is a [content type] that/where..."
   - Obvious Korean sentence structure
   - Overly formal/passive ("serves as a warning about", "is characterized by", "aims to")
   - Too long (3+ sentences)
   - Vague opener ("A new study...", "Researchers found...")
   [key_findings_en / how_to_apply_en items]
   - Starts with "This is..." pattern
   - Obvious translation artifact phrases
   - Unnatural English phrasing
   - Missing context that makes the item confusing
3. Count AWKWARD samples out of 100 (a sample is awkward if ANY field is awkward). Pass condition: ≤5 awkward
4. Write .claude/ralph-x-runs/translate-prompt-fix/eval.md (OVERWRITE each iteration):
   ## Iteration Result
   - Status: PASS / FAIL
   - Awkward count: X/100
   - Breakdown: one_liner issues: X, key_findings issues: X, how_to_apply issues: X

   ## Awkward Examples
   (list all awkward ones with id + which field + the bad text + why it's awkward)

   ## Good Examples
   (list 5+ good ones across all fields)

   ## Retrospective
   - Which fields still have the most issues
   - What the prompt should fix next iteration
   - What worked well

5. Append summary to .claude/ralph-x-runs/translate-prompt-fix/log.md
6. If PASS (≤5 awkward): mark checklist done → change "- [ ]" to "- [x]" in .claude/ralph-x-runs/translate-prompt-fix/checklist.md
7. If FAIL: leave checklist as-is so next iteration runs

Work autonomously. Do NOT ask questions. Do NOT write to the DB.
S3EOF

# Main loop
for i in $(seq 1 $MAX_ITER); do
  echo "━━━ Ralph-X iteration $i/$MAX_ITER ━━━"

  # Check if all checklist items are done
  if [ -f "$CHECKLIST_FILE" ] && ! grep -q '^\- \[ \]' "$CHECKLIST_FILE" 2>/dev/null; then
    echo "✅ All checklist items complete!"
    break
  fi

  # Step 1: 프롬프트 개선 (opus)
  echo "▶ Step 1: 프롬프트 개선 (opus)"
  claude -p --model claude-opus-4-6 "$(cat "$PROMPT_DIR/step1.txt")"

  # Step 2: 랜덤 100개 샘플 번역 → 파일 저장 (DB 안 건드림, 스크립트 직접 실행)
  echo "▶ Step 2: 100개 샘플 번역 → 파일 저장 (스크립트)"
  source .env && TURSO_DATABASE_URL=$TURSO_DATABASE_URL TURSO_AUTH_TOKEN=$TURSO_AUTH_TOKEN GEMINI_API_KEY=$GEMINI_API_KEY npx tsx scripts/test-translate.ts

  # Step 3: 평가 + 회고 (sonnet)
  echo "▶ Step 3: 평가 + 회고 (sonnet)"
  claude -p --model claude-sonnet-4-6 "$(cat "$PROMPT_DIR/step3.txt")"

  echo "━━━ Iteration $i complete ━━━"
  sleep 2
done

rm -rf "$PROMPT_DIR"
echo "🏁 Ralph-X finished"
