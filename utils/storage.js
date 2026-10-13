// Storage helpers: preferences in chrome.storage.sync, the (large) custom header image in local storage.
// Requires utils/catalog.js and utils/defaults.js.
window.MinervaStorage = {
  async loadPrefs() {
    const data = await chrome.storage.sync.get(['minervaPrefs']);
    return window.MinervaPrefs.normalizePrefs(data.minervaPrefs);
  },

  async savePrefs(prefs) {
    await chrome.storage.sync.set({ minervaPrefs: prefs });
  },

  async loadHeaderImage() {
    const data = await chrome.storage.local.get(['minervaHeaderImage']);
    return data.minervaHeaderImage || null;
  },

  async saveHeaderImage(dataUrl) {
    if (!dataUrl) {
      await chrome.storage.local.remove(['minervaHeaderImage']);
      return;
    }
    await chrome.storage.local.set({ minervaHeaderImage: dataUrl });
  }
};
