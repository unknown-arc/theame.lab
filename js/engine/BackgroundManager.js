(function(global) {
    "use strict";

    const ThemeBY = global.ThemeBY || (global.ThemeBY = {});
    const { Utils } = ThemeBY;

    const LINK_ATTR = "data-theme-by-background";

    const BackgroundManager = {
        currentMode: null,

        async applyMode(mode) {
            if (
                mode !== "light" &&
                mode !== "dark"
            ) {
                Utils.warn(
                    "Invalid background mode:",
                    mode
                );
                return;
            }

            const PageManager =
                ThemeBY.PageManager;

            if (
                !PageManager ||
                typeof PageManager.resolveBackgroundStylesheet !== "function"
            ) {
                Utils.warn(
                    "Background resolver unavailable"
                );
                return;
            }

            const path =
                await PageManager.resolveBackgroundStylesheet(
                    mode
                );

            if (!path) {
                this.clear();
                return;
            }

            const existing =
                document.querySelector(
                    `link[${LINK_ATTR}="${path}"]`
                );

            if (
                this.currentMode === mode &&
                existing
            ) {
                return;
            }

            this.clear();

            const link =
                document.createElement("link");

            link.rel = "stylesheet";
            link.href = Utils.assetURL(path);

            link.setAttribute(
                LINK_ATTR,
                path
            );

            link.setAttribute(
                "data-theme-type",
                "background"
            );

            (
                document.head ||
                document.documentElement
            ).appendChild(link);

            this.currentMode = mode;
        },

        clear() {
            document
                .querySelectorAll(
                    `link[${LINK_ATTR}]`
                )
                .forEach(
                    link => link.remove()
                );

            this.currentMode = null;
        }
    };

    ThemeBY.BackgroundManager = BackgroundManager;
})(window);