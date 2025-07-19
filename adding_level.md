# Adding New Levels to Signpost Observatory

> A comprehensive guide for creating standalone VR levels that can be easily integrated into the Signpost Observatory project. This guide is designed for both human developers and AI assistants.

## 🎯 Overview

The Signpost Observatory is a Flask-based VR gateway that uses A-Frame for 3D experiences. New levels are added by:
1. Creating a standalone HTML file in the `public/` directory
2. Adding portal configuration to `portal_config.py`
3. Optionally adding shared components and assets

## 📁 Project Structure

```
Signpost/
├── app.py                    # Flask server (main entry point)
├── portal_config.py          # Portal/level configuration
├── requirements.txt          # Python dependencies
├── public/                  # Static files served by Flask
│   ├── index.html           # Main VR gateway
│   ├── your-level.html      # Your new level file
│   └── assets/              # Images, audio, textures
├── shared/                  # Reusable components
│   ├── components/          # A-Frame components
│   ├── styles/             # CSS files
│   └── utils/              # JavaScript utilities
└── docs/                   # Documentation
```

## 🚀 Quick Start: Creating Your First Level

### Step 1: Create the HTML File

Create a new file in `public/` directory (e.g., `public/my-level.html`):

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>My Level - Signpost Observatory</title>
    <meta name="description" content="Description of your level">
    <script src="https://aframe.io/releases/1.4.0/aframe.min.js"></script>
    <style>
        body {
            font-family: 'Georgia', serif;
            margin: 0;
            background: #0a0a0a;
        }
        
        .ui-overlay {
            position: fixed;
            top: 20px;
            left: 20px;
            color: #e0e0e0;
            font-size: 14px;
            z-index: 1000;
            background: rgba(0,0,0,0.7);
            padding: 15px;
            border-radius: 8px;
            max-width: 300px;
        }
        
        .controls {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            color: #ccc;
            text-align: center;
            z-index: 1000;
            background: rgba(0,0,0,0.7);
            padding: 10px 20px;
            border-radius: 20px;
        }
    </style>
</head>
<body>
    <div class="ui-overlay">
        <h3>My Level Title</h3>
        <p>Description of what this level does</p>
    </div>
    
    <div class="controls">
        <p>WASD to move • Mouse to look • ESC to return to gateway</p>
    </div>

    <a-scene 
        vr-mode-ui="enabled: true" 
        embedded 
        style="height: 100vh; width: 100vw;"
        background="color: #001122"
        fog="type: exponential; color: #001122; density: 0.0025"
        loading-screen="enabled: false">
        
        <!-- Assets -->
        <a-assets>
            <!-- Add your assets here -->
        </a-assets>

        <!-- Environment -->
        <a-plane 
            position="0 0 0" 
            rotation="-90 0 0" 
            width="50" 
            height="50" 
            material="color: #001a33">
        </a-plane>
        
        <!-- Your 3D content goes here -->
        
        <!-- Return to gateway portal -->
        <a-box 
            position="0 1 10" 
            width="2" 
            height="3" 
            depth="0.3"
            material="color: #4488cc; emissive: #112233"
            onclick="window.location.href='/'"
            class="clickable">
            
            <a-text
                position="0 0 0.2"
                text="value: Return to Gateway; color: #ffffff; align: center; width: 4">
            </a-text>
        </a-box>
        
        <!-- Camera -->
        <a-entity position="0 1.6 0">
            <a-camera look-controls="enabled: true" wasd-controls="enabled: true"></a-camera>
        </a-entity>
    </a-scene>
</body>
</html>
```

### Step 2: Add Portal Configuration

Add your level to `portal_config.py`:

```python
# Add this to the PORTAL_CONFIG dictionary
'my-level': {
    'id': 'my-level',
    'title': 'My Level Title',
    'description': 'Brief description of your level',
    'position': {'x': 8, 'y': 1, 'z': -8},  # Adjust position as needed
    'color': '#cc4488',  # Choose a unique color
    'status': 'ready',  # Options: development, ready, live
    'project_data': {
        'title': 'My Level Full Title',
        'description': 'Detailed description of what this level contains...',
        'features': ['Feature 1', 'Feature 2', 'Feature 3'],
        'status': 'ready',
        'eta': 'Now',
        'progress': 100
    }
}
```

### Step 3: Test Your Level

1. Start the Flask server: `python app.py`
2. Open `http://localhost:5000` in your browser
3. Click on your new portal to enter your level
4. Test navigation and interactions

## 🎨 Level Design Guidelines

### Visual Design
- **Color Scheme**: Use dark backgrounds (#001122, #0a0a0a) for consistency
- **Typography**: Georgia serif font for text elements
- **Lighting**: Use emissive materials for glowing effects
- **Scale**: Keep objects at human scale (1.6 units = average height)

### Interaction Design
- **Navigation**: Always include WASD movement and mouse look
- **Return Portal**: Include a way to return to the main gateway
- **UI Overlay**: Provide context and instructions
- **Accessibility**: Consider mobile/desktop compatibility

### Performance
- **Asset Optimization**: Compress textures and audio files
- **Polygon Count**: Keep 3D models under 10,000 polygons
- **Lighting**: Use baked lighting when possible
- **Loading**: Show loading screens for large assets

## 🔧 Advanced Features

### Using Shared Components

Include shared components in your level:

```html
<!-- Add to your HTML head -->
<script src="/shared/components/portal-system.js"></script>
<script src="/shared/components/navigation.js"></script>
<script src="/shared/components/ui-overlay.js"></script>

<!-- Use in your scene -->
<a-entity portal-system="target: /my-level"></a-entity>
```

### Adding Audio

```html
<a-assets>
    <audio id="ambient-sound" src="/assets/audio/ambient.mp3" preload="auto" loop></audio>
</a-assets>

<!-- Play audio on interaction -->
<a-box onclick="document.querySelector('#ambient-sound').play()"></a-box>
```

### Interactive Elements

```html
<!-- Clickable object -->
<a-box 
    position="0 1 5" 
    material="color: #ff4444"
    class="clickable"
    onclick="handleClick()">
</a-box>

<script>
function handleClick() {
    console.log('Object clicked!');
    // Add your interaction logic here
}
</script>
```

### Data Integration

```html
<!-- Fetch data from Flask API -->
<script>
fetch('/api/projects/my-level')
    .then(response => response.json())
    .then(data => {
        console.log('Level data:', data);
        // Use data to populate your scene
    });
</script>
```

## 📋 Level Template

Use this template for consistent level creation:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{LEVEL_TITLE}} - Signpost Observatory</title>
    <meta name="description" content="{{LEVEL_DESCRIPTION}}">
    <script src="https://aframe.io/releases/1.4.0/aframe.min.js"></script>
    
    <!-- Shared Components -->
    <script src="/shared/components/portal-system.js"></script>
    <script src="/shared/components/navigation.js"></script>
    
    <style>
        body {
            font-family: 'Georgia', serif;
            margin: 0;
            background: #0a0a0a;
        }
        
        .ui-overlay {
            position: fixed;
            top: 20px;
            left: 20px;
            color: #e0e0e0;
            font-size: 14px;
            z-index: 1000;
            background: rgba(0,0,0,0.7);
            padding: 15px;
            border-radius: 8px;
            max-width: 300px;
        }
        
        .controls {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            color: #ccc;
            text-align: center;
            z-index: 1000;
            background: rgba(0,0,0,0.7);
            padding: 10px 20px;
            border-radius: 20px;
        }
    </style>
</head>
<body>
    <div class="ui-overlay">
        <h3>{{LEVEL_TITLE}}</h3>
        <p>{{LEVEL_DESCRIPTION}}</p>
        <p><strong>Instructions:</strong> {{INSTRUCTIONS}}</p>
    </div>
    
    <div class="controls">
        <p>WASD to move • Mouse to look • ESC to return to gateway</p>
    </div>

    <a-scene 
        vr-mode-ui="enabled: true" 
        embedded 
        style="height: 100vh; width: 100vw;"
        background="color: #001122"
        fog="type: exponential; color: #001122; density: 0.0025"
        loading-screen="enabled: false">
        
        <!-- Assets -->
        <a-assets>
            <!-- Add your assets here -->
        </a-assets>

        <!-- Environment -->
        <a-plane 
            position="0 0 0" 
            rotation="-90 0 0" 
            width="50" 
            height="50" 
            material="color: #001a33">
        </a-plane>
        
        <!-- Your 3D content goes here -->
        
        <!-- Return to gateway portal -->
        <a-box 
            position="0 1 10" 
            width="2" 
            height="3" 
            depth="0.3"
            material="color: #4488cc; emissive: #112233"
            onclick="window.location.href='/'"
            class="clickable">
            
            <a-text
                position="0 0 0.2"
                text="value: Return to Gateway; color: #ffffff; align: center; width: 4">
            </a-text>
        </a-box>
        
        <!-- Camera -->
        <a-entity position="0 1.6 0">
            <a-camera look-controls="enabled: true" wasd-controls="enabled: true"></a-camera>
        </a-entity>
    </a-scene>
    
    <script>
        // Your level-specific JavaScript goes here
        console.log('{{LEVEL_TITLE}} loaded successfully');
    </script>
</body>
</html>
```

## 🎯 Example: Quote Cloud Navigator

Here's a complete example of a simple level:

### HTML File (`public/quote-cloud.html`)

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Quote Cloud Navigator - Signpost Observatory</title>
    <meta name="description" content="Navigate through 3D space filled with meaningful quotes">
    <script src="https://aframe.io/releases/1.4.0/aframe.min.js"></script>
    <style>
        body {
            font-family: 'Georgia', serif;
            margin: 0;
            background: #0a0a0a;
        }
        
        .ui-overlay {
            position: fixed;
            top: 20px;
            left: 20px;
            color: #e0e0e0;
            font-size: 14px;
            z-index: 1000;
            background: rgba(0,0,0,0.7);
            padding: 15px;
            border-radius: 8px;
            max-width: 300px;
        }
    </style>
</head>
<body>
    <div class="ui-overlay">
        <h3>Quote Cloud Navigator</h3>
        <p>Float through 3D space filled with meaningful quotes from your writing.</p>
        <p>Click on quotes to read the full article.</p>
    </div>

    <a-scene 
        vr-mode-ui="enabled: true" 
        embedded 
        style="height: 100vh; width: 100vw;"
        background="color: #001122"
        fog="type: exponential; color: #001122; density: 0.0025">
        
        <!-- Environment -->
        <a-plane 
            position="0 0 0" 
            rotation="-90 0 0" 
            width="100" 
            height="100" 
            material="color: #001a33">
        </a-plane>
        
        <!-- Quote 1 -->
        <a-box 
            position="5 2 5" 
            width="3" 
            height="2" 
            depth="0.1"
            material="color: #00aa66; emissive: #003311"
            class="clickable"
            onclick="showQuote('All we can be now is the signposts for tomorrow...')">
            
            <a-text
                position="0 0 0.06"
                text="value: All we can be now is the signposts for tomorrow...; color: #ffffff; align: center; width: 4">
            </a-text>
        </a-box>
        
        <!-- Quote 2 -->
        <a-box 
            position="-3 3 8" 
            width="3" 
            height="2" 
            depth="0.1"
            material="color: #aa0066; emissive: #330022"
            class="clickable"
            onclick="showQuote('When the code listens better than the teacher...')">
            
            <a-text
                position="0 0 0.06"
                text="value: When the code listens better than the teacher...; color: #ffffff; align: center; width: 4">
            </a-text>
        </a-box>
        
        <!-- Return portal -->
        <a-box 
            position="0 1 15" 
            width="2" 
            height="3" 
            depth="0.3"
            material="color: #4488cc; emissive: #112233"
            onclick="window.location.href='/'"
            class="clickable">
            
            <a-text
                position="0 0 0.2"
                text="value: Return to Gateway; color: #ffffff; align: center; width: 4">
            </a-text>
        </a-box>
        
        <!-- Camera -->
        <a-entity position="0 1.6 0">
            <a-camera look-controls="enabled: true" wasd-controls="enabled: true"></a-camera>
        </a-entity>
    </a-scene>
    
    <script>
        function showQuote(quote) {
            alert('Quote: ' + quote + '\n\nFull article would open here.');
        }
    </script>
</body>
</html>
```

### Portal Configuration

Add to `portal_config.py`:

```python
'quote-cloud': {
    'id': 'quote-cloud',
    'title': 'Quote Cloud Navigator',
    'description': 'Navigate through 3D space filled with meaningful quotes',
    'position': {'x': 10, 'y': 1, 'z': -10},
    'color': '#00aa66',
    'status': 'ready',
    'project_data': {
        'title': 'Quote Cloud Navigator',
        'description': 'Float through 3D space filled with meaningful quotes from your writing. Each quote is a clickable portal to the full article.',
        'features': ['3D Navigation', 'Interactive Quotes', 'Article Links', 'Immersive Reading'],
        'status': 'ready',
        'eta': 'Now',
        'progress': 100
    }
}
```

## 🔧 Development Workflow

### 1. Planning
- Define the core concept and educational message
- Sketch the 3D space layout
- Identify required assets and interactions
- Plan the user experience flow

### 2. Development
- Create the HTML file using the template
- Add portal configuration
- Test basic navigation and interactions
- Add assets and refine visuals

### 3. Testing
- Test on desktop browsers (Chrome/Firefox)
- Test VR mode if available
- Check mobile compatibility
- Verify performance and loading times

### 4. Integration
- Add to portal configuration
- Test integration with main gateway
- Update documentation
- Share for feedback

## 🎨 Asset Guidelines

### File Organization
```
public/assets/
├── audio/
│   ├── ambient.mp3
│   └── effects/
├── textures/
│   ├── materials/
│   └── environments/
└── models/
    ├── objects/
    └── characters/
```

### Asset Requirements
- **Audio**: MP3 format, 44.1kHz, 128kbps minimum
- **Textures**: PNG/JPG, 512x512 to 2048x2048 pixels
- **Models**: GLTF/GLB format preferred, under 10MB
- **Optimization**: Compress all assets for web delivery

## 🚀 Deployment Checklist

Before adding your level to the main project:

- [ ] HTML file is complete and functional
- [ ] Portal configuration is added to `portal_config.py`
- [ ] All assets are optimized and properly linked
- [ ] Navigation works correctly (WASD + mouse)
- [ ] Return to gateway portal is included
- [ ] UI overlay provides clear instructions
- [ ] Performance is acceptable (60fps target)
- [ ] Mobile compatibility tested
- [ ] VR mode tested (if applicable)
- [ ] Documentation is updated

## 🎯 AI Assistant Instructions

When creating levels for this project:

1. **Use the template structure** provided above
2. **Follow the visual design guidelines** (dark theme, Georgia font)
3. **Include proper navigation** (WASD + mouse controls)
4. **Add a return portal** to the main gateway
5. **Provide clear UI instructions** in the overlay
6. **Optimize for performance** (keep polygon counts low)
7. **Test the integration** with the Flask server
8. **Document any special features** or interactions

### Example AI Prompt:
"Create a VR level for the Signpost Observatory that [describe your concept]. The level should be educational, interactive, and follow the project's design guidelines. Include proper navigation, a return portal, and clear instructions."

## 📚 Additional Resources

- **A-Frame Documentation**: https://aframe.io/docs/
- **Flask Documentation**: https://flask.palletsprojects.com/
- **WebGL Best Practices**: https://webglfundamentals.org/
- **VR Design Guidelines**: https://developer.oculus.com/documentation/

---

*This guide ensures that all levels maintain consistency with the Signpost Observatory's mission of exploring education, democracy, human connection, and data analysis through immersive VR experiences.*
