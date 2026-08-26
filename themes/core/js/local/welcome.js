const welcomeMsg = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('Welcome back'));

if (welcomeMsg) {
    // Removes the hand emoji and sets exact text
    welcomeMsg.textContent = 'Welcome back, Ankit!';
    // Adds a class for the CSS animation and styling
    welcomeMsg.classList.add('custom-welcome-animation');
}