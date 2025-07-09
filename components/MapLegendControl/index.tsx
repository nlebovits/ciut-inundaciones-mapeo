"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Layers, Map, Satellite, ChevronDown, ChevronUp } from "lucide-react"
import { Switch } from "@/components/ui/switch"

interface MapLegendControlProps {
  layers: {
    floodZones: boolean
    buildings: boolean
  }
  onLayerChange: (layers: { floodZones: boolean; buildings: boolean }) => void
  basemap: "light" | "satellite"
  onBasemapChange: (basemap: "light" | "satellite") => void
}

export default function MapLegendControl({ layers, onLayerChange, basemap, onBasemapChange }: MapLegendControlProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setIsExpanded(false) // Collapse by default on mobile
      }
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const toggleLayer = (layerName: keyof typeof layers) => {
    onLayerChange({
      ...layers,
      [layerName]: !layers[layerName],
    })
  }

  return (
    <div className="map-legend">
      <Card className="w-80 shadow-lg">
        <CardContent className="p-3 md:p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              <h3 className="font-semibold text-sm">Controles</h3>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="h-6 w-6 p-0">
              {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </Button>
          </div>

          {isExpanded && (
            <>
              {/* Basemap Controls */}
              <div className="mb-4 md:mb-6 basemap-control">
                <h4 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Mapa Base</h4>
                <div className="flex gap-2">
                  <Button
                    variant={basemap === "light" ? "default" : "outline"}
                    size="sm"
                    onClick={() => onBasemapChange("light")}
                    className="flex-1 text-xs"
                  >
                    <Map className="h-3 w-3 mr-1" />
                    Claro
                  </Button>
                  <Button
                    variant={basemap === "satellite" ? "default" : "outline"}
                    size="sm"
                    onClick={() => onBasemapChange("satellite")}
                    className="flex-1 text-xs"
                  >
                    <Satellite className="h-3 w-3 mr-1" />
                    Satélite
                  </Button>
                </div>
              </div>

              {/* Layer Controls */}
              <div className="space-y-3 md:space-y-4">
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Capas de Información
                </h4>

                {/* Flood Zones Layer */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium cursor-pointer">Zonas de Riesgo Hídrico</label>
                    <Switch checked={layers.floodZones} onCheckedChange={() => toggleLayer("floodZones")} />
                  </div>

                  {layers.floodZones && (
                    <div className="ml-2 space-y-1">
                      <div className="flex items-center gap-2 text-xs">
                        <div
                          className="w-4 h-3 rounded-sm"
                          style={{ backgroundColor: "hsla(221, 83%, 85%, 0.8)" }}
                        ></div>
                        <span>Muy baja a nula</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <div
                          className="w-4 h-3 rounded-sm"
                          style={{ backgroundColor: "hsla(221, 83%, 65%, 0.8)" }}
                        ></div>
                        <span>Baja</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <div
                          className="w-4 h-3 rounded-sm"
                          style={{ backgroundColor: "hsla(221, 83%, 45%, 0.8)" }}
                        ></div>
                        <span>Media</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <div
                          className="w-4 h-3 rounded-sm"
                          style={{ backgroundColor: "hsla(221, 83%, 25%, 0.8)" }}
                        ></div>
                        <span>Alta</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Buildings Layer */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium cursor-pointer">Edificaciones</label>
                    <Switch checked={layers.buildings} onCheckedChange={() => toggleLayer("buildings")} />
                  </div>

                  {layers.buildings && (
                    <div className="ml-2">
                      <div className="flex items-center gap-2 text-xs">
                        <div className="w-4 h-3 rounded-sm bg-gray-300 border border-gray-400"></div>
                        <span>Huellas de Edificios</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Pilot Project Notice - Hide on mobile when expanded to save space */}
              {!isMobile && (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-xs text-yellow-800 font-medium">⚠️ Proyecto Piloto</p>
                    <p className="text-xs text-yellow-700 mt-1">Datos preliminares en desarrollo.</p>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
