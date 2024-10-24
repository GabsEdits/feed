import { BaseFeed, escapeXml, type FeedOptions } from "./common.ts";

interface AtomEntry {
  title: string;
  link: string;
  id: string;
  updated: Date;
  image?: string;
  summary: string;
  content: {
    body: string;
    type?: string;
  };
}

export class AtomFeed extends BaseFeed<AtomEntry> {
  constructor(options: FeedOptions) {
    super(options);
  }

  build(): string {
    const xmlParts: string[] = [
      `<?xml version="1.0" encoding="UTF-8"?>\n`,
      `<feed xmlns="http://www.w3.org/2005/Atom">\n`,
      `  <title>${escapeXml(this.options.title)}</title>\n`,
      `  <subtitle>${escapeXml(this.options.description)}</subtitle>\n`,
      `  <link rel="alternate" href="${escapeXml(this.options.link)}"/>\n`,
      `  <updated>${this.options.updated?.toISOString()}</updated>\n`,
      `  <generator>${this.options.generator || "Feed for Deno"}</generator>\n`,
    ];

    this.options.authors.forEach((author) => {
      xmlParts.push(
        `  <author>\n`,
        `    <name>${escapeXml(author.name)}</name>\n`,
        `    <email>${escapeXml(author.email)}</email>\n`,
        `  </author>\n`,
      );
    });

    if (this.options.icon) {
      xmlParts.push(`  <icon>${escapeXml(this.options.icon)}</icon>\n`);
      xmlParts.push(`  <logo>${escapeXml(this.options.icon)}</logo>\n`);
    }

    if (this.options.feed) {
      xmlParts.push(
        `  <link rel="self" href="${escapeXml(this.options.feed)}"/>\n`,
      );
    }

    this.items.forEach((entry) => {
      xmlParts.push(
        `  <entry>\n`,
        `    <title>${escapeXml(entry.title)}</title>\n`,
        `    <link href="${escapeXml(entry.link)}"/>\n`,
        `    <id>${escapeXml(entry.id)}</id>\n`,
        `    <updated>${entry.updated.toISOString()}</updated>\n`,
        `    <summary>${escapeXml(entry.summary)}</summary>\n`,
        `    <content type="${entry.content.type || "text"}">${
          escapeXml(entry.content.body || entry.summary)
        }</content>\n`,
        entry.image
          ? `    <media:thumbnail url="${escapeXml(entry.image)}" />\n`
          : "",
        `  </entry>\n`,
      );
    });

    this.categories.forEach((category) => {
      xmlParts.push(`  <category term="${escapeXml(category)}"/>\n`);
    });

    xmlParts.push(`</feed>\n`);
    return xmlParts.join("");
  }
}
