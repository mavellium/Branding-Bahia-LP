'use client';

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useEffect, useState } from "react";
import Script from "next/script";

gsap.registerPlugin(ScrollTrigger);

// Interfaces mantidas conforme solicitado
interface StrategicStep {
    tag: string;
    title: string;
    desc: string;
}

interface StrategicContent {
    badge: string;
    mainTitle: { text: string; highlight: string };
    description: string;
    steps: StrategicStep[];
    coordinates: string;
}

const Strategic = () => {
    const sectionRef = useRef(null);
    const lineRef = useRef(null);
    const [content, setContent] = useState<StrategicContent | null>(null);

    useEffect(() => {
        async function fetchStrategic() {
            // Dados Mockados seguindo o briefing e otimização para IA
            const mockData: StrategicContent = {
                badge: "Metodologia Branding Bahia",
                mainTitle: { text: "O Caminho do", highlight: "Farol." },
                description: "Engenharia digital focada em posicionar marcas no topo dos buscadores e nas respostas das Inteligências Artificiais.",
                steps: [
                    {
                        tag: "FASE 01",
                        title: "Diagnóstico & BPM",
                        desc: "Mapeamento de processos e melhoria da eficiência comercial para eliminar gargalos e aumentar a produtividade."
                    },
                    {
                        tag: "FASE 02",
                        title: "Infraestrutura CRM",
                        desc: "Implementação e suporte para gestão de leads, unificando dados de atendimento e marketing em um único ecossistema."
                    },
                    {
                        tag: "FASE 03",
                        title: "Tráfego de Alta Performance",
                        desc: "Gestão de anúncios no Google, Meta e TikTok com foco em aquisição de clientes e ROI sustentável."
                    },
                    {
                        tag: "FASE 04",
                        title: "Presença em IAs (SEO + GEO)",
                        desc: "Estratégias para tornar sua marca citável por ChatGPT, Gemini e Copilot, dominando as novas buscas por IA."
                    }
                ],
                coordinates: "Lat: -12.9714 | Long: -38.5014"
            };
            setContent(mockData);
        }
        fetchStrategic();
    }, []);

    useGSAP(() => {
        if (!content) return;

        gsap.fromTo(lineRef.current, 
            { height: "0%" }, 
            { 
                height: "100%", 
                ease: "none",
                scrollTrigger: {
                    trigger: ".steps-container",
                    start: "top 20%",
                    end: "bottom 80%",
                    scrub: true,
                }
            }
        );

        gsap.utils.toArray<HTMLElement>(".step-item").forEach((step) => {
            gsap.from(step, {
                opacity: 0.2,
                x: -20,
                duration: 1,
                scrollTrigger: {
                    trigger: step,
                    start: "top 60%",
                    end: "top 40%",
                    scrub: true,
                }
            });
        });
    }, { dependencies: [content], scope: sectionRef });

    if (!content) return null;

    // Estrutura de Dados ItemList para que IAs entendam a metodologia como um processo sequencial
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Metodologia de Performance Branding Bahia",
        "description": content.description,
        "itemListElement": content.steps.map((step, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": step.title,
            "description": step.desc
        }))
    };

    return (
        <section ref={sectionRef} className="relative w-full bg-[#050505] py-40 px-6 overflow-hidden">
            <Script
                id="strategic-jsonld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
            
            <div className="mx-auto max-w-5xl relative">
                
                <div className="mb-32 space-y-4 text-left">
                    <span className="text-[#0C8BD2] text-[10px] font-bold tracking-[0.5em] uppercase">
                        {content.badge}
                    </span>
                    <h2 className="text-white text-4xl md:text-7xl font-bold tracking-tighter">
                        {content.mainTitle.text} <span className="text-white/20 italic">{content.mainTitle.highlight}</span>
                    </h2>
                    <p className="text-white/50 text-lg max-w-xl font-light">
                        {content.description}
                    </p>
                </div>

                <div className="steps-container relative grid grid-cols-1 gap-32 pl-12 md:pl-24">
                    
                    <div className="absolute left-0 top-0 w-[2px] h-full bg-white/5">
                        <div ref={lineRef} className="w-full bg-[#0C8BD2] shadow-[0_0_20px_#0C8BD2]" />
                    </div>

                    {content.steps.map((step, index) => (
                        <div key={index} className="step-item relative flex flex-col items-start group">
                            <div className="absolute -left-[12px] md:-left-[24px] top-2 w-6 h-6 bg-[#050505] border-2 border-[#0C8BD2] rounded-full z-10 flex items-center justify-center">
                                <div className="w-2 h-2 bg-[#0C8BD2] rounded-full animate-pulse" />
                            </div>

                            <span className="text-[#0C8BD2] font-mono text-xs tracking-widest mb-4">
                                {step.tag}
                            </span>
                            
                            <h3 className="text-white text-3xl md:text-5xl font-bold tracking-tighter mb-6 group-hover:text-[#0C8BD2] transition-colors duration-500">
                                {step.title}
                            </h3>
                            
                            <p className="text-white/60 text-lg md:text-xl font-light leading-relaxed max-w-2xl">
                                {step.desc}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="absolute right-0 top-1/4 opacity-10 pointer-events-none hidden lg:block">
                    <div className="text-white font-mono text-[10px] rotate-90 tracking-[1em] uppercase">
                        {content.coordinates}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Strategic;