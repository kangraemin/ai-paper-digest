export async function withRetry<T>(
  fn: () => Promise<T>,
  opts: { retries?: number; baseDelay?: number; label?: string } = {}
): Promise<T> {
  const { retries = 3, baseDelay = 1000, label = 'withRetry' } = opts;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (e) {
      if (attempt === retries) throw e;
      const delay = baseDelay * Math.pow(2, attempt - 1);
      console.warn(`[${label}] attempt ${attempt}/${retries} failed, retry in ${delay}ms:`, (e as Error).message);
      await new Promise(r => setTimeout(r, delay));
    }
  }
  throw new Error('unreachable');
}
