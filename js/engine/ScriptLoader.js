(function(global){
    "use strict";

    const ThemeBY=global.ThemeBY||(global.ThemeBY={});
    const {Utils}=ThemeBY;
    const SCRIPT_ATTR="data-theme-by-script";

    const ScriptLoader={
        _config:null,
        _loaded:new Set(),

        async _loadConfig(){
            if(this._config)return this._config;
            this._config=await Utils.loadJSON("themes/core/config/scripts.json");
            return this._config;
        },

        _getCurrentPage(){
            if(!ThemeBY.PageManager)return null;

            if(typeof ThemeBY.PageManager.getCurrentPage==="function"){
                return ThemeBY.PageManager.getCurrentPage();
            }

            if(typeof ThemeBY.PageManager.detectPage==="function"){
                return ThemeBY.PageManager.detectPage();
            }

            return ThemeBY.PageManager.currentPage||null;
        },

        async _injectOne(path){
            if(!path||this._loaded.has(path))return;

            const existing=document.querySelector(`script[${SCRIPT_ATTR}="${path}"]`);

            if(existing){
                this._loaded.add(path);
                return;
            }

            const script=document.createElement("script");
            script.src=Utils.assetURL(path);
            script.setAttribute(SCRIPT_ATTR,path);
            script.async=false;

            await new Promise((resolve,reject)=>{
                script.onload=()=>{
                    this._loaded.add(path);
                    Utils.log("Theme script loaded:",path);
                    resolve();
                };

                script.onerror=()=>{
                    Utils.warn("Failed to load theme script:",path);
                    script.remove();
                    reject(new Error(`Failed to load: ${path}`));
                };

                (document.head||document.documentElement).appendChild(script);
            });
        },

        async _injectMany(paths=[]){
            for(const path of paths){
                await this._injectOne(path);
            }
        },

        async load(){
            const config=await this._loadConfig();
            const page=this._getCurrentPage();

            await this._injectMany(config.common||[]);

            if(page){
                await this._injectMany(config.pages?.[page]||[]);
            }

            Utils.log("Scripts loaded for page:",page||"unknown");
        },

        unload(){
            document.querySelectorAll(`script[${SCRIPT_ATTR}]`).forEach(script=>script.remove());
            this._loaded.clear();
        },

        async reload(){
            this.unload();
            await this.load();
        }
    };

    ThemeBY.ScriptLoader=ScriptLoader;
})(window);