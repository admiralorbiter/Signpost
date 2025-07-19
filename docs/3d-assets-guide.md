# 3D Assets Guide - Signpost Observatory

## 🎯 Overview

This guide covers how to use 3D models (GLB/GLTF files) in the Signpost Observatory project. The system supports building models, props, environment objects, and interactive elements. We use AI-powered 3D generation tools to create custom assets for the project.

## 🤖 AI-Powered 3D Generation Sources

### Primary Generation Tools

#### 1. **Shap-E** - Text-to-3D Generation
- **Source**: [Hugging Face Space](https://huggingface.co/spaces/hysts/Shap-E)
- **Use Case**: Generate 3D models from text descriptions
- **Best For**: Props, environmental objects, abstract shapes
- **Workflow**:
  1. Visit the Shap-E space
  2. Enter text description (e.g., "a futuristic observatory building")
  3. Generate and download the GLB file
  4. Optimize for web use (reduce polygons, compress textures)
  5. Add to project assets

#### 2. **Hunyuan3D-2** - Advanced 3D Asset Generation
- **Source**: [Hugging Face Model](https://huggingface.co/tencent/Hunyuan3D-2)
- **Use Case**: High-quality textured 3D assets from images or text
- **Best For**: Buildings, complex structures, detailed props
- **Features**:
  - Two-stage generation (shape + texture)
  - High-resolution textured outputs
  - Image-to-3D and text-to-3D capabilities
  - Professional-grade quality
- **Workflow**:
  1. Use the Hunyuan3D-2 model via API or Gradio app
  2. Generate mesh from text or image input
  3. Apply texture synthesis for realistic appearance
  4. Export as GLB format
  5. Optimize for web performance

### Generation Workflow

```bash
# 1. Generate with Shap-E (for props/environment)
# Visit: https://huggingface.co/spaces/hysts/Shap-E
# Input: "a giant cat statue"
# Download: cat.glb

# 2. Generate with Hunyuan3D-2 (for buildings)
# Visit: https://huggingface.co/tencent/Hunyuan3D-2
# Input: "futuristic observatory building"
# Download: observatory.glb

# 3. Add to project
cp generated-model.glb public/assets/models/buildings/
cp generated-prop.glb public/assets/models/props/
```

### Optimization After Generation

```javascript
// AI-generated models often need optimization
// 1. Reduce polygon count (target: <10k for buildings, <5k for props)
// 2. Compress textures (1024x1024 max for props, 2048x2048 for buildings)
// 3. Center at origin (0,0,0)
// 4. Add collision geometry if needed
// 5. Test in browser for performance
```

## 📁 Asset Directory Structure

```
public/assets/models/
├── buildings/          # Building models (observatory, library, etc.)
├── props/             # Interactive props and objects
├── environment/       # Environmental objects (trees, rocks, etc.)
├── characters/        # Character models (future use)
└── vehicles/          # Vehicle models (future use)
```

## 🚀 Quick Start

### 1. Add Your Building Model

1. **Place your .glb file** in the appropriate directory:
   ```bash
   # For a building model
   cp your-building.glb public/assets/models/buildings/observatory.glb
   
   # For a prop
   cp your-prop.glb public/assets/models/props/interactive-object.glb
   ```

2. **Update the asset reference** in `public/index.html`:
   ```html
   <!-- In the a-assets section -->
   <a-asset-item id="your-building" src="/assets/models/buildings/your-building.glb"></a-asset-item>
   
   <!-- In the scene -->
   <a-entity 
       id="your-building-entity"
       position="0 0 0"
       scale="1 1 1"
       building-component="buildingType: your-type; scale: 1.0; interactive: true"
       gltf-model="#your-building"
       shadow="cast: true; receive: true">
   </a-entity>
   ```

### 2. Using the Asset Manager

```javascript
// Load a building model
const building = await window.assetManager.loadAsset('/assets/models/buildings/observatory.glb', {
    scale: 1.0,
    position: { x: 0, y: 0, z: 0 }
});

// Create a building entity
const buildingEntity = window.assetManager.createBuildingEntity('observatory', {
    position: { x: 10, y: 0, z: 0 },
    scale: 2.0,
    components: {
        'clickable': 'enabled: true',
        'grabbable': 'enabled: false'
    }
});

// Add to scene
document.querySelector('a-scene').appendChild(buildingEntity);
```

## 🏗️ Building Component

The `building-component` provides specialized functionality for building models:

### Schema Options

```javascript
building-component="
    buildingType: observatory;           // Type of building
    scale: 1.0;                         // Scale factor
    position: 0 0 0;                    // Position
    rotation: 0 0 0;                    // Rotation
    interactive: true;                   // Enable interactions
    clickable: true;                     // Enable clicking
    hoverable: true                      // Enable hover effects
"
```

### Building Types

- **observatory**: Special observatory effects and interactions
- **library**: Library-specific effects and interactions  
- **laboratory**: Laboratory effects and interactions
- **gallery**: Gallery effects and interactions
- **custom**: Default building behavior

### Events

```javascript
// Listen for building events
document.addEventListener('building-loaded', (event) => {
    console.log('Building loaded:', event.detail.buildingType);
});

document.addEventListener('building-clicked', (event) => {
    console.log('Building clicked:', event.detail.buildingType);
});

document.addEventListener('building-hover', (event) => {
    console.log('Building hover:', event.detail.buildingType);
});

// Building-specific events
document.addEventListener('observatory-activated', (event) => {
    console.log('Observatory activated!');
});
```

## 📦 Asset Manager Features

### Loading Assets

```javascript
// Basic asset loading
const asset = await window.assetManager.loadAsset('/path/to/model.glb');

// With options
const asset = await window.assetManager.loadAsset('/path/to/model.glb', {
    scale: 2.0,
    position: { x: 10, y: 0, z: 0 },
    onProgress: (progress) => {
        console.log('Loading progress:', progress);
    }
});
```

### Preloading Multiple Assets

```javascript
const assetsToPreload = [
    { path: '/assets/models/buildings/observatory.glb', options: { scale: 1.0 } },
    { path: '/assets/models/props/table.glb', options: { scale: 0.5 } },
    { path: '/assets/models/environment/tree.glb', options: { scale: 2.0 } }
];

const loadedAssets = await window.assetManager.preloadAssets(assetsToPreload);
console.log('Preloaded assets:', loadedAssets.length);
```

### Asset Statistics

```javascript
const stats = window.assetManager.getStats();
console.log('Asset Manager Stats:', stats);
// {
//     loadedAssets: 5,
//     loadingAssets: 0,
//     cachedAssets: 5,
//     maxCacheSize: 50
// }
```

## 🎨 Supported File Formats

### Primary Formats
- **GLB** (Recommended): Binary GLTF format, most efficient
- **GLTF**: JSON-based format, good for development

### Fallback Formats
- **OBJ**: Basic geometry format
- **FBX**: Autodesk format (limited support)

### File Size Guidelines
- **Buildings**: < 10MB for optimal performance
- **Props**: < 2MB for interactive objects
- **Environment**: < 5MB for environmental objects

## 🔧 Optimization Tips

### Model Optimization
1. **Reduce polygon count** for real-time performance
2. **Optimize textures** (1024x1024 max for props, 2048x2048 for buildings)
3. **Use compressed textures** (KTX2, DDS)
4. **Remove unused materials** and animations
5. **Center the model** at origin (0,0,0)

### Loading Optimization
```javascript
// Preload critical assets
const criticalAssets = [
    { path: '/assets/models/buildings/observatory.glb', options: { scale: 1.0 } }
];

// Load in background
window.assetManager.preloadAssets(criticalAssets).then(() => {
    console.log('Critical assets ready');
});
```

## 🐛 Troubleshooting

### Common Issues

#### Model Not Loading
```javascript
// Check if file exists
fetch('/assets/models/buildings/your-model.glb')
    .then(response => {
        if (!response.ok) {
            console.error('Model file not found');
        }
    });

// Check console for CORS errors
// Ensure file is in correct directory
```

#### Model Too Large/Small
```javascript
// Adjust scale in building component
building-component="scale: 0.5"  // Make smaller
building-component="scale: 2.0"  // Make larger
```

#### Model Not Interactive
```javascript
// Ensure building component is enabled
building-component="interactive: true; clickable: true; hoverable: true"

// Check if model has collision geometry
// Add physics body if needed
```

##### Shap-E Models
- **Black/Invisible Models**: Check materials and lighting
  ```javascript
  // Add ambient lighting for Shap-E models
  <a-light type="ambient" intensity="0.6"></a-light>
  ```

- **Poor Textures**: Shap-E models may have basic materials
  ```javascript
  // Add material component for better appearance
  material="shader: standard; metalness: 0.8; roughness: 0.2"
  ```

##### Hunyuan3D-2 Models
- **High Polygon Count**: May need optimization
  ```javascript
  // Monitor performance in browser dev tools
  // Consider reducing polygon count in 3D software
  ```
- **Large File Size**: Compress textures and optimize
  ```javascript
  // Use texture compression tools
  // Reduce texture resolution if needed
  ```
- **Complex Materials**: May not render properly in A-Frame
  ```javascript
  // Simplify materials for web compatibility
  material="shader: flat; color: #ffffff"
  ```

### Current Project Assets

```javascript
// Debug asset manager
window.assetManager.debug();

// Check loaded assets
console.log('Loaded assets:', window.assetManager.assets);

// Clear cache if needed
window.assetManager.clearCache();
```

## 📋 Example: Adding a New Building

### Step 1: Prepare Your Model
1. Export as GLB format
2. Optimize for web (reduce polygons, compress textures)
3. Center at origin
4. Name descriptively (e.g., `library-building.glb`)

### Step 2: Add to Project
```bash
# Copy to buildings directory
cp library-building.glb public/assets/models/buildings/
```

### Step 3: Update HTML
```html
<!-- In a-assets section -->
<a-asset-item id="library-building" src="/assets/models/buildings/library-building.glb"></a-asset-item>

<!-- In buildings-container -->
<a-entity 
    id="library-building-entity"
    position="20 0 0"
    scale="1 1 1"
    building-component="buildingType: library; scale: 1.0; interactive: true; clickable: true; hoverable: true"
    gltf-model="#library-building"
    shadow="cast: true; receive: true">
</a-entity>
```

### Step 4: Add Event Handlers
```javascript
// Listen for library-specific events
document.addEventListener('library-activated', (event) => {
    console.log('Library activated!');
    // Add library-specific functionality
});
```

## 🎯 Best Practices

### File Organization
- Use descriptive names: `observatory-main.glb`, `library-entrance.glb`
- Group related models: `buildings/`, `props/`, `environment/`
- Keep file sizes reasonable (< 10MB for buildings)

### Performance
- Preload critical assets on startup
- Use LOD (Level of Detail) for complex models
- Implement asset streaming for large scenes
- Monitor asset cache size

### Interactivity
- Add appropriate collision geometry
- Use building component for structured interactions
- Implement progressive loading for complex scenes
- Add loading indicators for large models

## 🔮 Future Features

### Planned Enhancements
- **Asset Streaming**: Load models on-demand
- **LOD System**: Automatic level-of-detail switching
- **Asset Compression**: Automatic optimization
- **Asset Versioning**: Version control for models
- **Asset Analytics**: Usage tracking and optimization

### Advanced Features
- **Procedural Generation**: Generate buildings from parameters
- **Asset Bundling**: Package related assets together
- **Asset Validation**: Automatic quality checks
- **Asset Metadata**: Rich asset information and tags

## 📚 Related Documentation

- [Engine Plan](./engine_plan.md) - Overall engine architecture
- [Development Guide](./development-guide.md) - General development
- [Adding Levels](./adding_level.md) - Creating new VR experiences
- [Component System](./component-system.js) - Custom A-Frame components

---

**Ready to add your building model?** 

1. Place your `.glb` file in `public/assets/models/buildings/`
2. Update the asset reference in `public/index.html`
3. Test the loading and interactions
4. Check the browser console for any errors

The system is now ready to handle your 3D building model with full interactivity and optimization! 