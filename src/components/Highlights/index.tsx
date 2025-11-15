"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";

import VideoCarousel from "../VideoCarousel";

// Se os assets estiverem em /public
// Ex: public/watch.png → "/watch.png"
const watchImg = "/watch.png";
const rightImg = "/right.png";

export default function Highlights() {
  useGSAP(() => {
    gsap.to("#title", { opacity: 1, y: 0 });
    gsap.to(".link", { opacity: 1, y: 0, duration: 1, stagger: 0.25 });
  }, []);

  return (
    <section
      id="highlights"
      className="w-screen overflow-hidden h-full sm:py-32 py-20 sm:px-10 px-5 bg-[#1D1D1F]"
    >
      <div className="mx-auto relative max-w-[1120px]">
        <div className="mb-12 w-full md:flex items-end justify-between">
          <h1 id="title" className="text-gray lg:text-5xl md:text-4xl text-3xl lg:mb-0 mb-5 font-medium opacity-0 translate-y-20">
            Estratégias que conectam, engajam e vendem.
          </h1>
        </div>

        <VideoCarousel />
      </div>
    </section>
  );
}
