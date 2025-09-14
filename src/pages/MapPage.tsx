import React from 'react'
import { Box } from '@mui/material'
import CesiumMap from '../components/MapComponent'

const MapPage: React.FC = () => {
  return (
    <Box sx={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1000
    }}>
      <CesiumMap />
    </Box>
  )
}

export default MapPage
