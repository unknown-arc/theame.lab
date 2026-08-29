
(function(){
    "use strict";

    const ThemeBY=window.ThemeBY||(window.ThemeBY={});
    ThemeBY.cleanup=ThemeBY.cleanup||{};

    const SCRIPT_ID="microsoft-block";
    const RETRY_DELAY=1000;

    let timer=null;
    let stopped=false;
    let attempts=0;

    const icons={
        "my email":`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#0078d4"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/></svg>`,

        "my onedrive":`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#0364B8"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/></svg>`,

        "microsoft teams":`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#464EB8"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-3-3.5-7-3.5z"/></svg>`,

        "edit settings":`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#555" viewBox="0 0 16 16"><path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"/></svg>`,
        
        "install office":`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 23 23"><path fill="#f35325" d="M1 1h10v10H1z"/><path fill="#81bc06" d="M12 1h10v10H12z"/><path fill="#05a6f0" d="M1 12h10v10H1z"/><path fill="#ffba08" d="M12 12h10v10H12z"/></svg>`
    };

    const keys=Object.keys(icons);

    function findMicrosoftLink(){
        const links=document.getElementsByTagName("a");

        for(let i=0;i<links.length;i++){
            const text=links[i].textContent.trim().toLowerCase();

            if(keys.includes(text)){
                return links[i];
            }
        }

        return null;
    }

    function initMicrosoftBlock(){
        if(stopped)return true;

        if(document.getElementById("custom-master-container")){
            return true;
        }

        const firstLink=findMicrosoftLink();

        if(!firstLink){
            return false;
        }

        const blockContainer=
            firstLink.closest(".card-body")||
            firstLink.parentElement;

        if(!blockContainer){
            return false;
        }

        console.log(
            "[THEME.BY] Microsoft block found"
        );

        const rightSide=
            document.createElement("div");

        rightSide.id="custom-right-side";

        const links=
            blockContainer.getElementsByTagName("a");

        for(let i=0;i<links.length;i++){
            const link=links[i];
            const text=link.textContent.trim();
            const key=text.toLowerCase();

            if(!icons[key])continue;

            const btn=
                document.createElement("button");

            btn.innerHTML=
                `${icons[key]}<span>${text}</span>`;

            btn.addEventListener("click",e=>{
                e.preventDefault();

                if(link.href){
                    window.open(
                        link.href,
                        "_blank"
                    );
                }else{
                    link.click();
                }
            });

            rightSide.appendChild(btn);

            link.dataset.themeByOriginalDisplay=
                link.style.display;

            link.style.display="none";
        }

        const masterContainer=
            document.createElement("div");

        masterContainer.id=
            "custom-master-container";

        const layoutWrapper=
            document.createElement("div");

        layoutWrapper.id=
            "custom-layout-wrapper";

        const children=
            blockContainer.children;

        for(let i=0;i<children.length;i++){
            const el=children[i];

            if(
                el.textContent.includes(
                    "connected to Microsoft 365"
                )
            ){
                el.dataset.themeByOriginalDisplay=
                    el.style.display;

                el.style.display="none";
            }
        }

        const profileImg=
            blockContainer.querySelector("img");

        if(profileImg){
            profileImg.id=
                "custom-profile-img";

            const leftSide=
                document.createElement("div");

            leftSide.id=
                "custom-left-side";

            const profileLink=
                profileImg.closest("a");

            leftSide.appendChild(
                profileLink||profileImg
            );

            layoutWrapper.appendChild(
                leftSide
            );
        }

        layoutWrapper.appendChild(
            rightSide
        );

        masterContainer.appendChild(
            layoutWrapper
        );

        const statusText=
            document.createElement("div");

        statusText.id=
            "custom-status-text";

        statusText.innerHTML=
            `You are currently <span class="status-highlight">connected</span> to Microsoft 365`;

        masterContainer.appendChild(
            statusText
        );

        blockContainer.appendChild(
            masterContainer
        );

        stopped=true;

        console.log(
            `[THEME.BY] Microsoft block initialized successfully after ${attempts} attempt(s)`
        );

        return true;
    }

    function tryFind(){
        if(stopped)return;

        attempts++;

        console.log(
            `[THEME.BY] Microsoft check #${attempts}`
        );

        if(initMicrosoftBlock()){
            stopRetry();
            return;
        }

        timer=setTimeout(
            tryFind,
            RETRY_DELAY
        );
    }

    function stopRetry(){
        if(timer!==null){
            clearTimeout(timer);
            timer=null;
        }
    }

    function start(){
        tryFind();
    }

    ThemeBY.cleanup[SCRIPT_ID]=()=>{
        stopped=true;

        stopRetry();

        document
            .getElementById(
                "custom-master-container"
            )
            ?.remove();

        document
            .querySelectorAll(
                "[data-theme-by-original-display]"
            )
            .forEach(el=>{
                el.style.display=
                    el.dataset.themeByOriginalDisplay;

                delete el.dataset
                    .themeByOriginalDisplay;
            });

        delete ThemeBY.cleanup[SCRIPT_ID];

        console.log(
            "[THEME.BY] Microsoft block cleanup"
        );
    };

    start();

})();