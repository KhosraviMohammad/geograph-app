import { Typography, Box, Paper, Button } from '@mui/material'

const SimplePage = () => {
  return (
    <Box sx={{ p: 4 }}>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom>
          Simple Geograph App
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          A simple geographic data management application
        </Typography>
        <Button variant="contained" size="large">
          Get Started
        </Button>
      </Paper>
    </Box>
  )
}

export default SimplePage
