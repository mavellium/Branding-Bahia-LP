"use client";
import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { Button } from "../ui/button";
import { MoveRight, ChevronDown } from "lucide-react";
import Script from "next/script";

// Declaração da interface para resolver o erro de compilação 
interface HeroContent {
    badge: string;
    headline: {
        textNormal: string;
        textAccent: string;
    };
    subheadline: string;
    primaryCta: {
        text: string;
        link: string;
    };
    secondaryCta: {
        text: string;
        link: string;
    };
    trustBadge: string;
}

export function Headline() {
    const [content, setContent] = useState<HeroContent | null>(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const smoothX = useSpring(mouseX, { stiffness: 150, damping: 30 });
    const smoothY = useSpring(mouseY, { stiffness: 150, damping: 30 });

    useEffect(() => {
        async function fetchHero() {

            const mockData: HeroContent = {
                badge: "Estratégia Digital & Inteligência Artificial em Salvador", 
                headline: {
                    textNormal: "Mais tráfego, mais leads", 
                    textAccent: "e mais vendas." 
                },
                subheadline: "Unimos criatividade, tecnologia e IA para transformar sua visibilidade em resultados reais no Google e nas respostas do ChatGPT e Gemini.", 
                primaryCta: {
                    text: "Quero Escalar meu Negócio", 
                    link: "https://wa.me/55719XXXXXXXX"
                },
                secondaryCta: {
                    text: "Ver Nosso Arsenal", 
                    link: "#Services"
                },
                trustBadge: "Consultoria liderada por especialistas com +25 anos de mercado" 
            };
            setContent(mockData);
        }
        fetchHero();
    }, []);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const rect = document.getElementById("headline-section")?.getBoundingClientRect();
            if (rect) {
                mouseX.set(e.clientX - rect.left);
                mouseY.set(e.clientY - rect.top);
            }
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    const { scrollY } = useScroll();
    const lightOpacity = useTransform(scrollY, [0, 500], [1, 0]);

    if (!content) return null;

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebPageElement",
        "name": "Dobra Principal Branding Bahia",
        "headline": `${content.headline.textNormal} ${content.headline.textAccent}`,
        "description": content.subheadline
    };

    return (
        <section id="headline-section" className="relative w-full flex flex-col justify-center items-center overflow-hidden bg-[#050505] h-screen px-6">
            <Script
                id="hero-jsonld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
            
            <motion.div 
                style={{
                    left: smoothX,
                    top: smoothY,
                    opacity: lightOpacity,
                }}
                className="absolute w-[600px] h-[600px] bg-[#0C8BD2]/20 blur-[130px] rounded-full z-10 pointer-events-none -translate-x-1/2 -translate-y-1/2" 
            />

            <div className="container relative z-20 flex flex-col items-center text-center">
                
                <div className="mb-6 px-4 py-1 border border-white/10 rounded-full bg-white/5 backdrop-blur-md text-white/80 text-[10px] tracking-[0.3em] uppercase font-medium">
                    {content.badge}
                </div>

                <div className="max-w-5xl space-y-6">
                    <h1 className="font-heading font-bold text-white text-[42px] sm:text-[65px] md:text-[85px] leading-[1] tracking-tighter">
                        {content.headline.textNormal} <br /> 
                        <span className="text-[#0C8BD2] drop-shadow-[0_0_25px_rgba(12,139,210,0.5)]">
                            {content.headline.textAccent}
                        </span>
                    </h1>
                    
                    <p className="mx-auto max-w-2xl font-light text-white/70 text-lg sm:text-xl md:text-2xl leading-relaxed tracking-tight">
                        {content.subheadline}
                    </p>
                </div>

                <div className="mt-12 flex flex-col sm:flex-row items-center gap-6">
                    <a href={content.primaryCta.link} target="_blank" rel="noopener noreferrer">
                        <Button className="group h-16 px-12 text-white bg-[#0C8BD2] hover:bg-[#0C8BD2]/90 transition-all duration-500 rounded-full flex items-center gap-3 shadow-[0_0_40px_rgba(12,139,210,0.3)]">
                            <span className="text-lg font-semibold tracking-tight uppercase">
                                {content.primaryCta.text}
                            </span>
                            <MoveRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                        </Button>
                    </a>

                    <a href={content.secondaryCta.link}>
                        <Button variant="ghost" className="h-16 px-8 text-white/50 hover:text-white hover:bg-white/5 rounded-full flex items-center gap-2 transition-all">
                            <span className="text-sm font-medium uppercase tracking-widest">{content.secondaryCta.text}</span>
                            <ChevronDown className="w-4 h-4 animate-bounce" />
                        </Button>
                    </a>
                </div>
                
                <p className="mt-8 text-white/30 text-xs uppercase tracking-widest font-light">
                    {content.trustBadge}
                </p>
            </div>
        </section>
    );
}