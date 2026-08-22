(function(){
    "use strict";

    const ThemeBY=window.ThemeBY||(window.ThemeBY={});
    ThemeBY.cleanup=ThemeBY.cleanup||{};

    const SCRIPT_ID="microsoft-block";

    function initMicrosoftBlock(){
        if(document.getElementById("custom-master-container"))return true;

        const icons={
            "My Email":`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#0078d4"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/></svg>`,
            "My OneDrive":`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#0364B8"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/></svg>`,
            "Microsoft Teams":`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#464EB8"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>`,
            "Edit Settings":`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#555555"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.56-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.73 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .43-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.49-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>`,
            "Install Office":`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 23 23"><path fill="#f35325" d="M1 1h10v10H1z"/><path fill="#81bc06" d="M12 1h10v10H12z"/><path fill="#05a6f0" d="M1 12h10v10H1z"/><path fill="#ffba08" d="M12 12h10v10H12z"/></svg>`
        };

        let blockContainer=null;
        const rightSide=document.createElement("div");
        rightSide.id="custom-right-side";

        document.querySelectorAll("a").forEach(link=>{
            const text=link.innerText.trim();

            const matchedKey=Object.keys(icons).find(
                key=>key.toLowerCase()===text.toLowerCase()
            );

            if(!matchedKey)return;

            if(!blockContainer){
                blockContainer=link.closest(".card-body")||link.parentNode;
            }

            const btn=document.createElement("button");

            btn.innerHTML=`
                ${icons[matchedKey]}
                <span>${text}</span>
            `;

            btn.addEventListener("click",e=>{
                e.preventDefault();

                if(link.href){
                    window.open(link.href,"_blank");
                }else{
                    link.click();
                }
            });

            rightSide.appendChild(btn);

            link.dataset.themeByOriginalDisplay=link.style.display;
            link.style.display="none";
        });

        if(!blockContainer)return false;

        const masterContainer=document.createElement("div");
        masterContainer.id="custom-master-container";

        const layoutWrapper=document.createElement("div");
        layoutWrapper.id="custom-layout-wrapper";

        blockContainer.querySelectorAll("*").forEach(el=>{
            if(
                el!==blockContainer&&
                el.tagName!=="A"&&
                el.childNodes.length>0&&
                el.textContent.includes("connected to Microsoft 365")
            ){
                el.dataset.themeByOriginalDisplay=el.style.display;
                el.style.display="none";
            }
        });

        const profileImg=blockContainer.querySelector("img");

        if(profileImg){
            profileImg.id="custom-profile-img";

            const leftSide=document.createElement("div");
            leftSide.id="custom-left-side";

            leftSide.appendChild(
                profileImg.closest("a")||profileImg
            );

            layoutWrapper.appendChild(leftSide);
        }

        layoutWrapper.appendChild(rightSide);
        masterContainer.appendChild(layoutWrapper);

        const statusText=document.createElement("div");

        statusText.id="custom-status-text";

        statusText.innerHTML=
            `You are currently <span class="status-highlight">connected</span> to Microsoft 365`;

        masterContainer.appendChild(statusText);
        blockContainer.appendChild(masterContainer);

        return true;
    }

    function waitForMicrosoftBlock(){
        if(initMicrosoftBlock())return;

        const observer=new MutationObserver(()=>{
            if(initMicrosoftBlock()){
                observer.disconnect();
            }
        });

        observer.observe(document.documentElement,{
            childList:true,
            subtree:true
        });

        ThemeBY.cleanup[SCRIPT_ID]=()=>{
            observer.disconnect();

            document
                .getElementById("custom-master-container")
                ?.remove();

            document
                .querySelectorAll("[data-theme-by-original-display]")
                .forEach(el=>{
                    el.style.display=
                        el.dataset.themeByOriginalDisplay;

                    delete el.dataset.themeByOriginalDisplay;
                });
        };
    }

    waitForMicrosoftBlock();

})();