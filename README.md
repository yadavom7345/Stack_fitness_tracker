# STACK — Fitness Tracker

A premium, dark-mode fitness tracking web application built entirely with **vanilla HTML, CSS, and JavaScript** — no frameworks, no build tools, no dependencies (except Chart.js for analytics).

---

## What Is STACK?

STACK is a zero-friction workout logger designed for serious lifters. It consists of two main parts:

1. **Marketing Landing Page** (`index.html`) — A polished, conversion-focused landing page that introduces the product with a hero section, pricing tiers, and a contact form.
2. **Workout Tracker App** (`app.html`) — A full-featured single-page application for logging workouts, reviewing history, and analyzing performance trends.

---

## What Makes This Project Special

### 🚫 Zero Frameworks, Full Power
The entire application — from glassmorphic navigation to animated pricing cards to a full workout tracker SPA — is built with **only HTML, CSS, and vanilla JavaScript**. No React, no Tailwind, no Webpack. This demonstrates that premium, modern web experiences don't require heavy toolchains.

### 🎨 Premium Dark-Mode Design System
A cohesive design token system powers the entire UI:
- **Color palette**: Deep blacks (`#121212`) with a vibrant purple accent (`#A855F7`) and gradient (`#A855F7 → #7c3aed`)
- **Typography**: Dual-font pairing of **Inter** (headings) and **Space Grotesk** (body) via Google Fonts
- **Consistent tokens**: Radius scale (`6px` → `16px`), shadows, transitions (`cubic-bezier(0.4, 0, 0.2, 1)`), and spacing follow a strict system

### ✨ Micro-Animations & Polish
- **Parallax hero** with a custom scroll-driven `--parallax-y` CSS variable
- **Intersection Observer** fade-in animations with staggered delays
- **Navbar blur effect** on scroll (glassmorphism via `backdrop-filter`)
- **Hover transforms** on pricing cards, buttons, and history entries
- **Animated scroll indicator** with keyframe pulse
- **Rest timer** with an SVG ring progress animation

### 📱 Fully Responsive
- **Desktop**: Fixed sidebar navigation with icon + label layout
- **Mobile**: Bottom tab bar with `env(safe-area-inset-bottom)` for notch-safe padding
- **Tablet**: Graceful grid collapse from 3-column pricing to single-column
- **Hamburger menu** with animated open/close transforms

### 🏋️ App Feature Set
| View | Description |
|------|-------------|
| **Dashboard** | Stat cards (workouts, total volume, streaks) + recent workout list |
| **Workout Logger** | Editable workout name, exercise search dropdown, sets table with weight/reps inputs, completion checkmarks |
| **History** | Expandable workout cards with full set-by-set detail tables |
| **Analytics** | Chart.js-powered volume trend and 1RM progression charts, personal records table |
| **Settings** | Unit toggle (kg/lbs), rest timer duration, data management |
| **Rest Timer** | Modal with SVG circular progress ring, ±15s adjustment buttons |

### 🗂 Minimal, Clean Architecture
```
stack_fitness_tracker/
├── index.html          # Landing page
├── index.css           # Landing page styles (733 lines)
├── script.js           # Landing page JS (navbar, scroll, form, parallax)
├── app.html            # Workout tracker SPA shell
├── app.css             # App styles (1247 lines)
├── app.js              # App logic (views, data, charts) — in development
└── assets/
    └── hero-bg.png     # Hero section background image
```

### 📊 Data & Client-Side Storage
All workout data lives in `localStorage` — no backend required. The app works fully offline after the first page load.

### 🔍 SEO-Ready Landing Page
- Semantic HTML5 structure
- Descriptive `<title>` and `<meta description>`
- Proper heading hierarchy (`h1` → `h2`)
- Accessible form labels and ARIA attributes

---

## Getting Started

No build step required. Simply open the files in a browser:

```bash
# Option 1: Open directly
open index.html

# Option 2: Use any static server
npx serve .
```

- **Landing Page**: Open `index.html`
- **Tracker App**: Open `app.html` (or click the "STACK" logo in the sidebar to navigate)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Structure | HTML5 (semantic) |
| Styling | Vanilla CSS (custom properties, Grid, Flexbox) |
| Logic | Vanilla JavaScript (ES6+) |
| Charts | Chart.js 4.x (CDN) |
| Fonts | Google Fonts (Inter, Space Grotesk) |
| Storage | localStorage |

---

## License

© 2026 STACK Fitness. All rights reserved.
