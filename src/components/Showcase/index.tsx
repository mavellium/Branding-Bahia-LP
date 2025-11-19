'use client';

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useRef, useEffect, useState } from "react";

gsap.registerPlugin(ScrollTrigger);

const Showcase = () => {
    const [isClient, setIsClient] = useState(false);
    const container = useRef(null);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useGSAP(
        (context) => {
            if (!isClient) return;

            const ctx = gsap.context(() => {
                // Verificar width diretamente no cliente
                const isTablet = window.innerWidth <= 1024;
                
                if (!isTablet) {
                    const timeline = gsap.timeline({
                        scrollTrigger: {
                            trigger: container.current,
                            start: "top top+=100",
                            end: "bottom top",
                            scrub: true,
                            pin: true,
                        },
                    });

                    timeline.to(".mask img", {
                        transform: "scale(1.15)",
                    });
                }
            }, container);

            return () => ctx.revert();
        },
        { dependencies: [isClient], scope: container }
    );

    if (!isClient) {
        return (
            <section id='showcase'>
                <div className='media'>
                    <div className="w-full h-[500px] bg-gray-200 animate-pulse rounded-lg"></div>
                </div>
            </section>
        );
    }

    return (
        <section id='showcase' ref={container}>
            <div className='media'>
                <video src='/videos/showcase.webm' loop muted autoPlay playsInline />
                <div className='mask'>
                    <img src='/mask-logo.svg' alt="Showcase logo" />
                </div>
            </div>
        </section>
    );
};

export default Showcase;