# Plug-and-Play Level System Guide

The Signpost Observatory now supports a truly plug-and-play system for adding new VR/AR experiences. You can add a new level with just **one file** and optionally update a config file.

## Quick Start: Adding a New Level

### Method 1: Just Add One File (Easiest)

1. **Create your HTML file** in the appropriate category folder:
   ```
   public/levels/education/my-new-experience.html
   ```

2. **Add basic metadata** to your HTML file:
   ```html
   <!DOCTYPE html>
   <html>
   <head>
       <title>My New VR Experience</title>
       <meta name="description" content="An interactive VR experience about...">
       <meta name="vr-mode" content="vr">
       <!-- Your A-Frame scene here -->
   </head>
   <body>
       <a-scene>
           <!-- Your content -->
       </a-scene>
   </body>
   </html>
   ```

3. **That's it!** Your level will be automatically discovered and available at:
   ```
   http://localhost:5000/levels/education/my-new-experience
   ```

### Method 2: Use the CLI Tool (Recommended)

Use the management CLI to create a new level with automatic portal configuration:

```bash
# Create a basic level
python manage.py create --name "my-vr-experience" --category "education"

# Create with custom title and description
python manage.py create --name "democracy-sim" --category "democracy" \
  --title "Democracy Simulator" \
  --description "Interactive simulation of democratic processes"
```

This will:
- ✅ Create the HTML file with a proper template
- ✅ Auto-generate portal configuration
- ✅ Add it to the gateway automatically
- ✅ Position it correctly in the VR space

## Available Categories

- `education` - AI & Education experiences
- `democracy` - Democracy & Technology simulations
- `connection` - Human Connection & Empathy experiences
- `analysis` - Data Visualization & Analytics
- `philosophy` - Philosophical inquiries

## CLI Commands

### List All Projects
```bash
python manage.py list
```

### Show Project Details
```bash
python manage.py show --category "analysis" --name "attention-economy-exchange"
```

### Create New Project
```bash
python manage.py create --name "my-experience" --category "education"
```

## API Endpoints

The system provides RESTful APIs for programmatic access:

### Get All Projects
```bash
curl http://localhost:5000/api/projects
```

### Get Specific Project
```bash
curl http://localhost:5000/api/projects/attention_economy_exchange
```

### Create New Project
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My New Experience",
    "category": "education",
    "description": "An interactive VR experience"
  }'
```

### Discover All Levels
```bash
curl http://localhost:5000/api/levels/discover
```

### Get Level Metadata
```bash
curl http://localhost:5000/api/levels/analysis/attention-economy-exchange/metadata
```

## Automatic Features

### Auto-Discovery
The system automatically discovers new HTML files in the `public/levels/` directory structure and:
- Extracts metadata from HTML files (title, description, VR mode)
- Analyzes A-Frame components and entities
- Provides file statistics (size, creation date, etc.)

### Auto-Portal Generation
When you create a level via CLI, it automatically:
- Generates a unique portal ID
- Assigns appropriate colors based on category
- Positions the portal in 3D space
- Creates portal configuration

### Metadata Extraction
The system reads these HTML meta tags:
- `<title>` - Display title
- `<meta name="description">` - Description
- `<meta name="vr-mode">` - VR mode settings

## File Structure

```
public/levels/
├── education/
│   ├── classroom-time-machine.html
│   └── my-new-experience.html
├── democracy/
│   └── democracy-sim.html
├── analysis/
│   └── attention-economy-exchange.html
└── connection/
    └── empathy-engine.html
```

## Best Practices

### 1. Naming Conventions
- Use kebab-case for filenames: `my-vr-experience.html`
- Use descriptive names that indicate the content
- Keep names short but meaningful

### 2. Metadata
Always include these meta tags in your HTML:
```html
<title>Your Experience Title</title>
<meta name="description" content="Brief description of your experience">
<meta name="vr-mode" content="vr">
```

### 3. Navigation
Include a way back to the gateway in your experiences:
```html
<a-entity position="0 0 -5">
    <a-plane position="0 1.5 0" width="2" height="1" color="#0066cc" 
             link="href: /; title: Back to Gateway"></a-plane>
    <a-text value="Back to Gateway" position="0 1.5 0.1" align="center" color="#ffffff"></a-text>
</a-entity>
```

### 4. Performance
- Keep file sizes reasonable (< 10MB for initial load)
- Use compressed assets when possible
- Test on target devices

## Troubleshooting

### Level Not Appearing
1. Check the file is in the correct category folder
2. Ensure the file has `.html` extension
3. Verify the server is running: `python app.py`
4. Check the API: `curl http://localhost:5000/api/levels/discover`

### Portal Not Showing in Gateway
1. Check portal configuration was generated
2. Verify the level file exists
3. Check for any JavaScript errors in browser console

### CLI Errors
1. Ensure you're in the project root directory
2. Check Python dependencies are installed
3. Verify file permissions

## Advanced Usage

### Custom Templates
You can create custom templates by modifying the `create_level_with_metadata` function in `portal_config.py`.

### Custom Categories
To add new categories:
1. Create the folder: `public/levels/your-category/`
2. Add category colors in `portal_config.py`
3. Update the CLI choices if needed

### Programmatic Creation
Use the API endpoints to create levels programmatically from other tools or scripts.

## Examples

### Simple Interactive Experience
```html
<!DOCTYPE html>
<html>
<head>
    <title>Simple Interactive Experience</title>
    <meta name="description" content="A basic interactive VR experience">
    <meta name="vr-mode" content="vr">
    <script src="https://aframe.io/releases/1.4.0/aframe.min.js"></script>
</head>
<body>
    <a-scene>
        <a-camera>
            <a-cursor></a-cursor>
        </a-camera>
        <a-box position="0 1 0" color="#ff0000" 
               animation="property: rotation; to: 0 360 0; dur: 2000; loop: true"></a-box>
    </a-scene>
</body>
</html>
```

This system makes it incredibly easy to add new VR/AR experiences to your Signpost Observatory. Just drop a file and it's ready to go! 