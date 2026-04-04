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
  'newsletter.label': { ko: '매일 아침 AI 논문 요약 받기', en: 'Get daily AI paper digest' },
  'newsletter.placeholder': { ko: '이메일 주소', en: 'Email address' },
  'newsletter.subscribe': { ko: '구독', en: 'Subscribe' },
  'newsletter.loading': { ko: '구독 중...', en: 'Subscribing...' },
  'newsletter.success': { ko: '구독 완료!', en: 'Subscribed!' },
  'newsletter.error': { ko: '구독 실패', en: 'Failed to subscribe' },
  'newsletter.networkError': { ko: '네트워크 오류', en: 'Network error' },
  'notice.banner.text': {
    ko: '⚠️ Slack 알림 오류 안내 — 영향받으신 분은 재설치를 요청드립니다.',
    en: '⚠️ Slack notification issue — Please reinstall if you were affected.',
  },
  'notice.banner.link': { ko: '자세히 보기 →', en: 'Learn more →' },
  'notice.title': { ko: 'Slack 알림 오류 안내', en: 'Slack Notification Issue' },
  'notice.body': {
    ko: `안녕하세요, AI Paper Digest 팀입니다.\n\nSlack 봇 설치 과정에서 DM 채널이나 메시지를 보낼 수 없는 채널을 걸러내지 못하는 문제가 있었습니다. 이로 인해 일부 사용자분께서 알림을 잘못 수신하시거나, 아예 받지 못하셨을 수 있습니다. 진심으로 사과드립니다.\n\n현재는 Slack 설치 시 실제로 메시지를 보낼 수 있는 채널인지 테스트하는 과정을 추가하여, 올바른 채널에만 알림이 등록되도록 수정했습니다.\n\n알림을 정상적으로 받지 못하신 분들께서는 아래 버튼을 통해 Slack 봇을 재설치해 주시면 감사하겠습니다. 불편을 드려 다시 한번 깊이 사과드립니다.`,
    en: `Hello, this is the AI Paper Digest team.\n\nDuring the Slack bot installation process, we failed to filter out DM channels and channels where the bot cannot send messages. As a result, some users may have received notifications incorrectly or not at all. We sincerely apologize for this.\n\nWe have since added a channel validation step during installation — the bot now tests whether it can actually send a message to the selected channel before completing setup.\n\nIf you were not receiving notifications correctly, please reinstall the Slack bot using the button below. We are deeply sorry for the inconvenience.`,
  },
  'notice.reinstall': { ko: 'Slack 봇 재설치하기', en: 'Reinstall Slack Bot' },
  'notice.back': { ko: '홈으로 돌아가기', en: 'Back to Home' },
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
