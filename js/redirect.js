(function(){
    "use strict";

    const ThemeBY=window.ThemeBY||(window.ThemeBY={});
    ThemeBY.cleanup=ThemeBY.cleanup||{};

    const targets=[
        "https://cet.iitp.ac.in/",
        "https://library.iitp.ac.in/"
    ];

    function processLinks(root=document){
        const links=[];

        if(root.nodeType===1&&root.matches?.("a[href]")){
            links.push(root);
        }

        root.querySelectorAll?.("a[href]").forEach(link=>{
            links.push(link);
        });

        links.forEach(link=>{
            if(!targets.includes(link.href))return;

            if(!link.dataset.themeByRedirect){
                link.dataset.themeByOriginalTarget=
                    link.getAttribute("target")||"";

                link.dataset.themeByOriginalRel=
                    link.getAttribute("rel")||"";

                link.dataset.themeByRedirect="true";
            }

            link.target="_blank";
            link.rel="noopener noreferrer";
        });
    }

    /* Process existing links */
    processLinks();

    /* Process links Moodle adds later */
    const observer=new MutationObserver(mutations=>{
        mutations.forEach(mutation=>{
            mutation.addedNodes.forEach(node=>{
                if(node.nodeType===1){
                    processLinks(node);
                }
            });
        });
    });

    observer.observe(document.documentElement,{
        childList:true,
        subtree:true
    });

    /* Cleanup when THEME.BY turns OFF */
    ThemeBY.cleanup.redirectLinks=()=>{
        observer.disconnect();

        document
            .querySelectorAll('[data-theme-by-redirect="true"]')
            .forEach(link=>{
                const target=
                    link.dataset.themeByOriginalTarget;

                const rel=
                    link.dataset.themeByOriginalRel;

                if(target){
                    link.setAttribute("target",target);
                }else{
                    link.removeAttribute("target");
                }

                if(rel){
                    link.setAttribute("rel",rel);
                }else{
                    link.removeAttribute("rel");
                }

                delete link.dataset.themeByRedirect;
                delete link.dataset.themeByOriginalTarget;
                delete link.dataset.themeByOriginalRel;
            });
    };
})();