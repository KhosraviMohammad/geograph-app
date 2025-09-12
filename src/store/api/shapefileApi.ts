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
  geoserver_layer?: string
  geoserver_wms_url?: string
  geoserver_wfs_url?: string
  published_to_geoserver: boolean
  table_info?: {
    columns: string[][]
    row_count: number
    geometry_type?: string
    srid?: number
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

  // Upload shapefile with GeoServer publishing
  uploadShapefileWithGeoServer: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData()
    formData.append('shapefile', file)

    const response = await fetch(`${SHAPEFILE_API_BASE}upload-with-geoserver/`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Upload with GeoServer failed')
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
  },

  // Publish to GeoServer
  publishToGeoServer: async (importId: number): Promise<UploadResponse> => {
    const response = await fetch(`${SHAPEFILE_API_BASE}publish/${importId}/`, {
      method: 'POST',
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to publish to GeoServer')
    }

    return response.json()
  },

  // List GeoServer layers
  listGeoServerLayers: async (): Promise<{ layers: any[] }> => {
    const response = await fetch(`${SHAPEFILE_API_BASE}geoserver/layers/`)
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to list GeoServer layers')
    }

    return response.json()
  },

  // GeoServer Importer Plugin APIs
  uploadToGeoServerImporter: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData()
    formData.append('shapefile', file)

    const response = await fetch(`${SHAPEFILE_API_BASE}geoserver-import/upload/`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Upload to GeoServer Importer failed')
    }

    return response.json()
  },

  getGeoServerImportStatus: async (importId: number): Promise<any> => {
    const response = await fetch(`${SHAPEFILE_API_BASE}geoserver-import/status/${importId}/`)
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to get GeoServer import status')
    }

    return response.json()
  },

  listGeoServerImports: async (): Promise<any> => {
    const response = await fetch(`${SHAPEFILE_API_BASE}geoserver-import/list/`)
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to list GeoServer imports')
    }

    return response.json()
  },

  deleteGeoServerImport: async (importId: number): Promise<{ success: boolean; message: string }> => {
    const response = await fetch(`${SHAPEFILE_API_BASE}geoserver-import/${importId}/`, {
      method: 'DELETE',
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to delete GeoServer import')
    }

    return response.json()
  },

  getGeoServerLayerInfo: async (layerName: string): Promise<any> => {
    const response = await fetch(`${SHAPEFILE_API_BASE}geoserver-import/layer-info/${layerName}/`)
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to get GeoServer layer info')
    }

    return response.json()
  }
}
