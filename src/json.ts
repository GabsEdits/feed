import { BaseFeed, type FeedOptions } from "./common.ts";

interface JsonItem {
  title: string;
  id: string;
  date_published: Date;
  content_html?: string;
  url: string;
}

/** This class represents a JSON Feed and provides methods to build the feed. */
export class JsonFeed extends BaseFeed<JsonItem> {
  /**
   * Constructs a new JsonFeed instance.
   * @param options - The options for the feed.
   */
  constructor(options: FeedOptions) {
    super(options);
  }

  /**
   * Builds the JSON feed and returns it as a string.
   * @returns The JSON feed as a string.
   */
  build(): string {
    const json: Record<string, unknown> = {
      version: "https://jsonfeed.org/version/1",
      title: this.options.title,
      home_page_url: this.options.link,
      feed_url: this.options.feed,
      icon: this.options.icon,
      updated: this.options.updated?.toISOString(),
      items: this.items.map((
        { id, title, url, date_published, content_html },
      ) => ({
        id,
        title,
        url,
        date_published: date_published.toISOString(),
        ...(content_html && { content_html }),
      })),
    };
    return JSON.stringify(json, null, 2);
  }
}
