#!/bin/bash
set -euo pipefail

# Cloudflare Workers(OpenNext)로 빌드·배포한다.
# 사용법: bash scripts/deploy-cf.sh
# - CI: CLOUDFLARE_API_TOKEN(Workers·KV 쓰기 권한) 환경변수를 쓴다.
# - 로컬: wrangler OAuth 세션 토큰을 쓴다. wrangler는 프로젝트 .env를 읽으므로
#   .env의 CLOUDFLARE_API_TOKEN(권한 다름)이 끼어들지 않게 프로세스 env로 덮는다.

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_DIR"

# node 25에서는 wrangler 업로드가 EPIPE로 끊긴다
if [ -d /opt/homebrew/opt/node@22/bin ]; then
  export PATH="/opt/homebrew/opt/node@22/bin:$PATH"
fi

if [ -z "${CI:-}" ]; then
  # whoami가 만료된 OAuth 토큰을 갱신한다(.env를 읽지 않도록 다른 디렉터리에서)
  (cd /tmp && env -u CLOUDFLARE_API_TOKEN npx --prefix "$PROJECT_DIR" wrangler whoami >/dev/null)
  CLOUDFLARE_API_TOKEN="$(grep oauth_token "$HOME/Library/Preferences/.wrangler/config/default.toml" | cut -d'"' -f2)"
  export CLOUDFLARE_API_TOKEN
fi

rm -rf .next .open-next
npx opennextjs-cloudflare build
# 큰 KV 묶음은 로컬 회선에서 끊겨 캐시를 작게 나눠 올린다
npx opennextjs-cloudflare deploy --cacheChunkSize 5
