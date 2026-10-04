(function () {
  const STYLE_ID = 'minerva-forum-customizer-styles';
  const STYLE_SOURCE = 'minerva-forum-customizer';
  const FONT_STACKS = {
    default: null,
    verdana: 'Verdana, Geneva, sans-serif',
    georgia: 'Georgia, "Times New Roman", serif',
    mono: '"Courier New", Courier, monospace',
    trebuchet: '"Trebuchet MS", "Lucida Grande", sans-serif',
    palatino: 'Palatino, "Palatino Linotype", "Book Antiqua", serif',
    impact: 'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif',
    comic: '"Comic Sans MS", "Comic Sans", cursive',
    optima: 'Optima, Candara, "Noto Sans", sans-serif',
    lucida: '"Lucida Console", Monaco, monospace',
    copperplate: 'Copperplate, "Copperplate Gothic Light", fantasy',
    baskerville: 'Baskerville, "Libre Baskerville", Georgia, serif',
    didot: 'Didot, "Bodoni 72", "Bodoni MT", serif',
    garamond: 'Garamond, "Hoefler Text", "Times New Roman", serif',
    futura: 'Futura, "Avenir Next", Avenir, sans-serif',
    marker: '"Marker Felt", "Comic Sans MS", fantasy',
    papyrus: 'Papyrus, Herculanum, fantasy',
    chalkboard: '"Chalkboard SE", "Comic Sans MS", cursive',
    menlo: 'Menlo, Consolas, "Liberation Mono", monospace',
    courier: '"Courier New", Courier, monospace'
  };
  const LEGACY_FONT_KEYS = {
    Inter: 'verdana',
    'system-ui': 'verdana',
    Roboto: 'optima',
    Arial: 'trebuchet',
    'Fira Sans': 'optima',
    Georgia: 'georgia',
    'Courier New': 'mono',
    'Chronicle Deck A': 'baskerville',
    'Roboto Slab': 'palatino',
    'Times New Roman': 'garamond'
  };
  // Each theme maps onto Forum's own design tokens (--white, --black-tint-*, --blue*),
  // so every surface the app draws with those tokens picks up the palette, including
  // components this extension has never seen. Forum layers them as:
  //   page (--black-tint-95) < cards (--white) with zebra rows (--black-tint-97),
  //   dividers (--black-tint-90), text ramp (--black-tint-70 → --black),
  //   and a dark sidebar painted with --black-tint-20 / -10 / --black.
  const THEMES = {
    charcoal: {
      page: '#e1e8f0',
      surface: '#fbfcfe',
      surfaceAlt: '#f1f5f9',
      line: '#d0dbe7',
      subtle: '#9fb1c4',
      muted: '#56687c',
      text: '#243244',
      strong: '#1a2634',
      ink: '#0f1823',
      accent: '#2d6da3'
    },
    highContrast: {
      page: '#e8e5db',
      surface: '#ffffff',
      surfaceAlt: '#f6f4ed',
      line: '#d3cdbb',
      subtle: '#b3ac94',
      muted: '#4b4b43',
      text: '#171717',
      strong: '#0d0d0d',
      ink: '#000000',
      accent: '#8a6500'
    },
    forest: {
      page: '#dfece3',
      surface: '#fbfdfb',
      surfaceAlt: '#eff6f1',
      line: '#c6dbcc',
      subtle: '#93b39c',
      muted: '#4c6d58',
      text: '#1d3a27',
      strong: '#152f1e',
      ink: '#0c2014',
      accent: '#2b7743'
    },
    burgundy: {
      page: '#f0e0e6',
      surface: '#fffbfc',
      surfaceAlt: '#faeff3',
      line: '#e5c9d3',
      subtle: '#c095a5',
      muted: '#7a4f5f',
      text: '#3d1726',
      strong: '#2f101c',
      ink: '#1f0911',
      accent: '#a1325a'
    },
    ultraviolet: {
      page: '#e7e0f2',
      surface: '#fcfbff',
      surfaceAlt: '#f4f0fb',
      line: '#d8cdeb',
      subtle: '#a998c9',
      muted: '#64517d',
      text: '#2b1e44',
      strong: '#211636',
      ink: '#150d25',
      accent: '#6a49ae'
    },
    ocean: {
      page: '#daecef',
      surface: '#fbfefe',
      surfaceAlt: '#edf6f7',
      line: '#c1dde2',
      subtle: '#88b4bc',
      muted: '#4a6e76',
      text: '#133a42',
      strong: '#0d2d34',
      ink: '#071f24',
      accent: '#14798b'
    },
    ember: {
      page: '#f2e3d6',
      surface: '#fffbf7',
      surfaceAlt: '#fbf1e9',
      line: '#e8d0be',
      subtle: '#c99f86',
      muted: '#7a5846',
      text: '#3b2116',
      strong: '#2d180f',
      ink: '#1f0f08',
      accent: '#a5521f'
    }
  };
  const HEADER_IMAGES = {
    africa: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1600&h=500&q=80',
    americas: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&h=500&q=80',
    asia: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&h=500&q=80',
    europe: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1600&h=500&q=80',
    'latin-america': 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1600&h=500&q=80'
  };
  const minervaHeaderImage = Object.values(HEADER_IMAGES)[Math.floor(Math.random() * Object.values(HEADER_IMAGES).length)];
  const DEFAULT_ACCENT = '#0a78bf';
  const CARD_ATTR = 'data-mfc-card';
  // Forum's React components are generic <Box> elements with generated JSS class names
  // (e.g. root-d7-0-2-20) that change between builds and pages, so cards are found by
  // their stable data-testid plus whether they actually paint a surface.
  const BOX_SELECTOR = '[data-testid="Box"]';
  const CARD_SELECTORS = [
    `[${CARD_ATTR}="1"]`,
    '.dashboard-module',
    '.breadcrumbs',
    '.outcome-index-view .all-outcomes-view',
    '.fds-card',
    '.office-hours-region .card',
    '.announcement-region .card',
    '.menu-view .menu-items',
    '[class*="shadow-level-"]'
  ];
  // Older (non-React) Forum views hardcode #fff instead of using --white.
  const LEGACY_WHITE_SURFACES = [
    '.bg-white',
    '.text-input',
    '.textarea',
    '.one-line-input-view',
    '.RichEditor-root',
    '.menu-view .menu-items',
    '.menu-view .menu-items li.menu-item-view .row',
    '.outcome-assessment-editor-view',
    '.outcome-index-view .all-outcomes-view',
    '.bug-report-form-v2'
  ];
  let currentPrefs = null;

  function cssUrl(value) {
    return String(value || '').replace(/["\\\n\r]/g, '');
  }

  function fontStack(value) {
    const key = LEGACY_FONT_KEYS[value] || value;
    return FONT_STACKS[key] || null;
  }

  function themeFor(value) {
    if (value === 'warm' || value === 'warm-copper') return THEMES.ember;
    if (value === 'warm-sand') return THEMES.forest;
    if (value === 'high-contrast') return THEMES.highContrast;
    if (value === 'midnight') return THEMES.charcoal;
    return THEMES[value] || null;
  }

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

  function rgba(hex, alpha) {
    const c = parseHex(hex);
    return c ? `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${alpha})` : hex;
  }

  // Forum's accent ramp: base, two darker shades, a lighter tint, and a pale wash.
  function accentTokens(accent, paper, ink) {
    return {
      '--blue': accent,
      '--blue-shade-20': mix(accent, ink, 0.2),
      '--blue-shade-40': mix(accent, ink, 0.4),
      '--blue-tint-20': mix(accent, paper, 0.2),
      '--blue-tint-90': mix(accent, paper, 0.88)
    };
  }

  function themeTokens(theme) {
    return Object.assign({
      '--white': theme.surface,
      '--black-tint-97': theme.surfaceAlt,
      '--black-tint-95': theme.page,
      '--black-tint-90': theme.line,
      '--black-tint-70': theme.subtle,
      '--black-tint-40': theme.muted,
      '--black-tint-20': theme.text,
      '--black-tint-10': theme.strong,
      '--black': theme.ink
    }, accentTokens(theme.accent, theme.surface, theme.ink));
  }

  function buildCSS(prefs, headerImage) {
    const scale = Number(prefs.fontSize) || 1.0;
    const typeScale = {
      h1: '2rem',
      h2: '1.5rem',
      h3: '1.25rem',
      h4: '1rem',
      h5: '.875rem',
      h6: '.75rem'
    };

    const bodyFont = fontStack(prefs.fontFamily);
    const headingFont = fontStack(prefs.headingFont);
    const theme = themeFor(prefs.theme);
    const tokens = {};

    Object.entries(typeScale).forEach(([key, value]) => {
      tokens[`--${key}`] = `calc(${value} * ${scale})`;
    });

    if (theme) {
      Object.assign(tokens, themeTokens(theme));
    } else if (parseHex(prefs.accentColor) && prefs.accentColor.toLowerCase() !== DEFAULT_ACCENT) {
      Object.assign(tokens, accentTokens(prefs.accentColor, '#ffffff', '#010101'));
    }

    if (prefs.roundedCards) {
      tokens['--border-radius'] = '8px';
    }

    let css = ':root, html#minerva-dashboard, body#minerva-dashboard {\n';
    Object.entries(tokens).forEach(([key, value]) => {
      css += `  ${key}: ${value} !important;\n`;
    });
    css += '}\n\n';

    const appSelector = ':is(html#minerva-dashboard body, body#minerva-dashboard)';
    const cardSelector = CARD_SELECTORS.map((selector) => `${appSelector} ${selector}`).join(', ');
    const headerSelector = 'header#header, .subheader';
    const imagerySelector = '.header-content .imagery, div.imagery';
    if (bodyFont) {
      css += `${appSelector} .body:not(header#header *), ${appSelector} .body-s:not(header#header *), ${appSelector} button:not(header#header *), ${appSelector} input:not(header#header *), ${appSelector} select:not(header#header *), ${appSelector} textarea:not(header#header *), ${appSelector} table:not(header#header *), ${appSelector} .recently-graded-body, ${appSelector} .recently-graded-body *, ${appSelector} aside.sidebar, ${appSelector} article#main-semantic-content { font-family: ${bodyFont} !important; }\n`;
    }
    if (headingFont) {
      css += `${appSelector} h1:not(header#header *), ${appSelector} h2:not(header#header *), ${appSelector} h3:not(header#header *), ${appSelector} h4:not(header#header *), ${appSelector} h5:not(header#header *), ${appSelector} h6:not(header#header *), ${appSelector} .h1:not(header#header *), ${appSelector} .h2:not(header#header *), ${appSelector} .h3:not(header#header *), ${appSelector} .h4:not(header#header *), ${appSelector} .h5:not(header#header *), ${appSelector} .h6:not(header#header *) { font-family: ${headingFont} !important; }\n`;
    }
    if (prefs.headerPreset === 'custom' && headerImage) {
      css += `${imagerySelector} { display: block !important; background-image: linear-gradient(rgba(0,0,0,0.28), rgba(0,0,0,0.2)), url("${cssUrl(headerImage)}") !important; background-size: 100% auto !important; background-repeat: no-repeat !important; background-position: center bottom !important; }\n`;
    } else if (prefs.headerPreset === 'minerva') {
      css += `${imagerySelector} { display: block !important; background-image: linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.22)), url("${minervaHeaderImage}") !important; background-size: 100% auto !important; background-repeat: no-repeat !important; background-position: center bottom !important; }\n`;
    } else if (HEADER_IMAGES[prefs.headerPreset]) {
      css += `${imagerySelector} { display: block !important; background-image: linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.22)), url("${HEADER_IMAGES[prefs.headerPreset]}") !important; background-size: 100% auto !important; background-repeat: no-repeat !important; background-position: center bottom !important; }\n`;
    } else if (theme) {
      // Without a backdrop image Forum shows a flat grey band; tint it to match the theme.
      css += `${imagerySelector} { background-color: ${theme.strong} !important; background-image: linear-gradient(115deg, ${theme.ink} 0%, ${theme.strong} 35%, ${mix(theme.accent, theme.ink, 0.25)} 100%) !important; }\n`;
    }

    if (prefs.headerPreset && prefs.headerPreset !== 'default') {
      css += `${headerSelector} { position: relative !important; overflow: hidden !important; }\n`;
    }

    if (theme) {
      css += `${LEGACY_WHITE_SURFACES.map((selector) => `${appSelector} ${selector}`).join(', ')} { background-color: var(--white) !important; }\n`;
      // Cards get a hairline in the theme's line colour plus a tinted shadow, so they read
      // as distinct layers on the tinted page instead of blending into it.
      css += `${cardSelector} { box-shadow: 0 0 0 1px ${theme.line}, 0 1px 3px ${rgba(theme.ink, 0.08)}, 0 4px 14px ${rgba(theme.ink, 0.05)} !important; }\n`;
      css += `${appSelector} table.fds-table thead th, ${appSelector} table.fds-table thead .th { background-color: ${theme.surfaceAlt} !important; }\n`;
      css += `${appSelector} .sidebar-list-view { box-shadow: inset -1px 0 0 ${rgba(theme.ink, 0.35)} !important; }\n`;
      css += `${appSelector} ::selection { background-color: ${mix(theme.accent, theme.surface, 0.7)} !important; }\n`;
    }

    if (prefs.roundedCards) {
      css += `${cardSelector} { border-radius: 14px !important; }\n`;
      css += `${appSelector} table.fds-table thead tr > :first-child { border-top-left-radius: 8px !important; border-bottom-left-radius: 8px !important; }\n`;
      css += `${appSelector} table.fds-table thead tr > :last-child { border-top-right-radius: 8px !important; border-bottom-right-radius: 8px !important; }\n`;
      css += `${appSelector} .outcome:first-child { border-top-left-radius: 8px !important; border-top-right-radius: 8px !important; }\n`;
      css += `${appSelector} .outcome:last-child { border-bottom-left-radius: 8px !important; border-bottom-right-radius: 8px !important; }\n`;
      // Sidebar: inset pill-shaped links. Highlight moves from the full-width <li> to the link.
      css += `${appSelector} .sidebar-list-view .sidebar-items-list { padding-top: 6px !important; }\n`;
      css += `${appSelector} .sidebar-list-view .sidebar-items-list .sidebar-item-view.active { background-color: transparent !important; }\n`;
      css += `${appSelector} .sidebar-list-view .sidebar-items-list .sidebar-item-view > a { margin: 2px 8px !important; padding-left: 12px !important; padding-right: 12px !important; border-radius: 10px !important; }\n`;
      css += `${appSelector} .sidebar-list-view .sidebar-items-list .sidebar-item-view.active > a { background-color: var(--black) !important; }\n`;
      css += `${appSelector} .sidebar-sub-list-view .sidebar-sub-items-list .sidebar-sub-item-view.active { background-color: transparent !important; }\n`;
      css += `${appSelector} .sidebar-sub-list-view .sidebar-sub-items-list .sidebar-sub-item-view > a { margin: 1px 8px !important; padding-left: 47px !important; border-radius: 8px !important; }\n`;
      css += `${appSelector} .sidebar-sub-list-view .sidebar-sub-items-list .sidebar-sub-item-view.active > a { background-color: var(--black) !important; }\n`;
      css += `${appSelector} [data-testid="Button"] { border-radius: var(--border-radius) !important; }\n`;
      css += `${appSelector} .profile-photo-medium, ${appSelector} .circle-button--transparent { border-radius: 999px !important; }\n`;
    }

    return css;
  }

  function applyStyle(prefs, headerImage) {
    let style = document.getElementById(STYLE_ID);
    if (!style) {
      style = document.createElement('style');
      style.id = STYLE_ID;
      style.dataset.source = STYLE_SOURCE;
      document.head.appendChild(style);
    }
    style.textContent = buildCSS(prefs, headerImage);
  }

  function keepStyleLast() {
    const style = document.getElementById(STYLE_ID);
    if (style && style.parentElement && style.parentElement.lastElementChild !== style) {
      style.parentElement.appendChild(style);
    }
  }

  // Mark top-level Boxes that paint a surface (background or shadow) as cards. Uses an
  // attribute rather than a class because React rewrites className on re-render.
  function tagCards() {
    document.querySelectorAll(`${BOX_SELECTOR}:not([${CARD_ATTR}])`).forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (!rect.width || !rect.height) return; // not laid out yet; check again later
      const cs = getComputedStyle(el);
      const paints = cs.backgroundColor !== 'rgba(0, 0, 0, 0)' || cs.boxShadow !== 'none';
      const isCard = paints &&
        rect.width >= 160 && rect.height >= 40 &&
        !el.parentElement.closest(`[${CARD_ATTR}="1"]`);
      el.setAttribute(CARD_ATTR, isCard ? '1' : '0');
    });
  }

  async function refresh(prefs) {
    const headerImage = prefs.headerPreset === 'custom' ? await window.MinervaStorage.loadHeaderImage() : null;
    applyStyle(prefs, headerImage);
    keepStyleLast();
    tagCards();
  }

  function watchDom() {
    let pending = false;
    const observer = new MutationObserver(() => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => {
        pending = false;
        keepStyleLast();
        tagCards();
      });
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });
  }

  async function init() {
    currentPrefs = await window.MinervaStorage.loadPrefs();
    await refresh(currentPrefs);
    watchDom();

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message && message.type === 'UPDATE_PREFS' && message.prefs) {
        currentPrefs = message.prefs;
        refresh(currentPrefs).then(() => {
          sendResponse({ ok: true });
        });
        return true;
      }
      return false;
    });

    chrome.storage.onChanged.addListener(async (changes, area) => {
      if (area === 'sync' && changes.minervaPrefs) {
        currentPrefs = Object.assign({}, window.MINERVA_DEFAULT_PREFS, changes.minervaPrefs.newValue || {});
        await refresh(currentPrefs);
      } else if (area === 'local' && changes.minervaHeaderImage) {
        currentPrefs = await window.MinervaStorage.loadPrefs();
        await refresh(currentPrefs);
      }
    });
  }

  init();
})();
