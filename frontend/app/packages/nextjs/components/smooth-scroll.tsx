"use client"

import { useEffect } from "react"

export function SmoothScroll() {
  useEffect(() => {
    // Función para manejar el scroll suave cuando se hace clic en enlaces con hash
    const handleHashLinkClick = () => {
      // Verificar si hay un hash en la URL
      if (window.location.hash) {
        // Obtener el elemento con el ID correspondiente
        const id = window.location.hash.substring(1)
        const element = document.getElementById(id)

        if (element) {
          // Esperar un momento para asegurar que la página esté completamente cargada
          setTimeout(() => {
            element.scrollIntoView({
              behavior: "smooth",
              block: "start",
            })
          }, 100)
        }
      }
    }

    // Ejecutar al cargar la página
    handleHashLinkClick()

    // Escuchar cambios en el hash
    window.addEventListener("hashchange", handleHashLinkClick)

    // Limpiar el event listener
    return () => {
      window.removeEventListener("hashchange", handleHashLinkClick)
    }
  }, [])

  return null
}
