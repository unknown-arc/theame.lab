/**
 * THEME.BY — ThemeManager
 * High-level orchestrator: reads persisted settings, applies/removes the
 * theme, and keeps everything in sync when the popup changes settings.
 */
(function (global) {
  "use strict";

  const ThemeBY = global.ThemeBY || (global.ThemeBY = {});
  const { Utils, StorageManager, ColorManager, ThemeLoader } = ThemeBY;

  const ThemeManager = {
    state: { enabled: true, themeMode: "light" },

    /** Apply (or remove) the theme based on the given settings. */
    apply({ enabled, themeMode }) {
      this.state = { enabled, themeMode };

      if (!enabled) {
        ColorManager.clear();
        ThemeLoader.unload();
        return;
      }

      ColorManager.applyMode(themeMode);
      ThemeLoader.load(themeMode);
    },

    /** Bootstrap: load saved settings, apply them, then start listening. */
    async init() {
      const settings = await StorageManager.get();
      this.apply(settings);

      StorageManager.onChange((partial) => {
        this.apply({
          enabled: partial.enabled ?? this.state.enabled,
          themeMode: partial.themeMode ?? this.state.themeMode,
        });
      });

      StorageManager.onMessage((partial) => {
        this.apply({
          enabled: partial.enabled ?? this.state.enabled,
          themeMode: partial.themeMode ?? this.state.themeMode,
        });
      });

      Utils.log("ready —", this.state.enabled ? this.state.themeMode : "off");
    },
  };

  ThemeBY.ThemeManager = ThemeManager;
})(window);
