'use client';

import { useState, useEffect, useRef } from 'react';
import type { FormEvent } from 'react';
import { X } from 'lucide-react';
import { t } from '@/lib/i18n';
import type { Lang } from '@/lib/i18n';
import { trackEvent } from '@/lib/ga';

const REDIRECT_URI = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://paper-digest.app'}/api/slack/callback`;
const SLACK_SCOPE = 'chat:write,chat:write.customize,channels:read,channels:join,groups:read,reactions:write,reactions:read,files:write,files:read,users:read,commands,incoming-webhook,links:read,links:write';

export function PaperSubscriptionCta({ lang }: { lang: Lang }) {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      localStorage.getItem('paper_cta_dismissed') ||
      localStorage.getItem('paper_cta_subscribed')
    ) return;

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.5 }
    );
    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    trackEvent('newsletter_subscribe', { lang, source: 'paper_cta' });
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok || res.status === 409) {
        setStatus('success');
        setMessage(t('newsletter.success', lang));
        localStorage.setItem('paper_cta_subscribed', '1');
        setTimeout(() => setVisible(false), 2000);
      } else {
        const data = await res.json();
        setStatus('error');
        const key = data.code === 'EMAIL_SEND_FAILED' ? 'newsletter.emailFailed' : 'newsletter.error';
        setMessage(t(key, lang));
      }
    } catch {
      setStatus('error');
      setMessage(t('newsletter.networkError', lang));
    }
  };

  const handleDismiss = () => {
    setVisible(false);
    localStorage.setItem('paper_cta_dismissed', '1');
  };

  const clientId = process.env.NEXT_PUBLIC_SLACK_CLIENT_ID;
  const slackUrl = clientId
    ? `https://slack.com/oauth/v2/authorize?client_id=${clientId}&scope=${SLACK_SCOPE}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&state=${lang}`
    : null;

  return (
    <>
      {/* sentinel: 아티클 끝에 위치 */}
      <div ref={sentinelRef} className="h-1" />

      {visible && (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur shadow-lg animate-slide-up">
          <div className="mx-auto max-w-3xl px-4 py-3 flex flex-col sm:flex-row gap-3 items-center">
            <p className="text-sm font-medium shrink-0 text-foreground">
              {t('newsletter.label', lang)}
            </p>

            {status === 'success' ? (
              <p className="text-sm text-green-600 flex-1 text-center">{message}</p>
            ) : (
              <form onSubmit={handleSubmit} className="flex gap-2 flex-1 w-full sm:w-auto">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder={t('newsletter.placeholder', lang)}
                  className="flex-1 min-w-0 bg-card border border-border rounded-sm px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="whitespace-nowrap px-3 py-1.5 text-sm rounded-sm bg-foreground text-background hover:bg-foreground/90 transition-colors disabled:opacity-50"
                >
                  {status === 'loading' ? t('newsletter.loading', lang) : t('newsletter.subscribe', lang)}
                </button>
              </form>
            )}

            {slackUrl && (
              <a
                href={slackUrl}
                onClick={() => trackEvent('slack_add_click', { lang, source: 'paper_cta' })}
                className="flex items-center gap-1.5 rounded-sm border border-border px-3 py-1.5 text-sm hover:bg-accent transition-colors shrink-0"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                  <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/>
                </svg>
                Slack
              </a>
            )}

            {status !== 'success' && message && (
              <p className="text-xs text-red-600">{message}</p>
            )}

            <button
              onClick={handleDismiss}
              className="flex items-center justify-center rounded-sm h-7 w-7 text-muted-foreground hover:text-foreground transition-colors shrink-0"
            >
              <X size={15} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
