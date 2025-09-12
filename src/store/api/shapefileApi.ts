import { API_BASE_URL } from '../../utils/urls'

const SHAPEFILE_API_BASE = `${API_BASE_URL}geoimporter/`

export interface UploadResponse {
  success: boolean
  message: string
  import_id?: number
  table_name?: string
}

export interface ImportStatus {
  id: number
  name: string
  status: string
  table_name: string
  created_at: string
  table_info?: {
    columns: string[][]
    row_count: number
  }
}

export interface ImportList {
  imports: Array<{
    id: number
    name: string
    status: string
    table_name: string
    created_at: string
  }>
}

export const shapefileApi = {
  // Upload shapefile as zip
  uploadShapefile: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData()
    formData.append('shapefile', file)

    const response = await fetch(`${SHAPEFILE_API_BASE}upload/`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Upload failed')
    }

    return response.json()
  },

  // Get import status
  getImportStatus: async (importId: number): Promise<ImportStatus> => {
    const response = await fetch(`${SHAPEFILE_API_BASE}status/${importId}/`)
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to get status')
    }

    return response.json()
  },

  // List all imports
  listImports: async (): Promise<ImportList> => {
    const response = await fetch(`${SHAPEFILE_API_BASE}list/`)
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to list imports')
    }

    return response.json()
  },

  // Delete import
  deleteImport: async (importId: number): Promise<{ success: boolean; message: string }> => {
    const response = await fetch(`${SHAPEFILE_API_BASE}import/${importId}/`, {
      method: 'DELETE',
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to delete import')
    }

    return response.json()
  }
}
