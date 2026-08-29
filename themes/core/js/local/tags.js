(function() {
    "use strict";

    function initInteractiveTagCloud() {
        const viewport = document.querySelector('.block_tags .card-text.content');
        const canvas = document.querySelector('.block_tags .tag_cloud');
        
        if (!viewport || !canvas) return;

        // Auto-Resize Long Text & Disable Native Drag
        const tags = canvas.querySelectorAll('.inline-list li a');
        tags.forEach(tag => {
            tag.setAttribute('draggable', 'false'); 
            
            if (tag.innerText.trim().length > 15) {
                tag.style.setProperty('grid-column', 'span 24', 'important');
                tag.style.setProperty('grid-row', 'span 24', 'important');
                tag.style.setProperty('font-size', '11px', 'important');
            }
        });

        // Interactive Pan and Zoom Logic
        let isDragging = false;
        let hasDragged = false; 
        let startX, startY;
        let scale = 1;
        
        // NEW: Dynamically calculate true center based on actual content size, not a hardcoded 2400px
        let translateX = (viewport.clientWidth - canvas.scrollWidth) / 2;
        let translateY = (viewport.clientHeight - canvas.scrollHeight) / 2;
        
        const MIN_SCALE = 0.4;
        const MAX_SCALE = 3;

        const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

        const updateTransform = () => {
            // NEW: Use scrollWidth/scrollHeight because wrapping text might cause overflow
            const currentWidth = canvas.scrollWidth * scale;
            const currentHeight = canvas.scrollHeight * scale;

            // Safe margins
            const safeX = 150; 
            const safeY = 100;

            // Clamp the translation 
            translateX = clamp(translateX, -currentWidth + safeX, viewport.clientWidth - safeX);
            translateY = clamp(translateY, -currentHeight + safeY, viewport.clientHeight - safeY);

            // Apply transform
            canvas.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
        };

        // Apply initial centering
        updateTransform();

        // Scroll Wheel Zooming
        viewport.addEventListener('wheel', (e) => {
            const wheel = e.deltaY < 0 ? 1 : -1;

            if ((scale >= MAX_SCALE && wheel === 1) || (scale <= MIN_SCALE && wheel === -1)) {
                return; 
            }

            e.preventDefault(); 
            
            const zoomIntensity = 0.1;
            let newScale = scale * Math.exp(wheel * zoomIntensity);
            newScale = Math.max(MIN_SCALE, Math.min(newScale, MAX_SCALE));

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
            hasDragged = false; 
            startX = e.clientX - translateX;
            startY = e.clientY - translateY;
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            hasDragged = true; 
            
            translateX = e.clientX - startX;
            translateY = e.clientY - startY;
            
            const prevX = translateX;
            const prevY = translateY;
            
            updateTransform(); 
            
            if (translateX !== prevX) startX = e.clientX - translateX;
            if (translateY !== prevY) startY = e.clientY - translateY;
        });

        window.addEventListener('mouseup', () => {
            isDragging = false;
        });
        
        window.addEventListener('mouseleave', () => {
            isDragging = false;
        });

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