'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function NewsletterForm() {
  return null;
  // eslint-disable-next-line no-unreachable
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus('success');
        setMessage('구독이 완료되었습니다!');
        setEmail('');
      } else {
        const data = await res.json();
        setStatus('error');
        setMessage(data.error || '구독에 실패했습니다.');
      }
    } catch {
      setStatus('error');
      setMessage('네트워크 오류가 발생했습니다.');
    }
  };

  return (
    <section className="border-t py-6">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3">
        <span className="text-sm text-muted-foreground whitespace-nowrap">매일 아침 AI 논문 다이제스트 받기</span>
        <div className="flex gap-2 w-full sm:w-auto">
          <Input
            type="email"
            placeholder="이메일 주소"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="h-9 text-sm"
          />
          <Button type="submit" size="sm" disabled={status === 'loading'}>
            {status === 'loading' ? '구독 중...' : '구독'}
          </Button>
        </div>
      </form>
      {message && (
        <p className={`mt-2 text-sm ${status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}
    </section>
  );
}
