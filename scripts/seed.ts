import { db } from '../src/lib/db';
import { aiCategories } from '../src/lib/db/schema';

const categories = [
  { id: 'prompting', name: '프롬프팅', nameEn: 'Prompting', color: '#3B82F6', icon: '💬' },
  { id: 'rag', name: 'RAG', nameEn: 'RAG', color: '#10B981', icon: '🔍' },
  { id: 'agent', name: '에이전트', nameEn: 'Agent', color: '#8B5CF6', icon: '🤖' },
  { id: 'fine-tuning', name: '파인튜닝', nameEn: 'Fine-tuning', color: '#F97316', icon: '🔧' },
  { id: 'eval', name: '평가', nameEn: 'Eval', color: '#EC4899', icon: '📊' },
  { id: 'cost-speed', name: '비용/속도', nameEn: 'Cost/Speed', color: '#14B8A6', icon: '⚡' },
];

async function main() {
  console.log('Seeding ai_categories...');

  for (const category of categories) {
    await db.insert(aiCategories).values(category).onConflictDoNothing();
  }

  console.log(`Seeded ${categories.length} categories`);
}

main().catch(console.error);
