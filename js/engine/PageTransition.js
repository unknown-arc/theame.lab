(function() {
    // Inject style block without any blur filters
    const styleBlock = document.createElement('style');
    styleBlock.id = 'instant-flicker-fix';
    styleBlock.textContent = `
        html, body {
            opacity: 0 !important;
            background-color: #f5f5f7 !important;
            transition: opacity 0.3s ease-in-out !important;
        }
        body.page-ready {
            opacity: 1 !important;
        }
    `;
    document.documentElement.appendChild(styleBlock);

    // Reveal the page smoothly with just a clean fade-in
    function revealPage() {
        requestAnimationFrame(() => {
            document.body.classList.add('page-ready');
            setTimeout(() => {
                const fixer = document.getElementById('instant-flicker-fix');
                if (fixer) fixer.remove();
            }, 350);
        });
    }

    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', revealPage);
    } else {
        revealPage();
    }
})();