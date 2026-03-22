import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';

export const papers = sqliteTable('papers', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  titleKo: text('title_ko'),
  abstract: text('abstract').notNull(),
  authors: text('authors').notNull(), // JSON array
  categories: text('categories').notNull(), // JSON array
  primaryCategory: text('primary_category').notNull(),
  publishedAt: text('published_at').notNull(),
  updatedAt: text('updated_at'),
  arxivUrl: text('arxiv_url').notNull(),
  pdfUrl: text('pdf_url').notNull(),
  summaryKo: text('summary_ko'),
  aiCategory: text('ai_category'),
  devRelevance: integer('dev_relevance').default(3),
  relevanceReason: text('relevance_reason'),
  devNote: text('dev_note'),
  oneLiner: text('one_liner'),
  targetAudience: text('target_audience'),
  keyFindings: text('key_findings'),
  evidence: text('evidence'),
  howToApply: text('how_to_apply'),
  codeExample: text('code_example'),
  relatedResources: text('related_resources'),
  glossary: text('glossary'),
  tags: text('tags'),
  hotScore: integer('hot_score').default(0),
  isHot: integer('is_hot', { mode: 'boolean' }).default(false),
  source: text('source').default('arxiv'),
  citationCount: integer('citation_count'),
  venue: text('venue'),
  affiliations: text('affiliations'),
  collectedAt: text('collected_at').notNull(),
  summarizedAt: text('summarized_at'),
  slackNotifiedAt: text('slack_notified_at'),
}, (table) => [
  index('idx_published_at').on(table.publishedAt),
  index('idx_ai_category').on(table.aiCategory),
  index('idx_is_hot').on(table.isHot),
  index('idx_dev_relevance').on(table.devRelevance),
  index('idx_source').on(table.source),
  index('idx_published_at_ai_category').on(table.publishedAt, table.aiCategory),
]);

export const aiCategories = sqliteTable('ai_categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  nameEn: text('name_en').notNull(),
  color: text('color').notNull(),
  icon: text('icon').notNull(),
});

export const subscribers = sqliteTable('subscribers', {
  id: text('id').primaryKey(),
  email: text('email').unique().notNull(),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  subscribedAt: text('subscribed_at').notNull(),
  unsubscribedAt: text('unsubscribed_at'),
  unsubscribeToken: text('unsubscribe_token').unique(),
});

export const screenedItems = sqliteTable('screened_items', {
  id: text('id').primaryKey(),
  pass: integer('pass', { mode: 'boolean' }).notNull(),
  score: integer('score').notNull().default(0),
  screenedAt: text('screened_at').notNull(),
});

export const trendSnapshots = sqliteTable('trend_snapshots', {
  id: text('id').primaryKey(),
  weekStart: text('week_start').notNull(),
  category: text('category').notNull(),
  paperCount: integer('paper_count').notNull(),
  topKeywords: text('top_keywords'), // JSON array
});
