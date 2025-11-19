'use client';

import { useState } from 'react';

const faqData = [
  {
    question: "Nossos serviços são padronizados?",
    answer: "Não. Nossa estratégia é 100% personalizada com base no diagnóstico do seu negócio."
  },
  {
    question: "Qual o prazo para ver resultados?",
    answer: "Resultados variam, mas nosso foco é otimizar o funil para que você veja retorno sobre o investimento o mais rápido possível."
  },
  {
    question: "Minha empresa é muito pequena, vocês atendem?",
    answer: "Sim! Atendemos pequenas e médias empresas que buscam crescimento real."
  },
  {
    question: "Vocês oferecem garantia de resultados?",
    answer: "Nosso 'skin in the game' é trabalhar em conjunto para alcançar os objetivos. O resultado é construído com base na estratégia e execução em parceria. (Se houver garantia formal, insira aqui)."
  },
  {
    question: "Vocês oferecem garantia de resultados?",
    answer: "Nosso 'skin in the game' é trabalhar em conjunto para alcançar os objetivos. O resultado é construído com base na estratégia e execução em parceria. (Se houver garantia formal, insira aqui)."
  },
  {
    question: "Vocês oferecem garantia de resultados?",
    answer: "Nosso 'skin in the game' é trabalhar em conjunto para alcançar os objetivos. O resultado é construído com base na estratégia e execução em parceria. (Se houver garantia formal, insira aqui)."
  },
  {
    question: "Vocês oferecem garantia de resultados?",
    answer: "Nosso 'skin in the game' é trabalhar em conjunto para alcançar os objetivos. O resultado é construído com base na estratégia e execução em parceria. (Se houver garantia formal, insira aqui)."
  }
];

export default function Faqs() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

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
