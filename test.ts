import { Atom, Json, Rss } from "@feed/feed";

interface XmlNode {
  name: string;
  attributes: Record<string, string>;
  children: XmlNode[];
  text: string;
}

function assertEquals(actual: string, expected: string): void {
  if (actual !== expected) {
    const actualLines = actual.split("\n");
    const expectedLines = expected.split("\n");
    const differences = actualLines.map((line, index) => {
      if (line !== expectedLines[index]) {
        return `Line ${index + 1}:\nActual: ${line}\nExpected: ${
            expectedLines[index]
        }`;
      }
      return null;
    }).filter((diff) => diff !== null).join("\n\n");
    throw new Error(`Assertion failed:\n${differences}`);
  }
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function parseXml(xml: string): Record<string, unknown> {
  const root: XmlNode = {
    name: "__root__",
    attributes: {},
    children: [],
    text: "",
  };
  const stack: XmlNode[] = [root];
  const tokenPattern = /<[^>]+>|[^<]+/g;

  for (const token of xml.match(tokenPattern) ?? []) {
    if (token.startsWith("<")) {
      if (
        token.startsWith("<?") ||
        token.startsWith("<!--") ||
        token.startsWith("<!DOCTYPE") ||
        token.startsWith("<![CDATA[")
      ) {
        continue;
      }

      const closeMatch = token.match(/^<\s*\/\s*([^\s>]+)\s*>$/);
      if (closeMatch) {
        const closing = closeMatch[1];
        const current = stack.pop();
        if (!current || current.name !== closing) {
          throw new Error(`XML parse error: unexpected closing tag </${closing}>`);
        }
        continue;
      }

      const selfClosing = /\/>\s*$/.test(token);
      const openMatch = token.match(/^<\s*([^\s/>]+)([\s\S]*?)\/?\s*>$/);
      if (!openMatch) {
        throw new Error(`XML parse error: invalid tag ${token}`);
      }

      const [, name, rawAttrs] = openMatch;
      const node: XmlNode = {
        name,
        attributes: parseAttributes(rawAttrs),
        children: [],
        text: "",
      };

      stack[stack.length - 1].children.push(node);
      if (!selfClosing) {
        stack.push(node);
      }
      continue;
    }

    stack[stack.length - 1].text += token;
  }

  if (stack.length !== 1) {
    const unclosed = stack[stack.length - 1].name;
    throw new Error(`XML parse error: unclosed tag <${unclosed}>`);
  }

  const result: Record<string, unknown> = {};
  for (const child of root.children) {
    result[child.name] = nodeToValue(child);
  }
  return result;
}

function parseAttributes(raw: string): Record<string, string> {
  const attributes: Record<string, string> = {};
  const attrPattern = /([:\w.-]+)\s*=\s*(["'])(.*?)\2/g;
  for (const match of raw.matchAll(attrPattern)) {
    attributes[match[1]] = match[3];
  }
  return attributes;
}

function nodeToValue(node: XmlNode): unknown {
  const hasAttributes = Object.keys(node.attributes).length > 0;
  const hasChildren = node.children.length > 0;
  const text = node.text.trim();

  if (!hasAttributes && !hasChildren) {
    return text;
  }

  const value: Record<string, unknown> = {};
  for (const [key, attrValue] of Object.entries(node.attributes)) {
    value[`@_${key}`] = attrValue;
  }

  for (const child of node.children) {
    const childValue = nodeToValue(child);
    const existing = value[child.name];
    if (existing === undefined) {
      value[child.name] = childValue;
    } else if (Array.isArray(existing)) {
      existing.push(childValue);
    } else {
      value[child.name] = [existing, childValue];
    }
  }

  if (text) {
    value["#text"] = text;
  }

  return value;
}

function asRecord(value: unknown, message: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(message);
  }
  return value as Record<string, unknown>;
}

function hasText(value: unknown): boolean {
  return typeof value === "string" && value.length > 0;
}

function isIsoDate(s: string | null | undefined): boolean {
  if (!s) return false;
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/.test(s);
}

Deno.test("RSS Feed Generation (snapshot)", () => {
  const rssFeed = new Rss({
    title: "RSS Feed Example",
    description: "A simple RSS feed example",
    link: "http://example.com/rss-feed",
    updated: new Date("2024-10-19T15:12:56Z"),
    id: "http://example.com/rss-feed",
    authors: [
      {
        name: "John Doe",
        email: "test@example.org",
        link: "https://example.org",
      },
    ],
  });

  rssFeed.addItem({
    title: "First RSS Item",
    link: "http://example.com/rss1",
    id: "http://example.com/rss1",
    updated: new Date("2024-10-19T15:12:56Z"),
    description: "Description for RSS item 1",
    content: {
      body: "Content for RSS item 1",
      type: "html",
    },
  });

  const expected = `
    <?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0"
      xmlns:content="http://purl.org/rss/1.0/modules/content/"
      xmlns:media="http://search.yahoo.com/mrss/">
      <channel>
        <title>RSS Feed Example</title>
        <description>A simple RSS feed example</description>
        <link>http://example.com/rss-feed</link>
        <lastBuildDate>Sat, 19 Oct 2024 15:12:56 GMT</lastBuildDate>
        <language>en-US</language>
        <generator>@feed/feed on JSR.io</generator>
        <webMaster>test@example.org (John Doe)</webMaster>
        <author>test@example.org (John Doe)</author>
        <managingEditor>test@example.org (John Doe)</managingEditor>
        <item>
          <title>First RSS Item</title>
          <link>http://example.com/rss1</link>
          <guid>http://example.com/rss1</guid>
          <pubDate>Sat, 19 Oct 2024 15:12:56 GMT</pubDate>
          <description>Description for RSS item 1</description>
          <content:encoded type="html">Content for RSS item 1</content:encoded>
        </item>
      </channel>
    </rss>
`.replace(/\n\s+/g, "\n").trim();

  assertEquals(rssFeed.build().replace(/\s/g, ""), expected.replace(/\s/g, ""));
});

Deno.test("RSS Feed Generation (well-formed + basic checks)", () => {
  const rssFeed = new Rss({
    title: "RSS Feed Example",
    description: "A simple RSS feed example",
    link: "http://example.com/rss-feed",
    updated: new Date("2024-10-19T15:12:56Z"),
    id: "http://example.com/rss-feed",
    authors: [
      {
        name: "John Doe",
        email: "test@example.org",
      },
    ],
  });

  rssFeed.addItem({
    title: "First RSS Item",
    link: "http://example.com/rss1",
    id: "http://example.com/rss1",
    updated: new Date("2024-10-19T15:12:56Z"),
    description: "Description for RSS item 1",
    content: {
      body: "Content for RSS item 1",
      type: "html",
    },
    image: "http://example.com/image.jpg",
  });

  const xml = rssFeed.build();
  const doc = parseXml(xml);

  const rss = asRecord(doc.rss, "Missing <rss> root element");
  assert(rss["@_version"] === "2.0", "RSS version must be 2.0");

  // Only assert namespaces if the prefixed elements exist (less brittle)
  const hasContentEncoded = xml.includes("<content:encoded");
  if (hasContentEncoded) {
    assert(
        rss["@_xmlns:content"] ===
        "http://purl.org/rss/1.0/modules/content/",
        "Missing/incorrect xmlns:content for <content:encoded>",
    );
  }

  const hasMediaThumb = xml.includes("<media:thumbnail");
  if (hasMediaThumb) {
    assert(
        rss["@_xmlns:media"] === "http://search.yahoo.com/mrss/",
        "Missing/incorrect xmlns:media for <media:thumbnail>",
    );
  }

  const channel = asRecord(rss.channel, "Missing channel element");
  assert(hasText(channel.title), "Missing channel title");
  assert(hasText(channel.link), "Missing channel link");
  assert(hasText(channel.description), "Missing channel description");

  const itemValue = Array.isArray(channel.item) ? channel.item[0] : channel.item;
  const item = asRecord(itemValue, "Missing item element");
  assert(hasText(item.title), "Missing item title");
  assert(hasText(item.link), "Missing item link");
  assert(hasText(item.guid), "Missing item guid");
  assert(hasText(item.pubDate), "Missing item pubDate");
  assert(hasText(item.description), "Missing item description");
});

Deno.test("Atom Feed Generation (snapshot)", () => {
  const atomFeed = new Atom({
    title: "Atom Feed Example",
    description: "A simple Atom feed example",
    link: "http://example.com/atom-feed",
    authors: [
      {
        name: "John Doe",
        link: "https://example.org",
      },
    ],
    updated: new Date("2024-10-19T15:12:56Z"),
    id: "https://example.com/atom-feed",
  });

  atomFeed.addItem({
    title: "First Atom Item",
    link: "http://example.com/atom1",
    id: "1",
    updated: new Date("2024-10-19T15:12:56Z"),
    summary: "Summary for Atom item 1",
    content: {
      body: "Content for Atom item 1",
      type: "html",
    },
  });

  const expected = `
    <?xml version="1.0" encoding="UTF-8"?>
    <feed xmlns="http://www.w3.org/2005/Atom">
      <title>Atom Feed Example</title>
      <subtitle>A simple Atom feed example</subtitle>
      <link rel="alternate" href="http://example.com/atom-feed"/>
      <id>https://example.com/atom-feed</id>
      <updated>2024-10-19T15:12:56.000Z</updated>
      <generator>@feed/feed on JSR.io</generator>
      <author>
        <name>John Doe</name>
        <uri>https://example.org</uri>
      </author>
      <entry>
        <title>First Atom Item</title>
        <link href="http://example.com/atom1"/>
        <id>1</id>
        <updated>2024-10-19T15:12:56.000Z</updated>
        <summary>Summary for Atom item 1</summary>
        <content type="html">Content for Atom item 1</content>
      </entry>
    </feed>
`.replace(/\n\s+/g, "\n").trim();

  assertEquals(
      atomFeed.build().replace(/\s/g, ""),
      expected.replace(/\s/g, ""),
  );
});

Deno.test("Atom Feed Generation (well-formed + basic checks)", () => {
  const atomFeed = new Atom({
    title: "Atom Feed Example",
    description: "A simple Atom feed example",
    link: "http://example.com/atom-feed",
    authors: [
      {
        name: "John Doe",
        link: "https://example.org",
      },
    ],
    updated: new Date("2024-10-19T15:12:56Z"),
    id: "https://example.com/atom-feed",
  });

  atomFeed.addItem({
    title: "First Atom Item",
    link: "http://example.com/atom1",
    id: "1",
    updated: new Date("2024-10-19T15:12:56Z"),
    summary: "Summary for Atom item 1",
    content: {
      body: "Content for Atom item 1",
      type: "html",
    },
  });

  const xml = atomFeed.build();
  const doc = parseXml(xml);

  const feed = asRecord(doc.feed, "Missing <feed> root element");

  // Atom requirements (minimal):
  assert(hasText(feed.title), "Missing <feed><title>");
  assert(hasText(feed.id), "Missing <feed><id>");
  assert(hasText(feed.updated), "Missing <feed><updated>");

  const entryValue = Array.isArray(feed.entry) ? feed.entry[0] : feed.entry;
  const entry = asRecord(entryValue, "Missing <entry>");
  assert(hasText(entry.id), "Missing <entry><id>");

  const feedUpdated = typeof feed.updated === "string" ? feed.updated : null;
  // If your implementation uses ISO, enforce it:
  if (feedUpdated?.includes("T")) {
    assert(isIsoDate(feedUpdated), `Feed <updated> should be ISO (got ${feedUpdated})`);
  }

  const entryUpdated = typeof entry.updated === "string" ? entry.updated : null;
  if (entryUpdated?.includes("T")) {
    assert(isIsoDate(entryUpdated), `Entry <updated> should be ISO (got ${entryUpdated})`);
  }
});

Deno.test("JSON Feed Generation (snapshot)", () => {
  const jsonFeed = new Json({
    title: "JSON Feed Example",
    description: "A simple JSON feed example",
    link: "http://example.com/json-feed",
    feed: "http://example.com/json-feed/feed.json",
    authors: [
      {
        name: "John Doe",
        email: "test@example.org",
      },
    ],
    updated: new Date("2024-10-19T15:12:56Z"),
  });

  jsonFeed.addItem({
    id: "1",
    title: "First JSON Item",
    url: "http://example.com/json1",
    date_published: new Date("2024-10-19T15:12:56Z"),
    content_html: "Content for JSON item 1",
  });

  const expected = `
    {
      "version": "https://jsonfeed.org/version/1",
      "title": "JSON Feed Example",
      "home_page_url": "http://example.com/json-feed",
      "feed_url": "http://example.com/json-feed/feed.json",
      "date_modified": "2024-10-19T15:12:56.000Z",
      "items": [
        {
          "id": "1",
          "title": "First JSON Item",
          "url": "http://example.com/json1",
          "date_published": "2024-10-19T15:12:56.000Z",
          "content_html": "Content for JSON item 1"
        }
      ]
    }
`.replace(/\n\s+/g, "\n").trim();

  assertEquals(
      jsonFeed.build().replace(/\s/g, ""),
      expected.replace(/\s/g, ""),
  );
});

Deno.test("JSON Feed Generation (parses + basic checks)", () => {
  const jsonFeed = new Json({
    title: "JSON Feed Example",
    description: "A simple JSON feed example",
    link: "http://example.com/json-feed",
    feed: "http://example.com/json-feed/feed.json",
    authors: [{ name: "John Doe", email: "test@example.org" }],
    updated: new Date("2024-10-19T15:12:56Z"),
  });

  jsonFeed.addItem({
    id: "1",
    title: "First JSON Item",
    url: "http://example.com/json1",
    date_published: new Date("2024-10-19T15:12:56Z"),
    content_html: "Content for JSON item 1",
  });

  const text = jsonFeed.build();
  const obj = JSON.parse(text) as Record<string, unknown>;

  assert(typeof obj.version === "string", "JSON Feed must have version");
  assert(typeof obj.title === "string", "JSON Feed must have title");
  assert(typeof obj.home_page_url === "string", "JSON Feed must have home_page_url");

  const items = obj.items as Array<Record<string, unknown>>;
  assert(Array.isArray(items), "JSON Feed must have items array");
  assert(items.length > 0, "JSON Feed must have at least one item");

  const first = items[0];
  assert(typeof first.id === "string", "Item must have id");
  assert(typeof first.url === "string", "Item must have url");

  const dp = first.date_published;
  if (typeof dp === "string") {
    assert(isIsoDate(dp), `date_published must be ISO string (got ${dp})`);
  }
});