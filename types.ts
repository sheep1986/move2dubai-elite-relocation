
export interface FAQItem {
  question: string;
  answer: string;
}

export interface Benefit {
  title: string;
  description: string;
}

export interface ContentSection {
  type: 'editorial' | 'stats' | 'split' | 'grid';
  tag: string;
  title: string;
  content: string | string[];
  image?: string;
  stat?: { value: string; label: string };
  items?: { title: string; text: string }[];
}

export interface BlogArticle {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  content: string[];
  heroImage: string;
}

export interface PageContent {
  id: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  heroHeadline: string;
  heroSubheadline: string;
  benefits: Benefit[];
  narrativeSection?: {
    title: string;
    text: string[];
  };
  sections: ContentSection[];
  faqs: FAQItem[];
  heroImage?: string;
  contentImage?: string;
  articles?: BlogArticle[];
  article?: BlogArticle;
}

export interface SiteConfig {
  brandName: string;
  primaryCta: string;
  secondaryCta: string;
  contactEmail: string;
  calendlyLink: string;
}
