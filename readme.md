# The Signpost Observatory - VR Gateway

> "All we can be now is the signposts for tomorrow and those that come after"

A WebXR gateway built with A-Frame that serves as the entry point to a collection of VR experiences, now with a modern Flask backend.

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
│   └── assets/               # Media assets
│       ├── audio/            # Sound files
│       └── textures/         # Image textures
├── shared/                   # Reusable components
│   ├── components/           # A-Frame custom components
│   │   ├── portal-system.js
│   │   ├── navigation.js
│   │   └── ui-overlay.js
│   ├── styles/              # CSS stylesheets
│   │   └── common.css
│   └── utils/               # JavaScript utilities
├── docs/                    # Documentation
│   ├── development-guide.md
│   └── project-roadmap.md
├── app.py                   # Flask backend server
├── start_simple.py          # Simple Python server (no dependencies)
├── requirements.txt          # Python dependencies
└── README.md               # This file
```

## 🎯 Core Features

### VR Gateway Experience
- **Immersive 3D Environment**: Central observatory with floating portals
- **Portal Navigation**: Four themed portals leading to different VR experiences
- **WebXR Support**: Full VR headset compatibility
- **Responsive Design**: Works on desktop and mobile browsers

### Backend API
- **Portal Data**: Dynamic portal information served via REST API
- **Project Details**: Detailed information about each VR experience
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
**Future VR Experiences:**
- 3D data visualization spaces
- Crime mapping interfaces
- Interactive urban planning tools

#### 🏛️ Democracy Portal
**Future VR Experiences:**
- Democratic process simulations
- Political data visualizations
- Interactive explorations of democratic norms

## 🛠️ Technical Stack

### Frontend
- **A-Frame 1.4.0** - WebXR framework
- **WebXR APIs** - Cross-platform VR support
- **Vanilla JavaScript** - Portal interactions and navigation
- **CSS3** - UI overlays and responsive design

### Backend
- **Python 3.8+** - Runtime environment
- **Flask** - Web framework
- **Flask-CORS** - Cross-origin resource sharing
- **Werkzeug** - WSGI utilities

## 🔧 Development

### Available Commands
```bash
python app.py          # Start Flask development server
python start_simple.py  # Start simple Python server (no dependencies)
pip install -r requirements.txt  # Install Flask dependencies
```

### API Endpoints
- `GET /api/health` - Server health check
- `GET /api/portals` - List all available portals
- `GET /api/projects/:id` - Get specific project details

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

- [Development Guide](./docs/development-guide.md) - Comprehensive development information
- [Project Roadmap](./docs/project-roadmap.md) - Future development plans

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