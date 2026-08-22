/**
 * THEME.BY — content.js
 */
(function(){
    "use strict";

    if(!window.ThemeBY||!window.ThemeBY.ThemeEngine){
        console.warn("[THEME.BY] engine modules missing — theme not applied.");
        return;
    }

    const ThemeBY=window.ThemeBY;

    function startTheme(){
        ThemeBY.ThemeEngine.start();
    }

    function stopTheme(){
        ThemeBY.ThemeLoader?.unload();
    }

    chrome.storage.local.get(["enabled"],({enabled})=>{
        if(enabled!==false){
            startTheme();
        }
    });

    chrome.storage.onChanged.addListener((changes,area)=>{
        if(area!=="local"||!changes.enabled)return;

        const enabled=changes.enabled.newValue;

        if(enabled){
            startTheme();
        }else{
            stopTheme();

            setTimeout(()=>{
                window.location.reload();
            },50);
        }
    });
})();