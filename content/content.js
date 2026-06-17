/*
 Content script for Minerva Forum Customizer.

 Responsibilities:
 - Load user prefs from chrome.storage.sync.
 - Inject CSS variable overrides and semantic selector tweaks.
 - Watch SPA route updates with a MutationObserver.
 - Listen for popup updates and sync changes.

 Notes:
 - CSS variables are primary because they override Minerva's theming cleanly.
 - Generated JSS classes are avoided because they are unstable across releases.
 - MutationObserver is required to reapply tweaks on client-side navigation.
*/

(function () {
  const STYLE_ID = 'minerva-forum-customizer-styles';

  function buildCSS(prefs) {
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

    if (prefs.theme === 'dark') {
      css += '  --black: #FFFFFF !important;\n';
      css += '  --white: #0A0A0A !important;\n';
      css += '  --black-tint-97: #0f0f10 !important;\n';
      css += '  --black-tint-95: #111111 !important;\n';
      css += '  --blue-tint-90: #18202F !important;\n';
    } else if (prefs.theme === 'high-contrast') {
      css += '  --black: #000000 !important;\n';
      css += '  --white: #FFFFFF !important;\n';
      css += '  --blue: #FFD500 !important;\n';
      css += '  --black-tint-95: #F6F6F6 !important;\n';
    } else if (prefs.theme === 'warm') {
      css += '  --blue: #C85A2A !important;\n';
      css += '  --blue-tint-90: #FFF5ED !important;\n';
      css += '  --black-tint-95: #FBF7F3 !important;\n';
    }

    css += '}\n\n';

    if (prefs.hideImagery) {
      css += 'div.imagery { display: none !important; }\n';
      css += 'div.subheader { padding: 12px 24px !important; }\n';
    }

    if (prefs.compactSidebar) {
      css += 'aside.sidebar { width: 56px !important; min-width: 56px !important; max-width: 56px !important; }\n';
      css += 'aside.sidebar span.link-text { display: none !important; }\n';
      css += 'aside.sidebar .svg-icon { margin-right: 0 !important; }\n';
    }

    if (prefs.hideIntercom) {
      css += 'iframe#intercom-frame, .intercom-lightweight-app { display: none !important; }\n';
    }

    if (prefs.roundedCards) {
      css += 'table.fds-table, .fds-card, .home-view-right-column > div { border-radius: 12px !important; overflow: hidden !important; }\n';
    }

    return css;
  }

  function applyTheme(prefs) {
    const existing = document.getElementById(STYLE_ID);
    if (existing) existing.remove();

    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.dataset.source = 'minerva-forum-customizer';
    style.textContent = buildCSS(prefs);
    document.head.appendChild(style);
  }

  function applyDOMModifications(prefs) {
    const sidebar = document.querySelector('aside.sidebar');
    if (!sidebar) return;

    if (prefs.compactSidebar) {
      sidebar.style.transition = 'width 180ms ease';
    } else {
      sidebar.style.width = '';
      sidebar.style.minWidth = '';
      sidebar.style.maxWidth = '';
    }
  }

  function watchNavigation(prefs) {
    const target = document.querySelector('.react-router-content') || document.querySelector('.content') || document.body;
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          const existing = document.getElementById(STYLE_ID);
          if (!existing) applyTheme(prefs);
          applyDOMModifications(prefs);
          break;
        }
      }
    });

    observer.observe(target, { childList: true, subtree: true });
  }

  async function init() {
    const prefs = await window.MinervaStorage.loadPrefs();
    applyTheme(prefs);
    applyDOMModifications(prefs);
    watchNavigation(prefs);

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message && message.type === 'UPDATE_PREFS' && message.prefs) {
        applyTheme(message.prefs);
        applyDOMModifications(message.prefs);
        sendResponse({ ok: true });
      }
    });

    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === 'sync' && changes.minervaPrefs) {
        const newPrefs = Object.assign({}, window.MINERVA_DEFAULT_PREFS, changes.minervaPrefs.newValue || {});
        applyTheme(newPrefs);
        applyDOMModifications(newPrefs);
      }
    });
  }

  init();
})();