#!/usr/bin/env python3
"""
Signpost Observatory Project Management CLI
Easy way to create new levels and manage projects
"""

import argparse
import sys
import os
from portal_config import create_level_with_metadata, discover_levels, get_level_metadata

def create_project(args):
    """Create a new project/level"""
    try:
        result = create_level_with_metadata(
            level_name=args.name,
            category=args.category,
            title=args.title,
            description=args.description,
            template=args.template
        )
        
        print(f"✅ {result['message']}")
        print(f"📁 Level created at: {result['level_created']}")
        print(f"🔗 Portal ID: {result['portal_config']['id']}")
        print(f"🎯 Category: {result['portal_config']['category']}")
        print(f"📍 Position: {result['portal_config']['position']}")
        print(f"🎨 Color: {result['portal_config']['color']}")
        
        print(f"\n🚀 Your level is ready! Visit: http://localhost:5000/levels/{args.category}/{args.name}")
        print(f"📊 View in gateway: http://localhost:5000")
        
    except Exception as e:
        print(f"❌ Error creating project: {str(e)}")
        sys.exit(1)

def list_projects(args):
    """List all available projects/levels"""
    discovered_levels = discover_levels()
    
    if not discovered_levels:
        print("📭 No levels found")
        return
    
    print("🎮 Available Projects/Levels:")
    print("=" * 50)
    
    for category, category_data in discovered_levels.items():
        print(f"\n📂 Category: {category.upper()}")
        print("-" * 30)
        
        for level in category_data['levels']:
            status = "🟢 Ready" if level.get('title') else "🟡 Basic"
            print(f"  {status} {level['name']}")
            if level.get('title'):
                print(f"     📝 {level['title']}")
            if level.get('description'):
                print(f"     💬 {level['description']}")
            print(f"     🔗 http://localhost:5000/levels/{category}/{level['name']}")

def show_project(args):
    """Show detailed information about a specific project"""
    metadata = get_level_metadata(args.category, args.name)
    
    if not metadata:
        print(f"❌ Project not found: {args.category}/{args.name}")
        sys.exit(1)
    
    print(f"🎮 Project Details: {args.category}/{args.name}")
    print("=" * 50)
    print(f"📝 Title: {metadata.get('title', 'N/A')}")
    print(f"💬 Description: {metadata.get('description', 'N/A')}")
    print(f"📁 File: {metadata['file_path']}")
    print(f"📊 Size: {metadata['size']} bytes")
    print(f"📅 Created: {metadata['created']}")
    print(f"📅 Modified: {metadata['modified']}")
    print(f"🔗 URL: {metadata['url']}")
    
    if metadata.get('vr_mode'):
        print(f"🥽 VR Mode: {metadata['vr_mode']}")
    
    if metadata.get('entity_count'):
        print(f"🎯 A-Frame Entities: {metadata['entity_count']}")
    
    if metadata.get('components'):
        print(f"🔧 Components: {', '.join(metadata['components'])}")
    
    print(f"\n🚀 View: http://localhost:5000/levels/{args.category}/{args.name}")

def main():
    parser = argparse.ArgumentParser(
        description="Signpost Observatory Project Management CLI",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python manage.py create --name "my-vr-experience" --category "education"
  python manage.py create --name "democracy-sim" --category "democracy" --title "Democracy Simulator"
  python manage.py list
  python manage.py show --category "analysis" --name "attention-economy-exchange"
        """
    )
    
    subparsers = parser.add_subparsers(dest='command', help='Available commands')
    
    # Create command
    create_parser = subparsers.add_parser('create', help='Create a new project/level')
    create_parser.add_argument('--name', required=True, help='Level name (e.g., "my-vr-experience")')
    create_parser.add_argument('--category', required=True, 
                             choices=['education', 'democracy', 'connection', 'analysis', 'philosophy'],
                             help='Category for the level')
    create_parser.add_argument('--title', help='Display title (optional)')
    create_parser.add_argument('--description', help='Description (optional)')
    create_parser.add_argument('--template', default='basic', 
                             choices=['basic', 'interactive', 'data-viz'],
                             help='Template type (default: basic)')
    create_parser.set_defaults(func=create_project)
    
    # List command
    list_parser = subparsers.add_parser('list', help='List all available projects/levels')
    list_parser.set_defaults(func=list_projects)
    
    # Show command
    show_parser = subparsers.add_parser('show', help='Show details of a specific project')
    show_parser.add_argument('--category', required=True, help='Category of the project')
    show_parser.add_argument('--name', required=True, help='Name of the project')
    show_parser.set_defaults(func=show_project)
    
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        return
    
    args.func(args)

if __name__ == '__main__':
    main() 