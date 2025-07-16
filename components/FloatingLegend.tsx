"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Layers } from "lucide-react"

interface FloatingLegendProps {
  layers: {
    floodZones: boolean
    originalData: boolean
  }
  onLayerChange: (layers: { floodZones: boolean; originalData: boolean }) => void
}

export default function FloatingLegend({ layers, onLayerChange }: FloatingLegendProps) {
  const toggleLayer = (layerName: keyof typeof layers) => {
    onLayerChange({
      ...layers,
      [layerName]: !layers[layerName],
    })
  }

  return (
    <Card className="bg-white/95 backdrop-blur-sm shadow-lg border-gray-200 min-w-[280px]">
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
            <label className="text-sm font-medium cursor-pointer">Zonas de Peligro Hídrico</label>
            <Switch checked={layers.floodZones} onCheckedChange={() => toggleLayer("floodZones")} />
          </div>

          {layers.floodZones && (
            <div className="space-y-2 pl-4 border-l-2 border-gray-100">
              <div className="flex items-center gap-3 text-xs">
                <div
                  className="w-4 h-3 rounded-sm border"
                  style={{ backgroundColor: "hsla(221, 83%, 25%, 0.7)" }}
                ></div>
                <span>Alta</span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <div
                  className="w-4 h-3 rounded-sm border"
                  style={{ backgroundColor: "hsla(221, 83%, 45%, 0.7)" }}
                ></div>
                <span>Media</span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <div
                  className="w-4 h-3 rounded-sm border"
                  style={{ backgroundColor: "hsla(221, 83%, 65%, 0.7)" }}
                ></div>
                <span>Baja</span>
              </div>
            </div>
          )}
        </div>

        {/* Original Data Layer */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium cursor-pointer">Datos Originales</label>
            <Switch checked={layers.originalData} onCheckedChange={() => toggleLayer("originalData")} />
          </div>

          {layers.originalData && (
            <div className="space-y-2 pl-4 border-l-2 border-gray-100">
              <div className="flex items-center gap-3 text-xs">
                <div
                  className="w-4 h-3 rounded-sm border"
                  style={{ backgroundColor: "hsla(330, 83%, 25%, 0.7)" }}
                ></div>
                <span>Alta</span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <div
                  className="w-4 h-3 rounded-sm border"
                  style={{ backgroundColor: "hsla(330, 83%, 45%, 0.7)" }}
                ></div>
                <span>Media</span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <div
                  className="w-4 h-3 rounded-sm border"
                  style={{ backgroundColor: "hsla(330, 83%, 65%, 0.7)" }}
                ></div>
                <span>Baja</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 