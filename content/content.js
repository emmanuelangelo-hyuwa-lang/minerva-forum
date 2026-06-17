(function () {
  const STYLE_ID = 'minerva-forum-customizer-styles';
  const BANNER_ID = 'minerva-customizer-banner-text';

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

    let css = ':root {\n';

    if (prefs.fontFamily && prefs.fontFamily !== 'default') {
      css += `  --sans-font-family: "${prefs.fontFamily}", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial !important;\n`;
    }

    if (prefs.headingFont && prefs.headingFont !== 'default') {
      css += `  --serif-font-family: "${prefs.headingFont}", serif !important;\n`;
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

    if (prefs.theme === 'charcoal') {
      css += '  --black: #11151a !important;\n';
      css += '  --white: #eef1f5 !important;\n';
      css += '  --black-tint-10: #13191f !important;\n';
      css += '  --black-tint-20: #1d242b !important;\n';
      css += '  --black-tint-40: #2f3842 !important;\n';
      css += '  --black-tint-70: #5a6570 !important;\n';
      css += '  --black-tint-90: #b3bac4 !important;\n';
      css += '  --black-tint-95: #d9dbe0 !important;\n';
      css += '  --black-tint-97: #eff1f4 !important;\n';
    } else if (prefs.theme === 'high-contrast') {
      css += '  --black: #000000 !important;\n';
      css += '  --white: #FFFFFF !important;\n';
      css += '  --black-tint-10: #000000 !important;\n';
      css += '  --black-tint-20: #000000 !important;\n';
      css += '  --black-tint-40: #101010 !important;\n';
      css += '  --black-tint-70: #333333 !important;\n';
      css += '  --black-tint-90: #f8f8f8 !important;\n';
      css += '  --black-tint-95: #ffffff !important;\n';
      css += '  --black-tint-97: #ffffff !important;\n';
      css += '  --blue: #FFD500 !important;\n';
      css += '  --blue-shade-20: #000000 !important;\n';
      css += '  --blue-tint-20: #000000 !important;\n';
      css += '  --blue-tint-90: #FFF9C1 !important;\n';
    } else if (prefs.theme === 'warm') {
      css += '  --blue: #b1602d !important;\n';
      css += '  --blue-tint-90: #FFF2E8 !important;\n';
      css += '  --black-tint-95: #FCF5EF !important;\n';
    } else if (prefs.theme === 'warm-copper') {
      css += '  --blue: #a3582a !important;\n';
      css += '  --blue-tint-90: #f9ede5 !important;\n';
      css += '  --black-tint-95: #fcf6f2 !important;\n';
    } else if (prefs.theme === 'warm-sand') {
      css += '  --blue: #be8b58 !important;\n';
      css += '  --blue-tint-90: #fcf1e7 !important;\n';
      css += '  --black-tint-95: #fbf7f2 !important;\n';
    }

    css += '}\n\n';

    const headerSelector = 'header#header, .subheader';
    if (prefs.headerPreset === 'custom' && headerImage) {
      css += `${headerSelector} { background-image: url("${headerImage}") !important; background-size: cover !important; background-position: center center !important; }\n`;
      css += `${headerSelector}::after { content: '' !important; position: absolute !important; inset: 0 !important; background: rgba(0,0,0,0.16) !important; pointer-events: none !important; }\n`;
    } else if (prefs.headerPreset === 'minerva') {
      css += `${headerSelector} { background: linear-gradient(135deg, #2b4c6f, #1a2f4c) !important; }\n`;
    } else if (prefs.headerPreset === 'africa') {
      css += `${headerSelector} { background: linear-gradient(135deg, #6b3e1f, #e7b676) !important; }\n`;
    } else if (prefs.headerPreset === 'americas') {
      css += `${headerSelector} { background: linear-gradient(135deg, #284b70, #7cc1d9) !important; }\n`;
    } else if (prefs.headerPreset === 'asia') {
      css += `${headerSelector} { background: linear-gradient(135deg, #6f2e5d, #d991c8) !important; }\n`;
    } else if (prefs.headerPreset === 'europe') {
      css += `${headerSelector} { background: linear-gradient(135deg, #31415c, #89a3cc) !important; }\n`;
    } else if (prefs.headerPreset === 'latin-america') {
      css += `${headerSelector} { background: linear-gradient(135deg, #254d33, #8fc08f) !important; }\n`;
    } else {
      css += `${headerSelector} { background-image: none !important; }\n`;
    }

    css += `${headerSelector} { position: relative !important; overflow: hidden !important; }\n`;
    css += `.${BANNER_ID} { position: absolute !important; left: 24px !important; bottom: 18px !important; right: 24px !important; z-index: 20 !important; font-size: 0.95rem !important; font-weight: 600 !important; color: #ffffff !important; text-shadow: 0 1px 8px rgba(0,0,0,0.45) !important; }\n`;
    css += `.${BANNER_ID}.hidden { display: none !important; }\n`;

    if (prefs.compactSidebar) {
      css += 'aside.sidebar { width: 56px !important; min-width: 56px !important; max-width: 56px !important; }\n';
      css += 'aside.sidebar span.link-text { display: none !important; }\n';
      css += 'aside.sidebar .svg-icon { margin-right: 0 !important; }\n';
    }

    if (prefs.roundedCards) {
      css += 'table.fds-table, .fds-card, .office-hours-region .card, .announcement-region .card, .home-view-right-column > div { border-radius: 14px !important; overflow: hidden !important; }\n';
    }

    if (prefs.theme === 'charcoal' || prefs.theme === 'high-contrast') {
      css += `${headerSelector}, aside.sidebar, article#main-semantic-content, .announcement-region, .office-hours-region { background-color: var(--black) !important; color: var(--white) !important; }\n`;
      css += `header#header a, .navigation-link, .link-text, .subheader, .subheader * { color: var(--white) !important; }\n`;
      css += `button, select, input, .fds-card { color: var(--white) !important; }\n`;
    }

    return css;
  }

  function applyStyle(prefs, headerImage) {
    const existing = document.getElementById(STYLE_ID);
    if (existing) existing.remove();
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = buildCSS(prefs, headerImage);
    document.head.appendChild(style);
  }

  function ensureBanner(prefs) {
    const container = document.querySelector('.subheader') || document.querySelector('header#header');
    if (!container) return;

    let banner = document.getElementById(BANNER_ID);
    if (!banner) {
      banner = document.createElement('div');
      banner.id = BANNER_ID;
      banner.className = BANNER_ID;
      container.appendChild(banner);
    }

    banner.textContent = prefs.headerText || '';
    banner.classList.toggle('hidden', !prefs.headerText);
  }

  async function refresh(prefs) {
    const headerImage = prefs.headerPreset === 'custom' ? await window.MinervaStorage.loadHeaderImage() : null;
    applyStyle(prefs, headerImage);
    ensureBanner(prefs);
    if (prefs.compactSidebar) {
      const sidebar = document.querySelector('aside.sidebar');
      if (sidebar) sidebar.style.transition = 'width 180ms ease';
    }
  }

  function watchNavigation(prefs) {
    const target = document.querySelector('.react-router-content') || document.querySelector('.content') || document.body;
    if (!target) return;

    const observer = new MutationObserver(() => {
      refresh(prefs);
    });

    observer.observe(target, { childList: true, subtree: true });
  }

  async function init() {
    const prefs = await window.MinervaStorage.loadPrefs();
    await refresh(prefs);
    watchNavigation(prefs);

    chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
      if (message && message.type === 'UPDATE_PREFS' && message.prefs) {
        await refresh(message.prefs);
        sendResponse({ ok: true });
      }
    });

    chrome.storage.onChanged.addListener(async (changes, area) => {
      if (area === 'sync' && changes.minervaPrefs) {
        const newPrefs = Object.assign({}, window.MINERVA_DEFAULT_PREFS, changes.minervaPrefs.newValue || {});
        await refresh(newPrefs);
      } else if (area === 'local' && changes.minervaHeaderImage) {
        const prefs = await window.MinervaStorage.loadPrefs();
        await refresh(prefs);
      }
    });
  }

  init();
})();
