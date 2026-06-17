# Minerva Forum Customizer

A minimal MV3 Chromium extension for locally customizing the appearance of `forum.minerva.edu`.

## What it does
- Overrides Minerva CSS variables for fonts, color, and spacing
- Supports body and heading font selection
- Adjusts font scale from 80% to 130%
- Includes theme presets: Default, Dark, High Contrast, Warm
- Provides a custom accent color picker
- Hides the large cityscape header image
- Offers compact sidebar mode
- Adds rounded UI mode
- Hides the Intercom chat widget
- Persists preferences with `chrome.storage.sync`

## Installation
1. Open Chrome/Chromium and go to `chrome://extensions`.
2. Enable **Developer mode** in the top-right.
3. Click **Load unpacked**.
4. Select the `minerva forum customizer` folder.
5. Ensure the extension appears as **Minerva Forum Customizer**.

## Usage
1. Go to `https://forum.minerva.edu/app` after logging in.
2. Click the extension icon in the toolbar.
3. Change settings in the popup.
4. Settings apply immediately and persist across refreshes and browser restarts.

## Verification checklist
- [ ] Extension loads in developer mode
- [ ] Settings are applied on `forum.minerva.edu`
- [ ] Navigate Home → Assignments → Past Courses and customization remains
- [ ] Popup changes update the page instantly
- [ ] Refresh the page and confirm preferences persist

## Implementation notes
- Uses **plain HTML/CSS/JavaScript** with Manifest V3
- Uses **chrome.storage.sync** for saved preferences
- Primary override mechanism is **CSS variable injection** to avoid brittle selectors
- A **MutationObserver** is used to handle Minerva's client-side routing and reapply styles on SPA navigation
- Avoids generated JSS selectors like `root-0-2-3`

## Files
- `manifest.json` — extension configuration
- `content/content.js` — page logic and CSS injection
- `styles/injected.css` — base injected stylesheet
- `popup/popup.html` — settings panel UI
- `popup/popup.js` — popup behavior and messaging
- `popup/popup.css` — popup styling
- `utils/defaults.js` — shared default preferences
- `utils/storage.js` — persistent storage helpers

## Future roadmap (not implemented yet)
- Class page customization
- Dashboard widgets
- Assignment highlighting
- Theme export/import
- Shared theme presets
