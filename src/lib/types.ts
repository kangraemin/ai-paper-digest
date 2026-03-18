export type PaperListItem = {
  id: string;
  title: string;
  titleKo: string | null;
  oneLiner: string | null;
  aiCategory: string | null;
  devRelevance: number | null;
  targetAudience: string | null;
  tags: string | null;
  source: string | null;
  isHot: boolean | null;
  publishedAt: string;
  authors: string;
  venue: string | null;
  affiliations: string | null;
};
