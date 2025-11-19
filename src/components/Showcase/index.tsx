'use client';

import { useMediaQuery } from "react-responsive";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const Showcase = () => {
    const isTablet = useMediaQuery({ query: "(max-width: 1024px)" });
    const container = useRef(null);

    useGSAP(
        (context) => {
            const ctx = gsap.context(() => {
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

            return () => ctx.revert(); // evita o erro no cleanup
        },
        { dependencies: [isTablet], scope: container }
    );

    return (
        <section id='showcase' ref={container}>
            <div className='media'>
                <video src='/videos/game.mp4' loop muted autoPlay playsInline />
                <div className='mask'>
                    <img src='/mask-logo.svg' />
                </div>
            </div>
        </section>
    );
};

export default Showcase;
