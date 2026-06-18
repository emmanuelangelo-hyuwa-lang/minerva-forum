(function () {
  const STYLE_ID = 'minerva-forum-customizer-styles';
  const BANNER_ID = 'minerva-customizer-banner-text';
  const CALENDAR_FEED_SELECTOR = '.body-s.input-0-2-74.input-d0-0-2-76';
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
  const THEMES = {
    charcoal: {
      bg: '#07090d',
      panel: '#121821',
      panelAlt: '#1f2937',
      text: '#f5f7fb',
      muted: '#9aa4b2',
      line: '#344052',
      accent: '#00c2ff',
      accentSoft: '#063242',
      hover: '#263449'
    },
    highContrast: {
      bg: '#000000',
      panel: '#080808',
      panelAlt: '#171717',
      text: '#ffffff',
      muted: '#e5e5e5',
      line: '#ffffff',
      accent: '#ffd500',
      accentSoft: '#3a3100',
      hover: '#242424'
    },
    forest: {
      bg: '#06130d',
      panel: '#0d2418',
      panelAlt: '#163824',
      text: '#f1fff6',
      muted: '#a9c7b4',
      line: '#2f6b47',
      accent: '#2ee66b',
      accentSoft: '#123d22',
      hover: '#1e4d31'
    },
    burgundy: {
      bg: '#18040b',
      panel: '#2b0714',
      panelAlt: '#461024',
      text: '#fff4f7',
      muted: '#e3a8ba',
      line: '#74314b',
      accent: '#ff3d7f',
      accentSoft: '#4d1028',
      hover: '#5a1730'
    },
    ultraviolet: {
      bg: '#11051d',
      panel: '#25113a',
      panelAlt: '#3d1f5f',
      text: '#fbf6ff',
      muted: '#c9aee5',
      line: '#69429a',
      accent: '#b56cff',
      accentSoft: '#351a56',
      hover: '#4f2a78'
    },
    ocean: {
      bg: '#03151d',
      panel: '#082a38',
      panelAlt: '#0d4557',
      text: '#f0fbff',
      muted: '#99c9d8',
      line: '#217086',
      accent: '#00d7d7',
      accentSoft: '#073f48',
      hover: '#105668'
    },
    ember: {
      bg: '#1b0902',
      panel: '#351307',
      panelAlt: '#57200d',
      text: '#fff7f2',
      muted: '#e6ad8f',
      line: '#89401c',
      accent: '#ff6a1a',
      accentSoft: '#55220c',
      hover: '#682a10'
    }
  };
  const HEADER_IMAGES = {
    africa: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1800&q=80',
    americas: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=80',
    asia: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1800&q=80',
    europe: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1800&q=80',
    'latin-america': 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1800&q=80'
  };
  const minervaHeaderImage = Object.values(HEADER_IMAGES)[Math.floor(Math.random() * Object.values(HEADER_IMAGES).length)];
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

    let css = ':root, html#minerva-dashboard, body#minerva-dashboard {\n';

    const bodyFont = fontStack(prefs.fontFamily);
    const headingFont = fontStack(prefs.headingFont);
    const theme = themeFor(prefs.theme);

    if (bodyFont) {
      css += `  --sans-font-family: ${bodyFont} !important;\n`;
    }

    if (headingFont) {
      css += `  --serif-font-family: ${headingFont} !important;\n`;
    }

    Object.entries(typeScale).forEach(([key, value]) => {
      css += `  --${key}: calc(${value} * ${scale}) !important;\n`;
    });

    if (prefs.accentColor) {
      css += `  --blue: ${prefs.accentColor} !important;\n`;
      css += `  --blue-shade-20: ${prefs.accentColor} !important;\n`;
      css += `  --blue-tint-20: ${prefs.accentColor} !important;\n`;
      css += `  --blue-tint-90: ${prefs.accentColor}20 !important;\n`;
    }

    if (prefs.roundedCards) {
      css += '  --border-radius: 12px !important;\n';
    }

    if (theme) {
      css += `  --black: ${theme.bg} !important;\n`;
      css += `  --white: ${theme.text} !important;\n`;
      css += `  --black-tint-10: ${theme.bg} !important;\n`;
      css += `  --black-tint-20: ${theme.panel} !important;\n`;
      css += `  --black-tint-40: ${theme.line} !important;\n`;
      css += `  --black-tint-70: ${theme.muted} !important;\n`;
      css += `  --black-tint-90: ${theme.panelAlt} !important;\n`;
      css += `  --black-tint-95: ${theme.panel} !important;\n`;
      css += `  --black-tint-97: ${theme.bg} !important;\n`;
      css += `  --blue: ${theme.accent} !important;\n`;
      css += `  --blue-shade-20: ${theme.accent} !important;\n`;
      css += `  --blue-tint-20: ${theme.accent} !important;\n`;
      css += `  --blue-tint-90: ${theme.accentSoft} !important;\n`;
    }

    css += '}\n\n';

    const appRootSelector = ':is(html#minerva-dashboard, body#minerva-dashboard)';
    const appSelector = ':is(html#minerva-dashboard body, body#minerva-dashboard)';
    const headerSelector = 'header#header, .subheader';
    const scopedHeaderSelector = `${appSelector} header#header, ${appSelector} .subheader`;
    const imagerySelector = '.header-content .imagery, div.imagery';
    if (bodyFont) {
      css += `${appSelector}, ${appSelector} .body, ${appSelector} .body-s, ${appSelector} button, ${appSelector} input, ${appSelector} select, ${appSelector} textarea, ${appSelector} table { font-family: ${bodyFont} !important; }\n`;
    }
    if (headingFont) {
      css += `${appSelector} h1, ${appSelector} h2, ${appSelector} h3, ${appSelector} h4, ${appSelector} h5, ${appSelector} h6, ${appSelector} .h1, ${appSelector} .h2, ${appSelector} .h3, ${appSelector} .h4, ${appSelector} .h5, ${appSelector} .h6 { font-family: ${headingFont} !important; }\n`;
    }
    if (prefs.headerPreset === 'custom' && headerImage) {
      css += `${imagerySelector} { display: block !important; background-image: linear-gradient(rgba(0,0,0,0.28), rgba(0,0,0,0.2)), url("${cssUrl(headerImage)}") !important; background-size: cover !important; background-position: center center !important; }\n`;
    } else if (prefs.headerPreset === 'minerva') {
      css += `${imagerySelector} { display: block !important; background-image: linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.22)), url("${minervaHeaderImage}") !important; background-size: cover !important; background-position: center center !important; }\n`;
    } else if (HEADER_IMAGES[prefs.headerPreset]) {
      css += `${imagerySelector} { display: block !important; background-image: linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.22)), url("${HEADER_IMAGES[prefs.headerPreset]}") !important; background-size: cover !important; background-position: center center !important; }\n`;
    }

    if ((prefs.headerPreset && prefs.headerPreset !== 'default') || prefs.headerText) {
      css += `${headerSelector} { position: relative !important; overflow: hidden !important; }\n`;
    }
    css += `section.message-region { display: block !important; min-height: 0 !important; }\n`;
    css += `.${BANNER_ID} { display: block !important; margin: 8px 24px 0 !important; padding: 10px 14px !important; border-radius: 12px !important; position: relative !important; z-index: 40 !important; font-size: 0.95rem !important; line-height: 1.35 !important; font-weight: 700 !important; color: #ffffff !important; background: rgba(0,0,0,0.46) !important; text-shadow: 0 1px 8px rgba(0,0,0,0.55) !important; backdrop-filter: blur(4px) !important; }\n`;
    css += `.${BANNER_ID}.hidden { display: none !important; }\n`;

    if (prefs.roundedCards) {
      css += `${appRootSelector} { --border-radius: 16px !important; }\n`;
      css += `${appSelector} table.fds-table, ${appSelector} .fds-card, ${appSelector} .office-hours-region .card, ${appSelector} .announcement-region .card, ${appSelector} .announcements-region, ${appSelector} .office-hours-region, ${appSelector} .home-view-right-column > div, ${appSelector} .root-0-2-3, ${appSelector} .student-assignments-list-view, ${appSelector} .assignments-list-view, ${appSelector} .all-outcomes-view, ${appSelector} .past-sections-view, ${appSelector} .visiting-sections-view, ${appSelector} .all-events-view, ${appSelector} .h2.mb5, ${appSelector} aside.sidebar, ${appSelector} .dashboard-control-center-view, ${appSelector} .menu-view .menu-items, ${appSelector} .profile-photo-medium, ${appSelector} .circle-button--transparent { border-radius: 16px !important; overflow: hidden !important; }\n`;
      css += `${appSelector} input:not([type="checkbox"]):not([type="radio"]), ${appSelector} textarea, ${appSelector} select, ${appSelector} [contenteditable="true"], ${appSelector} .title-search, ${appSelector} [class*="title-search"], ${appSelector} [class*="react-select__control"], ${appSelector} .react-select__control, ${appSelector} [class*="-control"], ${appSelector} [class*="value-container"], ${appSelector} [id$="-select"] > div, ${appSelector} [id$="-select"] [class*="container"], ${appSelector} [data-testid="Box"] > input + div, ${appSelector} .show-submitted-checkbox label > div:first-of-type { border-radius: 16px !important; overflow: hidden !important; }\n`;
      css += `${appSelector} [class*="react-select__control"], ${appSelector} .react-select__control, ${appSelector} .title-search, ${appSelector} [class*="title-search"] { min-height: 38px !important; }\n`;
      css += '.profile-photo-medium, .circle-button--transparent { border-radius: 999px !important; }\n';
    }

    if (theme) {
      css += `${appSelector}, ${appSelector} > .main-region, ${appSelector} section.main-region, ${appSelector} .dashboard-layout, ${appSelector} .main-wrapper, ${appSelector} .content-wrapper, ${appSelector} .stage-wrapper, ${appSelector} article#main-semantic-content, ${appSelector} article#main-semantic-content .content, ${appSelector} .react-router-content { background-color: var(--black-tint-10) !important; color: var(--white) !important; }\n`;
      css += `${scopedHeaderSelector}, ${appSelector} aside.sidebar, ${appSelector} .announcement-region, ${appSelector} .announcements-region, ${appSelector} .office-hours-region, ${appSelector} table.fds-table, ${appSelector} .fds-card, ${appSelector} .home-view-right-column > div, ${appSelector} .assignments-list-view, ${appSelector} .student-assignments-list-view, ${appSelector} .all-outcomes-view, ${appSelector} .past-sections-view, ${appSelector} .visiting-sections-view, ${appSelector} .all-events-view, ${appSelector} .root-0-2-3 { background-color: var(--black-tint-20) !important; color: var(--white) !important; border-color: var(--black-tint-40) !important; }\n`;
      css += `${appSelector} .text-black-tint-20, ${appSelector} .text-black-tint-40, ${appSelector} .text-black-tint-70, ${appSelector} .text-black-tint-90, ${appSelector} .body, ${appSelector} .body-s, ${appSelector} .body-xs, ${appSelector} .h1, ${appSelector} .h2, ${appSelector} .h3, ${appSelector} .h4, ${appSelector} .h5, ${appSelector} .h6, ${appSelector} header#header a, ${appSelector} .navigation-link, ${appSelector} .link-text, ${appSelector} .subheader, ${appSelector} .subheader *, ${appSelector} article#main-semantic-content a, ${appSelector} table.fds-table th, ${appSelector} table.fds-table td, ${appSelector} .root-0-2-3 * { color: var(--white) !important; }\n`;
      css += `${appSelector} button, ${appSelector} select, ${appSelector} input, ${appSelector} textarea, ${appSelector} [contenteditable="true"], ${appSelector} .react-select__control, ${appSelector} [class*="react-select__control"], ${appSelector} .react-select__menu, ${appSelector} [class*="-menu"], ${appSelector} .title-search { background-color: var(--black-tint-20) !important; color: var(--white) !important; border-color: var(--black-tint-40) !important; }\n`;
      css += `${appSelector} .react-select__single-value, ${appSelector} .react-select__placeholder, ${appSelector} [class*="singleValue"], ${appSelector} [class*="placeholder"] { color: var(--white) !important; }\n`;
      css += `${appSelector} tr.assignment-item-view:hover, ${appSelector} tr.recently-graded-item-view:hover, ${appSelector} li.sidebar-item-view.active a.navigation-link, ${appSelector} .navigation-link:hover { background-color: ${theme.hover} !important; }\n`;
      css += `${appSelector} .status-wrapper.status-red { background-color: #7f1d1d !important; color: #fff7ed !important; border-color: #ef4444 !important; }\n`;
    }

    return css;
  }

  function applyStyle(prefs, headerImage) {
    const existing = document.getElementById(STYLE_ID);
    if (existing) existing.remove();
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.dataset.source = STYLE_SOURCE;
    style.textContent = buildCSS(prefs, headerImage);
    document.head.appendChild(style);
  }

  function keepStyleLast() {
    const style = document.getElementById(STYLE_ID);
    if (style && style.parentElement && style.parentElement.lastElementChild !== style) {
      style.parentElement.appendChild(style);
    }
  }

  function ensureBanner(prefs) {
    const container = document.querySelector('section.message-region') || document.querySelector('.header-content .main-region') || document.querySelector('.subheader') || document.querySelector('header#header');
    if (!container) return;

    let banner = document.getElementById(BANNER_ID);
    if (!banner) {
      banner = document.createElement('div');
      banner.id = BANNER_ID;
      banner.className = BANNER_ID;
    }

    if (banner.parentElement !== container) {
      container.appendChild(banner);
    }

    banner.textContent = prefs.headerText || '';
    banner.classList.toggle('hidden', !prefs.headerText);
  }

  async function refresh(prefs) {
    const headerImage = prefs.headerPreset === 'custom' ? await window.MinervaStorage.loadHeaderImage() : null;
    applyStyle(prefs, headerImage);
    ensureBanner(prefs);
    keepStyleLast();
  }

  function findCalendarFeedLink() {
    const exactInput = document.querySelector(CALENDAR_FEED_SELECTOR);
    const candidates = [
      exactInput,
      ...document.querySelectorAll('input[readonly], input[type="text"], input.body-s, textarea, code')
    ].filter(Boolean);

    for (const node of candidates) {
      const value = node.value || node.getAttribute('value') || node.textContent || node.innerHTML || '';
      const trimmed = value.trim();
      if (/^https?:\/\//i.test(trimmed) || /^webcal:\/\//i.test(trimmed)) {
        return trimmed;
      }
    }

    return null;
  }

  function watchNavigation() {
    const target = document.querySelector('.react-router-content') || document.querySelector('.content') || document.body;
    if (!target) return;

    const observer = new MutationObserver(() => {
      if (currentPrefs) refresh(currentPrefs);
    });

    observer.observe(target, { childList: true, subtree: true });
  }

  function watchHeadStyles() {
    if (!document.head) return;

    let pending = false;
    const observer = new MutationObserver(() => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => {
        pending = false;
        keepStyleLast();
      });
    });

    observer.observe(document.head, { childList: true });
  }

  async function init() {
    currentPrefs = await window.MinervaStorage.loadPrefs();
    await refresh(currentPrefs);
    watchNavigation();
    watchHeadStyles();

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message && message.type === 'UPDATE_PREFS' && message.prefs) {
        currentPrefs = message.prefs;
        refresh(currentPrefs).then(() => {
          sendResponse({ ok: true });
        });
        return true;
      } else if (message && message.type === 'GET_CALENDAR_LINK') {
        const link = findCalendarFeedLink();
        sendResponse(link ? { ok: true, link } : { ok: false, error: 'Calendar feed link not found on this page.' });
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
