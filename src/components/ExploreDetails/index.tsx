"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { Icon } from "@iconify/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Registrar o plugin ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Feature {
  id: string;
  title: string;
  description: string;
  image: string;
}

interface ApiResponse {
  id: string;
  type: string;
  values: Feature[];
  createdAt: string;
}

const ExploreDetails = () => {
  const [activeFeature, setActiveFeature] = useState(-1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const titlesRef = useRef<(HTMLHeadingElement | null)[]>([]);
  const descriptionsRef = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);
  const buttonsContainerRef = useRef<HTMLDivElement>(null);
  const navigationButtonsRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const mobileTextContainerRef = useRef<HTMLDivElement>(null);

  // Buscar dados da API
  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/details');
        
        if (!response.ok) {
          throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }
        
        const data: ApiResponse[] = await response.json();
        
        // Transformar os dados da API para o formato esperado pelo componente
        const formattedFeatures: Feature[] = data.flatMap((item: ApiResponse) => 
          item.values.map((value, index) => ({
            id: `${item.id}-${index}`,
            title: value.title,
            description: value.description,
            image: value.image
          }))
        );

        setFeatures(formattedFeatures);
        setError(null);
      } catch (err) {
        console.error('Erro ao buscar dados dos detalhes:', err);
        setError('Erro ao carregar os detalhes. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchFeatures();
  }, []);

  // Funções para mostrar e esconder botões de navegação
  const showNavigationButtons = () => {
    if (navigationButtonsRef.current) {
      gsap.to(navigationButtonsRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  };

  const hideNavigationButtons = () => {
    if (navigationButtonsRef.current) {
      gsap.to(navigationButtonsRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  };

  // Funções para mostrar e esconder botão de fechar
  const showCloseButton = () => {
    if (closeButtonRef.current) {
      gsap.to(closeButtonRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  };

  const hideCloseButton = () => {
    if (closeButtonRef.current) {
      gsap.to(closeButtonRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  };

  // Animação de entrada sequencial partindo do meio
  useEffect(() => {
    if (!buttonsContainerRef.current || features.length === 0) return;

    const buttons = buttonsContainerRef.current.querySelectorAll('.feature-button');
    const middleIndex = Math.floor(buttons.length / 2);
    
    // Configurar estado inicial de todos os botões
    gsap.set(buttons, {
      opacity: 0,
      scale: 0.8
    });

    // Configurar estado inicial dos botões de navegação e fechar
    if (navigationButtonsRef.current) {
      gsap.set(navigationButtonsRef.current, {
        opacity: 0
      });
    }
    if (closeButtonRef.current) {
      gsap.set(closeButtonRef.current, {
        opacity: 0
      });
    }

    // Criar animação sequencial com ScrollTrigger
    const animation = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 70%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
        markers: false,
      }
    });

    // 1. Primeiro: animar o botão do meio vindo da esquerda
    animation.fromTo(buttons[middleIndex], 
      {
        x: -50,
        opacity: 0,
        scale: 0.8
      },
      {
        x: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: "power2.out"
      }
    );

    // 2. Segundo: animar simultaneamente TODOS os botões acima e abaixo do meio
    const otherButtons = [];
    
    for (let i = 0; i < buttons.length; i++) {
      if (i !== middleIndex) {
        otherButtons.push(buttons[i]);
      }
    }

    // Animar todos os outros botões simultaneamente
    animation.fromTo(otherButtons,
      {
        opacity: 0,
        scale: 0.5
      },
      {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        stagger: 0.05,
        ease: "back.out(1.5)"
      },
      "-=0.3"
    );

    // Cleanup
    return () => {
      animation.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [features.length]);

  // Função para animação do texto no mobile
  const animateMobileTextTransition = (newIndex: number) => {
    if (!mobileTextContainerRef.current) return;

    const tl = gsap.timeline({
      onComplete: () => {
        setActiveFeature(newIndex);
        // Animação de entrada
        gsap.fromTo(mobileTextContainerRef.current, 
          {
            opacity: 0,
            y: 20
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: "power2.out",
            onComplete: () => {
              setIsTransitioning(false);
            }
          }
        );
      }
    });

    // Animação de saída
    tl.to(mobileTextContainerRef.current, {
      opacity: 0,
      y: -20,
      duration: 0.3,
      ease: "power2.in"
    });
  };

  // Função específica para mobile
  const handleMobileNavigation = (direction: 'previous' | 'next') => {
    if (isTransitioning || features.length === 0) return;

    setIsTransitioning(true);

    let newIndex;
    if (direction === 'next') {
      newIndex = activeFeature === -1 ? 0 : (activeFeature + 1) % features.length;
    } else {
      newIndex = activeFeature === -1 ? features.length - 1 : (activeFeature - 1 + features.length) % features.length;
    }

    animateMobileTextTransition(newIndex);
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
    if (isTransitioning || features.length === 0) return;

    // Se já está ativo, não faz nada
    if (index === activeFeature) {
      return;
    }

    // Se clicou em um botão diferente
    setIsTransitioning(true);

    const tl = gsap.timeline({
      onComplete: () => {
        setActiveFeature(index);
        setIsTransitioning(false);
        // Mostrar botões de navegação e fechar quando um botão estiver ativo
        showNavigationButtons();
        showCloseButton();
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
        duration: 0.3,
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
    if (activeFeature === -1 || isTransitioning || features.length === 0) return;

    setIsTransitioning(true);
    resetButtonToInactive(activeFeature);

    const tl = gsap.timeline({
      onComplete: () => {
        setActiveFeature(-1);
        setIsTransitioning(false);
        // Esconder botões de navegação e fechar quando fechar o botão ativo
        hideNavigationButtons();
        hideCloseButton();
      }
    });
  };

  const handlePrevious = () => {
    if (features.length === 0) return;

    const newIndex =
      activeFeature === -1
        ? features.length - 1
        : activeFeature > 0
          ? activeFeature - 1
          : features.length - 1;

    handleFeatureChange(newIndex);
  };

  const handleNext = () => {
    if (features.length === 0) return;

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
  }, [features.length]);

  // Estados de loading e error
  if (loading) {
    return (
      <section className="common-padding bg-[#1D1D1F] py-20 px-6 md:px-12 lg:px-10">
        <div className="mx-auto relative max-w-[1520px]">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-10">
            Explore nossas soluções
          </h1>
          <div className="text-white text-center py-10">Carregando detalhes...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="common-padding bg-[#1D1D1F] py-20 px-6 md:px-12 lg:px-10">
        <div className="mx-auto relative max-w-[1520px]">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-10">
            Explore nossas soluções
          </h1>
          <div className="text-red-500 text-center mb-4">{error}</div>
          <div className="text-center">
            <Button 
              onClick={() => window.location.reload()}
              className="bg-[#0C8BD2] hover:bg-[#0C8BD2]/80"
            >
              Tentar Novamente
            </Button>
          </div>
        </div>
      </section>
    );
  }

  if (features.length === 0) {
    return (
      <section className="common-padding bg-[#1D1D1F] py-20 px-6 md:px-12 lg:px-10">
        <div className="mx-auto relative max-w-[1520px]">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-10">
            Explore nossas soluções
          </h1>
          <div className="text-white text-center py-10">Nenhum detalhe encontrado.</div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="common-padding bg-[#1D1D1F] py-20 px-6 md:px-12 lg:px-10">
      <div className="mx-auto relative max-w-[1520px]">
        <h1 className="text-4xl lg:text-5xl font-bold text-white mb-10">
          Explore nossas soluções
        </h1>

        {/* DESKTOP VERSION */}
        <div className="hidden lg:flex flex-row gap-8 items-center bg-black rounded-4xl p-10">
          <div className="flex items-center gap-4 w-1/4">
            <div ref={navigationButtonsRef} className="flex flex-col gap-4 mt-2 opacity-0">
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
                <div ref={buttonsContainerRef} className="flex-col space-y-4">
                  {features.map((feature, index) => (
                    <button
                      key={feature.id}
                      ref={(el) => { (buttonsRef.current[index] = el) }}
                      onClick={() => handleFeatureChange(index)}
                      className={`feature-button text-left flex flex-col transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] ${activeFeature === index
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
                        className={`transition-all duration-400 overflow-hidden ${activeFeature === index
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
            <Button
              ref={closeButtonRef}
              onClick={handleCloseFeature}
              className="absolute top-2 right-2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-[#1E1E20] hover:bg-[#1E1E20]/70 transition-colors opacity-0"
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>

            <div className="rounded-3xl overflow-hidden">
              <div className="aspect-video relative bg-black">
                <Image
                  src={activeFeature >= 0 ? features[activeFeature].image : "/explore-bg.png"}
                  alt={activeFeature >= 0 ? features[activeFeature].title : "Feature"}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    // Fallback para imagem quebrada
                    const target = e.target as HTMLImageElement;
                    target.src = "/explore-bg.png";
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* MOBILE/TABLET VERSION - COM ANIMAÇÃO DE TEXTO */}
        <div className="lg:hidden bg-black rounded-4xl p-6">
          <div className="rounded-3xl overflow-hidden mb-6">
            <div className="aspect-video relative bg-black">
              <Image
                src={activeFeature >= 0 ? features[activeFeature].image : "/explore-bg.png"}
                alt={activeFeature >= 0 ? features[activeFeature].title : "Feature"}
                fill
                className="object-cover"
                unoptimized
                onError={(e) => {
                  // Fallback para imagem quebrada
                  const target = e.target as HTMLImageElement;
                  target.src = "/explore-bg.png";
                }}
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

            <div 
              ref={mobileTextContainerRef}
              className="flex-1 text-center min-h-[80px] flex items-center justify-center px-2"
            >
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
                    setIsTransitioning(true);
                    animateMobileTextTransition(index);
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