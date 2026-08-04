/**
 * THEME.BY — StorageManager
 * Single source of truth for reading/writing extension settings and for
 * reacting when the popup (or another tab) changes them.
 */
(function (global) {
  "use strict";

  const ThemeBY = global.ThemeBY || (global.ThemeBY = {});
  const { Utils } = ThemeBY;

  const DEFAULTS = {
    enabled: true,
    themeMode: "light",
  };

  const StorageManager = {
    defaults: DEFAULTS,

    /** Resolve the current settings, falling back to defaults. */
    get() {
      return new Promise((resolve) => {
        chrome.storage.local.get(["enabled", "themeMode"], (data) => {
          resolve({
            enabled: data.enabled ?? DEFAULTS.enabled,
            themeMode: data.themeMode ?? DEFAULTS.themeMode,
          });
        });
      });
    },

    /** Persist a partial settings patch. */
    set(patch) {
      return new Promise((resolve) => {
        chrome.storage.local.set(patch, resolve);
      });
    },

    /** Subscribe to changes made from any context (popup, other tabs). */
    onChange(callback) {
      chrome.storage.onChanged.addListener((changes, area) => {
        if (area !== "local") return;
        if (!("enabled" in changes) && !("themeMode" in changes)) return;

        callback({
          enabled: changes.enabled ? changes.enabled.newValue : undefined,
          themeMode: changes.themeMode ? changes.themeMode.newValue : undefined,
        });
      });
    },

    /** Subscribe to one-off messages sent from the popup (fast path). */
    onMessage(callback) {
      chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
        if (!msg || msg.action !== "updateTheme") return;
        callback({ enabled: msg.enabled, themeMode: msg.themeMode });
        sendResponse({ ok: true });
      });
    },
  };

  ThemeBY.StorageManager = StorageManager;
})(window);
