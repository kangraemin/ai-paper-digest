import { db } from '../src/lib/db';
import { aiCategories } from '../src/lib/db/schema';

const categories = [
  { id: 'nlp', name: '자연어처리', nameEn: 'NLP', color: '#3B82F6', icon: '💬' },
  { id: 'cv', name: '컴퓨터비전', nameEn: 'CV', color: '#10B981', icon: '👁️' },
  { id: 'rl', name: '강화학습', nameEn: 'RL', color: '#F59E0B', icon: '🎮' },
  { id: 'multimodal', name: '멀티모달', nameEn: 'Multimodal', color: '#8B5CF6', icon: '🎨' },
  { id: 'agent', name: '에이전트', nameEn: 'Agent', color: '#EF4444', icon: '🤖' },
  { id: 'reasoning', name: '추론', nameEn: 'Reasoning', color: '#EC4899', icon: '🧠' },
  { id: 'optimization', name: '최적화', nameEn: 'Optimization', color: '#14B8A6', icon: '⚡' },
  { id: 'safety', name: '안전성', nameEn: 'Safety', color: '#F97316', icon: '🛡️' },
  { id: 'architecture', name: '아키텍처', nameEn: 'Architecture', color: '#6366F1', icon: '🏗️' },
  { id: 'other', name: '기타', nameEn: 'Other', color: '#6B7280', icon: '📄' },
];

async function main() {
  console.log('Seeding ai_categories...');

  for (const category of categories) {
    await db.insert(aiCategories).values(category).onConflictDoNothing();
  }

  console.log(`Seeded ${categories.length} categories`);
}

main().catch(console.error);
