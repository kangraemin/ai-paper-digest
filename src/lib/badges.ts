const FAMOUS_ORGS = ['OpenAI', 'Google', 'DeepMind', 'Anthropic', 'Meta', 'Microsoft', 'NVIDIA', 'Apple', 'Amazon'];
const FAMOUS_VENUES = ['NeurIPS', 'ICML', 'ICLR', 'ACL', 'EMNLP', 'CVPR', 'ICCV', 'ECCV', 'AAAI'];
const FAMOUS_AUTHORS: Record<string, string> = {
  'Geoffrey Hinton': 'Hinton',
  'Yann LeCun': 'LeCun',
  'Yoshua Bengio': 'Bengio',
  'Andrej Karpathy': 'Karpathy',
  'Ilya Sutskever': 'Sutskever',
  'Demis Hassabis': 'Hassabis',
  'Sam Altman': 'Altman',
};

export interface Badge {
  icon: string;
  label: string;
}

export function computeBadges(params: {
  authors: string;
  affiliations?: string | null;
  venue?: string | null;
}): Badge[] {
  const badges: Badge[] = [];

  // Check famous authors
  for (const [fullName, shortName] of Object.entries(FAMOUS_AUTHORS)) {
    if (params.authors.includes(fullName)) {
      badges.push({ icon: '\u2B50', label: shortName });
    }
  }

  // Check famous orgs (case-insensitive partial match)
  if (params.affiliations) {
    const affiliationsLower = params.affiliations.toLowerCase();
    for (const org of FAMOUS_ORGS) {
      if (affiliationsLower.includes(org.toLowerCase())) {
        badges.push({ icon: '\uD83C\uDFE2', label: org });
      }
    }
  }

  // Check famous venues (case-insensitive partial match)
  if (params.venue) {
    const venueLower = params.venue.toLowerCase();
    for (const venue of FAMOUS_VENUES) {
      if (venueLower.includes(venue.toLowerCase())) {
        badges.push({ icon: '\uD83C\uDF93', label: venue });
      }
    }
  }

  return badges;
}
