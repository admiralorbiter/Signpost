# Setup Guide - Signpost Observatory

This guide will help you get the Signpost Observatory VR Gateway running on your system.

## Prerequisites

### Installing Python

#### Windows
1. **Download Python:**
   - Go to [python.org](https://www.python.org/downloads/)
   - Download Python 3.8 or later
   - **Important:** Check "Add Python to PATH" during installation

2. **Verify installation:**
   ```cmd
   python --version
   ```

#### macOS
1. **Using Homebrew (recommended):**
   ```bash
   brew install python
   ```

2. **Or download from python.org:**
   - Visit [python.org](https://www.python.org/downloads/)
   - Download the macOS installer

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install python3 python3-pip
```

#### Linux (CentOS/RHEL)
```bash
sudo yum install python3 python3-pip
```

## Project Setup

### 1. Clone or Download the Project
```bash
git clone <repository-url>
cd Signpost
```

### 2. Choose Your Server Option

#### Option A: Flask Server (Full Features)
```bash
# Install Flask dependencies
pip install -r requirements.txt

# Start the server
python app.py

# Open http://localhost:5000
```

#### Option B: Simple Python Server (No Dependencies)
```bash
# Start the simple server (works with any Python installation)
python start_simple.py

# Open http://localhost:8000
```

#### Option C: Direct File Access (Basic)
- Navigate to `public/index.html` in your file browser
- Open with any modern browser
- Note: API features won't work without a server

## Troubleshooting

### Python Not Found
If you get "python not found" error:

**Windows:**
- Make sure Python was added to PATH during installation
- Try `python3` instead of `python`
- Restart your command prompt after installation

**macOS/Linux:**
- Try `python3` instead of `python`
- Install Python if not already installed

### Port Already in Use
If you get "port already in use" error:

**Change the port in the server files:**
- Edit `app.py` line 95: `port=5001` (or any available port)
- Edit `start_simple.py` line 108: `PORT = 8001` (or any available port)

### Browser Issues
- Use Chrome or Firefox for best WebXR support
- Enable WebXR in your browser settings
- Some features require HTTPS (use a local server)

### VR Headset Setup
- Connect your VR headset to your computer
- Install the appropriate VR software (Oculus, SteamVR, etc.)
- The VR button should appear in the browser when connected

## Development

### Adding New Portals
1. Edit `app.py` or `start_simple.py`
2. Add portal data to the `PORTALS` list
3. Add project data to the `PROJECTS` dictionary
4. Update the HTML file to include the new portal

### Customizing the Experience
- Modify `public/index.html` for the main VR environment
- Edit `shared/components/` for custom A-Frame components
- Update `shared/styles/common.css` for styling

## Support

If you encounter issues:
1. Check that Python is properly installed
2. Ensure you're using a modern browser
3. Try the simple server option if Flask doesn't work
4. Check the browser console for JavaScript errors

For more help, refer to the main [README.md](README.md) file. 