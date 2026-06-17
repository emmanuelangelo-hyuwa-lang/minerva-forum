(function () {
  const STYLE_ID = 'minerva-forum-customizer-styles';
  const BANNER_ID = 'minerva-customizer-banner-text';
  const CALENDAR_FEED_SELECTOR = '.body-s.input-0-2-74.input-d0-0-2-76';
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
    const imagerySelector = 'div.imagery';
    if (prefs.headerPreset === 'custom' && headerImage) {
      css += `${imagerySelector} { display: block !important; background-image: linear-gradient(rgba(0,0,0,0.08), rgba(0,0,0,0.08)), url("${cssUrl(headerImage)}") !important; background-size: cover !important; background-position: center center !important; }\n`;
    } else if (prefs.headerPreset === 'minerva') {
      css += `${imagerySelector} { display: block !important; background-image: linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.1)), url("${minervaHeaderImage}") !important; background-size: cover !important; background-position: center center !important; }\n`;
    } else if (HEADER_IMAGES[prefs.headerPreset]) {
      css += `${imagerySelector} { display: block !important; background-image: linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.1)), url("${HEADER_IMAGES[prefs.headerPreset]}") !important; background-size: cover !important; background-position: center center !important; }\n`;
    }

    if ((prefs.headerPreset && prefs.headerPreset !== 'default') || prefs.headerText) {
      css += `${headerSelector} { position: relative !important; overflow: hidden !important; }\n`;
    }
    css += `.${BANNER_ID} { position: absolute !important; left: 24px !important; bottom: 18px !important; right: 24px !important; z-index: 20 !important; font-size: 0.95rem !important; font-weight: 600 !important; color: #ffffff !important; text-shadow: 0 1px 8px rgba(0,0,0,0.45) !important; }\n`;
    css += `.${BANNER_ID}.hidden { display: none !important; }\n`;

    if (prefs.roundedCards) {
      css += 'table.fds-table, .fds-card, .office-hours-region .card, .announcement-region .card, .home-view-right-column > div { border-radius: 14px !important; overflow: hidden !important; }\n';
    }

    if (prefs.theme === 'charcoal' || prefs.theme === 'high-contrast') {
      css += `body#minerva-dashboard, section.main-region, .dashboard-layout, .main-wrapper, article#main-semantic-content, article#main-semantic-content .content, .react-router-content { background-color: var(--black-tint-10) !important; color: var(--white) !important; }\n`;
      css += `${headerSelector}, aside.sidebar, .announcement-region, .announcements-region, .office-hours-region, table.fds-table, .fds-card, .home-view-right-column > div, .assignments-list-view, .past-sections-view { background-color: var(--black-tint-20) !important; color: var(--white) !important; border-color: var(--black-tint-40) !important; }\n`;
      css += `header#header a, .navigation-link, .link-text, .subheader, .subheader *, article#main-semantic-content a, table.fds-table th, table.fds-table td { color: var(--white) !important; }\n`;
      css += `button, select, input, textarea, .react-select__control, .react-select__menu { background-color: var(--black-tint-20) !important; color: var(--white) !important; border-color: var(--black-tint-40) !important; }\n`;
      css += `tr.assignment-item-view:hover, tr.recently-graded-item-view:hover, li.sidebar-item-view.active a.navigation-link, .navigation-link:hover { background-color: var(--black-tint-40) !important; }\n`;
    } else if (prefs.theme === 'warm' || prefs.theme === 'warm-copper' || prefs.theme === 'warm-sand') {
      css += `body#minerva-dashboard, section.main-region, .dashboard-layout, .main-wrapper, article#main-semantic-content, article#main-semantic-content .content, .react-router-content { background-color: var(--black-tint-97) !important; }\n`;
      css += `header#header, aside.sidebar { border-color: var(--blue) !important; }\n`;
      css += `li.sidebar-item-view.active a.navigation-link, .navigation-link:hover, tr.assignment-item-view:hover, tr.recently-graded-item-view:hover { background-color: var(--blue-tint-90) !important; }\n`;
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

  async function init() {
    currentPrefs = await window.MinervaStorage.loadPrefs();
    await refresh(currentPrefs);
    watchNavigation();

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
