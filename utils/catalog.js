// Everything the user can pick: themes, font pairings, corner styles and header images.
// Shared by the content script, the popup and the header studio so there is one source of truth.
(function () {
  // A theme only names its four anchor colours (plus light/dark mode); the rest of
  // Forum's palette is derived from them in resolveTheme() so every theme stays consistent.
  const THEMES = {
    paper:    { name: 'Paper',    mode: 'light', page: '#ecebe8', surface: '#ffffff', text: '#26262a', accent: '#2f5fd0' },
    linen:    { name: 'Linen',    mode: 'light', page: '#efe8de', surface: '#fffcf7', text: '#3a2e24', accent: '#a0522d' },
    sand:     { name: 'Sand',     mode: 'light', page: '#efe5cf', surface: '#fffbf0', text: '#3b3220', accent: '#946800' },
    sage:     { name: 'Sage',     mode: 'light', page: '#e1eae2', surface: '#fafcf9', text: '#23362a', accent: '#3d7a55' },
    sky:      { name: 'Sky',      mode: 'light', page: '#e1e9f3', surface: '#fbfdff', text: '#1f2e40', accent: '#2f6db5' },
    lagoon:   { name: 'Lagoon',   mode: 'light', page: '#dbeeed', surface: '#fafefe', text: '#153a3b', accent: '#11807e' },
    lavender: { name: 'Lavender', mode: 'light', page: '#e8e3f3', surface: '#fcfbff', text: '#2d2442', accent: '#6b4fb8' },
    rose:     { name: 'Rose',     mode: 'light', page: '#f3e2e7', surface: '#fffafb', text: '#3e1d28', accent: '#b03a5b' },

    graphite: { name: 'Graphite', mode: 'dark', page: '#18191b', surface: '#222326', text: '#e6e6e8', accent: '#8ab4f8' },
    onyx:     { name: 'Onyx',     mode: 'dark', page: '#000000', surface: '#121212', text: '#e8e8e8', accent: '#5ac8fa' },
    midnight: { name: 'Midnight', mode: 'dark', page: '#0f1626', surface: '#18213a', text: '#e1e7f5', accent: '#7aa2ff' },
    deepSea:  { name: 'Deep Sea', mode: 'dark', page: '#0b1a1f', surface: '#11262d', text: '#d9eef2', accent: '#4fd1c5' },
    pine:     { name: 'Pine',     mode: 'dark', page: '#111a15', surface: '#19251e', text: '#dfece3', accent: '#6fcf97' },
    espresso: { name: 'Espresso', mode: 'dark', page: '#1c1512', surface: '#271d18', text: '#efe3d8', accent: '#e09f5a' },
    dusk:     { name: 'Dusk',     mode: 'dark', page: '#19152a', surface: '#231d3a', text: '#e8e2f7', accent: '#b69cff' },
    wine:     { name: 'Wine',     mode: 'dark', page: '#1d1014', surface: '#2a171d', text: '#f2e1e6', accent: '#f07a9a' }
  };

  const FONT_PAIRS = {
    default:   { name: 'Forum default', body: null, heading: null },
    clean:     { name: 'Clean',     body: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', heading: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' },
    readable:  { name: 'Readable',  body: 'Verdana, Tahoma, Geneva, sans-serif', heading: 'Georgia, "Times New Roman", serif' },
    classic:   { name: 'Classic',   body: 'Georgia, "Times New Roman", serif', heading: 'Baskerville, "Libre Baskerville", "Baskerville Old Face", Georgia, serif' },
    editorial: { name: 'Editorial', body: 'Charter, "Bitstream Charter", "Sitka Text", Cambria, Georgia, serif', heading: 'Didot, "Bodoni 72", "Bodoni MT", Georgia, serif' },
    geometric: { name: 'Geometric', body: '"Avenir Next", Avenir, "Century Gothic", "Segoe UI", sans-serif', heading: 'Futura, "Avenir Next", "Century Gothic", "Trebuchet MS", sans-serif' },
    mono:      { name: 'Typewriter', body: 'ui-monospace, Menlo, Consolas, "Liberation Mono", monospace', heading: 'ui-monospace, Menlo, Consolas, "Liberation Mono", monospace' }
  };

  // card / control radius. "square" is Forum's own look.
  const CORNERS = {
    square: { name: 'Square', card: null, control: null },
    soft:   { name: 'Soft',   card: '10px', control: '6px' },
    round:  { name: 'Round',  card: '18px', control: '10px' }
  };

  // Bundled header photos, each pre-cropped to 2400x200 (the header is a full-width,
  // 140px-tall strip). Sources are listed in images/headers/CREDITS.md.
  const HEADERS = {
    'alpine-lake': 'Alpine lake',
    'snow-peaks': 'Snow peaks',
    'misty-hills': 'Misty hills',
    'blue-ridges': 'Blue ridges',
    canopy: 'Canopy',
    autumn: 'Autumn',
    lavender: 'Lavender',
    dunes: 'Dunes',
    savanna: 'Savanna',
    'desert-road': 'Desert road',
    'deep-sea': 'Deep sea',
    'rose-horizon': 'Rose horizon',
    shoreline: 'Shoreline',
    twilight: 'Twilight',
    aurora: 'Aurora',
    'milky-way': 'Milky Way',
    'city-lights': 'City lights',
    'old-town': 'Old town',
    'machu-picchu': 'Machu Picchu',
    temple: 'Temple'
  };

  const TEXT_SIZE = { min: 90, max: 125, step: 5, default: 100 };

  function parseHex(hex) {
    const match = /^#?([0-9a-f]{6})$/i.exec(String(hex || '').trim());
    if (!match) return null;
    const n = parseInt(match[1], 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  // Blend `hex` toward `target` by `amount` (0 = hex, 1 = target).
  function mix(hex, target, amount) {
    const a = parseHex(hex);
    const b = parseHex(target);
    if (!a || !b) return hex;
    return '#' + a.map((c, i) => Math.round(c + (b[i] - c) * amount).toString(16).padStart(2, '0')).join('');
  }

  // Forum's accent ramp. In dark mode "shades" (used for links and hover) get lighter, not darker.
  function accentVars(accent, surface, mode) {
    const shade = mode === 'dark' ? '#ffffff' : '#000000';
    return {
      '--mfc-accent': accent,
      '--mfc-accent-shade-20': mix(accent, shade, 0.2),
      '--mfc-accent-shade-40': mix(accent, shade, 0.4),
      '--mfc-accent-tint-20': mix(accent, surface, 0.2),
      '--mfc-accent-tint-90': mix(accent, surface, 0.86)
    };
  }

  // Full set of --mfc-* variables for a theme (null for Forum's default look).
  function resolveTheme(key, accentOverride) {
    const t = THEMES[key];
    if (!t) return null;
    const dark = t.mode === 'dark';
    const sidebar = dark ? mix(t.page, '#000000', 0.35) : t.text;
    return Object.assign({
      '--mfc-page': t.page,
      '--mfc-surface': t.surface,
      '--mfc-surface-alt': dark ? mix(t.surface, '#ffffff', 0.035) : mix(t.surface, t.page, 0.55),
      '--mfc-line': mix(t.surface, t.text, dark ? 0.14 : 0.13),
      '--mfc-subtle': mix(t.surface, t.text, 0.42),
      '--mfc-muted': mix(t.surface, t.text, dark ? 0.68 : 0.62),
      '--mfc-text': t.text,
      '--mfc-strong': dark ? mix(t.text, '#ffffff', 0.4) : mix(t.text, '#000000', 0.25),
      '--mfc-ink': dark ? '#ffffff' : mix(t.text, '#000000', 0.5),
      '--mfc-sidebar': sidebar,
      '--mfc-sidebar-hover': mix(sidebar, '#ffffff', 0.07),
      '--mfc-sidebar-active': dark ? mix(sidebar, '#ffffff', 0.13) : mix(sidebar, '#000000', 0.35),
      '--mfc-sidebar-text': mix(sidebar, '#ffffff', 0.66)
    }, accentVars(parseHex(accentOverride) ? accentOverride : t.accent, t.surface, t.mode));
  }

  window.MFC = { THEMES, FONT_PAIRS, CORNERS, HEADERS, TEXT_SIZE, parseHex, mix, accentVars, resolveTheme };
})();
