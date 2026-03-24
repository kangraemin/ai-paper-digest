import type { Lang } from './types';

const dict: Record<string, Record<Lang, string>> = {
  'date.today': { ko: '오늘', en: 'Today' },
  'date.yesterday': { ko: '어제', en: 'Yesterday' },
  'date.weekdays': { ko: '일,월,화,수,목,금,토', en: 'Sun,Mon,Tue,Wed,Thu,Fri,Sat' },
  'feed.searching': { ko: '검색 중...', en: 'Searching...' },
  'feed.loading': { ko: '로딩 중...', en: 'Loading...' },
  'feed.loadMore': { ko: '더 보기', en: 'Load More' },
  'feed.noResults': { ko: "'{q}'에 대한 검색 결과가 없습니다.", en: "No results for '{q}'." },
  'feed.searchResults': { ko: '{n}개의 검색 결과', en: '{n} results' },
  'feed.emptyDay': { ko: '오늘은 조용한 날이네요.', en: "It's a quiet day." },
  'feed.emptyCommunity': { ko: 'HN 수집을 실행하거나 내일 다시 확인해 주세요.', en: 'Run HN collection or check back tomorrow.' },
  'feed.emptyPapers': { ko: '논문 수집을 실행하거나 내일 다시 확인해 주세요.', en: 'Run paper collection or check back tomorrow.' },
  'feed.count': { ko: '{n}편', en: '{n} papers' },
  'search.placeholder': { ko: '제목, 요약, 키워드로 검색...', en: 'Search by title, summary, or keyword...' },
  'install.success.title': { ko: '설치 완료!', en: 'Installation Complete!' },
  'install.success.desc': { ko: '매일 아침 AI 논문 요약이 Slack으로 전송됩니다.', en: 'AI paper summaries will be sent to Slack every morning.' },
  'install.success.link': { ko: '홈으로 돌아가기', en: 'Back to Home' },
  'install.fail.title': { ko: '설치 실패', en: 'Installation Failed' },
  'install.fail.error': { ko: '오류 코드: {code}', en: 'Error code: {code}' },
  'install.fail.link': { ko: '다시 시도하기', en: 'Try Again' },
};

export function t(key: string, lang: Lang, params?: Record<string, string | number>): string {
  const entry = dict[key];
  if (!entry) return key;
  let result = entry[lang] ?? entry['ko'] ?? key;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      result = result.replace(`{${k}}`, String(v));
    }
  }
  return result;
}
