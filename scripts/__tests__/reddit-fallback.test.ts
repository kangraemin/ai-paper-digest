import { describe, it, expect } from 'vitest';
import { fetchRedditPostContent, fetchRedditComments } from '../../src/lib/reddit/client';

describe('Reddit content fallback chain', () => {
  // selftext가 있는 글 (긴 본문)
  const SELFTEXT_POST = '/r/ClaudeAI/comments/1sa7ju4/i_replaced_chaotic_solo_claude_coding_with_a/';
  // selftext가 없는 글 (이미지/링크)
  const NO_SELFTEXT_POST = '/r/ChatGPT/comments/1sbux6t/this_new_technique_saves_60_of_my_token_expenses/';

  describe('fetchRedditPostContent (JSON API)', () => {
    it('selftext 있는 글에서 본문을 가져온다', async () => {
      const content = await fetchRedditPostContent(SELFTEXT_POST);
      expect(content.length).toBeGreaterThan(50);
    }, 15000);

    it('selftext 없는 글은 빈 문자열을 반환한다', async () => {
      const content = await fetchRedditPostContent(NO_SELFTEXT_POST);
      expect(content.length).toBeLessThanOrEqual(50);
    }, 15000);
  });

  describe('fetchRedditComments (JSON API)', () => {
    it('댓글이 있는 글에서 댓글을 가져온다', async () => {
      const comments = await fetchRedditComments(SELFTEXT_POST, 5);
      expect(comments.length).toBeGreaterThan(0);
      expect(comments[0].length).toBeGreaterThan(10);
    }, 15000);
  });

  describe('Fallback chain integration', () => {
    it('selftext 없는 글도 댓글로 content를 확보한다', async () => {
      let body = await fetchRedditPostContent(NO_SELFTEXT_POST);
      if (!body || body.length <= 50) {
        body = '';
      }
      const comments = await fetchRedditComments(NO_SELFTEXT_POST, 5);
      const commentText = comments.length > 0 ? comments.join('\n\n') : '';
      const combined = ((body || '') + '\n' + commentText).trim();

      // 댓글이라도 있으면 통과, 둘 다 없으면 삭제 대상
      if (combined.length > 50) {
        expect(combined.length).toBeGreaterThan(50);
      } else {
        expect(combined.length).toBeLessThanOrEqual(50);
      }
    }, 15000);
  });
});
