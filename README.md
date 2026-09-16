# THEME.BY — IITP Moodle Theme

A modern, lightweight Chrome extension that transforms the **IIT Patna Moodle** interface into a cleaner, more organized, and customizable learning environment.

THEME.BY improves the visual experience of IIT Patna's Moodle platform while keeping the original Moodle functionality intact.

---

## ✨ Features

### 🎨 Modern Moodle UI

* Apple-inspired clean interface
* Improved spacing, typography, and layout
* Modern cards and containers
* Cleaner course pages
* Improved navigation experience
* Responsive layout for different screen sizes

### 🌙 Light & Dark Themes

* Light theme
* Dark theme
* Theme switching without changing Moodle functionality
* Theme-specific styling for Moodle components

### 🖼️ Custom Background

THEME.BY supports customizable backgrounds for the Moodle interface.

The background system is handled independently from the main theme so that background changes do not interfere with the rest of the UI.

### 📚 Course Interface

The extension improves the presentation of Moodle courses.

Examples include:

* Cleaner course lists
* Improved course cards
* Course navigation improvements
* Better readability
* Dropdown-based course information
* Improved course-page styling

### 👤 User Interface

THEME.BY provides customized styling for Moodle user-related components such as:

* User menu
* Profile area
* Login-related interface
* Navigation elements
* Header components

### ⚡ Performance Focused

Performance is an important part of THEME.BY.

The project avoids unnecessary JavaScript work and uses optimized CSS/JavaScript where possible.

Special attention is given to:

* DOM manipulation
* Event handling
* CSS rendering cost
* Page transitions
* Dynamic Moodle elements
* Screen-size changes

### 📱 Responsive Design

The interface adapts to different:

* Screen widths
* Browser window sizes
* Laptop displays
* Desktop displays

Dynamic header and navigation behavior is used to prevent layout problems when available space changes.

---

# 🏗️ Project Architecture

THEME.BY is built as a **Chrome Manifest V3 extension**.

```text
THEME.BY
│
├── manifest.json
│
├── popup/
│   ├── popup.html
│   ├── popup.css
│   └── popup.js
│
├── styles/
│   ├── ...
│
├── scripts/
│   ├── ...
│
├── config/
│   ├── styles.json
│   └── scripts.json
│
└── README.md
```

> The exact folder structure may evolve as the project grows.

---

# ⚙️ Technology Stack

| Technology            | Purpose                                     |
| --------------------- | ------------------------------------------- |
| JavaScript            | Moodle DOM manipulation and extension logic |
| CSS                   | UI styling and themes                       |
| HTML                  | Popup and extension interfaces              |
| Chrome Extensions API | Browser extension functionality             |
| Manifest V3           | Extension architecture                      |
| JSON                  | Configuration                               |
| Moodle                | Target platform                             |

---

# 🔌 How THEME.BY Works

THEME.BY runs on supported IIT Patna Moodle pages.

The extension injects its functionality into Moodle and modifies the existing interface without replacing Moodle's backend functionality.

Basic flow:

```text
Chrome
   │
   ▼
THEME.BY Extension
   │
   ├── Load Configuration
   │
   ├── Load JavaScript
   │
   ├── Load CSS
   │
   ├── Detect Moodle Page
   │
   └── Apply Theme
          │
          ▼
      IITP Moodle
```

The extension works primarily at the presentation layer.

```text
Moodle Backend
      │
      ▼
Moodle HTML
      │
      ▼
THEME.BY
 ┌───────────────┐
 │ CSS           │
 │ JavaScript    │
 │ Configuration │
 │ Theme Engine  │
 └───────────────┘
      │
      ▼
Improved Moodle UI
```

---

# 🧩 Core Components

THEME.BY uses separate managers/modules for different responsibilities.

### Theme Engine

Controls the overall theme loading process.

Responsibilities include:

* Initializing THEME.BY
* Loading configuration
* Loading required modules
* Applying theme components

### Theme Manager

Responsible for theme-related operations.

```text
ThemeManager
     │
     ├── Light Theme
     ├── Dark Theme
     └── Theme State
```

### Theme Loader

Handles loading of theme resources such as:

* CSS
* JavaScript
* Configuration

### Page Manager

Detects and manages Moodle pages.

This allows THEME.BY to apply different behavior depending on the current Moodle page.

### Background Manager

Handles background customization independently from the main theme.

This separation helps prevent background-related operations from affecting the main theme system.

### Color Manager

Centralizes color-related operations and theme colors.

### Storage Manager

Handles persistent extension settings.

Examples:

* Selected theme
* Background settings
* User preferences

### Utils

Contains reusable utility functions shared by different modules.

### Page Transition

Controls visual transitions between Moodle pages/components where supported.

---

# 📄 Configuration

THEME.BY uses configuration files to control resources instead of hard-coding every resource directly into the main loader.

Current configuration includes:

```text
styles.json
scripts.json
```

### styles.json

Defines CSS resources used by THEME.BY.

Example structure:

```json
{
    "styles": [
        "styles/main.css",
        "styles/header.css"
    ]
}
```

### scripts.json

Defines JavaScript resources used by THEME.BY.

Example:

```json
{
    "scripts": [
        "scripts/theme.js",
        "scripts/coursepage.js"
    ]
}
```

> Configuration formats may change as the project evolves.

---

# 🛠️ Installation

## 1. Clone the repository

```bash
git clone <repository-url>
```

Then enter the project:

```bash
cd THEME.BY
```

## 2. Open Chrome Extensions

Open:

```text
chrome://extensions/
```

## 3. Enable Developer Mode

Enable:

```text
Developer mode
```

## 4. Load the extension

Click:

```text
Load unpacked
```

Select the THEME.BY project directory.

## 5. Open IITP Moodle

Visit the supported IIT Patna Moodle website.

THEME.BY should automatically load on supported pages.

---

# 💻 Development

THEME.BY is developed using standard web technologies.

No large build system is required for the current architecture.

Recommended development environment:

* Google Chrome
* Visual Studio Code
* Git
* GitHub

---

# 🔄 Development Workflow

Recommended workflow:

```text
Create Issue
     │
     ▼
Create Feature Branch
     │
     ▼
Implement Change
     │
     ▼
Test on Moodle
     │
     ▼
Fix Bugs
     │
     ▼
Commit Changes
     │
     ▼
Push Branch
     │
     ▼
Pull Request
     │
     ▼
Review
     │
     ▼
Merge
```

Example:

```bash
git checkout main
git pull origin main

git checkout -b feature/new-feature
```

After development:

```bash
git add .
git commit -m "feat: add new feature"
git push origin feature/new-feature
```

Then create a Pull Request on GitHub.

---

# 🧪 Testing

THEME.BY should be tested on different Moodle pages and screen sizes.

### Page Testing

Test at minimum:

* Moodle homepage
* Dashboard
* Course page
* Course list
* Profile/user menu
* Login page
* Navigation menus
* Dropdown components

### Responsive Testing

Test different browser sizes:

```text
Desktop
Laptop
Medium Width
Small Width
```

Pay particular attention to:

* Header
* Navigation
* Course cards
* Dropdowns
* User menu
* Text visibility
* Overflow

### Reload Testing

Important cases include:

* Fresh page load
* Browser refresh
* Moodle navigation
* Switching pages
* Resizing browser
* Switching theme
* Repeated navigation

---

# 🐛 Debugging

THEME.BY provides debugging information through the browser console.

Debug messages use the following format:

```text
[THEME.BY DEBUG]
```

Open Chrome DevTools:

```text
F12
```

Then:

```text
Console
```

Search for:

```text
THEME.BY
```

This helps identify:

* Script loading problems
* Configuration problems
* Page detection issues
* DOM manipulation problems
* Theme initialization issues

---

# ⚡ Performance

Performance is treated as a first-class requirement.

THEME.BY modifies an already complex Moodle interface, so inefficient CSS or JavaScript can noticeably affect browser performance.

Important areas:

### CSS

Avoid:

* Excessive selectors
* Expensive selectors
* Unnecessary animations
* Repeated expensive visual effects
* Large amounts of duplicated CSS

### JavaScript

Avoid:

* Unnecessary polling
* Repeated DOM queries
* Excessive MutationObserver usage
* Repeated event registration
* Uncontrolled DOM updates

Prefer:

* Event delegation
* Cached DOM references
* Targeted selectors
* Debouncing/throttling where appropriate
* Minimal DOM manipulation

---

# 🔐 Permissions

THEME.BY requires permissions necessary to operate on supported Moodle pages.

The extension is designed primarily to modify the Moodle presentation layer.

It does not replace Moodle's authentication or backend systems.

Users should review `manifest.json` to see the exact permissions requested by the current version.

---

# 🎯 Supported Platform

Current target:

```text
IIT Patna Moodle
```

The extension is specifically designed around the IIT Patna Moodle interface.

Because Moodle installations can have different themes, versions, plugins, and HTML structures, compatibility with unrelated Moodle installations is not guaranteed.

---

# 📌 Project Goals

THEME.BY aims to provide:

* A cleaner Moodle experience
* Better visual organization
* Better readability
* Customizable themes
* Custom backgrounds
* Responsive UI
* Good browser performance
* Maintainable extension architecture

---

# 🗺️ Roadmap

Possible future improvements include:

* [ ] More theme customization
* [ ] Additional color schemes
* [ ] Improved accessibility
* [ ] More Moodle page support
* [ ] Better mobile/responsive behavior
* [ ] More customization options
* [ ] Performance profiling and optimization
* [ ] Improved settings UI
* [ ] Better extension update system
* [ ] Automated testing
* [ ] Cross-Moodle compatibility where practical

The roadmap may change based on development priorities and user feedback.

---

# 🤝 Contributing

Contributions are welcome.

Before contributing:

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Test the extension on Moodle.
5. Commit your changes.
6. Push your branch.
7. Open a Pull Request.

Example:

```bash
git checkout -b feature/example-feature
```

Use clear commit messages:

```text
feat: add dark mode improvements
fix: resolve course dropdown issue
perf: reduce unnecessary DOM updates
style: improve course card layout
docs: update installation guide
```

---

# 📁 Commit Convention

Recommended prefixes:

| Prefix      | Purpose                 |
| ----------- | ----------------------- |
| `feat:`     | New functionality       |
| `fix:`      | Bug fix                 |
| `perf:`     | Performance improvement |
| `style:`    | CSS/UI changes          |
| `refactor:` | Code restructuring      |
| `docs:`     | Documentation           |
| `test:`     | Testing changes         |
| `chore:`    | Maintenance             |

Example:

```bash
git commit -m "fix: resolve header text visibility issue"
```

---

# 🧑‍💻 Development Principles

THEME.BY follows several principles:

### Keep Moodle Functional

THEME.BY should improve the interface without unnecessarily changing Moodle's original functionality.

### Separate Responsibilities

CSS, JavaScript, configuration, storage, themes, and page-specific functionality should remain logically separated.

### Performance Matters

Every UI feature should consider its effect on page performance.

### Avoid Unnecessary Complexity

Prefer simple browser-native solutions when they are sufficient.

### Build Incrementally

New functionality should be added and tested independently rather than modifying the entire theme system at once.

---

# 📜 License

Add the project's license here.

Example:

```text
MIT License
```

See the `LICENSE` file for the complete license terms.

---

# 👨‍💻 Project

**THEME.BY**

A custom IIT Patna Moodle interface enhancement project.

Built with:

```text
HTML
CSS
JavaScript
Chrome Extension APIs
Manifest V3
```

---

## ⭐ Support the Project

If THEME.BY is useful to you:

* ⭐ Star the repository
* 🐛 Report bugs
* 💡 Suggest improvements
* 🔧 Contribute code
* 📖 Improve documentation

Every contribution helps improve the project.

---

## 📬 Feedback

For bugs, feature requests, or improvements, create an issue in the GitHub repository with:

```text
Title:
Description:
Steps to reproduce:
Expected behavior:
Actual behavior:
Browser:
Moodle page:
Screenshots:
Console errors:
```

---

> **THEME.BY — Making Moodle a better learning environment.**
