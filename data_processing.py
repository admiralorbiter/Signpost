"""
Data Processing Pipeline for Signpost Observatory
Handles fetching, processing, and formatting data for 3D visualization projects
"""

import json
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import requests
from typing import Dict, List, Any, Optional, Union
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DataProcessor:
    """Main data processing class for handling various data sources and formats"""
    
    def __init__(self):
        self.cache_dir = "data_cache"
        self.ensure_cache_directory()
        
    def ensure_cache_directory(self):
        """Ensure the cache directory exists"""
        if not os.path.exists(self.cache_dir):
            os.makedirs(self.cache_dir)
    
    def fetch_data(self, source: str, params: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Fetch data from various sources
        
        Args:
            source: Data source identifier
            params: Parameters for the data source
            
        Returns:
            Dictionary containing the fetched data and metadata
        """
        try:
            if source == "crime_data":
                return self._fetch_crime_data(params)
            elif source == "funding_data":
                return self._fetch_funding_data(params)
            elif source == "education_data":
                return self._fetch_education_data(params)
            elif source == "democracy_data":
                return self._fetch_democracy_data(params)
            elif source == "kansas_city_crashes":
                return self._fetch_csv_data("kansas-city-crashes", "crashes", params)
            elif source == "kansas_city_intersections":
                return self._fetch_csv_data("kansas-city-crashes", "intersections", params)
            elif source == "kansas_city_gps":
                return self._fetch_csv_data("kansas-city-crashes", "gps", params)
            else:
                raise ValueError(f"Unknown data source: {source}")
        except Exception as e:
            logger.error(f"Error fetching data from {source}: {str(e)}")
            return {"error": str(e), "source": source}
    
    def process_data(self, raw_data: Dict[str, Any], format_type: str = "3d_scatter") -> Dict[str, Any]:
        """
        Process raw data into formats suitable for 3D visualization
        
        Args:
            raw_data: Raw data dictionary
            format_type: Type of visualization format ("3d_scatter", "heatmap", "timeline", "network")
            
        Returns:
            Processed data ready for 3D visualization
        """
        try:
            if format_type == "3d_scatter":
                return self._format_3d_scatter(raw_data)
            elif format_type == "heatmap":
                return self._format_heatmap(raw_data)
            elif format_type == "timeline":
                return self._format_timeline(raw_data)
            elif format_type == "network":
                return self._format_network(raw_data)
            else:
                raise ValueError(f"Unknown format type: {format_type}")
        except Exception as e:
            logger.error(f"Error processing data: {str(e)}")
            return {"error": str(e), "format_type": format_type}
    
    def _fetch_crime_data(self, params: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Fetch crime data (simulated for now)"""
        # Simulate crime data for Kansas City
        np.random.seed(42)
        n_points = params.get('n_points', 100) if params else 100
        
        # Generate realistic crime data
        crime_types = ['Theft', 'Assault', 'Vandalism', 'Burglary', 'Traffic']
        neighborhoods = ['Downtown', 'Westport', 'Plaza', 'Brookside', 'Waldo']
        
        data = []
        for i in range(n_points):
            # Generate coordinates within Kansas City bounds
            lat = 39.0997 + np.random.normal(0, 0.01)  # Kansas City latitude
            lng = -94.5786 + np.random.normal(0, 0.01)  # Kansas City longitude
            
            data.append({
                'id': i,
                'type': np.random.choice(crime_types),
                'neighborhood': np.random.choice(neighborhoods),
                'latitude': lat,
                'longitude': lng,
                'timestamp': (datetime.now() - timedelta(days=np.random.randint(0, 365))).isoformat(),
                'severity': np.random.randint(1, 10),
                'description': f"Crime incident #{i}"
            })
        
        return {
            'data': data,
            'metadata': {
                'source': 'crime_data',
                'total_records': len(data),
                'date_range': {
                    'start': min(d['timestamp'] for d in data),
                    'end': max(d['timestamp'] for d in data)
                },
                'crime_types': list(set(d['type'] for d in data)),
                'neighborhoods': list(set(d['neighborhood'] for d in data))
            }
        }
    
    def _fetch_funding_data(self, params: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Fetch federal funding data (simulated)"""
        np.random.seed(42)
        n_agencies = params.get('n_agencies', 20) if params else 20
        
        agencies = [
            'Department of Education', 'Department of Health', 'Department of Transportation',
            'Department of Defense', 'Department of Energy', 'Department of Agriculture',
            'Department of Housing', 'Department of Justice', 'Department of Labor',
            'Department of Commerce', 'Department of Interior', 'Department of State',
            'Department of Treasury', 'Department of Veterans Affairs', 'Department of Homeland Security',
            'NASA', 'National Science Foundation', 'Small Business Administration',
            'Environmental Protection Agency', 'General Services Administration'
        ]
        
        data = []
        for i in range(n_agencies):
            agency = agencies[i % len(agencies)]
            base_funding = np.random.uniform(1e9, 1e12)  # 1B to 1T
            year = 2024
            
            for month in range(1, 13):
                # Add some variation month to month
                variation = np.random.normal(1, 0.1)
                monthly_funding = base_funding / 12 * variation
                
                data.append({
                    'id': f"{agency}_{year}_{month}",
                    'agency': agency,
                    'year': year,
                    'month': month,
                    'funding_amount': monthly_funding,
                    'funding_category': np.random.choice(['Grants', 'Contracts', 'Direct Spending']),
                    'recipient_state': np.random.choice(['MO', 'KS', 'CA', 'TX', 'NY', 'FL', 'IL', 'PA', 'OH', 'GA']),
                    'program_type': np.random.choice(['Research', 'Infrastructure', 'Education', 'Healthcare', 'Defense'])
                })
        
        return {
            'data': data,
            'metadata': {
                'source': 'funding_data',
                'total_records': len(data),
                'total_funding': sum(d['funding_amount'] for d in data),
                'agencies': list(set(d['agency'] for d in data)),
                'categories': list(set(d['funding_category'] for d in data)),
                'states': list(set(d['recipient_state'] for d in data))
            }
        }
    
    def _fetch_education_data(self, params: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Fetch education data (simulated)"""
        np.random.seed(42)
        n_schools = params.get('n_schools', 50) if params else 50
        
        school_types = ['Elementary', 'Middle', 'High', 'Charter', 'Private']
        districts = ['Kansas City', 'Independence', 'Blue Springs', 'Lee\'s Summit', 'Raytown']
        
        data = []
        for i in range(n_schools):
            school_type = np.random.choice(school_types)
            district = np.random.choice(districts)
            
            # Generate realistic coordinates within the metro area
            lat = 39.0997 + np.random.normal(0, 0.02)
            lng = -94.5786 + np.random.normal(0, 0.02)
            
            data.append({
                'id': i,
                'name': f"{district} {school_type} School #{i}",
                'type': school_type,
                'district': district,
                'latitude': lat,
                'longitude': lng,
                'enrollment': np.random.randint(200, 2000),
                'graduation_rate': np.random.uniform(0.6, 1.0),
                'test_scores': np.random.uniform(60, 95),
                'funding_per_student': np.random.uniform(8000, 15000),
                'teacher_ratio': np.random.uniform(15, 25)
            })
        
        return {
            'data': data,
            'metadata': {
                'source': 'education_data',
                'total_schools': len(data),
                'total_enrollment': sum(d['enrollment'] for d in data),
                'school_types': list(set(d['type'] for d in data)),
                'districts': list(set(d['district'] for d in data))
            }
        }
    
    def _fetch_democracy_data(self, params: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Fetch democracy-related data (simulated)"""
        np.random.seed(42)
        n_districts = params.get('n_districts', 100) if params else 100
        
        states = ['MO', 'KS', 'CA', 'TX', 'NY', 'FL', 'IL', 'PA', 'OH', 'GA']
        
        data = []
        for i in range(n_districts):
            state = np.random.choice(states)
            
            data.append({
                'id': i,
                'district_name': f"District {i}",
                'state': state,
                'population': np.random.randint(500000, 800000),
                'voter_turnout': np.random.uniform(0.3, 0.8),
                'partisan_lean': np.random.uniform(-1, 1),  # -1 to 1 scale
                'gerrymander_score': np.random.uniform(0, 1),  # 0 = fair, 1 = gerrymandered
                'demographic_diversity': np.random.uniform(0.1, 0.9),
                'income_inequality': np.random.uniform(0.2, 0.8),
                'education_level': np.random.uniform(0.2, 0.9)
            })
        
        return {
            'data': data,
            'metadata': {
                'source': 'democracy_data',
                'total_districts': len(data),
                'total_population': sum(d['population'] for d in data),
                'states': list(set(d['state'] for d in data)),
                'avg_voter_turnout': np.mean([d['voter_turnout'] for d in data]),
                'avg_gerrymander_score': np.mean([d['gerrymander_score'] for d in data])
            }
        }
    
    def _fetch_csv_data(self, project: str, data_type: str, params: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Fetch data from CSV files in the data directory
        
        Args:
            project: Project name (e.g., 'kansas-city-crashes')
            data_type: Type of data (e.g., 'crashes', 'intersections', 'gps')
            params: Optional parameters for data processing
            
        Returns:
            Dictionary containing the CSV data and metadata
        """
        try:
            # Look for CSV files in the project's raw data directory
            raw_dir = f"data/projects/{project}/raw"
            if not os.path.exists(raw_dir):
                raise FileNotFoundError(f"Raw data directory not found: {raw_dir}")
            
            # Find CSV files matching the data type pattern
            csv_files = []
            for file in os.listdir(raw_dir):
                if file.endswith('.csv') and data_type in file.lower():
                    csv_files.append(os.path.join(raw_dir, file))
            
            # Handle specific file name mappings for Kansas City data
            if not csv_files and project == "kansas-city-crashes":
                if data_type == "crashes":
                    crash_file = os.path.join(raw_dir, "combined_crash_data.csv")
                    if os.path.exists(crash_file):
                        csv_files = [crash_file]
                elif data_type == "intersections":
                    intersection_file = os.path.join(raw_dir, "all_intersections.csv")
                    if os.path.exists(intersection_file):
                        csv_files = [intersection_file]
            
            if not csv_files:
                # If no specific files found, look for sample files
                sample_file = f"sample_{data_type}.csv"
                sample_path = os.path.join(raw_dir, sample_file)
                if os.path.exists(sample_path):
                    csv_files = [sample_path]
                else:
                    raise FileNotFoundError(f"No CSV files found for {data_type} in {raw_dir}")
            
            # Read the first matching CSV file
            csv_path = csv_files[0]
            df = pd.read_csv(csv_path)
            
            # Clean column names (remove extra spaces and unnamed columns)
            df.columns = df.columns.str.strip()
            df = df.drop(columns=[col for col in df.columns if 'Unnamed' in col])
            
            # Convert DataFrame to list of dictionaries
            data = df.to_dict('records')
            
            # Convert pandas data types to JSON-serializable formats
            for record in data:
                for key, value in record.items():
                    # Convert pandas Int64 to regular int
                    if hasattr(value, 'item'):
                        record[key] = value.item()
                    # Convert numpy types to Python types
                    elif hasattr(value, 'dtype'):
                        if value.dtype.kind in 'iuf':  # integer, unsigned, float
                            record[key] = value.item()
                        else:
                            record[key] = str(value)
                    # Handle None values and NaN
                    elif value is None or (hasattr(value, '__float__') and str(value) == 'nan'):
                        record[key] = None
                    # Handle NaN values from pandas
                    elif str(value).lower() == 'nan':
                        record[key] = None
            
            # Add IDs if not present
            for i, record in enumerate(data):
                if 'id' not in record:
                    record['id'] = i
            
            # Apply any filtering based on params
            if params and 'limit' in params:
                data = data[:params['limit']]
            
            return {
                'data': data,
                'metadata': {
                    'source': f"{project}_{data_type}",
                    'file_path': csv_path,
                    'total_records': len(data),
                    'columns': list(df.columns),
                    'data_types': {col: str(dtype) for col, dtype in df.dtypes.to_dict().items()}
                }
            }
            
        except Exception as e:
            logger.error(f"Error fetching CSV data for {project}/{data_type}: {str(e)}")
            return {"error": str(e), "source": f"{project}_{data_type}"}
    
    def _format_3d_scatter(self, raw_data: Dict[str, Any]) -> Dict[str, Any]:
        """Format data for 3D scatter plot visualization"""
        data = raw_data.get('data', [])
        metadata = raw_data.get('metadata', {})
        
        if not data:
            return {"error": "No data to format"}
        
        # Extract common fields
        formatted_data = []
        for item in data:
            point = {
                'id': item.get('id', 0),
                'x': item.get('longitude', item.get('month', 0)),
                'y': item.get('latitude', item.get('funding_amount', 0)),
                'z': item.get('severity', item.get('enrollment', item.get('voter_turnout', 0))),
                'color': self._get_color_for_item(item),
                'size': self._get_size_for_item(item),
                'label': item.get('type', item.get('agency', item.get('name', item.get('district_name', '')))),
                'description': self._get_description_for_item(item)
            }
            formatted_data.append(point)
        
        return {
            'type': '3d_scatter',
            'data': formatted_data,
            'metadata': metadata,
            'visualization_config': {
                'x_label': 'Longitude/Month/Funding',
                'y_label': 'Latitude/Amount/Enrollment',
                'z_label': 'Severity/Size/Turnout',
                'color_scale': 'viridis',
                'size_range': [0.1, 2.0]
            }
        }
    
    def _format_heatmap(self, raw_data: Dict[str, Any]) -> Dict[str, Any]:
        """Format data for heatmap visualization"""
        data = raw_data.get('data', [])
        metadata = raw_data.get('metadata', {})
        
        if not data:
            return {"error": "No data to format"}
        
        # Group data by categories for heatmap
        categories = {}
        for item in data:
            category = item.get('type', item.get('agency', item.get('district', 'Unknown')))
            if category not in categories:
                categories[category] = []
            categories[category].append(item)
        
        # Calculate heatmap values
        heatmap_data = []
        for category, items in categories.items():
            avg_value = np.mean([self._get_heatmap_value(item) for item in items])
            count = len(items)
            heatmap_data.append({
                'category': category,
                'value': avg_value,
                'count': count,
                'color': self._get_color_for_category(category)
            })
        
        return {
            'type': 'heatmap',
            'data': heatmap_data,
            'metadata': metadata,
            'visualization_config': {
                'color_scale': 'plasma',
                'value_range': [min(d['value'] for d in heatmap_data), max(d['value'] for d in heatmap_data)]
            }
        }
    
    def _format_timeline(self, raw_data: Dict[str, Any]) -> Dict[str, Any]:
        """Format data for timeline visualization"""
        data = raw_data.get('data', [])
        metadata = raw_data.get('metadata', {})
        
        if not data:
            return {"error": "No data to format"}
        
        # Group by time periods
        timeline_data = {}
        for item in data:
            time_key = self._get_time_key(item)
            if time_key not in timeline_data:
                timeline_data[time_key] = []
            timeline_data[time_key].append(item)
        
        # Format for timeline
        formatted_data = []
        for time_period, items in sorted(timeline_data.items()):
            formatted_data.append({
                'time_period': time_period,
                'count': len(items),
                'total_value': sum(self._get_timeline_value(item) for item in items),
                'items': items
            })
        
        return {
            'type': 'timeline',
            'data': formatted_data,
            'metadata': metadata,
            'visualization_config': {
                'time_format': 'YYYY-MM',
                'value_scale': 'linear'
            }
        }
    
    def _format_network(self, raw_data: Dict[str, Any]) -> Dict[str, Any]:
        """Format data for network visualization"""
        data = raw_data.get('data', [])
        metadata = raw_data.get('metadata', {})
        
        if not data:
            return {"error": "No data to format"}
        
        # Create nodes and edges for network
        nodes = []
        edges = []
        node_ids = set()
        
        for item in data:
            # Create nodes based on categories
            categories = self._get_network_categories(item)
            for category in categories:
                if category not in node_ids:
                    nodes.append({
                        'id': category,
                        'label': category,
                        'size': 1,
                        'color': self._get_color_for_category(category)
                    })
                    node_ids.add(category)
            
            # Create edges between related categories
            if len(categories) > 1:
                for i in range(len(categories)):
                    for j in range(i + 1, len(categories)):
                        edges.append({
                            'source': categories[i],
                            'target': categories[j],
                            'weight': 1
                        })
        
        return {
            'type': 'network',
            'data': {
                'nodes': nodes,
                'edges': edges
            },
            'metadata': metadata,
            'visualization_config': {
                'node_size_range': [0.5, 3.0],
                'edge_width_range': [0.1, 2.0]
            }
        }
    
    def _get_color_for_item(self, item: Dict[str, Any]) -> str:
        """Get color for a data item based on its type"""
        item_type = item.get('type', '')
        if 'Theft' in item_type:
            return '#ff6b6b'
        elif 'Assault' in item_type:
            return '#ff8e53'
        elif 'Education' in item_type:
            return '#4ecdc4'
        elif 'Health' in item_type:
            return '#45b7d1'
        elif 'Defense' in item_type:
            return '#96ceb4'
        else:
            return '#f7f1e3'
    
    def _get_size_for_item(self, item: Dict[str, Any]) -> float:
        """Get size for a data item based on its value"""
        value = item.get('severity', item.get('enrollment', item.get('funding_amount', 1)))
        return min(max(value / 1000, 0.1), 2.0)
    
    def _get_description_for_item(self, item: Dict[str, Any]) -> str:
        """Get description for a data item"""
        return item.get('description', f"Item {item.get('id', 'Unknown')}")
    
    def _get_color_for_category(self, category: str) -> str:
        """Get color for a category"""
        colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#f7f1e3', '#ff8e53']
        return colors[hash(category) % len(colors)]
    
    def _get_heatmap_value(self, item: Dict[str, Any]) -> float:
        """Get value for heatmap visualization"""
        return item.get('severity', item.get('enrollment', item.get('funding_amount', 0)))
    
    def _get_time_key(self, item: Dict[str, Any]) -> str:
        """Get time key for timeline visualization"""
        timestamp = item.get('timestamp', '')
        if timestamp:
            return timestamp[:7]  # YYYY-MM
        return item.get('month', 'Unknown')
    
    def _get_timeline_value(self, item: Dict[str, Any]) -> float:
        """Get value for timeline visualization"""
        return item.get('severity', item.get('funding_amount', item.get('enrollment', 0)))
    
    def _get_network_categories(self, item: Dict[str, Any]) -> List[str]:
        """Get categories for network visualization"""
        categories = []
        if 'type' in item:
            categories.append(item['type'])
        if 'neighborhood' in item:
            categories.append(item['neighborhood'])
        if 'agency' in item:
            categories.append(item['agency'])
        if 'district' in item:
            categories.append(item['district'])
        return categories

# Global data processor instance
data_processor = DataProcessor()

def get_processed_data(source: str, format_type: str = "3d_scatter", params: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """
    Convenience function to fetch and process data in one call
    
    Args:
        source: Data source identifier
        format_type: Type of visualization format
        params: Parameters for data fetching
        
    Returns:
        Processed data ready for 3D visualization
    """
    raw_data = data_processor.fetch_data(source, params)
    return data_processor.process_data(raw_data, format_type) 