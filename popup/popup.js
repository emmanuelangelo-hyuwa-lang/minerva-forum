(function () {
  const $ = (id) => document.getElementById(id);

  const themeSelect = $('theme-select');
  const fontSelect = $('font-select');
  const headingFontSelect = $('heading-font-select');
  const fontSize = $('font-size');
  const fontSizeLabel = $('font-size-label');
  const accentColor = $('accent-color');
  const headerPreset = $('header-preset');
  const headerUpload = $('header-upload');
  const headerText = $('header-text');
  const compactSidebar = $('compact-sidebar');
  const roundedCards = $('rounded-cards');
  const resetBtn = $('reset-btn');

  async function init() {
    const prefs = await window.MinervaStorage.loadPrefs();

    themeSelect.value = prefs.theme || 'default';
    fontSelect.value = prefs.fontFamily || 'default';
    headingFontSelect.value = prefs.headingFont || 'default';
    fontSize.value = prefs.fontSize || 1.0;
    fontSizeLabel.textContent = Math.round((prefs.fontSize || 1.0) * 100) + '%';
    accentColor.value = prefs.accentColor || '#0A78BF';
    headerPreset.value = prefs.headerPreset || 'default';
    headerText.value = prefs.headerText || '';
    compactSidebar.checked = !!prefs.compactSidebar;
    roundedCards.checked = !!prefs.roundedCards;

    bindEvents();
  }

  function bindEvents() {
    [themeSelect, fontSelect, headingFontSelect, fontSize, accentColor, headerPreset, headerText, compactSidebar, roundedCards]
      .forEach((control) => control.addEventListener('change', onChange));
    headerText.addEventListener('input', onChange);
    headerUpload.addEventListener('change', onUpload);
    resetBtn.addEventListener('click', onReset);
  }

  function getPrefs() {
    return {
      theme: themeSelect.value,
      fontFamily: fontSelect.value,
      headingFont: headingFontSelect.value,
      fontSize: Number(fontSize.value),
      accentColor: accentColor.value,
      headerPreset: headerPreset.value,
      headerText: headerText.value,
      compactSidebar: compactSidebar.checked,
      roundedCards: roundedCards.checked
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

  async function onUpload(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (loadEvent) => {
      const imageData = loadEvent.target.result;
      await window.MinervaStorage.saveHeaderImage(imageData);
      headerPreset.value = 'custom';
      await onChange();
    };
    reader.readAsDataURL(file);
  }

  async function onReset() {
    await window.MinervaStorage.savePrefs(window.MINERVA_DEFAULT_PREFS);
    await window.MinervaStorage.saveHeaderImage(null);
    init();
    sendUpdate(window.MINERVA_DEFAULT_PREFS);
  }

  document.addEventListener('DOMContentLoaded', init);
})();
