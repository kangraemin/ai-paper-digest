export interface S2Paper {
  paperId: string;
  title: string;
  abstract: string | null;
  authors: { name: string; affiliations?: string[] }[];
  venue?: string;
  year: number;
  publicationDate?: string;
  citationCount: number;
  externalIds?: { ArXiv?: string };
  fieldsOfStudy?: string[];
}
