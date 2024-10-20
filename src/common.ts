export interface FeedOptions {
  title: string;
  description: string;
  link: string;
  updated: Date;
  id?: string;
  language?: string;
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
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case '"':
        return "&quot;";
      default:
        return c;
    }
  });
}

export abstract class BaseFeed<T> {
  protected options: FeedOptions;
  protected items: Array<T>;
  protected categories: Array<string>;

  constructor(options: FeedOptions) {
    this.options = options;
    this.items = [];
    this.categories = [];
  }

  abstract build(): string;

  addItem(item: T) {
    this.items.push(item);
  }

  addCategory(category: string) {
    this.categories.push(category);
  }
}
