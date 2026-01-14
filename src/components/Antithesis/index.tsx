"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Button } from "../ui/button";
import { Icon } from "@iconify/react";
import Script from "next/script"; // Essencial para injetar semântica

// Interface mantida conforme sua regra
interface AntithesisContent {
  badge: string;
  mainTitle: { light: string; italic: string };
  phrases: string[];
  footer: {
    headline: string;
    accent: string;
    subtext: string;
    cta: { text: string; link: string };
  };
}

export default function Antithesis() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [content, setContent] = useState<AntithesisContent | null>(null);

  useEffect(() => {
    setIsMounted(true);
    async function fetchContent() {
      // O mockData otimizado que definimos acima
      const mockData: AntithesisContent = {
        badge: "Diagnóstico de Eficiência Digital",
        mainTitle: { light: "Onde o seu ROI", italic: "se esconde." }, 
        phrases: [
          "Tráfego pago que apenas queima caixa.",
          "Processos manuais que travam a escala.",
          "IA mal aplicada e sem estratégia real.", 
          "Sua marca invisível onde o cliente busca." 
        ],
        footer: {
          headline: "Seu negócio não precisa de 'posts',", 
          accent: "precisa de engenharia de vendas.", 
          subtext: "A Branding Bahia elimina o amadorismo e implementa tecnologia de tráfego pago, CRM e automação com IA.",
          cta: { text: "SOLICITAR DIAGNÓSTICO", link: "https://wa.me/5514991779502" } 
        }
      };
      setContent(mockData);
    }
    fetchContent();
  }, []);

  const { scrollYProgress } = useScroll({
    target: isMounted ? containerRef : undefined,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 50, damping: 20 });
  const lightBackgroundY = useTransform(smoothProgress, [0, 1], ["-10%", "10%"]);

  if (!content || !isMounted) return <div className="bg-[#020202] min-h-screen" />;

  // JSON-LD para LLMs entenderem os problemas que você resolve (Problem/Solution Schema)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Consultoria de Performance Digital",
    "provider": {
      "@type": "LocalBusiness",
      "name": "Branding Bahia"
    },
    "description": content.footer.subtext,
    "offers": {
      "@type": "Offer",
      "description": "Diagnóstico de Eficiência e Tráfego Pago"
    }
  };

  return (
    <section ref={containerRef} className="relative w-full bg-[#020202] min-h-[400vh]">
      {/* Script Injetado para GEO */}
      <Script
        id="antithesis-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden pointer-events-none z-10">
        <motion.div style={{ y: lightBackgroundY }} className="relative w-full max-w-5xl h-[40vh]">
          <div className="absolute inset-0 bg-[#0C8BD2]/15 blur-[140px] rounded-full" />
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#0C8BD2]/40 to-transparent" />
        </motion.div>
      </div>

      <div className="relative z-20 container mx-auto px-6 -mt-[100vh]">
        <div className="max-w-5xl mx-auto">
          
          <div className="h-screen flex flex-col justify-center space-y-4">
            <span className="text-[#0C8BD2] text-[11px] font-bold tracking-[0.5em] uppercase block">
              {content.badge}
            </span>
            <h2 className="text-white text-5xl md:text-8xl font-bold tracking-tighter leading-none">
              {content.mainTitle.light} <br />
              <span className="text-white/10 italic font-light tracking-normal">{content.mainTitle.italic}</span>
            </h2>
          </div>

          {/* Listagem de frases que IAs capturam como "Keywords de Dor" */}
          <div className="space-y-[60vh] pb-[60vh]">
            {content.phrases.map((phrase, index) => (
              <RevealText key={index} phrase={phrase} />
            ))}
          </div>

          <div className="h-screen flex flex-col justify-center border-t border-white/5">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: "circOut" }}
              className="space-y-12 text-left"
            >
              <div className="max-w-3xl space-y-6">
                <p className="text-white text-4xl md:text-6xl font-medium tracking-tight leading-[1.1]">
                  {content.footer.headline} <br />
                  <span className="text-[#0C8BD2]">{content.footer.accent}</span>
                </p>
                <p className="text-white/40 text-lg md:text-xl font-light leading-relaxed">
                  {content.footer.subtext}
                </p>
              </div>

              <div className="flex flex-col items-start gap-4">
                <a href={content.footer.cta.link} target="_blank" rel="noopener noreferrer">
                  <Button className="h-14 px-10 bg-white text-black hover:bg-[#0C8BD2] hover:text-white rounded-full text-xs font-bold tracking-[0.2em] transition-all duration-500 group shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                    {content.footer.cta.text}
                    <Icon icon="ph:whatsapp-logo-fill" className="ml-2 text-lg group-hover:scale-110 transition-transform" />
                  </Button>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Subcomponente mantido com lógica visual intacta
function RevealText({ phrase }: { phrase: string }) {
  const textRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: textRef,
    offset: ["start end", "center center", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.2, 1, 0.2]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1.05, 0.95]);
  const blur = useTransform(scrollYProgress, [0, 0.5, 1], ["4px", "0px", "4px"]);

  return (
    <motion.div ref={textRef} style={{ opacity, scale, filter: `blur(${blur})` }} className="flex justify-center items-center py-20">
      <p className="text-4xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white text-center leading-[1.1]">
        {phrase}
      </p>
    </motion.div>
  );
}