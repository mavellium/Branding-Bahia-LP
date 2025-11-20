"use client";
import Image from "next/image";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// Hook para scroll suave
function useSmoothScroll() {
  useEffect(() => {
    const links = document.querySelectorAll('a[href^="#"]');

    const handleClick = (e: Event) => {
      e.preventDefault();
      const target = (e.currentTarget as HTMLAnchorElement).getAttribute("href");
      if (!target) return;

      const element = document.querySelector(target);
      if (!element) return;

      element.scrollIntoView({ behavior: "smooth" });
    };

    links.forEach((link) => link.addEventListener("click", handleClick));

    return () => {
      links.forEach((link) => link.removeEventListener("click", handleClick));
    };
  }, []);
}

export function Footer() {
  useSmoothScroll();

  return (
    <footer className="bg-[#000000]">
    
    
          {/* Bloco inferior */}
          <div className="bg-[#000000] text-[#DEDEDE] py-[50px] text-base">
            <div className="container flex mx-auto px-5 items-center">
              <div className="flex flex-col justify-self-center items-center text-center w-full">
                {/* <div className="flex gap-[32px] sm:flex-row flex-col justify-center items-center mb-8">
                  <Image
                    src="/faip-logo.webp"
                    alt="Logo da FAIP de Marília/SP"
                    width={166}
                    height={75}
                    priority
                  />
                </div> */}
                <p className="text-lg mt-5 font-medium justify-center items-center flex-col sm:flex-row">
                  &copy; 2025 Branding Bahia. </p>
                <p> Todos os direitos reservados.</p>
                <p
                  className="flex text-[1rem] font-medium justify-center items-center flex-nowrap sm:flex-row"
                  title="Mavellium"
                >Desenvolvido por
                  <Image
                    src={"/logo_mavellium.webp"}
                    height={44}
                    width={130}
                    alt="Desenvolvido pela empresa Mavellium site https://www.mavellium.com.br, acesse nossa página para conhecer nossos serviços!!"
                  />
                </p>
              </div>
            </div>
          </div>
        </footer>
  );
}
