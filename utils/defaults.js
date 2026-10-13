// Default preferences, plus migration of settings saved by v1.0.x.
// Exposed globally so content scripts and the popup can share them. Requires utils/catalog.js.
(function () {
  const { THEMES, FONT_PAIRS, CORNERS, HEADERS, TEXT_SIZE, parseHex } = window.MFC;

  const DEFAULTS = {
    theme: 'default',
    accent: null,
    fonts: 'default',
    textSize: TEXT_SIZE.default,
    corners: 'square',
    header: 'default'
  };

  const LEGACY_THEMES = {
    charcoal: 'sky',
    'high-contrast': 'paper',
    highContrast: 'paper',
    forest: 'sage',
    burgundy: 'rose',
    ultraviolet: 'lavender',
    ocean: 'lagoon',
    ember: 'linen',
    warm: 'linen',
    'warm-copper': 'linen',
    'warm-sand': 'sand'
  };
  const LEGACY_FONTS = {
    readable: ['verdana', 'trebuchet', 'Inter', 'system-ui', 'Arial'],
    classic: ['georgia', 'palatino', 'garamond', 'baskerville', 'Georgia', 'Chronicle Deck A', 'Roboto Slab', 'Times New Roman'],
    editorial: ['didot'],
    geometric: ['futura', 'optima', 'Roboto', 'Fira Sans'],
    mono: ['mono', 'courier', 'menlo', 'lucida', 'Courier New']
  };
  const LEGACY_HEADERS = {
    africa: 'savanna',
    americas: 'desert-road',
    asia: 'temple',
    europe: 'old-town',
    'latin-america': 'machu-picchu',
    minerva: 'savanna'
  };
  const OLD_DEFAULT_ACCENT = '#0a78bf';

  function legacyFont(value) {
    return Object.keys(LEGACY_FONTS).find((pair) => LEGACY_FONTS[pair].includes(value)) || 'default';
  }

  function pick(value, allowed, fallback) {
    return Object.prototype.hasOwnProperty.call(allowed, value) ? value : fallback;
  }

  // Turns whatever is in storage (v1 or v2 shape) into a valid v2 prefs object.
  function normalizePrefs(raw) {
    const p = raw || {};
    const theme = pick(LEGACY_THEMES[p.theme] || p.theme, THEMES, 'default');

    let accent = p.accent !== undefined ? p.accent : null;
    // v1 always saved the colour picker's value, so only keep it if it was actually changed.
    if (p.accent === undefined && p.accentColor && theme === 'default' && p.accentColor.toLowerCase() !== OLD_DEFAULT_ACCENT) {
      accent = p.accentColor;
    }

    const textSize = Number(p.textSize) || (Number(p.fontSize) ? Math.round(Number(p.fontSize) * 100) : TEXT_SIZE.default);
    const header = p.header !== undefined ? p.header : (LEGACY_HEADERS[p.headerPreset] || p.headerPreset);

    return {
      theme,
      accent: parseHex(accent) ? accent : null,
      fonts: p.fonts !== undefined ? pick(p.fonts, FONT_PAIRS, 'default') : legacyFont(p.headingFont !== 'default' && p.headingFont ? p.headingFont : p.fontFamily),
      textSize: Math.min(TEXT_SIZE.max, Math.max(TEXT_SIZE.min, textSize)),
      corners: p.corners !== undefined ? pick(p.corners, CORNERS, 'square') : (p.roundedCards ? 'round' : 'square'),
      header: header === 'custom' || header === 'default' || HEADERS[header] ? header : 'default'
    };
  }

  window.MINERVA_DEFAULT_PREFS = DEFAULTS;
  window.MinervaPrefs = { normalizePrefs };
})();
