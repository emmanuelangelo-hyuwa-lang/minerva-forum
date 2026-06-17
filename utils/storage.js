// Storage helpers using chrome.storage.sync and local storage for image uploads.
window.MinervaStorage = {
  async loadPrefs() {
    return new Promise((resolve) => {
      chrome.storage.sync.get(['minervaPrefs'], (data) => {
        resolve(Object.assign({}, window.MINERVA_DEFAULT_PREFS, data.minervaPrefs || {}));
      });
    });
  },

  async savePrefs(prefs) {
    return new Promise((resolve) => {
      chrome.storage.sync.set({ minervaPrefs: prefs }, () => {
        resolve();
      });
    });
  },

  async loadHeaderImage() {
    return new Promise((resolve) => {
      chrome.storage.local.get(['minervaHeaderImage'], (data) => {
        resolve(data.minervaHeaderImage || null);
      });
    });
  },

  async saveHeaderImage(dataUrl) {
    return new Promise((resolve) => {
      if (!dataUrl) {
        chrome.storage.local.remove(['minervaHeaderImage'], resolve);
        return;
      }
      chrome.storage.local.set({ minervaHeaderImage: dataUrl }, () => {
        resolve();
      });
    });
  }
};
