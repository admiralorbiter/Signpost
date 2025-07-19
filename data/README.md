# Data Management Structure

This directory contains all data files, both raw and processed, organized by projects.

## Folder Structure

```
data/
├── raw/                    # Raw data files (CSV, JSON, etc.)
├── processed/              # Processed data files ready for visualization
├── projects/               # Project-specific data
│   └── kansas-city-crashes/
│       ├── raw/           # Original crash data files
│       ├── processed/     # Cleaned and processed crash data
│       └── metadata/      # Data dictionaries, schemas, documentation
└── README.md              # This file
```

## Data Types Supported

- **CSV Files**: Primary format for tabular data
- **JSON Files**: For structured data and API responses
- **GeoJSON**: For geographic data (intersections, GPS coordinates)
- **Metadata**: Data dictionaries, schemas, and documentation

## Project: Kansas City Crash Data

### Data Sources
- **Crash Data**: Traffic accident records
- **Intersection Data**: Geographic intersection information
- **GPS Data**: Location coordinates and mapping data

### File Naming Convention
- Raw files: `{source}_{date}.csv` (e.g., `crashes_2024.csv`)
- Processed files: `{type}_{processed}_{date}.csv` (e.g., `crashes_processed_2024.csv`)
- Metadata: `{type}_metadata.json` (e.g., `crashes_metadata.json`)

## Usage

1. Place raw CSV files in the appropriate `raw/` folder
2. Process data using the data processing pipeline
3. Store processed files in `processed/` folders
4. Update metadata files with data dictionaries and schemas

## Data Processing Pipeline

The system automatically:
- Detects new CSV files in raw folders
- Processes data according to project specifications
- Generates visualization-ready formats
- Updates metadata and documentation 