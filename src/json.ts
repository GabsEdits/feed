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
      author: {
        name: this.options.author.name,
        email: this.options.author.email,
        link: this.options.author.link,
      },
      updated: this.options.updated.toISOString(),
      items: this.items.map((item) => {
        const jsonItem: Record<string, unknown> = {
          id: item.id,
          title: item.title,
          url: item.url,
          date_published: item.date_published.toISOString(),
        };
        if (item.content_html) {
          jsonItem.content_html = item.content_html;
        }
        return jsonItem;
      }),
    };
    return JSON.stringify(json, null, 2);
  }
}
