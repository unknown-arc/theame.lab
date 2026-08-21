(function(global){
    "use strict";

    const ThemeBY=global.ThemeBY||(global.ThemeBY={});

    const ThemeEngine={
        started:false,

        async start(){
            if(this.started)return;

            this.started=true;

            try{
                await ThemeBY.ThemeManager.init();

                try{
                    await this.loadPageScripts();
                }catch(err){
                    ThemeBY.Utils.warn("page scripts skipped:",err);
                }

                ThemeBY.Utils.log(
                    "ThemeEngine started —",
                    ThemeBY.ThemeManager.state.enabled
                        ?ThemeBY.ThemeManager.state.themeMode
                        :"off"
                );
            }catch(err){
                this.started=false;
                ThemeBY.Utils.warn("failed to start:",err);
            }
        },

        async loadPageScripts(){
            if(
                !ThemeBY.PageManager||
                typeof ThemeBY.PageManager.resolvePageScripts!=="function"
            ){
                ThemeBY.Utils.log("No page-script loader configured");
                return;
            }

            const scripts=await ThemeBY.PageManager.resolvePageScripts();

            if(!Array.isArray(scripts)||scripts.length===0){
                ThemeBY.Utils.log("No page-specific scripts");
                return;
            }

            for(const path of scripts){
                if(!path)continue;

                const existing=Array.from(
                    document.querySelectorAll(
                        "script[data-theme-by-page-script]"
                    )
                ).find(
                    script=>
                        script.getAttribute(
                            "data-theme-by-page-script"
                        )===path
                );

                if(existing)continue;

                const script=document.createElement("script");
                script.src=ThemeBY.Utils.assetURL(path);
                script.setAttribute(
                    "data-theme-by-page-script",
                    path
                );
                script.async=false;

                await new Promise((resolve,reject)=>{
                    script.onload=()=>{
                        ThemeBY.Utils.log(
                            "Page script loaded:",
                            path
                        );
                        resolve();
                    };

                    script.onerror=()=>{
                        script.remove();
                        reject(
                            new Error(
                                `Failed to load page script: ${path}`
                            )
                        );
                    };

                    (
                        document.head||
                        document.documentElement
                    ).appendChild(script);
                });
            }
        }
    };

    ThemeBY.ThemeEngine=ThemeEngine;
})(window);