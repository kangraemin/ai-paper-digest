export interface ArxivEntry {
  id: string;
  title: string;
  abstract: string;
  authors: string[];
  categories: string[];
  primaryCategory: string;
  publishedAt: string;
  updatedAt: string;
  arxivUrl: string;
  pdfUrl: string;
}
