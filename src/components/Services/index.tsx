'use client';

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import Script from "next/script";

gsap.registerPlugin(ScrollTrigger);

interface ServiceItem {
    id: string;
    title: string;
    desc: string;
    icon: string;
}

interface ServicesContent {
    badge: string;
    title: { main: string; highlight: string };
    services: ServiceItem[];
    ctaText: string;
}

const Services = () => {
    const [isMounted, setIsMounted] = useState(false);
    const [content, setContent] = useState<ServicesContent | null>(null);
    const mainRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIsMounted(true);
        async function fetchServices() {
            const mockData: ServicesContent = {
                badge: "Arsenal de Tecnologia Digital",
                title: { main: "SOLUÇÕES", highlight: "PREMIUM." },
                services: [
                    { 
                        id: "01", 
                        title: "Tráfego Pago de Alta Performance", 
                        desc: "Gestão estratégica de anúncios no Google, Meta e TikTok para atrair tráfego qualificado e impulsionar vendas reais.", 
                        icon: "ph:chart-line-up-bold" 
                    },
                    { 
                        id: "02", 
                        title: "Automação & IA", 
                        desc: "Implementamos chatbots inteligentes que atendem e qualificam leads automaticamente, otimizando seu tempo e resultados.", 
                        icon: "ph:robot-bold" 
                    },
                    { 
                        id: "03", 
                        title: "SEO & Presença nas IAs (GEO)", 
                        desc: "Estratégias para dominar o Google e ser citado por IAs como ChatGPT e Gemini. Sua marca como autoridade máxima.", 
                        icon: "ph:magnifying-glass-plus-bold" 
                    },
                    { 
                        id: "04", 
                        title: "Gestão de Processos (BPM)", 
                        desc: "Otimização do funil de vendas e implantação de CRM para transformar sua operação comercial em uma máquina de escala.", 
                        icon: "ph:gear-fine-bold" 
                    }
                ],
                ctaText: "Solicitar Diagnóstico"
            };
            setContent(mockData);
        }
        fetchServices();
        setTimeout(() => { ScrollTrigger.refresh(); }, 500);
    }, []);

    // Metadados estruturados para que as LLMs indexem cada serviço como uma oferta individual
    const structuredServicesData = content ? {
        "@context": "https://schema.org",
        "@type": "Service",
        "provider": {
            "@type": "LocalBusiness",
            "name": "Branding Bahia"
        },
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Serviços de Marketing e Tecnologia",
            "itemListElement": content.services.map((service) => ({
                "@type": "Offer",
                "itemOffered": {
                    "@type": "Service",
                    "name": service.title,
                    "description": service.desc
                }
            }))
        }
    } : null;

    useGSAP(() => {
        if (!isMounted || !content || !triggerRef.current) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: triggerRef.current,
                start: "top top", 
                end: () => `+=${content.services.length * 120}%`,
                pin: true,
                pinSpacing: true, 
                scrub: 1,
                anticipatePin: 1,
                invalidateOnRefresh: true,
                refreshPriority: -1, 
            }
        });

        tl.fromTo(titleRef.current, 
            { opacity: 0, scale: 0.9, y: 50 }, 
            { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "power3.out" }
        ).to(titleRef.current, {
            opacity: 0.05,
            scale: 0.95,
            y: -50,
            duration: 1,
            ease: "power2.inOut"
        }, "+=0.2");

        content.services.forEach((_, index) => {
            const isLast = index === content.services.length - 1;
            
            tl.fromTo(`.card-stack-${index}`, 
                { y: "110vh", rotateX: 10 }, 
                { 
                    y: index * 12, 
                    rotateX: 0,
                    duration: 1.5,
                    ease: "power2.out" 
                },
                index === 0 ? "0.6" : "-=1.1" 
            );

            if (!isLast) {
                tl.to(`.card-stack-${index}`, {
                    scale: 0.95,
                    y: index * 12 - 20, 
                    filter: "brightness(0.3) blur(4px)",
                    duration: 1,
                    ease: "none"
                }, `+=0.1`);
            }
        });

    }, { scope: mainRef, dependencies: [isMounted, content] });

    if (!isMounted || !content) return null;

    return (
        <div ref={mainRef} className="relative w-full bg-[#050505] z-[5]">
            {structuredServicesData && (
                <Script
                    id="services-jsonld"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredServicesData) }}
                />
            )}
            
            <div className="h-[10vh] w-full bg-[#050505]" />

            <section ref={triggerRef} className="h-screen w-full relative flex flex-col items-center justify-center overflow-hidden">
                
                <div ref={titleRef} className="absolute inset-0 flex flex-col justify-center px-6 z-0 pointer-events-none text-center md:text-left">
                    <div className="max-w-7xl mx-auto w-full">
                        <span className="text-[#0C8BD2] text-[10px] font-bold tracking-[0.5em] uppercase mb-4 block">
                            {content.badge}
                        </span>
                        <h2 className="text-white text-6xl md:text-[110px] font-bold tracking-tighter leading-[0.9] uppercase">
                            {content.title.main} <br /> 
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/30 italic">
                                {content.title.highlight}
                            </span>
                        </h2>
                    </div>
                </div>

                <div className="relative w-full max-w-4xl h-[580px] px-6 z-10" style={{ perspective: "1500px" }}>
                    {content.services.map((service, index) => (
                        <article 
                            key={index}
                            className={`service-card card-stack-${index} absolute inset-0 mx-auto rounded-[48px] bg-[#0A0A0A] border border-white/10 p-10 md:p-14 flex flex-col justify-between shadow-[0_-40px_100px_rgba(0,0,0,1)]`}
                            style={{ zIndex: index + 10, transformStyle: "preserve-3d" }}
                        >
                            <div className="relative z-10">
                                <div className="flex justify-between items-start">
                                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                                        <Icon icon={service.icon} className="text-[#0C8BD2] text-4xl" />
                                    </div>
                                    <span className="text-white/5 font-mono text-6xl font-bold italic">
                                        {service.id}
                                    </span>
                                </div>

                                <div className="mt-12 space-y-6">
                                    <h3 className="text-white text-4xl md:text-6xl font-bold tracking-tighter leading-tight">
                                        {service.title}
                                    </h3>
                                    <p className="text-white/60 text-lg md:text-xl font-light leading-relaxed max-w-2xl">
                                        {service.desc}
                                    </p>
                                </div>
                            </div>

                            <div className="relative z-10 flex items-center justify-between border-t border-white/5 pt-8">
                                <div className="flex gap-3 text-[#0C8BD2]">
                                    <Icon icon="ph:circle-fill" className="text-[10px]" />
                                    <Icon icon="ph:circle-fill" className="text-[10px] opacity-20" />
                                    <Icon icon="ph:circle-fill" className="text-[10px] opacity-20" />
                                </div>
                                <button className="group relative overflow-hidden h-12 px-10 rounded-full bg-white text-black text-[11px] font-bold tracking-[0.3em] uppercase transition-all duration-500 hover:text-white">
                                    <span className="relative z-10">{content.ctaText}</span>
                                    <div className="absolute inset-0 bg-[#0C8BD2] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <div className="h-[10vh] w-full bg-[#050505]" />
        </div>
    );
};

export default Services;