import React, { useEffect, useRef } from "react"
import { Viewer } from "resium"
import { OpenStreetMapImageryProvider, Cartesian3, SceneMode, EllipsoidTerrainProvider } from "cesium"
import "cesium/Build/Cesium/Widgets/widgets.css"

const CesiumMap = () => {
  const viewerRef = useRef<any>(null)

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
  }, [])

  return (
    <div style={{ width: "100%", height: "100vh" }}>
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
      <Viewer 
        ref={viewerRef}
        full
        timeline={false}
        animation={false}
        baseLayerPicker={false}
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
        creditContainer={document.createElement('div')}
      />
    </div>
  )
}

export default CesiumMap
