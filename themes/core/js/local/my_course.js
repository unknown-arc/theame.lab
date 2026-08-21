// Wait for the DOM to fully load
document.addEventListener('DOMContentLoaded', () => {
    
    // Select all course links inside the block, including the "All courses" footer
    const courseLinks = document.querySelectorAll('.block_course_list .card-text a, .block_course_list .footer a');

    courseLinks.forEach(link => {
        // Grab the text of the link (or its title attribute)
        let text = link.getAttribute('title') || link.innerText || "";
        let extractedCode = "COURSE"; // Fallback text

        // Logic 1: Check for Mock Test
        if (text.toLowerCase().includes("mock") || text.toLowerCase().includes("mk")) {
            extractedCode = "MOCK";
        } 
        // Logic 2: Check for "All courses" footer
        else if (text.toLowerCase().includes("all")) {
            extractedCode = "ALL";
        } 
        // Logic 3: Extract the 3-digit subject code (e.g., 107, 202, 305)
        else {
            let match = text.match(/\b\d{3}\b/); // Regex looks for exactly 3 numbers in a row
            if (match) {
                extractedCode = match[0];
            }
        }

        // Inject the extracted code into the HTML as a custom data attribute
        link.setAttribute('data-course-code', extractedCode);
    });
});