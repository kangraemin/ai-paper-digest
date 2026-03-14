import pdfParse from 'pdf-parse';

export async function fetchPdfText(pdfUrl: string): Promise<string> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 120_000); // PDF는 2분 타임아웃

    const res = await fetch(pdfUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 AI-Paper-Digest/1.0' },
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (!res.ok) return '';

    const buffer = Buffer.from(await res.arrayBuffer());
    const data = await pdfParse(buffer);

    return data.text
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  } catch (e) {
    console.warn('[pdf-fetcher] fetch failed:', (e as Error).message);
    return '';
  }
}
