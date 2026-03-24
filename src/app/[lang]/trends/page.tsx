'use client';

import { useEffect, useState } from 'react';
import { TrendChart } from '@/components/trend-chart';
import { Button } from '@/components/ui/button';

interface TrendData {
  category: string | null;
  count: number;
}

export default function TrendsPage() {
  const [period, setPeriod] = useState<'weekly' | 'monthly'>('weekly');
  const [data, setData] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/trends?period=${period}`)
      .then(r => r.json())
      .then(res => {
        setData(res.data);
        setLoading(false);
      });
  }, [period]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">트렌드 분석</h1>
        <div className="flex gap-2">
          <Button
            variant={period === 'weekly' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPeriod('weekly')}
          >
            주간
          </Button>
          <Button
            variant={period === 'monthly' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPeriod('monthly')}
          >
            월간
          </Button>
        </div>
      </div>

      {loading ? (
        <p className="py-12 text-center text-muted-foreground">로딩 중...</p>
      ) : data.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">트렌드 데이터가 없습니다.</p>
      ) : (
        <TrendChart data={data} />
      )}
    </div>
  );
}
