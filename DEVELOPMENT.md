# THEME LAB — Development Guide

This document is for contributors and developers who want to set up, modify, test, or extend THEME LAB.

For general project information, see **[README.md](README.md)**.

## 🏗️ Project Overview

THEME LAB is a **Chrome Manifest V3 extension** that modifies the presentation layer of IIT Patna Moodle.

```text
IITP Moodle
    │
    ▼
Moodle HTML
    │
    ▼
THEME LAB
 ┌─────────────────┐
 │ Configuration   │
 │ JavaScript      │
 │ CSS             │
 │ Theme System    │
 └─────────────────┘
    │
    ▼
Improved Moodle UI
```

THEME LAB should enhance Moodle without unnecessarily changing its core functionality.

## 📁 Project Structure

The project structure may change as development continues. The main areas are:

```text
THEME LAB
│
├── manifest.json
├── popup/
│   ├── popup.html
│   ├── popup.css
│   └── popup.js
│
├── styles/
│   └── *.css
│
├── scripts/
│   └── *.js
│
├── config/
│   ├── styles.json
│   └── scripts.json
│
├── README.md
└── DEVELOPMENT.md
```

Use the actual repository structure as the source of truth when adding new files.

## ⚙️ Technology Stack

| Technology | Purpose |
|---|---|
| HTML | Extension interface |
| CSS | UI styling and themes |
| JavaScript | Extension and Moodle logic |
| JSON | Configuration |
| Chrome Extension API | Browser integration |
| Manifest V3 | Extension architecture |

## 💻 Development Setup

Recommended tools:

- Google Chrome
- Visual Studio Code
- Git
- GitHub

No large build system is currently required.

### Load the Extension

1. Open `chrome://extensions/`.
2. Enable **Developer mode**.
3. Select **Load unpacked**.
4. Choose the project directory.
5. Open or refresh IIT Patna Moodle.

After making changes, reload the extension and refresh the Moodle page when required.

## 📄 Configuration

THEME LAB uses JSON configuration to manage resources.

### `config/styles.json`

Defines CSS resources loaded by the extension.

### `config/scripts.json`

Defines JavaScript resources loaded by the extension.

Keeping resources in configuration makes it easier to add, remove, or reorganize files without changing the main loader.

## 🧩 Core Components

The project separates responsibilities across managers/modules.

### Theme Engine
Coordinates initialization and theme loading.

### Theme Manager
Handles theme state and theme switching.

### Theme Loader
Loads configured CSS and JavaScript resources.

### Page Manager
Detects Moodle pages and supports page-specific behavior.

### Background Manager
Handles customizable backgrounds independently from the main theme.

### Color Manager
Handles theme and color-related operations.

### Storage Manager
Stores user preferences and extension settings.

### Utils
Contains reusable helper functions.

### Page Transition
Handles supported visual transitions and UI states.

## 🧪 Testing

Test changes on actual IIT Patna Moodle pages.

Important pages include:

- Moodle homepage
- Dashboard
- Course pages
- Course lists
- User menu
- Navigation
- Dropdown components
- Login-related pages

Also test different browser window sizes.

Check:

- Header visibility
- Text visibility
- Navigation
- Dropdowns
- Course cards
- Overflow
- Layout stability
- Theme switching
- Page reloads

## 🐛 Debugging

Open Chrome DevTools:

```text
F12 → Console
```

THEME LAB currently uses debug messages with the legacy prefix:

```text
[THEME.BY DEBUG]
```

The prefix may be updated as the project fully transitions from the previous THEME.BY name.

Useful debugging areas include:

- Script loading
- Configuration
- Page detection
- DOM manipulation
- Theme initialization
- Responsive behavior

## ⚡ Performance Guidelines

Moodle is already a large and dynamic web application, so extension code should avoid unnecessary browser work.

Avoid:

- Excessive DOM queries
- Repeated DOM updates
- Unnecessary `MutationObserver` usage
- Repeated event registration
- Uncontrolled polling
- Expensive CSS selectors
- Unnecessary animations

Prefer:

- Targeted selectors
- Cached DOM references
- Event delegation
- Debouncing/throttling where appropriate
- Minimal DOM manipulation
- Reusable utilities

Always test performance after significant CSS or JavaScript changes.

## 🔄 Git Workflow

Use a feature branch for development rather than directly changing `main`.

```bash
git checkout main
git pull origin main
git checkout -b feature/your-feature
```

After making and testing changes:

```bash
git add .
git commit -m "feat: describe the change"
git push origin feature/your-feature
```

Then create a Pull Request.

### Commit Convention

| Prefix | Purpose |
|---|---|
| `feat:` | New functionality |
| `fix:` | Bug fix |
| `perf:` | Performance improvement |
| `style:` | CSS/UI changes |
| `refactor:` | Code restructuring |
| `docs:` | Documentation |
| `test:` | Testing |
| `chore:` | Maintenance |

Examples:

```text
feat: add dark mode controls
fix: resolve course dropdown issue
perf: optimize header rendering
style: improve course cards
docs: update development guide
```

## 🔀 Pull Requests

Before opening a Pull Request:

1. Make sure the branch is based on the latest `main`.
2. Test the changed functionality.
3. Check different screen sizes where relevant.
4. Check the browser console for errors.
5. Keep commits focused.
6. Clearly describe what changed and why.

## 🧱 Development Principles

### Keep Moodle Functional
Do not unnecessarily alter Moodle's original functionality.

### Separate Responsibilities
Keep theme logic, page-specific logic, configuration, storage, and utilities logically separated.

### Performance Matters
Consider the browser cost of every CSS and JavaScript change.

### Keep It Maintainable
Prefer clear and simple solutions over unnecessary complexity.

### Test Before Merging
UI changes should be tested on the actual Moodle interface before merging.

## 📌 Adding a New Feature

A typical feature should follow:

```text
Issue
  ↓
Plan
  ↓
Feature Branch
  ↓
Implementation
  ↓
Moodle Testing
  ↓
Bug Fixes
  ↓
Commit
  ↓
Pull Request
  ↓
Review
  ↓
Merge
```

For page-specific functionality, avoid adding unrelated logic to global scripts when a dedicated module is more appropriate.

## 🔐 Manifest and Permissions

Review `manifest.json` before changing extension permissions.

Only request permissions required for the extension's functionality.

## 📝 Documentation

Update documentation when a change affects:

- Installation
- Configuration
- Project structure
- Development workflow
- User-facing functionality

User-facing information belongs in `README.md`.

Developer-specific information belongs in `DEVELOPMENT.md`.

## 📜 License

See the project's `LICENSE` file for licensing information.
