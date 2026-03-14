'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TrendData {
  category: string | null;
  count: number;
}

const CATEGORY_NAMES: Record<string, string> = {
  nlp: 'NLP',
  cv: 'CV',
  rl: 'RL',
  multimodal: 'Multimodal',
  agent: 'Agent',
  reasoning: 'Reasoning',
  optimization: 'Optimization',
  safety: 'Safety',
  architecture: 'Architecture',
  other: 'Other',
};

export function TrendChart({ data }: { data: TrendData[] }) {
  const chartData = data
    .filter(d => d.category)
    .map(d => ({
      name: CATEGORY_NAMES[d.category!] || d.category,
      count: d.count,
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
