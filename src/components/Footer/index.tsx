"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// Hook para scroll suave
function useSmoothScroll() {
  useEffect(() => {
    const links = document.querySelectorAll('a[href^="#"]');

    const handleClick = (e: Event) => {
      e.preventDefault();
      const target = (e.currentTarget as HTMLAnchorElement).getAttribute("href");
      if (!target) return;

      const element = document.querySelector(target);
      if (!element) return;

      element.scrollIntoView({ behavior: "smooth" });
    };

    links.forEach((link) => link.addEventListener("click", handleClick));

    return () => {
      links.forEach((link) => link.removeEventListener("click", handleClick));
    };
  }, []);
}

export function Footer() {
  useSmoothScroll();

  return (
    <footer className="border-t w-full flex flex-col justify-center items-center border-[#04A15E] py-12 px-6 md:px-12 md:py-16 bg-[#030F1B]">
      <div className="container mx-auto">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 justify-center text-center md:text-start">
          {/* Logo e Instagram */}
          <div className="space-y-4 flex flex-col items-center md:items-start">
            <img src="/logo-mavellium-footer.svg" alt="Mavellium" width={233} height={52} />
            <p className="text-md text-[#A7B4CE]">
              Desenvolvimento de software e
              <span className="block">landing pages de alta conversão.</span>
            </p>
            <Button
              size="icon"
              variant="ghost"
              className="size-9 p-1 rounded-full hover:bg-[#0A3159]"
            >
              <a
                href="https://www.instagram.com/mavellium/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="/mdi_instagram.svg" alt="Instagram" />
              </a>
            </Button>
          </div>

          {/* Empresa */}
          <div className="space-y-4 flex flex-col items-center md:items-start">
            <h3 className="font-semibold text-white">Empresa</h3>
            <nav className="flex flex-col space-y-2">
              <a href="/Sobre" className="text-sm text-[#6B7280] hover:text-white transition-colors">
                Sobre
              </a>
              <a href="/Servicos" className="text-sm text-[#6B7280] hover:text-white transition-colors">
                Serviços
              </a>
              {/* <a href="#cases" className="text-sm text-[#6B7280] hover:text-white transition-colors">
                Cases
              </a> */}
              <a href="/Contato" className="text-sm text-[#6B7280] hover:text-white transition-colors">
                Contato
              </a>
            </nav>
          </div>

          {/* Serviços */}
          <div className="space-y-4 flex flex-col items-center md:items-start">
            <h3 className="font-semibold text-white">Serviços</h3>
            <nav className="flex flex-col space-y-2">
              <a href="/Servicos/LandingPage" className="text-sm text-[#6B7280] hover:text-white transition-colors">
                Landing Pages de Alta Conversão
              </a>
              <a href="/Servicos/Institucionais" className="text-sm text-[#6B7280] hover:text-white transition-colors">
                Sites Institucionais
              </a>
              {/* <a href="/servicos#apps-personalizados" className="text-sm text-[#6B7280] hover:text-white transition-colors">
                Apps Personalizados
              </a> */}
            </nav>
          </div>

          {/* Contato */}
          <div className="space-y-4 flex flex-col items-center md:items-start">
            <h3 className="font-semibold text-white">Contato</h3>
            <div className="space-y-2 flex flex-col">
              <a href="mailto:contato@mavellium.com" target="blank_" className="text-sm text-[#6B7280] hover:text-white">contato@mavellium.com</a>
              <a href="https://api.whatsapp.com/send?phone=5514991779502&text=Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20os%20servi%C3%A7os%20de%20desenvolvimento%20web%20da%20empresa.%20Poderiam%20me%20passar%20mais%20informa%C3%A7%C3%B5es%20sobre%20as%20solu%C3%A7%C3%B5es%2C%20tecnologias%20e%20valores%20dispon%C3%ADveis%3F" target="blank_" className="text-sm text-[#6B7280] hover:text-white">(14) 99177-9502</a>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-[#04A15E]" />

        <div className="flex flex-col md:flex-row justify-center md:justify-between items-center gap-4 text-sm text-[#A7B4CE] text-center md:text-left">
          <p>© 2024 Mavellium — Todos os direitos reservados.</p>
          <div className="flex items-center gap-4">
            <a href="/privacidade" className="text-[#A7B4CE]">
              Privacidade
            </a>
            <a href="/termos" className="text-[#A7B4CE]">
              Termos
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
