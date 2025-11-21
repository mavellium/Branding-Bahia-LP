"use client";

import { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Navigation } from "swiper/modules";
import { Button } from "@/components/ui/button";
import { Icon } from '@iconify/react';
import { ChevronRight } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Registrar o plugin ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";

export function News() {
  const originalSlides = [
    {
      name: "Como aparecer na busca orgânica do Google:",
      role: "SEO - Otimização dos mecanismos de pesquisa",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      fallback: "DC",
      content: "Leia aqui"
    },
    {
      name: "Como aparecer na busca orgânica do Google:",
      role: "SEO - Otimização dos mecanismos de pesquisa",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      fallback: "DC",
      content: "Leia aqui"
    },
    {
      name: "Como aparecer na busca orgânica do Google:",
      role: "SEO - Otimização dos mecanismos de pesquisa",
      avatar: "https://randomuser.me/api/portraits/men/44.jpg",
      fallback: "DZ",
      content: "Leia aqui"
    },
  ];

  // Duplicar os slides para garantir que o loop funcione
  const slides = [...originalSlides, ...originalSlides, ...originalSlides];

  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<any>(null);
  const navigationPrevRef = useRef<HTMLButtonElement>(null);
  const navigationNextRef = useRef<HTMLButtonElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const textContentRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const hasAnimatedRef = useRef(false);

  // Calcular o índice real baseado nos slides originais
  const getRealIndex = (index: number) => {
    return index % originalSlides.length;
  };

  const goToNext = () => {
    if (!swiperRef.current) return;
    swiperRef.current.slideNext();
  };

  const goToPrev = () => {
    if (!swiperRef.current) return;
    swiperRef.current.slidePrev();
  };

  // Animação GSAP para a seção News - APENAS UMA VEZ
  useGSAP(() => {
    if (!sectionRef.current || hasAnimatedRef.current) return;

    // Animação para o conteúdo de texto
    if (textContentRef.current) {
      gsap.fromTo(textContentRef.current,
        {
          opacity: 0,
          x: -50,
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: textContentRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none none", // Só play uma vez
            markers: false,
            onEnter: () => {
              hasAnimatedRef.current = true;
            }
          }
        }
      );
    }

    // Animação para o carrossel
    if (carouselRef.current) {
      const slides = carouselRef.current.querySelectorAll('.swiper-slide');
      
      gsap.fromTo(slides,
        {
          opacity: 0,
          y: 50,
          scale: 0.8,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.2,
          ease: "back.out(1.5)",
          scrollTrigger: {
            trigger: carouselRef.current,
            start: "top 70%",
            end: "bottom 20%",
            toggleActions: "play none none none", // Só play uma vez
            markers: false,
          }
        }
      );
    }

    // Animação para os botões de navegação
    const navButtons = [navigationPrevRef.current, navigationNextRef.current].filter(Boolean);
    if (navButtons.length > 0) {
      gsap.fromTo(navButtons,
        {
          opacity: 0,
          scale: 0.5,
        },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: textContentRef.current,
            start: "top 70%",
            end: "bottom 20%",
            toggleActions: "play none none none", // Só play uma vez
            markers: false,
          }
        }
      );
    }

  }, { scope: sectionRef });

  return (
    <section 
      ref={sectionRef} 
      className="w-full bg-black py-16 flex justify-center items-center"
    >
      <div className="container flex flex-col lg:flex-row gap-12 items-start">

        {/* Coluna da Esquerda - Texto */}
        <div 
          ref={textContentRef}
          className="lg:w-1/2 space-y-8 px-25 w-full text-center lg:text-start justify-center items-center flex opacity-0"
        >
          <div className="space-y-6">
            <h2 className="text-4xl sm:text-3xl font-bold text-white">
              Fique por dentro das novidades
            </h2>
            
            {/* Controles de Navegação */}
            <div className="flex items-center lg:justify-start justify-center w-full gap-4">
              <button
                ref={navigationPrevRef}
                onClick={goToPrev}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-[#1E1E20] text-black hover:bg-[#1E1E20]/50 hover:text-white transition-colors duration-300 opacity-0"
              >
                <Icon icon="solar:alt-arrow-left-linear" className="w-6 h-6 text-white" />
              </button>
              
              <button
                ref={navigationNextRef}
                onClick={goToNext}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-[#1E1E20] text-black hover:bg-[#1E1E20]/50 hover:text-white transition-colors duration-300 opacity-0"
              >
                <Icon icon="solar:alt-arrow-right-linear" className="w-6 h-6 text-white" />
              </button>
            </div>

            <a
              href="/Servicos"
              className="flex justify-center lg:justify-start items-center gap-2"
            >
              <Button
                size="lg"
                className="bg-[#0C8BD2] text-white sm:text-lg md:text-xl cursor-pointer rounded-full hover:bg-[#009e6b] transition"
              >
                Ler nossos Newslatters
              </Button>
            </a>
          </div>
        </div>

        {/* Coluna da Direita - Carrossel */}
        <div ref={carouselRef} className="w-full max-w-6xl">
          <Swiper
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
              setActiveIndex(0);
            }}
            onSlideChange={(swiper) => {
              const realIndex = swiper.realIndex;
              setActiveIndex(realIndex);
            }}
            modules={[EffectCoverflow, Navigation]}
            effect="coverflow"
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={2}
            spaceBetween={30}
            loop={true}
            speed={600}
            navigation={{
              prevEl: navigationPrevRef.current,
              nextEl: navigationNextRef.current,
            }}
            onBeforeInit={(swiper) => {
              if (swiper.params.navigation && typeof swiper.params.navigation !== 'boolean') {
                swiper.params.navigation.prevEl = navigationPrevRef.current;
                swiper.params.navigation.nextEl = navigationNextRef.current;
              }
            }}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 150,
              modifier: 1.5,
              slideShadows: true,
            }}
            breakpoints={{
              320: {
                slidesPerView: 1,
                spaceBetween: 20,
                coverflowEffect: {
                  rotate: 0,
                  stretch: 0,
                  depth: 100,
                  modifier: 1,
                  slideShadows: false,
                }
              },
              768: {
                slidesPerView: 1,
                spaceBetween: 10,
                coverflowEffect: {
                  rotate: 0,
                  stretch: 70,
                  depth: 100,
                  modifier: 0,
                  slideShadows: false,
                }
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 30,
                coverflowEffect: {
                  rotate: 0,
                  stretch: 70,
                  depth: 150,
                  modifier: 0,
                  slideShadows: false,
                }
              }
            }}
            className="w-full"
          >
            {slides.map((client, i) => (
              <SwiperSlide
                key={i}
                className="w-[280px] md:w-[350px] lg:w-[400px] py-5 px-2.5 opacity-0"
              >
                <Card className="bg-[#1D1D1F] border rounded-3xl shadow-lg/30 p-3 h-[500px] flex flex-col overflow-hidden">
                  {/* Container da imagem quadrada no topo */}
                  <div className="w-full h-48 bg-gray-300 rounded-3xl overflow-hidden">
                    <img
                      src={client.avatar}
                      alt={client.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Conteúdo abaixo da imagem */}
                  <div className="flex-1 p-2 flex flex-col text-start">
                    {/* Nome e cargo centralizados */}
                    <CardHeader className="p-0 mb-4 text-start text-white">
                      <div>
                        <p className="font-semibold text-xl mb-1">
                          {client.name}
                        </p>
                        <p className="text-xl font-semibold">
                          {client.role}
                        </p>
                      </div>
                    </CardHeader>

                    {/* Conteúdo do depoimento */}
                    <CardContent className="p-0 flex-1 flex items-center">
                      <p className="text-[#09A7FF] text-base leading-relaxed text-start flex items-center gap-1 w-full">
                        {client.content} <ChevronRight className="w-4 h-4 stroke-[2] transition-transform duration-200 group-hover:translate-x-1" />
                      </p>
                    </CardContent>
                  </div>
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}