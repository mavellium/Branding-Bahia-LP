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
  const descriptionsRef = useRef<(HTMLDivElement | null)[]>([]);

  const features = [
    {
      id: 1,
      title: "Tráfego Pago",
      description: `Anúncios no Meta Ads (Facebook, Instagram e WhatsApp), Google Ads, LinkedIn Ads, TikTok Ads, Kwai Ads e Native Advertising.

      Desenvolvemos campanhas de mídia paga nas principais plataformas do mercado, como Google, Meta, TikTok, Kwai e muito mais, sempre focadas em gerar resultados reais para o seu negócio.`,
      image: "/explore-bg.png"
    },
    {
      id: 2,
      title: "Criação de conteúdo",
        description: `Criamos conteúdos alinhados às estratégias, capazes de atrair os clientes certos para o seu negócio e aumentar as vendas.

                      Produzimos textos, storytelling, vídeos curtos, infográficos, artes e outros formatos de conteúdo.`,
      image: "/explore-bg.png",
    },
    {
      id: 3,
      title: "Criação de sites",
      description: "Criamos a página ideal para o seu objetivo de negócio, de acordo com sua identidade visual e público-alvo.",
      image: "/explore-bg.png",
    },
    {
      id: 4,
      title: "WhatsApp Automatizado",
      description: `Automatizamos o atendimento da sua empresa com chatbots inteligentes para WhatsApp, Instagram, site e outras redes sociais.

Criamos soluções personalizadas com IA para responder mensagens, captar leads e integrar seus canais de comunicação, economizando tempo e aumentando resultados.`,
      image: "/explore-bg.png",
    },
    {
      id: 5,
      title: "CRM - Implantação e suporte",
      description: `Integramos o CRM aos canais de atendimento e automação, garantindo uma experiência de relacionamento centralizada, com dados unificados e gestão inteligente dos contatos.`,
      image: "/explore-bg.png",
    },
    {
      id: 6,
      title: "Otimização de SEO e GEO",
      description: `Fazemos sua marca aparecer no topo das buscas do Google e nas respostas das IAs generativas.

Usamos estratégias de SEO (Search Engine Optimization) e GEO (Generative Engine Optimization) para aumentar sua visibilidade tanto nos mecanismos de busca tradicionais quanto nas novas plataformas de Inteligência Artificial, como ChatGPT, Gemini, Copilot e Perplexity.`,
      image: "/explore-bg.png",
    },
    {
      id: 7,
      title: "BPM",
      description: `Mapeamos e otimizamos seus processos de venda para aumentar a produtividade e reduzir gargalos.

Aplicamos metodologias de BPM (Business Process Management) para redesenhar fluxos, integrar equipes e implementar rotinas eficientes.

Treinamos sua equipe para operar os novos processos com segurança e foco em resultados.`,
      image: "/explore-bg.png",
    }
  ];

  // CORREÇÃO: Função específica para mobile
  const handleMobileNavigation = (direction: 'previous' | 'next') => {
    if (isTransitioning) return;

    setIsTransitioning(true);

    let newIndex;
    if (direction === 'next') {
      newIndex = activeFeature === -1 ? 0 : (activeFeature + 1) % features.length;
    } else {
      newIndex = activeFeature === -1 ? features.length - 1 : (activeFeature - 1 + features.length) % features.length;
    }

    setActiveFeature(newIndex);

    // Simular transição sem GSAP no mobile
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  };

  const resetButtonToInactive = (index: number) => {
    if (buttonsRef.current[index]) {
      gsap.to(buttonsRef.current[index], {
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
  };

  const handleFeatureChange = (index: number) => {
    if (isTransitioning) return;

    // Se clicou no botão já ativo, fecha ele
    if (index === activeFeature) {
      setIsTransitioning(true);

      const tl = gsap.timeline({
        onComplete: () => {
          setActiveFeature(-1);
          setIsTransitioning(false);
        }
      });

      resetButtonToInactive(index);
      return;
    }

    // Se clicou em um botão diferente
    setIsTransitioning(true);

    const tl = gsap.timeline({
      onComplete: () => {
        setActiveFeature(index);
        setIsTransitioning(false);
      }
    });

    // Fechar botão ativo atual se houver
    if (activeFeature !== -1) {
      resetButtonToInactive(activeFeature);
    }

    // Abrir novo botão
    if (buttonsRef.current[index]) {
      tl.to(buttonsRef.current[index], {
        scale: 1.05,
        duration: 0.4,
        ease: "back.out(1.7)"
      }, 0.2);

      if (descriptionsRef.current[index]) {
        tl.to(descriptionsRef.current[index], {
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out"
        }, 0.3);
      }
    }
  };

  const handleCloseFeature = () => {
    if (activeFeature === -1 || isTransitioning) return;

    setIsTransitioning(true);
    resetButtonToInactive(activeFeature);

    const tl = gsap.timeline({
      onComplete: () => {
        setActiveFeature(-1);
        setIsTransitioning(false);
      }
    });
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

  // Inicialização
  useEffect(() => {
    buttonsRef.current.forEach((button, index) => {
      if (button) {
        gsap.set(button, { scale: 1 });
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

        {/* DESKTOP VERSION */}
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
              <div className="sticky top-24">
                <div className="flex-col space-y-4">
                  {features.map((feature, index) => (
                    <button
                      key={feature.id}
                      ref={(el) => { (buttonsRef.current[index] = el) }}
                      onClick={() => handleFeatureChange(index)}
                      className={`text-left flex flex-col transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${activeFeature === index
                          ? "bg-[#1E1E20] rounded-4xl p-6"
                          : "bg-[#1E1E20] hover:bg-[#1E1E20]/70 rounded-4xl px-5 py-4"
                        }`}
                      style={{
                        cursor: isTransitioning ? "not-allowed" : "pointer"
                      }}
                    >
                      <h3
                        ref={(el) => { (titlesRef.current[index] = el) }}
                        className="font-semibold lg:text-md md:text-sm text-white flex items-center justify-start text-start"
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
                            ? "opacity-100 max-h-[200px] max-w-[300px] mt-4"
                            : "opacity-0 max-h-0 max-w-0"
                          }`}
                      >
                        <p className="text-sm text-white mb-3 whitespace-pre-line">{feature.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
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

        {/* MOBILE/TABLET VERSION - CORRIGIDA */}
        <div className="lg:hidden bg-black rounded-4xl p-6">
          <div className="rounded-3xl overflow-hidden mb-6">
            <div className="aspect-video relative bg-black">
              <Image
                src={activeFeature >= 0 ? features[activeFeature].image : "/explore-bg.png"}
                alt={activeFeature >= 0 ? features[activeFeature].title : "Feature"}
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 mb-4">
            <Button
              onClick={() => handleMobileNavigation('previous')}
              disabled={isTransitioning}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-[#1E1E20] hover:bg-[#1E1E20]/80 transition-colors flex-shrink-0 disabled:opacity-50"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Button>

            <div className="flex-1 text-center min-h-[80px] flex items-center justify-center px-2">
              {activeFeature >= 0 ? (
                <div className="w-full">
                  <h3 className="font-semibold text-lg text-white mb-2">
                    {features[activeFeature].title}
                  </h3>
                  <p className="text-sm text-gray-300 mb-2">
                    {features[activeFeature].description}
                  </p>
                </div>
              ) : (
                <p className="text-gray-400">Toque nas setas para explorar</p>
              )}
            </div>

            <Button
              onClick={() => handleMobileNavigation('next')}
              disabled={isTransitioning}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-[#1E1E20] hover:bg-[#1E1E20]/80 transition-colors flex-shrink-0 disabled:opacity-50"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </div>

          <div className="flex justify-center mt-4 gap-2">
            {features.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (!isTransitioning) {
                    setActiveFeature(index);
                  }
                }}
                disabled={isTransitioning}
                className={`w-3 h-3 rounded-full transition-colors ${index === activeFeature ? "bg-white" : "bg-gray-600"
                  } ${isTransitioning ? "opacity-50" : "opacity-100"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExploreDetails;