"use client"

import { useEffect, useState } from "react"
import { Protocol } from "pmtiles"
import Map, { Source, Layer, Popup, GeolocateControl, NavigationControl } from "react-map-gl/maplibre"
import "maplibre-gl/dist/maplibre-gl.css"
import maplibregl from "maplibre-gl"

interface FloodMapProps {
  layers: {
    floodZones: boolean
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

  const handleMapClick = (event: any) => {
    if (!event.features || !event.features[0]) return

    const feature = event.features[0]
    const properties = feature.properties

    const riskLabels: Record<string, string> = {
      baja: "Baja",
      media: "Media",
      alta: "Alta",
    }

    setPopupInfo({
      longitude: event.lngLat.lng,
      latitude: event.lngLat.lat,
      feature: {
        level: riskLabels[properties?.peligrosid] || "No especificado",
        description: properties?.description || ""
      }
    })
  }

  const handleMapLoad = (event: any) => {
    console.log("🗺️ DEBUG: Map loaded successfully")
    setMapInstance(event.target)
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
          longitude: -58.0044,
          latitude: -34.9614,
          zoom: 12
        }}
        onClick={handleMapClick}
        onLoad={handleMapLoad}
        interactiveLayerIds={layers.floodZones ? ["flood-zones-fill"] : []}
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
            url="pmtiles:///data/el_gato.pmtiles"
          >
            <Layer {...floodLayerStyle} source-layer="combined_hazard_prioritized_4326" />
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
              <h3 className="font-semibold text-sm mb-2">Zona de Riesgo Hídrico</h3>
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
