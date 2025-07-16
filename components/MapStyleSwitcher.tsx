"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Map, Satellite, ChevronDown } from "lucide-react"

interface MapStyleSwitcherProps {
  basemap: "light" | "satellite"
  onBasemapChange: (basemap: "light" | "satellite") => void
}

export default function MapStyleSwitcher({ basemap, onBasemapChange }: MapStyleSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)

  const basemapOptions = [
    {
      id: "light" as const,
      label: "Mapa Claro",
      icon: Map,
      description: "Vista de mapa estándar",
    },
    {
      id: "satellite" as const,
      label: "Imagen Satelital",
      icon: Satellite,
      description: "Vista satelital",
    },
  ]

  const currentOption = basemapOptions.find(option => option.id === basemap)

  return (
    <div className="relative">
      {/* Main Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white/95 backdrop-blur-sm shadow-lg hover:bg-white border-gray-200 min-w-[140px] justify-between"
      >
        <div className="flex items-center space-x-2">
          {currentOption && <currentOption.icon className="h-4 w-4" />}
          <span className="text-sm font-medium">{currentOption?.label}</span>
        </div>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-2 space-y-1">
            {basemapOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => {
                  onBasemapChange(option.id)
                  setIsOpen(false)
                }}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors ${
                  basemap === option.id
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "hover:bg-gray-50 text-gray-700"
                }`}
              >
                <option.icon className="h-4 w-4 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-sm font-medium">{option.label}</div>
                  <div className="text-xs text-gray-500">{option.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
} 