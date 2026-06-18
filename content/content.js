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
      bg: '#eef3f8',
      panel: '#f8fafc',
      panelAlt: '#dbe7f3',
      text: '#1b2633',
      muted: '#53677c',
      line: '#9db2c8',
      accent: '#245f8f',
      accentSoft: '#d6e7f5',
      hover: '#c9dcec'
    },
    highContrast: {
      bg: '#f4f4f0',
      panel: '#ffffff',
      panelAlt: '#e4e1d6',
      text: '#111111',
      muted: '#4b4b43',
      line: '#88816c',
      accent: '#846400',
      accentSoft: '#fff1ad',
      hover: '#ece4bf'
    },
    forest: {
      bg: '#edf6ef',
      panel: '#f8fcf8',
      panelAlt: '#d5ead9',
      text: '#183522',
      muted: '#4f705b',
      line: '#91b69b',
      accent: '#2c7040',
      accentSoft: '#d8eddd',
      hover: '#c9e2d0'
    },
    burgundy: {
      bg: '#f8eef2',
      panel: '#fff9fb',
      panelAlt: '#efd2dc',
      text: '#3c1724',
      muted: '#7c5160',
      line: '#c295a5',
      accent: '#9a2f55',
      accentSoft: '#f2dce5',
      hover: '#e8c9d5'
    },
    ultraviolet: {
      bg: '#f3effa',
      panel: '#fbf9ff',
      panelAlt: '#ded2f2',
      text: '#2a1d40',
      muted: '#66537e',
      line: '#a996ca',
      accent: '#684aa0',
      accentSoft: '#e7dcf8',
      hover: '#d9ccee'
    },
    ocean: {
      bg: '#edf7f8',
      panel: '#f7fcfd',
      panelAlt: '#cee8ec',
      text: '#12343b',
      muted: '#4d7078',
      line: '#8bb7bf',
      accent: '#1c7585',
      accentSoft: '#d5eef2',
      hover: '#c4e1e7'
    },
    ember: {
      bg: '#fbf0e8',
      panel: '#fffaf6',
      panelAlt: '#f1d8c8',
      text: '#3b2014',
      muted: '#7c5a49',
      line: '#c9a08a',
      accent: '#9b4f22',
      accentSoft: '#f5dfd0',
      hover: '#eccfbd'
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
      css += `  --black: ${theme.text} !important;\n`;
      css += '  --white: #ffffff !important;\n';
      css += `  --black-tint-10: ${theme.text} !important;\n`;
      css += `  --black-tint-20: ${theme.text} !important;\n`;
      css += `  --black-tint-40: ${theme.muted} !important;\n`;
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
      css += `${appSelector} table.fds-table, ${appSelector} .fds-card, ${appSelector} .office-hours-region .card, ${appSelector} .announcement-region .card, ${appSelector} .home-view-right-column > div, ${appSelector} .student-assignments-list-view, ${appSelector} .assignments-list-view, ${appSelector} .all-outcomes-view, ${appSelector} .past-sections-view, ${appSelector} .visiting-sections-view, ${appSelector} .all-events-view, ${appSelector} .dashboard-module.js-rubric-key, ${appSelector} .root-d3-0-2-10, ${appSelector} .root-d14-0-2-63, ${appSelector} .root-d5-0-2-62, ${appSelector} .root-d38-0-2-108, ${appSelector} .root-d9-0-2-107, ${appSelector} .root-d39-0-2-110, ${appSelector} .root-d10-0-2-109, ${appSelector} .root-d41-0-2-113, ${appSelector} .h2.mb5, ${appSelector} aside.sidebar, ${appSelector} .dashboard-control-center-view, ${appSelector} .menu-view .menu-items, ${appSelector} .profile-photo-medium, ${appSelector} .circle-button--transparent { border-radius: 16px !important; overflow: hidden !important; }\n`;
      css += '.profile-photo-medium, .circle-button--transparent { border-radius: 999px !important; }\n';
    }

    if (theme) {
      css += `${appSelector}, ${appSelector} > .main-region, ${appSelector} .dashboard-layout, ${appSelector} .main-wrapper, ${appSelector} .content-wrapper, ${appSelector} .stage-wrapper, ${appSelector} article#main-semantic-content, ${appSelector} article#main-semantic-content .content, ${appSelector} .react-router-content { background-color: ${theme.bg} !important; color: ${theme.text} !important; }\n`;
      css += `${appSelector} aside.sidebar, ${appSelector} .announcement-region, ${appSelector} .announcements-region, ${appSelector} .office-hours-region, ${appSelector} table.fds-table, ${appSelector} .fds-card, ${appSelector} .home-view-right-column > div, ${appSelector} .assignments-list-view, ${appSelector} .student-assignments-list-view, ${appSelector} .all-outcomes-view, ${appSelector} .past-sections-view, ${appSelector} .visiting-sections-view, ${appSelector} .all-events-view, ${appSelector} .dashboard-module.js-rubric-key { background-color: ${theme.panel} !important; color: ${theme.text} !important; border-color: ${theme.line} !important; }\n`;
      css += `${appSelector} table.fds-table th { background-color: ${theme.accentSoft} !important; color: ${theme.text} !important; border-color: ${theme.line} !important; }\n`;
      css += `${appSelector} table.fds-table td { background-color: ${theme.panel} !important; color: ${theme.text} !important; border-color: ${theme.line} !important; }\n`;
      css += `${appSelector} .text-black-tint-20, ${appSelector} .text-black-tint-40, ${appSelector} .body, ${appSelector} .body-s, ${appSelector} .body-xs, ${appSelector} article#main-semantic-content, ${appSelector} article#main-semantic-content p, ${appSelector} article#main-semantic-content span, ${appSelector} article#main-semantic-content div { color: ${theme.text} !important; }\n`;
      css += `${appSelector} .text-black-tint-70, ${appSelector} .text-black-tint-90, ${appSelector} footer, ${appSelector} footer * { color: ${theme.muted} !important; }\n`;
      css += `${appSelector} article#main-semantic-content a, ${appSelector} .navigation-link, ${appSelector} .link-text { color: ${theme.accent} !important; }\n`;
      css += `${appSelector} button, ${appSelector} select, ${appSelector} input, ${appSelector} textarea, ${appSelector} [contenteditable="true"], ${appSelector} .react-select__control, ${appSelector} [class*="react-select__control"], ${appSelector} .react-select__menu, ${appSelector} [class*="-menu"], ${appSelector} .title-search { background-color: ${theme.panel} !important; color: ${theme.text} !important; border-color: ${theme.line} !important; }\n`;
      css += `${appSelector} .react-select__single-value, ${appSelector} .react-select__placeholder, ${appSelector} [class*="singleValue"], ${appSelector} [class*="placeholder"] { color: ${theme.text} !important; }\n`;
      css += `${appSelector} tr.assignment-item-view:hover, ${appSelector} tr.recently-graded-item-view:hover, ${appSelector} li.sidebar-item-view.active a.navigation-link, ${appSelector} .navigation-link:hover { background-color: ${theme.hover} !important; }\n`;
      css += `${appSelector} .status-wrapper.status-red { background-color: #f8d7da !important; color: #8a1f2d !important; border-color: #d88b96 !important; }\n`;
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
