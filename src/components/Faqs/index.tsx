'use client';

import { useState, useEffect } from 'react';

interface FaqItem {
  question: string;
  answer: string;
}

interface ApiResponse {
  id: string;
  type: string;
  values: FaqItem[];
  createdAt: string;
}

export default function Faqs() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [faqData, setFaqData] = useState<FaqItem[]>([]);
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
    const fetchFaqs = async () => {
      try {
        setLoading(true);
        const targetUrl = 'https://dashboard-brandingbahia.vercel.app/api/form/faq';
        console.log('Iniciando fetch com proxy CORS para:', targetUrl);
        
        const data = await fetchWithCorsProxy(targetUrl);
        
        console.log('Dados recebidos:', data);
        
        // Transformar os dados da API: extrair todos os itens do array `values` de cada objeto
        const allFaqs: FaqItem[] = data.flatMap((item: ApiResponse) => item.values);
        
        setFaqData(allFaqs);
        setError(null);
      } catch (err) {
        console.error('Erro ao buscar dados do FAQ:', err);
        setError('Erro ao carregar as perguntas frequentes. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Estados de loading e error
  if (loading) {
    return (
      <section className="w-full bg-black flex flex-col items-center text-center py-20 px-10">
        <h1 className="text-3xl mb-8 text-white font-semibold">
          Perguntas frequentes
        </h1>
        <div className="text-white">Carregando...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full bg-black flex flex-col items-center text-center py-20 px-10">
        <h1 className="text-3xl mb-8 text-white font-semibold">
          Perguntas frequentes
        </h1>
        <div className="text-red-500 mb-4">{error}</div>
        <button 
          onClick={() => window.location.reload()}
          className="bg-[#0C8BD2] hover:bg-[#0C8BD2]/80 text-white px-4 py-2 rounded"
        >
          Tentar Novamente
        </button>
      </section>
    );
  }

  if (faqData.length === 0) {
    return (
      <section className="w-full bg-black flex flex-col items-center text-center py-20 px-10">
        <h1 className="text-3xl mb-8 text-white font-semibold">
          Perguntas frequentes
        </h1>
        <div className="text-white">Nenhuma pergunta frequente encontrada.</div>
      </section>
    );
  }

  return (
    <section className="w-full bg-black flex flex-col items-center text-center py-20 px-10">
      <h1 className="text-3xl mb-8 text-white font-semibold">
        Perguntas frequentes
      </h1>

      <div className="flex flex-col w-full max-w-3xl gap-4">
        {faqData.map((item, index) => (
          <div
            key={index}
            className="bg-[#1D1D1F] rounded-lg cursor-pointer"
            onClick={() => toggle(index)}
          >
            {/* Pergunta */}
            <button
              className="w-full flex justify-between items-center p-4 text-left text-white font-bold"
              aria-expanded={openIndex === index}
            >
              <h2>{item.question}</h2>

              <span
                className={`transition-transform duration-300 ${
                  openIndex === index ? 'rotate-[-90deg]' : ''
                }`}
              >
                {/* SVG Arrow */}
                <svg width="10" height="15" viewBox="0 0 10 15">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M7.79282 0.292969L9.20703 1.70718L3.41414 7.50008L9.20703 13.293L7.79282 14.7072L0.585711 7.50008L7.79282 0.292969Z"
                    fill="#F0F0F0"
                  />
                </svg>
              </span>
            </button>

            {/* Resposta */}
            {openIndex === index && (
              <div className="px-4 pb-4 text-white text-start animate-fadeIn">
                <p>{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}