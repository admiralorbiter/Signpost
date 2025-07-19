# VR/AR Playground Engine: Technical Feature Specification

## 🎉 **Phase 1 Complete: Project & Level Management API**

**✅ COMPLETED FEATURES:**
- **Plug-and-Play Level System**: Add new levels with just one HTML file
- **Automatic Discovery**: System finds new levels without configuration  
- **CLI Tool**: `python manage.py create --name "my-experience" --category "education"`
- **Full REST API**: Complete CRUD operations for projects
- **Metadata Extraction**: Automatic reading of HTML metadata
- **Portal Auto-Generation**: Automatic portal configuration

**📊 Current Status:**
- 4 working levels across 3 categories
- Automatic level discovery and indexing
- CLI tool for easy project creation
- Full API endpoints for programmatic access

---

## ✅ **Phase 2A Complete: Data Processing Pipeline & Real-world Data Integration**

**✅ COMPLETED FEATURES:**
- **Data Processing Pipeline**: Backend module for fetching/processing data for visualizations
- **Real-world Data Integration**: Kansas City crash data with 75,078 crash records and 13,008 intersections
- **Interactive Map Visualization**: Leaflet.js-based geographic data visualization
- **JSON Serialization Fixes**: Proper handling of pandas/numpy data types and NaN values
- **Error Handling**: Robust error handling for API endpoints and frontend data loading
- **Statistics Dashboard**: Real-time statistics with crash counts, risk levels, and intersection analysis

### 🎯 **Kansas City Crash Analysis Project**

**📊 Data Sources:**
- ✅ **Crash Data**: 75,078 crash records with detailed incident information
- ✅ **Intersection Data**: 13,008 intersections with GPS coordinates and crash counts
- ✅ **Risk Analysis**: Automatic risk level calculation based on crash frequency
- ✅ **Geographic Visualization**: Interactive map with color-coded intersection markers

**🗺️ Visualization Features:**
- ✅ **Interactive Map**: Leaflet.js with OpenStreetMap tiles
- ✅ **Intersection Markers**: Color-coded by risk level (Low/Medium/High)
- ✅ **Detailed Popups**: Crash count, coordinates, and intersection details
- ✅ **Statistics Panel**: Real-time metrics and data insights
- ✅ **Export Controls**: Data export and refresh capabilities

**🔧 Technical Implementation:**
- ✅ **Data Processing**: `data_processing.py` with CSV loading and cleaning
- ✅ **API Endpoints**: `/api/data/kansas_city_crashes/raw` and `/api/data/kansas_city_intersections/raw`
- ✅ **Frontend**: `kansas-city-crash-analysis.html` with Leaflet.js visualization
- ✅ **Error Handling**: JSON serialization fixes and reduce error prevention
- ✅ **Portal Integration**: Automatic portal configuration and routing

### 🚀 **How to Use the Data Processing System**

#### **API Access**
```bash
# Get crash data (75,078 records)
curl "http://localhost:5000/api/data/kansas_city_crashes/raw?limit=1000"

# Get intersection data (13,008 records)
curl "http://localhost:5000/api/data/kansas_city_intersections/raw?limit=1000"

# List all available data sources
curl "http://localhost:5000/api/data/sources"
```

#### **Frontend Integration**
```javascript
// Load crash data in your visualization
fetch('/api/data/kansas_city_crashes/raw?limit=1000')
    .then(response => response.json())
    .then(data => {
        console.log('Crash data loaded:', data.data.length, 'records');
        visualizeData(data.data);
    });

// Load intersection data for mapping
fetch('/api/data/kansas_city_intersections/raw?limit=1000')
    .then(response => response.json())
    .then(data => {
        console.log('Intersection data loaded:', data.data.length, 'records');
        visualizeIntersections(data.data);
    });
```

### 📊 **Current Status**

**Working Data Sources:**
- ✅ `kansas_city_crashes` - 75,078 crash records with incident details
- ✅ `kansas_city_intersections` - 13,008 intersections with GPS coordinates
- ✅ `crime_data` - Kansas City crime incidents (legacy)
- ✅ `funding_data` - Federal funding flow (legacy)
- ✅ `education_data` - School statistics (legacy)
- ✅ `democracy_data` - Voting data (legacy)

**Working Visualization Formats:**
- ✅ `raw` - Raw data without processing
- ✅ `3d_scatter` - Three-dimensional scatter plots
- ✅ `heatmap` - Color-coded intensity maps
- ✅ `timeline` - Time-based data visualization
- ✅ `network` - Connected node and edge visualization

**Example Implementation:**
- ✅ `kansas-city-crash-analysis.html` - Interactive geographic crash data visualization

---

## 1. Executive Summary: Vision and Purpose

The **Signpost Observatory Engine** will be a modular, web-native framework for creating and deploying immersive VR and AR experiences. Its core purpose is to abstract the complexities of WebXR, device compatibility, and interaction design, allowing developers to focus on building meaningful content—from the "Classroom Time Machine" to the "Democracy Diagnosis Machine".

The engine will prioritize:
- [ ] **Rapid Prototyping:** Quickly build and test new "playground" ideas.
- [ ] **Data Integration:** Seamlessly connect backend Python scripts and APIs to frontend visualizations.
- [ ] **Component Reusability:** Create a library of shared components that can be used across multiple projects, as outlined in your `development-guide.md`.
- [ ] **Performance by Default:** Ensure all experiences run smoothly on a range of devices, from desktop browsers to standalone VR headsets.

---

## 🎯 **Next Priority: Phase 2B - Frontend Engine Components**

With the data processing pipeline complete, the next phase focuses on frontend engine development:

### **Phase 2B: Frontend Engine Components** (High Priority)
- [ ] **Core Engine Library (`engine.js`)**: Central JavaScript library for scene management
- [ ] **Component-Entity System**: Modular A-Frame components
- [ ] **State Management**: Global state manager

### **Phase 3: AI & Advanced Systems** (Medium Priority)
- [ ] **AI & Machine Learning Integration**: API endpoints for AI model integration
- [ ] **Physics Engine**: Collision detection and rigid body dynamics
- [ ] **Spatial Audio Engine**: 3D positional audio
- [ ] **Animation System**: Animation mixer and IK

### **Phase 4: Future Goals** (Low Priority)
- [ ] **Real-time Communication Server**: WebSocket support for multiplayer experiences
- [ ] **Dialogue & Narrative System**: Branching conversations
- [ ] **Multiplayer & Social Features**: Room management, avatars, voice chat

---

## 2. Core Engine Architecture

This architecture is designed to support your current Flask and A-Frame stack while providing a clear path for future expansion.

#### 2.1. Backend (Python/Flask)

- [x] **Project & Level Management API:** ✅ **COMPLETED** - An expansion of your existing `portal_config.py` system. It dynamically manages and serves project data, configurations, and assets.
    - [x] **Endpoints:**
        - [x] `GET /api/projects`: Returns a list of all projects with enhanced metadata.
        - [x] `GET /api/projects/:id`: Returns detailed data for a specific project.
        - [x] `POST /api/projects`: Creates a new project with automatic portal configuration.
        - [x] `PUT /api/projects/:id`: Updates a project.
        - [x] `DELETE /api/projects/:id`: Deletes a project.
        - [x] `GET /api/levels/discover`: Discovers all levels with metadata.
        - [x] `GET /api/levels/:category/:name/metadata`: Gets detailed level metadata.
    - [x] **Data Structure:** JSON objects containing project metadata, status, features, and a link to the project's entry point URL.
    - [x] **Plug-and-Play System:** Add new levels with just one HTML file - automatically discovered and indexed.
    - [x] **CLI Tool:** `python manage.py create --name "my-experience" --category "education"` for easy project creation.
    - [x] **Metadata Extraction:** Automatically reads titles, descriptions, and VR settings from HTML files.

- [x] **Data Processing Pipeline:** ✅ **COMPLETED** - A dedicated module for fetching, processing, and formatting data for visualization projects like the "Kansas City Crime Map Navigator" or the "Federal Funding Flow Visualization".
    - [x] **Workflow:**
        - [x] The frontend requests data for a specific visualization.
        - [x] The backend fetches raw data from its source (e.g., a database, an external API).
        - [x] The Python script processes, cleans, and formats the data into a structure optimized for 3D visualization.
        - [x] The formatted data is sent back to the frontend as a JSON response.
    - [x] **API Endpoints:**
        - [x] `GET /api/data/<source>` - Get processed data for visualization
        - [x] `GET /api/data/<source>/raw` - Get raw data without processing
        - [x] `GET /api/data/sources` - List available data sources
        - [x] `GET /api/data/formats` - List available visualization formats
    - [x] **Data Sources:**
        - [x] Crime data (Kansas City crime incidents)
        - [x] Funding data (Federal funding flow)
        - [x] Education data (School statistics)
        - [x] Democracy data (Voting and gerrymandering metrics)
    - [x] **Visualization Formats:**
        - [x] 3D Scatter plots
        - [x] Heatmaps
        - [x] Timelines
        - [x] Network graphs

- [ ] **AI & Machine Learning Integration:** A dedicated API endpoint to connect to Python-based AI models, crucial for projects like the "AI Grader" or "Socratic Dialogue Simulator".
    - [ ] **Endpoint:** `POST /api/ai/infer`
    - [ ] **Functionality:** The frontend sends a request with input data (e.g., text for analysis, student work for grading). The backend passes this to the relevant Python AI/ML library (e.g., spaCy, TensorFlow) and returns the inference result.

#### 2.2. Frontend (JavaScript/A-Frame)

- [ ] **Core Engine Library (`engine.js`):** A central JavaScript library that manages the scene, renderer, and core game loop.
    - [ ] **Responsibilities:**
        - [ ] Initializes the A-Frame scene and renderer.
        - [ ] Manages the main update loop (`tick`).
        - [ ] Handles global event listeners (e.g., for VR mode changes, device connection/disconnection).
        - [ ] Provides utility functions for common tasks (e.g., vector math, raycasting).

- [ ] **Component-Entity System:** Built on A-Frame's principles, this allows for modular and reusable features.
    - [ ] **Structure:** A library of custom components that can be attached to entities to grant them behaviors (e.g., `<a-entity grabbable physics-body="type: dynamic">`).
    - [ ] **Best Practices:** Components should be self-contained and communicate with other systems through events.

- [ ] **Rendering Pipeline:**
    - [ ] **Stereoscopic Rendering:** Optimized for VR with single-pass instancing to reduce draw calls.
    - [ ] **AR Overlay Support:** A rendering mode that can overlay the 3D scene onto a webcam feed or a mobile device's camera view.
    - [ ] **Post-Processing Effects:** A framework for adding effects like bloom, depth of field, and custom shaders for projects like "The Invisible Illness Gallery".

- [ ] **State Management:** A global state manager to handle application-wide data (e.g., user position, current project, interaction state) and prevent conflicts between components.
    - [ ] **Technology:** A simple JavaScript object or a lightweight state management library.
    - [ ] **Purpose:** To provide a single source of truth for the application's state, making it easier to debug and manage.

---

## 3. Exhaustive Feature List

This list is broken down by category, providing a comprehensive toolkit for your project ideas.

#### 3.1. Development & Workflow

- [x] **Dynamic Level Loader:** Automatically loads levels based on the file structure and configuration, as you've already implemented.
- [x] **A-Frame Inspector Integration:** Continue using the `Ctrl+Alt+I` inspector for live scene debugging.
- [ ] **Visual Scene Graph:** A 2D UI panel (in-browser) that displays the hierarchy of all entities in the scene, allowing for quick selection and debugging.
    - [ ] **Features:**
        - [ ] Tree view of the scene's entities.
        - [ ] Clicking an entity in the graph highlights it in the 3D view.
        - [ ] Displays key components and properties for the selected entity.

- [ ] **Event Logging System:** A visual logger that displays custom engine events in real-time (e.g., `grab-start`, `portal-enter`, `dialogue-choice`).
    - [ ] **Features:**
        - [ ] A console-like overlay in the browser.
        - [ ] Filter events by name or source entity.
        - [ ] Timestamping for performance analysis.

- [ ] **Performance HUD:** An in-VR display showing FPS, memory usage, and draw calls, toggleable with a key command.
    - [ ] **Metrics:**
        - [ ] Frames Per Second (FPS).
        - [ ] Number of draw calls.
        - [ ] Geometry and texture memory usage.

- [x] **CLI Tool for Project Scaffolding:** ✅ **COMPLETED** - A Python script to automatically create the folder structure and boilerplate files for a new project (e.g., `python manage.py create --name "my-experience" --category "education"`).
    - [x] **Functionality:**
        - [x] Creates the project directory within the correct category.
        - [x] Generates a template `index.html` file with proper A-Frame setup.
        - [x] Adds a basic entry to the project configuration file.
        - [x] Auto-generates portal configuration with appropriate positioning and colors.
        - [x] Provides project listing and detailed information commands.

#### 3.2. UI & Interaction Systems

- [ ] **Unified UI Framework:**
    - [ ] **Diegetic UI Components:** In-world UI elements (e.g., interactive panels, buttons on objects).
    - [ ] **Non-Diegetic (HUD) Components:** 2D overlays for displaying information that follows the camera.
    - [ ] **UI Events System:** A consistent way to handle clicks, hovers, and other interactions for both 2D and 3D UI.

- [ ] **Advanced Input & Tracking:**
    - [ ] **Cross-Device Controller Abstraction:** A single API to handle input from Oculus Touch, HTC Vive wands, and other standard VR controllers.
    - [ ] **Webcam-Based Hand Tracking:** Integration with libraries like MediaPipe to capture hand gestures from a standard webcam, enabling desktop users to interact more naturally.
    - [ ] **Gaze-Based Interaction:** For accessibility and for experiences where hands are occupied.
    - [ ] **Voice Command API:** An expansion of your existing system with more complex grammar and intent recognition.

- [ ] **Interaction Components:**
    - [ ] **Grabbable/Throwable:** A component to make objects physically interactive.
    - [ ] **Clickable/Hoverable:** For triggering events on objects.
    - [ ] **Teleportation System:** A robust and customizable teleport mechanic.
    - [ ] **Draggable/Scalable:** For data visualization projects where users manipulate objects in the scene.

- [ ] **Haptic Feedback API:** A simple function call to trigger haptic feedback on controllers, with support for varying intensity and duration.
    - [ ] **Function:** `Engine.haptics.vibrate(hand, intensity, duration)`

#### 3.3. Advanced Systems

- [ ] **Physics Engine:**
    - [ ] **Collision Detection:** Accurate and performant collision detection.
    - [ ] **Rigid Body Dynamics:** For realistic object movement.
    - [ ] **Raycasting:** For detecting what a user is looking at or pointing at.
    - [ ] **Technology:** Integrate a library like `cannon-es`.

- [ ] **Spatial Audio Engine:**
    - [ ] **3D Positional Audio:** Sound that appears to come from a specific location in the scene.
    - [ ] **Audio Occlusion:** Sounds are muffled when they are behind other objects.
    - [ ] **Reverb Zones:** Define areas with different audio characteristics (e.g., a cave, a large hall).

- [ ] **Animation System:**
    - [ ] **Animation Mixer:** Blend multiple animations on a single model.
    - [ ] **Inverse Kinematics (IK):** For realistic arm and body movements on avatars.
    - [ ] **Timeline Editor:** A simple, in-browser tool to create and edit animation sequences for storytelling projects.

- [ ] **Dialogue & Narrative System:**
    - [ ] **Branching Dialogue Editor:** A visual tool to create branching conversations for projects like the "Socratic Dialogue Simulator".
    - [ ] **Event-Driven Storytelling:** Trigger events in the scene based on dialogue choices.
    - [ ] **Lip Syncing (Future):** Automated lip-syncing for characters based on audio input.

#### 3.4. Multiplayer & Social Features (Future Goals)

- [ ] **Networking Architecture:**
    - [ ] **Room/Session Management:** Create and join named sessions.
    - [ ] **State Synchronization:** Efficiently sync player positions, rotations, and object states.
    - [ ] **Technology:** Use the WebSocket server for real-time communication.

- [ ] **Player Representation:**
    - [ ] **Basic Avatars:** Simple, customizable avatars.
    - [ ] **Voice Chat Integration:** Built-in, low-latency voice communication.
    - [ ] **Player Nameplates:** Display user names above their avatars.

- [ ] **Real-time Communication Server (WebSockets):** Essential for multiplayer and collaborative experiences like "The Empathy Engine" or shared classroom environments.
    - [ ] **Technology:** Flask-SocketIO or a similar library.
    - [ ] **Functionality:** Handles real-time event broadcasting for player movement, object interactions, and chat messages.

#### 3.5. Platform Support & Content Pipeline

- [ ] **Asset Management System:**
    - [ ] **Optimized Loading:** Load assets intelligently to minimize initial load times.
    - [ ] **Support for Common Formats:** GLTF/GLB for models, PNG/JPG for textures, MP3 for audio.
    - [ ] **Automated Asset Compression (Future):** A backend script to automatically optimize uploaded assets for web delivery.

- [ ] **World Building Tools:**
    - [ ] **Terrain Editor (Future):** A simple in-browser tool to create and sculpt terrain.
    - [ ] **Procedural Content Generation (PCG) Hooks:** API hooks to allow Python scripts to generate content in the scene, perfect for projects like the "Apophenia Playground".
    - [ ] **Prefab System:** Save and reuse groups of objects and their components.
        - [ ] **Functionality:** A UI to select a group of entities and save them as a reusable "prefab" JSON file. Another UI to browse and spawn prefabs into the scene.

---

## 🎉 **Success Metrics**

✅ **Data Processing Pipeline**: Complete with real-world data integration  
✅ **Interactive Visualizations**: Geographic mapping with Leaflet.js  
✅ **JSON Serialization**: Proper handling of pandas/numpy data types  
✅ **Error Handling**: Robust error handling for API and frontend  
✅ **Statistics Dashboard**: Real-time metrics and insights  
✅ **Portal Integration**: Automatic portal configuration and routing  
✅ **Real-world Data**: 75,078 crash records and 13,008 intersections  

The Data Processing Pipeline is now fully functional with real-world data integration and ready for the next phase of your engine development!