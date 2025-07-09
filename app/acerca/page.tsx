import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 md:py-8 max-w-4xl">
        <div className="prose prose-sm md:prose-lg max-w-none">
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-6 md:mb-8 text-foreground">
            Acerca del Proyecto
          </h1>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 md:p-6 mb-6 md:mb-8">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-yellow-700 font-semibold">⚠️ PROYECTO PILOTO</p>
                <p className="mt-2 text-sm text-yellow-700">
                  Este es un proyecto piloto en desarrollo. Los datos y visualizaciones presentados son preliminares y
                  están sujetos a revisión y mejoras continuas.
                </p>
              </div>
            </div>
          </div>

          <section className="mb-8 md:mb-12">
            <h2 className="text-xl md:text-2xl font-serif font-semibold mb-4">Objetivo del Proyecto</h2>
            <p className="text-base md:text-lg leading-relaxed mb-4">
              Este dashboard tiene como objetivo proporcionar una herramienta interactiva para visualizar y analizar las
              zonas de riesgo hídrico en La Plata. La plataforma permite a usuarios, investigadores y tomadores de
              decisiones explorar de manera intuitiva la información geoespacial relacionada con inundaciones y riesgo
              hídrico en la ciudad.
            </p>
            <p className="text-base md:text-lg leading-relaxed">
              A través de capas interactivas, los usuarios pueden examinar tanto las zonas de riesgo como la
              infraestructura urbana, facilitando una mejor comprensión de la vulnerabilidad territorial ante eventos de
              inundación.
            </p>
          </section>

          <section className="mb-8 md:mb-12">
            <h2 className="text-xl md:text-2xl font-serif font-semibold mb-4 md:mb-6">Instituciones Colaboradoras</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="text-center">
                <div className="mb-4">
                  <img
                    src="https://unlp.edu.ar/wp-content/uploads/2023/06/Identidad-UNLP-1.png"
                    alt="Logo UNLP"
                    className="h-16 md:h-20 mx-auto object-contain"
                  />
                </div>
                <h3 className="text-lg md:text-xl font-serif font-semibold mb-2">Universidad Nacional de La Plata</h3>
              </div>

              <div className="text-center">
                <div className="mb-4">
                  <img
                    src="https://ciut.fau.unlp.edu.ar/wp-content/uploads/sites/33/elementor/thumbs/LOGO-FAU-recortado-qjf1cejysoaa71ckprs137f87b0uf6zf35uvw13f28.png"
                    alt="Logo FAU"
                    className="h-16 md:h-20 mx-auto object-contain"
                  />
                </div>
                <h3 className="text-lg md:text-xl font-serif font-semibold mb-2">
                  Facultad de Arquitectura y Urbanismo
                </h3>
              </div>

              <div className="text-center">
                <div className="mb-4">
                  <img
                    src="https://ing.unlp.edu.ar/wp-content/uploads/2022/10/logo.png"
                    alt="Logo Ingeniería Hidráulica"
                    className="h-16 md:h-20 mx-auto object-contain"
                  />
                </div>
                <h3 className="text-lg md:text-xl font-serif font-semibold mb-2">Facultad de Ingeniería Hidráulica</h3>
              </div>

              <div className="text-center">
                <div className="mb-4">
                  <img
                    src="https://ciut.fau.unlp.edu.ar/wp-content/uploads/sites/33/elementor/thumbs/LOGO-ciut--qjf1cejyso9ssxlxj3wfu5ypvjc9u6swvp6q60jpj4.png"
                    alt="Logo CIUT"
                    className="h-16 md:h-20 mx-auto object-contain"
                  />
                </div>
                <h3 className="text-lg md:text-xl font-serif font-semibold mb-2">
                  Centro de Investigaciones Urbanas y Territoriales (CIUT)
                </h3>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-serif font-semibold mb-4">Metodología y Datos</h2>
            <p className="text-lg leading-relaxed mb-4">
              El proyecto integra datos geoespaciales de múltiples fuentes para crear una representación comprensiva del
              riesgo hídrico urbano. Las capas de información incluyen:
            </p>
            <ul className="list-disc list-inside text-lg leading-relaxed space-y-2 ml-4">
              <li>Zonas de riesgo hídrico clasificadas por nivel de amenaza</li>
              <li>Huellas de edificaciones y infraestructura urbana</li>
              <li>Cartografía base actualizada de La Plata</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-semibold mb-4">Contacto y Colaboración</h2>
            <p className="text-lg leading-relaxed">
              Este proyecto es resultado de la colaboración interdisciplinaria entre la Facultad de Arquitectura y
              Urbanismo y la Facultad de Ingeniería Hidráulica de la Universidad Nacional de La Plata. Para más
              información sobre el proyecto o oportunidades de colaboración, contacte a las instituciones participantes.
            </p>
          </section>
        </div>
      </main>
    </div>
  )
}
