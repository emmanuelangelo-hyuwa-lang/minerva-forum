(function () {
  const $ = (id) => document.getElementById(id);

  const themeSelect = $('theme-select');
  const fontSelect = $('font-select');
  const headingFontSelect = $('heading-font-select');
  const fontSize = $('font-size');
  const fontSizeLabel = $('font-size-label');
  const accentColor = $('accent-color');
  const hideImagery = $('hide-imagery');
  const compactSidebar = $('compact-sidebar');
  const roundedCards = $('rounded-cards');
  const hideIntercom = $('hide-intercom');
  const resetBtn = $('reset-btn');

  async function init() {
    const prefs = await window.MinervaStorage.loadPrefs();

    themeSelect.value = prefs.theme || 'default';
    fontSelect.value = prefs.fontFamily || 'default';
    headingFontSelect.value = prefs.headingFont || 'default';
    fontSize.value = prefs.fontSize || 1.0;
    fontSizeLabel.textContent = Math.round((prefs.fontSize || 1.0) * 100) + '%';
    accentColor.value = prefs.accentColor || '#0A78BF';
    hideImagery.checked = !!prefs.hideImagery;
    compactSidebar.checked = !!prefs.compactSidebar;
    roundedCards.checked = !!prefs.roundedCards;
    hideIntercom.checked = prefs.hideIntercom !== false;

    bindEvents();
  }

  function bindEvents() {
    [themeSelect, fontSelect, headingFontSelect, fontSize, accentColor, hideImagery, compactSidebar, roundedCards, hideIntercom]
      .forEach((control) => control.addEventListener('change', onChange));
    resetBtn.addEventListener('click', onReset);
  }

  function getPrefs() {
    return {
      theme: themeSelect.value,
      fontFamily: fontSelect.value,
      headingFont: headingFontSelect.value,
      fontSize: Number(fontSize.value),
      accentColor: accentColor.value,
      hideImagery: hideImagery.checked,
      compactSidebar: compactSidebar.checked,
      roundedCards: roundedCards.checked,
      hideIntercom: hideIntercom.checked
    };
  }

  function sendUpdate(prefs) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs || !tabs[0] || !tabs[0].id) return;
      chrome.tabs.sendMessage(tabs[0].id, { type: 'UPDATE_PREFS', prefs }, () => {});
    });
  }

  async function onChange() {
    const prefs = getPrefs();
    fontSizeLabel.textContent = Math.round(prefs.fontSize * 100) + '%';
    await window.MinervaStorage.savePrefs(prefs);
    sendUpdate(prefs);
  }

  async function onReset() {
    await window.MinervaStorage.savePrefs(window.MINERVA_DEFAULT_PREFS);
    init();
    sendUpdate(window.MINERVA_DEFAULT_PREFS);
  }

  document.addEventListener('DOMContentLoaded', init);
})();