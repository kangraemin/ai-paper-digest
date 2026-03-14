export interface SummaryResult {
  titleKo: string;
  oneLiner: string;
  targetAudience: string;
  keyFindings: string;
  evidence: string;
  howToApply: string;
  codeExample: string;
  relatedResources: string[];
  glossary: Record<string, string>;
  tags: string[];
  aiCategory: string;
  devRelevance: number;
}
