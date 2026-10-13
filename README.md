# Forum Customizer

Forum Customizer is a Chromium extension for locally customizing the appearance of `forum.minerva.edu`.

It is built using Manifest V3 and plain HTML, CSS, and JavaScript, with no third-party libraries and no network requests.

## Features

- 16 themes (8 light, 8 dark) plus Forum's own look. Each theme recolors the page, cards, sidebar and header together.
- Accent color override for any theme.
- Corner style: Square (Forum's default), Soft, or Round.
- Text size from 90% to 125%.
- Seven curated font pairings (body + heading) that are designed to work together.
- A library of 20 header photos, pre-cropped to the exact shape of Forum's header.
- A header studio for uploading your own photo, positioning it, and zooming it inside a header-shaped frame before saving.
- Settings apply live to every open Forum tab and sync across devices via `chrome.storage.sync`.
- Settings from v1.0.x are migrated automatically.

## Installation

1. Open Chrome or a Chromium-based browser (version 111 or newer).
2. Go to `chrome://extensions`.
3. Enable **Developer mode** in the top-right corner.
4. Click **Load unpacked**.
5. Choose the `minerva forum customizer` folder (the one containing `manifest.json`).

## Usage

Click the toolbar icon on any page. The popup has three tabs:

- **Theme**: pick a light or dark theme, an optional accent color, and a corner style.
- **Header**: pick the theme color or one of the bundled photos, or click **Upload and crop your own** to open the header studio.
- **Text**: text size and font pairing.

**Reset** restores Forum's default look and removes any uploaded header.

## File overview

- `manifest.json`: extension metadata, permissions, content script and pages.
- `utils/catalog.js`: every choice the user can make (themes, font pairings, corner styles, header photos) and the function that turns a theme into a full palette. Shared by all scripts.
- `utils/defaults.js`: default preferences and migration of older saved settings.
- `utils/storage.js`: reads and writes preferences and the uploaded header image.
- `styles/injected.css`: **all** styling applied to Forum.
- `content/content.js`: applies saved preferences to Forum pages.
- `popup/`: the toolbar popup.
- `options/`: the header studio (upload, position, zoom, save).
- `images/headers/`: bundled 2400×200 header photos. Sources are listed in `CREDITS.md` there.

## How it works

Forum draws almost everything with a small set of CSS variables (`--white` for cards, `--black-tint-95` for the page, `--black-tint-20` for text, `--blue` for the accent, and so on). Themes work by pointing those variables at the theme's colors, so components picked up automatically stay consistent.

- `content/content.js` never writes CSS rules. It sets `data-mfc-*` attributes on `<html>` (for example `data-mfc-theme="sage"`, `data-mfc-mode="dark"`) and writes the chosen values as `--mfc-*` variables into a single `<style id="mfc-vars">`.
- `styles/injected.css` contains every rule, each guarded by one of those attributes. To debug, inspect `<html>` for the active attributes and `#mfc-vars` for the current values, then find the matching section in the stylesheet.
- Forum's React cards have generated class names that change between releases, so `content.js` marks real cards (Forum's `[data-testid="Box"]` elements that draw a surface) with `data-mfc-card="1"` for the corner and outline rules.
- The content script listens to `chrome.storage.onChanged`, so changes made in the popup or header studio apply immediately to all Forum tabs.

## Permissions

- `storage`: save preferences and the uploaded header image.
- Host permission `*://forum.minerva.edu/*`: run the content script on Forum and let it load the bundled header images.

## Known limitations

- Uploaded headers are stored in `chrome.storage.local`, so they don't sync across devices (the other settings do).
- In dark themes, a few embedded third-party views (PDF viewer, some editors) keep their own light styling.
- The header is a full-width strip, so narrow windows trim the left and right edges of the photo. The header studio shades the area that gets trimmed on a typical laptop.

## Maintenance notes

- Add a theme by adding one line to `THEMES` in `utils/catalog.js` (name, mode, page, surface, text, accent). The rest of the palette, the popup swatch and the sidebar colors are derived automatically.
- Add a header photo by saving a 2400×200 JPEG to `images/headers/`, adding it to `HEADERS` in `utils/catalog.js`, and crediting it in `images/headers/CREDITS.md`.
- If Forum changes its markup, the selectors to update are all in `styles/injected.css`.
