// Storage helpers using chrome.storage.sync
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
  }
};
