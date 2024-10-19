import { FeedOptions, escapeXml, BaseFeed } from './common.ts';

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

  build() {
    let rss = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    rss += `<rss version="2.0">\n`;
    rss += `  <channel>\n`;
    rss += `    <title>${escapeXml(this.options.title)}</title>\n`;
    rss += `    <description>${escapeXml(this.options.description)}</description>\n`;
    rss += `    <link>${escapeXml(this.options.link)}</link>\n`;
    rss += `    <lastBuildDate>${this.options.updated.toUTCString()}</lastBuildDate>\n`;
    rss += `    <language>${this.options.language || 'en'}</language>\n`;
    rss += `    <managingEditor>${escapeXml(this.options.author.email)} (${escapeXml(this.options.author.name)})</managingEditor>\n`;
    rss += `    <webMaster>${escapeXml(this.options.author.email)} (${escapeXml(this.options.author.name)})</webMaster>\n`;
    rss += `    <generator>Feed from JSR</generator>\n`;

    this.items.forEach(item => {
      rss += `    <item>\n`;
      rss += `      <title>${escapeXml(item.title)}</title>\n`;
      rss += `      <link>${escapeXml(item.link)}</link>\n`;
      rss += `      <guid>${escapeXml(item.id)}</guid>\n`;
      rss += `      <pubDate>${item.updated.toUTCString()}</pubDate>\n`;
      rss += `      <description>${escapeXml(item.description)}</description>\n`;
      if (item.content) {
        const contentType = item.contentType || 'text';
        rss += `      <content:encoded type="${contentType}">${escapeXml(item.content)}</content:encoded>\n`;
      }
      rss += `    </item>\n`;
    });

    rss += `  </channel>\n`;
    rss += `</rss>\n`;
    return rss;
  }
}
