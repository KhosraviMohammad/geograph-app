import { Routes, Route } from 'react-router-dom'
import { Container, AppBar, Toolbar, Typography, Box, Button } from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom'
import SimplePage from './pages/SimplePage'
import ShapefileUploadPage from './pages/ShapefileUploadPage'

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
          >
            Shapefile Upload
          </Button>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Routes>
          <Route path="/" element={<SimplePage />} />
          <Route path="/upload" element={<ShapefileUploadPage />} />
        </Routes>
      </Container>
    </Box>
  )
}

export default App
