"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Info, Menu, X, HelpCircle } from "lucide-react"
import { type CallBackProps, STATUS, type Step } from "react-joyride"
import MapControlPanel from "./MapControlPanel"

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
        <h2 className="text-xl font-semibold mb-3">¡Bienvenido al Dashboard de Riesgo Hídrico!</h2>
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
    target: ".control-panel",
    content: (
      <div>
        <h3 className="font-semibold mb-2">Panel de Control</h3>
        <p>Aquí puedes activar/desactivar las capas de información y cambiar el tipo de mapa base.</p>
      </div>
    ),
    placement: "right",
  },
  {
    target: ".tutorial-button",
    content: (
      <div>
        <h3 className="font-semibold mb-2">Tutorial</h3>
        <p>Haz clic en este botón para acceder al tutorial interactivo y aprender a usar el mapa.</p>
      </div>
    ),
    placement: "right",
  },
  {
    target: ".maplibregl-ctrl-geolocate",
    content: (
      <div>
        <h3 className="font-semibold mb-2">Mi Ubicación</h3>
        <p>Haz clic para centrar el mapa en tu ubicación actual.</p>
      </div>
    ),
    placement: "left",
  },
]

export default function FloodDashboard() {
  const [runTutorial, setRunTutorial] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [layers, setLayers] = useState({
    floodZones: true,
  })
  const [basemap, setBasemap] = useState<"light" | "satellite">("light")
  const [mapInstance, setMapInstance] = useState<any>(null)

  useEffect(() => {
    // Show tutorial on first visit
    const hasSeenTutorial = localStorage.getItem("flood-dashboard-tutorial")
    if (!hasSeenTutorial) {
      setRunTutorial(true)
    }

    // Handle mobile sidebar - delay to avoid hydration issues
    const handleResize = () => {
      const newSidebarState = window.innerWidth >= 768
      setSidebarOpen(newSidebarState)
    }

    // Delay the initial resize check to avoid hydration mismatch
    const timer = setTimeout(() => {
      handleResize()
    }, 0)

    window.addEventListener("resize", handleResize)
    return () => {
      clearTimeout(timer)
      window.removeEventListener("resize", handleResize)
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
        showSkipButton={true}
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
          skip: "Saltar tutorial",
        }}
      />

      {/* Professional Header */}
      <header className="professional-header z-20 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            {/* Mobile menu button */}
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden">
              {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>

            {/* Title */}
            <div>
              <h1 className="text-lg md:text-xl font-semibold text-foreground">Riesgo Hídrico: La Plata</h1>
            </div>
          </div>

          {/* Logos */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-4">
              <img
                src="https://ciut.fau.unlp.edu.ar/wp-content/uploads/sites/33/elementor/thumbs/LOGO-FAU-recortado-qjf1cejysoaa71ckprs137f87b0uf6zf35uvw13f28.png"
                alt="FAU"
                className="h-8 object-contain logo-container"
              />
              <img
                src="https://ing.unlp.edu.ar/wp-content/uploads/2022/10/logo.png"
                alt="Ingeniería Hidráulica"
                className="h-8 object-contain logo-container"
              />
              <img
                src="https://ciut.fau.unlp.edu.ar/wp-content/uploads/sites/33/elementor/thumbs/LOGO-ciut--qjf1cejyso9ssxlxj3wfu5ypvjc9u6swvp6q60jpj4.png"
                alt="CIUT"
                className="h-8 object-contain logo-container"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Panel */}
        {sidebarOpen && (
          <div className="sidebar-panel w-80 md:w-96 flex-shrink-0 overflow-y-auto control-panel">
            <MapControlPanel layers={layers} onLayerChange={setLayers} basemap={basemap} onBasemapChange={setBasemap} />
          </div>
        )}

        {/* Map Container */}
        <div className="flex-1 map-container relative">
          <FloodMap layers={layers} basemap={basemap} onMapLoad={setMapInstance} />

          {/* Tutorial Button - Top Left */}
          <div className="absolute top-4 left-4 z-10 tutorial-button">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRunTutorial(true)}
              className="bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white"
              title="Iniciar tutorial"
            >
              <HelpCircle className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
