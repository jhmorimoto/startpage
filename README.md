# Startpage

Static start page that lists bookmarks from `bookmarks.yaml`.

Before starting the app, copy and rename `bookmarks-example.yaml` to `bookmarks.yaml` to create your own set of bookmarks.

## Requirements

- Plain HTML/CSS/JavaScript only, with no external frameworks
  (`js-yaml` is vendored locally in `vendor/js-yaml.min.js`, with no CDN or build step)
- Bookmarks loaded from a YAML file on the filesystem
- Each bookmark has a title, URL, and category
- Bookmarks displayed in panels, one per category
- Simple styling with flexible light and dark themes
- Button in the bottom-right corner to switch themes
- Read-only interface with no editing features
- CSS in a dedicated `style.css` file
- Search/filter input at the top
- `/` keyboard shortcut to focus the search input; any letter key also focuses the search and types the character
- Filtering hides non-matching items and shows only matching results

## Opening

Open `index.html` directly in a browser. Because the page reads a local file via `fetch`,
local file access must be enabled:

- **Chrome/Chromium:** start it with the flag
  `chromium --allow-file-access-from-files`
- **Firefox:** set `privacy.file_unique_origin` to `false` in `about:config`

Alternative without browser flags: serve the directory over HTTP with `make serve`(equivalent to `python3 -m http.server 8000`) and open `http://localhost:8000`. Use `make serve PORT=9000` to choose a different port.

This command can be configured with any service or daemon you prefer, such as systemd, init.d, background processes,
or autostart scripts.

## Bookmarks

Edit `bookmarks.yaml`:

```yaml
categories:
  - name: Programming
    bookmarks:
      - title: GitHub
        url: https://github.com
```

Only `http://` and `https://` URLs are rendered as links.

## Usage

- `/` focuses the search field
- Any letter key also focuses the search and starts filtering
- `Esc` clears the filter
- `Up`, `Down`, `Left`, and `Right` navigate through the results
- `Enter` opens the selected bookmark
- The bottom-right button switches between light and dark themes
