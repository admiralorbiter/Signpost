# Development Guide - The Signpost Observatory

This guide provides comprehensive information for developers working on the VR Gateway project.

## Table of Contents
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Core Components](#core-components)
- [Development Workflow](#development-workflow)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)

## Getting Started

### Prerequisites
- Modern browser with WebXR support (Chrome/Firefox recommended)
- Basic understanding of A-Frame, HTML5, CSS3, and JavaScript
- Text editor or IDE (VS Code recommended)
- Local development server (optional but recommended)

### Quick Setup
1. Clone or download the project
2. Open `index.html` in your browser for basic testing
3. For HTTPS (required for some WebXR features):
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```

### Development Environment
- **Browser DevTools**: Essential for debugging VR experiences
- **A-Frame Inspector**: Press `Ctrl+Alt+I` in the browser for 3D scene debugging
- **WebXR Emulator**: Browser extension for testing VR without hardware

## Project Structure

```
vr-gateway/
├── index.html                 # Main gateway experience
├── assets/                    # Media assets
│   ├── audio/                 # Sound files and ambient audio
│   ├── textures/              # Image textures and materials
│   └── models/                # 3D models and assets
├── shared/                    # Reusable components and utilities
│   ├── components/            # A-Frame custom components
│   ├── styles/                # CSS stylesheets
│   └── utils/                 # JavaScript utilities
├── projects/                  # Individual VR project spaces
│   ├── education/             # Education portal content
│   ├── connection/            # Social connection experiences
│   └── analysis/              # Data analysis visualizations
└── docs/                      # Documentation files
```

## Core Components

### Portal System (`shared/components/portal-system.js`)
Handles navigation between different VR experiences.

**Usage:**
```html
<a-entity 
  portal-system="destination: education; title: Education Portal; description: Learning experiences"
  geometry="primitive: box" 
  material="color: #4CC3D9">
</a-entity>
```

**Properties:**
- `destination`: Target location or URL
- `title`: Display name for the portal
- `description`: Brief description for UI
- `color`: Portal color theme

### Navigation (`shared/components/navigation.js`)
Enhanced movement and teleportation controls.

**Features:**
- WASD + mouse look controls
- VR teleportation
- Keyboard shortcuts (R=reset, F=fly, T=teleport, ESC=help)
- Position tracking and notifications

### UI Overlay (`shared/components/ui-overlay.js`)
Manages 2D interface elements and HUD.

**Features:**
- Loading screen
- FPS counter (Ctrl+F to toggle)
- Position tracker (Ctrl+P to toggle)
- Instructions panel (Ctrl+I to toggle)
- Notification system

### Voice Analysis (`shared/utils/voice-analysis.js`)
Speech recognition and voice commands.

**Commands:**
- "go home" - Reset camera position
- "education/connection/analysis" - Navigate to portals
- "enter vr/exit vr" - VR mode toggle
- "help" - Show available commands

## Development Workflow

### 1. Planning Phase
- Review project roadmap
- Define user stories
- Create mockups/wireframes
- Plan technical implementation

### 2. Development Phase
- Create feature branch
- Implement functionality
- Test in multiple browsers
- Test with VR hardware when available

### 3. Testing Phase
- Cross-browser testing
- VR hardware testing
- Performance profiling
- User experience testing

### 4. Integration Phase
- Code review
- Merge to main branch
- Update documentation
- Deploy to production

### File Organization
```
feature-branch/
├── index.html              # Update main file if needed
├── shared/components/      # Add new A-Frame components here
├── shared/styles/         # Add CSS for styling
├── shared/utils/          # Add JavaScript utilities
├── assets/                # Add media assets
└── docs/                  # Update documentation
```

## A-Frame Component Development

### Creating Custom Components
```javascript
AFRAME.registerComponent('my-component', {
  schema: {
    property: {type: 'string', default: 'value'}
  },

  init: function () {
    // Component initialization
  },

  update: function () {
    // Called when properties change
  },

  tick: function (time, timeDelta) {
    // Called every frame
  },

  remove: function () {
    // Cleanup when component removed
  }
});
```

### Best Practices
1. **Performance**: Use `tick` sparingly, prefer event-driven updates
2. **Memory**: Clean up event listeners in `remove()`
3. **Modularity**: Keep components focused on single responsibilities
4. **Reusability**: Make components configurable via schema
5. **Documentation**: Include clear usage examples

## Testing

### Browser Testing
| Browser | WebXR Support | Notes |
|---------|---------------|-------|
| Chrome | Full | Recommended for development |
| Firefox | Full | Good alternative |
| Safari | Limited | Basic WebGL only |
| Edge | Full | Chromium-based |

### VR Hardware Testing
- **Oculus Quest/Quest 2**: Primary target platform
- **HTC Vive**: Desktop VR testing
- **Windows Mixed Reality**: Alternative platform
- **Mobile VR**: Google Cardboard compatibility

### Performance Targets
- **Desktop**: 90 FPS for smooth VR experience
- **Mobile**: 60 FPS minimum
- **Loading**: Under 5 seconds initial load
- **Memory**: Under 512MB usage on mobile

### Testing Checklist
- [ ] Loads without errors in all browsers
- [ ] VR mode enters/exits correctly
- [ ] All portals are clickable/interactive
- [ ] Voice commands work (if enabled)
- [ ] UI scales properly on mobile
- [ ] Performance meets targets
- [ ] No accessibility barriers

## Performance Optimization

### Best Practices
1. **Geometry**: Use low-poly models, optimize vertex count
2. **Textures**: Compress images, use appropriate sizes
3. **Materials**: Minimize shader complexity
4. **Lighting**: Limit dynamic lights, use baked lighting
5. **Audio**: Compress audio files, use spatial audio

### Monitoring Tools
```javascript
// Enable performance monitoring
document.querySelector('a-scene').setAttribute('stats', '');

// Custom FPS monitoring
setInterval(() => {
  const stats = document.querySelector('a-scene').systems.stats;
  console.log('FPS:', stats.fps);
}, 1000);
```

## Deployment

### Static Hosting
The project is designed for static hosting on:
- GitHub Pages
- Netlify
- Vercel
- AWS S3 + CloudFront

### HTTPS Requirements
WebXR requires HTTPS for:
- VR device access
- Microphone access (voice commands)
- Secure contexts

### Build Process
No build process required - pure HTML/CSS/JS:
1. Test locally
2. Commit changes
3. Push to repository
4. Deploy via hosting platform

### Environment Variables
For production deployment:
```javascript
const CONFIG = {
  production: window.location.hostname !== 'localhost',
  debug: !window.location.hostname !== 'localhost',
  analytics: 'your-analytics-id'
};
```

## Contributing

### Code Standards
- **JavaScript**: ES6+, no frameworks required
- **CSS**: Modern CSS3, use CSS custom properties
- **HTML**: Semantic HTML5, accessibility considered
- **A-Frame**: Follow A-Frame best practices

### Commit Messages
```
feat: add new portal navigation system
fix: resolve VR teleportation bug
docs: update development guide
style: improve mobile responsive design
test: add cross-browser testing suite
```

### Pull Request Process
1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Update documentation
5. Submit pull request
6. Address review feedback

### Code Review Checklist
- [ ] Code follows project standards
- [ ] All tests pass
- [ ] Documentation updated
- [ ] Performance impact considered
- [ ] Accessibility tested
- [ ] Cross-browser compatible

## Troubleshooting

### Common Issues

**VR Not Working:**
- Check HTTPS requirement
- Verify WebXR browser support
- Test with WebXR emulator first

**Performance Issues:**
- Monitor FPS counter
- Check browser DevTools performance tab
- Reduce polygon count in models
- Optimize texture sizes

**Audio Issues:**
- Check browser audio permissions
- Verify HTTPS for microphone access
- Test with different audio formats

**Mobile Issues:**
- Test on actual devices
- Check viewport meta tag
- Verify touch event handling

### Debug Tools
```javascript
// Enable A-Frame debug mode
AFRAME.log.setLevel('debug');

// Monitor component events
document.addEventListener('componentchanged', (event) => {
  console.log('Component changed:', event.detail);
});

// Track entity lifecycle
document.addEventListener('loaded', (event) => {
  console.log('Entity loaded:', event.target);
});
```

## Resources

### A-Frame Documentation
- [A-Frame School](https://aframe.io/aframe-school/)
- [A-Frame Registry](https://aframe.io/aframe-registry/)
- [A-Frame Community](https://aframe.io/community/)

### WebXR Resources
- [WebXR Device API](https://immersive-web.github.io/webxr/)
- [WebXR Samples](https://immersive-web.github.io/webxr-samples/)
- [WebXR Emulator](https://github.com/MozillaReality/WebXR-emulator-extension)

### Learning Resources
- [Three.js Fundamentals](https://threejsfundamentals.org/)
- [WebGL Fundamentals](https://webglfundamentals.org/)
- [VR Design Guidelines](https://developer.oculus.com/design/)

---

*For questions or support, create an issue in the project repository or reach out*