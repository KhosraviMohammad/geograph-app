import React, { useEffect, useRef, useState } from "react"
import { Viewer } from "resium"
import { OpenStreetMapImageryProvider, Cartesian3, SceneMode, EllipsoidTerrainProvider, WebMapServiceImageryProvider } from "cesium"
import "cesium/Build/Cesium/Widgets/widgets.css"
import { shapefileApi, ImportStatus } from '../store/api/shapefileApi'

interface CesiumMapProps {
  layerId?: string | null
}

const CesiumMap: React.FC<CesiumMapProps> = ({ layerId }) => {
  const viewerRef = useRef<any>(null)
  const [layerInfo, setLayerInfo] = useState<ImportStatus | null>(null)
  const [wmsUrl, setWmsUrl] = useState<string | null>(null)
  const [layerName, setLayerName] = useState<string | null>(null)

  // Load layer information when layerId changes
  useEffect(() => {
    if (layerId) {
      shapefileApi.getImportStatus(parseInt(layerId))
        .then((info) => {
          setLayerInfo(info)
          console.log('Layer info loaded:', info)
          
          // Set WMS URL and layer name for GeoServer
          if (info.geoserver_wms_url && info.geoserver_layer) {
            setWmsUrl(info.geoserver_wms_url)
            setLayerName(info.geoserver_layer)
            console.log('WMS URL set:', info.geoserver_wms_url)
            console.log('Layer name set:', info.geoserver_layer)
          }
        })
        .catch((error) => {
          console.error('Failed to load layer info:', error)
        })
    } else {
      setLayerInfo(null)
      setWmsUrl(null)
      setLayerName(null)
    }
  }, [layerId])

  useEffect(() => {
    const initializeMap = () => {
      if (viewerRef.current) {
        const viewer = viewerRef.current.cesiumElement
        
        // Wait for viewer to be fully loaded
        if (viewer && viewer.imageryLayers) {
          // Remove all default imagery layers
          viewer.imageryLayers.removeAll()
          
          // Add OpenStreetMap
          const osmProvider = new OpenStreetMapImageryProvider({
            url: "https://a.tile.openstreetmap.org/"
          })
          
          viewer.imageryLayers.addImageryProvider(osmProvider)
          
          // Add WMS layer if available
          if (wmsUrl && layerName) {
            try {
              const wmsProvider = new WebMapServiceImageryProvider({
                url: wmsUrl.split('?')[0], // Remove query parameters
                layers: layerName,
                parameters: {
                  service: 'WMS',
                  version: '1.1.0',
                  request: 'GetMap',
                  format: 'image/png',
                  transparent: true,
                  srs: 'EPSG:4326'
                }
              })
              viewer.imageryLayers.addImageryProvider(wmsProvider)
              console.log('WMS layer added:', layerName)
            } catch (error) {
              console.error('Failed to add WMS layer:', error)
            }
          }
          
          // Set to 2D mode
          viewer.scene.mode = SceneMode.SCENE2D
          
          // Use ellipsoid terrain (no Ion terrain)
          viewer.terrainProvider = new EllipsoidTerrainProvider()
          
          // Set initial view to show the world
          viewer.camera.setView({
            destination: Cartesian3.fromDegrees(0, 0, 10000000)
          })
        } else {
          // Retry after a short delay if viewer is not ready
          setTimeout(initializeMap, 100)
        }
      }
    }
    
    // Initialize with a small delay to ensure viewer is ready
    setTimeout(initializeMap, 100)
  }, [wmsUrl, layerName])

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      <style>
        {`
          .cesium-widget-credits {
            display: none !important;
          }
          .cesium-widget-credit {
            display: none !important;
          }
          .cesium-widget-credit-text {
            display: none !important;
          }
          .cesium-widget-credit-logo {
            display: none !important;
          }
        `}
      </style>
      
      {/* Layer info display */}
      {layerInfo && (
        <div style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          background: "rgba(0, 0, 0, 0.8)",
          color: "white",
          padding: "10px 15px",
          borderRadius: "5px",
          zIndex: 1000,
          maxWidth: "300px",
          fontSize: "12px"
        }}>
          <div><strong>Layer:</strong> {layerInfo.name}</div>
          <div><strong>Status:</strong> {layerInfo.status}</div>
          {layerInfo.published_to_geoserver && (
            <div style={{ color: "#4CAF50" }}>✓ Published to GeoServer</div>
          )}
           {wmsUrl && (
             <div><strong>WMS URL:</strong> {wmsUrl}</div>
           )}
           {layerName && (
             <div><strong>Layer:</strong> {layerName}</div>
           )}
        </div>
      )}
      
      <Viewer 
        ref={viewerRef}
        full
        timeline={false}
        animation={false}
        baseLayerPicker={false}
        // @ts-ignore
        imageryProvider={false}
        fullscreenButton={false}
        geocoder={false}
        homeButton={false}
        infoBox={false}
        sceneModePicker={false}
        selectionIndicator={false}
        navigationHelpButton={false}
        navigationInstructionsInitiallyVisible={false}
        scene3DOnly={false}
        shouldAnimate={false}
        terrainProvider={new EllipsoidTerrainProvider()}
        // creditContainer={document.createElement('div')}
       />
    </div>
  )
}

export default CesiumMap
