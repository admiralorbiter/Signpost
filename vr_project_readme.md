# The Signpost Observatory - VR Gateway Project

> "All we can be now is the signposts for tomorrow and those that come after"

A WebXR gateway built with A-Frame that serves as the entry point to a collection of VR experiences.

## Project Structure

```
vr-gateway/
├── README.md
├── index.html                 # Main gateway experience
├── assets/
│   ├── audio/
│   │   ├── ambient-observatory.mp3
│   │   └── portal-hum.mp3
│   ├── textures/
│   │   ├── grid-floor.png
│   │   └── particle-glow.png
│   └── models/
│       └── (future 3D assets)
├── projects/
│   ├── education/
│   ├── connection/
│   └── analysis/
├── shared/
│   ├── components/
│   │   ├── portal-system.js
│   │   ├── navigation.js
│   │   └── ui-overlay.js
│   ├── styles/
│   │   └── common.css
│   └── utils/
│       └── voice-analysis.js
└── docs/
    ├── development-guide.md
    ├── voice-guidelines.md
    └── project-roadmap.md
```

## Quick Start

1. **Clone/Download** the project
2. **Open `index.html`** in a modern browser (Chrome, Firefox, Edge)
3. **Enter VR** by clicking the VR goggles icon (if you have a headset)
4. **Navigate** using WASD keys and mouse look
5. **Click portals** to enter different project spaces

## Core Philosophy

This VR gateway reflects the analytical yet empathetic voice found in the source writing - creating spaces that are:

- **Intellectually rigorous** but accessible
- **Urgent and purposeful** without being overwhelming  
- **Personal yet universal** in scope
- **Philosophically grounded** while remaining practical

## Portal Destinations

### 🎓 Education Portal
**Future VR Experiences:**


### 🤝 Connection Portal
**Future VR Experiences:**

### 📊 Analysis Portal
**Future VR Experiences:**


## Technical Stack

- **A-Frame 1.4.0** - WebXR framework
- **WebXR APIs** - Cross-platform VR support
- **Vanilla JavaScript** - Portal interactions and navigation
- **CSS3** - UI overlays and responsive design
- **HTML5 Audio** - Ambient soundscapes

## Development Roadmap

### Phase 1: Foundation ✅
- [x] Main gateway experience
- [x] Portal navigation system
- [x] Basic atmospheric design
- [x] Project structure setup


## Browser Support

- **Chrome/Chromium** - Full WebXR support
- **Firefox** - Full WebXR support  
- **Safari** - Basic WebGL support (no VR)
- **Mobile browsers** - Limited but functional

## Local Development

No build process required - just open `index.html` in your browser. For HTTPS (required for some WebXR features):

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server

# Using PHP
php -S localhost:8000
```

## Future Integrations

---

*This project serves as both a technical portfolio piece and a philosophical statement about the intersection of technology, education, and human connection in our rapidly changing world.*