export async function fetchContent(
  url: string,
  maxChars = 5000,
): Promise<string> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; AIPaperBot/1.0; +https://github.com/ai-paper)",
      },
    });
    clearTimeout(timeout);

    const html = await res.text();

    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    return text.slice(0, maxChars);
  } catch (err) {
    console.warn("fetchContent failed:", err);
    return "";
  }
}
