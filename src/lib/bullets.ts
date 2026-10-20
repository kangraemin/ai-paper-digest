// 요약 항목 한 개 = "짧은 제목\n- 문장\n- 문장". 예전 글은 한 줄짜리 문자열이라 제목 없이 points 하나로 본다.
export function splitItem(item: string): { title: string | null; points: string[] } {
  const lines = item.split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length < 2) return { title: null, points: lines };
  return { title: lines[0].replace(/^-\s*/, ''), points: lines.slice(1).map(l => l.replace(/^-\s*/, '')) };
}

// 텍스트 채널(RSS·Slack)용: 제목 줄 아래에 들여쓴 하위 목록으로 편다
export function itemToText(item: string, bullet = '-', sub = '  -', bold = (s: string) => s): string {
  const { title, points } = splitItem(item);
  if (!title) return `${bullet} ${points.join(' ')}`;
  return [`${bullet} ${bold(title)}`, ...points.map(p => `${sub} ${p}`)].join('\n');
}
