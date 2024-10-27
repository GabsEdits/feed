export interface FeedOptions {
  title: string;
  description: string;
  link: string;
  updated?: Date;
  id?: string;
  language?: string;
  generator?: string;
  feedLinks?: {
    atom?: string;
  };
  authors: Array<{
    name: string;
    email: string;
    link?: string;
  }>;
  copyright?: string;
  feed?: string;
  icon?: string;
}

export function escapeXml(unsafe: string): string {
  const escapeMap: { [key: string]: string } = {
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    "'": "&apos;",
    '"': "&quot;",
  };
  return unsafe.replace(/[<>&'"]/g, (c) => escapeMap[c] || c);
}

export abstract class BaseFeed<T> {
  protected options: FeedOptions;
  protected items: Array<T>;
  protected categories: Set<string>;

  constructor(options: FeedOptions) {
    this.options = {
      ...options,
      updated: options.updated || new Date(),
    };
    this.items = [];
    this.categories = new Set();
  }

  abstract build(): string;

  addItem(item: T) {
    this.items.push(item);
  }

  addCategory(category: string) {
    this.categories.add(category);
  }

  addContributor(contributor: { name: string; email: string; link?: string }) {
    this.options.authors.push(contributor);
  }
}
