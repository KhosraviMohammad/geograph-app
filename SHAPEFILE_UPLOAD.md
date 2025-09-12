# Shapefile Upload Feature

This document describes the shapefile upload functionality in the Geograph App.

## Overview

The shapefile upload feature allows users to upload geographic data in the form of ZIP files containing shapefile components (.shp, .shx, .dbf, .prj files) to the GeoImporter Django backend.

## Features

### Upload Interface
- **Drag & Drop**: Users can drag and drop ZIP files directly onto the upload area
- **File Selection**: Click to open file browser for manual file selection
- **Multiple Files**: Support for uploading multiple ZIP files simultaneously
- **File Validation**: Only ZIP files are accepted
- **Progress Tracking**: Real-time upload progress and status updates

### File Management
- **File List**: View all selected files before uploading
- **Individual Upload**: Upload files one by one or all at once
- **File Removal**: Remove files from the upload queue
- **Status Indicators**: Visual status indicators (pending, uploading, success, error)

### Import History
- **Import List**: View all previous shapefile imports
- **Status Tracking**: Monitor import status (processing, success, error)
- **Details View**: View detailed information about each import
- **Delete Imports**: Remove import records

## API Integration

The frontend integrates with the GeoImporter Django API endpoints:

- `POST /api/geoimporter/upload/` - Upload shapefile ZIP
- `GET /api/geoimporter/status/{id}/` - Get import status
- `GET /api/geoimporter/list/` - List all imports
- `DELETE /api/geoimporter/import/{id}/` - Delete import

## Usage

1. Navigate to the "Shapefile Upload" page
2. Drag and drop ZIP files or click to select files
3. Review the file list and click "Upload All" or upload individually
4. Monitor upload progress and status
5. View import history and manage previous imports

## File Requirements

- Files must be in ZIP format
- ZIP files must contain valid shapefile components:
  - `.shp` - Shapefile geometry data
  - `.shx` - Shapefile index file
  - `.dbf` - Attribute data
  - `.prj` - Projection information (optional but recommended)

## Error Handling

The application handles various error scenarios:
- Invalid file formats
- Missing shapefile components
- Network errors
- Server-side processing errors

Error messages are displayed to users with appropriate severity levels.

## Dependencies

- `react-dropzone` - For drag and drop functionality
- `@mui/material` - For UI components
- `@mui/icons-material` - For icons
