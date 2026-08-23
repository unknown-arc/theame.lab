(function() {
    "use strict";

    // Upgrades Moodle's default 35x35 profile images to 100x100 high-quality versions
    function upgradeProfileImages() {
        const avatars = document.querySelectorAll('.block_online_users img, aside[data-block="online_users"] img');
        
        avatars.forEach(img => {
            let src = img.getAttribute('src');
            // Check if the image source contains the low-res 'f2' indicator
            if (src && (src.includes('/f2') || src.includes('f2.jpg') || src.includes('f2.png'))) {
                // Swap 'f2' to 'f1' to fetch the 100x100 version
                let highResSrc = src.replace(/\/f2\b/g, '/f1').replace(/f2\.(jpg|png)/g, 'f1.$1');
                img.setAttribute('src', highResSrc);
            }
        });
    }

    // Run on initial page load
    upgradeProfileImages();

    // Moodle sometimes reloads blocks via AJAX, so we watch for changes and upgrade new images
    const observer = new MutationObserver(() => {
        upgradeProfileImages();
    });

    const onlineUsersBlock = document.querySelector('.block_online_users, aside[data-block="online_users"]');
    if (onlineUsersBlock) {
        observer.observe(onlineUsersBlock, { childList: true, subtree: true });
    }
})();