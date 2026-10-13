(function () {
  const { THEMES, FONT_PAIRS, CORNERS, HEADERS, TEXT_SIZE, resolveTheme } = window.MFC;
  const $ = (id) => document.getElementById(id);
  const FORUM_DEFAULT = { page: '#f2f2f2', surface: '#ffffff', sidebar: '#343434', accent: '#0a78bf' };
  const TAB_KEY = 'mfc-popup-tab';

  let prefs = null;
  let customHeader = null;
  let saveTimer = null;

  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    Object.entries(attrs || {}).forEach(([key, value]) => {
      if (key === 'style') Object.assign(node.style, value);
      else if (key === 'text') node.textContent = value;
      else if (key.startsWith('on')) node.addEventListener(key.slice(2), value);
      else node.setAttribute(key, value);
    });
    (children || []).forEach((child) => node.appendChild(child));
    return node;
  }

  function update(changes) {
    Object.assign(prefs, changes);
    render();
    // Debounced: sliders and the colour picker fire many events, and sync storage is rate limited.
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => window.MinervaStorage.savePrefs(prefs), 150);
  }

  // ---- Theme tab

  function themeColors(key) {
    const vars = resolveTheme(key, prefs.accent);
    if (!vars) return Object.assign({}, FORUM_DEFAULT, prefs.accent ? { accent: prefs.accent } : {});
    return { page: vars['--mfc-page'], surface: vars['--mfc-surface'], sidebar: vars['--mfc-sidebar'], accent: vars['--mfc-accent'] };
  }

  function swatch(key, name) {
    const c = themeColors(key);
    return el('button', { class: 'swatch', type: 'button', 'data-theme': key, 'aria-pressed': String(prefs.theme === key), onclick: () => update({ theme: key }) }, [
      el('span', { class: 'swatch-art', style: { background: c.page } }, [
        el('span', { class: 'sb', style: { background: c.sidebar } }),
        el('span', { class: 'card', style: { background: c.surface } }),
        el('span', { class: 'acc', style: { background: c.accent } })
      ]),
      el('span', { text: name })
    ]);
  }

  function renderTheme() {
    const light = [swatch('default', 'Forum')];
    const dark = [];
    Object.entries(THEMES).forEach(([key, t]) => (t.mode === 'dark' ? dark : light).push(swatch(key, t.name)));
    $('themes-light').replaceChildren(...light);
    $('themes-dark').replaceChildren(...dark);

    $('accent').value = prefs.accent || themeColors(prefs.theme).accent;
    $('accent-reset').hidden = !prefs.accent;

    $('corners').replaceChildren(...Object.entries(CORNERS).map(([key, c]) =>
      el('button', { type: 'button', text: c.name, 'aria-pressed': String(prefs.corners === key), onclick: () => update({ corners: key }) })
    ));
  }

  // ---- Header tab

  function strip(key, name, image) {
    return el('button', {
      class: image ? 'strip' : 'strip plain',
      type: 'button',
      'aria-pressed': String(prefs.header === key),
      style: image ? { backgroundImage: `url("${image}")` } : {},
      onclick: () => update({ header: key })
    }, [el('span', { text: name })]);
  }

  function renderHeader() {
    const strips = [strip('default', prefs.theme === 'default' ? 'Forum default' : 'Theme color', null)];
    if (customHeader) strips.push(strip('custom', 'Your upload', customHeader));
    Object.entries(HEADERS).forEach(([key, name]) => strips.push(strip(key, name, `../images/headers/${key}.jpg`)));
    $('headers').replaceChildren(...strips);
  }

  // ---- Text tab

  function renderText() {
    $('text-size').value = prefs.textSize;
    $('text-size-value').textContent = `${prefs.textSize}%`;

    $('fonts').replaceChildren(...Object.entries(FONT_PAIRS).map(([key, f]) =>
      el('button', { class: 'font', type: 'button', 'aria-pressed': String(prefs.fonts === key), onclick: () => update({ fonts: key }) }, [
        el('span', { class: 'font-name', text: f.name, style: f.heading ? { fontFamily: f.heading } : {} }),
        el('span', { class: 'font-sample', text: 'Readable notes for a long seminar.', style: f.body ? { fontFamily: f.body } : {} })
      ])
    ));
  }

  function render() {
    renderTheme();
    renderHeader();
    renderText();
  }

  function showTab(name) {
    document.querySelectorAll('[role="tab"]').forEach((tab) => tab.setAttribute('aria-selected', String(tab.dataset.tab === name)));
    document.querySelectorAll('[data-panel]').forEach((panel) => { panel.hidden = panel.dataset.panel !== name; });
    try { localStorage.setItem(TAB_KEY, name); } catch (e) { /* remembering the tab is optional */ }
  }

  async function init() {
    prefs = await window.MinervaStorage.loadPrefs();
    customHeader = await window.MinervaStorage.loadHeaderImage();

    const size = $('text-size');
    size.min = TEXT_SIZE.min;
    size.max = TEXT_SIZE.max;
    size.step = TEXT_SIZE.step;
    size.addEventListener('input', () => update({ textSize: Number(size.value) }));
    $('accent').addEventListener('input', (event) => update({ accent: event.target.value }));
    $('accent-reset').addEventListener('click', () => update({ accent: null }));
    $('upload').addEventListener('click', () => chrome.runtime.openOptionsPage());
    $('reset').addEventListener('click', async () => {
      await window.MinervaStorage.saveHeaderImage(null);
      customHeader = null;
      update(Object.assign({}, window.MINERVA_DEFAULT_PREFS));
    });
    document.querySelectorAll('[role="tab"]').forEach((tab) => tab.addEventListener('click', () => showTab(tab.dataset.tab)));

    let lastTab = 'theme';
    try { lastTab = localStorage.getItem(TAB_KEY) || 'theme'; } catch (e) { /* default tab */ }
    showTab(lastTab);
    render();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
