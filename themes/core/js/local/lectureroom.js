// ==========================================================
// REBUILD HORIZONTAL SCHEDULE CARDS (Left Text, Right SVG)
// ==========================================================
function rebuildScheduleCards() {
    const module = document.getElementById('module-4563');
    if (!module) return;
    
    const container = module.querySelector('.description-inner') || module.querySelector('.no-overflow');
    if (!container || container.classList.contains('schedule-rebuilt')) return;

    let teamsLink = "#";
    let sharepointLink = "#";
    container.querySelectorAll('a').forEach(a => {
        if (a.href.includes('teams')) teamsLink = a.href;
        if (a.href.includes('sharepoint')) sharepointLink = a.href;
    });

    // Custom Color-Filled SVGs for the right side of the cards
    const svgMorning = `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="40" cy="32" r="12" fill="#FFD13B"/><path d="M46 42.5a7.5 7.5 0 0 0-7.5-7.5c-.7 0-1.3.1-2 .3a10.5 10.5 0 0 0-20 2.2 6.5 6.5 0 0 0 2.5 12.5h20.5a6.5 6.5 0 0 0 6.5-6.5v-1z" fill="#FFFFFF" opacity="0.95"/></svg>`;
    
    const svgAfternoon = `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="14" fill="#FFD13B"/><path d="M32 10V4m0 56v-6m15.5-39.5l4.3-4.3M12.2 51.8l4.3-4.3M54 32h6M4 32h6m39.5 15.5l4.3 4.3M12.2 12.2l4.3 4.3" stroke="#FFD13B" stroke-width="4" stroke-linecap="round"/></svg>`;
    
    const svgEvening = `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M31.2 16c-8.8 0-16 7.2-16 16s7.2 16 16 16c5.7 0 10.7-3 13.5-7.4-2.1.9-4.4 1.4-6.8 1.4-9.9 0-18-8.1-18-18 0-2.9.7-5.7 1.9-8z" fill="#FFD13B"/><polygon points="48,12 49.5,16.5 54,16.5 50.5,19.5 51.5,24 48,21.5 44.5,24 45.5,19.5 42,16.5 46.5,16.5" fill="#FFFFFF"/><polygon points="20,14 21,17 24,17 21.5,19 22.5,22 20,20.5 17.5,22 18.5,19 16,17 19,17" fill="#FFFFFF" opacity="0.7"/></svg>`;
    
    const svgRecord = `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><rect x="12" y="24" width="28" height="20" rx="4" fill="#E0E0E0"/><polygon points="40,28 52,20 52,48 40,40" fill="#BDBDBD"/><circle cx="26" cy="34" r="5" fill="#757575"/><circle cx="52" cy="14" r="3" fill="#FF5252"/></svg>`;

    container.innerHTML = `
        <h2 class="schedule-title">CDA/ACS 208 – Web Development and App Design</h2>
        
        <div class="custom-schedule-grid">
            <!-- 1. Morning Card -->
            <div class="schedule-card time-morning">
                <div class="card-left">
                    <h3>Morning Session</h3>
                    <span class="day-badge">Wednesday</span>
                    <p><strong>Time:</strong> 8:00 AM – 10:00 AM IST</p>
                    <p><strong>Runs through:</strong> 30 Nov 2026</p>
                    <a href="${teamsLink}" target="_blank" class="btn-join">Join Session</a>
                </div>
                <div class="card-right">${svgMorning}</div>
            </div>

            <!-- 2. Afternoon Card -->
            <div class="schedule-card time-afternoon">
                <div class="card-left">
                    <h3>Afternoon Session</h3>
                    <span class="day-badge">Thursday</span>
                    <p><strong>Time:</strong> 2:00 PM – 4:00 PM IST</p>
                    <p><strong>Runs through:</strong> 30 Nov 2026</p>
                    <a href="${teamsLink}" target="_blank" class="btn-join">Join Session</a>
                </div>
                <div class="card-right">${svgAfternoon}</div>
            </div>

            <!-- 3. Evening Card -->
            <div class="schedule-card time-evening">
                <div class="card-left">
                    <h3>Evening Session</h3>
                    <span class="day-badge">Mon & Tue</span>
                    <p><strong>Time:</strong> 7:00 PM – 9:00 PM IST</p>
                    <p><strong>Runs through:</strong> 30 Nov 2026</p>
                    <a href="${teamsLink}" target="_blank" class="btn-join">Join Session</a>
                </div>
                <div class="card-right">${svgEvening}</div>
            </div>

            <!-- 4. Recordings Card -->
            <div class="schedule-card tool-recordings">
                <div class="card-left">
                    <h3>Lecture Recordings</h3>
                    <p style="margin-bottom: 25px;">All class recordings for this course are available here.</p>
                    <a href="${sharepointLink}" target="_blank" class="btn-record">View Recordings</a>
                </div>
                <div class="card-right">${svgRecord}</div>
            </div>
        </div>
        
        <div class="schedule-note">
            Note: Please log in using your institute Microsoft account before joining or accessing recordings.
        </div>
    `;
    
    container.classList.add('schedule-rebuilt'); 
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(rebuildScheduleCards, 500));
} else {
    setTimeout(rebuildScheduleCards, 500);
}