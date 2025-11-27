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

  // Buscar dados da API
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/faq');;
        
        if (!response.ok) {
          throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }
        
        const data: ApiResponse[] = await response.json();
        
        // Transformar os dados da API: extrair todos os itens do array `values` de cada objeto
        const allFaqs: FaqItem[] = data.flatMap(item => item.values);
        
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