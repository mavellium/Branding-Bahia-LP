"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import gsap from "gsap";

const ExploreDetails = () => {
  const [activeFeature, setActiveFeature] = useState(-1); // Iniciar com -1 para nenhum aberto
  const [isTransitioning, setIsTransitioning] = useState(false);
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const features = [
    {
      id: 1,
      title: "Chip M3",
      description: "O mais avançado chip para um computador pessoal, com CPU de até 16 núcleos e GPU de até 40 núcleos.",
      image: "/explore-bg.png",
      specs: ["CPU até 16 núcleos", "GPU até 40 núcleos", "Neural Engine de 16 núcleos", "Até 128GB de memória unificada"]
    },
    {
      id: 2,
      title: "Tela Liquid Retina XDR",
      description: "A melhor tela ever em um notebook. Com Extreme Dynamic Range e brilho máximo de 1.600 nits.",
      image: "/explore-bg.png",
      specs: ["14.2″ ou 16.2″", "Até 1.600 nits de pico", "ProMotion até 120Hz", "Resolução 3024x1964"]
    },
    {
      id: 3,
      title: "Bateria para o dia todo",
      description: "Até 22 horas de reprodução de vídeo. Energia suficiente para suas tarefas mais importantes.",
      image: "/explore-bg.png",
      specs: ["Até 22 horas de vídeo", "Carregamento rápido", "Gestão inteligente de energia", "Bateria de lítio"]
    },
    {
      id: 4,
      title: "Conectividade avançada",
      description: "Wi-Fi 6E, Thunderbolt 4, HDMI e MagSafe 3. Tudo que você precisa para conectar seus dispositivos.",
      image: "/explore-bg.png",
      specs: ["3 portas Thunderbolt 4", "Porta HDMI", "MagSafe 3", "Wi-Fi 6E", "Leitor SDXC"]
    },
    {
      id: 5,
      title: "Sistema de áudio",
      description: "Alto-falantes de alta fidelidade com suporte para áudio espacial. O som mais imersivo em um notebook.",
      image: "/explore-bg.png",
      specs: ["Sistema de alto-falantes", "Áudio espacial", "Gravação em estúdio", "Cancelamento ativo de ruído"]
    }
  ];

  const handleFeatureChange = (index: number) => {
    if (index === activeFeature || isTransitioning) return;
    
    setIsTransitioning(true);

    // Animação do botão anterior (recolher) - apenas se houver um botão ativo anteriormente
    if (activeFeature >= 0 && buttonsRef.current[activeFeature]) {
      gsap.to(buttonsRef.current[activeFeature], {
        scale: 1,
        height: "80px",
        duration: 1,
        ease: "back.out(1.2)"
      });
    }

    // Animação do novo botão ativo (expandir com bounce)
    if (buttonsRef.current[index]) {
      gsap.to(buttonsRef.current[index], {
        scale: 1.05,
        height: "auto",
        minHeight: "200px",
        duration: 1,
        ease: "back.out(1.7)"
      });
    }

    // Animação do conteúdo principal
    if (contentRef.current) {
      gsap.fromTo(contentRef.current, 
        { opacity: 0, scale: 0.95, y: 20 },
        { 
          opacity: 1, 
          scale: 1, 
          y: 0, 
          duration: 1,
          ease: "back.out(1.4)"
        }
      );
    }

    setTimeout(() => {
      setActiveFeature(index);
      setTimeout(() => setIsTransitioning(false), 50);
    }, 300);
  };

  const handleCloseFeature = () => {
    if (activeFeature === -1 || isTransitioning) return;
    
    setIsTransitioning(true);

    // Animação do botão ativo (recolher)
    if (buttonsRef.current[activeFeature]) {
      gsap.to(buttonsRef.current[activeFeature], {
        scale: 1,
        height: "80px",
        duration: 1,
        ease: "back.out(1.2)"
      });
    }

    // Animação do conteúdo principal para voltar ao estado inicial
    if (contentRef.current) {
      gsap.fromTo(contentRef.current, 
        { opacity: 1, scale: 1, y: 0 },
        { 
          opacity: 0, 
          scale: 0.95, 
          y: 20, 
          duration: 1,
          ease: "back.out(1.4)",
          onComplete: () => {
            setActiveFeature(-1);
            // Resetar a opacidade após a transição para mostrar a imagem padrão
            setTimeout(() => {
              if (contentRef.current) {
                gsap.set(contentRef.current, { opacity: 1, scale: 1, y: 0 });
              }
              setIsTransitioning(false);
            }, 50);
          }
        }
      );
    } else {
      setActiveFeature(-1);
      setTimeout(() => setIsTransitioning(false), 50);
    }
  };

  const handlePrevious = () => {
    if (features.length === 0) return;
    
    if (activeFeature === -1) {
      // Se nenhum está aberto, abre o último
      handleFeatureChange(features.length - 1);
    } else {
      const newIndex = activeFeature > 0 ? activeFeature - 1 : features.length - 1;
      handleFeatureChange(newIndex);
    }
  };

  const handleNext = () => {
    if (features.length === 0) return;
    
    if (activeFeature === -1) {
      // Se nenhum está aberto, abre o primeiro
      handleFeatureChange(0);
    } else {
      const newIndex = activeFeature < features.length - 1 ? activeFeature + 1 : 0;
      handleFeatureChange(newIndex);
    }
  };

  // Efeito hover nos botões com GSAP
  useEffect(() => {
    buttonsRef.current.forEach((button, index) => {
      if (button) {
        button.addEventListener('mouseenter', () => {
          if (index !== activeFeature) {
            gsap.to(button, {
              scale: 1.02,
              duration: 0.3,
              ease: "power2.out"
            });
          }
        });

        button.addEventListener('mouseleave', () => {
          if (index !== activeFeature) {
            gsap.to(button, {
              scale: 1,
              duration: 0.3,
              ease: "power2.out"
            });
          }
        });
      }
    });

    return () => {
      buttonsRef.current.forEach((button, index) => {
        if (button) {
          button.removeEventListener('mouseenter', () => {});
          button.removeEventListener('mouseleave', () => {});
        }
      });
    };
  }, [activeFeature]);

  return (
    <section className="common-padding bg-[#1D1D1F] py-20 px-60">
      <div className="screen-max-width">
        <div className="mb-7 w-full text-start">
          <h1 className="text-5xl font-bold text-white">
            Explore os detalhes.
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-center bg-black rounded-4xl p-10">
          {/* Container para setas e navegação lateral */}
          <div className="flex items-center gap-4 lg:w-1/4 w-full">
            {/* Setas de navegação em coluna */}
            <div className="flex flex-col gap-4 mt-2">
              <Button
                onClick={handlePrevious}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1E1E20] hover:bg-[#1E1E20]/50 transition-colors"
                aria-label="Item anterior"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </Button>
              
              <Button
                onClick={handleNext}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1E1E20] hover:bg-[#1E1E20]/50 transition-colors"
                aria-label="Próximo item"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Button>
            </div>

            {/* Navegação lateral */}
            <div className="flex-1">
              <div className="sticky top-24 space-y-4">
                {features.map((feature, index) => (
                  <button
                    key={feature.id}
                    ref={el => {buttonsRef.current[index] = el}}
                    className={`w-full text-left flex flex-col justify-start p-4 rounded-2xl transition-colors duration-300 ${
                      activeFeature === index
                        ? "bg-gray-800 border-l-4 border-blue-500"
                        : "bg-gray-800/50 hover:bg-gray-800"
                    }`}
                    onClick={() => handleFeatureChange(index)}
                    style={{ 
                      height: activeFeature === index ? 'auto' : '80px',
                      minHeight: activeFeature === index ? '200px' : 'auto'
                    }}
                  >
                    <h3 className={`font-semibold text-lg ${
                      activeFeature === index ? "hidden" : "text-white flex items-center justify-center"
                    }`}>
                      {feature.title}
                    </h3>
                    <p className={`text-sm text-white transition-all duration-300 ${
                      activeFeature === index ? "line-clamp-none" : "line-clamp-2 opacity-70 hidden"
                    }`}>
                      {feature.description}
                    </p>
                    
                    {/* Lista de especificações que aparece apenas quando ativo */}
                    {activeFeature === index && (
                      <ul className="mt-3 space-y-1">
                        {feature.specs.map((spec, specIndex) => (
                          <li key={specIndex} className="text-xs text-white">• {spec}</li>
                        ))}
                      </ul>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Conteúdo principal */}
          <div className="lg:w-3/4 w-full relative">
            {/* Botão X para fechar - aparece apenas quando um recurso está ativo */}
            {activeFeature >= 0 && (
              <Button
                onClick={handleCloseFeature}
                className="absolute top-2 right-2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-gray-800/80 hover:bg-gray-700 transition-colors"
                aria-label="Fechar detalhes"
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            )}
            
            <div 
              ref={contentRef}
              className="rounded-3xl overflow-hidden"
            >
              <div className="aspect-video relative bg-black">
                {/* Imagem com transição suave */}
                <div className="absolute inset-0">
                  <div className="w-full h-full">
                    <Image
                      src={activeFeature >= 0 ? features[activeFeature].image : "/explore-bg.png"}
                      alt={activeFeature >= 0 ? features[activeFeature].title : "Grafico de Dados"}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExploreDetails;