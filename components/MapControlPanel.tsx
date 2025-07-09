"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Layers, Map, Satellite, AlertTriangle } from "lucide-react"

interface MapControlPanelProps {
  layers: {
    floodZones: boolean
    buildings: boolean
  }
  onLayerChange: (layers: { floodZones: boolean; buildings: boolean }) => void
  basemap: "light" | "satellite"
  onBasemapChange: (basemap: "light" | "satellite") => void
}

export default function MapControlPanel({ layers, onLayerChange, basemap, onBasemapChange }: MapControlPanelProps) {
  const toggleLayer = (layerName: keyof typeof layers) => {
    onLayerChange({
      ...layers,
      [layerName]: !layers[layerName],
    })
  }

  return (
    <div className="p-6 space-y-6">
      {/* Pilot Project Warning */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-yellow-800">Proyecto Piloto</p>
              <p className="text-xs text-yellow-700 mt-1">
                Los datos mostrados son preliminares y están en desarrollo continuo.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Map Style */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Map className="h-4 w-4" />
            Estilo de Mapa
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={basemap === "light" ? "default" : "outline"}
              size="sm"
              onClick={() => onBasemapChange("light")}
              className="text-xs"
            >
              <Map className="h-3 w-3 mr-1" />
              Claro
            </Button>
            <Button
              variant={basemap === "satellite" ? "default" : "outline"}
              size="sm"
              onClick={() => onBasemapChange("satellite")}
              className="text-xs"
            >
              <Satellite className="h-3 w-3 mr-1" />
              Satélite
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Layers */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Layers className="h-4 w-4" />
            Capas de Información
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Flood Zones */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium cursor-pointer">Zonas de Riesgo Hídrico</label>
              <Switch checked={layers.floodZones} onCheckedChange={() => toggleLayer("floodZones")} />
            </div>

            {layers.floodZones && (
              <div className="space-y-2 pl-4 border-l-2 border-gray-100">
                <div className="flex items-center gap-3 text-xs">
                  <div
                    className="w-4 h-3 rounded-sm border"
                    style={{ backgroundColor: "hsla(221, 83%, 85%, 0.8)" }}
                  ></div>
                  <span>Muy baja a nula</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <div
                    className="w-4 h-3 rounded-sm border"
                    style={{ backgroundColor: "hsla(221, 83%, 65%, 0.8)" }}
                  ></div>
                  <span>Baja</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <div
                    className="w-4 h-3 rounded-sm border"
                    style={{ backgroundColor: "hsla(221, 83%, 45%, 0.8)" }}
                  ></div>
                  <span>Media</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <div
                    className="w-4 h-3 rounded-sm border"
                    style={{ backgroundColor: "hsla(221, 83%, 25%, 0.8)" }}
                  ></div>
                  <span>Alta</span>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Buildings */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium cursor-pointer">Edificios</label>
              <Switch checked={layers.buildings} onCheckedChange={() => toggleLayer("buildings")} />
            </div>

            {layers.buildings && (
              <div className="pl-4 border-l-2 border-gray-100">
                <div className="flex items-center gap-3 text-xs">
                  <div className="w-4 h-3 rounded-sm bg-gray-300 border border-gray-400"></div>
                  <span>Huellas de Edificios</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
