import { Routes, Route } from 'react-router-dom'
import { Container, AppBar, Toolbar, Typography, Box, Button } from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom'
import SimplePage from './pages/SimplePage'
import ShapefileUploadPage from './pages/ShapefileUploadPage'
import LayersListPage from './pages/LayersListPage'
import MapPage from './pages/MapPage'
import GeoServerUserPage from './pages/GeoServerUserPage'

function App() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Geograph App
          </Typography>
          <Button 
            color="inherit" 
            onClick={() => navigate('/')}
            sx={{ mr: 2 }}
          >
            Home
          </Button>
          <Button 
            color="inherit" 
            onClick={() => navigate('/upload')}
            sx={{ mr: 2 }}
          >
            Shapefile Upload
          </Button>
          <Button 
            color="inherit" 
            onClick={() => navigate('/layers')}
            sx={{ mr: 2 }}
          >
            Layers List
          </Button>
          <Button 
            color="inherit" 
            onClick={() => navigate('/map')}
            sx={{ mr: 2 }}
          >
            Map
          </Button>
          <Button 
            color="inherit" 
            onClick={() => navigate('/geoserver-user')}
          >
            GeoServer User
          </Button>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Routes>
          <Route path="/" element={<SimplePage />} />
          <Route path="/upload" element={<ShapefileUploadPage />} />
          <Route path="/layers" element={<LayersListPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/geoserver-user" element={<GeoServerUserPage />} />
        </Routes>
      </Container>
    </Box>
  )
}

export default App
