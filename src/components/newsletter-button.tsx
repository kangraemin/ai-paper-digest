'use client';

import { useState } from 'react';
import { Mail, X } from 'lucide-react';
import { t } from '@/lib/i18n';
import type { Lang } from '@/lib/i18n';
import { trackEvent } from '@/lib/ga';

export function NewsletterButton({ lang }: { lang: Lang }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    trackEvent('newsletter_subscribe', { lang });
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok || res.status === 409) {
        setStatus('success');
        setMessage(t('newsletter.success', lang));
        setEmail('');
        setTimeout(() => setOpen(false), 2000);
      } else {
        const data = await res.json();
        setStatus('error');
        setMessage(data.error || t('newsletter.error', lang));
      }
    } catch {
      setStatus('error');
      setMessage(t('newsletter.networkError', lang));
    }
  };

  return (
    <>
      <button
        onClick={() => { setOpen(!open); setStatus('idle'); setMessage(''); }}
        title={t('newsletter.label', lang)}
        className="flex items-center justify-center rounded-sm h-8 w-8 bg-card hover:bg-accent text-muted-foreground hover:text-foreground border border-border transition-colors"
      >
        <Mail size={16} />
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 border-b border-border bg-background/95 backdrop-blur px-4 sm:px-6 py-3 z-40">
          <form onSubmit={handleSubmit} className="flex items-center gap-2 max-w-[800px] mx-auto">
            <span className="text-sm text-muted-foreground whitespace-nowrap hidden sm:block">
              {t('newsletter.label', lang)}
            </span>
            <input
              type="email"
              placeholder={t('newsletter.placeholder', lang)}
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="flex-1 min-w-0 bg-card border border-border rounded-sm px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="whitespace-nowrap px-3 py-1 text-sm rounded-sm bg-foreground text-background hover:bg-foreground/90 transition-colors disabled:opacity-50"
            >
              {status === 'loading' ? t('newsletter.loading', lang) : t('newsletter.subscribe', lang)}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center rounded-sm h-8 w-8 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={16} />
            </button>
          </form>
          {message && (
            <p className={`mt-1 text-sm text-center ${status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </p>
          )}
        </div>
      )}
    </>
  );
}
