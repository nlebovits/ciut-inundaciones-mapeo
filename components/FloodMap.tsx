"use client"

import { useEffect, useRef, useState } from "react"
import { Protocol } from "pmtiles"

// Load MapLibre GL dynamically
declare global {
  interface Window {
    maplibregl: any
  }
}

interface FloodMapProps {
  layers: {
    floodZones: boolean
  }
  basemap: "light" | "satellite"
  onMapLoad?: (map: any) => void
}

export default function FloodMap({ layers, basemap, onMapLoad }: FloodMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<any>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapLibreLoaded, setMapLibreLoaded] = useState(false)

  // Load MapLibre GL from CDN
  useEffect(() => {
    if (typeof window === "undefined") return

    // Check if already loaded
    if (window.maplibregl) {
      setMapLibreLoaded(true)
      return
    }

    // Load CSS
    const cssLink = document.createElement("link")
    cssLink.rel = "stylesheet"
    cssLink.href = "https://unpkg.com/maplibre-gl@3.6.2/dist/maplibre-gl.css"
    document.head.appendChild(cssLink)

    // Load JS
    const script = document.createElement("script")
    script.src = "https://unpkg.com/maplibre-gl@3.6.2/dist/maplibre-gl.js"
    script.onload = () => {
      setMapLibreLoaded(true)
    }
    document.head.appendChild(script)

    return () => {
      // Cleanup
      if (document.head.contains(cssLink)) document.head.removeChild(cssLink)
      if (document.head.contains(script)) document.head.removeChild(script)
    }
  }, [])

  useEffect(() => {
    if (!mapContainer.current || map.current || !mapLibreLoaded || !window.maplibregl) return

    // Register PMTiles protocol
    try {
      const protocol = new Protocol()
      window.maplibregl.addProtocol("pmtiles", protocol.tile)
      console.log("✅ PMTiles protocol registered successfully")
    } catch (error) {
      console.error("❌ Error registering PMTiles protocol:", error)
    }

    // Map styles
    const mapStyles = {
      light: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
      satellite: "https://raw.githubusercontent.com/go2garret/maps/main/src/assets/json/arcgis_hybrid.json",
    }

    // Initialize map centered on La Plata, Argentina
    map.current = new window.maplibregl.Map({
      container: mapContainer.current,
      style: typeof mapStyles[basemap] === 'string' ? mapStyles[basemap] : mapStyles[basemap],
      center: [-58.0044, -34.9614], // Adjusted to match PMTiles bounds
      zoom: 12,
      attributionControl: false,
    })

    // Add geolocate control
    const geolocate = new window.maplibregl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: false,
      showUserHeading: false,
    })
    map.current.addControl(geolocate, "bottom-right")

    // Add attribution
    map.current.addControl(
      new window.maplibregl.AttributionControl({
        compact: true,
      }),
      "bottom-left",
    )

    map.current.on("load", () => {
      if (!map.current) return

      console.log("🗺️ Map loaded, adding custom sources and layers...")

      try {
        // Ensure PMTiles protocol is registered
        if (window.maplibregl && !window.maplibregl.getProtocol) {
          const protocol = new Protocol()
          window.maplibregl.addProtocol("pmtiles", protocol.tile)
        }

        // Add flood zones PMTiles source and layer
        console.log("➕ Adding flood-zones PMTiles source...")
        map.current.addSource("flood-zones", {
          type: "vector",
          url: "pmtiles:///data/el_gato.pmtiles",
        })

        // Add error handler for PMTiles source (only once)
        map.current.on("error", (e: any) => {
          console.error("🗺️ Map error:", e)
        })

        // Add source loading handler (only once)
        map.current.on("sourcedata", (e: any) => {
          if (e.sourceId === "flood-zones") {
            console.log("📊 Flood zones source data event:", e)
          }
        })

        console.log("➕ Adding flood-zones-fill layer...")
        map.current.addLayer({
          id: "flood-zones-fill",
          type: "fill",
          source: "flood-zones",
          "source-layer": "combined_hazard_prioritized_4326",
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
            ],
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
            ],
          },
        })
        // Set visibility immediately after adding
        map.current.setLayoutProperty("flood-zones-fill", "visibility", layers.floodZones ? "visible" : "none")

        // Add popup on click
        map.current.on("click", "flood-zones-fill", (e: any) => {
          if (!e.features || !e.features[0] || !map.current) return

          const feature = e.features[0]
          const properties = feature.properties

          const riskLabels: Record<string, string> = {
            baja: "Baja",
            media: "Media",
            alta: "Alta",
          }

          new window.maplibregl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(`
              <div class="p-3">
                <h3 class="font-semibold text-sm mb-2">Zona de Riesgo Hídrico</h3>
                <p class="text-xs mb-1"><strong>Nivel:</strong> ${riskLabels[properties?.peligrosid] || "No especificado"}</p>
                ${properties?.description ? `<p class="text-xs text-gray-600">${properties.description}</p>` : ""}
              </div>
            `)
            .addTo(map.current)
        })

        // Change cursor on hover
        map.current.on("mouseenter", "flood-zones-fill", () => {
          if (map.current) map.current.getCanvas().style.cursor = "pointer"
        })

        map.current.on("mouseleave", "flood-zones-fill", () => {
          if (map.current) map.current.getCanvas().style.cursor = ""
        })

        console.log("✅ Initial map setup completed")
        setMapLoaded(true)

        // Pass map instance to parent
        if (onMapLoad) {
          onMapLoad(map.current)
        }
      } catch (error) {
        console.error("❌ Error in initial map setup:", error)
        setMapLoaded(true) // Still set as loaded to prevent infinite retries
      }
    })

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [mapLibreLoaded, basemap, onMapLoad, layers.floodZones])

  // Handle layer visibility changes
  useEffect(() => {
    if (!map.current || !mapLoaded) return

    // Only set visibility if layers exist
    const floodLayer = map.current.getLayer("flood-zones-fill")

    if (floodLayer) {
      const visibility = layers.floodZones ? "visible" : "none"
      map.current.setLayoutProperty("flood-zones-fill", "visibility", visibility)
    }
  }, [layers.floodZones, mapLoaded])

  // Handle basemap changes
  useEffect(() => {
    if (!map.current || !mapLoaded) return

    console.log("🔄 Basemap change triggered:", basemap)
    
    // Safely check map state
    const mapState = {
      hasMap: !!map.current,
      mapLoaded,
      hasStyle: map.current && map.current.getStyle(),
      currentSources: map.current && map.current.getStyle() ? Object.keys(map.current.getStyle().sources || {}) : []
    }
    console.log("📍 Current map state:", mapState)

    const mapStyles = {
      light: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
      satellite: "https://raw.githubusercontent.com/go2garret/maps/main/src/assets/json/arcgis_hybrid.json",
    }

    // Store current view state
    const currentCenter = map.current.getCenter()
    const currentZoom = map.current.getZoom()

    // Change style
    console.log("🎨 Setting new style:", mapStyles[basemap])
    map.current.setStyle(mapStyles[basemap])

    // Re-add custom layers after style change
    map.current.once("styledata", () => {
      if (!map.current) return

      console.log("🎨 Style loaded, re-adding custom layers...")

      try {
        // Restore view state
        map.current.setCenter(currentCenter)
        map.current.setZoom(currentZoom)

        // Ensure PMTiles protocol is registered
        if (window.maplibregl && !window.maplibregl.getProtocol) {
          const protocol = new Protocol()
          window.maplibregl.addProtocol("pmtiles", protocol.tile)
        }

        // Wait a bit for the style to fully load before adding sources
        setTimeout(() => {
          if (!map.current) return

          // Add flood zones PMTiles source and layer
          if (!map.current.getSource("flood-zones")) {
            console.log("➕ Adding flood-zones PMTiles source...")
            map.current.addSource("flood-zones", {
              type: "vector",
              url: "pmtiles:///data/el_gato.pmtiles",
            })
          }

          if (!map.current.getLayer("flood-zones-fill")) {
            console.log("➕ Adding flood-zones-fill layer...")
            map.current.addLayer({
              id: "flood-zones-fill",
              type: "fill",
              source: "flood-zones",
              "source-layer": "combined_hazard_prioritized_4326",
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
                ],
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
                ],
              },
            })
            // Set visibility immediately after adding
            map.current.setLayoutProperty("flood-zones-fill", "visibility", layers.floodZones ? "visible" : "none")
          }

          console.log("✅ Basemap change completed successfully")
        }, 100) // Small delay to ensure style is fully loaded

      } catch (error) {
        console.error("❌ Error adding layers after basemap change:", error)
      }
    })
  }, [basemap, mapLoaded, layers.floodZones])

  if (!mapLibreLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando MapLibre GL...</p>
        </div>
      </div>
    )
  }

  return <div ref={mapContainer} className="w-full h-full" />
}
