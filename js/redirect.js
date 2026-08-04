(function() {
    function openExternalLinks() {
        document.querySelectorAll('a').forEach(link => {
            const text = link.textContent.trim();
            const href = link.getAttribute('href') || '';
            
            // Match by visible text or specific external domains/paths
            if (
                text === "CET-IIT Patna" || 
                text === "Central Library" || 
                href.includes("cet.iitp.ac.in/") && href !== window.location.href && !href.includes("moodle") ||
                href.includes("library.iitp.ac.in")
            ) {
                if (link.getAttribute('target') !== '_blank') {
                    link.setAttribute('target', '_blank');
                    link.setAttribute('rel', 'noopener noreferrer');
                }
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', openExternalLinks);
    } else {
        openExternalLinks();
    }

    const observer = new MutationObserver(openExternalLinks);
    observer.observe(document.body || document.documentElement, { childList: true, subtree: true });
})();