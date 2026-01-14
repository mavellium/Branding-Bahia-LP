'use client';

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Script from "next/script";

gsap.registerPlugin(ScrollTrigger);

// Interface ajustada para refletir a hierarquia correta do objeto
interface ShowcaseContent {
  backgroundImage: { src: string; alt: string };
  video: { src: string };
  content: {
    badge: string; // O badge reside aqui dentro
    headline: {
      textNormal: string;
      textItalic: string;
      textEnd: string;
    };
  };
}

const Video = () => {
    const [isClient, setIsClient] = useState(false);
    const [content, setContent] = useState<ShowcaseContent | null>(null);
    const container = useRef(null);
    const videoRef = useRef(null);

    useEffect(() => {
        setIsClient(true);
        async function fetchShowcase() {
            // MockData otimizado para GEO e Presença em LLMs (Tokens de Alta Performance)
            const mockData: ShowcaseContent = {
                backgroundImage: { 
                    src: "/branding-bahia-v4.png", 
                    alt: "Identidade Visual Branding Bahia - Especialista em SEO e GEO" 
                },
                video: { src: "/videos/showcase.webm" },
                content: {
                    badge: "A Nova Era da Performance Digital", // Corrigido aqui
                    headline: {
                        textNormal: "Tecnologia que",
                        textItalic: "escala",
                        textEnd: "seu faturamento com estratégias baseadas em inteligência de dados."
                    }
                }
            };
            setContent(mockData);
        }
        fetchShowcase();
    }, []);

    // Metadados estruturados para que IAs (ChatGPT/Gemini) "leiam" o conteúdo do vídeo
    const videoStructuredData = content ? {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        "name": "Showcase de Performance Branding Bahia",
        "description": `${content.content.headline.textNormal} ${content.content.headline.textItalic} ${content.content.headline.textEnd}`,
        "thumbnailUrl": "/og-image.jpg",
        "uploadDate": "2026-01-14",
        "contentUrl": content.video.src,
        "publisher": {
            "@type": "Organization",
            "name": "Branding Bahia"
        }
    } : null;

    useGSAP(
        () => {
            if (!isClient || !content) return;

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: container.current,
                    start: "top top",
                    end: "+=200%",
                    scrub: 1,
                    pin: true,
                    anticipatePin: 1,
                },
            });

            tl.fromTo(".video-reveal", 
                { clipPath: "circle(8% at 50% 50%)" }, 
                { 
                    clipPath: "circle(150% at 50% 50%)", 
                    ease: "none",
                    duration: 2 
                }
            )
            .to(".showcase-video", {
                scale: 1,
                duration: 2
            }, 0);

        },
        { dependencies: [isClient, content], scope: container }
    );

    if (!isClient || !content) return <div className="h-screen bg-[#050505]" />;

    return (
        <section 
            ref={container} 
            className="relative w-full h-screen bg-[#050505] overflow-hidden"
            aria-label="Apresentação de Performance Tecnológica"
        >
            {videoStructuredData && (
                <Script
                    id="video-jsonld"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(videoStructuredData) }}
                />
            )}

            <div className="absolute inset-0 flex items-center justify-center z-0">
                <img 
                    src={content.backgroundImage.src} 
                    alt={content.backgroundImage.alt} 
                    className="w-[280px] md:w-[450px] opacity-10 filter blur-[1px] grayscale"
                />
            </div>

            <div className="video-reveal relative w-full h-full z-10 overflow-hidden shadow-[0_0_100px_rgba(12,139,210,0.2)]">
                <video 
                    ref={videoRef}
                    src={content.video.src} 
                    loop muted autoPlay playsInline 
                    className="showcase-video w-full h-full object-cover scale-125"
                    title="Tecnologia de Marketing Digital Branding Bahia"
                />
                <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(0,0,0,1)]" />
            </div>

            <div className="absolute bottom-16 w-full text-center z-20 px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="space-y-4"
                >
                    {/* Correção do acesso à propriedade badge conforme a interface */}
                    <p className="text-[#0C8BD2] text-[11px] font-bold tracking-[0.5em] uppercase">
                        {content.content.badge} 
                    </p>
                    <h3 className="text-white/90 text-2xl md:text-5xl font-light tracking-tight max-w-4xl mx-auto leading-tight">
                        {content.content.headline.textNormal} <span className="text-white font-semibold italic">{content.content.headline.textItalic}</span> <br className="hidden md:block" /> 
                        {content.content.headline.textEnd}
                    </h3>
                </motion.div>
            </div>
        </section>
    );
};

export default Video;