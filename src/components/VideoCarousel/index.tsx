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
        isEnd: false,
        startPlay: false,
        videoId: 0,
        isLastVideo: false,
        isPlaying: false,
    });

    // 👇 CORRIGIDO AQUI
    const [loadedData, setLoadedData] = useState<
        React.SyntheticEvent<HTMLVideoElement>[]
    >([]);

    const { isEnd, isLastVideo, startPlay, videoId, isPlaying } = video;

    useGSAP(() => {
        gsap.to("#slider", {
            transform: `translateX(${-100 * videoId}%)`,
            duration: 2,
            ease: "power2.inOut",
        });

        gsap.to("#video", {
            scrollTrigger: {
                trigger: "#video",
                toggleActions: "restart none none none",
            },
            onComplete: () => {
                setVideo((prev) => ({
                    ...prev,
                    startPlay: true,
                    isPlaying: true,
                }));
            },
        });
    }, [isEnd, videoId]);

    useEffect(() => {
        let currentProgress = 0;
        let span = videoSpanRef.current;

        if (span[videoId]) {
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

            if (videoId === 0) anim.restart();

            const animUpdate = () => {
                anim.progress(
                    videoRef.current[videoId].currentTime /
                    hightlightsSlides[videoId].videoDuration
                );
            };

            if (isPlaying) {
                gsap.ticker.add(animUpdate);
            } else {
                gsap.ticker.remove(animUpdate);
            }
        }
    }, [videoId, startPlay]);

    useEffect(() => {
        if (loadedData.length > 3) {
            if (!isPlaying) {
                videoRef.current[videoId]?.pause();
            } else {
                startPlay && videoRef.current[videoId]?.play();
            }
        }
    }, [startPlay, videoId, isPlaying, loadedData]);

    const handleProcess = (type: string, i?: number) => {
        switch (type) {
            case "video-end":
                setVideo((prev) => ({ ...prev, isEnd: true, videoId: (i ?? 0) + 1 }));
                break;

            case "video-last":
                setVideo((prev) => ({ ...prev, isLastVideo: true }));
                break;

            case "video-reset":
                setVideo((prev) => ({ ...prev, videoId: 0, isLastVideo: false }));
                break;

            case "pause":
            case "play":
                setVideo((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
                break;
        }
    };

    const handleLoadedMetaData = (
        i: number,
        e: React.SyntheticEvent<HTMLVideoElement>
    ) => setLoadedData((prev) => [...prev, e]);

    return (
        <>
            <div className="flex items-center">
                {hightlightsSlides.map((list, i) => (
                    <div key={list.id} id="slider" className="sm:pr-20 pr-10">
                        <div className="relative sm:w-[70vw] w-[88vw] md:h-[70vh] sm:h-[50vh] h-[35vh]">
                            <div className="w-full h-full flex items-center justify-centerr rounded-3xl overflow-hidden bg-black">
                                <video
                                    id="video"
                                    playsInline
                                    muted
                                    preload="auto"
                                    className={`pointer-events-none ${list.id === 2 && "translate-x-44"}`}
                                    ref={(el) => {
                                        if (el) videoRef.current[i] = el;
                                    }}
                                    onEnded={() =>
                                        i !== 3 ? handleProcess("video-end", i) : handleProcess("video-last")
                                    }
                                    onPlay={() => setVideo((prev) => ({ ...prev, isPlaying: true }))}
                                    onLoadedMetadata={(e) => handleLoadedMetaData(i, e)}
                                >
                                    <source src={list.video} type="video/mp4" />
                                </video>
                            </div>

                            <div className="absolute top-12 left-[5%] z-10">
                                {list.textLists.map((text, index) => (
                                    <p key={index} className="md:text-2xl text-xl font-medium">
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
