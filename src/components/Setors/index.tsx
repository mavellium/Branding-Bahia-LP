"use client";

import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Icon } from '@iconify/react';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { ChevronRight } from "lucide-react";
import "swiper/css";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Registrar o plugin ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface SetorCard {
  id: number;
  image: string;
  link: string;
  title: string;
  description: string;
}

export function Setors() {
  const [cards, setCards] = useState<SetorCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [windowWidth, setWindowWidth] = useState<number>(0);
  const swiperRef = useRef<any>(null);
  const [isClient, setIsClient] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const desktopCardsRef = useRef<HTMLDivElement>(null);

  // Função para fazer fetch com proxy CORS SEM CACHE
  const fetchWithCorsProxy = async (url: string) => {
    // Gerar um timestamp único para evitar cache
    const timestamp = Date.now();
    const urlWithNoCache = `${url}${url.includes('?') ? '&' : '?'}_=${timestamp}`;
    
    // Lista de proxies CORS públicos (fallback se um falhar)
    const proxies = [
      `https://corsproxy.io/?${encodeURIComponent(urlWithNoCache)}`,
      `https://api.allorigins.win/get?url=${encodeURIComponent(urlWithNoCache)}`,
      `https://cors-anywhere.herokuapp.com/${urlWithNoCache}`
    ];

    for (let i = 0; i < proxies.length; i++) {
      try {
        console.log(`Tentando proxy ${i + 1}: ${proxies[i]}`);
        
        const response = await fetch(proxies[i], {
          headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          },
          cache: 'no-store', // Desativa completamente o cache
        });

        if (!response.ok) {
          console.log(`Proxy ${i + 1} falhou: ${response.status}`);
          continue; // Tenta o próximo proxy
        }

        const data = await response.json();
        
        // Diferentes proxies retornam formatos diferentes
        if (proxies[i].includes('allorigins.win')) {
          // api.allorigins.win retorna { contents: JSON string }
          return JSON.parse(data.contents);
        } else if (proxies[i].includes('corsproxy.io') || proxies[i].includes('cors-anywhere')) {
          // corsproxy.io e cors-anywhere retornam o JSON diretamente
          return data;
        }
      } catch (err) {
        console.error(`Erro com proxy ${i + 1}:`, err);
        // Continua para o próximo proxy
      }
    }
    
    throw new Error('Todos os proxies CORS falharam');
  };

  // Buscar dados diretamente da URL com proxy CORS SEM CACHE
  useEffect(() => {
    const fetchSetors = async () => {
      try {
        setLoading(true);
        const targetUrl = 'https://dashboard-brandingbahia-production.up.railway.app/api/form/setors';
        
        console.log('Iniciando fetch com proxy CORS para:', targetUrl);
        
        const data = await fetchWithCorsProxy(targetUrl);
        
        console.log('Dados recebidos:', data);
        
        // Ajustando para a estrutura do JSON fornecido
        if (Array.isArray(data) && data.length > 0 && Array.isArray(data[0].values)) {
          // Mapear os dados para o formato esperado
          const mappedCards = data[0].values.map((item: any, index: number) => ({
            id: index,
            image: item.image,
            link: item.link || "#", // Usar "#" se o link estiver vazio
            title: item.title,
            description: item.description
          }));
          setCards(mappedCards);
        } else {
          setError("Formato de dados inválido na API.");
        }
        setError(null);
      } catch (err) {
        console.error('Erro ao buscar dados dos setores:', err);
        setError('Erro ao carregar os setores. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchSetors();
  }, []);

  // Verifique se está no cliente
  useEffect(() => {
    setIsClient(true);
    setWindowWidth(window.innerWidth);

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Use useLayoutEffect para operações sincronas com DOM
  useEffect(() => {
    if (!isClient) return;

    // Inicialize o Swiper apenas no cliente
    if (swiperRef.current) {
      // Sua inicialização do Swiper aqui
    }
  }, [isClient]);

  const isMobile = windowWidth !== null && windowWidth < 768;

  useEffect(() => {
    // autoplay apenas no desktop
    if (isMobile || !isPlaying || cards.length === 0) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % cards.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isMobile, isPlaying, cards.length]);

  // controla o autoplay do Swiper no mobile
  useEffect(() => {
    if (!swiperRef.current || cards.length === 0) return;

    if (isMobile) {
      if (isPlaying) {
        swiperRef.current.autoplay?.start();
      } else {
        swiperRef.current.autoplay?.stop();
      }
    }
  }, [isMobile, isPlaying, cards.length]);

  const goToSlide = (index: number) => {
    if (isMobile) {
      setActiveIndex(index);
      // Adicione uma verificação extra para garantir que o Swiper está disponível
      if (swiperRef.current && swiperRef.current.swiper) {
        swiperRef.current.swiper.slideTo(index);
      }
    } else {
      setActiveIndex(index);
    }
  };

  // Animação GSAP para os cards desktop
  useGSAP(() => {
    if (!desktopCardsRef.current || isMobile || cards.length === 0) return;

    const cardsElements = desktopCardsRef.current.querySelectorAll('.desktop-card');

    // Configurar estado inicial
    gsap.set(cardsElements, {
      opacity: 0,
      y: 50,
      scale: 0.9
    });

    // Animação com ScrollTrigger
    const animation = gsap.to(cardsElements, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      stagger: 0.15,
      ease: "back.out(1.7)",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 70%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
        markers: false,
      }
    });

    return () => {
      animation.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, { dependencies: [isMobile, cards.length], scope: sectionRef });

  // Animação GSAP para os cards mobile
  useGSAP(() => {
    if (!isMobile || cards.length === 0) return;

    const cardsElements = document.querySelectorAll('.mobile-card');

    // Configurar estado inicial
    gsap.set(cardsElements, {
      opacity: 0,
      y: 30
    });

    // Animação com ScrollTrigger
    const animation = gsap.to(cardsElements, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 70%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
        markers: false,
      }
    });

    return () => {
      animation.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, { dependencies: [isMobile, cards.length], scope: sectionRef });

  // Estados de loading e error
  if (loading) {
    return (
      <section className="py-20 w-full flex flex-col justify-center items-center bg-black px-4">
        <div className="container flex flex-col justify-center items-center">
          <div className="text-white text-lg">Carregando setores...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 w-full flex flex-col justify-center items-center bg-black px-4">
        <div className="container flex flex-col justify-center items-center">
          <div className="text-red-500 text-lg mb-4">{error}</div>
          <Button
            onClick={() => window.location.reload()}
            className="bg-[#0C8BD2] hover:bg-[#0C8BD2]/80"
          >
            Tentar Novamente
          </Button>
        </div>
      </section>
    );
  }

  if (cards.length === 0) {
    return (
      <section className="py-20 w-full flex flex-col justify-center items-center bg-black px-4">
        <div className="container flex flex-col justify-center items-center">
          <div className="text-white text-lg">Nenhum setor encontrado.</div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="py-20 w-full flex flex-col justify-center items-center bg-black px-4"
      id="setors"
    >
      <div className="container flex flex-col justify-center">
        <h2 className="font-heading ml-5 md:ml-10 lg:ml-20 xl:ml-50 2xl:ml-20 text-start text-2xl sm:text-3xl md:text-2xl font-bold text-white mb-10">
          Resultados Reais para Diferentes Setores
        </h2>

        {/* 🟢 MOBILE - Swiper */}
        {isMobile && (
          <div className="w-full overflow-visible">
            <Swiper
              modules={[Autoplay]}
              onSwiper={(swiper) => (swiperRef.current = swiper)}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              centeredSlides={true}
              slidesPerView={0.9}
              spaceBetween={16}
              onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
              className="w-full"
            >
              {cards.map((card, index) => (
                <SwiperSlide key={index} className="overflow-visible">
                  <motion.div
                    onClick={() => setActiveIndex(index)}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col items-center mobile-card"
                  >
                    {/* 🔧 Card principal mobile ajustado */}
                    <div className="relative overflow-hidden rounded-2xl shadow-md cursor-pointer w-[92vw] max-w-[600px] mx-auto">
                      <img
                        src={card.image}
                        alt={card.title}
                        className="object-cover object-center w-full h-[340px] sm:h-[360px] rounded-2xl"
                      />
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 rounded-2xl flex flex-col items-start p-4 w-[90%]"
                    >
                      <h2 className="text-white text-lg md:text-lg font-bold mb-3 leading-relaxed">
                        {card.title}
                      </h2>
                      <p className="text-white text-start mb-2">
                        {card.description}
                      </p>
                      <a
                        href={card.link}
                        className="flex justify-center items-center gap-1 text-[#0C8BD2] hover:text-[#0C8BD2]/50 transition-colors duration-200 font-medium"
                      >
                        Conheça nossas soluções <ChevronRight className="w-4 h-4 stroke-[2] transition-transform duration-200 group-hover:translate-x-1" />
                      </a>
                    </motion.div>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}

        {/* 🟣 DESKTOP */}
        {isClient && !isMobile && (
          <>
            <div ref={desktopCardsRef} className="flex justify-center flex-wrap gap-6 md:gap-2 relative">
              {cards.map((card, index) => {
                const isActive = index === activeIndex;
                // Use valores padrão seguros enquanto windowWidth é 0
                const activeWidth = windowWidth < 1024 ? 260 : 420;
                const inactiveWidth =
                  windowWidth < 1024 ? 140 :
                    windowWidth < 1536 ? 160 :
                      320;

                return (
                  <motion.div
                    key={index}
                    layout
                    className="flex flex-col items-center relative desktop-card"
                    transition={{
                      duration: 0.4,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                    style={{ minWidth: inactiveWidth }}
                  >
                    <motion.div
                      layout
                      onClick={() => setActiveIndex(index)}
                      animate={{
                        opacity: isActive ? 1 : 0.6,
                        width: isActive ? activeWidth : inactiveWidth,
                        scale: isActive ? 1 : 0.97,
                      }}
                      transition={{
                        duration: 0.4,
                        ease: [0.4, 0, 0.2, 1],
                      }}
                      className="relative cursor-pointer overflow-hidden rounded-2xl shadow-md"
                    >
                      <motion.img
                        layout
                        src={card.image}
                        alt={card.description}
                        className="object-cover object-top rounded-2xl w-full h-[660px]"
                        transition={{
                          duration: 0.4,
                          ease: [0.4, 0, 0.2, 1],
                        }}
                      />
                      <motion.div
                        key={index}
                        layout
                        className={`absolute inset-0 flex justify-center items-center text-white ${isActive ? "bg-black/20" : "bg-black/50"
                          }`}
                        transition={{
                          duration: 0.4,
                          ease: [0.4, 0, 0.2, 1],
                        }}
                      />
                    </motion.div>

                    <AnimatePresence mode="sync">
                      {isActive && (
                        <motion.div
                          key={`desc-${card.id}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{
                            duration: 0.4,
                            ease: [0.4, 0, 0.2, 1],
                          }}
                          className="absolute top-full mt-4 rounded-2xl p-1 z-10 flex flex-col items-start text-left"
                          style={{
                            width: activeWidth,
                            maxWidth: 360
                          }}
                        >
                          <h2 className="text-white text-md md:text-lg font-bold mb-3 leading-relaxed"
                          style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                            {card.title}
                          </h2>

                          <p className="text-white text-sm md:text-md mb-3 leading-relaxed"
                          style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                            
                            {card.description}
                          </p>
                          <a
                            href={card.link}
                            className="text-[#0C8BD2] hover:text-[#0C8BD2]/50 transition-colors duration-200 flex items-center gap-1 font-medium"
                          >
                            Conheça nossas soluções <ChevronRight className="w-4 h-4 stroke-[2] transition-transform duration-200 group-hover:translate-x-1" />
                          </a>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}

        {/* 🔘 CONTROLES PADRONIZADOS - Dots + Play/Pause */}
        <div className="flex items-center justify-center  mt-20 md:mt-80 lg:mt-80 gap-4">
          {/* Dots no estilo Nubank */}
          <div className="flex gap-2 bg-[#262629] h-10 w-auto p-5 rounded-full justify-center items-center">
            {cards.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-1 rounded-full transition-all duration-300 ${index === activeIndex
                  ? "bg-white w-8 h-2"  // Ativo - preto e largura maior
                  : "bg-[#ACACAC] w-2 h-2 hover:bg-black"  // Inativos
                  }`}
              ></button>
            ))}
          </div>

          {/* Botão Play/Pause padronizado */}
          <div>
            <Button
              onClick={() => setIsPlaying((prev) => !prev)}
              className="flex items-center bg-[#262629] backdrop-blur-md text-black hover:bg-[#151516] rounded-full px-4 py-4 h-10 shadow-sm"
            >
              {isPlaying ? (
                <Icon icon="solar:pause-bold" className="w-5 h-5 text-white" />
              ) : (
                <Icon icon="solar:play-bold" className="w-5 h-5 text-white" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}