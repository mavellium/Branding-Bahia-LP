"use client"

import { Button } from "@/components/ui/button"
import { Icon } from "@iconify/react"
import { useState } from "react"

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border flex justify-center bg-white px-10">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <a href="/" className="flex items-center">
            <img
              src="/logo-mavellium.svg"
              alt="Mavellium"
              width={180}
              height={40}
              className="object-contain"
            />
          </a>

          <nav className="hidden md:flex gap-6">
            <a
              href="/"
              className="text-sm font-medium text-black hover:text-foreground transition-colors"
            >
              Home
            </a>
            <a
              href="/Servicos"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Serviços
            </a>
            <a
              href="/Sobre"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Sobre
            </a>
            <a
              href="/Contato"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Contato
            </a>
          </nav>
        </div>

        <div className="hidden md:flex">
          <a
            href="https://api.whatsapp.com/send?phone=5514991779502&text=Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20os%20servi%C3%A7os%20de%20desenvolvimento%20web%20da%20empresa.%20Poderiam%20me%20passar%20mais%20informa%C3%A7%C3%B5es%20sobre%20as%20solu%C3%A7%C3%B5es%2C%20tecnologias%20e%20valores%20dispon%C3%ADveis%3F"
            target="_blank"
            rel="noopener noreferrer"
            className="flex gap-2 justify-center items-center cursor-pointer"
          >
            <Button className="shadow-lg shadow-primary/20 bg-[#008E52] hover:bg-[#017346] cursor-pointer transition-all hover:scale-105">
              <img src="/ic_baseline-whatsapp.svg" className="w-6" />
              Fale com a gente
            </Button>
          </a>
        </div>

        {/* Botão do menu mobile */}
        <Button
          size="icon"
          variant="ghost"
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Icon
            icon={menuOpen ? "solar:close-circle-linear" : "solar:hamburger-menu-outline"}
            className="size-6"
          />
        </Button>
      </div>

      {/* Menu Mobile */}
      {menuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white border-t border-border shadow-md z-40">
          <nav className="flex flex-col items-center py-4 space-y-4">
            <a
              href="/"
              className="text-base font-medium text-black hover:text-[#008E52] transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </a>
            <a
              href="/Servicos"
              className="text-base font-medium text-black hover:text-[#008E52] transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Serviços
            </a>
            <a
              href="/Sobre"
              className="text-base font-medium text-black hover:text-[#008E52] transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Sobre
            </a>
            <a
              href="/Contato"
              className="text-base font-medium text-black hover:text-[#008E52] transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Contato
            </a>

            <a
              href="https://api.whatsapp.com/send?phone=5514991779502&text=Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20os%20servi%C3%A7os%20de%20desenvolvimento%20web%20da%20empresa.%20Poderiam%20me%20passar%20mais%20informa%C3%A7%C3%B5es%20sobre%20as%20solu%C3%A7%C3%B5es%2C%20tecnologias%20e%20valores%20dispon%C3%ADveis%3F"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="flex gap-2 justify-center items-center"
            >
              <Button className="shadow-lg shadow-primary/20 bg-[#008E52] hover:bg-[#017346] transition-all hover:scale-105">
                <img src="/ic_baseline-whatsapp.svg" className="w-6" />
                Fale com a gente
              </Button>
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
