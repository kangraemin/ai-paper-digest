const GEMMA_MODEL = 'gemma-3-27b-it';
const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

export async function callGemma(
  prompt: string,
  options?: { maxTokens?: number }
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY must be set');

  const res = await fetch(
    `${BASE_URL}/${GEMMA_MODEL}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: options?.maxTokens ?? 4096 },
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemma API error ${res.status}: ${err.slice(0, 200)}`);
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Gemma returned empty response');
  return text;
}
