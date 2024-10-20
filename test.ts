import { atom, json, rss } from "@feed/feed";

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

Deno.test("RSS Feed Generation", () => {
  const rssFeed = new rss({
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
    content: "Content for RSS item 1",
    contentType: "html",
  });

  const expected = `
    <?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0">
      <channel>
        <title>RSS Feed Example</title>
        <description>A simple RSS feed example</description>
        <link>http://example.com/rss-feed</link>
        <lastBuildDate>Sat, 19 Oct 2024 15:12:56 GMT</lastBuildDate>
        <language>en</language>
        <generator>Feed from JSR</generator>
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

Deno.test("Atom Feed Generation", () => {
  const atomFeed = new atom({
    title: "Atom Feed Example",
    description: "A simple Atom feed example",
    link: "http://example.com/atom-feed",
    authors: [
      {
        name: "John Doe",
        email: "test@example.org",
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
    content: "Content for Atom item 1",
    contentType: "html",
  });

  const expected = `
    <?xml version="1.0" encoding="UTF-8"?>
    <feed xmlns="http://www.w3.org/2005/Atom">
      <title>Atom Feed Example</title>
      <subtitle>A simple Atom feed example</subtitle>
      <link rel="alternate" href="http://example.com/atom-feed"/>
      <updated>2024-10-19T15:12:56.000Z</updated>
      <generator>Feed for Deno/JSR</generator>
      <author>
        <name>John Doe</name>
        <email>test@example.org</email>
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

Deno.test("JSON Feed Generation", () => {
  const jsonFeed = new json({
    title: "JSON Feed Example",
    description: "A simple JSON feed example",
    link: "http://example.com/json-feed",
    feed: "http://example.com/json-feed/feed.json",
    authors: [
      {
        name: "John Doe",
        email: "test@example.org"
      },
    ],
    updated: new Date("2024-10-19T15:12:56Z")
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
      "updated": "2024-10-19T15:12:56.000Z",
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
