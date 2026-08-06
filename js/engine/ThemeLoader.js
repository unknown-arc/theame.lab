(function (global) {
    "use strict";

    const ThemeBY = global.ThemeBY || (global.ThemeBY = {});
    const { Utils } = ThemeBY;

    const LINK_ATTR = "data-theme-by";

    const STYLE_TYPES = {
        COMMON: "common",
        COLOR: "color",
        PAGE: "page",
        LOGIN: "login"
    };

    const ThemeLoader = {

        _injected: new Set(),

        _config: null,

        async _loadConfig() {

            if (this._config)
                return this._config;

            this._config = await Utils.loadJSON(
                "themes/core/config/theme.json"
            );

            return this._config;
        },

        _injectOne(path) {

            if (!path) return;

            // Already injected?
            if (document.querySelector(`link[${LINK_ATTR}="${path}"]`)) {
                this._injected.add(path);
                return;
            }

            const link = document.createElement("link");

            link.rel = "stylesheet";
            link.href = Utils.assetURL(path);
            link.setAttribute(LINK_ATTR, path);

            // Detect stylesheet type
            let type = "common";

            if (path.includes("/colors/")) {
                type = "color";
            } else if (path.includes("/pages/")) {
                type = "page";
            } else if (path.includes("/login_page/")) {
                type = "login";
            }

            link.setAttribute("data-theme-type", type);

            (document.head || document.documentElement).appendChild(link);

            this._injected.add(path);

        },

        _injectMany(paths = []) {

            paths.forEach(path => this._injectOne(path));

        },

        async load(mode = "light") {

            const config = await this._loadConfig();

            // Shared/common css
            this._injectMany(config.common);

            // Light/Dark css
            this._replaceColorStylesheet(config.colors?.[mode]);

            // Page css
            const pageStyles =
                await ThemeBY.PageManager.resolvePageStylesheets();

            this._injectMany(pageStyles);

            // Login page css
            if (location.pathname.includes("/login") && config.shared?.login) {
                this._injectOne(config.shared.login);
            }

        },

        unload() {

            document
                .querySelectorAll(`link[${LINK_ATTR}]`)
                .forEach(link => link.remove());

            this._injected.clear();

        },

        _replaceColorStylesheet(path) {

            document
                .querySelectorAll('link[data-theme-type="color"]')
                .forEach(link => {

                    this._injected.delete(
                        link.getAttribute(LINK_ATTR)
                    );

                    link.remove();

                });

            // Inject the new color stylesheet
            this._injectOne(path);

        },

    };

    ThemeBY.ThemeLoader = ThemeLoader;

})(window);