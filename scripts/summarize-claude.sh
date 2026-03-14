#!/bin/bash
set -euo pipefail

# 사용법: bash scripts/summarize-claude.sh [--limit N]
# 기본값: 10편

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_DIR"

# 인자 파싱
LIMIT=10
for arg in "$@"; do
  if [ "$prev_was_limit" = "1" ] 2>/dev/null; then
    LIMIT="$arg"
    prev_was_limit=0
  fi
  if [ "$arg" = "--limit" ]; then
    prev_was_limit=1
  fi
done

# .env 로드
set -a; source .env 2>/dev/null || true; set +a

# Python으로 전체 파이프라인 실행 (bash 변수 치환 문제 회피)
python3 << 'PYEOF'
import json, subprocess, sys, os, tempfile, urllib.request, re, html as html_mod

limit = int(os.environ.get("SUMMARIZE_LIMIT", sys.argv[1] if len(sys.argv) > 1 else "10"))
model = os.environ.get("SUMMARIZE_MODEL", "sonnet")

# 1. 프롬프트 템플릿 추출
with open("src/lib/claude/prompts.ts") as f:
    content = f.read()
start = content.find("`") + 1
end = content.rfind("`")
template = content[start:end]

# 2. 미요약 논문 덤프
result = subprocess.run(
    ["npx", "tsx", "scripts/summarize-local.ts", "--dump", "--limit", str(limit)],
    capture_output=True, text=True
)
papers = json.loads(result.stdout)

if not papers:
    print("요약할 논문이 없습니다.")
    sys.exit(0)

print(f"[요약 시작] {len(papers)}편 (claude -p {model})")
print("---")

def extract_text_from_html(raw):
    """HTML에서 본문 텍스트 추출 (References 이전까지)."""
    for stop in ["References", "Bibliography", "REFERENCES"]:
        idx = raw.find(f">{stop}<")
        if idx > 0:
            raw = raw[:idx]
            break
    text = re.sub(r"<script[^>]*>.*?</script>", "", raw, flags=re.DOTALL)
    text = re.sub(r"<style[^>]*>.*?</style>", "", text, flags=re.DOTALL)
    text = re.sub(r"<[^>]+>", " ", text)
    text = html_mod.unescape(text)
    text = re.sub(r"\s+", " ", text).strip()
    if len(text) > 12000:
        text = text[:12000] + "\n\n[본문 일부 생략]"
    return text

def fetch_alphaxiv(arxiv_id):
    """AlphaXiv에서 구조화된 논문 분석을 가져온다."""
    url = f"https://alphaxiv.org/overview/{arxiv_id}"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        raw = urllib.request.urlopen(req, timeout=30).read().decode("utf-8", errors="ignore")
        text = re.sub(r"<script[^>]*>.*?</script>", "", raw, flags=re.DOTALL)
        text = re.sub(r"<style[^>]*>.*?</style>", "", text, flags=re.DOTALL)
        text = re.sub(r"<[^>]+>", " ", text)
        text = html_mod.unescape(text)
        text = re.sub(r"\s+", " ", text).strip()
        if len(text) > 500:
            return text[:12000]
    except Exception:
        pass
    return None

def fetch_paper_body(arxiv_id):
    """AlphaXiv → arxiv HTML → ar5iv 미러 순으로 논문 내용을 가져온다."""
    # 1. AlphaXiv 구조화된 분석 (최우선)
    alphaxiv = fetch_alphaxiv(arxiv_id)
    if alphaxiv:
        print("  (AlphaXiv)")
        return alphaxiv

    # 2. arxiv HTML 본문
    for url in [f"https://arxiv.org/html/{arxiv_id}", f"https://ar5iv.labs.arxiv.org/html/{arxiv_id}"]:
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            raw = urllib.request.urlopen(req, timeout=30).read().decode("utf-8", errors="ignore")
            text = extract_text_from_html(raw)
            if len(text) > 500:
                print("  (arxiv HTML)")
                return text
        except Exception:
            continue

    print("  (본문 없음 — 스킵)")
    return None

for i, paper in enumerate(papers, 1):
    pid = paper["id"]
    title = paper["title"][:80]
    print(f"[{i}/{len(papers)}] {pid}: {title}")

    # 논문 본문 가져오기 (실패하면 스킵)
    body = fetch_paper_body(pid)
    if not body:
        print("  -> 스킵 (본문 없음)")
        continue
    content_text = body

    # 프롬프트 생성
    prompt = template.replace("{title}", paper["title"]).replace("{abstract}", content_text)

    # claude -p 호출
    try:
        resp = subprocess.run(
            ["claude", "-p", "--model", model],
            input=prompt, capture_output=True, text=True, timeout=180
        )
        output = resp.stdout.strip()

        # JSON 추출 (코드블록이나 순수 JSON)
        if "```" in output:
            output = output.split("```")[1]
            if output.startswith("json"):
                output = output[4:]
            output = output.strip()

        inner = json.loads(output)

        # 필수 필드 확인
        assert "titleKo" in inner and "summaryKo" in inner

        inner["id"] = pid

        # DB 업데이트
        tmpfile = tempfile.NamedTemporaryFile(mode="w", suffix=".json", delete=False)
        json.dump([inner], tmpfile, ensure_ascii=False)
        tmpfile.close()

        subprocess.run(
            ["npx", "tsx", "scripts/summarize-local.ts", "--update", tmpfile.name],
            capture_output=True, text=True
        )
        os.unlink(tmpfile.name)
        print("  -> 완료")

    except Exception as e:
        print(f"  -> 실패: {e}")
        continue

print("---")
print("요약 완료")
PYEOF
