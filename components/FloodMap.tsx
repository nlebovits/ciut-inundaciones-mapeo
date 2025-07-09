"use client"

import { useEffect, useRef, useState } from "react"
import { floodZonesData, buildingsData } from "@/lib/dummyData"

// Load MapLibre GL dynamically
declare global {
  interface Window {
    maplibregl: any
  }
}

interface FloodMapProps {
  layers: {
    floodZones: boolean
    buildings: boolean
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

    // Map styles
    const mapStyles = {
      light: {
        version: 8,
        sources: {
          "osm-tiles": {
            type: "raster",
            tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution: "© OpenStreetMap contributors",
          },
        },
        layers: [
          {
            id: "osm-tiles",
            type: "raster",
            source: "osm-tiles",
          },
        ],
      },
      satellite: {
        version: 8,
        sources: {
          "satellite-tiles": {
            type: "raster",
            tiles: ["https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"],
            tileSize: 256,
            attribution: "© Esri, Maxar, Earthstar Geographics",
          },
        },
        layers: [
          {
            id: "satellite-tiles",
            type: "raster",
            source: "satellite-tiles",
          },
        ],
      },
    }

    // Initialize map centered on La Plata, Argentina
    map.current = new window.maplibregl.Map({
      container: mapContainer.current,
      style: mapStyles[basemap],
      center: [-57.9544, -34.9214], // La Plata coordinates
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

      // Add flood zones source and layer
      map.current.addSource("flood-zones", {
        type: "geojson",
        data: floodZonesData,
      })

      map.current.addLayer({
        id: "flood-zones-fill",
        type: "fill",
        source: "flood-zones",
        paint: {
          "fill-color": [
            "match",
            ["get", "risk_level"],
            "muy_baja",
            "hsla(221, 83%, 85%, 0.6)",
            "baja",
            "hsla(221, 83%, 65%, 0.6)",
            "media",
            "hsla(221, 83%, 45%, 0.6)",
            "alta",
            "hsla(221, 83%, 25%, 0.6)",
            "hsla(221, 83%, 55%, 0.6)", // default
          ],
          "fill-outline-color": [
            "match",
            ["get", "risk_level"],
            "muy_baja",
            "hsl(221, 83%, 75%)",
            "baja",
            "hsl(221, 83%, 55%)",
            "media",
            "hsl(221, 83%, 35%)",
            "alta",
            "hsl(221, 83%, 15%)",
            "hsl(221, 83%, 45%)", // default
          ],
        },
      })

      // Add buildings source and layer
      map.current.addSource("buildings", {
        type: "geojson",
        data: buildingsData,
      })

      map.current.addLayer({
        id: "buildings-fill",
        type: "fill",
        source: "buildings",
        paint: {
          "fill-color": "hsl(0, 0%, 85%)",
          "fill-outline-color": "hsl(0, 0%, 70%)",
          "fill-opacity": 0.8,
        },
      })

      // Add popup on click
      map.current.on("click", "flood-zones-fill", (e: any) => {
        if (!e.features || !e.features[0] || !map.current) return

        const feature = e.features[0]
        const properties = feature.properties

        const riskLabels: Record<string, string> = {
          muy_baja: "Muy baja a nula",
          baja: "Baja",
          media: "Media",
          alta: "Alta",
        }

        new window.maplibregl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(`
            <div class="p-3">
              <h3 class="font-semibold text-sm mb-2">Zona de Riesgo Hídrico</h3>
              <p class="text-xs mb-1"><strong>Nivel:</strong> ${riskLabels[properties?.risk_level] || "No especificado"}</p>
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

      setMapLoaded(true)

      // Pass map instance to parent
      if (onMapLoad) {
        onMapLoad(map.current)
      }
    })

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [mapLibreLoaded, basemap, onMapLoad])

  // Handle layer visibility changes
  useEffect(() => {
    if (!map.current || !mapLoaded) return

    const visibility = layers.floodZones ? "visible" : "none"
    map.current.setLayoutProperty("flood-zones-fill", "visibility", visibility)
  }, [layers.floodZones, mapLoaded])

  useEffect(() => {
    if (!map.current || !mapLoaded) return

    const visibility = layers.buildings ? "visible" : "none"
    map.current.setLayoutProperty("buildings-fill", "visibility", visibility)
  }, [layers.buildings, mapLoaded])

  // Handle basemap changes
  useEffect(() => {
    if (!map.current || !mapLoaded) return

    const mapStyles = {
      light: {
        version: 8,
        sources: {
          "osm-tiles": {
            type: "raster",
            tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution: "© OpenStreetMap contributors",
          },
        },
        layers: [
          {
            id: "osm-tiles",
            type: "raster",
            source: "osm-tiles",
          },
        ],
      },
      satellite: {
        version: 8,
        sources: {
          "satellite-tiles": {
            type: "raster",
            tiles: ["https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"],
            tileSize: 256,
            attribution: "© Esri, Maxar, Earthstar Geographics",
          },
        },
        layers: [
          {
            id: "satellite-tiles",
            type: "raster",
            source: "satellite-tiles",
          },
        ],
      },
    }

    // Store current layers data
    const floodZonesData = map.current.getSource("flood-zones")?._data
    const buildingsData = map.current.getSource("buildings")?._data

    // Change style
    map.current.setStyle(mapStyles[basemap])

    // Re-add custom layers after style change
    map.current.once("styledata", () => {
      if (!map.current) return

      // Re-add flood zones
      if (floodZonesData) {
        map.current.addSource("flood-zones", {
          type: "geojson",
          data: floodZonesData,
        })

        map.current.addLayer({
          id: "flood-zones-fill",
          type: "fill",
          source: "flood-zones",
          paint: {
            "fill-color": [
              "match",
              ["get", "risk_level"],
              "muy_baja",
              "hsla(221, 83%, 85%, 0.6)",
              "baja",
              "hsla(221, 83%, 65%, 0.6)",
              "media",
              "hsla(221, 83%, 45%, 0.6)",
              "alta",
              "hsla(221, 83%, 25%, 0.6)",
              "hsla(221, 83%, 55%, 0.6)", // default
            ],
            "fill-outline-color": [
              "match",
              ["get", "risk_level"],
              "muy_baja",
              "hsl(221, 83%, 75%)",
              "baja",
              "hsl(221, 83%, 55%)",
              "media",
              "hsl(221, 83%, 35%)",
              "alta",
              "hsl(221, 83%, 15%)",
              "hsl(221, 83%, 45%)", // default
            ],
          },
        })
      }

      // Re-add buildings
      if (buildingsData) {
        map.current.addSource("buildings", {
          type: "geojson",
          data: buildingsData,
        })

        map.current.addLayer({
          id: "buildings-fill",
          type: "fill",
          source: "buildings",
          paint: {
            "fill-color": "hsl(0, 0%, 85%)",
            "fill-outline-color": "hsl(0, 0%, 70%)",
            "fill-opacity": 0.8,
          },
        })
      }

      // Re-apply layer visibility
      if (map.current.getLayer("flood-zones-fill")) {
        const visibility = layers.floodZones ? "visible" : "none"
        map.current.setLayoutProperty("flood-zones-fill", "visibility", visibility)
      }

      if (map.current.getLayer("buildings-fill")) {
        const visibility = layers.buildings ? "visible" : "none"
        map.current.setLayoutProperty("buildings-fill", "visibility", visibility)
      }
    })
  }, [basemap, mapLoaded])

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
