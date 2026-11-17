import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";
import { withRegionalCache } from "@opennextjs/cloudflare/overrides/incremental-cache/regional-cache";
import memoryQueue from "@opennextjs/cloudflare/overrides/queue/memory-queue";

// ISR 캐시는 R2(+지역 캐시). 키에 BUILD_ID가 들어가 배포마다 새로 쌓이므로
// 버킷 ai-paper-inc-cache에 14일 수명 규칙을 걸어 옛 빌드 캐시를 저절로 지운다.
// KV는 옛 키가 안 지워져 10/28 0.19GB → 11/16 4.28GB로 불어 11/18 R2로 옮겼다.
export default defineCloudflareConfig({
  incrementalCache: withRegionalCache(r2IncrementalCache, { mode: "long-lived" }),
  queue: memoryQueue,
});
