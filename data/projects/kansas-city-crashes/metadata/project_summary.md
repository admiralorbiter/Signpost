# Kansas City Crash Analysis Project

## 🎯 **Project Overview**

This project provides an interactive map visualization of Kansas City traffic crash data, enabling users to explore crash patterns, identify high-risk intersections, and analyze traffic safety trends.

## 📊 **Data Sources**

### **Crash Data** (`combined_crash_data.csv`)
- **75,078 crash records** from Kansas City PD
- **Fields include:**
  - Date, Time, Location (At Street & On Street)
  - Crash Type, Severity (Property Damage vs Personal Injury)
  - Vehicle Count, Lighting Conditions
  - Injuries and Fatalities
  - Agency, County, City information

### **Intersection Data** (`all_intersections.csv`)
- **13,008 intersection records** with crash analysis
- **Fields include:**
  - Intersection name and coordinates
  - Total crash count per intersection
  - Risk assessment based on crash frequency

## 🗺️ **Visualization Features**

### **Interactive Map (Leaflet.js)**
- **OpenStreetMap tiles** for accurate geographic representation
- **Layer toggling** for crashes and intersections
- **Color-coded visualization:**
  - 🟢 Green: Property damage crashes
  - 🟠 Orange: Personal injury crashes
  - 🔴 Red: High-severity incidents
  - 🟦 Blue: Intersection risk levels

### **Data Analysis**
- **Real-time statistics** panel
- **Risk assessment** for intersections
- **Crash type analysis** and trends
- **Export capabilities** for further analysis

### **Interactive Elements**
- **Clickable markers** with detailed popups
- **Filter controls** for data layers
- **Refresh functionality** for updated data
- **Responsive design** for various screen sizes

## 🔧 **Technical Implementation**

### **Backend (Python/Flask)**
- **Data processing pipeline** for CSV file handling
- **API endpoints** for data access:
  - `/api/data/kansas_city_crashes`
  - `/api/data/kansas_city_intersections`
- **Automatic data discovery** and loading

### **Frontend (HTML/JavaScript)**
- **Leaflet.js** for interactive mapping
- **Real-time data loading** from API
- **Dynamic visualization** with color coding
- **Statistical analysis** and reporting

## 📈 **Key Insights Available**

### **Crash Patterns**
- **Geographic distribution** of crashes across Kansas City
- **Temporal analysis** of crash frequency
- **Severity patterns** by location and time
- **Vehicle involvement** analysis

### **Intersection Analysis**
- **High-risk intersections** identification
- **Crash frequency** mapping
- **Risk level assessment** (Low/Medium/High)
- **Safety improvement** recommendations

### **Statistical Overview**
- **Total crash count** and trends
- **Most common crash types**
- **High-crash intersection count**
- **Data source verification**

## 🚀 **Usage Instructions**

1. **Access the visualization** through the VR gateway
2. **Toggle layers** to show/hide crashes or intersections
3. **Click markers** for detailed information
4. **Use controls** to refresh data or export results
5. **Analyze statistics** in the left panel

## 🔮 **Future Enhancements**

### **Planned Features**
- **Time-based filtering** (by date ranges)
- **Crash type filtering** (by severity or type)
- **Heat map visualization** for density analysis
- **Trend analysis** over time periods
- **Export to various formats** (CSV, JSON, PDF)

### **Advanced Analytics**
- **Predictive modeling** for crash risk
- **Traffic flow analysis** integration
- **Weather correlation** studies
- **Infrastructure impact** assessment

## 📋 **Data Quality Notes**

- **Source:** Kansas City Police Department
- **Coverage:** Kansas City metropolitan area
- **Time Period:** Recent crash data
- **Accuracy:** Official police records
- **Updates:** Real-time processing capability

## 🎯 **Project Goals**

1. **Improve traffic safety** through data-driven insights
2. **Identify high-risk areas** for infrastructure improvements
3. **Support policy decisions** with visual evidence
4. **Educate the public** about traffic safety patterns
5. **Enable research** into crash prevention strategies

---

*This project demonstrates the power of combining real-world data with interactive visualization tools to create meaningful insights for public safety and urban planning.* 