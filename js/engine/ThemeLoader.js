(function(global){
    "use strict";

    const ThemeBY=global.ThemeBY||(global.ThemeBY={});
    const {Utils}=ThemeBY;

    const LINK_ATTR="data-theme-by";
    const SCRIPT_ATTR="data-theme-by-script";

    const ThemeLoader={
        _injected:new Set(),
        _scripts:new Set(),
        _config:null,

        async _loadConfig(){
            if(this._config)return this._config;

            this._config=await Utils.loadJSON(
                "themes/core/config/styles.json"
            );

            return this._config;
        },

        /* ---------------- CSS ---------------- */

        _injectOne(path,type="common"){
            if(!path)return;

            if(document.querySelector(
                `link[${LINK_ATTR}="${path}"]`
            )){
                this._injected.add(path);
                return;
            }

            const link=document.createElement("link");

            link.rel="stylesheet";
            link.href=Utils.assetURL(path);

            link.setAttribute(
                LINK_ATTR,
                path
            );

            link.setAttribute(
                "data-theme-type",
                type
            );

            (document.head||document.documentElement)
                .appendChild(link);

            this._injected.add(path);
        },

        _injectMany(paths=[],type="common"){
            paths.forEach(path=>{
                this._injectOne(path,type);
            });
        },

        /* ---------------- JAVASCRIPT ---------------- */

        _injectScript(path){
            if(!path)return;

            if(document.querySelector(
                `script[${SCRIPT_ATTR}="${path}"]`
            )){
                this._scripts.add(path);
                return;
            }

            const script=document.createElement("script");

            script.src=Utils.assetURL(path);
            script.async=false;

            script.setAttribute(
                SCRIPT_ATTR,
                path
            );

            (document.head||document.documentElement)
                .appendChild(script);

            this._scripts.add(path);
        },

        _injectScripts(paths=[]){
            paths.forEach(path=>{
                this._injectScript(path);
            });
        },

        /* ---------------- LOAD ---------------- */

        async load(mode="light"){
            const configPromise=this._loadConfig();

            const pageStylesPromise=
                ThemeBY.PageManager.resolvePageStylesheets();

            const pageScriptsPromise=
                ThemeBY.PageManager.resolvePageScripts();

            const [
                config,
                pageStyles,
                pageScripts
            ]=await Promise.all([
                configPromise,
                pageStylesPromise,
                pageScriptsPromise
            ]);

            this._injectMany(
                config.common,
                "common"
            );

            this._replaceColorStylesheet(
                config.colors?.[mode]
            );

            this._injectMany(
                pageStyles,
                "page"
            );

            /* Background */

            this._replaceBackgroundStylesheet(
                config.backgrounds?.[mode]
            );

            /* Page + Course JS */

            this._injectScripts(
                pageScripts
            );

            /* Login */

            if(
                location.pathname.includes("/login")&&
                config.shared?.login
            ){
                this._injectOne(
                    config.shared.login,
                    "login"
                );
            }
        },

        /* ---------------- UNLOAD ---------------- */

        unload(){
            /* Run cleanup functions */

            if(ThemeBY.cleanup){
                Object.entries(
                    ThemeBY.cleanup
                ).forEach(([name,cleanup])=>{
                    try{
                        if(typeof cleanup==="function"){
                            cleanup();
                        }
                    }catch(error){
                        console.error(
                            `Theme.BY cleanup failed: ${name}`,
                            error
                        );
                    }
                });

                ThemeBY.cleanup={};
            }

            /* Remove CSS */

            document.querySelectorAll(
                `link[${LINK_ATTR}]`
            ).forEach(link=>{
                link.remove();
            });

            this._injected.clear();

            /* Remove injected JS */

            document.querySelectorAll(
                `script[${SCRIPT_ATTR}]`
            ).forEach(script=>{
                script.remove();
            });

            this._scripts.clear();
        },

        /* ---------------- COLOR ---------------- */

        _replaceColorStylesheet(path){
            document.querySelectorAll(
                'link[data-theme-type="color"]'
            ).forEach(link=>{
                this._injected.delete(
                    link.getAttribute(LINK_ATTR)
                );

                link.remove();
            });

            if(path){
                this._injectOne(
                    path,
                    "color"
                );
            }
        },

        /* ---------------- BACKGROUND ---------------- */

        _replaceBackgroundStylesheet(path){
            document.querySelectorAll(
                'link[data-theme-type="background"]'
            ).forEach(link=>{
                this._injected.delete(
                    link.getAttribute(LINK_ATTR)
                );

                link.remove();
            });

            if(path){
                this._injectOne(
                    path,
                    "background"
                );
            }
        }
    };

    ThemeBY.ThemeLoader=ThemeLoader;

})(window);