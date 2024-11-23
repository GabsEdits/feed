## Documentation

This is the project's documentation, here you will find how to use the project.

### Common properties

Here is the list of the properties that are common between the three feed types
(RSS, Atom, JSON).

- `title`: Ditto
- `description`: Ditto
- `link`: Ditto

#### Authors

The `authors` property is an array of authors, each author should have a `name`
property, and optionally an `email` property and `link` property (the link can
be any URL).

The required properties of an author are:

```typescript
authors: [
  {
    name: "John Doe",
  }
],
```

### Atom

The additional properties for the Atom feed are:

#### Feed Options

- `id`: The unique identifier for the feed, usually a URL.

##### Extra Options

- `updated`: The last time the feed was updated. By default, it's the current
  time, but you can set it to any date.

- `generator`: The generator of the feed, by default it's
  `@feed/feed on JSR.io`, but you can set it to any string.

- `icon`: The icon of the feed, it should be a URL.

#### Item Options

##### Required

- `title`: Ditto, title of the item.
- `link`: Ditto, link to the item.
- `id`: Unique identifier for the item.
- `summary`: Ditto, summary of the item.

##### Additional

###### Content

Ditto, the content of the item, it should be an object with a `body` property,
and a `type` property.

```typescript
content: {
  type: "html", // Optional, as if not provided, the type will be "text".
  body: "Content for Atom item 1", // Optional, as if not provided, the content will be the same as the summary.
}
```

###### Others

- `updated`: The last time the item was updated. If not provided, it will be the
  current time.

- `image`: The image of the item, it should be a URL.

### RSS

The additional properties for the RSS feed are:

#### Feed Options

**Note: All the properties are optional for the feed options.**

- `generator`: The generator of the feed, by default it's
  `@feed/feed on JSR.io`, but you can set it to any string.

- `icon`: The icon of the feed, it should be a URL.

- `feed`: The URL of the feed, it should be a URL.

- `language`: The language of the feed, by default it's `en-US`, but you can set
  it to any language code.

#### Item Options

##### Required

- `title`: Ditto, title of the item.
- `link`: Ditto, link to the item.
- `id`: Unique identifier for the item.
- `description`: Ditto, summary of the item.

##### Additional

###### Content

Ditto, the content of the item, it should be an object with a `body` property,
and a `type` property.

```typescript
content: {
  type: "html", // Optional, as if not provided, the type will be "text".
  body: "Content for Atom item 1", // Optional, as if not provided, the content will be the same as the summary.
}
```

###### Others

- `image`: The image of the item, it should be a URL.

### JSON

The additional properties for the JSON feed are:

#### Feed Options

- `icon`: The icon of the feed, it should be a URL.

Optional properties:

- `feed`: The URL of the feed, it should be a URL.

- `updated`: The last time the feed was updated. By default, it's the current
  time, but you can set it to any date.

#### Item Options

- `id`: Unique identifier for the item.
- `title`: Ditto, title of the item.
- `url`: Ditto, link to the item.
- `content_html`: The content of the item, it should be an HTML string.

Optional properties:

- `date_published`: The date the item was published. By default, it's the
  current time, but you can set it to any date.
