const USER_AGENT = 'Mozilla/5.0 AI-Paper-Digest/1.0';
const TIMEOUT_MS = 10_000;

export async function fetchContent(url: string, maxChars = 5000): Promise<string> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const res = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT },
      signal: controller.signal,
    });
    clearTimeout(timer);

    const html = await res.text();

    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, '')
      .replace(/\s{2,}/g, ' ')
      .replace(/\n{2,}/g, '\n')
      .trim();

    return text.slice(0, maxChars);
  } catch (e) {
    console.warn('[content-fetcher] fetch failed:', (e as Error).message);
    return '';
  }
}
