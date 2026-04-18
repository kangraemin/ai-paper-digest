#!/bin/bash
# Ralph-X Auto-generated Loop
# Task: Gemma 번역 프롬프트 개선 + 재번역 + 평가
# Pipeline: 프롬프트 개선 → 100개 재번역 → 평가+회고
# Max iterations: 10
# RUN_ID: translate-prompt-fix

set -euo pipefail

RUN_DIR=".claude/ralph-x-runs/translate-prompt-fix"
LOG_FILE="$RUN_DIR/log.md"
CHECKLIST_FILE="$RUN_DIR/checklist.md"
MAX_ITER=10

PROMPT_DIR=$(mktemp -d)

cat > "$PROMPT_DIR/step1.txt" << 'S1EOF'
You are in a Ralph-X loop improving an English translation prompt.

Task: Improve the TRANSLATE_PROMPT in scripts/translate.ts so that one_liner_en reads like natural English tech writing instead of a Korean-to-English translation.

Context (read .claude/ralph-x-runs/translate-prompt-fix/log.md for full background):
- Current problem: ~40% of one_liner_en start with "This is a/an..." pattern — obvious translation artifact
- Bad patterns: "This is an experimental case demonstrating that...", "This is a real-world case where...", "This is a workflow sharing post about..."
- Good patterns: Start with the conclusion/number/finding directly. E.g. "Google has released... achieving 70% reduction", "LLM responses can shrink by 48% with a single instruction"
- Target audience: English-speaking developers on HN/Reddit

What to do:
1. Read scripts/translate.ts — focus on TRANSLATE_PROMPT (lines 7-22)
2. Add a specific rule for one_liner_en: guide the model to write like a native English tech writer, not a translator. Include:
   - Never start with "This is a/an..."
   - Lead with the key finding, metric, or action
   - Max 2 sentences
   - Examples of good vs bad
3. Edit scripts/translate.ts with the improved prompt
4. Append a summary of what you changed and why to .claude/ralph-x-runs/translate-prompt-fix/log.md

Work autonomously. Do NOT ask questions.
S1EOF

cat > "$PROMPT_DIR/step2.txt" << 'S2EOF'
You are in a Ralph-X loop re-translating papers with an improved prompt.

Task: Reset one_liner_en for papers with bad "This is a/an..." pattern, then re-run translation on 100 random papers.

Read .claude/ralph-x-runs/translate-prompt-fix/log.md for context.

What to do:
1. Source env vars: `source .env`
2. Find papers with "This is a" or "This is an" in one_liner_en — reset their one_liner_en to NULL using the remote DB (DATABASE_URL from .env). Use npx tsx with @libsql/client.
   - Target: all papers where one_liner_en LIKE 'This is a%' OR one_liner_en LIKE 'This is an%'
   - SQL: UPDATE papers SET one_liner_en = NULL WHERE one_liner_en LIKE 'This is a%' OR one_liner_en LIKE 'This is an%'
3. Also reset 100 random additional papers (to test general quality improvement):
   - SQL: UPDATE papers SET one_liner_en = NULL WHERE id IN (SELECT id FROM papers WHERE summarized_at IS NOT NULL AND one_liner_en IS NOT NULL ORDER BY RANDOM() LIMIT 100)
4. Run translation: `source .env && TURSO_DATABASE_URL=$TURSO_DATABASE_URL TURSO_AUTH_TOKEN=$TURSO_AUTH_TOKEN TRANSLATE_LIMIT=150 npx tsx scripts/translate.ts`
5. Append progress summary to .claude/ralph-x-runs/translate-prompt-fix/log.md

Work autonomously. Do NOT ask questions.
S2EOF

cat > "$PROMPT_DIR/step3.txt" << 'S3EOF'
You are in a Ralph-X loop evaluating translation quality.

Task: Sample 100 random one_liner_en from the DB and evaluate quality. Write a detailed assessment + retrospective.

Read .claude/ralph-x-runs/translate-prompt-fix/log.md and .claude/ralph-x-runs/translate-prompt-fix/checklist.md for context.

What to do:
1. Source env vars: `source .env`
2. Query 100 random one_liner_en: SELECT id, title, one_liner_en FROM papers WHERE summarized_at IS NOT NULL AND one_liner_en IS NOT NULL ORDER BY RANDOM() LIMIT 100
3. Evaluate each one — flag as AWKWARD if any of:
   - Starts with "This is a/an..."
   - Starts with "This is a [content type] that/where/demonstrating..."
   - Obvious Korean sentence structure in English
   - Overly formal/passive ("serves as a warning about", "is characterized by")
   - Too long (3+ sentences for one_liner)
4. Count: AWKWARD / 100. If ≤5 awkward → checklist passes.
5. Write to .claude/ralph-x-runs/translate-prompt-fix/eval.md:
   - Pass/Fail
   - Count of awkward translations
   - List of awkward examples (id + one_liner_en)
   - List of good examples (5+)
   - Retrospective: what worked, what still needs fixing, what to try next iteration
6. Append summary to .claude/ralph-x-runs/translate-prompt-fix/log.md
7. If PASS (≤5 awkward out of 100): mark checklist item done in .claude/ralph-x-runs/translate-prompt-fix/checklist.md → change "- [ ]" to "- [x]"
8. If FAIL: note specific patterns still failing so Step 1 can fix them next iteration

Work autonomously. Do NOT ask questions.
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

  # Step 2: 100개 재번역 (sonnet)
  echo "▶ Step 2: 재번역 (sonnet)"
  claude -p --model claude-sonnet-4-6 "$(cat "$PROMPT_DIR/step2.txt")"

  # Step 3: 평가 + 회고 (sonnet)
  echo "▶ Step 3: 평가 + 회고 (sonnet)"
  claude -p --model claude-sonnet-4-6 "$(cat "$PROMPT_DIR/step3.txt")"

  echo "━━━ Iteration $i complete ━━━"
  sleep 2
done

# Cleanup
rm -rf "$PROMPT_DIR"

echo "🏁 Ralph-X finished"
