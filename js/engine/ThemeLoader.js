(function(global){
    "use strict";

    const ThemeBY=global.ThemeBY||(global.ThemeBY={});
    const {Utils}=ThemeBY;
    const LINK_ATTR="data-theme-by";

    const ThemeLoader={
        _injected:new Set(),
        _config:null,

        async _loadConfig(){
            if(this._config)return this._config;
            this._config=await Utils.loadJSON("themes/core/config/styles.json");
            return this._config;
        },

        _injectOne(path,type="common"){
            if(!path)return;

            if(document.querySelector(`link[${LINK_ATTR}="${path}"]`)){
                this._injected.add(path);
                return;
            }

            const link=document.createElement("link");
            link.rel="stylesheet";
            link.href=Utils.assetURL(path);
            link.setAttribute(LINK_ATTR,path);
            link.setAttribute("data-theme-type",type);

            (document.head||document.documentElement).appendChild(link);
            this._injected.add(path);
        },

        _injectMany(paths=[],type="common"){
            paths.forEach(path=>this._injectOne(path,type));
        },

        async load(mode="light"){
            const config=await this._loadConfig();

            this._injectMany(config.common,"common");
            this._replaceColorStylesheet(config.colors?.[mode]);

            const pageStyles=await ThemeBY.PageManager.resolvePageStylesheets();
            this._injectMany(pageStyles,"page");

            if(location.pathname.includes("/login")&&config.shared?.login){
                this._injectOne(config.shared.login,"login");
            }
        },

        unload(){
            document.querySelectorAll(`link[${LINK_ATTR}]`).forEach(link=>link.remove());
            this._injected.clear();
        },

        _replaceColorStylesheet(path){
            if(!path)return;

            document.querySelectorAll('link[data-theme-type="color"]').forEach(link=>{
                this._injected.delete(link.getAttribute(LINK_ATTR));
                link.remove();
            });

            this._injectOne(path,"color");
        }
    };

    ThemeBY.ThemeLoader=ThemeLoader;
})(window);