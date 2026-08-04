/**
 * THEME.BY — content.js
 * Bootstraps the engine on every matched Moodle page. All the real logic
 * lives in js/engine/*; this file just kicks it off.
 */
(function () {
  "use strict";

  if (!window.ThemeBY || !window.ThemeBY.ThemeEngine) {
    console.warn("[THEME.BY] engine modules missing — theme not applied.");
    return;
  }

  window.ThemeBY.ThemeEngine.start();
})();
