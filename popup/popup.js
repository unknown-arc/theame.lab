const setUI = (mode) => {
  chrome.storage.local.set({ themeMode: mode });
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) chrome.tabs.sendMessage(tabs[0].id, { action: "updateTheme", mode: mode });
  });
};

document.getElementById('btn-off').addEventListener('click', () => setUI('off'));
document.getElementById('btn-light').addEventListener('click', () => setUI('light'));
document.getElementById('btn-dark').addEventListener('click', () => setUI('dark'));