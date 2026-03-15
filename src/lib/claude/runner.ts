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
