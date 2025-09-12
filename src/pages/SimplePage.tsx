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
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
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
