(function () {
  const $ = (id) => document.getElementById(id);
  let eventsBound = false;

  const themeSelect = $('theme-select');
  const fontSelect = $('font-select');
  const headingFontSelect = $('heading-font-select');
  const accentColor = $('accent-color');
  const headerPreset = $('header-preset');
  const headerUpload = $('header-upload');
  const roundedCards = $('rounded-cards');
  const resetBtn = $('reset-btn');
  const LEGACY_VALUES = {
    theme: {
      warm: 'ember',
      'warm-copper': 'ember',
      'warm-sand': 'forest',
      midnight: 'charcoal'
    },
    font: {
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
    }
  };

  async function init() {
    const prefs = await window.MinervaStorage.loadPrefs();

    themeSelect.value = normalizeSelectValue(themeSelect, LEGACY_VALUES.theme[prefs.theme] || prefs.theme || 'default');
    fontSelect.value = normalizeSelectValue(fontSelect, LEGACY_VALUES.font[prefs.fontFamily] || prefs.fontFamily || 'default');
    headingFontSelect.value = normalizeSelectValue(headingFontSelect, LEGACY_VALUES.font[prefs.headingFont] || prefs.headingFont || 'default');
    accentColor.value = prefs.accentColor || '#0A78BF';
    headerPreset.value = prefs.headerPreset || 'default';
    roundedCards.checked = !!prefs.roundedCards;

    bindEvents();
  }

  function normalizeSelectValue(select, value) {
    return Array.from(select.options).some((option) => option.value === value) ? value : 'default';
  }

  function bindEvents() {
    if (eventsBound) return;
    eventsBound = true;

    [themeSelect, fontSelect, headingFontSelect, accentColor, headerPreset, roundedCards]
      .forEach((control) => control.addEventListener('change', onChange));
    headerUpload.addEventListener('change', onUpload);
    resetBtn.addEventListener('click', onReset);
  }

  function getPrefs() {
    return {
      theme: themeSelect.value,
      fontFamily: fontSelect.value,
      headingFont: headingFontSelect.value,
      accentColor: accentColor.value,
      headerPreset: headerPreset.value,
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
