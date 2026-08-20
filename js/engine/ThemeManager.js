(function(global) {
    "use strict";

    const ThemeBY = global.ThemeBY || (global.ThemeBY = {});
    const {
        Utils,
        StorageManager,
        ColorManager,
        BackgroundManager,
        ThemeLoader
    } = ThemeBY;

    const ThemeManager = {
        state: {
            enabled: true,
            themeMode: "light"
        },

        async apply(settings) {
            const enabled =
                settings.enabled ?? this.state.enabled;

            const themeMode =
                settings.themeMode ?? this.state.themeMode;

            this.state = {
                enabled,
                themeMode
            };

            if (!enabled) {
                ColorManager.clear();
                BackgroundManager.clear();
                ThemeLoader.unload();
                return;
            }

            ColorManager.applyMode(themeMode);
            await ThemeLoader.load(themeMode);
            await BackgroundManager.applyMode(themeMode);
        },

        async init() {
            const settings =
                await StorageManager.get();

            await this.apply(settings);

            StorageManager.onChange(async partial => {
                await this.apply({
                    enabled:
                        partial.enabled ?? this.state.enabled,
                    themeMode:
                        partial.themeMode ?? this.state.themeMode
                });
            });

            StorageManager.onMessage(async partial => {
                await this.apply({
                    enabled:
                        partial.enabled ?? this.state.enabled,
                    themeMode:
                        partial.themeMode ?? this.state.themeMode
                });
            });

            Utils.log(
                "ready —",
                this.state.enabled
                    ? this.state.themeMode
                    : "off"
            );
        }
    };

    ThemeBY.ThemeManager = ThemeManager;
})(window);