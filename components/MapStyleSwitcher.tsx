"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface MapStyleSwitcherProps {
  basemap: string
  onBasemapChange: (basemap: string) => void
}

export default function MapStyleSwitcher({ basemap, onBasemapChange }: MapStyleSwitcherProps) {
  const [isHovered, setIsHovered] = useState(false)

  type BaseMap = {
    name: string
    img: string
    label: string
  }

  const baseMaps: BaseMap[] = [
    {
      name: 'DataVisualization',
      img: 'https://cloud.maptiler.com/static/img/maps/dataviz.png',
      label: 'Visualización de Datos'
    },
    {
      name: 'Hybrid',
      img: 'https://cloud.maptiler.com/static/img/maps/hybrid.png',
      label: 'Imagen Satelital'
    },
  ]

  const currentBasemap = baseMaps.find(map => map.name === basemap) || baseMaps[0]
  const otherBasemaps = baseMaps.filter(map => map.name !== basemap)

  // Debug logging
  useEffect(() => {
    console.log('🎨 MapStyleSwitcher Debug:', {
      basemap,
      currentBasemap: currentBasemap.name,
      availableBasemaps: baseMaps.map(b => b.name),
      otherBasemaps: otherBasemaps.map(b => b.name)
    })
  }, [basemap, currentBasemap, otherBasemaps])

  const onClick = (selectedBasemap: BaseMap) => {
    console.log('🎨 Switching basemap from', basemap, 'to', selectedBasemap.name)
    onBasemapChange(selectedBasemap.name)
  }

  return (
    <div
      className="relative bg-white/95 backdrop-blur-sm shadow-md rounded-lg border border-gray-300 p-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Image
        src={currentBasemap.img}
        alt={currentBasemap.label}
        width={60}
        height={60}
        title={currentBasemap.label}
        className="cursor-pointer w-14 h-14 rounded border border-gray-300"
      />

      {otherBasemaps.length > 0 && (
        <div
          className={`absolute flex flex-row items-center gap-2 transition-all duration-300 ${
            isHovered
              ? 'translate-x-16 opacity-100 pointer-events-auto'
              : 'translate-x-0 opacity-0 pointer-events-none'
          }`}
          style={{
            left: '4rem',
            top: '50%',
            transform: 'translateY(-50%)',
            minWidth: '60px',
          }}
        >
          {otherBasemaps.map((map) => (
            <Image
              key={map.name}
              src={map.img}
              alt={map.label}
              width={60}
              height={60}
              title={map.label}
              onClick={() => onClick(map)}
              className="cursor-pointer w-14 h-14 rounded border border-gray-300 hover:border-gray-500 bg-white/95 backdrop-blur-sm shadow-md flex-shrink-0"
            />
          ))}
        </div>
      )}
    </div>
  )
} 