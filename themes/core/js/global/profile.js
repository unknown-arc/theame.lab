/* ==========================================================
   THEME.BY — Dynamic High-Res Profile Picture Injection
   ========================================================== */
function injectProfileImage() {
    const dropdown = document.querySelector('.usermenu #carousel-item-main');
    if (!dropdown) return;

    // 1. Stop if we already added it
    if (dropdown.querySelector('.custom-profile-pic-link')) return;

    // 2. Grab the tiny profile image from the top navbar button
    const userImgElement = document.querySelector('.usermenu .dropdown-toggle img.userpicture');
    let imgUrl = 'https://cet.iitp.ac.in/moodle/theme/image.php/moove/core/1690960000/u/f1'; // Fallback
    
    if (userImgElement && userImgElement.src) {
        // MAGIC TRICK: Moodle uses 'f2' for tiny images and 'f1' for 100x100 images.
        // We just intercept the URL and swap it out for the high-res version!
        imgUrl = userImgElement.src.replace('/f2', '/f1').replace('f2?rev=', 'f1?rev=');
    }

    // 3. Dynamically build the exact "Edit Profile" redirect URL you requested
    // (It pulls your exact ID, like 30325, from the existing View Profile link)
    const profileLinkElem = dropdown.querySelector('a[href*="profile.php"]');
    let editProfileUrl = 'https://cet.iitp.ac.in/moodle/user/edit.php?returnto=profile';
    if (profileLinkElem && profileLinkElem.href) {
        const urlObj = new URL(profileLinkElem.href);
        const userId = urlObj.searchParams.get('id');
        if (userId) {
            editProfileUrl = `https://cet.iitp.ac.in/moodle/user/edit.php?id=${userId}&returnto=profile`;
        }
    }

    // 4. Create the new clickable high-res profile image link
    const profileLink = document.createElement('a');
    profileLink.href = editProfileUrl;
    profileLink.className = 'custom-profile-pic-link';
    profileLink.style.backgroundImage = `url('${imgUrl}')`;
    profileLink.title = "Edit Profile";

    // 5. Insert it at the very top of the grid
    dropdown.prepend(profileLink);
}

// Run when DOM loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectProfileImage);
} else {
    injectProfileImage();
}

// Moodle sometimes redraws the menu, so we trigger it on click too to be safe
document.addEventListener('click', (e) => {
    if (e.target.closest('.usermenu')) {
        setTimeout(injectProfileImage, 50);
    }
});