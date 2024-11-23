<div align="center">
    <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://github.com/user-attachments/assets/a5b534dd-741c-4506-9890-1a7a849bc52f">
    <source media="(prefers-color-scheme: light)" srcset="https://github.com/user-attachments/assets/c76ceb71-6ad5-49a8-89df-5084d7a713ba">
    <img alt="Feed logo" src="https://github.com/user-attachments/assets/c76ceb71-6ad5-49a8-89df-5084d7a713ba" width="220">
  </picture>
<p>A modern, fast, and easy-to-use RSS, JSON and Atom feed generator for Deno and the web.
<br><small>Replacement for <a href="https://npmjs.com/package/feed">feed</a> package.</small></p>

[![JSR](https://jsr.io/badges/@feed/feed)](https://jsr.io/@feed/feed)
[![JSR Score](https://jsr.io/badges/@feed/feed/score)](https://jsr.io/@feed/feed)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/GabsEdits/feed/test.yml)

</div>

- Build with modern technologies, and the latest standards, using TypeScript and
  Deno.
- Using JSR, insuring the best performance, and the best compatibility.
- Supported feed formats: RSS 2.0, Atom 1.0 and JSON Feed 1.1.
- Build for Deno, and supports Node.js, and more.
- Easy to use, and easy to customize.
- Typed, and fully documented.
- No dependencies.
- Fully tested.

## Getting Started

### Installation

```bash
npx jsr add @feed/feed
```

or

```bash
deno add jsr:@feed/feed
```

### Examples

### Atom Feed

```typescript
import { Atom } from "jsr:@feed/feed";

const atomFeed = new Atom({
  title: "Atom Feed Example",
  description: "A simple Atom feed example",
  link: "http://example.com/atom-feed",
  authors: [
    {
      name: "John Doe",
    },
  ],
  id: "https://example.com/atom-feed",
});

atomFeed.addItem({
  title: "First Atom Item",
  link: "http://example.com/atom1",
  id: "1",
  updated: new Date(),
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
import { Rss } from "jsr:@feed/feed";

const rssFeed = new Rss({
  title: "RSS Feed Example",
  description: "A simple RSS feed example",
  link: "http://example.com/rss-feed",
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
import { Json } from "jsr:@feed/feed";

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

---

## Documentation

You can find the full documentation [here](/DOCUMENTATION.md).

## Know your rights

This project is under the GPL-3.0 License:

- **Permissions**: Commercial use, Modification, Distribution, Private use.
- **Limitations**: Liability, Warranty.
- **Conditions**: License and copyright notice. State changes, and Disclose
  source.

Read the full license [here](LICENSE.txt).

## Contributing

Please read the [CONTRIBUTING.md](CONTRIBUTING.md) file for more information.
