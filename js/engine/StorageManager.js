(function(global) {
    "use strict";

    const ThemeBY = global.ThemeBY || (global.ThemeBY = {});

    const DEFAULTS = {
        enabled: true,
        themeMode: "light"
    };

    const StorageManager = {
        defaults: DEFAULTS,

        get() {
            return new Promise(resolve => {
                chrome.storage.local.get(
                    ["enabled", "themeMode"],
                    data => {
                        resolve({
                            enabled:
                                data.enabled ??
                                DEFAULTS.enabled,

                            themeMode:
                                data.themeMode ??
                                DEFAULTS.themeMode
                        });
                    }
                );
            });
        },

        set(patch) {
            return new Promise(resolve => {
                chrome.storage.local.set(
                    patch,
                    resolve
                );
            });
        },

        onChange(callback) {
            chrome.storage.onChanged.addListener(
                (changes, area) => {
                    if (area !== "local") return;

                    if (
                        !("enabled" in changes) &&
                        !("themeMode" in changes)
                    ) {
                        return;
                    }

                    callback({
                        enabled:
                            changes.enabled
                                ? changes.enabled.newValue
                                : undefined,

                        themeMode:
                            changes.themeMode
                                ? changes.themeMode.newValue
                                : undefined
                    });
                }
            );
        },

        onMessage(callback) {
            chrome.runtime.onMessage.addListener(
                (msg, _sender, sendResponse) => {
                    if (
                        !msg ||
                        msg.action !== "updateTheme"
                    ) {
                        return;
                    }

                    callback({
                        enabled: msg.enabled,
                        themeMode: msg.themeMode
                    });

                    sendResponse({
                        ok: true
                    });
                }
            );
        }
    };

    ThemeBY.StorageManager = StorageManager;
})(window);