/**
 * THEME.BY — ColorManager
 * Owns the theme class applied to <html>. Keeping this in one place avoids
 * the classic bug of an "off" class accidentally matching CSS written as
 * html[class*="moodle-apple-pro"].
 */
(function (global) {
  "use strict";

  const ThemeBY = global.ThemeBY || (global.ThemeBY = {});

  const CLASS_MAP = {
    light: "moodle-apple-pro-light",
    dark: "moodle-apple-pro-dark",
  };

  const ColorManager = {
    classFor(mode) {
      return CLASS_MAP[mode] || null;
    },

    allClasses() {
      return Object.values(CLASS_MAP);
    },

    /** Apply the class for `mode`, removing any other theme class first. */
    applyMode(mode) {
      const root = document.documentElement;
      root.classList.remove(...this.allClasses());

      const cls = this.classFor(mode);
      if (cls) root.classList.add(cls);

      root.setAttribute("data-theme-by-mode", mode || "");
    },

    /** Remove every theme class — used when the extension is toggled off. */
    clear() {
      const root = document.documentElement;
      root.classList.remove(...this.allClasses());
      root.removeAttribute("data-theme-by-mode");
    },
  };

  ThemeBY.ColorManager = ColorManager;
})(window);
