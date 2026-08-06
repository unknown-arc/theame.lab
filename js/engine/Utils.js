/**
 * THEME.BY — Utils
 * Small, dependency-free helpers shared across the engine modules.
 * Exposed on the shared `window.ThemeBY` namespace.
 */
(function (global) {
  "use strict";

  const ThemeBY = global.ThemeBY || (global.ThemeBY = {});

  const Utils = {
    /** Resolve a path bundled with the extension into a loadable URL. */
    assetURL(path) {
      return chrome.runtime.getURL(path);
    },

    /** Fetch and parse a JSON file bundled with the extension. */
    async loadJSON(path) {
      const res = await fetch(Utils.assetURL(path), { cache: "no-store" });
      if (!res.ok) {
        throw new Error(`THEME.BY: failed to load ${path} (${res.status})`);
      }
      return res.json();
    },


    /** Debounce a function so it only runs after `wait` ms of silence. */
    debounce(fn, wait = 150) {
      let timer = null;
      return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), wait);
      };
    },

    /** Run `fn` once the document has a <head>/<body> to work with. */
    onDomReady(fn) {
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", fn, { once: true });
      } else {
        fn();
      }
    },

    /** True if `pathname` matches any of the given match rules. */
    matchesAny(pathname, rules) {
      if (!Array.isArray(rules)) return false;
      return rules.some((rule) => rule === "*" || pathname.includes(rule));
    },

    log(...args) {
      console.log("%c[THEME.BY]", "color:#0071e3;font-weight:600;", ...args);
    },

    warn(...args) {
      console.warn("[THEME.BY]", ...args);
    },
  };

  ThemeBY.Utils = Utils;
})(window);
