(function(global) {
    "use strict";

    const ThemeBY = global.ThemeBY || (global.ThemeBY = {});
    const { Utils } = ThemeBY;

    const PageManager = {
        _themeConfig: null,
        _routesConfig: null,

        async loadThemeConfig() {
            if (this._themeConfig) {
                return this._themeConfig;
            }

            this._themeConfig =
                await Utils.loadJSON(
                    "themes/core/config/theme.json"
                );

            return this._themeConfig;
        },

        async loadRoutes() {
            if (this._routesConfig) {
                return this._routesConfig;
            }

            this._routesConfig =
                await Utils.loadJSON(
                    "themes/core/config/routes.json"
                );

            return this._routesConfig;
        },

        async detectPages() {
            const routes =
                await this.loadRoutes();

            const pathname =
                window.location.pathname
                    .replace(/^\/moodle/, "");

            const search =
                window.location.search;

            const url =
                pathname + search;

            const matched = [];

            for (
                const [pageId, rules]
                of Object.entries(routes)
            ) {
                for (const rule of rules) {
                    if (url.includes(rule)) {
                        matched.push({
                            pageId,
                            rule,
                            length: rule.length
                        });
                        break;
                    }
                }
            }

            matched.sort(
                (a, b) => b.length - a.length
            );

            return matched.length
                ? [matched[0].pageId]
                : [];
        },

        async resolvePageStylesheets() {
            const theme =
                await this.loadThemeConfig();

            const pages =
                await this.detectPages();

            return pages.flatMap(
                page =>
                    theme.pages?.[page] || []
            );
        },

        async resolvePageScripts() {
            const theme =
                await this.loadThemeConfig();

            const pages =
                await this.detectPages();

            return pages
                .flatMap(
                    page =>
                        theme.pageScripts?.[page] || []
                )
                .filter(Boolean);
        },

        async resolveCommonStylesheets() {
            const theme =
                await this.loadThemeConfig();

            return theme.common || [];
        },

        async resolveColorStylesheet(mode) {
            const theme =
                await this.loadThemeConfig();

            return theme.colors?.[mode] || null;
        },

        async resolveBackgroundStylesheet(mode) {
            const theme =
                await this.loadThemeConfig();

            return theme.backgrounds?.[mode] || null;
        }
    };

    ThemeBY.PageManager = PageManager;
})(window);