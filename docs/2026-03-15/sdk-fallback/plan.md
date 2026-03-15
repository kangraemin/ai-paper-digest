# claude -p → Anthropic SDK 환경 분기

## Context
배포 환경(Vercel)에서는 Claude CLI가 없으므로 Anthropic SDK로 직접 호출해야 한다. 로컬에서는 기존 `claude -p` CLI를 유지한다. `ANTHROPIC_API_KEY` 환경변수 유무로 분기.

## 변경 파일별 상세

### `src/lib/claude/anthropic.ts` (신규)
- **용도**: Anthropic SDK 래퍼. 모델 매핑 + API 호출.
- **핵심 코드**:
```typescript
import Anthropic from '@anthropic-ai/sdk';

const MODEL_MAP: Record<string, string> = {
  sonnet: 'claude-sonnet-4-20250514',
  haiku: 'claude-haiku-4-20250414',
};

export async function callAnthropicSDK(
  prompt: string,
  options: { model: string; maxTokens?: number }
): Promise<string> {
  const client = new Anthropic();
  const message = await client.messages.create({
    model: MODEL_MAP[options.model] ?? options.model,
    max_tokens: options.maxTokens ?? 8192,
    messages: [{ role: 'user', content: prompt }],
  });
  return message.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('');
}
```

### `src/lib/claude/runner.ts` (신규)
- **용도**: 통합 `runClaude` — env 분기 + CLI 로직 통합
- **핵심 코드**:
```typescript
import { callAnthropicSDK } from './anthropic';
import { spawn } from 'child_process';
import { tmpdir } from 'os';

interface RunClaudeOptions {
  model: 'sonnet' | 'haiku';
  timeout?: number;
  jsonOutput?: boolean;
}

export async function runClaude(prompt: string, options: RunClaudeOptions): Promise<string> {
  if (process.env.ANTHROPIC_API_KEY) {
    return callAnthropicSDK(prompt, {
      model: options.model,
      maxTokens: options.model === 'haiku' ? 1024 : 8192,
    });
  }
  return runClaudeCLI(prompt, options);
}

function runClaudeCLI(prompt: string, options: RunClaudeOptions): Promise<string> {
  return new Promise((resolve, reject) => {
    const args = ['-p', '--model', options.model];
    if (options.jsonOutput) args.push('--output-format', 'json');
    const proc = spawn('claude', args, {
      stdio: ['pipe', 'pipe', 'pipe'],
      cwd: tmpdir(),
    });
    let stdout = '';
    let stderr = '';
    proc.stdout.on('data', (d: Buffer) => { stdout += d.toString(); });
    proc.stderr.on('data', (d: Buffer) => { stderr += d.toString(); });
    proc.on('close', (code: number | null) => {
      if (code !== 0) {
        reject(new Error(`claude exited ${code}: ${stderr}`));
        return;
      }
      if (options.jsonOutput) {
        try {
          const envelope = JSON.parse(stdout.trim());
          if (envelope.is_error) {
            reject(new Error(`claude error: ${envelope.result}`));
            return;
          }
          resolve(envelope.result ?? '');
        } catch {
          resolve(stdout.trim());
        }
      } else {
        resolve(stdout.trim());
      }
    });
    proc.on('error', reject);
    proc.stdin.write(prompt);
    proc.stdin.end();
    setTimeout(() => { proc.kill(); reject(new Error('timeout')); }, options.timeout ?? 120000);
  });
}
```

### `src/lib/claude/client.ts` (수정)
- **변경 이유**: 로컬 runClaude 제거, runner에서 import
- **Before** (현재 코드):
```typescript
import { spawn } from 'child_process';
import { tmpdir } from 'os';
import { SUMMARY_PROMPT } from './prompts';
import { fetchPdfText } from '../pdf-fetcher';
import type { SummaryResult } from './types';

function runClaude(prompt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const proc = spawn('claude', ['-p', '--model', 'sonnet', '--output-format', 'json'], {
      stdio: ['pipe', 'pipe', 'pipe'],
      cwd: tmpdir(),
    });
    let stdout = '';
    let stderr = '';
    proc.stdout.on('data', (d: Buffer) => { stdout += d.toString(); });
    proc.stderr.on('data', (d: Buffer) => { stderr += d.toString(); });
    proc.on('close', (code: number | null) => {
      if (code !== 0) {
        reject(new Error(`claude exited ${code}: ${stderr}`));
        return;
      }
      try {
        const envelope = JSON.parse(stdout.trim());
        if (envelope.is_error) {
          reject(new Error(`claude error: ${envelope.result}`));
          return;
        }
        resolve(envelope.result ?? '');
      } catch {
        resolve(stdout.trim());
      }
    });
    proc.on('error', reject);
    proc.stdin.write(prompt);
    proc.stdin.end();
    setTimeout(() => { proc.kill(); reject(new Error('timeout')); }, 120000);
  });
}

// ... summarizePaper에서:
const raw = await runClaude(/* prompt */);
```
- **After** (변경 후):
```typescript
import { runClaude } from './runner';
import { SUMMARY_PROMPT } from './prompts';
import { fetchPdfText } from '../pdf-fetcher';
import type { SummaryResult } from './types';

// ... summarizePaper에서:
const raw = await runClaude(prompt, { model: 'sonnet', timeout: 120000, jsonOutput: true });
```
- **영향 범위**: summarizeBatch → summarizePaper 호출 체인. 인터페이스 동일하므로 영향 없음.

### `src/lib/claude/screener.ts` (수정)
- **변경 이유**: 로컬 runClaude 제거, runner에서 import
- **Before** (현재 코드):
```typescript
import { spawn } from 'child_process';

// ... 프롬프트 상수들 ...

function runClaude(prompt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const proc = spawn('claude', ['-p', '--model', 'haiku'], {
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    // ... spawn 로직
  });
}

// screenPaper에서:
let text = await runClaude(prompt);
```
- **After** (변경 후):
```typescript
import { runClaude } from './runner';

// ... 프롬프트 상수들 그대로 ...

// screenPaper에서:
let text = await runClaude(prompt, { model: 'haiku', timeout: 60000 });
```
- **영향 범위**: screenBatch → screenPaper 호출 체인. 인터페이스 동일하므로 영향 없음.

### `scripts/digest-community.ts` (수정)
- **변경 이유**: 로컬 runClaude 제거, runner에서 import
- **Before** (현재 코드):
```typescript
import { spawn } from 'child_process';
// ...
function runClaude(prompt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const proc = spawn('claude', ['-p', '--model', 'sonnet'], {
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    // ... spawn 로직
  });
}

// digestCommunity에서:
const raw = await runClaude(prompt);
```
- **After** (변경 후):
```typescript
import { runClaude } from '../src/lib/claude/runner';
// ...

// digestCommunity에서:
const raw = await runClaude(prompt, { model: 'sonnet', timeout: 120000 });
```
- **영향 범위**: digestCommunity 함수 내부만. 외부 인터페이스 변경 없음.

## 검증
- 검증 명령어: `npm run build`
- 기대 결과: 빌드 성공, 타입 에러 없음
