(function(global){
    "use strict";

    const ThemeBY=global.ThemeBY||(global.ThemeBY={});
    const {Utils}=ThemeBY;

    const PageManager={
        _themeConfig:null,
        _scriptConfig:null,
        _routesConfig:null,
        _courseCodesReady:false,

        async loadThemeConfig(){
            if(this._themeConfig)return this._themeConfig;

            this._themeConfig=await Utils.loadJSON(
                "themes/core/config/styles.json"
            );

            return this._themeConfig;
        },

        async loadScriptConfig(){
            if(this._scriptConfig)return this._scriptConfig;

            this._scriptConfig=await Utils.loadJSON(
                "themes/core/config/scripts.json"
            );

            return this._scriptConfig;
        },

        async loadRoutes(){
            if(this._routesConfig)return this._routesConfig;

            this._routesConfig=await Utils.loadJSON(
                "shared/routes/routes.json"
            );

            return this._routesConfig;
        },

        /* ---------------------------------------------------
           COURSE CODE DETECTION
           --------------------------------------------------- */

        detectCourseCodes(){
            if(this._courseCodesReady)return;

            const courseLinks=document.querySelectorAll(
                ".block_course_list .card-text a,.block_course_list .footer a"
            );

            courseLinks.forEach(link=>{
                const text=link.getAttribute("title")||
                           link.innerText||
                           "";

                let extractedCode="COURSE";
                const lower=text.toLowerCase();

                if(
                    lower.includes("mock")||
                    lower.includes("mk")
                ){
                    extractedCode="MOCK";
                }
                else if(lower.includes("all")){
                    extractedCode="ALL";
                }
                else{
                    const match=text.match(/\b\d{3}\b/);

                    if(match){
                        extractedCode=match[0];
                    }
                }

                link.setAttribute(
                    "data-course-code",
                    extractedCode
                );
            });

            this._courseCodesReady=true;
        },

        getCourseCodes(){
            this.detectCourseCodes();

            const codes=new Set();

            document
                .querySelectorAll(
                    ".block_course_list [data-course-code]"
                )
                .forEach(link=>{
                    const code=link.getAttribute(
                        "data-course-code"
                    );

                    if(code){
                        codes.add(code);
                    }
                });

            return [...codes];
        },

        /* ---------------------------------------------------
           PAGE DETECTION
           --------------------------------------------------- */

        async detectPages(){
            const routes=await this.loadRoutes();

            const pathname=window.location.pathname
                .replace(/^\/moodle/,"");

            const search=window.location.search;
            const url=pathname+search;

            const matched=[];

            for(const [pageId,rules] of Object.entries(routes)){
                for(const rule of rules){
                    if(url.includes(rule)){
                        matched.push({
                            pageId,
                            rule,
                            length:rule.length
                        });

                        break;
                    }
                }
            }

            matched.sort(
                (a,b)=>b.length-a.length
            );

            return matched.length
                ?[matched[0].pageId]
                :[];
        },

        /* ---------------------------------------------------
           PAGE STYLES
           --------------------------------------------------- */

        async resolvePageStylesheets(){
            const theme=await this.loadThemeConfig();
            const pages=await this.detectPages();

            return pages.flatMap(
                page=>theme.pages?.[page]||[]
            );
        },

        /* ---------------------------------------------------
           PAGE SCRIPTS
           --------------------------------------------------- */

        async resolvePageScripts(){
            const scripts=await this.loadScriptConfig();
            const pages=await this.detectPages();

            const commonScripts=scripts.common||[];

            const pageScripts=pages.flatMap(
                page=>scripts.pages?.[page]||[]
            );

            this.detectCourseCodes();

            const courseCodes=this.getCourseCodes();

            const courseScripts=courseCodes.flatMap(
                code=>scripts.courses?.[code]||[]
            );

            return [
                ...commonScripts,
                ...pageScripts,
                ...courseScripts
            ].filter(Boolean);
        },

        /* ---------------------------------------------------
           COMMON STYLES
           --------------------------------------------------- */

        async resolveCommonStylesheets(){
            const theme=await this.loadThemeConfig();

            return theme.common||[];
        },

        /* ---------------------------------------------------
           LIGHT / DARK THEME
           --------------------------------------------------- */

        async resolveColorStylesheet(mode){
            const theme=await this.loadThemeConfig();

            return theme.colors?.[mode]||null;
        },

        /* ---------------------------------------------------
           LIGHT / DARK BACKGROUND
           --------------------------------------------------- */

        async resolveBackgroundStylesheet(mode){
            const theme=await this.loadThemeConfig();

            return theme.backgrounds?.[mode]||null;
        }
    };

    ThemeBY.PageManager=PageManager;

})(window);