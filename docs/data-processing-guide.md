# Data Processing System Guide

## 🎯 Overview

The Signpost Observatory Engine includes a robust data processing pipeline that can handle real-world CSV data, process it for visualization, and serve it through RESTful API endpoints. This guide shows you how to use this system for your own projects.

## 📊 **Current Implementation: Kansas City Crash Analysis**

### **Data Sources**
- **Crash Data**: 75,078 crash records with incident details
- **Intersection Data**: 13,008 intersections with GPS coordinates
- **Risk Analysis**: Automatic risk level calculation
- **Geographic Visualization**: Interactive map with Leaflet.js

### **Features**
- ✅ **CSV Data Loading**: Support for multiple CSV file formats
- ✅ **Data Cleaning**: Automatic column name cleaning and unnamed column removal
- ✅ **JSON Serialization**: Proper handling of pandas/numpy data types
- ✅ **NaN Handling**: Conversion of NaN values to null for JSON compatibility
- ✅ **Error Handling**: Robust error handling for missing files and data issues
- ✅ **API Endpoints**: RESTful API for data access
- ✅ **Interactive Visualization**: Real-time map visualization with statistics

---

## 🚀 **How to Add Your Own Data Project**

### **Step 1: Set Up Your Data Structure**

Create a folder structure for your project:

```
data/
└── projects/
    └── your-project-name/
        ├── raw/
        │   ├── your_data.csv
        │   └── your_other_data.csv
        ├── processed/
        │   └── (processed data files)
        └── metadata/
            └── project_summary.md
```

### **Step 2: Add Your Data Processing Logic**

Update `data_processing.py` to handle your data:

```python
def _fetch_csv_data(self, source, limit=None):
    """Fetch CSV data for a specific source"""
    try:
        # Map source names to actual file names
        file_mapping = {
            'kansas_city_crashes': 'combined_crash_data.csv',
            'kansas_city_intersections': 'all_intersections.csv',
            'your_project_data': 'your_data.csv',  # Add your mapping
            'your_other_data': 'your_other_data.csv'  # Add more mappings
        }
        
        if source not in file_mapping:
            raise ValueError(f"Unknown data source: {source}")
        
        file_name = file_mapping[source]
        file_path = f"data/projects/your-project-name/raw/{file_name}"
        
        # Load CSV data
        df = pd.read_csv(file_path)
        
        # Clean column names
        df.columns = [col.strip() for col in df.columns if not col.startswith('Unnamed')]
        
        # Convert to records
        data = df.to_dict('records')
        
        # Apply limit if specified
        if limit:
            data = data[:limit]
        
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
        
        return data
        
    except FileNotFoundError:
        raise ValueError(f"Data file not found for source: {source}")
    except Exception as e:
        raise ValueError(f"Error loading data for {source}: {str(e)}")
```

### **Step 3: Create Your Visualization**

Create a new HTML file in `public/levels/analysis/`:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Your Data Visualization</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
    <style>
        #map { height: 100vh; }
        .stats-panel {
            position: absolute;
            top: 10px;
            left: 10px;
            background: white;
            padding: 15px;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 1000;
        }
    </style>
</head>
<body>
    <div id="map"></div>
    <div class="stats-panel">
        <h3>Your Data Analysis</h3>
        <p>Total Records: <span id="total-records">Loading...</span></p>
        <p>Your Metric: <span id="your-metric">Loading...</span></p>
    </div>

    <script>
        // Initialize map
        const map = L.map('map').setView([39.0997, -94.5786], 10);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

        let yourData = [];

        // Load your data from API
        function loadYourData() {
            fetch('/api/data/your_project_data/raw?limit=1000')
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.error) {
                        console.error('Error loading data:', data.error);
                        return;
                    }
                    
                    yourData = data.data || [];
                    console.log('Data loaded:', yourData.length, 'records');
                    visualizeData();
                    updateStats();
                })
                .catch(error => {
                    console.error('Error loading data:', error);
                    yourData = [];
                    updateStats();
                });
        }

        // Visualize your data
        function visualizeData() {
            // Add your visualization logic here
            yourData.forEach(record => {
                // Example: Add markers to map
                if (record.Latitude && record.Longitude) {
                    const marker = L.marker([record.Latitude, record.Longitude])
                        .addTo(map)
                        .bindPopup(`<b>${record.YourField}</b><br>Value: ${record.YourValue}`);
                }
            });
        }

        // Update statistics
        function updateStats() {
            document.getElementById('total-records').textContent = yourData.length || 0;
            document.getElementById('your-metric').textContent = 'Your calculation here';
        }

        // Load data when page loads
        loadYourData();
    </script>
</body>
</html>
```

### **Step 4: Add Portal Configuration**

Update `portal_config.py` to include your new visualization:

```python
PORTALS = {
    # ... existing portals ...
    
    'your-data-visualization': {
        'title': 'Your Data Visualization',
        'description': 'Interactive visualization of your data',
        'category': 'analysis',
        'level': 'your-data-visualization',
        'position': {'x': 0, 'y': 1.6, 'z': -3},
        'color': '#4CAF50',
        'icon': '📊'
    }
}
```

---

## 🔧 **API Endpoints Reference**

### **Data Access Endpoints**

#### **Get Raw Data**
```bash
# Get your data (replace 'your_project_data' with your source name)
curl "http://localhost:5000/api/data/your_project_data/raw?limit=1000"
```

#### **Get Processed Data**
```bash
# Get processed data for visualization
curl "http://localhost:5000/api/data/your_project_data?format=3d_scatter&limit=100"
```

#### **List Available Sources**
```bash
# Get all available data sources
curl "http://localhost:5000/api/data/sources"
```

### **Response Format**

```json
{
    "data": [
        {
            "field1": "value1",
            "field2": "value2",
            "field3": null
        }
    ],
    "source": "your_project_data",
    "count": 1000,
    "limit": 1000
}
```

---

## 📋 **Best Practices**

### **1. Data File Naming**
- Use descriptive file names: `kansas_city_crashes.csv`
- Keep raw data in `raw/` folder
- Use consistent naming conventions

### **2. Data Cleaning**
- Always clean column names (remove whitespace, unnamed columns)
- Handle NaN values properly for JSON serialization
- Validate data types and convert as needed

### **3. Error Handling**
- Provide meaningful error messages
- Handle missing files gracefully
- Log errors for debugging

### **4. API Design**
- Use consistent endpoint naming
- Support pagination with `limit` parameter
- Return structured JSON responses

### **5. Frontend Integration**
- Always check for API errors
- Provide loading states
- Handle empty data gracefully
- Add error recovery mechanisms

---

## 🎯 **Example: Adding a New Dataset**

### **Scenario**: You want to add weather data visualization

#### **Step 1: Add Data Files**
```
data/projects/weather-analysis/
├── raw/
│   ├── weather_data.csv
│   └── temperature_records.csv
└── metadata/
    └── project_summary.md
```

#### **Step 2: Update Data Processing**
```python
# In data_processing.py, add to file_mapping:
'weather_data': 'weather_data.csv',
'temperature_records': 'temperature_records.csv'
```

#### **Step 3: Create Visualization**
```html
<!-- public/levels/analysis/weather-visualization.html -->
<!DOCTYPE html>
<html>
<head>
    <title>Weather Data Visualization</title>
    <!-- Add your visualization libraries -->
</head>
<body>
    <!-- Your weather visualization -->
    <script>
        // Load weather data
        fetch('/api/data/weather_data/raw?limit=1000')
            .then(response => response.json())
            .then(data => {
                // Visualize weather data
                visualizeWeather(data.data);
            });
    </script>
</body>
</html>
```

#### **Step 4: Add Portal**
```python
# In portal_config.py
'weather-visualization': {
    'title': 'Weather Data Analysis',
    'description': 'Interactive weather data visualization',
    'category': 'analysis',
    'level': 'weather-visualization',
    'position': {'x': 2, 'y': 1.6, 'z': -3},
    'color': '#2196F3',
    'icon': '🌤️'
}
```

---

## 🚀 **Advanced Features**

### **Custom Data Processing**
You can extend the data processing to include custom transformations:

```python
def process_weather_data(self, data):
    """Custom processing for weather data"""
    for record in data:
        # Add calculated fields
        if record.get('temperature') and record.get('humidity'):
            record['heat_index'] = self.calculate_heat_index(
                record['temperature'], 
                record['humidity']
            )
        
        # Categorize weather conditions
        if record.get('temperature'):
            if record['temperature'] > 80:
                record['condition'] = 'Hot'
            elif record['temperature'] < 32:
                record['condition'] = 'Cold'
            else:
                record['condition'] = 'Moderate'
    
    return data
```

### **Multiple Data Sources**
Combine multiple datasets in a single visualization:

```javascript
// Load multiple data sources
Promise.all([
    fetch('/api/data/weather_data/raw?limit=1000'),
    fetch('/api/data/traffic_data/raw?limit=1000')
])
.then(responses => Promise.all(responses.map(r => r.json())))
.then(([weatherData, trafficData]) => {
    // Combine and visualize both datasets
    visualizeCombinedData(weatherData.data, trafficData.data);
});
```

---

## 🎉 **Success Checklist**

✅ **Data files** placed in correct folder structure  
✅ **Data processing** logic added to `data_processing.py`  
✅ **API endpoints** returning proper JSON  
✅ **Visualization** created and working  
✅ **Portal configuration** added  
✅ **Error handling** implemented  
✅ **Documentation** updated  

Your data processing system is now ready to handle any CSV dataset and create interactive visualizations! 🚀 