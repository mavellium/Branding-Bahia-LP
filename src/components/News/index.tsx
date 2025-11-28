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

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";

interface NewsItem {
  id?: string;
  fallback: string;
  title: string;
  image: string;
  link: string;
}

interface ApiResponse {
  id: string;
  type: string;
  values: NewsItem[];
  createdAt: string;
}

export function News() {
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<any>(null);
  const navigationPrevRef = useRef<HTMLButtonElement>(null);
  const navigationNextRef = useRef<HTMLButtonElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const textContentRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const hasAnimatedRef = useRef(false);

  // CORREÇÃO: Buscar dados do endpoint correto
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        console.log('Buscando dados das newsletters...');
        
        // CORREÇÃO: Usar o endpoint correto baseado no seu admin
        const response = await fetch('/api/news');
        
        if (!response.ok) {
          throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }
        
        const data: ApiResponse[] = await response.json();
        
        console.log('Dados recebidos da API:', data);
        
        // CORREÇÃO: Processamento mais robusto dos dados
        if (data && data.length > 0 && data[0].values) {
          const processedData = data[0].values
            .filter(item => item && (item.image || item.title)) // Filtra itens válidos
            .map(item => ({
              id: item.id || Math.random().toString(36).substr(2, 9),
              fallback: item.fallback || "Imagem da newsletter",
              title: item.title || "Título não disponível",
              image: getSafeImageUrl(item.image),
              link: item.link || "#"
            }));
          
          console.log('Dados processados:', processedData);
          setNewsData(processedData);
        } else {
          console.log('Nenhum dado válido encontrado');
          setNewsData([]);
        }
        
        setError(null);
      } catch (err) {
        console.error('Erro ao buscar dados das notícias:', err);
        setError('Erro ao carregar as notícias. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // CORREÇÃO: Função melhorada para obter URL segura da imagem
  const getSafeImageUrl = (imageUrl: string | undefined): string => {
    if (!imageUrl) {
      return "https://placehold.co/600x400/1a1a1a/ffffff?text=Newsletter";
    }
    
    // Se a imagem é uma URL completa
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    
    // CORREÇÃO: Se a imagem é um caminho do servidor
    if (imageUrl.startsWith('/')) {
      // Adicionar o domínio se for um caminho absoluto do servidor
      return `${window.location.origin}${imageUrl}`;
    }
    
    // Se for um blob URL ou data URL
    if (imageUrl.startsWith('blob:') || imageUrl.startsWith('data:')) {
      return imageUrl;
    }
    
    // CORREÇÃO: Se for apenas um nome de arquivo, assumir que está na pasta de uploads
    if (imageUrl.includes('.') && !imageUrl.includes('/')) {
      return `/uploads/${imageUrl}`;
    }
    
    return "https://placehold.co/600x400/1a1a1a/ffffff?text=Newsletter";
  };

  // CORREÇÃO: Função de erro de imagem melhorada
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    console.warn('Erro ao carregar imagem:', target.src);
    target.src = "https://placehold.co/600x400/1a1a1a/ffffff?text=Imagem+Não+Disponível";
    target.alt = "Imagem não disponível";
  };

  // CORREÇÃO: Debug para verificar as URLs das imagens
  useEffect(() => {
    if (newsData.length > 0) {
      console.log('URLs das imagens carregadas:');
      newsData.forEach((news, index) => {
        console.log(`News ${index + 1}:`, {
          title: news.title,
          imageUrl: news.image,
          fallback: news.fallback
        });
      });
    }
  }, [newsData]);

  // Duplicar os slides para garantir que o loop funcione
  const slides = newsData.length > 0 
    ? [...newsData, ...newsData, ...newsData]
    : [];

  const goToNext = () => {
    if (!swiperRef.current || newsData.length === 0) return;
    swiperRef.current.slideNext();
  };

  const goToPrev = () => {
    if (!swiperRef.current || newsData.length === 0) return;
    swiperRef.current.slidePrev();
  };

  // Animação GSAP (mantida igual)
  useGSAP(() => {
    if (!sectionRef.current || hasAnimatedRef.current || newsData.length === 0) return;

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
            toggleActions: "play none none none",
            markers: false,
            onEnter: () => {
              hasAnimatedRef.current = true;
            }
          }
        }
      );
    }

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
            toggleActions: "play none none none",
            markers: false,
          }
        }
      );
    }

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
            toggleActions: "play none none none",
            markers: false,
          }
        }
      );
    }

  }, { scope: sectionRef, dependencies: [newsData.length] });

  // Estados de loading e error
  if (loading) {
    return (
      <section className="w-full bg-black py-16 flex justify-center items-center">
        <div className="container flex flex-col lg:flex-row gap-12 items-start">
          <div className="text-white text-center w-full py-10">
            Carregando newsletters...
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full bg-black py-16 flex justify-center items-center">
        <div className="container flex flex-col lg:flex-row gap-12 items-start">
          <div className="text-red-500 text-center mb-4 w-full">
            {error}
          </div>
          <div className="text-center w-full">
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

  if (newsData.length === 0) {
    return (
      <section className="w-full bg-black py-16 flex justify-center items-center">
        <div className="container flex flex-col lg:flex-row gap-12 items-start">
          <div className="text-white text-center w-full py-10">
            Nenhuma newsletter encontrada.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      ref={sectionRef} 
      className="w-full bg-black py-16 flex justify-center items-center"
    >
      <div className="container flex flex-col lg:flex-row gap-12 items-start">

        {/* Coluna da Esquerda - Texto */}
        <div 
          ref={textContentRef}
          className="lg:w-1/2 space-y-8 px-4 lg:px-25 w-full text-center lg:text-start justify-center items-center flex opacity-0"
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
                disabled={newsData.length === 0}
              >
                <Icon icon="solar:alt-arrow-left-linear" className="w-6 h-6 text-white" />
              </button>
              
              <button
                ref={navigationNextRef}
                onClick={goToNext}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-[#1E1E20] text-black hover:bg-[#1E1E20]/50 hover:text-white transition-colors duration-300 opacity-0"
                disabled={newsData.length === 0}
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
                Ler nossos Newsletters
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
            loop={newsData.length > 0}
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
            {slides.map((news, i) => (
              <SwiperSlide
                key={`${news.id}-${i}`}
                className="w-[280px] md:w-[350px] lg:w-[400px] py-5 px-2.5 opacity-0"
              >
                <Card className="bg-[#1D1D1F] border rounded-3xl shadow-lg/30 p-3 h-[500px] flex flex-col overflow-hidden">
                  {/* Container da imagem quadrada no topo */}
                  <div className="w-full h-48 bg-gray-800 rounded-3xl overflow-hidden">
                    <img
                      src={news.image}
                      alt={news.fallback}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      onError={handleImageError}
                      loading="lazy"
                    />
                  </div>

                  {/* Conteúdo abaixo da imagem */}
                  <div className="flex-1 p-4 flex flex-col text-start">
                    {/* Título */}
                    <CardHeader className="p-0 mb-4 text-start text-white">
                      <div>
                        <p className="font-semibold text-xl mb-1 line-clamp-2">
                          {news.title}
                        </p>
                        <p className="text-lg text-gray-400">
                          Newsletter
                        </p>
                      </div>
                    </CardHeader>

                    {/* Link para leitura */}
                    <CardContent className="p-0 flex-1 flex items-end">
                      <a 
                        href={news.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[#09A7FF] text-base leading-relaxed text-start flex items-center gap-1 w-full hover:underline group"
                      >
                        Leia mais 
                        <ChevronRight className="w-4 h-4 stroke-[2] transition-transform duration-200 group-hover:translate-x-1" />
                      </a>
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