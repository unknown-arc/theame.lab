/**
 * THEME.BY — ThemeEngine
 * Thin entry point that wires the engine modules together. Loaded last
 * (before content.js) so every module it depends on already exists.
 */
(function (global) {
  "use strict";

  const ThemeBY = global.ThemeBY || (global.ThemeBY = {});

  const ThemeEngine = {
    started: false,

    start() {
      if (this.started) return;
      this.started = true;
      ThemeBY.ThemeManager.init().catch((err) =>
        ThemeBY.Utils.warn("failed to start:", err)
      );
    },
  };

  ThemeBY.ThemeEngine = ThemeEngine;
})(window);
