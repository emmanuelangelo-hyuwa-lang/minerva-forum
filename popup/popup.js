(function () {
  const $ = (id) => document.getElementById(id);
  let eventsBound = false;

  const themeSelect = $('theme-select');
  const fontSelect = $('font-select');
  const headingFontSelect = $('heading-font-select');
  const fontSize = $('font-size');
  const fontSizeLabel = $('font-size-label');
  const accentColor = $('accent-color');
  const headerPreset = $('header-preset');
  const headerUpload = $('header-upload');
  const headerText = $('header-text');
  const roundedCards = $('rounded-cards');
  const copyCalendarBtn = $('copy-calendar-btn');
  const calendarStatus = $('calendar-status');
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
    fontSize.value = prefs.fontSize || 1.0;
    fontSizeLabel.textContent = Math.round((prefs.fontSize || 1.0) * 100) + '%';
    accentColor.value = prefs.accentColor || '#0A78BF';
    headerPreset.value = prefs.headerPreset || 'default';
    headerText.value = prefs.headerText || '';
    roundedCards.checked = !!prefs.roundedCards;

    bindEvents();
  }

  function normalizeSelectValue(select, value) {
    return Array.from(select.options).some((option) => option.value === value) ? value : 'default';
  }

  function bindEvents() {
    if (eventsBound) return;
    eventsBound = true;

    [themeSelect, fontSelect, headingFontSelect, fontSize, accentColor, headerPreset, headerText, roundedCards]
      .forEach((control) => control.addEventListener('change', onChange));
    headerText.addEventListener('input', onChange);
    headerUpload.addEventListener('change', onUpload);
    copyCalendarBtn.addEventListener('click', onCopyCalendarLink);
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

  function writeClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }

    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.setAttribute('readonly', '');
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.select();
    const copied = document.execCommand('copy');
    textArea.remove();
    return copied ? Promise.resolve() : Promise.reject(new Error('Clipboard copy failed.'));
  }

  async function onCopyCalendarLink() {
    calendarStatus.textContent = 'Looking for calendar link...';

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs || !tabs[0] || !tabs[0].id) {
        calendarStatus.textContent = 'Open Minerva Forum and try again.';
        return;
      }

      chrome.tabs.sendMessage(tabs[0].id, { type: 'GET_CALENDAR_LINK' }, async (response) => {
        if (chrome.runtime.lastError) {
          calendarStatus.textContent = 'Open the calendar feed page in Minerva Forum first.';
          return;
        }

        if (!response || !response.ok || !response.link) {
          calendarStatus.textContent = (response && response.error) || 'Calendar feed link not found on this page.';
          return;
        }

        try {
          await writeClipboard(response.link);
          calendarStatus.textContent = 'Calendar link copied.';
        } catch (error) {
          calendarStatus.textContent = 'Could not copy the link automatically.';
        }
      });
    });
  }

  async function onReset() {
    await window.MinervaStorage.savePrefs(window.MINERVA_DEFAULT_PREFS);
    await window.MinervaStorage.saveHeaderImage(null);
    init();
    sendUpdate(window.MINERVA_DEFAULT_PREFS);
  }

  document.addEventListener('DOMContentLoaded', init);
})();
