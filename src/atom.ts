import { type FeedOptions, escapeXml, BaseFeed } from './common.ts';

interface AtomEntry {
  title: string;
  link: string;
  id: string;
  updated: Date;
  image?: string;
  summary: string;
  content?: string;
  contentType?: string;
}

export class AtomFeed extends BaseFeed<AtomEntry> {
  constructor(options: FeedOptions) {
    super(options);
  }

  build() {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<feed xmlns="http://www.w3.org/2005/Atom">\n`;
    xml += `  <title>${escapeXml(this.options.title)}</title>\n`;
    xml += `  <subtitle>${escapeXml(this.options.description)}</subtitle>\n`;
    xml += `  <link href="${escapeXml(this.options.link)}"/>\n`;
    xml += `  <updated>${this.options.updated.toISOString()}</updated>\n`;
    xml += `  <generator>Feed for JSR</generator>\n`;
    xml += `  <author>\n`;
    xml += `    <name>${escapeXml(this.options.author.name)}</name>\n`;
    xml += `    <email>${escapeXml(this.options.author.email)}</email>\n`;
    xml += `  </author>\n`;

        this.items.forEach(entry => {
          xml += `  <entry>\n`;
          xml += `    <title>${escapeXml(entry.title)}</title>\n`;
          xml += `    <link href="${escapeXml(entry.link)}"/>\n`;
          xml += `    <id>${escapeXml(entry.id)}</id>\n`;
          xml += `    <updated>${entry.updated.toISOString()}</updated>\n`;
          xml += `    <summary>${escapeXml(entry.summary)}</summary>\n`;
          const contentType = entry.contentType || 'text';
          xml += `    <content type="${contentType}">${escapeXml(entry.content || entry.summary)}</content>\n`;
          if (entry.image) {
            xml += `    <media:thumbnail url="${escapeXml(entry.image)}" />\n`;
          }
          xml += `  </entry>\n`;
        });

    this.categories.forEach(category => {
      xml += `  <category term="${escapeXml(category)}"/>\n`;
    });

    xml += `</feed>`;
    return xml;
  }
}
