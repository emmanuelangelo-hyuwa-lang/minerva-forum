# Forum Customizer

Forum Customizer is a Chromium extension for locally customizing the appearance of `forum.minerva.edu`.

It is built using Manifest V3 and plain HTML, CSS, and JavaScript. The extension injects runtime styling into the Minerva forum page and updates that styling on client-side navigation.

## Features

- Popup settings panel for theme, fonts, accent color, and header backdrop.
- Separate body font and heading font controls.
- Eight built-in theme presets.
- Custom accent color support for the default theme.
- Header backdrop presets plus custom header image upload.
- Header uploads are stored in `chrome.storage.local` and scaled to fit.
- Rounded UI toggle for cards, panels, and sidebar containers.
- Bug report button linking to `kunate0@gmail.com`.
- Preference persistence via `chrome.storage.sync`.
- Automatic style reapplication during Minerva SPA navigation.

## Installation

1. Open Chrome or a Chromium-based browser.
2. Go to `chrome://extensions`.
3. Enable **Developer mode** in the top-right corner.
4. Click **Load unpacked**.
5. Choose the `minerva forum customizer` folder.
6. Confirm the extension appears in the extension list.

## Usage

1. Open a page on `https://forum.minerva.edu`.
2. Click the extension toolbar icon.
3. Select your preferred theme, fonts, accent color, and header backdrop.
4. Upload a custom header image if desired.
5. The page updates immediately and saves settings automatically.
6. Refresh or navigate inside the forum app and the custom styling persists.

## Popup controls

- **Theme**: Chooses a color palette preset.
- **Body Font**: Controls the text font across the forum.
- **Heading Font**: Controls headings and title fonts.
- **Accent color**: Adjusts the accent color for the default theme.
- **Header backdrop**: Selects default, curated presets, or custom upload.
- **Upload header image**: Stores a custom header image locally and applies it to the header area.
- **Rounded UI**: Applies softer border radius styling to cards and panels.
- **Reset**: Restores defaults and clears the uploaded header image.
- **Report a bug**: Opens a mail message to `kunate0@gmail.com`.

## File overview

- `manifest.json`
  - Extension metadata, permissions, content scripts, and popup configuration.
- `content/content.js`
  - Runtime page logic, style generation, MutationObserver support, and message handling.
- `popup/popup.html`
  - Settings panel markup and controls.
- `popup/popup.js`
  - Popup initialization, storage handling, event listeners, and update dispatch.
- `popup/popup.css`
  - Popup styling and layout.
- `styles/injected.css`
  - Minimal base stylesheet loaded by the content script.
- `utils/defaults.js`
  - Shared default preference object used by both popup and content script.
- `utils/storage.js`
  - Async wrapper for `chrome.storage.sync` and `chrome.storage.local`.

## How it works

### Content script injection

The content script is injected into all matching `forum.minerva.edu` pages at `document_idle`. It loads saved preferences and builds a stylesheet from those values. The generated stylesheet is inserted into the page as a `<style>` tag with the ID `minerva-forum-customizer-styles`.

### Preference loading and saving

- `utils/storage.js` reads and writes `minervaPrefs` to `chrome.storage.sync`.
- Uploaded header images are stored as data URLs under `minervaHeaderImage` in `chrome.storage.local`.
- `utils/defaults.js` exposes `window.MINERVA_DEFAULT_PREFS` so both the popup and content script share the same default values.

### Style generation

- `content/content.js` maps theme keys to color palettes and font keys to CSS font stacks.
- A custom header image or preset image is applied using `background-image` rules.
- Custom header images use `background-size: 100% auto`, `background-repeat: no-repeat`, and `background-position: center bottom` for width-fitting and bottom alignment.
- Rounded UI uses explicit page selectors to apply border-radius and overflow styling to cards, panels, and sidebar sections.
- Accent color values update CSS variables for the default theme.

### Updating live pages

- The popup sends `UPDATE_PREFS` messages to the active tab whenever the user changes a setting.
- The content script listens for those messages and refreshes the injected stylesheet.
- A MutationObserver monitors the page container for DOM changes and reapplies styles if the Minerva SPA updates content.
- Another observer keeps the injected stylesheet last in the `<head>` to preserve styling priority.

## Permissions

- `storage`: store preferences and uploaded header images.
- `activeTab`: send updates to the active tab.
- Host permission: `*://forum.minerva.edu/*`.

## Known limitations

- Custom header uploads are stored locally, not synced across devices.
- Accent color is most reliable on the default theme.
- Large changes to Minerva's DOM may require selector updates in `content/content.js`.
- `styles/injected.css` is intentionally small because runtime CSS is generated in JavaScript.

## Maintenance notes

- Add new themes by updating `THEMES` in `content/content.js` and adding matching options in `popup/popup.html`.
- Add new header presets by extending `HEADER_IMAGES` in `content/content.js`.
- If Minerva changes its DOM structure, update the CSS selectors inside `content/content.js`.
- Preserve the `UPDATE_PREFS` message flow when extending popup state.
