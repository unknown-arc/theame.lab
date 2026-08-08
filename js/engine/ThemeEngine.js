/**
 * THEME.BY — ThemeEngine
 *
 * Thin entry point that wires the engine modules together.
 */
(function (global) {
    "use strict";

    const ThemeBY =
        global.ThemeBY ||
        (global.ThemeBY = {});


    const ThemeEngine = {

        started: false,


        /**
         * Start THEME.BY.
         */
        async start() {

            if (this.started) {
                return;
            }

            this.started = true;

            try {

                /*
                 * Start the main theme manager.
                 *
                 * This handles:
                 * - enabled / disabled state
                 * - light / dark mode
                 * - ThemeLoader
                 * - CSS injection
                 */
                await ThemeBY.ThemeManager.init();


                /*
                 * Page-specific JavaScript is optional.
                 *
                 * If it fails, the main theme should
                 * continue working normally.
                 */
                try {

                    await this.loadPageScripts();

                } catch (err) {

                    ThemeBY.Utils.warn(
                        "page scripts skipped:",
                        err
                    );

                }


                ThemeBY.Utils.log(
                    "ThemeEngine started —",
                    ThemeBY.ThemeManager.state.enabled
                        ? ThemeBY.ThemeManager.state.themeMode
                        : "off"
                );


            } catch (err) {

                ThemeBY.Utils.warn(
                    "failed to start:",
                    err
                );

            }

        },


        /**
         * Load JavaScript files belonging to the
         * currently detected Moodle page.
         */
        async loadPageScripts() {

            /*
             * PageManager must exist.
             */
            if (
                !ThemeBY.PageManager ||
                typeof ThemeBY.PageManager.resolvePageScripts !== "function"
            ) {

                ThemeBY.Utils.log(
                    "No page-script loader configured"
                );

                return;

            }


            /*
             * Ask PageManager which scripts belong
             * to the current page.
             */
            const scripts =
                await ThemeBY.PageManager.resolvePageScripts();


            if (
                !Array.isArray(scripts) ||
                scripts.length === 0
            ) {

                ThemeBY.Utils.log(
                    "No page-specific scripts"
                );

                return;

            }


            /*
             * Load each script.
             */
            for (const path of scripts) {

                if (!path) {
                    continue;
                }


                /*
                 * Prevent duplicate loading.
                 */
                const existing =
                    Array.from(
                        document.querySelectorAll(
                            "script[data-theme-by-page-script]"
                        )
                    ).find(
                        script =>
                            script.getAttribute(
                                "data-theme-by-page-script"
                            ) === path
                    );


                if (existing) {
                    continue;
                }


                const script =
                    document.createElement("script");


                script.src =
                    ThemeBY.Utils.assetURL(path);


                script.setAttribute(
                    "data-theme-by-page-script",
                    path
                );


                script.async = false;


                /*
                 * Wait for the script to load.
                 */
                await new Promise((resolve, reject) => {

                    script.onload = () => {

                        ThemeBY.Utils.log(
                            "Page script loaded:",
                            path
                        );

                        resolve();

                    };


                    script.onerror = () => {

                        reject(
                            new Error(
                                `Failed to load page script: ${path}`
                            )
                        );

                    };


                    (
                        document.head ||
                        document.documentElement
                    ).appendChild(script);

                });

            }

        }

    };


    ThemeBY.ThemeEngine = ThemeEngine;

})(window);