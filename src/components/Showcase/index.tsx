'use client';

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useRef, useEffect, useState } from "react";

// Registrar o plugin ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const Showcase = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [showLoading, setShowLoading] = useState(true);
    const [videoError, setVideoError] = useState(false);

    // Detectar se é mobile
    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 1024); // lg breakpoint
        };

        // Verificar inicialmente
        checkIfMobile();

        // Adicionar listener para redimensionamento
        window.addEventListener('resize', checkIfMobile);

        return () => {
            window.removeEventListener('resize', checkIfMobile);
        };
    }, []);

    // Timer para esconder loading após timeout (fallback)
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowLoading(false);
        }, 5000); // 5 segundos max

        return () => clearTimeout(timer);
    }, []);

    // Pré-carregar o vídeo
    useEffect(() => {
        // Criar link de pré-carregamento para o vídeo
        const preloadLink = document.createElement('link');
        preloadLink.rel = 'preload';
        preloadLink.as = 'video';
        preloadLink.href = '/videos/feature-3.mp4';
        document.head.appendChild(preloadLink);

        return () => {
            if (preloadLink.parentNode) {
                preloadLink.parentNode.removeChild(preloadLink);
            }
        };
    }, []);

    // Inicializar estado de reprodução quando o vídeo carregar
    useEffect(() => {
        if (videoRef.current) {
            const video = videoRef.current;
            
            // Configurar vídeo para otimização
            video.preload = 'auto';
            
            const handleCanPlay = () => {
                setIsVideoLoaded(true);
                setShowLoading(false);
                
                // Se for mobile, inicia pausado
                if (isMobile) {
                    video.pause();
                    setIsPlaying(false);
                } else {
                    // Se for desktop, tenta iniciar a reprodução automaticamente
                    video.play().then(() => {
                        setIsPlaying(true);
                    }).catch((error) => {
                        console.log("Autoplay falhou:", error);
                        setIsPlaying(false);
                    });
                }
            };

            const handleLoadedData = () => {
                // Já temos dados suficientes para começar
                if (!isVideoLoaded) {
                    setIsVideoLoaded(true);
                    setShowLoading(false);
                }
            };

            const handleStalled = () => {
                console.log("Vídeo parado de carregar, tentando recuperar...");
                // Tentar recarregar o vídeo
                if (video.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) {
                    video.load();
                }
            };

            const handlePlay = () => setIsPlaying(true);
            const handlePause = () => setIsPlaying(false);
            const handleEnded = () => {
                // Reinicia o vídeo quando termina
                video.currentTime = 0;
                if (!isMobile) { // Só reproduz automaticamente se não for mobile
                    video.play().then(() => setIsPlaying(true));
                }
            };

            const handleError = () => {
                console.error("Erro ao carregar o vídeo");
                setVideoError(true);
                setIsPlaying(false);
                setShowLoading(false);
            };

            // Adicionar todos os event listeners
            video.addEventListener('canplay', handleCanPlay);
            video.addEventListener('loadeddata', handleLoadedData);
            video.addEventListener('stalled', handleStalled);
            video.addEventListener('play', handlePlay);
            video.addEventListener('pause', handlePause);
            video.addEventListener('ended', handleEnded);
            video.addEventListener('error', handleError);

            // Forçar carregamento do vídeo
            video.load();

            return () => {
                video.removeEventListener('canplay', handleCanPlay);
                video.removeEventListener('loadeddata', handleLoadedData);
                video.removeEventListener('stalled', handleStalled);
                video.removeEventListener('play', handlePlay);
                video.removeEventListener('pause', handlePause);
                video.removeEventListener('ended', handleEnded);
                video.removeEventListener('error', handleError);
            };
        }
    }, [isMobile]);

    // Controlar animações GSAP
    useGSAP(() => {
        if (typeof window === "undefined") return;

        // Animação de entrada do título
        gsap.fromTo(".showcase-title",
            {
                opacity: 0,
                y: 50,
                scale: 0.9
            },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 1.2,
                ease: "power3.out",
                delay: 0.5
            }
        );

        // Animação de entrada do botão de play/pause (apenas desktop)
        if (!isMobile) {
            gsap.fromTo(".play-pause-btn",
                {
                    opacity: 0,
                    x: 20,
                    scale: 0.8
                },
                {
                    opacity: 1,
                    x: 0,
                    scale: 1,
                    duration: 0.8,
                    ease: "back.out(1.7)",
                    delay: 1
                }
            );
        }
    }, [isMobile]);

    const togglePlayPause = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
                setIsPlaying(false);
            } else {
                videoRef.current.play()
                    .then(() => setIsPlaying(true))
                    .catch(error => {
                        console.error("Erro ao reproduzir vídeo:", error);
                        setIsPlaying(false);
                    });
            }
        }
    };

    return (
        <section className="relative">
            <div className='relative lg:overflow-hidden rounded-[120px]'>
                {/* Contêiner do vídeo com loading */}
                <div className="relative">
                    {/* Tela de loading enquanto o vídeo carrega */}
                    {showLoading && !videoError && (
                        <div className="absolute inset-0 bg-black z-10 flex items-center justify-center">
                            <div className="flex flex-col items-center">
                                <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4" />
                                <p className="text-white text-sm">Carregando vídeo...</p>
                            </div>
                        </div>
                    )}
                    
                    {/* Mensagem de erro se o vídeo falhar */}
                    {videoError && (
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black z-10 flex items-center justify-center">
                            <div className="text-center p-6">
                                <p className="text-white text-lg mb-2">Erro ao carregar o vídeo</p>
                                <p className="text-gray-400 text-sm">Por favor, recarregue a página</p>
                            </div>
                        </div>
                    )}
                    
                    <video 
                        ref={videoRef}
                        src='/videos/showcase.webm' 
                        className="w-full max-h-[700px] object-cover object-center" 
                        loop 
                        muted 
                        playsInline
                        preload="auto"
                    />
                    
                    {/* Overlay escuro para melhor contraste com o texto */}
                    <div className="absolute inset-0 bg-black/45" />
                </div>

                {/* Título centralizado */}
                <div className="absolute inset-0 flex items-center justify-center rounded-b-2xl z-10 pointer-events-none">
                    <h1 className="showcase-title text-white text-center text-shadow-lg font-bold text-[38px] sm:text-[55px] md:text-[80px] lg:text-[100px]">
                        Se não for 
                        <span className="block font-bold text-[38px] leading-14 sm:text-[55px] md:text-[80px] lg:text-[100px]">
                            para <span className="text-[#0C7BB9]">ganhar</span>,
                        </span>
                        nem começa
                    </h1>
                </div>

                {/* Botão de Play/Pause no canto superior direito - APENAS DESKTOP */}
                {isVideoLoaded && !isMobile && !videoError && (
                    <div className="absolute top-6 right-10 z-20 hidden lg:block">
                        <button
                            className="play-pause-btn group flex items-center justify-center w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 hover:bg-black/70 hover:border-white/40 transition-all duration-300 shadow-lg"
                            onClick={togglePlayPause}
                            aria-label={isPlaying ? "Pausar vídeo" : "Reproduzir vídeo"}
                        >
                            {/* Ícone de play ou pause */}
                            <div className="relative w-7 h-7">
                                {isPlaying ? (
                                    <svg className="w-full h-full" viewBox="0 0 24 24" fill="white">
                                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                                    </svg>
                                ) : (
                                    <svg className="w-full h-full" viewBox="0 0 24 24" fill="white">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                )}
                            </div>
                            
                            {/* Efeito de hover */}
                            <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/10 to-white/5" />
                            </div>
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Showcase;