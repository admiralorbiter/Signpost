# Portal Development Guide

This guide explains how to add new portals and develop VR experiences for the Signpost Observatory.

## Quick Start: Adding a New Portal

### 1. Configure the Portal

Edit `portal_config.py` and add your new portal:

```python
# Add to PORTAL_CONFIG dictionary
'your-portal-id': {
    'id': 'your-portal-id',
    'title': 'Your Portal Title',
    'description': 'Brief description',
    'position': {'x': 10, 'y': 1, 'z': 0},  # Choose unique position
    'color': '#ff4488',  # Choose unique color
    'status': 'development',
    'project_data': {
        'title': 'Your Portal Full Title',
        'description': 'Detailed description of your VR experience...',
        'features': ['Feature 1', 'Feature 2', 'Feature 3'],
        'status': 'coming-soon',
        'eta': 'Q2 2024',
        'progress': 0
    }
}
```

### 2. Add Portal to HTML

Add the portal element to `public/index.html`:

```html
<!-- Your New Portal -->
<a-box 
    id="portal-your-portal-id"
    position="10 1 0" 
    width="2" 
    height="3" 
    depth="0.3"
    mixin="portal-material"
    class="portal"
    data-project="your-portal-id">
    
    <a-text
        mixin="signpost-text"
        text="value: Your Portal Title\nBrief Description\nHere; align: center"
        position="0 0 0.2">
    </a-text>
</a-box>
```

### 3. Test Your Portal

1. Start the server: `python app.py`
2. Open `http://localhost:5000`
3. Navigate to your portal and click it
4. Verify the modal shows your portal information

## Portal Status Options

| Status | Description | UI Behavior |
|--------|-------------|-------------|
| `coming-soon` | Portal is planned but not started | Shows "Coming Soon" with ETA |
| `in-development` | Portal is being developed | Shows progress and features |
| `ready` | Portal is complete and ready | Shows "Ready to Launch" |
| `live` | Portal is live and accessible | Shows "Enter Experience" button |

## Portal Positioning Guide

### Current Portal Positions
- **Education**: `{x: 5, y: 1, z: 5}` - Front right
- **Democracy**: `{x: -5, y: 1, z: 5}` - Front left  
- **Connection**: `{x: 0, y: 1, z: 8}` - Front center
- **Analysis**: `{x: -5, y: 1, z: -3}` - Back left

### Available Positions
- **Front right area**: `{x: 8-12, y: 1, z: 5-8}`
- **Back right area**: `{x: 8-12, y: 1, z: -3-0}`
- **Back center area**: `{x: -2-2, y: 1, z: -8-(-5)}`
- **Back left area**: `{x: -12-(-8), y: 1, z: -3-0}`

## Color Scheme Guidelines

### Current Colors
- **Education**: `#00aa66` (Green)
- **Democracy**: `#aa0066` (Purple)
- **Connection**: `#0066aa` (Blue)
- **Analysis**: `#aa6600` (Orange)

### Available Colors
- **Pink/Magenta**: `#ff4488`, `#cc4488`
- **Cyan**: `#00aacc`, `#44aacc`
- **Yellow**: `#ffaa00`, `#ccaa00`
- **Teal**: `#00aaaa`, `#44aaaa`

## Developing Full VR Experiences

### 1. Create Experience Directory

```
projects/
├── your-portal-id/
│   ├── index.html          # Main experience file
│   ├── assets/             # Experience assets
│   │   ├── models/         # 3D models
│   │   ├── textures/       # Textures
│   │   └── audio/          # Audio files
│   ├── components/         # Custom A-Frame components
│   └── styles/             # Experience-specific styles
```

### 2. Basic Experience Template

```html
<!DOCTYPE html>
<html>
<head>
    <title>Your VR Experience</title>
    <script src="https://aframe.io/releases/1.4.0/aframe.min.js"></script>
</head>
<body>
    <a-scene>
        <!-- Your VR experience content -->
        <a-sky color="#001122"></a-sky>
        <a-plane position="0 0 0" rotation="-90 0 0" width="20" height="20" color="#003366"></a-plane>
        
        <!-- Navigation back to gateway -->
        <a-box position="0 1 -5" color="#00ffaa" class="return-portal" 
               onclick="window.location.href='/'">
            <a-text value="Return to Gateway" position="0 0 0.6" color="white"></a-text>
        </a-box>
    </a-scene>
</body>
</html>
```

### 3. Update Portal to Link to Experience

When your experience is ready, update the portal configuration:

```python
'your-portal-id': {
    # ... other config ...
    'project_data': {
        # ... other data ...
        'status': 'live',
        'url': '/projects/your-portal-id/'  # Link to your experience
    }
}
```

## API Endpoints for Portal Management

### Get All Portals
```bash
GET /api/portals
```

### Get Specific Project
```bash
GET /api/projects/your-portal-id
```

### Add New Portal (Admin)
```bash
POST /api/admin/portals
Content-Type: application/json

{
    "id": "new-portal-id",
    "config": {
        "id": "new-portal-id",
        "title": "New Portal",
        "description": "Description",
        "position": {"x": 10, "y": 1, "z": 0},
        "color": "#ff4488",
        "status": "development",
        "project_data": {
            "title": "New Portal",
            "description": "Description",
            "features": ["Feature 1", "Feature 2"],
            "status": "coming-soon",
            "eta": "Q2 2024",
            "progress": 0
        }
    }
}
```

### Update Portal Status (Admin)
```bash
PUT /api/admin/portals/your-portal-id/status
Content-Type: application/json

{
    "status": "live"
}
```

### Remove Portal (Admin)
```bash
DELETE /api/admin/portals/your-portal-id
```

## Best Practices

### Portal Design
1. **Unique Positioning**: Ensure portals don't overlap
2. **Consistent Sizing**: Use standard portal dimensions (2x3x0.3)
3. **Clear Labels**: Keep portal text concise and readable
4. **Color Coding**: Use distinct colors for easy identification

### Content Development
1. **Performance**: Keep experiences under 5MB for fast loading
2. **Navigation**: Always provide a way back to the gateway
3. **Accessibility**: Include alternative navigation methods
4. **Testing**: Test on multiple devices and browsers

### Status Management
1. **Coming Soon**: Use for planned but not started portals
2. **In Development**: Use when actively working on portal
3. **Ready**: Use when portal is complete but not yet live
4. **Live**: Use when portal is accessible to users

## Troubleshooting

### Portal Not Appearing
- Check portal ID matches between config and HTML
- Verify position coordinates are unique
- Ensure portal element is properly nested in a-scene

### Modal Not Showing
- Check browser console for JavaScript errors
- Verify API endpoints are working
- Ensure portal has `data-project` attribute

### Experience Not Loading
- Check file paths are correct
- Verify A-Frame is loaded
- Test experience in isolation first

## Next Steps

1. **Start Simple**: Begin with a basic portal configuration
2. **Test Thoroughly**: Verify portal appears and modal works
3. **Develop Experience**: Create your VR experience content
4. **Update Status**: Change status to "live" when ready
5. **Document**: Update this guide with your learnings

For more help, refer to the main [Development Guide](./development-guide.md). 