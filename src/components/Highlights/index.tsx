"use client";

import { useGSAP } from "@gsap/react";
import { useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import VideoCarousel from "../VideoCarousel";

// Registrar o plugin ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface HighlightItem {
  video: string;
  textLists: string[];
  videoDuration: string;
}

interface ApiResponse {
  id: string;
  type: string;
  values: HighlightItem[];
  createdAt: string;
}

const watchImg = "/watch.png";
const rightImg = "/right.png";

export default function Highlights() {
  const [highlightsData, setHighlightsData] = useState<HighlightItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Função para fazer fetch com proxy CORS SEM CACHE
  const fetchWithCorsProxy = async (url: string) => {
    // Gerar um timestamp único para evitar cache
    const timestamp = Date.now();
    const urlWithNoCache = `${url}${url.includes('?') ? '&' : '?'}_=${timestamp}`;
    
    // Lista de proxies CORS públicos (fallback se um falhar)
    const proxies = [
      `https://corsproxy.io/?${encodeURIComponent(urlWithNoCache)}`,
      `https://api.allorigins.win/get?url=${encodeURIComponent(urlWithNoCache)}`,
      `https://cors-anywhere.herokuapp.com/${urlWithNoCache}`
    ];

    for (let i = 0; i < proxies.length; i++) {
      try {
        console.log(`Tentando proxy ${i + 1}: ${proxies[i]}`);
        
        const response = await fetch(proxies[i], {
          headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          },
          cache: 'no-store', // Desativa completamente o cache
        });

        if (!response.ok) {
          console.log(`Proxy ${i + 1} falhou: ${response.status}`);
          continue; // Tenta o próximo proxy
        }

        const data = await response.json();
        
        // Diferentes proxies retornam formatos diferentes
        if (proxies[i].includes('allorigins.win')) {
          // api.allorigins.win retorna { contents: JSON string }
          return JSON.parse(data.contents);
        } else if (proxies[i].includes('corsproxy.io') || proxies[i].includes('cors-anywhere')) {
          // corsproxy.io e cors-anywhere retornam o JSON diretamente
          return data;
        }
      } catch (err) {
        console.error(`Erro com proxy ${i + 1}:`, err);
        // Continua para o próximo proxy
      }
    }
    
    throw new Error('Todos os proxies CORS falharam');
  };

  // Buscar dados diretamente da URL com proxy CORS
  useEffect(() => {
    const fetchHighlights = async () => {
      try {
        setLoading(true);
        const targetUrl = 'https://dashboard-brandingbahia.vercel.app/api/form/hightlights';
        console.log('Iniciando fetch com proxy CORS para:', targetUrl);
        
        const data = await fetchWithCorsProxy(targetUrl);
        
        console.log('Dados recebidos:', data);
        
        // Transformar os dados da API
        const allHighlights: HighlightItem[] = data.flatMap((item: ApiResponse) => item.values);
        
        setHighlightsData(allHighlights);
        setError(null);
      } catch (err) {
        console.error('Erro ao buscar dados dos highlights:', err);
        setError('Erro ao carregar os destaques. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchHighlights();
  }, []);

  useGSAP(() => {
    if (highlightsData.length === 0) return;

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
  }, [highlightsData.length]);

  // Estados de loading e error
  if (loading) {
    return (
      <section
        id="highlights"
        className="w-screen overflow-hidden h-full sm:py-32 py-20 sm:px-10 px-5 bg-[#1D1D1F]"
      >
        <div className="mx-auto relative max-w-[1520px]">
          <div className="text-white text-center py-10">
            Carregando destaques...
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section
        id="highlights"
        className="w-screen overflow-hidden h-full sm:py-32 py-20 sm:px-10 px-5 bg-[#1D1D1F]"
      >
        <div className="mx-auto relative max-w-[1520px]">
          <div className="text-red-500 text-center mb-4">
            {error}
          </div>
          <div className="text-center">
            <button 
              onClick={() => window.location.reload()}
              className="bg-[#0C8BD2] hover:bg-[#0C8BD2]/80 text-white px-4 py-2 rounded"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (highlightsData.length === 0) {
    return (
      <section
        id="highlights"
        className="w-screen overflow-hidden h-full sm:py-32 py-20 sm:px-10 px-5 bg-[#1D1D1F]"
      >
        <div className="mx-auto relative max-w-[1520px]">
          <div className="text-white text-center py-10">
            Nenhum destaque encontrado.
          </div>
        </div>
      </section>
    );
  }

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

        <VideoCarousel highlightsData={highlightsData} />
      </div>
    </section>
  );
}