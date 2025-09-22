import React, { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  FormControlLabel,
  Switch,
  Container
} from '@mui/material'
import { PersonAdd as PersonAddIcon } from '@mui/icons-material'
import { shapefileApi, GeoServerUserCreate } from '../store/api/shapefileApi'

const GeoServerUserPage: React.FC = () => {
  const [formData, setFormData] = useState<GeoServerUserCreate>({
    username: '',
    password: '',
    enabled: true
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleInputChange = (field: keyof GeoServerUserCreate) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = field === 'enabled' ? event.target.checked : event.target.value
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const response = await shapefileApi.createGeoServerUser(formData)
      setMessage({
        type: 'success',
        text: response.message
      })
      
      // Reset form
      setFormData({
        username: '',
        password: '',
        enabled: true
      })
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to create user'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <PersonAddIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h5" component="h1">
              Create GeoServer User
            </Typography>
          </Box>

          {message && (
            <Alert 
              severity={message.type} 
              sx={{ mb: 3 }}
              onClose={() => setMessage(null)}
            >
              {message.text}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username"
              value={formData.username}
              onChange={handleInputChange('username')}
              margin="normal"
              required
              disabled={loading}
              helperText="Enter the username for GeoServer"
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              value={formData.password}
              onChange={handleInputChange('password')}
              margin="normal"
              required
              disabled={loading}
              helperText="Enter the password for GeoServer"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={formData.enabled}
                  onChange={handleInputChange('enabled')}
                  disabled={loading}
                />
              }
              label="Enabled"
              sx={{ mt: 2, mb: 2 }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading || !formData.username || !formData.password}
              startIcon={loading ? <CircularProgress size={20} /> : <PersonAddIcon />}
              sx={{ mt: 2 }}
            >
              {loading ? 'Creating User...' : 'Create User'}
            </Button>
          </form>

          <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Note:</strong> This will create a new user in GeoServer with the specified credentials. 
              The user will be able to access GeoServer services based on their assigned roles and permissions.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  )
}

export default GeoServerUserPage
