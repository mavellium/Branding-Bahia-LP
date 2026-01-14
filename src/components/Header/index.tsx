"use client"

import { Button } from "@/components/ui/button"
import { Icon } from "@iconify/react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface HeaderContent {
  logo: {
    textFirst: string;
    textSecond: string;
    accentColor: string;
  };
  navigation: {
    label: string;
    sectionId: string;
    isExternal: boolean;
  }[];
  contact: {
    buttonText: string;
    whatsappNumber: string;
  };
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [content, setContent] = useState<HeaderContent | null>(null)

  // 2. Simulação da chamada ao CMS
  useEffect(() => {
    async function getCmsContent() {
      // Aqui você faria o: const res = await fetch('seu-endpoint-cms')
      const mockData: HeaderContent = {
        logo: {
          textFirst: "BRANDING",
          textSecond: "BAHIA",
          accentColor: "#0C8BD2"
        },
        navigation: [
          { label: "Home", sectionId: "home", isExternal: false },
          { label: "Soluções", sectionId: "Solucoes", isExternal: false },
          { label: "O Especialista", sectionId: "marcos", isExternal: false },
        ],
        contact: {
          buttonText: "FALE CONOSCO",
          whatsappNumber: "5514991779502"
        }
      };
      setContent(mockData);
    }
    getCmsContent();
  }, [])

  // Lógica de Scroll e Resize
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleNavClick = (e: React.MouseEvent, sectionId: string, isExternal: boolean) => {
    if (isExternal) return;
    
    e.preventDefault();
    if (sectionId === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        window.scrollTo({ top: element.offsetTop - 80, behavior: "smooth" });
      }
    }
    setMenuOpen(false);
  }

  if (!content) return null; // Evita erro de renderização antes dos dados chegarem

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-[100] w-full transition-all duration-500 border-b ${
        scrolled ? "bg-black/80 backdrop-blur-xl border-white/10 h-16" : "bg-transparent border-transparent h-20"
      }`}
    >
      <div className="w-full px-6 h-full flex items-center">
        <div className="flex w-full items-center justify-between mx-auto max-w-7xl">
          
          {/* Logo Dinâmico */}
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
          >
             <div className="w-8 h-8 bg-[#0C8BD2] rounded-sm rotate-45 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
             </div>
             <span className="text-white font-bold tracking-tighter text-xl uppercase">
                {content.logo.textFirst} <span style={{ color: content.logo.accentColor }}>{content.logo.textSecond}</span>
             </span>
          </div>

          {/* Navegação Desktop Dinâmica */}
          <nav className="hidden md:flex items-center gap-10">
            {content.navigation.map((item, index) => (
              <a
                key={index}
                href={`#${item.sectionId}`}
                className="text-xs uppercase tracking-[0.2em] font-bold text-white/50 hover:text-[#0C8BD2] transition-colors"
                onClick={(e) => handleNavClick(e, item.sectionId, item.isExternal)}
              >
                {item.label}
              </a>
            ))}
            
            <a 
              href={`https://api.whatsapp.com/send?phone=${content.contact.whatsappNumber}`} 
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="h-10 px-6 bg-[#0C8BD2] hover:bg-[#0a7ab9] text-white rounded-full text-xs font-bold tracking-widest transition-all shadow-[0_0_15px_rgba(12,139,210,0.3)]">
                {content.contact.buttonText}
              </Button>
            </a>
          </nav>

          {/* Botão Mobile */}
          <button className="md:hidden text-white p-2" onClick={() => setMenuOpen(!menuOpen)}>
            <Icon icon={menuOpen ? "ph:x-bold" : "ph:list-bold"} className="size-7" />
          </button>
        </div>
      </div>

      {/* Menu Mobile Dinâmico */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 top-16 bg-black/95 backdrop-blur-2xl z-[90] md:hidden flex flex-col items-center justify-center space-y-10"
          >
            <nav className="flex flex-col items-center space-y-8">
              {content.navigation.map((item, index) => (
                <a
                  key={index}
                  href={`#${item.sectionId}`}
                  className="text-2xl font-bold text-white tracking-tighter"
                  onClick={(e) => handleNavClick(e, item.sectionId, item.isExternal)}
                >
                  {item.label}
                </a>
              ))}
              
              <a 
                href={`https://api.whatsapp.com/send?phone=${content.contact.whatsappNumber}`} 
                target="_blank"
                className="pt-4"
              >
                <Button className="h-14 px-10 bg-[#0C8BD2] rounded-full text-lg font-bold">
                  {content.contact.buttonText}
                </Button>
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}