(function() {
    "use strict";

    function initInteractiveTagCloud() {
        const viewport = document.querySelector('.block_tags .card-text.content');
        const canvas = document.querySelector('.block_tags .tag_cloud');
        
        if (!viewport || !canvas) return;

        // Auto-Resize Long Text & Disable Native Drag
        const tags = canvas.querySelectorAll('.inline-list li a');
        tags.forEach(tag => {
            tag.setAttribute('draggable', 'false'); // FIX 1: Stop ghost link dragging
            
            if (tag.innerText.trim().length > 15) {
                tag.style.setProperty('grid-column', 'span 24', 'important');
                tag.style.setProperty('grid-row', 'span 24', 'important');
                tag.style.setProperty('font-size', '11px', 'important');
            }
        });

        // Interactive Pan and Zoom Logic
        let isDragging = false;
        let hasDragged = false; // Tracks if a drag actually happened to prevent accidental clicks
        let startX, startY;
        // Auto-centers the 2400px canvas inside the viewport on load
        let translateX = (viewport.clientWidth - 2400) / 2;
        let translateY = 0;
        
        // Immediately apply the centered position
        canvas.style.transform = `translate(${translateX}px, ${translateY}px) scale(1)`;
        let scale = 1;

        const updateTransform = () => {
            canvas.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
        };

        // Scroll Wheel Zooming
        viewport.addEventListener('wheel', (e) => {
            e.preventDefault(); 
            const zoomIntensity = 0.1;
            const wheel = e.deltaY < 0 ? 1 : -1; 
            let newScale = scale * Math.exp(wheel * zoomIntensity);
            
            newScale = Math.max(0.4, Math.min(newScale, 3));

            const rect = viewport.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            const ratio = newScale / scale;
            translateX = mouseX - (mouseX - translateX) * ratio;
            translateY = mouseY - (mouseY - translateY) * ratio;
            scale = newScale;

            updateTransform();
        }, { passive: false });

        // Mouse Drag Panning
        viewport.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return; 
            isDragging = true;
            hasDragged = false; // Reset drag tracker on click down
            startX = e.clientX - translateX;
            startY = e.clientY - translateY;
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            hasDragged = true; // User actually moved the mouse, so it's a drag
            translateX = e.clientX - startX;
            translateY = e.clientY - startY;
            updateTransform();
        });

        window.addEventListener('mouseup', () => {
            isDragging = false;
        });
        
        window.addEventListener('mouseleave', () => {
            isDragging = false;
        });

        // FIX 1: Prevent the link from triggering if the user was just dragging the canvas
        canvas.addEventListener('click', (e) => {
            if (hasDragged) {
                e.preventDefault();
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initInteractiveTagCloud);
    } else {
        initInteractiveTagCloud();
    }

})();