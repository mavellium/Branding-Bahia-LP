'use client'
import Image from "next/image";
import { useState, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Registrar o plugin ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function About() {
    const [activeTab, setActiveTab] = useState(1);
    const sectionRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLHeadingElement>(null);
    const tabsRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const hasAnimatedRef = useRef(false);

    // Animação GSAP para a seção About - APENAS UMA VEZ
    useGSAP(() => {
        if (!sectionRef.current || hasAnimatedRef.current) return;

        // Animação do container principal
        if (containerRef.current) {
            gsap.fromTo(containerRef.current,
                {
                    opacity: 0,
                    y: 80,
                    scale: 0.95,
                },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 70%",
                        end: "bottom 20%",
                        toggleActions: "play none none none",
                        markers: false,
                        onEnter: () => {
                            hasAnimatedRef.current = true;
                        }
                    }
                }
            );
        }

        // Animação do título principal com stagger
        if (titleRef.current) {
            gsap.fromTo(titleRef.current,
                {
                    opacity: 0,
                    y: -30,
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    delay: 0.2,
                    ease: "back.out(1.4)",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 70%",
                        end: "bottom 20%",
                        toggleActions: "play none none none",
                        markers: false,
                    }
                }
            );
        }

        // Animação do subtítulo
        if (subtitleRef.current) {
            gsap.fromTo(subtitleRef.current,
                {
                    opacity: 0,
                    x: -30,
                },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.7,
                    delay: 0.3,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 70%",
                        end: "bottom 20%",
                        toggleActions: "play none none none",
                        markers: false,
                    }
                }
            );
        }

        // Animação dos botões de tab
        if (tabsRef.current) {
            const tabButtons = tabsRef.current.querySelectorAll('button');
            gsap.fromTo(tabButtons,
                {
                    opacity: 0,
                    y: 40,
                    scale: 0.8,
                },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.6,
                    stagger: 0.15,
                    delay: 0.4,
                    ease: "back.out(1.3)",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 70%",
                        end: "bottom 20%",
                        toggleActions: "play none none none",
                        markers: false,
                    }
                }
            );
        }

        // Animação do conteúdo das tabs
        if (contentRef.current) {
            gsap.fromTo(contentRef.current,
                {
                    opacity: 0,
                    y: 50,
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    delay: 0.6,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 70%",
                        end: "bottom 20%",
                        toggleActions: "play none none none",
                        markers: false,
                    }
                }
            );
        }

    }, { scope: sectionRef });

    // Animação para transição entre tabs
    const handleTabChange = (tabNumber: number) => {
        if (contentRef.current) {
            // Animação de saída
            gsap.to(contentRef.current, {
                opacity: 0,
                y: 20,
                duration: 0.3,
                ease: "power2.in",
                onComplete: () => {
                    setActiveTab(tabNumber);
                    // Animação de entrada
                    setTimeout(() => {
                        gsap.fromTo(contentRef.current,
                            {
                                opacity: 0,
                                y: -20,
                            },
                            {
                                opacity: 1,
                                y: 0,
                                duration: 0.4,
                                ease: "power2.out"
                            }
                        );
                    }, 50);
                }
            });
        } else {
            setActiveTab(tabNumber);
        }
    };

    return (
        <section 
            ref={sectionRef} 
            className="w-full px-4 sm:px-6 lg:px-10 bg-black"
        >
            <div 
                ref={containerRef}
                className="flex flex-col-reverse lg:flex-row p-4 sm:p-8 lg:p-10 gap-6 lg:gap-10 justify-center items-center opacity-0"
            >
                <div className="w-full max-w-[1000px] lg:max-w-[1200px] bg-[#1D1D1F] p-6 sm:p-10 lg:p-15 rounded-3xl lg:rounded-4xl">
                    <h2 
                        ref={subtitleRef}
                        className="font-bold text-sm sm:text-[15px] lg:text-[16px] text-white pb-2 opacity-0"
                    >
                        Quem está por trás
                    </h2>
                    <h1 
                        ref={titleRef}
                        className="font-bold text-2xl sm:text-3xl lg:text-4xl xl:text-[48px] text-white mb-6 lg:mb-10 opacity-0"
                    >
                        Marcos Ramos
                    </h1>

                    <div className="flex flex-col items-start justify-start w-full max-w-[700px]">
                        <div 
                            ref={tabsRef}
                            className="flex w-full mb-4 lg:mb-3"
                        >
                            {/* Botão 1 */}
                            <button
                                onClick={() => handleTabChange(1)}
                                className={`py-3 px-3 sm:px-3 lg:px-4 flex-1 rounded-l-lg font-bold cursor-pointer text-xs sm:text-sm lg:text-[16px] transition-all duration-300 opacity-0
                                    ${activeTab === 1
                                        ? 'text-white bg-[#2C2C2C]'
                                        : 'bg-[#040404] text-white hover:bg-[#040404]/30 hover:text-white'
                                    }`}
                                aria-label="Botão Fundador da Branding Bahia"
                            >
                                Fundador da Branding Bahia
                            </button>

                            {/* Botão 2 */}
                            <button
                                onClick={() => handleTabChange(2)}
                                className={`py-3 px-3 sm:px-3 lg:px-4 flex-1 rounded-r-lg font-bold cursor-pointer text-xs sm:text-sm lg:text-[16px] transition-all duration-300 opacity-0
                                    ${activeTab === 2
                                        ? 'text-white bg-[#2C2C2C]'
                                        : 'bg-[#040404] text-white hover:bg-[#040404]/30 hover:text-white'
                                    }`}
                                aria-label="Como eu gero renda para as pessoas"
                            >
                                Como eu gero renda para as pessoas
                            </button>
                        </div>

                        <div 
                            ref={contentRef}
                            className="bg-[#040404] p-4 sm:p-6 lg:p-8 rounded-lg w-full max-w-full lg:max-w-[700px] opacity-0"
                        >
                            {activeTab === 1 && (
                                <div className="text-[#F0F0F0] flex flex-col gap-3 sm:gap-4 lg:gap-5 min-h-[100px] sm:min-h-[120px] lg:min-h-[150px]">
                                    <span className="text-sm sm:text-base">Marcos criou a Agência Branding Bahia para ajudar empreendedores a venderem de forma prática e estratégica.</span>
                                    <span className="text-sm sm:text-base">A agência atua no estado da Bahia, com foco em tráfego pago, criação de campanhas de alta performance e estruturação de vendas para produtos físicos.</span>
                                </div>
                            )}

                            {activeTab === 2 && (
                                <div className="text-[#F0F0F0] flex flex-col gap-3 sm:gap-4 lg:gap-5 min-h-[100px] sm:min-h-[120px] lg:min-h-[150px]">
                                    <span className="text-sm sm:text-base">Consultor certificado oficialmente pelo Mercado Livre em vendas e estruturação de lojas na plataforma.</span>
                                    <span className="text-sm sm:text-base">Já ajudou dezenas de vendedores a crescerem no maior marketplace da América Latina, utilizando anúncios otimizados, posicionamento estratégico e técnicas práticas que aumentam visibilidade, tráfego e conversão.</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}