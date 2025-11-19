'use client';

import { useMediaQuery } from "react-responsive";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
gsap.registerPlugin(ScrollTrigger);

const Showcase = () => {
    const isTablet = useMediaQuery({ query: "(max-width: 1024px)" });

    useGSAP(() => {
        if (!isTablet) {
            const timeline = gsap.timeline({
                scrollTrigger: {
                    trigger: "#showcase",
                    start: "top top+=100",
                    end: "bottom top",
                    scrub: true,
                    // toggleActions: "play  reverse",
                    pin: true,
                },
            });

            timeline
                .to(".mask img", {
                    transform: "scale(1.15)",
                })
        }
    }, [isTablet]);

    return (
        <section id='showcase'>
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
