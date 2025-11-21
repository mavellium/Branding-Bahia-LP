"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

import VideoCarousel from "../VideoCarousel";

// Registrar o plugin ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const watchImg = "/watch.png";
const rightImg = "/right.png";

export default function Highlights() {
  useGSAP(() => {
    // Configurar a animação com ScrollTrigger
    gsap.to("#title", {
      opacity: 1,
      y: 0,
      duration: 2,
      scrollTrigger: {
        trigger: "#highlights", // Elemento que dispara a animação
        start: "top 70%",       // Quando o topo da seção chegar a 70% da viewport
        end: "bottom 20%",      // Quando o fundo da seção chegar a 20% da viewport
        toggleActions: "play none none none", // Ação: play quando entrar, nada quando sair
        markers: false, // Defina como true para ver marcadores (útil para debug)
      },
    });
  }, []);

  return (
    <section
      id="highlights"
      className="w-screen overflow-hidden h-full sm:py-32 py-20 sm:px-10 px-5 bg-[#1D1D1F]"
    >
      <div className="mx-auto relative max-w-[1520px]">
        <div className="mb-12 w-full md:flex items-end justify-between">
          <h1
            id="title"
            className="text-white lg:text-5xl md:text-4xl text-3xl lg:mb-0 mb-5 font-bold opacity-0 translate-y-20"
          >
            Estratégias que conectam, engajam e vendem.
          </h1>
        </div>

        <VideoCarousel />
      </div>
    </section>
  );
}