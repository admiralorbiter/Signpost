"""
Portal Configuration for Signpost Observatory
Easy way to add new portals and manage existing ones
"""

import os
import json
from datetime import datetime

# Portal Configuration
PORTAL_CONFIG = {
    # Education Portal
    'education': {
        'id': 'education',
        'title': 'AI & Education',
        'description': 'Interactive Learning Futures',
        'category': 'education',
        'position': {'x': 5, 'y': 1, 'z': 5},
        'color': '#00aa66',
        'status': 'development',
        'project_data': {
            'title': 'AI & Education Portal',
            'description': 'Future: Interactive AI tutoring systems, virtual classrooms with adaptive learning environments, and tools for addressing the education pipeline collapse.',
            'features': ['Adaptive Learning', 'Virtual Classrooms', 'AI Tutoring', 'Personalized Learning Paths'],
            'status': 'coming-soon',
            'eta': 'Q2 2024',
            'progress': 25
        }
    },
    
    # Democracy Portal
    'democracy': {
        'id': 'democracy',
        'title': 'Democracy & Technology',
        'description': 'Critical Analysis',
        'category': 'democracy',
        'position': {'x': -5, 'y': 1, 'z': 5},
        'color': '#aa0066',
        'status': 'development',
        'project_data': {
            'title': 'Democracy & Technology Portal',
            'description': 'Future: Simulations of democratic processes, visualization of political data, and interactive explorations of the threats to democratic norms.',
            'features': ['Democratic Simulations', 'Political Data Viz', 'Norm Analysis', 'Civic Engagement Tools'],
            'status': 'coming-soon',
            'eta': 'Q3 2024',
            'progress': 15
        }
    },
    
    # Connection Portal
    'connection': {
        'id': 'connection',
        'title': 'Human Connection',
        'description': 'Empathy & AI Philosophical Inquiry',
        'category': 'connection',
        'position': {'x': 0, 'y': 1, 'z': 8},
        'color': '#0066aa',
        'status': 'development',
        'project_data': {
            'title': 'Human Connection Portal',
            'description': 'Future: VR experiences exploring human-AI empathy, virtual therapy environments, and philosophical spaces for contemplating consciousness.',
            'features': ['Empathy Training', 'Virtual Therapy', 'Philosophical Spaces', 'Social VR'],
            'status': 'coming-soon',
            'eta': 'Q4 2024',
            'progress': 10
        }
    },
    
    # Analysis Portal
    'analysis': {
        'id': 'analysis',
        'title': 'Data Visualization',
        'description': 'Crime Analytics Urban Studies',
        'category': 'analysis',
        'position': {'x': -5, 'y': 1, 'z': -3},
        'color': '#aa6600',
        'status': 'development',
        'project_data': {
            'title': 'Data & Analysis Portal',
            'description': 'Future: 3D data visualization spaces, crime mapping interfaces, and interactive urban planning tools based on your analytical work.',
            'features': ['3D Data Viz', 'Crime Mapping', 'Urban Planning', 'Real-time Analytics'],
            'status': 'coming-soon',
            'eta': 'Q1 2025',
            'progress': 5
        }
    },
    'attention-economy-exchange': {
        'id': 'attention-economy-exchange',
        'title': 'Attention Economy Exchange',
        'description': 'Interactive moral simulation: You ARE the product being traded',
        'category': 'analysis',  # Fits in the data visualization and analytics category
        'position': {'x': -8, 'y': 1, 'z': 8},  # Adjust position as needed for your gateway layout
        'color': '#ff3333',  # Red color to represent the danger/warning theme
        'status': 'ready',
        'project_data': {
            'title': 'The Attention Economy Stock Exchange - Interactive Moral Simulation',
            'description': 'Step into the role of a Junior Attention Broker in this immersive moral simulation. You will face real choices that tech companies make daily: deploy psychological manipulation for profit, or refuse and watch competitors succeed. Experience both sides of surveillance capitalism - as the manipulator AND the manipulated. Make trades that hook millions of users, witness the human cost of your decisions, and ultimately choose between whistleblowing heroism or corrupted villainy. This is not just education - it\'s an interactive moral laboratory that reveals the true mechanics of digital manipulation.',
            'features': [
                'Interactive moral choice system with real consequences',
                'Play as both predator and prey in the attention economy',
                'Multiple branching storylines with hero/villain endings',
                'Real-time corruption tracking and life degradation',
                'Face-to-face encounters with your victims',
                'Authentic trader terminals with manipulation tools',
                'Dynamic environmental storytelling',
                'Whistleblower finale with multiple endings',
                'Educational overlay revealing real manipulation tactics',
                'Immersive 3D trading floor with atmospheric effects'
            ],
            'gameplay_mechanics': [
                'Moral decision engine: Every choice has lasting consequences',
                'Corruption meter: Watch your soul degrade with each evil choice',
                'Victim interaction: Meet the people harmed by your decisions',
                'Resource management: Your humanity vs. your profit',
                'Multiple endings based on your moral choices',
                'Real-time environmental degradation reflecting your corruption'
            ],
            'status': 'ready',
            'eta': 'Available Now',
            'progress': 100,
            'educational_value': 'Maximum - Visceral understanding of surveillance capitalism through interactive moral choices',
            'target_audience': 'General public, educators, policymakers, tech workers questioning their industry',
            'unique_vr_elements': [
                'Stand on the auction block where YOU are being sold',
                'Physical interaction with manipulation tools',
                'Spatial relationship between your actions and victims',
                '360-degree immersion in the attention economy',
                'Environmental storytelling through 3D space',
                'Embodied moral choices through VR interaction'
            ],
            'key_insights': [
                'Experience being both manipulator and victim simultaneously',
                'Understand the psychology behind infinite scroll and variable rewards',
                'Feel the weight of moral choices in tech development',
                'Witness the human cost of surveillance capitalism',
                'Learn why "free" platforms are actually the most expensive',
                'Understand how individual choices compound into societal harm'
            ],
            'real_world_impact': 'Prepares users to recognize and resist digital manipulation in their daily lives while understanding the systemic nature of attention capitalism'
        }
    },
}

# Template for adding new portals
NEW_PORTAL_TEMPLATE = {
    'id': 'new-portal-id',
    'title': 'New Portal Title',
    'description': 'Brief description',
    'position': {'x': 0, 'y': 1, 'z': 0},  # Adjust position as needed
    'color': '#4488cc',  # Choose a unique color
    'status': 'development',
    'project_data': {
        'title': 'New Portal Full Title',
        'description': 'Detailed description of what this portal will contain...',
        'features': ['Feature 1', 'Feature 2', 'Feature 3'],
        'status': 'coming-soon',  # Options: coming-soon, in-development, ready, live
        'eta': 'Q2 2024',  # Estimated time of arrival
        'progress': 0  # Development progress (0-100)
    }
}

def get_portals_list():
    """Get list of portals for API"""
    return [portal for portal in PORTAL_CONFIG.values()]

def get_projects_dict():
    """Get projects dictionary for API"""
    return {portal_id: portal['project_data'] for portal_id, portal in PORTAL_CONFIG.items()}

def add_new_portal(portal_id, portal_config):
    """Add a new portal to the configuration"""
    PORTAL_CONFIG[portal_id] = portal_config
    return True

def remove_portal(portal_id):
    """Remove a portal from the configuration"""
    if portal_id in PORTAL_CONFIG:
        del PORTAL_CONFIG[portal_id]
        return True
    return False

def update_portal_status(portal_id, status):
    """Update portal status"""
    if portal_id in PORTAL_CONFIG:
        PORTAL_CONFIG[portal_id]['status'] = status
        PORTAL_CONFIG[portal_id]['project_data']['status'] = status
        return True
    return False

def get_portals_with_levels():
    """Get only portals that have actual level files"""
    import os
    available_portals = []
    
    for portal_id, portal_config in PORTAL_CONFIG.items():
        category = portal_config.get('category')
        if category:
            # Check if there are any HTML files in the category folder
            category_path = f'public/levels/{category}'
            if os.path.exists(category_path):
                html_files = [f for f in os.listdir(category_path) if f.endswith('.html')]
                if html_files:
                    # Add the first level as the default
                    portal_config['default_level'] = html_files[0].replace('.html', '')
                    portal_config['available_levels'] = [f.replace('.html', '') for f in html_files]
                    available_portals.append(portal_config)
    
    return available_portals

def get_portal_position(portal_id, index=0):
    """Get automatic position for portal based on category and index"""
    category_positions = {
        'education': {'x': 5, 'y': 1, 'z': 5},
        'democracy': {'x': -5, 'y': 1, 'z': 5},
        'connection': {'x': 0, 'y': 1, 'z': 8},
        'analysis': {'x': -5, 'y': 1, 'z': -3},
        'philosophy': {'x': 8, 'y': 1, 'z': -8}
    }
    
    portal_config = PORTAL_CONFIG.get(portal_id, {})
    category = portal_config.get('category')
    
    if category and category in category_positions:
        base_pos = category_positions[category]
        # Offset multiple portals in same category
        offset = index * 3
        return {
            'x': base_pos['x'] + offset,
            'y': base_pos['y'],
            'z': base_pos['z'] + offset
        }
    
    # Fallback position
    return {'x': 0, 'y': 1, 'z': 0}

# NEW: Enhanced Project & Level Management API Functions

def discover_levels():
    """Automatically discover all levels in the levels directory"""
    levels_data = {}
    levels_dir = 'public/levels'
    
    if not os.path.exists(levels_dir):
        return levels_data
    
    for category in os.listdir(levels_dir):
        category_path = os.path.join(levels_dir, category)
        if os.path.isdir(category_path):
            levels = []
            for filename in os.listdir(category_path):
                if filename.endswith('.html'):
                    level_name = filename.replace('.html', '')
                    level_path = os.path.join(category_path, filename)
                    
                    # Get file stats for metadata
                    stat = os.stat(level_path)
                    
                    level_data = {
                        'name': level_name,
                        'filename': filename,
                        'category': category,
                        'url': f'/levels/{category}/{level_name}',
                        'created': datetime.fromtimestamp(stat.st_ctime).isoformat(),
                        'modified': datetime.fromtimestamp(stat.st_mtime).isoformat(),
                        'size': stat.st_size
                    }
                    
                    # Try to read level metadata from HTML file
                    try:
                        with open(level_path, 'r', encoding='utf-8') as f:
                            content = f.read()
                            # Extract title from HTML
                            import re
                            title_match = re.search(r'<title>(.*?)</title>', content, re.IGNORECASE)
                            if title_match:
                                level_data['title'] = title_match.group(1).strip()
                            else:
                                level_data['title'] = level_name.replace('-', ' ').title()
                            
                            # Extract description from meta tag
                            desc_match = re.search(r'<meta name="description" content="(.*?)"', content, re.IGNORECASE)
                            if desc_match:
                                level_data['description'] = desc_match.group(1).strip()
                            
                            # Check for VR/AR specific meta tags
                            vr_meta = re.search(r'<meta name="vr-mode" content="(.*?)"', content, re.IGNORECASE)
                            if vr_meta:
                                level_data['vr_mode'] = vr_meta.group(1).strip()
                            
                    except Exception as e:
                        level_data['title'] = level_name.replace('-', ' ').title()
                        level_data['error'] = f"Could not read metadata: {str(e)}"
                    
                    levels.append(level_data)
            
            if levels:
                levels_data[category] = {
                    'category': category,
                    'levels': levels,
                    'count': len(levels)
                }
    
    return levels_data

def get_level_metadata(category, level_name):
    """Get detailed metadata for a specific level"""
    level_path = f'public/levels/{category}/{level_name}.html'
    
    if not os.path.exists(level_path):
        return None
    
    stat = os.stat(level_path)
    
    metadata = {
        'name': level_name,
        'category': category,
        'url': f'/levels/{category}/{level_name}',
        'created': datetime.fromtimestamp(stat.st_ctime).isoformat(),
        'modified': datetime.fromtimestamp(stat.st_mtime).isoformat(),
        'size': stat.st_size,
        'file_path': level_path
    }
    
    # Try to extract more metadata from the HTML file
    try:
        with open(level_path, 'r', encoding='utf-8') as f:
            content = f.read()
            import re
            
            # Extract title
            title_match = re.search(r'<title>(.*?)</title>', content, re.IGNORECASE)
            if title_match:
                metadata['title'] = title_match.group(1).strip()
            
            # Extract description
            desc_match = re.search(r'<meta name="description" content="(.*?)"', content, re.IGNORECASE)
            if desc_match:
                metadata['description'] = desc_match.group(1).strip()
            
            # Extract VR/AR specific tags
            vr_meta = re.search(r'<meta name="vr-mode" content="(.*?)"', content, re.IGNORECASE)
            if vr_meta:
                metadata['vr_mode'] = vr_meta.group(1).strip()
            
            # Extract A-Frame specific data
            aframe_entities = re.findall(r'<a-entity[^>]*>', content)
            metadata['entity_count'] = len(aframe_entities)
            
            # Check for specific components
            components = []
            if 'position' in content:
                components.append('position')
            if 'rotation' in content:
                components.append('rotation')
            if 'scale' in content:
                components.append('scale')
            if 'geometry' in content:
                components.append('geometry')
            if 'material' in content:
                components.append('material')
            if 'animation' in content:
                components.append('animation')
            if 'sound' in content:
                components.append('sound')
            
            metadata['components'] = components
            
    except Exception as e:
        metadata['error'] = f"Could not read metadata: {str(e)}"
    
    return metadata

def auto_generate_portal_config(level_name, category, title=None, description=None):
    """Automatically generate portal configuration for a new level"""
    # Generate a portal ID from the level name
    portal_id = level_name.replace('-', '_')
    
    # Get automatic position
    position = get_portal_position(portal_id)
    
    # Generate color based on category
    category_colors = {
        'education': '#00aa66',
        'democracy': '#aa0066', 
        'connection': '#0066aa',
        'analysis': '#aa6600',
        'philosophy': '#6600aa'
    }
    color = category_colors.get(category, '#4488cc')
    
    # Generate title if not provided
    if not title:
        title = level_name.replace('-', ' ').title()
    
    # Generate description if not provided
    if not description:
        description = f"Interactive {category.title()} experience: {title}"
    
    portal_config = {
        'id': portal_id,
        'title': title,
        'description': description,
        'category': category,
        'position': position,
        'color': color,
        'status': 'ready',
        'project_data': {
            'title': title,
            'description': description,
            'features': ['VR Experience', 'Interactive Elements', 'Immersive Design'],
            'status': 'ready',
            'eta': 'Available Now',
            'progress': 100,
            'level_name': level_name,
            'category': category
        }
    }
    
    return portal_config

def create_level_with_metadata(level_name, category, title=None, description=None, template='basic'):
    """Create a new level with automatic metadata and optional portal config"""
    level_dir = f'public/levels/{category}'
    level_path = f'{level_dir}/{level_name}.html'
    
    # Create directory if it doesn't exist
    os.makedirs(level_dir, exist_ok=True)
    
    # Generate title if not provided
    if not title:
        title = level_name.replace('-', ' ').title()
    
    # Generate description if not provided
    if not description:
        description = f"Interactive {category.title()} experience: {title}"
    
    # Create basic HTML template
    html_template = f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{title}</title>
    <meta name="description" content="{description}">
    <meta name="vr-mode" content="vr">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://aframe.io/releases/1.4.0/aframe.min.js"></script>
    <script src="https://cdn.jsdelivr.net/gh/donmccurdy/aframe-extras@v6.1.1/dist/aframe-extras.min.js"></script>
</head>
<body>
    <a-scene
        vr-mode-ui="enabled: true"
        embedded
        arjs="sourceType: webcam; debugUIEnabled: false;"
        renderer="logarithmicDepthBuffer: true;"
        antialias="true"
        stats>
        
        <!-- Environment -->
        <a-assets>
            <!-- Add your assets here -->
        </a-assets>
        
        <!-- Camera -->
        <a-entity id="camera" position="0 1.6 0">
            <a-camera look-controls wasd-controls>
                <a-cursor></a-cursor>
            </a-camera>
        </a-entity>
        
        <!-- Lighting -->
        <a-light type="ambient" color="#ffffff" intensity="0.6"></a-light>
        <a-light type="directional" position="0 10 5" color="#ffffff" intensity="0.8"></a-light>
        
        <!-- Ground -->
        <a-plane position="0 0 0" rotation="-90 0 0" width="20" height="20" color="#cccccc"></a-plane>
        
        <!-- Your content goes here -->
        <a-box position="0 1 0" color="#ff0000" animation="property: rotation; to: 0 360 0; dur: 2000; easing: linear; loop: true"></a-box>
        
        <!-- Navigation back to gateway -->
        <a-entity position="0 0 -5">
            <a-plane position="0 1.5 0" width="2" height="1" color="#0066cc" 
                     link="href: /; title: Back to Gateway"></a-plane>
            <a-text value="Back to Gateway" position="0 1.5 0.1" align="center" color="#ffffff"></a-text>
        </a-entity>
        
    </a-scene>
</body>
</html>"""
    
    # Write the file
    with open(level_path, 'w', encoding='utf-8') as f:
        f.write(html_template)
    
    # Auto-generate portal config
    portal_config = auto_generate_portal_config(level_name, category, title, description)
    
    # Add to portal config
    add_new_portal(portal_config['id'], portal_config)
    
    return {
        'level_created': level_path,
        'portal_config': portal_config,
        'message': f'Level "{title}" created successfully in category "{category}"'
    }

# Example of how to add a new portal
def add_example_portal():
    """Example of adding a new portal"""
    new_portal = {
        'id': 'gaming',
        'title': 'Gaming & Entertainment',
        'description': 'Interactive Gaming Experiences',
        'position': {'x': 8, 'y': 1, 'z': -5},
        'color': '#cc4488',
        'status': 'development',
        'project_data': {
            'title': 'Gaming & Entertainment Portal',
            'description': 'Future: Immersive gaming experiences, virtual arcades, and interactive entertainment spaces.',
            'features': ['VR Gaming', 'Virtual Arcades', 'Social Gaming', 'Interactive Stories'],
            'status': 'coming-soon',
            'eta': 'Q2 2025',
            'progress': 0
        }
    }
    add_new_portal('gaming', new_portal)
    return new_portal 