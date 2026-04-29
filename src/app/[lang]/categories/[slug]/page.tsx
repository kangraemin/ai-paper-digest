import { redirect } from 'next/navigation';

const LEGACY_TO_TOPIC: Record<string, string> = {
  'prompting': 'prompting',
  'rag': 'rag',
  'agent': 'agent',
  'eval': 'eval',
  'finetuning': 'finetuning',
  'fine-tuning': 'finetuning',
  'cost-speed': 'eval',
  'cost': 'eval',
  'security': 'safety',
};

export default async function LegacyCategoryRedirect({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  const target = LEGACY_TO_TOPIC[slug] ?? 'agent';
  redirect(`/${lang}/topics/${target}`);
}
