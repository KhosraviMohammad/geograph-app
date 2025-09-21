import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { Box } from '@mui/material'
import CesiumMap from '../components/MapComponent'

const MapPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const layerId = searchParams.get('layerId')

  return (
    <Box sx={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1000
    }}>
      <CesiumMap layerId={layerId} />
    </Box>
  )
}

export default MapPage
