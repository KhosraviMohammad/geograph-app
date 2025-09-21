import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Tooltip,
  Card,
  CardContent,
  Grid
} from '@mui/material'
import {
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Publish as PublishIcon,
  Refresh as RefreshIcon,
  OpenInNew as OpenInNewIcon,
  Map as MapIcon
} from '@mui/icons-material'
import { shapefileApi, ImportStatus } from '../store/api/shapefileApi'

const LayersList: React.FC = () => {
  const navigate = useNavigate()
  const [imports, setImports] = useState<ImportStatus[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImport, setSelectedImport] = useState<ImportStatus | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [actionLoading, setActionLoading] = useState<number | null>(null)

  useEffect(() => {
    loadImports()
  }, [])

  const loadImports = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await shapefileApi.listImports()
      
      // Get detailed status for each import
      const detailedImports = await Promise.all(
        response.imports.map(async (importItem) => {
          try {
            return await shapefileApi.getImportStatus(importItem.id)
          } catch (err) {
            return {
              ...importItem,
              status: 'error',
              published_to_geoserver: false
            }
          }
        })
      )
      
      setImports(detailedImports)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load imports')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (importId: number) => {
    if (!window.confirm('Are you sure you want to delete this import?')) {
      return
    }

    try {
      setActionLoading(importId)
      await shapefileApi.deleteImport(importId)
      await loadImports()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete import')
    } finally {
      setActionLoading(null)
    }
  }

  const handlePublish = async (importId: number) => {
    try {
      setActionLoading(importId)
      await shapefileApi.publishToGeoServer(importId)
      await loadImports()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish to GeoServer')
    } finally {
      setActionLoading(null)
    }
  }

  const handleViewDetails = (importItem: ImportStatus) => {
    setSelectedImport(importItem)
    setDetailsOpen(true)
  }

  const handleViewOnMap = (importItem: ImportStatus) => {
    navigate(`/map?layerId=${importItem.id}`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'success'
      case 'error':
        return 'error'
      case 'processing':
        return 'warning'
      default:
        return 'default'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Uploaded Layers
        </Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={loadImports}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Table Name</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>GeoServer</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {imports.map((importItem) => (
              <TableRow key={importItem.id}>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {importItem.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={importItem.status}
                    color={getStatusColor(importItem.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontFamily="monospace">
                    {importItem.table_name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {formatDate(importItem.created_at)}
                  </Typography>
                </TableCell>
                <TableCell>
                  {importItem.published_to_geoserver ? (
                    <Chip
                      label="Published"
                      color="success"
                      size="small"
                      icon={<PublishIcon />}
                    />
                  ) : (
                    <Chip
                      label="Not Published"
                      color="default"
                      size="small"
                    />
                  )}
                </TableCell>
                <TableCell>
                  <Box display="flex" gap={1}>
                    <Tooltip title="View on Map">
                      <IconButton
                        size="small"
                        onClick={() => handleViewOnMap(importItem)}
                        color="primary"
                      >
                        <MapIcon />
                      </IconButton>
                    </Tooltip>
                    
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        onClick={() => handleViewDetails(importItem)}
                      >
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    
                    {importItem.status === 'success' && !importItem.published_to_geoserver && (
                      <Tooltip title="Publish to GeoServer">
                        <IconButton
                          size="small"
                          onClick={() => handlePublish(importItem.id)}
                          disabled={actionLoading === importItem.id}
                        >
                          {actionLoading === importItem.id ? (
                            <CircularProgress size={16} />
                          ) : (
                            <PublishIcon />
                          )}
                        </IconButton>
                      </Tooltip>
                    )}
                    
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(importItem.id)}
                        disabled={actionLoading === importItem.id}
                        color="error"
                      >
                        {actionLoading === importItem.id ? (
                          <CircularProgress size={16} />
                        ) : (
                          <DeleteIcon />
                        )}
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {imports.length === 0 && !loading && (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary">
            No uploaded layers found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Upload your first shapefile to get started
          </Typography>
        </Box>
      )}

      {/* Details Dialog */}
      <Dialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Layer Details: {selectedImport?.name}
        </DialogTitle>
        <DialogContent>
          {selectedImport && (
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Basic Information
                      </Typography>
                      <Typography variant="body2">
                        <strong>ID:</strong> {selectedImport.id}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Name:</strong> {selectedImport.name}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Table Name:</strong> {selectedImport.table_name}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Status:</strong> {selectedImport.status}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Created:</strong> {formatDate(selectedImport.created_at)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        GeoServer Information
                      </Typography>
                      <Typography variant="body2">
                        <strong>Published:</strong> {selectedImport.published_to_geoserver ? 'Yes' : 'No'}
                      </Typography>
                      {selectedImport.geoserver_layer && (
                        <Typography variant="body2">
                          <strong>Layer:</strong> {selectedImport.geoserver_layer}
                        </Typography>
                      )}
                      {selectedImport.geoserver_wms_url && (
                        <Box mt={1}>
                          <Button
                            component="a"
                            href={selectedImport.geoserver_wms_url}
                            target="_blank"
                            rel="noopener"
                            startIcon={<OpenInNewIcon />}
                            size="small"
                            variant="outlined"
                            sx={{ textDecoration: 'none' }}
                          >
                            WMS Preview
                          </Button>
                        </Box>
                      )}
                      {selectedImport.geoserver_wfs_url && (
                        <Box mt={1}>
                          <Button
                            component="a"
                            href={selectedImport.geoserver_wfs_url}
                            target="_blank"
                            rel="noopener"
                            startIcon={<OpenInNewIcon />}
                            size="small"
                            variant="outlined"
                            sx={{ textDecoration: 'none' }}
                          >
                            WFS Data
                          </Button>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {selectedImport.table_info && (
                <Box mt={2}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Table Information
                      </Typography>
                      <Typography variant="body2">
                        <strong>Row Count:</strong> {selectedImport.table_info.row_count}
                      </Typography>
                      {selectedImport.table_info.geometry_type && (
                        <Typography variant="body2">
                          <strong>Geometry Type:</strong> {selectedImport.table_info.geometry_type}
                        </Typography>
                      )}
                      {selectedImport.table_info.srid && (
                        <Typography variant="body2">
                          <strong>SRID:</strong> {selectedImport.table_info.srid}
                        </Typography>
                      )}
                      {selectedImport.table_info.columns && (
                        <Box mt={1}>
                          <Typography variant="body2" fontWeight="bold">
                            Columns:
                          </Typography>
                          {selectedImport.table_info.columns.map((column, index) => (
                            <Typography
                              key={index}
                              variant="body2"
                              fontFamily="monospace"
                              sx={{ ml: 2 }}
                            >
                              • {column[0]} ({column[1]})
                            </Typography>
                          ))}
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default LayersList
