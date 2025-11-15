"use client"

import { Button } from "@/components/ui/button"
import { Icon } from "@iconify/react"
import { useState, useEffect } from "react"

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  // Fecha o menu quando a tela aumenta para desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false)
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Fecha ao clicar fora
  useEffect(() => {
    const handleClick = (e: any) => {
      if (!menuOpen) return
      if (!document.getElementById("mobileMenu")?.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    window.addEventListener("click", handleClick)
    return () => window.removeEventListener("click", handleClick)
  }, [menuOpen])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white border-border flex justify-center bg-black px-6">
      <div className="container flex h-16 items-center justify-between">
        {/* Navegação Desktop */}
        <div className="flex items-center gap-8">
          <nav className="hidden md:flex gap-6">
            <a href="/" className="text-sm font-medium text-white hover:text-gray-300 transition">
              Home
            </a>
            <a href="/Solucoes" className="text-sm font-medium text-gray-300 hover:text-white transition">
              Soluções
            </a>
          </nav>
        </div>

        {/* Botão WhatsApp Desktop */}
        <div className="hidden md:flex">
          <a
            href="https://api.whatsapp.com/send?phone=5514991779502"
            target="_blank"
            className="flex gap-2 items-center"
          >
            <Button className="shadow-lg bg-[#0C8BD2] hover:bg-[#0B6496] transition">
              <img src="/ic_baseline-whatsapp.svg" className="w-6" />
              Fale com a gente
            </Button>
          </a>
        </div>

        {/* Botão Mobile */}
        <Button
          size="icon"
          variant="ghost"
          className="md:hidden text-white"
          onClick={(e) => {
            e.stopPropagation()
            setMenuOpen(!menuOpen)
          }}
        >
          <Icon
            icon={menuOpen ? "solar:close-circle-linear" : "solar:hamburger-menu-outline"}
            className="size-6 text-white"
          />
        </Button>
      </div>

      {/* Menu Mobile */}
      <div
        id="mobileMenu"
        className={`fixed top-16 left-0 w-full bg-white shadow-xl z-50 transform transition-all duration-300 md:hidden
        ${menuOpen ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0 pointer-events-none"}`}
      >
        <nav className="flex flex-col items-center py-6 space-y-5">
          <a
            href="/"
            className="text-lg font-medium text-black hover:text-[#008E52] transition"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </a>
          <a
            href="/Servicos"
            className="text-lg font-medium text-black hover:text-[#008E52] transition"
            onClick={() => setMenuOpen(false)}
          >
            Soluções
          </a>
          

          <a
            href="https://api.whatsapp.com/send?phone=5514991779502"
            target="_blank"
            className="flex gap-2 items-center"
            onClick={() => setMenuOpen(false)}
          >
            <Button className="bg-[#0C8BD2] hover:bg-[#0B6496] transition">
              <img src="/ic_baseline-whatsapp.svg" className="w-6" />
              Fale com a gente
            </Button>
          </a>
        </nav>
      </div>
    </header>
  )
}
