(function(){
    "use strict";

    const ThemeBY=window.ThemeBY||(window.ThemeBY={});
    ThemeBY.cleanup=ThemeBY.cleanup||{};

    const CLEANUP_ID="navbarGlider";
    let observer=null;
    let initialized=false;

    function initNavGlider(){
        if(initialized)return true;

        const nav=document.querySelector(
            "nav.navbar.fixed-top .navbar-nav"
        );

        if(!nav)return false;

        if(nav.querySelector(".nav-glider")){
            initialized=true;
            return true;
        }

        initialized=true;

        const glider=document.createElement("div");
        glider.className="nav-glider";
        nav.appendChild(glider);

        const links=nav.querySelectorAll(".nav-link");

        let activeLink=nav.querySelector(
            ".nav-link.active"
        );

        function moveGlider(target){
            if(!target)return;

            const parentItem=target.closest(".nav-item");

            if(!parentItem)return;

            const items=[
                ...nav.querySelectorAll(".nav-item")
            ];

            const itemIndex=items.indexOf(parentItem);

            /* Hide for CET-IIT Patna and Central Library */

            if(itemIndex===3||itemIndex===4){
                glider.style.opacity="0";
                return;
            }

            const navRect=nav.getBoundingClientRect();
            const linkRect=target.getBoundingClientRect();

            const barWidth=24;

            const offsetLeft=
                linkRect.left-
                navRect.left+
                (linkRect.width/2)-
                (barWidth/2);

            glider.style.opacity="1";
            glider.style.width=`${barWidth}px`;
            glider.style.transform=
                `translateX(${offsetLeft}px)`;
        }

        function handleMouseEnter(e){
            moveGlider(e.currentTarget);
        }

        function handleMouseLeave(){
            activeLink=nav.querySelector(
                ".nav-link.active"
            );

            if(activeLink){
                moveGlider(activeLink);
            }else{
                glider.style.opacity="0";
            }
        }

        function handleResize(){
            activeLink=nav.querySelector(
                ".nav-link.active"
            );

            if(activeLink){
                moveGlider(activeLink);
            }
        }

        links.forEach(link=>{
            link.addEventListener(
                "mouseenter",
                handleMouseEnter
            );
        });

        nav.addEventListener(
            "mouseleave",
            handleMouseLeave
        );

        window.addEventListener(
            "resize",
            handleResize
        );

        requestAnimationFrame(()=>{
            activeLink=nav.querySelector(
                ".nav-link.active"
            );

            if(activeLink){
                moveGlider(activeLink);
            }
        });

        ThemeBY.cleanup[CLEANUP_ID]=()=>{
            links.forEach(link=>{
                link.removeEventListener(
                    "mouseenter",
                    handleMouseEnter
                );
            });

            nav.removeEventListener(
                "mouseleave",
                handleMouseLeave
            );

            window.removeEventListener(
                "resize",
                handleResize
            );

            glider.remove();

            initialized=false;

            if(observer){
                observer.disconnect();
                observer=null;
            }
        };

        return true;
    }

    /* Try immediately */

    if(initNavGlider())return;

    /* Moodle may create the navbar later */

    observer=new MutationObserver(()=>{
        if(initNavGlider()&&observer){
            observer.disconnect();
            observer=null;
        }
    });

    observer.observe(document.documentElement,{
        childList:true,
        subtree:true
    });

})();