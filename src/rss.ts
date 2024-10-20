import { BaseFeed, escapeXml, type FeedOptions } from "./common.ts";

interface RssItem {
  title: string;
  link: string;
  id: string;
  updated: Date;
  description: string;
  content?: string;
  contentType?: string;
}

export class RssFeed extends BaseFeed<RssItem> {
  constructor(options: FeedOptions) {
    super(options);
  }

  build(): string {
    const xmlParts: string[] = [
      `<?xml version="1.0" encoding="UTF-8"?>\n`,
      `<rss version="2.0">\n`,
      `  <channel>\n`,
      `    <title>${escapeXml(this.options.title)}</title>\n`,
      `    <description>${escapeXml(this.options.description)}</description>\n`,
      `    <link>${escapeXml(this.options.link)}</link>\n`,
      `    <lastBuildDate>${this.options.updated?.toUTCString()}</lastBuildDate>\n`,
      `    <language>${this.options.language || "en"}</language>\n`,
      `    <managingEditor>${escapeXml(this.options.author.email)} (${
        escapeXml(this.options.author.name)
      })</managingEditor>\n`,
      `    <webMaster>${escapeXml(this.options.author.email)} (${
        escapeXml(this.options.author.name)
      })</webMaster>\n`,
      `    <generator>Feed from JSR</generator>\n`,
    ];

    this.items.forEach((item) => {
      const itemParts: string[] = [
        `    <item>\n`,
        `      <title>${escapeXml(item.title)}</title>\n`,
        `      <link>${escapeXml(item.link)}</link>\n`,
        `      <guid>${escapeXml(item.id)}</guid>\n`,
        `      <pubDate>${item.updated.toUTCString()}</pubDate>\n`,
        `      <description>${escapeXml(item.description)}</description>\n`,
      ];
      if (item.content) {
        const contentType = item.contentType || "text";
        itemParts.push(
          `      <content:encoded type="${contentType}">${
            escapeXml(item.content)
          }</content:encoded>\n`,
        );
      }
      itemParts.push(`    </item>\n`);
      xmlParts.push(...itemParts);
    });

    xmlParts.push(`  </channel>\n`, `</rss>\n`);
    return xmlParts.join("");
  }
}
