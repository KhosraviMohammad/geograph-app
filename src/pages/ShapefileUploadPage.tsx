import React from 'react'
import { Container, Box } from '@mui/material'
import ShapefileUpload from '../components/ShapefileUpload'

const ShapefileUploadPage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <ShapefileUpload />
      </Box>
    </Container>
  )
}

export default ShapefileUploadPage
