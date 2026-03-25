import { PDFParse } from 'pdf-parse';

const MAX_CHARS = 120_000; // ~30K tokens (1 token ≈ 4 chars)

export async function fetchPdfText(pdfUrl: string): Promise<string> {
  try {
    const result = await Promise.race([
      (async () => {
        const parser = new PDFParse({ url: pdfUrl });
        return await parser.getText();
      })(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('PDF fetch timeout after 30s')), 30_000)
      ),
    ]);
    return result.text
      .replace(/\n{3,}/g, '\n\n')
      .trim()
      .slice(0, MAX_CHARS);
  } catch (e) {
    console.warn('[pdf-fetcher] fetch failed:', (e as Error).message);
    return '';
  }
}
