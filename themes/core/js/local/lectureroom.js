// ==========================================================
// UNIVERSAL SCHEDULE CARD BUILDER (Works on ANY Course formatting)
// ==========================================================
function buildUniversalSchedules() {
    const modules = document.querySelectorAll('li.activity');

    modules.forEach(module => {
        const container = module.querySelector('.description-inner') || module.querySelector('.no-overflow');
        if (!container || container.classList.contains('schedule-rebuilt')) return;

        // 1. Detect if this is a schedule block by checking for Teams/Sharepoint/Zoom links
        const links = Array.from(container.querySelectorAll('a'));
        const hasMeetingLink = links.some(a => a.href.includes('teams') || a.href.includes('sharepoint') || a.href.includes('zoom'));
        
        const fullText = container.innerText.toLowerCase();
        const hasSessionWord = fullText.includes('session') || fullText.includes('recording') || fullText.includes('online class');

        if (!hasMeetingLink || !hasSessionWord) return; // Skip if it's just a normal file/module

        // Add the universal class so our CSS kicks in
        module.classList.add('is-custom-schedule');

        // 2. Extract the unique Course Title dynamically
        let titleText = "Online Class Schedule";
        const firstHeading = container.querySelector('h1, h2, h3, h4');
        if (firstHeading && !firstHeading.innerText.toLowerCase().includes('session') && !firstHeading.innerText.toLowerCase().includes('recording')) {
            // Strips emojis and asterisks automatically
            titleText = firstHeading.innerText.replace(/[^\x00-\x7F]/g, '').replace(/\*/g, '').trim(); 
        }

        // Custom Color-Filled SVGs
        const svgMorning = `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="40" cy="32" r="12" fill="#FFD13B"/><path d="M46 42.5a7.5 7.5 0 0 0-7.5-7.5c-.7 0-1.3.1-2 .3a10.5 10.5 0 0 0-20 2.2 6.5 6.5 0 0 0 2.5 12.5h20.5a6.5 6.5 0 0 0 6.5-6.5v-1z" fill="#FFFFFF" opacity="0.95"/></svg>`;
        const svgAfternoon = `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="14" fill="#FFD13B"/><path d="M32 10V4m0 56v-6m15.5-39.5l4.3-4.3M12.2 51.8l4.3-4.3M54 32h6M4 32h6m39.5 15.5l4.3 4.3M12.2 12.2l4.3 4.3" stroke="#FFD13B" stroke-width="4" stroke-linecap="round"/></svg>`;
        const svgEvening = `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M31.2 16c-8.8 0-16 7.2-16 16s7.2 16 16 16c5.7 0 10.7-3 13.5-7.4-2.1.9-4.4 1.4-6.8 1.4-9.9 0-18-8.1-18-18 0-2.9.7-5.7 1.9-8z" fill="#FFD13B"/><polygon points="48,12 49.5,16.5 54,16.5 50.5,19.5 51.5,24 48,21.5 44.5,24 45.5,19.5 42,16.5 46.5,16.5" fill="#FFFFFF"/><polygon points="20,14 21,17 24,17 21.5,19 22.5,22 20,20.5 17.5,22 18.5,19 16,17 19,17" fill="#FFFFFF" opacity="0.7"/></svg>`;
        const svgRecord = `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><rect x="12" y="24" width="28" height="20" rx="4" fill="#E0E0E0"/><polygon points="40,28 52,20 52,48 40,40" fill="#BDBDBD"/><circle cx="26" cy="34" r="5" fill="#757575"/><circle cx="52" cy="14" r="3" fill="#FF5252"/></svg>`;

        // Fallback global links 
        let fallbackTeams = "#", fallbackSharepoint = "#";
        links.forEach(a => {
            if (a.href.includes('teams')) fallbackTeams = a.href;
            if (a.href.includes('sharepoint')) fallbackSharepoint = a.href;
        });

        // 3. Intelligently parse each section (Supports h2, h3, h4, and bold text)
        let cardsHTML = '';
        const headers = container.querySelectorAll('h2, h3, h4, h5, strong, b');

        headers.forEach(header => {
            const headerText = header.innerText.toLowerCase();
            const block = header.parentElement;
            
            // Avoid processing the main title again
            if(headerText === titleText.toLowerCase()) return;

            const blockText = block.innerText.replace(/[^\x00-\x7F]/g, '').replace(/\*/g, ''); // Strip emojis and asterisks
            
            // Robust Text Recognition for Time and Dates
            let timeText = "", runsThrough = "";
            const timeMatch = blockText.match(/Time:?\s*([^\n]+)/i) || blockText.match(/(\d{1,2}:\d{2}\s*(?:AM|PM)[^\n]*)/i);
            if (timeMatch) timeText = timeMatch[1].trim();

            const runsMatch = blockText.match(/(?:Duration|Runs through|Till):?\s*([^\n]+)/i);
            if (runsMatch) runsThrough = runsMatch[1].trim();

            // Text Recognition for Days
            const daysRegex = /(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)/gi;
            const foundDays = [...new Set(blockText.match(daysRegex) || [])];
            const dayBadge = foundDays.length > 0 ? foundDays.join(' & ') : '';

            // See if this specific block has its own link, otherwise use fallback
            const localLink = block.querySelector('a') ? block.querySelector('a').href : null;

            if (headerText.includes('morning')) {
                cardsHTML += createCard('Morning Session', dayBadge, timeText || '10:00 AM', runsThrough, localLink || fallbackTeams, 'btn-join', 'Join Session', 'time-morning', svgMorning);
            } else if (headerText.includes('afternoon')) {
                cardsHTML += createCard('Afternoon Session', dayBadge, timeText, runsThrough, localLink || fallbackTeams, 'btn-join', 'Join Session', 'time-afternoon', svgAfternoon);
            } else if (headerText.includes('evening')) {
                cardsHTML += createCard('Evening Session', dayBadge, timeText, runsThrough, localLink || fallbackTeams, 'btn-join', 'Join Session', 'time-evening', svgEvening);
            } else if (headerText.includes('recording')) {
                cardsHTML += createCard('Lecture Recordings', null, 'All class recordings for this course are available here.', null, localLink || fallbackSharepoint, 'btn-record', 'View Recordings', 'tool-recordings', svgRecord);
            }
        });

        // 4. Inject the clean structure
        if (cardsHTML !== '') {
            container.innerHTML = `
                <h2 class="schedule-title">${titleText}</h2>
                <div class="custom-schedule-grid">
                    ${cardsHTML}
                </div>
                <div class="schedule-note">
                    Note: Please log in using your institute Microsoft account before joining or accessing recordings.
                </div>
            `;
            container.classList.add('schedule-rebuilt');
        }
    });
}

// Helper function
function createCard(title, badge, text1, text2, link, btnClass, btnText, bgClass, svg) {
    return `
        <div class="schedule-card ${bgClass}">
            <div class="card-left">
                <h3>${title}</h3>
                ${badge ? `<span class="day-badge">${badge}</span>` : ''}
                ${title === 'Lecture Recordings' ? `<p style="margin-bottom: 25px;">${text1}</p>` : `<p><strong>Time:</strong> ${text1}</p><p><strong>Duration:</strong> ${text2}</p>`}
                <a href="${link}" target="_blank" class="${btnClass}">${btnText}</a>
            </div>
            <div class="card-right">${svg}</div>
        </div>
    `;
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(buildUniversalSchedules, 500));
} else {
    setTimeout(buildUniversalSchedules, 500);
}