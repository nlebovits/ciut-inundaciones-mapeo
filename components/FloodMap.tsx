"use client"

import { useEffect, useState } from "react"
import { Protocol } from "pmtiles"
import Map, { Source, Layer, Popup, GeolocateControl, NavigationControl } from "react-map-gl/maplibre"
import "maplibre-gl/dist/maplibre-gl.css"
import maplibregl from "maplibre-gl"

interface FloodMapProps {
  layers: {
    floodZones: boolean
    originalData: boolean
  }
  basemap: "light" | "satellite"
  onMapLoad?: (map: any) => void
}

export default function FloodMap({ layers, basemap, onMapLoad }: FloodMapProps) {
  const [mapInstance, setMapInstance] = useState<any>(null)
  const [popupInfo, setPopupInfo] = useState<any>(null)

  // Register PMTiles protocol once
  useEffect(() => {
    console.log("🔧 DEBUG: Registering PMTiles protocol...")
    const protocol = new Protocol()
    maplibregl.addProtocol("pmtiles", protocol.tile)
    console.log("✅ DEBUG: PMTiles protocol registered successfully")
    
    // Test PMTiles protocol
    console.log("🧪 DEBUG: Testing PMTiles protocol...")
    try {
      const testUrl = "pmtiles:///data/la_plata.pmtiles"
      console.log("🧪 DEBUG: Test URL:", testUrl)
      // This will help us see if the protocol is working
      console.log("🧪 DEBUG: Protocol registered successfully")
    } catch (error) {
      console.error("❌ DEBUG: PMTiles protocol test failed:", error)
    }
    
    return () => {
      console.log("🧹 DEBUG: Cleaning up PMTiles protocol...")
      maplibregl.removeProtocol("pmtiles")
      console.log("✅ DEBUG: PMTiles protocol cleanup completed")
    }
  }, [])

  // Map styles
  const mapStyles = {
    light: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
    satellite: "https://raw.githubusercontent.com/go2garret/maps/main/src/assets/json/arcgis_hybrid.json",
  }

  const floodLayerStyle = {
    id: "flood-zones-fill",
    type: "fill" as const,
    paint: {
      "fill-color": [
        "match",
        ["get", "peligrosid"],
        "alta",
        "hsla(221, 83%, 25%, 0.7)",
        "media",
        "hsla(221, 83%, 45%, 0.7)",
        "baja",
        "hsla(221, 83%, 65%, 0.7)",
        "hsla(221, 83%, 55%, 0.7)", // default
      ] as any,
      "fill-outline-color": [
        "match",
        ["get", "peligrosid"],
        "alta",
        "hsl(221, 83%, 15%)",
        "media",
        "hsl(221, 83%, 35%)",
        "baja",
        "hsl(221, 83%, 55%)",
        "hsl(221, 83%, 45%)", // default
      ] as any,
    },
    layout: {
      visibility: layers.floodZones ? "visible" : "none" as "visible" | "none"
    }
  }

  // Debug logging for layer visibility
  useEffect(() => {
    console.log("🔍 DEBUG: Layer visibility updated:", {
      floodZones: layers.floodZones,
      originalData: layers.originalData
    })
  }, [layers.floodZones, layers.originalData])

  // Debug logging for map instance and sources
  useEffect(() => {
    if (mapInstance) {
      console.log("🗺️ DEBUG: Map instance available, checking sources...")
      console.log("🗺️ DEBUG: Available sources:", mapInstance.getStyle().sources)
      console.log("🗺️ DEBUG: Available layers:", mapInstance.getStyle().layers)
      
      // Check specifically for our layers
      const style = mapInstance.getStyle()
      const floodLayer = style.layers?.find((layer: any) => layer.id === "flood-zones-fill")
      const originalLayer = style.layers?.find((layer: any) => layer.id === "original-data-fill")
      
      console.log("🔍 DEBUG: Flood layer found:", floodLayer)
      console.log("🔍 DEBUG: Original data layer found:", originalLayer)
      
      if (floodLayer) {
        console.log("🔍 DEBUG: Flood layer visibility:", floodLayer.layout?.visibility)
        console.log("🔍 DEBUG: Flood layer source:", floodLayer.source)
        console.log("🔍 DEBUG: Flood layer source-layer:", floodLayer["source-layer"])
      }
      
      // Check flood-zones source
      const floodSource = style.sources?.["flood-zones"]
      console.log("🔍 DEBUG: Flood source details:", floodSource)
    }
  }, [mapInstance])

  const originalDataLayerStyle = {
    id: "original-data-fill",
    type: "fill" as const,
    paint: {
      "fill-color": [
        "match",
        ["get", "PELIGROSID"],
        "alta",
        "hsla(330, 83%, 25%, 0.7)",
        "media",
        "hsla(330, 83%, 45%, 0.7)",
        "baja",
        "hsla(330, 83%, 65%, 0.7)",
        "hsla(330, 83%, 55%, 0.7)", // default
      ] as any,
      "fill-outline-color": [
        "match",
        ["get", "PELIGROSID"],
        "alta",
        "hsl(330, 83%, 15%)",
        "media",
        "hsl(330, 83%, 35%)",
        "baja",
        "hsl(330, 83%, 55%)",
        "hsl(330, 83%, 45%)", // default
      ] as any,
    },
    layout: {
      visibility: layers.originalData ? "visible" : "none" as "visible" | "none"
    }
  }

  const handleMapClick = (event: any) => {
    if (!event.features || !event.features[0]) return

    const feature = event.features[0]
    const properties = feature.properties

    // Debug: Log all available properties
    console.log("🔍 DEBUG: Clicked feature properties:", properties)
    console.log("🔍 DEBUG: Available property keys:", Object.keys(properties))
    console.log("🔍 DEBUG: Feature source:", feature.source)
    console.log("🔍 DEBUG: Feature source-layer:", feature.sourceLayer)

    const riskLabels: Record<string, string> = {
      baja: "Baja",
      media: "Media",
      alta: "Alta",
    }

    setPopupInfo({
      longitude: event.lngLat.lng,
      latitude: event.lngLat.lat,
      feature: {
        level: riskLabels[properties?.peligrosid] || riskLabels[properties?.PELIGROSID] || "No especificado",
        description: properties?.description || ""
      }
    })
  }

  const handleMapLoad = (event: any) => {
    console.log("🗺️ DEBUG: Map loaded successfully")
    console.log("🗺️ DEBUG: Map instance:", event.target)
    setMapInstance(event.target)
    
    // Add event listener to check source data
    event.target.on('sourcedata', (e: any) => {
      if (e.sourceId === 'flood-zones' && e.isSourceLoaded) {
        console.log("✅ DEBUG: Flood zones source loaded successfully")
        console.log("🔍 DEBUG: Available source layers:", e.source.sourceLayerIds)
        
        // Try to get a sample feature to inspect properties
        try {
          const features = event.target.querySourceFeatures('flood-zones', {
            sourceLayer: 'la_plata_pelig_2023_smoothed',
            limit: 1
          })
          if (features.length > 0) {
            console.log("🔍 DEBUG: Sample flood zone feature properties:", features[0].properties)
            console.log("🔍 DEBUG: Sample flood zone feature keys:", Object.keys(features[0].properties))
          }
        } catch (error) {
          console.log("⚠️ DEBUG: Could not query flood zones features:", error)
        }
      }
      
      if (e.sourceId === 'original-data' && e.isSourceLoaded) {
        console.log("✅ DEBUG: Original data source loaded successfully")
        console.log("🔍 DEBUG: Available source layers:", e.source.sourceLayerIds)
        
        // Try to get a sample feature to inspect properties
        try {
          const features = event.target.querySourceFeatures('original-data', {
            sourceLayer: 'la_plata_pelig_2023_4326',
            limit: 1
          })
          if (features.length > 0) {
            console.log("🔍 DEBUG: Sample original data feature properties:", features[0].properties)
            console.log("🔍 DEBUG: Sample original data feature keys:", Object.keys(features[0].properties))
          }
        } catch (error) {
          console.log("⚠️ DEBUG: Could not query original data features:", error)
        }
      }
    })
    
    if (onMapLoad) {
      onMapLoad(event.target)
    }
  }

  return (
    <div className="w-full h-full">
      <Map
        mapLib={maplibregl}
        mapStyle={mapStyles[basemap]}
        initialViewState={{
          longitude: -57.954722,
          latitude: -34.921556,
          zoom: 11
        }}
        onClick={handleMapClick}
        onLoad={handleMapLoad}
        interactiveLayerIds={[
          ...(layers.floodZones ? ["flood-zones-fill"] : []),
          ...(layers.originalData ? ["original-data-fill"] : [])
        ]}
      >
        <GeolocateControl
          positionOptions={{
            enableHighAccuracy: true,
          }}
          trackUserLocation={false}
          position="bottom-right"
        />
        <NavigationControl
          position="top-right"
        />

        {layers.floodZones && (
          <Source
            id="flood-zones"
            type="vector"
            url="pmtiles:///data/la_plata.pmtiles"
          >
            <Layer {...floodLayerStyle} source-layer="la_plata_pelig_2023_smoothed" />
          </Source>
        )}

        {layers.originalData && (
          <Source
            id="original-data"
            type="vector"
            url="pmtiles:///data/la_plata_original.pmtiles"
          >
            <Layer {...originalDataLayerStyle} source-layer="la_plata_pelig_2023_4326" />
          </Source>
        )}

        {popupInfo && (
          <Popup
            longitude={popupInfo.longitude}
            latitude={popupInfo.latitude}
            onClose={() => setPopupInfo(null)}
            closeOnClick={false}
          >
            <div className="p-3">
              <h3 className="font-semibold text-sm mb-2">Zona de Peligro Hídrico</h3>
              <p className="text-xs mb-1"><strong>Nivel:</strong> {popupInfo.feature.level}</p>
              {popupInfo.feature.description && (
                <p className="text-xs text-gray-600">{popupInfo.feature.description}</p>
              )}
            </div>
          </Popup>
        )}
      </Map>
    </div>
  )
}
