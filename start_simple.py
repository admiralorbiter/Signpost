#!/usr/bin/env python3
"""
Simple HTTP server for the Signpost Observatory VR Gateway
This can run without Flask dependencies for basic testing
"""

import http.server
import socketserver
import json
import os
from urllib.parse import urlparse, parse_qs
from datetime import datetime

try:
    from portal_config import get_portals_list, get_projects_dict
    # Portal data from configuration
    PORTALS = get_portals_list()
    PROJECTS = get_projects_dict()
except ImportError:
    # Fallback portal data if portal_config.py is not available
    PORTALS = [
        {
            'id': 'education',
            'title': 'AI & Education',
            'description': 'Interactive Learning Futures',
            'position': {'x': 5, 'y': 1, 'z': 5},
            'color': '#00aa66',
            'status': 'development'
        },
        {
            'id': 'democracy',
            'title': 'Democracy & Technology',
            'description': 'Critical Analysis',
            'position': {'x': -5, 'y': 1, 'z': 5},
            'color': '#aa0066',
            'status': 'development'
        },
        {
            'id': 'connection',
            'title': 'Human Connection',
            'description': 'Empathy & AI Philosophical Inquiry',
            'position': {'x': 0, 'y': 1, 'z': 8},
            'color': '#0066aa',
            'status': 'development'
        },
        {
            'id': 'analysis',
            'title': 'Data Visualization',
            'description': 'Crime Analytics Urban Studies',
            'position': {'x': -5, 'y': 1, 'z': -3},
            'color': '#aa6600',
            'status': 'development'
        }
    ]

    PROJECTS = {
        'education': {
            'id': 'education',
            'title': 'AI & Education Portal',
            'description': 'Future: Interactive AI tutoring systems, virtual classrooms with adaptive learning environments, and tools for addressing the education pipeline collapse.',
            'features': ['Adaptive Learning', 'Virtual Classrooms', 'AI Tutoring', 'Personalized Learning Paths'],
            'status': 'coming-soon',
            'eta': 'Q2 2024',
            'progress': 25
        },
        'democracy': {
            'id': 'democracy',
            'title': 'Democracy & Technology Portal',
            'description': 'Future: Simulations of democratic processes, visualization of political data, and interactive explorations of the threats to democratic norms.',
            'features': ['Democratic Simulations', 'Political Data Viz', 'Norm Analysis', 'Civic Engagement Tools'],
            'status': 'coming-soon',
            'eta': 'Q3 2024',
            'progress': 15
        },
        'connection': {
            'id': 'connection',
            'title': 'Human Connection Portal',
            'description': 'Future: VR experiences exploring human-AI empathy, virtual therapy environments, and philosophical spaces for contemplating consciousness.',
            'features': ['Empathy Training', 'Virtual Therapy', 'Philosophical Spaces', 'Social VR'],
            'status': 'coming-soon',
            'eta': 'Q4 2024',
            'progress': 10
        },
        'analysis': {
            'id': 'analysis',
            'title': 'Data & Analysis Portal',
            'description': 'Future: 3D data visualization spaces, crime mapping interfaces, and interactive urban planning tools based on your analytical work.',
            'features': ['3D Data Viz', 'Crime Mapping', 'Urban Planning', 'Real-time Analytics'],
            'status': 'coming-soon',
            'eta': 'Q1 2025',
            'progress': 5
        }
    }

class SignpostHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        """Handle GET requests"""
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        # API endpoints
        if path == '/api/health':
            self.send_api_response({
                'status': 'healthy',
                'message': 'Signpost Observatory VR Gateway is running',
                'timestamp': datetime.now().isoformat(),
                'framework': 'Python HTTP Server',
                'version': '1.0.0'
            })
            return
            
        elif path == '/api/portals':
            self.send_api_response(PORTALS)
            return
            
        elif path.startswith('/api/projects/'):
            project_id = path.split('/')[-1]
            if project_id in PROJECTS:
                self.send_api_response(PROJECTS[project_id])
            else:
                self.send_error(404, 'Project not found')
            return
            
        # Static file serving
        elif path == '/':
            # Serve the main HTML file
            self.path = '/public/index.html'
        elif path.startswith('/shared/'):
            # Serve shared components
            self.path = path
        elif path.startswith('/docs/'):
            # Serve documentation
            self.path = path
        elif path.startswith('/assets/'):
            # Serve assets
            self.path = '/public' + path
            
        # Default to serving static files
        return http.server.SimpleHTTPRequestHandler.do_GET(self)
    
    def send_api_response(self, data):
        """Send JSON API response"""
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())
    
    def log_message(self, format, *args):
        """Custom logging"""
        print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] {format % args}")

def main():
    """Start the server"""
    PORT = 8000
    
    # Change to the project directory
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    with socketserver.TCPServer(("", PORT), SignpostHTTPRequestHandler) as httpd:
        print("🚀 Signpost Observatory VR Gateway starting...")
        print(f"📱 Open http://localhost:{PORT} to experience the VR gateway")
        print(f"🔧 API available at http://localhost:{PORT}/api")
        print("Press Ctrl+C to stop the server")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n👋 Server stopped. Goodbye!")

if __name__ == '__main__':
    main() 