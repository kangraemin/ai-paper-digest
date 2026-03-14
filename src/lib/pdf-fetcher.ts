import { PDFParse } from 'pdf-parse';

export async function fetchPdfText(pdfUrl: string): Promise<string> {
  try {
    const parser = new PDFParse({ url: pdfUrl });
    const result = await parser.getText();
    return result.text
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  } catch (e) {
    console.warn('[pdf-fetcher] fetch failed:', (e as Error).message);
    return '';
  }
}
