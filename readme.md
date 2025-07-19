# The Signpost Observatory - VR Gateway

> "All we can be now is the signposts for tomorrow and those that come after"

A WebXR gateway built with A-Frame that serves as the entry point to a collection of VR experiences, now with a modern Flask backend and a robust engine system.

## 🚀 Quick Start

### Prerequisites
- Python 3.8+ 
- Modern browser with WebXR support (Chrome/Firefox recommended)

### Installation & Running

#### Option 1: Flask Server (Recommended)
1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Start the Flask server:**
   ```bash
   python app.py
   ```

3. **Open your browser:**
   - Navigate to `http://localhost:5000`
   - Enter VR by clicking the VR goggles icon (if you have a headset)
   - Navigate using WASD keys and mouse look
   - Click portals to explore different project spaces

#### Option 2: Simple Python Server (No Dependencies)
1. **Start the simple server:**
   ```bash
   python start_simple.py
   ```

2. **Open your browser:**
   - Navigate to `http://localhost:8000`
   - Enter VR by clicking the VR goggles icon (if you have a headset)
   - Navigate using WASD keys and mouse look
   - Click portals to explore different project spaces

#### Option 3: Direct File Access (Basic)
1. **Open directly in browser:**
   - Navigate to `public/index.html` in your file browser
   - Note: Some features may not work without a server

## 🏗️ Project Structure

```
Signpost/
├── public/                    # Frontend static files
│   ├── index.html            # Main VR gateway experience
│   ├── test-engine.html      # Engine test page
│   ├── levels/               # Organized VR levels by category
│   │   ├── education/        # Education-focused experiences
│   │   ├── democracy/        # Democracy and political analysis
│   │   ├── connection/       # Human connection and AI philosophy
│   │   ├── analysis/         # Data visualization and analytics
│   │   └── philosophy/       # Critical thinking and philosophy
│   └── assets/               # Media assets
│       ├── audio/            # Sound files
│       └── textures/         # Image textures
├── shared/                   # Reusable components
│   ├── components/           # A-Frame custom components
│   │   ├── engine.js         # Core engine library
│   │   ├── component-system.js # Component-entity system
│   │   ├── state-manager.js  # State management
│   │   ├── portal-system.js  # Portal interactions
│   │   ├── navigation.js     # Navigation controls
│   │   └── ui-overlay.js     # UI overlays
│   ├── styles/              # CSS stylesheets
│   │   └── common.css
│   └── utils/               # JavaScript utilities
├── data/                    # Data files
│   ├── processed/           # Processed data files
│   ├── projects/            # Project-specific data
│   └── raw/                 # Raw data files
├── docs/                    # Documentation
│   ├── engine_plan.md       # Engine development plan
│   ├── development-guide.md
│   └── level-organization.md
├── app.py                   # Flask backend server
├── data_processing.py       # Data processing pipeline
├── portal_config.py         # Portal configuration and management
├── manage.py                # CLI tool for project management
├── start_simple.py          # Simple Python server (no dependencies)
├── requirements.txt          # Python dependencies
└── README.md               # This file
```

## 🎯 Core Features

### ✅ Phase 1: Project & Level Management API (Complete)
- **Plug-and-Play Level System**: Add new levels with just one HTML file
- **Automatic Discovery**: System finds new levels without configuration  
- **CLI Tool**: `python manage.py create --name "my-experience" --category "education"`
- **Full REST API**: Complete CRUD operations for projects
- **Metadata Extraction**: Automatic reading of HTML metadata
- **Portal Auto-Generation**: Automatic portal configuration

### ✅ Phase 2A: Data Processing Pipeline (Complete)
- **Real-world Data Integration**: Kansas City crash data with 75,078 crash records and 13,008 intersections
- **Interactive Map Visualization**: Leaflet.js-based geographic data visualization
- **JSON Serialization Fixes**: Proper handling of pandas/numpy data types and NaN values
- **Error Handling**: Robust error handling for API endpoints and frontend data loading
- **Statistics Dashboard**: Real-time statistics with crash counts, risk levels, and intersection analysis

### ✅ Phase 2B: Frontend Engine Components (Complete)
- **Core Engine Library (`engine.js`)**: Central JavaScript library for scene management, rendering, and game loop
- **Component-Entity System (`component-system.js`)**: Modular A-Frame components for reusable behaviors
- **State Management (`state-manager.js`)**: Global state manager for application-wide data
- **Interactive Test Page**: `test-engine.html` for testing engine features

### VR Gateway Experience
- **Immersive 3D Environment**: Central observatory with floating portals
- **Portal Navigation**: Four themed portals leading to different VR experiences
- **WebXR Support**: Full VR headset compatibility
- **Responsive Design**: Works on desktop and mobile browsers

### Backend API
- **Dynamic Portal System**: Automatically detects and serves only portals with actual level files
- **Portal Data**: Dynamic portal information served via REST API
- **Project Details**: Detailed information about each VR experience
- **Level Management**: Organized level structure with category-based routing
- **Health Monitoring**: Server status and performance metrics
- **Security**: CORS support and error handling

### Portal Destinations

#### 🎓 Education Portal
**Future VR Experiences:**
- Interactive AI tutoring systems
- Virtual classrooms with adaptive learning
- Tools for addressing education pipeline challenges

#### 🤝 Connection Portal  
**Future VR Experiences:**
- Human-AI empathy training
- Virtual therapy environments
- Philosophical spaces for consciousness exploration

#### 📊 Analysis Portal
**Current VR Experiences:**
- **Kansas City Crash Analysis**: Interactive geographic visualization of 75,078 crash records and 13,008 intersections
- 3D data visualization spaces
- Interactive urban planning tools

## 🛠️ Technical Stack

### Frontend
- **A-Frame 1.4.0** - WebXR framework
- **WebXR APIs** - Cross-platform VR support
- **Signpost Engine** - Custom engine library for scene management
- **Component System** - Modular A-Frame components
- **State Management** - Global state manager with persistence
- **Vanilla JavaScript** - Portal interactions and navigation
- **CSS3** - UI overlays and responsive design

### Backend
- **Python 3.8+** - Runtime environment
- **Flask** - Web framework
- **Flask-CORS** - Cross-origin resource sharing
- **Pandas** - Data processing and analysis
- **NumPy** - Numerical computing
- **Werkzeug** - WSGI utilities

## 🔧 Development

### Available Commands
```bash
python app.py                    # Start Flask development server
python start_simple.py           # Start simple Python server (no dependencies)
python manage.py create --name "my-experience" --category "education"  # Create new project
python test_phase2b.py          # Test Phase 2B features
pip install -r requirements.txt  # Install Flask dependencies
```

### API Endpoints
- `GET /api/health` - Server health check
- `GET /api/portals` - List all available portals
- `GET /api/portals/available` - List only portals with actual level files
- `GET /api/projects` - Get all projects with enhanced metadata
- `GET /api/projects/:id` - Get specific project details
- `GET /api/levels/available` - List all available levels across categories
- `GET /api/levels/:category` - List levels in specific category
- `GET /api/data/sources` - List available data sources
- `GET /api/data/formats` - List available visualization formats
- `GET /api/data/:source/raw` - Get raw data for visualization
- `GET /levels/:category/:level` - Serve level files from organized structure

### Engine Components

#### Core Engine Library (`engine.js`)
- **Scene Management**: Initialize and manage A-Frame scenes
- **Main Update Loop**: 60 FPS game loop with delta time
- **Event System**: Global event listeners and event queue
- **Performance Monitoring**: FPS, draw calls, memory usage tracking
- **Utility Functions**: Vector math, raycasting, mathematical utilities
- **Component Registry**: Register and manage custom components

#### Component-Entity System (`component-system.js`)
- **Grabbable Component**: Physics-based object interaction
- **Clickable Component**: Click and hover interactions
- **Teleportation Component**: VR locomotion system
- **Physics Body Component**: Physics integration placeholder
- **Haptic Feedback Component**: VR controller feedback
- **Base Component Class**: Foundation for custom components

#### State Management (`state-manager.js`)
- **Global State**: Single source of truth for application data
- **Reactive Updates**: Subscribe to state changes
- **State Persistence**: localStorage integration
- **History Management**: Undo/redo functionality
- **Debug Tools**: State inspection and export/import

### Environment Variables
```bash
FLASK_ENV=development  # Environment mode
FLASK_DEBUG=1          # Debug mode
```

## 🌐 Browser Support

| Browser | WebXR Support | Notes |
|---------|---------------|-------|
| Chrome/Chromium | ✅ Full | Recommended for development |
| Firefox | ✅ Full | Good alternative |
| Safari | ⚠️ Limited | Basic WebGL only |
| Mobile browsers | ⚠️ Limited | Functional but limited VR |

## 🚀 Deployment

### Local Development
```bash
pip install -r requirements.txt
python app.py
```

### Production Deployment
```bash
pip install -r requirements.txt
export FLASK_ENV=production
python app.py
```

### Docker (Optional)
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["python", "app.py"]
```

## 📚 Documentation

- [Engine Plan](./docs/engine_plan.md) - Comprehensive engine development plan
- [Development Guide](./docs/development-guide.md) - Comprehensive development information
- [Adding New Levels](./adding_level.md) - Guide for creating new VR levels
- [Level Organization](./docs/level-organization.md) - Level organization and folder structure

## 🧪 Testing

### Phase 2B Feature Test
```bash
python test_phase2b.py
```

### Interactive Engine Test
1. Start the server: `python app.py`
2. Open: `http://localhost:5000/test-engine.html`
3. Check browser console for engine debug output
4. Test interactive components (grabbable, clickable objects)

### Test Results
- ✅ Core Engine Library (engine.js) - 13,341 bytes
- ✅ Component-Entity System (component-system.js) - 15,076 bytes  
- ✅ State Management (state-manager.js) - 11,514 bytes
- ✅ Test Page (test-engine.html) - Interactive testing
- ✅ API Endpoints - All endpoints functional
- ✅ Data Processing Pipeline - 75,078 crash records, 13,008 intersections

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

*This project serves as both a technical portfolio piece and a philosophical statement about the intersection of technology, education, and human connection in our rapidly changing world.*