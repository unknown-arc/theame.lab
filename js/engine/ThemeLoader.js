/**
 * THEME.BY — ThemeLoader
 * Injects/removes the actual <link> stylesheets into the page. Keeps track
 * of what it has injected so re-applying a theme never duplicates tags and
 * disabling the theme cleanly removes everything it added.
 */
(function (global) {
  "use strict";

  const ThemeBY = global.ThemeBY || (global.ThemeBY = {});
  const { Utils } = ThemeBY;

  const LINK_ATTR = "data-theme-by";

  const BASE_STYLESHEETS = [
    "themes/core/css/common/variables.css",
    "themes/core/css/common/header/header.css",
    "themes/core/css/sidebar.css",
    "themes/core/css/buttons.css",
    "themes/core/css/cards.css",
    "themes/core/css/forms.css",
    "themes/core/css/common/page_transitions.css",
    "themes/core/css/pages/My Course/course.css",
    "core/page_footer/footer.css",
  ];

  const ThemeLoader = {
    _injected: new Set(),

    _injectOne(path) {
      if (this._injected.has(path)) return;

      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = Utils.assetURL(path);
      link.setAttribute(LINK_ATTR, path);
      (document.head || document.documentElement).appendChild(link);

      this._injected.add(path);
    },

    _injectMany(paths) {
      paths.filter(Boolean).forEach((p) => this._injectOne(p));
    },

    /** Inject the always-on base theme plus any page-aware extras. */
    async load(mode) {
  Utils.onDomReady(async () => {

    // Detect login page
    const isLoginPage =
      location.pathname.includes("/login/") ||
      document.body.classList.contains("pagelayout-login");

    // Common CSS
    this._injectMany(BASE_STYLESHEETS);

    // Inject only ONE layout CSS
    if (isLoginPage) {
      this._injectOne("core/login_page/login.css");
    } else {
      this._injectOne("themes/core/css/common/base.css");
    }

    try {
      const [common, colorFile, pageFiles] = await Promise.all([
        ThemeBY.PageManager.resolveCommonStylesheets(),
        ThemeBY.PageManager.resolveColorStylesheet(mode),
        ThemeBY.PageManager.resolvePageStylesheets(),
      ]);

      this._injectMany(common);
      this._injectOne(colorFile);
      this._injectMany(pageFiles);
    } catch (err) {
      Utils.warn("page-aware stylesheets skipped:", err);
    }
  });
},

    /** Remove every stylesheet this loader has injected. */
    unload() {
      document
        .querySelectorAll(`link[${LINK_ATTR}]`)
        .forEach((link) => link.remove());
      this._injected.clear();
    },
  };

  ThemeBY.ThemeLoader = ThemeLoader;
})(window);
