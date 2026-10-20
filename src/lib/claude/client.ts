import { callAnthropicSDK } from './anthropic';
import { PAPER_PROMPT_V2, SUMMARY_SCHEMA_V2 } from './prompts-v2';
import { fetchPdfText } from '../pdf-fetcher';

// v2 프롬프트 한 번 호출 → 한·영 요약(구조화 출력). 결과는 toPaperRow로 DB 칸에 맞춘다.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function summarizeV2(prompt: string): Promise<any> {
  const raw = await callAnthropicSDK(prompt, { model: 'sonnet', maxTokens: 16000, effort: 'medium', schema: SUMMARY_SCHEMA_V2 });
  return JSON.parse(raw);
}

// 논문: PDF 전문(참고문헌 제외)이 있으면 그걸, 없으면 초록으로 요약한다
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function summarizePaper(title: string, abstract: string, pdfUrl?: string): Promise<any> {
  const pdfText = pdfUrl ? await fetchPdfText(pdfUrl) : '';
  const content = pdfText.length > 200 ? pdfText : abstract;
  return summarizeV2(PAPER_PROMPT_V2.replace('{title}', title).replace('{content}', content));
}
