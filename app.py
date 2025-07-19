from flask import Flask, jsonify, send_from_directory, request
from flask_cors import CORS
import os
from datetime import datetime
from portal_config import get_portals_list, get_projects_dict, add_new_portal, remove_portal, update_portal_status

app = Flask(__name__)
CORS(app)

# Configuration
app.config['SECRET_KEY'] = 'signpost-observatory-2024'
app.config['STATIC_FOLDER'] = 'public'

# Get portal data from configuration
PORTALS = get_portals_list()
PROJECTS = get_projects_dict()

@app.route('/')
def index():
    """Serve the main VR gateway"""
    return send_from_directory('public', 'index.html')

@app.route('/<filename>')
def serve_html(filename):
    """Serve HTML files from the public directory"""
    if filename.endswith('.html'):
        return send_from_directory('public', filename)
    else:
        return jsonify({'error': 'File not found'}), 404

@app.route('/levels/<category>/<level_name>')
def serve_level(category, level_name):
    """Serve levels from organized folder structure"""
    if not level_name.endswith('.html'):
        level_name += '.html'
    return send_from_directory(f'public/levels/{category}', level_name)

@app.route('/api/levels/<category>')
def get_levels_in_category(category):
    """Get list of available levels in a category"""
    import os
    category_path = f'public/levels/{category}'
    if not os.path.exists(category_path):
        return jsonify({'error': 'Category not found'}), 404
    
    levels = []
    for filename in os.listdir(category_path):
        if filename.endswith('.html'):
            levels.append(filename.replace('.html', ''))
    
    return jsonify({
        'category': category,
        'levels': levels,
        'count': len(levels)
    })

@app.route('/api/levels/available')
def get_available_levels():
    """Get all available levels across all categories"""
    import os
    available_levels = {}
    
    levels_dir = 'public/levels'
    if not os.path.exists(levels_dir):
        return jsonify({'error': 'Levels directory not found'}), 404
    
    for category in os.listdir(levels_dir):
        category_path = os.path.join(levels_dir, category)
        if os.path.isdir(category_path):
            levels = []
            for filename in os.listdir(category_path):
                if filename.endswith('.html'):
                    levels.append(filename.replace('.html', ''))
            if levels:  # Only include categories with actual levels
                available_levels[category] = levels
    
    return jsonify({
        'available_levels': available_levels,
        'total_levels': sum(len(levels) for levels in available_levels.values())
    })

@app.route('/api/health')
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'Signpost Observatory VR Gateway is running',
        'timestamp': datetime.now().isoformat(),
        'framework': 'Flask',
        'version': '1.0.0'
    })

@app.route('/api/portals')
def get_portals():
    """Get all available portals"""
    return jsonify(PORTALS)

@app.route('/api/portals/available')
def get_available_portals():
    """Get only portals that have actual level files"""
    from portal_config import get_portals_with_levels
    available_portals = get_portals_with_levels()
    return jsonify(available_portals)

@app.route('/api/projects/<project_id>')
def get_project(project_id):
    """Get specific project details"""
    if project_id not in PROJECTS:
        return jsonify({'error': 'Project not found'}), 404
    
    return jsonify(PROJECTS[project_id])

# Admin endpoints for portal management
@app.route('/api/admin/portals', methods=['POST'])
def add_portal():
    """Add a new portal (admin only)"""
    data = request.get_json()
    portal_id = data.get('id')
    portal_config = data.get('config')
    
    if not portal_id or not portal_config:
        return jsonify({'error': 'Missing portal ID or config'}), 400
    
    success = add_new_portal(portal_id, portal_config)
    if success:
        # Refresh the data
        global PORTALS, PROJECTS
        PORTALS = get_portals_list()
        PROJECTS = get_projects_dict()
        return jsonify({'message': 'Portal added successfully', 'portal_id': portal_id})
    else:
        return jsonify({'error': 'Failed to add portal'}), 500

@app.route('/api/admin/portals/<portal_id>', methods=['DELETE'])
def remove_portal_endpoint(portal_id):
    """Remove a portal (admin only)"""
    success = remove_portal(portal_id)
    if success:
        # Refresh the data
        global PORTALS, PROJECTS
        PORTALS = get_portals_list()
        PROJECTS = get_projects_dict()
        return jsonify({'message': 'Portal removed successfully'})
    else:
        return jsonify({'error': 'Portal not found'}), 404

@app.route('/api/admin/portals/<portal_id>/status', methods=['PUT'])
def update_portal_status_endpoint(portal_id):
    """Update portal status (admin only)"""
    data = request.get_json()
    status = data.get('status')
    
    if not status:
        return jsonify({'error': 'Missing status'}), 400
    
    success = update_portal_status(portal_id, status)
    if success:
        # Refresh the data
        global PORTALS, PROJECTS
        PORTALS = get_portals_list()
        PROJECTS = get_projects_dict()
        return jsonify({'message': 'Status updated successfully'})
    else:
        return jsonify({'error': 'Portal not found'}), 404

@app.route('/shared/<path:filename>')
def shared_files(filename):
    """Serve shared components and utilities"""
    return send_from_directory('shared', filename)

@app.route('/docs/<path:filename>')
def docs_files(filename):
    """Serve documentation files"""
    return send_from_directory('docs', filename)

@app.route('/assets/<path:filename>')
def assets_files(filename):
    """Serve asset files"""
    return send_from_directory('public/assets', filename)

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({'error': 'Route not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    print("🚀 Signpost Observatory VR Gateway starting...")
    print("📱 Open http://localhost:5000 to experience the VR gateway")
    print("🔧 API available at http://localhost:5000/api")
    app.run(debug=True, host='0.0.0.0', port=5000) 