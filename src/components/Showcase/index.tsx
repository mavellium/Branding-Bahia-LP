'use client';

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const Showcase = () => {
    const container = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            if (!container.current) return;

            const mm = gsap.matchMedia();

            mm.add("(min-width: 1025px)", () => {
                // Definir o estado inicial da máscara (grande)
                gsap.set(".mask img", { scale: 2555 });

                const timeline = gsap.timeline({
                    scrollTrigger: {
                        trigger: "#showcase",
                        start: "top",
                        end: "bottom top",
                        scrub: true,
                        // toggleActions: "play  reverse",
                        pin: true,
                    },
                });

                // Anima do estado inicial (scale: 155) para o final (scale: 1)
                timeline.to(".mask img", {
                    scale: 1,
                    ease: "none",
                });

                // Função de limpeza
                return () => {
                    timeline.kill();
                    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
                };
            });

            mm.add("(max-width: 1024px)", () => {
                // Para mobile/tablet, apenas define o scale 1.2 sem animação
                gsap.set(".mask img", { scale: 1.2 });

                return () => {
                    // Remove qualquer transformação do GSAP no mobile
                    gsap.set(".mask img", { clearProps: "all" });
                };
            });

            return () => mm.revert();
        },
        { scope: container }
    );

    return (
        <section id='showcase' ref={container}>
            <div className='media'>
                <video
                    src='/videos/showcase.webm'
                    loop
                    muted
                    autoPlay
                    playsInline
                    className="w-full h-auto object-cover"
                />
                <div className='mask'>
                    <img
                        src='/mask-black.webp'
                        alt="Showcase logo"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
        </section>
    );
};

export default Showcase;