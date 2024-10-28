/**
 * Interface representing the options for a feed.
 */
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

/**
 * Escapes special characters in a string to their corresponding XML entities.
 * @param unsafe - The string to be escaped.
 * @returns The escaped string.
 */
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

/**
 * Abstract class representing a base feed.
 * @template T - The type of items in the feed.
 */
export abstract class BaseFeed<T> {
  protected options: FeedOptions;
  protected items: Array<T>;
  protected categories: Set<string>;

  /**
   * Creates an instance of BaseFeed.
   * @param options - The options for the feed.
   */
  constructor(options: FeedOptions) {
    this.options = {
      ...options,
      updated: options.updated || new Date(),
    };
    this.items = [];
    this.categories = new Set();
  }

  /**
   * Builds the feed and returns it as a string.
   * @returns The feed as a string.
   */
  abstract build(): string;

  /**
   * Adds an item to the feed.
   * @param item - The item to be added.
   */
  addItem(item: T) {
    this.items.push(item);
  }

  /**
   * Adds a category to the feed.
   * @param category - The category to be added.
   */
  addCategory(category: string) {
    this.categories.add(category);
  }

  /**
   * Adds a contributor to the feed.
   * @param contributor - The contributor to be added.
   */
  addContributor(contributor: { name: string; email: string; link?: string }) {
    this.options.authors.push(contributor);
  }
}
