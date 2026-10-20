import { PDFParse } from 'pdf-parse';

const MAX_CHARS = 150_000; // ~37K tokens (1 token ≈ 4 chars)

// 참고문헌 목록은 요약에 쓸 데가 없고 길다 → 'References' 제목부터 부록 시작 전까지(없으면 끝까지) 뺀다
export function dropReferences(text: string): string {
  const ref = [...text.matchAll(/\n\s*(References|REFERENCES|Bibliography|BIBLIOGRAPHY)\s*\n/g)].at(-1);
  if (!ref || ref.index! < text.length * 0.3) return text;
  const start = ref.index! + ref[0].length;
  const rest = text.slice(start, start + 25_000);
  // 부록 제목이 나오면 거기서 멈춘다. 못 찾으면 참고문헌은 길어야 2만5천 자로 보고 그만큼만 뺀다
  const app = rest.match(/\n\s*(?:[A-H](?:\.\d+)?\s+)?(Appendix|APPENDIX|Supplementary|SUPPLEMENTARY|Limitations|Ethics|Broader Impact|Details of|Implementation Details|Additional|Prompts?\b|Proof|Experimental Details)[^\n]{0,80}\n/);
  const end = app ? start + app.index! : Math.min(text.length, start + 25_000);
  return text.slice(0, ref.index!) + '\n\n' + text.slice(end);
}

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
    return dropReferences(result.text)
      .replace(/\n{3,}/g, '\n\n')
      .trim()
      .slice(0, MAX_CHARS);
  } catch (e) {
    console.warn('[pdf-fetcher] fetch failed:', (e as Error).message);
    return '';
  }
}
