"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import Script from "next/script";

// Interface mantida para integridade do CMS 
interface FooterContent {
  cta: {
    badge: string;
    headlineMain: string;
    headlineItalic: string;
    headlineEnd: string;
    buttonText: string;
    whatsappLink: string;
  };
  navigation: {
    title: string;
    links: { label: string; href: string }[];
  };
  info: {
    title: string;
    address: string;
    serviceArea: string;
    foundedText: string;
    copyright: string;
  };
}

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
  const [content, setContent] = useState<FooterContent | null>(null);

  useEffect(() => {
    async function fetchFooter() {
      const mockData: FooterContent = {
        cta: {
          badge: "Fale com Marcos Ramos", // Reforço de autoridade [cite: 297]
          headlineMain: "Pronto para",
          headlineItalic: "iluminar",
          headlineEnd: "sua presença digital?",
          buttonText: "Solicitar Diagnóstico Estratégico",
          whatsappLink: "https://wa.me/55719XXXXXXXX"
        },
        navigation: {
          title: "Soluções",
          links: [
            { label: "Início", href: "#headline-section" },
            { label: "Arsenal (SEO+GEO)", href: "#services" }, // SEO/GEO [cite: 209]
            { label: "Metodologia BPM", href: "#strategic" }, // BPM [cite: 213]
            { label: "Estrategista", href: "#authority" }
          ]
        },
        info: {
          title: "Sede Estratégica",
          address: "Salvador — Bahia, Brasil", // Reforço geográfico 
          serviceArea: "Atendimento Nacional e Internacional",
          foundedText: "Est. 2026",
          copyright: "© 2026 Branding Bahia. Inteligência de Dados e Performance."
        }
      };
      setContent(mockData);
    }
    fetchFooter();
  }, []);

  if (!content) return null;

  // Dados estruturados LocalBusiness para GEO 
  const footerStructuredData = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Branding Bahia",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Salvador",
      "addressRegion": "BA",
      "addressCountry": "BR"
    },
    "description": "Especialistas em Tráfego Pago, Automação com IA, SEO e GEO.",
    "founder": {
      "@type": "Person",
      "name": "Marcos Ramos"
    },
    "areaServed": "Brasil"
  };

  return (
    <footer className="relative bg-[#000000] pt-32 pb-12 overflow-hidden border-t border-white/5">
      <Script
        id="footer-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(footerStructuredData) }}
      />

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[300px] bg-[#0C8BD2]/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-24 items-end">
          
          <div className="space-y-8 text-left">
            <span className="text-[#0C8BD2] text-[11px] font-bold tracking-[0.5em] uppercase">
              {content.cta.badge}
            </span>
            <h2 className="text-white text-5xl md:text-7xl font-bold tracking-tighter leading-none">
              {content.cta.headlineMain} <br />
              <span className="text-white/20 italic">{content.cta.headlineItalic}</span> {content.cta.headlineEnd}
            </h2>
            <a 
              href={content.cta.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-4 bg-[#0C8BD2] text-white px-10 py-5 rounded-full font-bold uppercase text-xs tracking-widest hover:bg-[#0C8BD2]/90 transition-all shadow-[0_0_30px_rgba(12,139,210,0.3)] group"
            >
              {content.cta.buttonText}
              <Icon icon="ph:whatsapp-logo-fill" className="text-xl group-hover:rotate-12 transition-transform" />
            </a>
          </div>

          <div className="grid grid-cols-2 gap-12 text-left">
            <nav className="space-y-6">
              <h4 className="text-white text-xs font-bold uppercase tracking-widest">{content.navigation.title}</h4>
              <ul className="space-y-4">
                {content.navigation.links.map((link, i) => (
                  <li key={i}>
                    <a href={link.href} className="text-white/40 hover:text-white transition-colors text-sm">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="space-y-6">
              <h4 className="text-white text-xs font-bold uppercase tracking-widest">{content.info.title}</h4>
              <p className="text-white/40 text-sm leading-relaxed">
                {content.info.address} <br />
                {content.info.serviceArea}
              </p>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-6">
            <Image src="/branding-bahia-v4.png" alt="Branding Bahia" width={140} height={40} className="opacity-30 grayscale" />
            <span className="text-white/10 text-[10px] uppercase tracking-widest hidden md:block">
              {content.info.foundedText}
            </span>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-8">
            <p className="text-white/20 text-[10px] uppercase tracking-[0.2em]">
              {content.info.copyright}
            </p>
            <div className="flex items-center gap-3 opacity-30 hover:opacity-100 transition-opacity">
              <span className="text-white/40 text-[9px] uppercase tracking-[0.2em]">Engineered by</span>
              <Image src="/logo_mavellium.webp" height={24} width={80} alt="Mavellium" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}