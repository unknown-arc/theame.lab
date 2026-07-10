function applyTheme(mode) {
    document.documentElement.classList.remove('moodle-apple-pro-light', 'moodle-apple-pro-dark');
    if (mode === 'light') document.documentElement.classList.add('moodle-apple-pro-light');
    if (mode === 'dark') document.documentElement.classList.add('moodle-apple-pro-dark');
}

// Ensure style is applied as early as possible
if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    chrome.storage.local.get("themeMode", (data) => {
        applyTheme(data.themeMode || "light"); // Defaults to light
    });
}

// Listen for popup messages to update live
chrome.runtime.onMessage.addListener((request) => {
    if (request.action === "updateTheme") applyTheme(request.mode);
});