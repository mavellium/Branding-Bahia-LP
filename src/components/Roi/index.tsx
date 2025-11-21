"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";



export function Roi() {
  useGSAP(() => {
    // Configurar a animação com ScrollTrigger
    gsap.to("#card", {
      opacity: 1,
      y: 0,
      duration: 2,
      stagger: 0.5,

      scrollTrigger: {
        trigger: "#roi", // Elemento que dispara a animação
        start: "top 70%",       // Quando o topo da seção chegar a 70% da viewport
        end: "bottom 20%",      // Quando o fundo da seção chegar a 20% da viewport
        toggleActions: "play none none none", // Ação: play quando entrar, nada quando sair
        markers: false, // Defina como true para ver marcadores (útil para debug)
      },
    });
  }, []);
  return (
    <section className="flex flex-col w-full justify-center items-center bg-black py-10 md:py-20 px-4 sm:px-6 lg:px-8" id="roi">
      <div className="flex flex-col lg:flex-row justify-center items-center gap-6 md:gap-8 lg:gap-10 w-full max-w-6xl">
        
        {/* Primeiro Card */}
        <div id="card" className="bg-[#1D1D1F] w-full max-w-[400px] lg:max-w-none lg:w-1/2 h-auto min-h-[500px] sm:min-h-[550px] flex flex-col justify-between items-center rounded-3xl p-6 sm:px-8 sm:pt-8 pb-0 opacity-0 translate-y-20">
          <div className="w-full">
            <h2 className="text-white font-bold text-lg sm:text-xl md:text-2xl mb-4 sm:mb-6">
              Aumentar seu ROI e diminuir seu CAC.
              <span className="block text-[#86868B] text-base sm:text-lg md:text-xl font-normal mt-2">
                Na Mavellium, aumentamos seu ROI através do desenvolvimento web de Landing Pages e Sites Institucionais, integramos SEO e GEO.
              </span>
            </h2>
          </div>
          <div className="flex justify-center items-end w-full mt-4">
            <Image
              src="/celular-roi.png"
              width={500}
              height={500}
              alt="Celular"
              className="w-48 sm:w-56 md:w-64 lg:w-72"
            />
          </div>
        </div>

        {/* Segundo Card */}
        <div id="card" className="bg-[#1D1D1F] w-full max-w-[400px] lg:max-w-none lg:w-1/2 h-auto min-h-[500px] sm:min-h-[550px] flex flex-col justify-between items-center rounded-3xl p-6 sm:px-8 sm:pt-8 pb-0 opacity-0 translate-y-20">
          <div className="w-full">
            <h2 className="text-white font-bold text-lg sm:text-xl md:text-2xl mb-4 sm:mb-6">
              Aumentar seu ROI e diminuir seu CAC.
              <span className="block text-[#86868B] text-base sm:text-lg md:text-xl font-normal mt-2">
                Na Mavellium, aumentamos seu ROI através do desenvolvimento web de Landing Pages e Sites Institucionais, integramos SEO e GEO.
              </span>
            </h2>
          </div>
          <div className="flex justify-center items-end w-full mt-4">
            <Image
              src="/celular-roi.png"
              width={500}
              height={500}
              alt="Celular"
              className="w-48 sm:w-56 md:w-64 lg:w-72"
            />
          </div>
        </div>

      </div>
    </section>
  );
}