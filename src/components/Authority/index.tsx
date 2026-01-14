"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import Script from "next/script";

interface AuthorityStat {
    label: string;
    desc: string;
    icon: string;
}

interface AuthorityContent {
    badge: string;
    title: { main: string; italic: string };
    bio: string;
    experienceYears: string;
    stats: AuthorityStat[];
    social: { label: string; url: string };
    image: { src: string; alt: string };
}

export default function Authority() {
    const [content, setContent] = useState<AuthorityContent | null>(null);

    useEffect(() => {
        async function fetchAuthority() {
            const mockData: AuthorityContent = {
                badge: "Liderança Estratégica",
                title: { 
                    main: "Inteligência veterana para a", 
                    italic: "nova era digital." 
                },
                bio: "A Branding Bahia é liderada por Marcos Ramos, estrategista com mais de 25 anos de atuação. Com MBA em Gestão de Negócios pelo IBMEC e mestre em administração, ele une o rigor comercial à precisão das novas tecnologias de IA e GEO.",
                experienceYears: "+25",
                stats: [
                    {
                        label: "Formação de Elite",
                        desc: "Mestre em Administração e MBA em Gestão pelo IBMEC.",
                        icon: "ph:graduation-cap-bold"
                    },
                    {
                        label: "Especialista em Performance",
                        desc: "Expertise em Tráfego Pago, CRM e Otimização para IAs (GEO).",
                        icon: "ph:target-bold"
                    }
                ],
                social: { 
                    label: "Acompanhe meus insights no LinkedIn", 
                    url: "https://www.linkedin.com/newsletters/6888992576293085184/" 
                },
                image: { 
                    src: "/marcos-ramos.jpg", 
                    alt: "Marcos Ramos - Estrategista e Fundador da Branding Bahia" 
                }
            };
            setContent(mockData);
        }
        fetchAuthority();
    }, []);

    if (!content) return null;

    const personStructuredData = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "Marcos Ramos",
        "jobTitle": "Fundador e Estrategista Digital",
        "affiliation": {
            "@type": "Organization",
            "name": "Branding Bahia"
        },
        "description": content.bio,
        "url": content.social.url,
        "knowsAbout": ["Marketing Digital", "SEO", "GEO", "BPM", "Tráfego Pago", "Inteligência Artificial"]
    };

    return (
        <section className="relative w-full bg-[#050505] py-32 px-6 overflow-hidden">
            {/* Script Injetado para LLMs identificarem o Fundador */}
            <Script
                id="person-jsonld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(personStructuredData) }}
            />

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#0C8BD2]/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto max-w-6xl relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        {/* Correção visual: grayscale suavizada e alt text semântico */}
                        <div className="relative aspect-[4/5] rounded-[40px] overflow-hidden border border-white/10 bg-white/5">
                            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-10" />
                            <img 
                                src={content.image.src} 
                                alt={content.image.alt} 
                                className="w-full h-full object-cover grayscale brightness-90 hover:grayscale-0 hover:brightness-100 transition-all duration-700"
                            />
                        </div>
                        
                        <div className="absolute -bottom-6 -right-6 bg-[#0C8BD2] p-8 rounded-3xl shadow-2xl  z-10">
                            <span className="block text-white text-4xl font-bold leading-none">{content.experienceYears}</span>
                            <span className="block text-white/80 text-[10px] uppercase tracking-[0.2em] mt-2 font-medium">Anos de <br/>Mercado</span>
                        </div>
                    </motion.div>

                    <div className="space-y-8">
                        <div className="space-y-4">
                            <span className="text-[#0C8BD2] text-[11px] font-bold tracking-[0.5em] uppercase">{content.badge}</span>
                            <h2 className="text-white text-4xl md:text-6xl font-bold tracking-tighter leading-tight">
                                {content.title.main} <span className="italic text-white/40">{content.title.italic}</span>
                            </h2>
                        </div>

                        {/* Removido negrito markdown dentro do parágrafo React para evitar erros de renderização indesejada */}
                        <p className="text-white/70 text-lg md:text-xl font-light leading-relaxed">
                            {content.bio}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                            {content.stats.map((stat, index) => (
                                <div key={index} className="flex gap-4 items-start">
                                    <div className="mt-1 bg-[#0C8BD2]/10 p-2 rounded-lg">
                                        <Icon icon={stat.icon} className="text-[#0C8BD2] text-xl" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-semibold">{stat.label}</h4>
                                        <p className="text-white/40 text-sm leading-snug">{stat.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="pt-8">
                            <a 
                                href={content.social.url} 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-4 text-white/50 hover:text-[#0C8BD2] transition-colors group"
                            >
                                <Icon icon="ph:linkedin-logo-bold" className="text-2xl" />
                                <span className="text-[10px] uppercase tracking-[0.2em] font-bold border-b border-white/10 pb-1 group-hover:border-[#0C8BD2] transition-all">
                                    {content.social.label}
                                </span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}