<div align="center">
    <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://github.com/user-attachments/assets/a5b534dd-741c-4506-9890-1a7a849bc52f">
    <source media="(prefers-color-scheme: light)" srcset="https://github.com/user-attachments/assets/c76ceb71-6ad5-49a8-89df-5084d7a713ba">
    <img alt="Feed logo" src="https://github.com/user-attachments/assets/c76ceb71-6ad5-49a8-89df-5084d7a713ba" width="220">
  </picture>
<p>A modern, fast, and easy-to-use RSS and Atom feed generator for Deno.
<br><small>Replacement for <a href="https://npmjs.com/package/feed">feed</a> package.</small></p>
</div>

- Build with modern technologies, and the latest standards, using TypeScript and Deno.
- Using JSR, insuring the best performance, and the best compatibility.
- Supported feed formats: RSS 2.0, Atom 1.0 and JSON Feed 1.1.
- Easy to use, and easy to customize.
- Supports Node.js, and Deno.
- No dependencies.
- Fully tested.

## Getting Started

### Installation

```bash
npx jsr add @feed/feed
```

or

```bash
deno add @feed/feed
```

### Examples

### Atom Feed

```typescript
import { atom } from "@feed/feed";

const atomFeed = new Atom({
  title: "Atom Feed Example",
  description: "A simple Atom feed example",
  link: "http://example.com/atom-feed",
  authors: [
    {
      name: "John Doe",
      email: "test@example.org",
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

Deno.writeTextFileSync("example.xml", atomFeed.build());
```

### RSS Feed

```typescript
import { rss } from "@feed/feed";

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
});

Deno.writeTextFileSync("example.rss", rssFeed.build());
```

### JSON Feed

```typescript
import { json } from "@feed/feed";

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

Deno.writeTextFileSync("example.json", jsonFeed.build());
```

## Roadmap

- [x] Allow multiple authors.
- [x] Add contributors.
