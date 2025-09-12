import React, { useState, useCallback } from 'react'
import {
  Box,
  Paper,
  Typography,
  Button,
  LinearProgress,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider
} from '@mui/material'
import {
  CloudUpload,
  Delete,
  CheckCircle,
  Error,
  Schedule,
  Info,
  Public,
  Link,
  Storage,
  Layers
} from '@mui/icons-material'
import { useDropzone } from 'react-dropzone'
import { shapefileApi, UploadResponse, ImportStatus } from '../store/api/shapefileApi'

interface UploadedFile {
  file: File
  id: string
  status: 'pending' | 'uploading' | 'success' | 'error'
  progress: number
  response?: UploadResponse
  error?: string
}

const ShapefileUpload: React.FC = () => {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [imports, setImports] = useState<ImportStatus[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedImport, setSelectedImport] = useState<ImportStatus | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [uploadMode, setUploadMode] = useState<'database' | 'geoserver' | 'geoserver-importer'>('database')

  // Load existing imports on component mount
  React.useEffect(() => {
    loadImports()
  }, [])

  const loadImports = async () => {
    try {
      const data = await shapefileApi.listImports()
      setImports(data.imports.map(imp => ({
        ...imp,
        created_at: imp.created_at
      })))
    } catch (error) {
      console.error('Failed to load imports:', error)
    }
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadedFile[] = acceptedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending',
      progress: 0
    }))
    setFiles(prev => [...prev, ...newFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/zip': ['.zip']
    },
    multiple: true
  })

  const uploadFile = async (fileItem: UploadedFile) => {
    setFiles(prev => prev.map(f => 
      f.id === fileItem.id 
        ? { ...f, status: 'uploading', progress: 0 }
        : f
    ))

    try {
      let response: UploadResponse
      
      if (uploadMode === 'geoserver') {
        response = await shapefileApi.uploadShapefileWithGeoServer(fileItem.file)
      } else if (uploadMode === 'geoserver-importer') {
        response = await shapefileApi.uploadToGeoServerImporter(fileItem.file)
      } else {
        response = await shapefileApi.uploadShapefile(fileItem.file)
      }
      
      setFiles(prev => prev.map(f => 
        f.id === fileItem.id 
          ? { ...f, status: 'success', progress: 100, response }
          : f
      ))

      // Reload imports list
      await loadImports()
    } catch (error) {
      setFiles(prev => prev.map(f => 
        f.id === fileItem.id 
          ? { ...f, status: 'error', error: error instanceof Error ? error.message : 'Upload failed' }
          : f
      ))
    }
  }

  const uploadAllFiles = async () => {
    setLoading(true)
    const pendingFiles = files.filter(f => f.status === 'pending')
    
    for (const fileItem of pendingFiles) {
      await uploadFile(fileItem)
    }
    
    setLoading(false)
  }

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id))
  }

  const deleteImport = async (importId: number) => {
    try {
      await shapefileApi.deleteImport(importId)
      await loadImports()
    } catch (error) {
      console.error('Failed to delete import:', error)
    }
  }

  const publishToGeoServer = async (importId: number) => {
    try {
      const response = await shapefileApi.publishToGeoServer(importId)
      console.log('Published to GeoServer:', response)
      await loadImports() // Reload to get updated status
    } catch (error) {
      console.error('Failed to publish to GeoServer:', error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle color="success" />
      case 'error':
        return <Error color="error" />
      case 'uploading':
        return <Schedule color="primary" />
      default:
        return <Info color="info" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'success'
      case 'error':
        return 'error'
      case 'uploading':
        return 'primary'
      default:
        return 'default'
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Shapefile Upload
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Upload shapefile packages as ZIP files. Each ZIP should contain .shp, .shx, .dbf, and .prj files.
      </Typography>

      {/* Upload Mode Selection */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Upload Mode
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant={uploadMode === 'database' ? 'contained' : 'outlined'}
            startIcon={<Storage />}
            onClick={() => setUploadMode('database')}
            sx={{ flex: 1, minWidth: 200, flexDirection: 'column', py: 2 }}
          >
            <Typography variant="h6">Database Only</Typography>
            <Typography variant="caption" sx={{ mt: 0.5 }}>
              Upload to PostgreSQL database
            </Typography>
          </Button>
          <Button
            variant={uploadMode === 'geoserver' ? 'contained' : 'outlined'}
            startIcon={<Layers />}
            onClick={() => setUploadMode('geoserver')}
            sx={{ flex: 1, minWidth: 200, flexDirection: 'column', py: 2 }}
          >
            <Typography variant="h6">Database + GeoServer</Typography>
            <Typography variant="caption" sx={{ mt: 0.5 }}>
              Upload to database and publish to GeoServer
            </Typography>
          </Button>
          <Button
            variant={uploadMode === 'geoserver-importer' ? 'contained' : 'outlined'}
            startIcon={<Public />}
            onClick={() => setUploadMode('geoserver-importer')}
            sx={{ flex: 1, minWidth: 200, flexDirection: 'column', py: 2 }}
          >
            <Typography variant="h6">GeoServer Importer</Typography>
            <Typography variant="caption" sx={{ mt: 0.5 }}>
              Direct upload using GeoServer Importer Plugin
            </Typography>
          </Button>
        </Box>
        <Box sx={{ mt: 2, p: 1, bgcolor: 'info.light', borderRadius: 1 }}>
          <Typography variant="body2" color="info.contrastText">
            {uploadMode === 'database' 
              ? 'Selected: Database Only - Files will be imported to PostgreSQL database'
              : uploadMode === 'geoserver'
              ? 'Selected: Database + GeoServer - Files will be imported to database and automatically published to GeoServer'
              : 'Selected: GeoServer Importer - Files will be uploaded directly to GeoServer using Importer Plugin'
            }
          </Typography>
        </Box>
      </Paper>

      {/* Upload Area */}
      <Paper
        {...getRootProps()}
        sx={{
          p: 4,
          textAlign: 'center',
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'grey.300',
          backgroundColor: isDragActive ? 'action.hover' : 'background.paper',
          cursor: 'pointer',
          mb: 3,
          '&:hover': {
            borderColor: 'primary.main',
            backgroundColor: 'action.hover'
          }
        }}
      >
        <input {...getInputProps()} />
        <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          {isDragActive ? 'Drop the ZIP files here' : 'Drag & drop ZIP files here, or click to select'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Only ZIP files containing shapefiles are accepted
        </Typography>
      </Paper>

      {/* File List */}
      {files.length > 0 && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Files to Upload</Typography>
            <Button
              variant="contained"
              onClick={uploadAllFiles}
              disabled={loading || files.every(f => f.status !== 'pending')}
            >
              {uploadMode === 'geoserver-importer' ? 'Upload to GeoServer' : 'Upload All'}
            </Button>
          </Box>
          
          <List>
            {files.map((fileItem) => (
              <ListItem key={fileItem.id} divider>
                <ListItemText
                  primary={fileItem.file.name}
                  secondary={
                    <Box>
                      <Typography variant="caption" display="block">
                        Size: {(fileItem.file.size / 1024 / 1024).toFixed(2)} MB
                      </Typography>
                      {fileItem.status === 'uploading' && (
                        <LinearProgress sx={{ mt: 1 }} />
                      )}
                      {fileItem.error && (
                        <Alert severity="error" sx={{ mt: 1 }}>
                          {fileItem.error}
                        </Alert>
                      )}
                      {fileItem.response && (
                        <Alert severity="success" sx={{ mt: 1 }}>
                          {fileItem.response.message}
                        </Alert>
                      )}
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getStatusIcon(fileItem.status)}
                    <Chip
                      label={fileItem.status}
                      color={getStatusColor(fileItem.status) as any}
                      size="small"
                    />
                    <IconButton
                      onClick={() => removeFile(fileItem.id)}
                      disabled={fileItem.status === 'uploading'}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {/* Imports List */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Previous Imports
        </Typography>
        
        {imports.length === 0 ? (
          <Typography color="text.secondary">
            No imports found
          </Typography>
        ) : (
          <List>
            {imports.map((importItem) => (
              <ListItem key={importItem.id} divider>
                <ListItemText
                  primary={importItem.name}
                  secondary={
                    <Box>
                      <Typography variant="caption" display="block">
                        Table: {importItem.table_name}
                      </Typography>
                      <Typography variant="caption" display="block">
                        Created: {new Date(importItem.created_at).toLocaleString()}
                      </Typography>
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getStatusIcon(importItem.status)}
                    <Chip
                      label={importItem.status}
                      color={getStatusColor(importItem.status) as any}
                      size="small"
                    />
                    <Button
                      size="small"
                      onClick={() => {
                        setSelectedImport(importItem)
                        setDialogOpen(true)
                      }}
                    >
                      View Details
                    </Button>
                    {importItem.status === 'success' && !importItem.published_to_geoserver && (
                      <Button
                        size="small"
                        startIcon={<Public />}
                        onClick={() => publishToGeoServer(importItem.id)}
                        color="primary"
                      >
                        Publish to GeoServer
                      </Button>
                    )}
                    {importItem.published_to_geoserver && (
                      <Button
                        size="small"
                        startIcon={<Link />}
                        href={importItem.geoserver_wms_url}
                        target="_blank"
                        color="success"
                      >
                        View WMS
                      </Button>
                    )}
                    <IconButton
                      onClick={() => deleteImport(importItem.id)}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
      </Paper>

      {/* Import Details Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Import Details</DialogTitle>
        <DialogContent>
          {selectedImport && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedImport.name}
              </Typography>
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2">Status:</Typography>
                <Chip
                  label={selectedImport.status}
                  color={getStatusColor(selectedImport.status) as any}
                  icon={getStatusIcon(selectedImport.status)}
                />
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2">Table Name:</Typography>
                <Typography>{selectedImport.table_name}</Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2">Created:</Typography>
                <Typography>{new Date(selectedImport.created_at).toLocaleString()}</Typography>
              </Box>
              
              {selectedImport.table_info && (
                <Box>
                  <Typography variant="subtitle2">Table Information:</Typography>
                  <Typography variant="body2">
                    Rows: {selectedImport.table_info.row_count}
                  </Typography>
                  <Typography variant="body2">
                    Columns: {selectedImport.table_info.columns.length}
                  </Typography>
                  {selectedImport.table_info.geometry_type && (
                    <Typography variant="body2">
                      Geometry Type: {selectedImport.table_info.geometry_type}
                    </Typography>
                  )}
                  {selectedImport.table_info.srid && (
                    <Typography variant="body2">
                      SRID: {selectedImport.table_info.srid}
                    </Typography>
                  )}
                </Box>
              )}
              
              {selectedImport.published_to_geoserver && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2">GeoServer Information:</Typography>
                  <Typography variant="body2">
                    Layer: {selectedImport.geoserver_layer}
                  </Typography>
                  {selectedImport.geoserver_wms_url && (
                    <Typography variant="body2">
                      WMS URL: 
                      <Link href={selectedImport.geoserver_wms_url} target="_blank" rel="noopener">
                        {selectedImport.geoserver_wms_url}
                      </Link>
                    </Typography>
                  )}
                  {selectedImport.geoserver_wfs_url && (
                    <Typography variant="body2">
                      WFS URL: 
                      <Link href={selectedImport.geoserver_wfs_url} target="_blank" rel="noopener">
                        {selectedImport.geoserver_wfs_url}
                      </Link>
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ShapefileUpload
