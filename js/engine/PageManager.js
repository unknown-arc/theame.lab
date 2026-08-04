/**
 * THEME.BY — PageManager
 * Figures out which Moodle "page type" is currently open (dashboard, course,
 * quiz, ...) so the ThemeLoader can inject the right page-specific stylesheet
 * on top of the shared base theme.
 */
(function (global) {
  "use strict";

  const ThemeBY = global.ThemeBY || (global.ThemeBY = {});
  const { Utils } = ThemeBY;

  const PageManager = {
    _config: null,

    /** Load (and cache) the page-matching rules from config/themes.json. */
    async loadConfig() {
      if (this._config) return this._config;
      try {
        this._config = await Utils.loadJSON("config/themes.json");
      } catch (err) {
        Utils.warn("could not load config/themes.json, using empty page map", err);
        this._config = { pages: {} };
      }
      return this._config;
    },

    /** Return the list of page ids that match the current location. */
    async detectPages() {
      const config = await this.loadConfig();
      const pathname = window.location.pathname;
      const search = window.location.search;
      const matches = [];

      for (const [pageId, rule] of Object.entries(config.pages || {})) {
        if (Utils.matchesAny(pathname + search, rule.match)) {
          matches.push(pageId);
        }
      }
      return matches;
    },

    /** Resolve the page-specific stylesheet paths for the current URL. */
    async resolvePageStylesheets() {
      const config = await this.loadConfig();
      const pageIds = await this.detectPages();
      return pageIds
        .map((id) => config.pages[id]?.file)
        .filter(Boolean);
    },

    /** Resolve the always-on "common" stylesheets from the theme registry. */
    async resolveCommonStylesheets() {
      const config = await this.loadConfig();
      return config.common || [];
    },

    /** Resolve the stylesheet for a given theme mode ("light" | "dark"). */
    async resolveColorStylesheet(mode) {
      const config = await this.loadConfig();
      const theme = (config.themes || []).find((t) => t.id === mode);
      return theme ? theme.colorFile : null;
    },
  };

  ThemeBY.PageManager = PageManager;
})(window);
