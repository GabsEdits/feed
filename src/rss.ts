import { BaseFeed, escapeXml, type FeedOptions } from "./common.ts";

interface RssItem {
  title: string;
  link: string;
  id: string;
  updated: Date;
  description: string;
  content: {
    body: string;
    type: string;
  };
}

/** Class representing an RSS feed. */
export class RssFeed extends BaseFeed<RssItem> {
  /**
   * Create an RSS feed.
   * @param {FeedOptions} options - The options for the feed.
   */
  constructor(options: FeedOptions) {
    super(options);
  }

  /**
   * Build the RSS feed XML string.
   * @returns {string} The RSS feed as an XML string.
   */
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
      `    <generator>${
        escapeXml(this.options.generator || "Feed for Deno")
      }</generator>\n`,
    ];

    if (this.options.authors.length > 0) {
      const authorXml = this.options.authors.map((author) => {
        const escapedEmail = escapeXml(author.email);
        const escapedName = escapeXml(author.name);
        return (
          `    <webMaster>${escapedEmail} (${escapedName})</webMaster>\n` +
          `    <author>${escapedEmail} (${escapedName})</author>\n` +
          `    <managingEditor>${escapedEmail} (${escapedName})</managingEditor>\n`
        );
      }).join("");
      xmlParts.push(authorXml);
    }

    if (this.items.length > 0) {
      const itemsXml = this.items.map((item) => {
        const contentXml = item.content
          ? `      <content:encoded type="${
            escapeXml(item.content.type || "text")
          }">${escapeXml(item.content.body)}</content:encoded>\n`
          : "";
        return (
          `    <item>\n` +
          `      <title>${escapeXml(item.title)}</title>\n` +
          `      <link>${escapeXml(item.link)}</link>\n` +
          `      <guid>${escapeXml(item.id)}</guid>\n` +
          `      <pubDate>${item.updated.toUTCString()}</pubDate>\n` +
          `      <description>${escapeXml(item.description)}</description>\n` +
          contentXml +
          `    </item>\n`
        );
      }).join("");
      xmlParts.push(itemsXml);
    }

    xmlParts.push(`  </channel>\n`, `</rss>\n`);
    return xmlParts.join("");
  }
}
