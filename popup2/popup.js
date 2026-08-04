(() => {
  "use strict";

  const TARGET_HOST = "cet.iitp.ac.in";

  let enabled = true;
  let themeMode = "light";

  const powerBtn = document.getElementById("toggleTheme");
  const powerText = document.getElementById("powerText");
  const themeList = document.querySelector(".theme-list");
  const rows = document.querySelectorAll(".theme-row");
  const statusLine = document.getElementById("statusLine");

  function updateUI() {
    powerBtn.classList.toggle("off", !enabled);
    powerBtn.setAttribute("aria-pressed", String(enabled));
    powerText.textContent = enabled ? "ON" : "OFF";

    themeList.dataset.disabled = String(!enabled);

    rows.forEach((row) => {
      const isActive = row.dataset.theme === themeMode;
      row.classList.toggle("active", isActive);
      row.setAttribute("aria-checked", String(isActive));
    });
  }

  function updateStatus(hostMatches) {
    if (!hostMatches) {
      statusLine.textContent = `Open ${TARGET_HOST} to see the theme`;
      return;
    }
    statusLine.textContent = enabled
      ? `Theme is active on ${TARGET_HOST}`
      : `Theme is paused on ${TARGET_HOST}`;
  }

  function withActiveTab(callback) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs && tabs[0];
      callback(tab || null);
    });
  }

  function notifyTab() {
    withActiveTab((tab) => {
      if (!tab || !tab.id) return;
      chrome.tabs.sendMessage(
        tab.id,
        { action: "updateTheme", enabled, themeMode },
        () => void chrome.runtime.lastError // ignore if content script isn't present
      );
    });
  }

  function saveSettings() {
    chrome.storage.local.set({ enabled, themeMode }, notifyTab);
  }

  powerBtn.addEventListener("click", () => {
    enabled = !enabled;
    updateUI();
    updateStatus(true);
    saveSettings();
  });

  rows.forEach((row) => {
    row.addEventListener("click", () => {
      if (!enabled) return;
      themeMode = row.dataset.theme;
      updateUI();
      saveSettings();
    });
  });

  chrome.storage.local.get(["enabled", "themeMode"], (data) => {
    enabled = data.enabled ?? true;
    themeMode = data.themeMode ?? "light";
    updateUI();

    withActiveTab((tab) => {
      const hostMatches = !!tab?.url && tab.url.includes(TARGET_HOST);
      updateStatus(hostMatches);
    });
  });
})();
