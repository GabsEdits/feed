import { BaseFeed, type FeedOptions } from "./common.ts";

interface JsonItem {
  title: string;
  id: string;
  date_published: Date;
  content_html?: string;
  url: string;
}

export class JsonFeed extends BaseFeed<JsonItem> {
  constructor(options: FeedOptions) {
    super(options);
  }

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
