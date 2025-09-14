import React from 'react'
import { Container, Box } from '@mui/material'
import LayersList from '../components/LayersList'

const LayersListPage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <LayersList />
      </Box>
    </Container>
  )
}

export default LayersListPage
