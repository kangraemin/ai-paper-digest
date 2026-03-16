import { PDFParse } from 'pdf-parse';

const MAX_CHARS = 120_000; // ~30K tokens (1 token ≈ 4 chars)

export async function fetchPdfText(pdfUrl: string): Promise<string> {
  try {
    const parser = new PDFParse({ url: pdfUrl });
    const result = await parser.getText();
    return result.text
      .replace(/\n{3,}/g, '\n\n')
      .trim()
      .slice(0, MAX_CHARS);
  } catch (e) {
    console.warn('[pdf-fetcher] fetch failed:', (e as Error).message);
    return '';
  }
}
