"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { Icon } from "@iconify/react";
import gsap from "gsap";

const ExploreDetails = () => {
  const [activeFeature, setActiveFeature] = useState(-1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const titlesRef = useRef<(HTMLHeadingElement | null)[]>([]);
  const descriptionsRef = useRef<(HTMLParagraphElement | null)[]>([]);

  const features = [
    {
      id: 1,
      title: "Chip M3",
      description: "O mais avançado chip para um computador pessoal...",
      image: "/explore-bg.png",
      specs: ["CPU até 16 núcleos", "GPU até 40 núcleos", "Neural Engine de 16 núcleos", "Até 128GB de memória"]
    },
    {
      id: 2,
      title: "Tela Liquid Retina XDR",
      description: "A melhor tela ever em um notebook...",
      image: "/explore-bg.png",
      specs: ["14.2″ ou 16.2″", "Até 1.600 nits", "ProMotion 120Hz", "Resolução 3024x1964"]
    },
    {
      id: 3,
      title: "Bateria para o dia todo",
      description: "Até 22 horas de reprodução de vídeo...",
      image: "/explore-bg.png",
      specs: ["Até 22 horas", "Carregamento rápido", "Gestão inteligente", "Bateria de lítio"]
    },
    {
      id: 4,
      title: "Conectividade avançada",
      description: "Wi-Fi 6E, Thunderbolt 4, HDMI e MagSafe 3...",
      image: "/explore-bg.png",
      specs: ["3x Thunderbolt 4", "HDMI", "MagSafe 3", "Wi-Fi 6E", "Leitor SDXC"]
    },
    {
      id: 5,
      title: "Sistema de áudio",
      description: "Alto-falantes com áudio espacial...",
      image: "/explore-bg.png",
      specs: ["Alto-falantes", "Áudio espacial", "Gravação pro", "Cancelamento de ruído"]
    }
  ];

  const resetAllButtons = () => {
    buttonsRef.current.forEach((button, index) => {
      if (button) {
        gsap.to(button, {
          height: "80px",
          minHeight: "80px",
          scale: 1,
          duration: 0.3,
          ease: "power2.out"
        });
      }

      if (titlesRef.current[index]) {
        gsap.to(titlesRef.current[index], {
          opacity: 1,
          scale: 1,
          duration: 0.3,
          ease: "power2.out"
        });
      }

      if (descriptionsRef.current[index]) {
        gsap.to(descriptionsRef.current[index], {
          opacity: 0,
          y: -10,
          duration: 0.2,
          ease: "power2.in"
        });
      }
    });
  };

  const handleFeatureChange = (index: number) => {
    if (index === activeFeature || isTransitioning) return;

    setIsTransitioning(true);
    resetAllButtons();

    const tl = gsap.timeline({
      onComplete: () => {
        setActiveFeature(index);
        setIsTransitioning(false);
      }
    });

    if (buttonsRef.current[index]) {
      if (titlesRef.current[index]) {
        tl.to(titlesRef.current[index], {
          opacity: 0,
          scale: 0.9,
          duration: 0.2,
          ease: "power2.in"
        }, 0);
      }

      tl.to(buttonsRef.current[index], {
        height: "auto",
        minHeight: "200px",
        duration: 0.4,
        ease: "back.out(1.7)"
      }, 0.1);

      tl.to(buttonsRef.current[index], {
        scale: 1.05,
        duration: 0.3,
        ease: "power2.out"
      }, 0.3);

      if (descriptionsRef.current[index]) {
        tl.to(descriptionsRef.current[index], {
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out"
        }, 0.4);
      }
    }
  };

  const handleCloseFeature = () => {
    if (activeFeature === -1 || isTransitioning) return;

    setIsTransitioning(true);
    gsap.timeline({
      onComplete: () => {
        setActiveFeature(-1);
        setIsTransitioning(false);
      }
    });
    resetAllButtons();
  };

  const handlePrevious = () => {
    const newIndex =
      activeFeature === -1
        ? features.length - 1
        : activeFeature > 0
          ? activeFeature - 1
          : features.length - 1;

    handleFeatureChange(newIndex);
  };

  const handleNext = () => {
    const newIndex =
      activeFeature === -1
        ? 0
        : activeFeature < features.length - 1
          ? activeFeature + 1
          : 0;

    handleFeatureChange(newIndex);
  };

  useEffect(() => {
    buttonsRef.current.forEach((_, index) => {
      if (titlesRef.current[index]) {
        gsap.set(titlesRef.current[index], { opacity: 1, scale: 1 });
      }
      if (descriptionsRef.current[index]) {
        gsap.set(descriptionsRef.current[index], {
          opacity: activeFeature === index ? 1 : 0,
          y: activeFeature === index ? 0 : 10
        });
      }
    });
  }, []);

  return (
    <section className="common-padding bg-[#1D1D1F] py-20 px-6 md:px-12 lg:px-10">
      <div className="screen-max-width">
        <h1 className="text-4xl lg:text-5xl font-bold text-white mb-10">
          Explore os detalhes.
        </h1>

        {/* DESKTOP ORIGINAL (setas para cima/baixo) */}
        <div className="hidden lg:flex flex-row gap-8 items-center bg-black rounded-4xl p-10">
          <div className="flex items-center gap-4 w-1/4">
            <div className="flex flex-col gap-4 mt-2">
              <Button
                onClick={handlePrevious}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1E1E20] hover:bg-[#1E1E20]/80 transition-colors"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </Button>

              <Button
                onClick={handleNext}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1E1E20] hover:bg-[#1E1E20]/80 transition-colors"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Button>
            </div>

            <div className="flex-1">
              <div className="sticky top-24 space-y-4">
                {features.map((feature, index) => (
                  <button
                    key={feature.id}
                    ref={(el) => { (buttonsRef.current[index] = el) }}
                    onClick={() => handleFeatureChange(index)}
                    className={`text-left justify-center flex flex-col transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${activeFeature === index
                        ? "bg-[#1E1E20] rounded-4xl p-6"
                        : "bg-[#1E1E20] hover:bg-[#1E1E20]/70 rounded-4xl px-5 py-4"
                      }`}
                  >
                    <h3
                      ref={(el) => { (titlesRef.current[index] = el) }}
                      className="font-semibold text-lg text-white flex items-center justify-start text-start"
                    >
                      {/* Ícone apenas para botões inativos */}
                      {activeFeature !== index && (
                        <Icon icon="solar:add-circle-linear" className="w-5 h-5 mr-2 flex-shrink-0" />
                      )}

                      {feature.title}
                    </h3>

                    <div
                      ref={(el) => { (descriptionsRef.current[index] = el) }}
                      className={`transition-all duration-500 overflow-hidden ${activeFeature === index
                          ? "opacity-100 max-h-[500px] mt-4"
                          : "opacity-0 max-h-0 max-w-0 transition-all duration-500"
                        }`}
                    >
                      <p className="text-sm text-white mb-3">{feature.description}</p>
                      <ul className="mt-3 space-y-1">
                        {feature.specs.map((spec, i) => (
                          <li key={i} className="text-xs text-white">• {spec}</li>
                        ))}
                      </ul>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="w-3/4 relative">
            {activeFeature >= 0 && (
              <Button
                onClick={handleCloseFeature}
                className="absolute top-2 right-2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-[#1E1E20] hover:bg-[#1E1E20]/70 transition-colors"
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            )}

            <div className="rounded-3xl overflow-hidden">
              <div className="aspect-video relative bg-black">
                <Image
                  src={activeFeature >= 0 ? features[activeFeature].image : "/explore-bg.png"}
                  alt="Feature"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* MOBILE/TABLET - Layout como na imagem (setas laterais com item no meio) */}
        <div className="lg:hidden bg-black rounded-4xl p-6">
          {/* Imagem */}
          <div className="rounded-3xl overflow-hidden mb-6">
            <div className="aspect-video relative bg-black">
              <Image
                src={activeFeature >= 0 ? features[activeFeature].image : "/explore-bg.png"}
                alt="Feature"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Navegação Mobile - Setas laterais com item no meio */}
          <div className="flex items-center justify-between gap-4">
            {/* Seta esquerda */}
            <Button
              onClick={handlePrevious}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-[#1E1E20] hover:bg-[#1E1E20]/80 transition-colors flex-shrink-0"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Button>

            {/* Item do meio - conteúdo do botão atual */}
            <div className="flex-1 text-center min-h-[60px] flex items-center justify-center">
              {activeFeature >= 0 ? (
                <div className="w-full">
                  <h3 className="font-semibold text-lg text-white mb-2">
                    {features[activeFeature].title}
                  </h3>
                  <p className="text-sm text-gray-300">
                    {features[activeFeature].description}
                  </p>
                </div>
              ) : (
                <p className="text-gray-400">Selecione um item</p>
              )}
            </div>

            {/* Seta direita */}
            <Button
              onClick={handleNext}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-[#1E1E20] hover:bg-[#1E1E20]/80 transition-colors flex-shrink-0"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </div>

          {/* Indicadores de posição (opcional) */}
          <div className="flex justify-center mt-4 gap-2">
            {features.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${index === activeFeature ? "bg-white" : "bg-gray-600"
                  }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExploreDetails;