"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Info, Menu, X, HelpCircle, Github, Download } from "lucide-react"
import { type CallBackProps, STATUS, type Step } from "react-joyride"
import FloatingLegend from "./FloatingLegend"
import MapStyleSwitcher from "./MapStyleSwitcher"

// Dynamically import the map to avoid SSR issues
const FloodMap = dynamic(() => import("./FloodMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-muted">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Cargando mapa...</p>
      </div>
    </div>
  ),
})

// Dynamically import Joyride to avoid SSR issues
const Joyride = dynamic(() => import("react-joyride"), {
  ssr: false,
})

const tutorialSteps: Step[] = [
  {
    target: "body",
    content: (
      <div>
        <h2 className="text-xl font-semibold mb-3">¡Bienvenido al Dashboard de Peligro Hídrico!</h2>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <p className="text-yellow-800 font-semibold text-sm">⚠️ PROYECTO PILOTO</p>
          <p className="text-yellow-700 text-sm mt-1">
            Este es un proyecto piloto. Los datos mostrados son preliminares y están en desarrollo.
          </p>
        </div>
        <p>Te mostraremos las funciones básicas para usar el mapa.</p>
      </div>
    ),
    placement: "center",
  },
  {
    target: ".floating-legend",
    content: (
      <div>
        <h3 className="font-semibold mb-2">Control de Capas</h3>
        <p>Aquí puedes activar y desactivar las diferentes capas de información. Usa los interruptores para mostrar u ocultar las zonas de peligro hídrico y los datos originales.</p>
      </div>
    ),
    placement: "right",
  },
  {
    target: ".map-style-switcher",
    content: (
      <div>
        <h3 className="font-semibold mb-2">Cambiar Estilo de Mapa</h3>
        <p>Pasa el cursor sobre esta imagen para ver las opciones de estilo disponibles. Puedes cambiar entre la vista de visualización de datos y la imagen satelital. Haz clic en cualquier opción para cambiar el estilo del mapa.</p>
      </div>
    ),
    placement: "bottom",
  },
  {
    target: ".geocoding",
    content: (
      <div>
        <h3 className="font-semibold mb-2">Buscar Direcciones</h3>
        <p>Usa esta caja de búsqueda para encontrar una dirección específica en La Plata. Escribe una dirección y selecciona una opción de la lista para navegar directamente a esa ubicación en el mapa.</p>
      </div>
    ),
    placement: "bottom-start",
  },
  {
    target: "body",
    content: (
      <div>
        <h3 className="font-semibold mb-2">Zoom y Navegación</h3>
        <p>Usa la rueda del mouse para hacer zoom in y out, o haz clic en los botones + y - en la esquina superior derecha del mapa. También puedes hacer clic y arrastrar para moverte por el mapa.</p>
      </div>
    ),
    placement: "center",
  },
  {
    target: ".maplibregl-ctrl-geolocate",
    content: (
      <div>
        <h3 className="font-semibold mb-2">Mi Ubicación</h3>
        <p>Haz clic en este botón para centrar el mapa en tu ubicación actual. Esto te ayuda a ver el peligro hídrico en tu área.</p>
      </div>
    ),
    placement: "left",
  },
  {
    target: ".download-link",
    content: (
      <div>
        <h3 className="font-semibold mb-2">Descargar Datos</h3>
        <p>Haz clic aquí para descargar los datos del mapa. Puedes elegir entre los datos originales o los datos suavizados en formato GeoJSON.</p>
      </div>
    ),
    placement: "bottom",
  },
  {
    target: ".github-link",
    content: (
      <div>
        <h3 className="font-semibold mb-2">Código del Proyecto</h3>
        <p>Haz clic aquí para ver el código que procesa estos datos. Incluye todos los scripts y herramientas utilizadas para generar este mapa de peligro hídrico.</p>
      </div>
    ),
    placement: "bottom",
  },
]

export default function FloodDashboard() {
  const [runTutorial, setRunTutorial] = useState(false)
  const [layers, setLayers] = useState({
    floodZones: true,
    originalData: false,
    cadastre: false,
  })
  const [basemap, setBasemap] = useState<string>("DataVisualization")
  const [mapInstance, setMapInstance] = useState<any>(null)

  useEffect(() => {
    // Show tutorial on first visit
    const hasSeenTutorial = localStorage.getItem("flood-dashboard-tutorial")
    if (!hasSeenTutorial) {
      setRunTutorial(true)
    }
  }, [])

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setRunTutorial(false)
      localStorage.setItem("flood-dashboard-tutorial", "true")
    }
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <Joyride
        steps={tutorialSteps}
        run={runTutorial}
        continuous={true}
        showProgress={true}
        showSkipButton={false}
        callback={handleJoyrideCallback}
        styles={{
          options: {
            primaryColor: "hsl(var(--primary))",
            textColor: "hsl(var(--foreground))",
            backgroundColor: "hsl(var(--background))",
            arrowColor: "hsl(var(--background))",
          },
        }}
        locale={{
          back: "Atrás",
          close: "Cerrar",
          last: "Finalizar",
          next: "Siguiente",
        }}
      />

      {/* Professional Header */}
      <header className="professional-header z-20 px-4 pr-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            {/* Title */}
            <div>
              <h1 className="text-lg md:text-xl font-semibold text-foreground">Peligro Hídrico: La Plata</h1>
            </div>
          </div>

          {/* Logos */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-4">
              <img
                src="https://ciut.fau.unlp.edu.ar/wp-content/uploads/sites/33/elementor/thumbs/LOGO-ciut--qjf1cejyso9ssxlxj3wfu5ypvjc9u6swvp6q60jpj4.png"
                alt="CIUT"
                className="h-11 object-contain logo-container"
              />
              <img
                src="https://ciut.fau.unlp.edu.ar/wp-content/uploads/sites/33/elementor/thumbs/LOGO-FAU-recortado-qjf1cejysoaa71ckprs137f87b0uf6zf35uvw13f28.png"
                alt="FAU"
                className="h-16 object-contain logo-container"
              />
              <img
                src="https://ing.unlp.edu.ar/wp-content/uploads/2022/10/logo.png"
                alt="Ingeniería Hidráulica"
                className="h-16 object-contain logo-container"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Action Header - Second Level */}
      <header className="border-b border-border bg-muted/30 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2 text-xs text-yellow-700 bg-yellow-50 px-2 py-1 rounded border border-yellow-200">
              <span>⚠️</span>
              <span>Proyecto Piloto - Los datos mostrados son preliminares y están en desarrollo continuo.</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Tutorial Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setRunTutorial(true)}
              className="tutorial-button flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent"
              title="Iniciar tutorial"
            >
              <HelpCircle className="h-4 w-4" />
              <span>Tutorial</span>
            </Button>
            
            {/* Separator */}
            <div className="w-px h-4 bg-border"></div>
            
            {/* GitHub Link */}
            <a
              href="https://github.com/nlebovits/ciut-inundaciones"
              target="_blank"
              rel="noopener noreferrer"
              className="github-link flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent no-underline"
              title="Ver código del proyecto"
            >
              <Github className="h-4 w-4" />
              <span>Ver Código</span>
            </a>
            
            {/* Separator */}
            <div className="w-px h-4 bg-border"></div>
            
            {/* Download Dropdown */}
            <div className="download-link">
              <Select onValueChange={(value) => {
                const link = document.createElement('a')
                link.href = value
                link.download = value.split('/').pop() || ''
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
              }}>
                <SelectTrigger className="w-auto h-auto p-0 border-0 bg-transparent hover:bg-accent rounded-md">
                  <div className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                    <Download className="h-4 w-4" />
                    <span>Descargar Datos</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="https://github.com/nlebovits/ciut-inundaciones-mapeo/raw/refs/heads/main/public/data/la_plata_original.geojson">
                    Datos Originales
                  </SelectItem>
                  <SelectItem value="https://github.com/nlebovits/ciut-inundaciones-mapeo/raw/refs/heads/main/public/data/la_plata.geojson">
                    Datos Suavizados
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Map Container */}
        <div className="flex-1 map-container relative">
          <FloodMap layers={layers} basemap={basemap} onMapLoad={setMapInstance} />

          {/* Map Style Switcher - Top Left */}
          <div className="absolute top-4 left-4 z-10 map-style-switcher">
            <MapStyleSwitcher basemap={basemap} onBasemapChange={setBasemap} />
          </div>

          {/* Floating Legend - Bottom Left */}
          <div className="absolute bottom-4 left-4 z-10 floating-legend">
            <FloatingLegend layers={layers} onLayerChange={setLayers} />
          </div>
        </div>
      </div>
    </div>
  )
}
