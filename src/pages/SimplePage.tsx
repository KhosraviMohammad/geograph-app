import { Typography, Box, Paper, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const SimplePage = () => {
  const navigate = useNavigate()

  return (
    <Box sx={{ p: 4 }}>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom>
          Simple Geograph App
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          A simple geographic data management application
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
          Upload and manage shapefiles with multiple options:
        </Typography>
        <Box sx={{ display: 'flex', gap: 4, justifyContent: 'center', mb: 4, flexWrap: 'wrap' }}>
          <Box sx={{ textAlign: 'center', maxWidth: 200 }}>
            <Typography variant="h6" gutterBottom>Database Upload</Typography>
            <Typography variant="body2" color="text.secondary">
              Upload to PostgreSQL database
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center', maxWidth: 200 }}>
            <Typography variant="h6" gutterBottom>Database + GeoServer</Typography>
            <Typography variant="body2" color="text.secondary">
              Upload and auto-publish to GeoServer
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center', maxWidth: 200 }}>
            <Typography variant="h6" gutterBottom>GeoServer Importer</Typography>
            <Typography variant="body2" color="text.secondary">
              Direct upload using GeoServer Plugin
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button 
            variant="contained" 
            size="large"
            onClick={() => navigate('/upload')}
          >
            Upload Shapefiles
          </Button>
          <Button 
            variant="outlined" 
            size="large"
            onClick={() => navigate('/upload')}
          >
            Get Started
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}

export default SimplePage
