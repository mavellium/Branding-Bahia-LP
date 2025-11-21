"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";

import Image from "next/image";

import { hightlightsSlides } from "../constants";
import { pauseImg, playImg, replayImg } from "../utils";

gsap.registerPlugin(ScrollTrigger);

const VideoCarousel = () => {
    const videoRef = useRef<HTMLVideoElement[]>([]);
    const videoSpanRef = useRef<HTMLSpanElement[]>([]);
    const videoDivRef = useRef<HTMLSpanElement[]>([]);

    const [video, setVideo] = useState({
        videoId: 0,
        isLastVideo: false,
        isPlaying: false,
    });

    const { isLastVideo, videoId, isPlaying } = video;

    useGSAP(() => {
        gsap.to("#slider", {
            transform: `translateX(${-100 * videoId}%)`,
            duration: 2,
            ease: "power2.inOut",
        });
    }, [videoId]);

    useEffect(() => {
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
                if (videoRef.current[videoId] && hightlightsSlides[videoId]?.videoDuration) {
                    anim.progress(
                        videoRef.current[videoId].currentTime /
                        hightlightsSlides[videoId].videoDuration
                    );
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
    }, [videoId, isPlaying]);

    // Controla play/pause do vídeo atual
    useEffect(() => {
        const currentVideo = videoRef.current[videoId];
        if (!currentVideo) return;

        if (isPlaying) {
            currentVideo.play();
        } else {
            currentVideo.pause();
        }
    }, [videoId, isPlaying]);

    const handleProcess = (type: string, i?: number) => {
        switch (type) {
            case "video-end":
                // CORREÇÃO: Verifica se é o último vídeo disponível
                const nextVideoId = (i ?? 0) + 1;
                const isLastAvailableVideo = nextVideoId >= hightlightsSlides.length;
                
                setVideo((prev) => ({ 
                    ...prev, 
                    videoId: isLastAvailableVideo ? prev.videoId : nextVideoId,
                    isLastVideo: isLastAvailableVideo,
                    isPlaying: !isLastAvailableVideo // Pausa se for o último
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

    return (
        <>
            <div className="flex items-center">
                {hightlightsSlides.map((list, i) => (
                    <div key={list.id} id="slider" className="sm:pr-20 pr-10">
                        <div className="relative sm:w-[70vw] w-[88vw] md:h-[70vh] sm:h-[50vh] h-[35vh]">
                            <div className="w-full h-full flex items-center justify-center rounded-3xl overflow-hidden bg-black">
                                <video
                                    id="video"
                                    playsInline={true}
                                    muted
                                    preload="auto"
                                    className={`${list.id === 2 && "translate-x-44"} pointer-events-none`}
                                    ref={(el) => {
                                        if (el) videoRef.current[i] = el;
                                    }}
                                    onEnded={() =>
                                        // CORREÇÃO: Usa o índice real do array
                                        i !== hightlightsSlides.length - 1 
                                            ? handleProcess("video-end", i) 
                                            : handleProcess("video-last")
                                    }
                                    onPlay={() => setVideo((prev) => ({ ...prev, isPlaying: true }))}
                                    onPause={() => {
                                        if (video.isPlaying) {
                                            setVideo((prev) => ({ ...prev, isPlaying: false }));
                                        }
                                    }}
                                >
                                    <source src={list.video} type="video/mp4" />
                                </video>
                            </div>

                            <div className="absolute top-12 left-[5%] z-10">
                                {list.textLists.map((text, index) => (
                                    <p key={index} className="md:text-2xl text-xl text-white font-medium">
                                        {text}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="relative flex items-center justify-center mt-10">
                <div className="flex items-center justify-center py-5 px-7 bg-[#262629] backdrop-blur rounded-full">
                    {hightlightsSlides.map((_, i) => (
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

                <button className="ml-4 p-4 rounded-full bg-[#262629] backdrop-blur flex items-center justify-center">
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