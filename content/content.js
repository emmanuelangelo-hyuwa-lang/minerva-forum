// Applies the saved preferences to Forum. All CSS rules live in styles/injected.css; this
// script only flips data-mfc-* attributes on <html> and writes --mfc-* variables.
(function () {
  const { FONT_PAIRS, CORNERS, HEADERS, TEXT_SIZE, resolveTheme, accentVars } = window.MFC;
  const VARS_ID = 'mfc-vars';
  const CARD_ATTR = 'data-mfc-card';

  function setFlag(name, value) {
    const root = document.documentElement;
    if (value) root.setAttribute(`data-mfc-${name}`, value);
    else root.removeAttribute(`data-mfc-${name}`);
  }

  function cssUrl(value) {
    return `url("${String(value).replace(/["\\\n\r]/g, '')}")`;
  }

  function apply(prefs, customHeader) {
    const vars = {};

    const theme = resolveTheme(prefs.theme, prefs.accent);
    const mode = theme ? window.MFC.THEMES[prefs.theme].mode : null;
    if (theme) Object.assign(vars, theme);
    else if (prefs.accent) Object.assign(vars, accentVars(prefs.accent, '#ffffff', 'light'));
    setFlag('theme', theme ? prefs.theme : null);
    setFlag('mode', mode);
    setFlag('accent', theme || prefs.accent ? '1' : null);

    let header = null;
    const headerImage = prefs.header === 'custom' ? customHeader : HEADERS[prefs.header] && chrome.runtime.getURL(`images/headers/${prefs.header}.jpg`);
    if (headerImage) {
      header = 'image';
      vars['--mfc-header-image'] = cssUrl(headerImage);
    } else if (theme) {
      header = 'color';
    }
    setFlag('header', header);

    const fonts = FONT_PAIRS[prefs.fonts];
    if (fonts && fonts.body) {
      vars['--mfc-font-body'] = fonts.body;
      vars['--mfc-font-heading'] = fonts.heading;
    }
    setFlag('fonts', fonts && fonts.body ? prefs.fonts : null);

    const textSize = prefs.textSize !== TEXT_SIZE.default ? prefs.textSize : null;
    if (textSize) vars['--mfc-font-size'] = `${(16 * textSize) / 100}px`;
    setFlag('text-size', textSize ? String(textSize) : null);

    const corners = CORNERS[prefs.corners];
    if (corners && corners.card) {
      vars['--mfc-radius-card'] = corners.card;
      vars['--mfc-radius-control'] = corners.control;
    }
    setFlag('corners', corners && corners.card ? prefs.corners : null);

    let style = document.getElementById(VARS_ID);
    if (!style) {
      style = document.createElement('style');
      style.id = VARS_ID;
      (document.head || document.documentElement).appendChild(style);
    }
    style.textContent = `:root {\n${Object.entries(vars).map(([k, v]) => `  ${k}: ${v};`).join('\n')}\n}\n`;
  }

  // Forum's React cards are generic <Box> elements with generated class names that change
  // between builds, so mark the ones that actually draw a surface. An attribute is used
  // because React rewrites className on re-render.
  function tagCards() {
    document.querySelectorAll(`[data-testid="Box"]:not([${CARD_ATTR}])`).forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (!rect.width || !rect.height) return; // not laid out yet; check again later
      const cs = getComputedStyle(el);
      const paints = cs.backgroundColor !== 'rgba(0, 0, 0, 0)' || cs.boxShadow !== 'none';
      const isCard = paints && rect.width >= 160 && rect.height >= 40 && !el.parentElement.closest(`[${CARD_ATTR}="1"]`);
      el.setAttribute(CARD_ATTR, isCard ? '1' : '0');
    });
  }

  function watchDom() {
    let pending = false;
    new MutationObserver(() => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => {
        pending = false;
        tagCards();
      });
    }).observe(document.documentElement, { childList: true, subtree: true });
  }

  async function refresh() {
    const prefs = await window.MinervaStorage.loadPrefs();
    const customHeader = prefs.header === 'custom' ? await window.MinervaStorage.loadHeaderImage() : null;
    apply(prefs, customHeader);
  }

  refresh();
  watchDom();
  chrome.storage.onChanged.addListener((changes) => {
    if (changes.minervaPrefs || changes.minervaHeaderImage) refresh();
  });
})();
