# Level Organization Structure

## Proposed Folder Structure for VR Levels

As the Signpost Observatory grows, we should organize levels into logical groups to maintain scalability and clarity.

### Current Structure
```
public/
├── index.html          # Main gateway
├── simple.html         # Simple test level
├── test.html          # Development test level
└── assets/            # Shared assets
```

### Proposed Structure
```
public/
├── index.html          # Main gateway
├── levels/            # All VR levels organized by category
│   ├── education/     # Education-focused experiences
│   │   ├── classroom-time-machine.html
│   │   ├── blooms-taxonomy-mountain.html
│   │   └── socratic-dialogue-simulator.html
│   ├── democracy/     # Democracy and political analysis
│   │   ├── gerrymandering-playground.html
│   │   ├── echo-chamber-escape.html
│   │   └── voting-rights-time-portal.html
│   ├── connection/    # Human connection and AI philosophy
│   │   ├── empathy-engine.html
│   │   ├── loneliness-laboratory.html
│   │   └── word-gallery.html
│   ├── analysis/      # Data visualization and analytics
│   │   ├── crime-map-navigator.html
│   │   ├── budget-breakdown-cityscape.html
│   │   └── funding-flow-visualization.html
│   └── philosophy/    # Critical thinking and philosophy
│       ├── bias-detection-chamber.html
│       ├── apophenia-playground.html
│       └── paradox-park.html
├── shared/            # Shared components and utilities
│   ├── components/
│   ├── styles/
│   └── utils/
└── assets/            # Shared assets
    ├── audio/
    └── textures/
```

## Benefits of This Structure

### 1. **Scalability**
- Easy to add new levels without cluttering the root directory
- Clear categorization makes it easier to find specific types of experiences
- Supports hundreds of levels without organizational chaos

### 2. **Development Workflow**
- Developers can focus on specific categories
- Easier to maintain related levels together
- Clear separation of concerns

### 3. **User Experience**
- Logical grouping helps users understand what they're exploring
- Can implement category-based navigation
- Easier to implement progressive disclosure

### 4. **Technical Benefits**
- Better asset management per category
- Easier to implement category-specific features
- Simplified routing and navigation logic

## Implementation Strategy

### Phase 1: Create Folder Structure
```bash
mkdir -p public/levels/{education,democracy,connection,analysis,philosophy}
```

### Phase 2: Update Routing
Modify `app.py` to handle level routing:
```python
@app.route('/levels/<category>/<level_name>')
def serve_level(category, level_name):
    """Serve levels from organized folder structure"""
    return send_from_directory(f'public/levels/{category}', f'{level_name}.html')
```

### Phase 3: Update Portal Configuration
Modify `portal_config.py` to include category information:
```python
'education': {
    'id': 'education',
    'title': 'AI & Education',
    'category': 'education',
    'levels': ['classroom-time-machine', 'blooms-taxonomy-mountain'],
    # ... other config
}
```

### Phase 4: Update Navigation
Modify the main gateway to support category-based navigation and level selection.

## Migration Plan

1. **Create new folder structure**
2. **Move existing levels** (when they exist) to appropriate folders
3. **Update routing logic** in Flask app
4. **Update portal configuration** to include category mapping
5. **Test navigation** and ensure all links work
6. **Update documentation** and development guides

## Future Considerations

### Category-Specific Features
- Education levels might share common educational UI components
- Democracy levels might share political data visualization tools
- Connection levels might share empathy measurement systems

### Asset Organization
```
public/assets/
├── education/         # Education-specific assets
├── democracy/         # Democracy-specific assets
├── connection/        # Connection-specific assets
├── analysis/          # Analysis-specific assets
└── shared/           # Cross-category assets
```

### Navigation Enhancements
- Category overview pages
- Level previews and thumbnails
- Progress tracking per category
- Cross-category connections and references

This structure will support the ambitious scope of the Signpost Observatory while maintaining clarity and usability. 