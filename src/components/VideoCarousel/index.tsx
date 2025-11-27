"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import Image from "next/image";

import { pauseImg, playImg, replayImg } from "../utils";

// Registrar o plugin ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface HighlightItem {
  video: string;
  textLists: string[];
  videoDuration: string;
}

interface VideoCarouselProps {
  highlightsData: HighlightItem[];
}

const VideoCarousel = ({ highlightsData }: VideoCarouselProps) => {
    const videoRef = useRef<HTMLVideoElement[]>([]);
    const videoSpanRef = useRef<HTMLSpanElement[]>([]);
    const videoDivRef = useRef<HTMLSpanElement[]>([]);

    const [video, setVideo] = useState({
        videoId: 0,
        isLastVideo: false,
        isPlaying: false,
    });

    const { isLastVideo, videoId, isPlaying } = video;

    // Filtrar apenas os highlights com vídeos válidos
    const validHighlights = highlightsData.filter(item => 
        item.video && 
        typeof item.video === 'string' && 
        item.video.trim() !== '' &&
        item.video !== 'undefined'
    );

    // Atualizar estado quando os dados válidos mudarem
    useEffect(() => {
        if (validHighlights.length > 0) {
            setVideo(prev => ({
                ...prev,
                isLastVideo: videoId >= validHighlights.length - 1,
                isPlaying: false
            }));
        } else {
            // Se não há vídeos válidos, resetar o estado
            setVideo({
                videoId: 0,
                isLastVideo: false,
                isPlaying: false,
            });
        }
    }, [validHighlights.length, videoId]);

    useGSAP(() => {
        if (validHighlights.length === 0) return;

        gsap.to("#slider", {
            transform: `translateX(${-100 * videoId}%)`,
            duration: 2,
            ease: "power2.inOut",
        });
    }, [videoId, validHighlights.length]);

    useEffect(() => {
        if (validHighlights.length === 0) return;

        let currentProgress = 0;
        let span = videoSpanRef.current;

        if (span[videoId] && isPlaying) {
            let anim = gsap.to(span[videoId], {
                onUpdate: () => {
                    const progress = Math.ceil(anim.progress() * 100);

                    if (progress !== currentProgress) {
                        currentProgress = progress;

                        gsap.to(videoDivRef.current[videoId], {
                            width:
                                window.innerWidth < 760
                                    ? "10vw"
                                    : window.innerWidth < 1200
                                        ? "10vw"
                                        : "4vw",
                        });

                        gsap.to(span[videoId], {
                            width: `${currentProgress}%`,
                            backgroundColor: "white",
                        });
                    }
                },

                onComplete: () => {
                    if (isPlaying) {
                        gsap.to(videoDivRef.current[videoId], { width: "12px" });
                        gsap.to(span[videoId], { backgroundColor: "#afafaf" });
                    }
                },
            });

            const animUpdate = () => {
                if (videoRef.current[videoId] && validHighlights[videoId]?.videoDuration) {
                    const videoElement = videoRef.current[videoId];
                    const duration = parseFloat(validHighlights[videoId].videoDuration) || videoElement.duration || 1;
                    
                    if (duration > 0) {
                        anim.progress(videoElement.currentTime / duration);
                    }
                }
            };

            if (isPlaying) {
                gsap.ticker.add(animUpdate);
            } else {
                gsap.ticker.remove(animUpdate);
            }

            return () => {
                gsap.ticker.remove(animUpdate);
            };
        }
    }, [videoId, isPlaying, validHighlights]);

    // Controla play/pause do vídeo atual
    useEffect(() => {
        if (validHighlights.length === 0) return;

        const currentVideo = videoRef.current[videoId];
        if (!currentVideo) return;

        if (isPlaying) {
            currentVideo.play().catch(error => {
                console.error("Erro ao reproduzir vídeo:", error);
                setVideo(prev => ({ ...prev, isPlaying: false }));
            });
        } else {
            currentVideo.pause();
        }
    }, [videoId, isPlaying, validHighlights.length]);

    const handleProcess = (type: string, i?: number) => {
        switch (type) {
            case "video-end":
                if (validHighlights.length === 0) return;
                
                const nextVideoId = (i ?? 0) + 1;
                const isLastAvailableVideo = nextVideoId >= validHighlights.length;
                
                setVideo((prev) => ({ 
                    ...prev, 
                    videoId: isLastAvailableVideo ? prev.videoId : nextVideoId,
                    isLastVideo: isLastAvailableVideo,
                    isPlaying: !isLastAvailableVideo
                }));
                break;

            case "video-last":
                setVideo((prev) => ({ 
                    ...prev, 
                    isLastVideo: true,
                    isPlaying: false 
                }));
                break;

            case "video-reset":
                setVideo((prev) => ({ 
                    ...prev, 
                    videoId: 0, 
                    isLastVideo: false,
                    isPlaying: false 
                }));
                break;

            case "pause":
                setVideo((prev) => ({ ...prev, isPlaying: false }));
                break;

            case "play":
                setVideo((prev) => ({ ...prev, isPlaying: true }));
                break;
        }
    };

    // Função para tratar erro no vídeo
    const handleVideoError = (videoUrl: string | undefined, index: number, error: any) => {
        console.error(`Erro ao carregar vídeo: ${videoUrl || 'URL não definida'}`, error);
        
        // Avança para o próximo vídeo em caso de erro
        if (index !== validHighlights.length - 1) {
            setTimeout(() => {
                handleProcess("video-end", index);
            }, 1000);
        } else {
            // Se for o último vídeo, para a reprodução
            setVideo(prev => ({ ...prev, isPlaying: false }));
        }
    };

    // Estados de loading e error
    if (validHighlights.length === 0) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-white text-center">
                    <p className="text-lg mb-4">Nenhum vídeo disponível</p>
                    <p className="text-sm text-gray-400">
                        {highlightsData.length > 0 
                            ? "Os vídeos estão com URLs inválidas ou vazias" 
                            : "Adicione destaques através do painel administrativo"
                        }
                    </p>
                    {highlightsData.length > 0 && (
                        <div className="mt-4 text-xs text-gray-500">
                            {highlightsData.length} item(s) recebido(s), mas nenhum com URL válida
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="flex items-center">
                {validHighlights.map((list, i) => (
                    <div key={i} id="slider" className="sm:pr-20 pr-10">
                        <div className="relative sm:w-[70vw] w-[88vw] md:h-[70vh] sm:h-[50vh] h-[35vh]">
                            <div className="w-full h-full flex items-center justify-center rounded-3xl overflow-hidden bg-black">
                                <video
                                    id="video"
                                    playsInline={true}
                                    muted
                                    preload="auto"
                                    className={`pointer-events-none`}
                                    ref={(el) => {
                                        if (el) videoRef.current[i] = el;
                                    }}
                                    onEnded={() =>
                                        i !== validHighlights.length - 1 
                                            ? handleProcess("video-end", i) 
                                            : handleProcess("video-last")
                                    }
                                    onPlay={() => setVideo((prev) => ({ ...prev, isPlaying: true }))}
                                    onPause={() => {
                                        if (video.isPlaying) {
                                            setVideo((prev) => ({ ...prev, isPlaying: false }));
                                        }
                                    }}
                                    onError={(e) => handleVideoError(list.video, i, e)}
                                >
                                    <source src={list.video} type="video/mp4" />
                                    Seu navegador não suporta o elemento de vídeo.
                                </video>
                            </div>

                            <div className="absolute top-12 left-[5%] z-10">
                                {list.textLists && list.textLists.map((text, index) => (
                                    <p key={index} className="md:text-2xl text-xl text-white font-medium">
                                        {text}
                                    </p>
                                ))}
                            </div>

                            {/* Indicador de duração */}
                            {list.videoDuration && (
                                <div className="absolute top-4 right-4 z-10 bg-black/50 text-white px-2 py-1 rounded text-sm">
                                    {list.videoDuration}s
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="relative flex items-center justify-center mt-10">
                <div className="flex items-center justify-center py-5 px-7 bg-[#262629] backdrop-blur rounded-full">
                    {validHighlights.map((_, i) => (
                        <span
                            key={i}
                            className="mx-2 w-3 h-3 bg-[#CCCCCE] rounded-full relative cursor-pointer"
                            ref={(el) => {
                                if (el) videoDivRef.current[i] = el;
                            }}
                            onClick={() => {
                                setVideo(prev => ({ 
                                    ...prev, 
                                    videoId: i, 
                                    isPlaying: false 
                                }));
                            }}
                        >
                            <span
                                className="absolute h-full w-full rounded-full"
                                ref={(el) => {
                                    if (el) videoSpanRef.current[i] = el;
                                }}
                            />
                        </span>
                    ))}
                </div>

                <button 
                    className="ml-4 p-4 rounded-full bg-[#262629] backdrop-blur flex items-center justify-center"
                    disabled={validHighlights.length === 0}
                >
                    <Image
                        src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg}
                        alt={isLastVideo ? "replay" : !isPlaying ? "play" : "pause"}
                        width={28}
                        height={28}
                        onClick={
                            isLastVideo
                                ? () => handleProcess("video-reset")
                                : !isPlaying
                                    ? () => handleProcess("play")
                                    : () => handleProcess("pause")
                        }
                    />
                </button>
            </div>
        </>
    );
};

export default VideoCarousel;