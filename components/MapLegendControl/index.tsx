"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Layers, Map, Satellite, ChevronDown, ChevronUp } from "lucide-react"
import { Switch } from "@/components/ui/switch"

interface MapLegendControlProps {
  layers: {
    floodZones: boolean
    originalData: boolean
  }
  onLayerChange: (layers: { floodZones: boolean; originalData: boolean }) => void
  basemap: "light" | "satellite"
  onBasemapChange: (basemap: "light" | "satellite") => void
}

export default function MapLegendControl({ layers, onLayerChange, basemap, onBasemapChange }: MapLegendControlProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const toggleLayer = (layerName: keyof typeof layers) => {
    onLayerChange({
      ...layers,
      [layerName]: !layers[layerName],
    })
  }

  return (
    <div className="absolute top-4 left-4 z-10">
      <Card className="w-80 shadow-lg border-0 bg-white/95 backdrop-blur-sm">
        <CardContent className="p-4">
          {/* Header with expand/collapse */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Controles del Mapa</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-6 w-6 p-0"
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>

          {isExpanded && (
            <>
              {/* Basemap Selection */}
              <div className="space-y-3 mb-4">
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Estilo de Mapa
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={basemap === "light" ? "default" : "outline"}
                    size="sm"
                    onClick={() => onBasemapChange("light")}
                    className="text-xs h-8"
                  >
                    <Map className="h-3 w-3 mr-1" />
                    Claro
                  </Button>
                  <Button
                    variant={basemap === "satellite" ? "default" : "outline"}
                    size="sm"
                    onClick={() => onBasemapChange("satellite")}
                    className="text-xs h-8"
                  >
                    <Satellite className="h-3 w-3 mr-1" />
                    Satélite
                  </Button>
                </div>
              </div>

              {/* Layers */}
              <div className="space-y-3 md:space-y-4">
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Capas de Información
                </h4>

                {/* Flood Zones Layer */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium cursor-pointer">Zonas de Peligro Hídrico</label>
                    <Switch checked={layers.floodZones} onCheckedChange={() => toggleLayer("floodZones")} />
                  </div>

                  {layers.floodZones && (
                    <div className="ml-2 space-y-1">
                      <div className="flex items-center gap-2 text-xs">
                        <div
                          className="w-4 h-3 rounded-sm"
                          style={{ backgroundColor: "hsla(221, 83%, 25%, 0.7)" }}
                        ></div>
                        <span>Alta</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <div
                          className="w-4 h-3 rounded-sm"
                          style={{ backgroundColor: "hsla(221, 83%, 45%, 0.7)" }}
                        ></div>
                        <span>Media</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <div
                          className="w-4 h-3 rounded-sm"
                          style={{ backgroundColor: "hsla(221, 83%, 65%, 0.7)" }}
                        ></div>
                        <span>Baja</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Original Data Layer */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium cursor-pointer">Datos Originales</label>
                    <Switch checked={layers.originalData} onCheckedChange={() => toggleLayer("originalData")} />
                  </div>

                  {layers.originalData && (
                    <div className="ml-2 space-y-1">
                      <div className="flex items-center gap-2 text-xs">
                        <div
                          className="w-4 h-3 rounded-sm"
                          style={{ backgroundColor: "hsla(330, 83%, 25%, 0.7)" }}
                        ></div>
                        <span>Alta</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <div
                          className="w-4 h-3 rounded-sm"
                          style={{ backgroundColor: "hsla(330, 83%, 45%, 0.7)" }}
                        ></div>
                        <span>Media</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <div
                          className="w-4 h-3 rounded-sm"
                          style={{ backgroundColor: "hsla(330, 83%, 65%, 0.7)" }}
                        ></div>
                        <span>Baja</span>
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
