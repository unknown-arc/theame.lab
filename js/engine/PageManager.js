(function (global) {
    "use strict";

    const ThemeBY =
        global.ThemeBY ||
        (global.ThemeBY = {});

    const { Utils } = ThemeBY;


    const PageManager = {

        _themeConfig: null,
        _routesConfig: null,


        /*
         * ------------------------------------------------------
         * Load theme.json
         * ------------------------------------------------------
         */

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


        /*
         * ------------------------------------------------------
         * Load routes.json
         * ------------------------------------------------------
         */

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


        /*
         * ------------------------------------------------------
         * Detect current Moodle page
         * ------------------------------------------------------
         */

        async detectPages() {

            const routes =
                await this.loadRoutes();


            /*
             * Convert:
             *
             * /moodle/my/courses.php
             *
             * into:
             *
             * /my/courses.php
             */
            const pathname =
                window.location.pathname
                    .replace(/^\/moodle/, "");


            const search =
                window.location.search;


            const url =
                pathname + search;


            const matched = [];


            /*
             * Check every route.
             */
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


            /*
             * Most specific route first.
             */
            matched.sort(
                (a, b) => b.length - a.length
            );

            const pages = matched.length
                ? [matched[0].pageId]
                : [];

            Utils.log(
                "Current URL:",
                url
            );

            Utils.log(
                "Matched page:",
                pages
            );

            return pages;
        },


        /*
         * ------------------------------------------------------
         * Resolve page CSS
         * ------------------------------------------------------
         */

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


        /*
         * ------------------------------------------------------
         * Resolve page JavaScript
         * ------------------------------------------------------
         */

        async resolvePageScripts() {

            const theme =
                await this.loadThemeConfig();


            const pages =
                await this.detectPages();


            return pages.flatMap(
                page =>
                    theme.pageScripts?.[page] || []
            ).filter(Boolean);
        },


        /*
         * ------------------------------------------------------
         * Resolve common CSS
         * ------------------------------------------------------
         */

        async resolveCommonStylesheets() {

            const theme =
                await this.loadThemeConfig();


            return theme.common || [];
        },


        /*
         * ------------------------------------------------------
         * Resolve Light / Dark CSS
         * ------------------------------------------------------
         */

        async resolveColorStylesheet(mode) {

            const theme =
                await this.loadThemeConfig();


            /*
             * Supports:
             *
             * "colors": {
             *     "light": "...",
             *     "dark": "..."
             * }
             */
            return theme.colors?.[mode] || null;
        }

    };


    ThemeBY.PageManager =
        PageManager;

})(window);