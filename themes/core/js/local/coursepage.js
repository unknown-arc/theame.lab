/* ==========================================================
   LOGIC.JS - Interaction, Disarming Bootstrap, Dynamic Icons & Colors
   ========================================================== */
function initCustomGrid() {
    const nativeToggles = document.querySelectorAll('.course-content [data-toggle="collapse"], .course-content [data-bs-toggle="collapse"]');
    nativeToggles.forEach(toggle => {
        toggle.removeAttribute('data-toggle');
        toggle.removeAttribute('data-bs-toggle');
        toggle.removeAttribute('href'); 
    });

    const gridCards = document.querySelectorAll('.course-content li.section, .course-content .course-section');
    const topicsList = document.querySelector('.course-content ul.topics') || document.querySelector('.course-content ul.ctopics') || (gridCards.length > 0 ? gridCards[0].parentNode : null);

    if (!topicsList || !gridCards.length) return;
    if (document.getElementById('global-course-viewer')) return;

    const viewer = document.createElement('div');
    viewer.id = 'global-course-viewer';
    topicsList.parentNode.insertBefore(viewer, topicsList.nextSibling);

    let activeSection = null;
    let activeContent = null;

    // Fallback colors if the text doesn't match anything specific
    const fallbackColors = ['#1abc9c', '#f39c12', '#d35400', '#c0392b', '#8e44ad', '#2c3e50'];
    let fallbackIndex = 0;

    // 4. Attach Listeners and Inject Icons & Colors
    gridCards.forEach((card, index) => {
        const headerTextElement = card.querySelector('.sectionname');

        if (headerTextElement && !card.querySelector('.custom-grid-icon')) {
            const titleText = headerTextElement.textContent.toLowerCase();
            let iconClass = 'fa-folder'; 
            let themeColor = ''; // Will hold our hex color
            
            // Assign Icons and Colors based on keywords
            if (titleText.includes('information')) {
                iconClass = 'fa-info-circle';
                themeColor = '#3498db'; // Blue
            } else if (titleText.includes('syllabus')) {
                iconClass = 'fa-book-open';
                themeColor = '#f1c40f'; // Yellow
            } else if (titleText.includes('assessment') || titleText.includes('exam') || titleText.includes('quiz')) {
                iconClass = 'fa-clipboard-check';
                themeColor = '#2ecc71'; // Green
            } else if (titleText.includes('lecture resource') || titleText.includes('lectures')) {
                iconClass = 'fa-video';
                themeColor = '#9b59b6'; // Purple
            } else if (titleText.includes('book') || titleText.includes('learning resource')) {
                iconClass = 'fa-book';
                themeColor = '#e67e22'; // Orange
            } else if (titleText.includes('slide') || titleText.includes('tutorial')) {
                iconClass = 'fa-chalkboard-teacher';
                themeColor = '#e74c3c'; // Red
            } else if (titleText.includes('general')) {
                iconClass = 'fa-list-alt';
                themeColor = '#1f3a93'; // Dark Blue
            }

            // If no keywords match, assign a fallback color and increment the index
            if (!themeColor) {
                themeColor = fallbackColors[fallbackIndex % fallbackColors.length];
                fallbackIndex++;
            }

            // Save the color as a CSS variable directly on the card
            card.style.setProperty('--card-theme-color', themeColor);

            // Create the icon wrapper and insert it
            const iconHTML = `<div class="custom-grid-icon"><i class="fa ${iconClass} fa-fw"></i></div>`;
            headerTextElement.insertAdjacentHTML('afterbegin', iconHTML);
        }

        card.style.cursor = 'pointer';

        card.addEventListener('click', e => {
            if (e.target.tagName.toLowerCase() === 'a' && !e.target.classList.contains('stretched-link')) {
                return;
            }

            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            const contentItems = card.querySelector('.content') || card.querySelector('.course-section-content') || card.querySelector('ul.section');
            const isCurrentlyOpen = activeSection === card;

            if (isCurrentlyOpen) {
                if (activeContent) {
                    card.appendChild(activeContent);
                    activeContent.classList.remove('moved-content-wrapper');
                }
                viewer.classList.remove('active');
                viewer.innerHTML = '';
                card.classList.remove('custom-is-open');
                activeSection = null;
                activeContent = null;
                return;
            }

            if (activeSection && activeSection !== card) {
                if (activeContent) {
                    activeSection.appendChild(activeContent);
                    activeContent.classList.remove('moved-content-wrapper');
                }
                activeSection.classList.remove('custom-is-open');
                viewer.innerHTML = '';
            }

            viewer.classList.add('active');
            card.classList.add('custom-is-open');

            if (contentItems) {
                contentItems.classList.remove('d-none', 'hidden', 'collapse', 'collapsed');
                contentItems.removeAttribute('hidden');
                contentItems.classList.add('moved-content-wrapper');

                // --- NEW: Check if this is the Assessment section ---
                const titleText = card.querySelector('.sectionname').textContent.toLowerCase();
                if (titleText.includes('assessment') || titleText.includes('exam') || titleText.includes('quiz') || titleText.includes('lecture room and recordings')){
                    contentItems.classList.add('list-view-mode');
                    contentItems.classList.remove('card-view-mode');
                } else {
                    contentItems.classList.add('card-view-mode');
                    contentItems.classList.remove('list-view-mode');
                }
                // ----------------------------------------------------

                viewer.appendChild(contentItems);
                
                contentItems.style.setProperty('display', 'block', 'important');
                contentItems.style.setProperty('height', 'auto', 'important');
                
                activeContent = contentItems;
            } else {
                viewer.innerHTML = `<p class="no-course-content" style="color:white; text-align:center; padding: 20px;">No resources or activities found.</p>`;
                activeContent = null;
            }

            activeSection = card;

            setTimeout(() => {
                viewer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);

        }, true);
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(initCustomGrid, 800));
} else {
    setTimeout(initCustomGrid, 800);
}