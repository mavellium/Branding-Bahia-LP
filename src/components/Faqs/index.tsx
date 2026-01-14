'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import Script from 'next/script'; // Import essencial para GEO

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqContent {
  title: string;
  subtitle: string;
  questions: FaqItem[];
  cta: { text: string; link: string };
}

export default function Faqs() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [content, setContent] = useState<FaqContent | null>(null);

  useEffect(() => {
    async function fetchFaqs() {
      const mockData: FaqContent = {
        title: "Dúvidas.",
        subtitle: "E respostas.",
        questions: [
          {
            question: "O que é o SEO e GEO que vocês mencionam?",
            answer: "Fazemos sua marca aparecer no topo do Google (SEO) e ser a resposta recomendada em IAs como ChatGPT e Gemini (GEO). Atuamos para que você seja autoridade máxima onde o cliente busca soluções[cite: 208, 209, 265]."
          },
          {
            question: "Como a IA ajuda no atendimento da minha empresa?",
            answer: "Implementamos chatbots inteligentes para WhatsApp e redes sociais que qualificam leads e respondem dúvidas 24h por dia, acelerando a conversão e economizando tempo operacional[cite: 203, 224, 261]."
          },
          {
            question: "Como funciona o marketing de autoridade para médicos?",
            answer: "Criamos estratégias éticas e personalizadas para fortalecer sua presença digital, aumentar a credibilidade e atrair pacientes qualificados via Google e motores de busca por IA[cite: 210, 212, 228, 250]."
          },
          {
            question: "Como o BPM e CRM ajudam meu processo comercial?",
            answer: "Mapeamos e otimizamos seus processos de venda (BPM) e integramos o CRM para organizar seu funil, garantindo que nenhuma oportunidade seja perdida e a equipe opere com alta produtividade[cite: 213, 215, 229, 269]."
          }
        ],
        cta: {
          text: "Pronto para escalar? Solicite um diagnóstico estratégico",
          link: "https://wa.me/55719XXXXXXXX"
        }
      };
      setContent(mockData);
    }
    fetchFaqs();
  }, []);

  if (!content) return null;

  // Estrutura de Dados FAQPage para indexação profunda por LLMs
  const structuredFaqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": content.questions.map((item) => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  return (
    <section className="w-full bg-[#000000] py-40 px-6">
  
      <Script
        id="faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredFaqData) }}
      />
      
      <div className="max-w-[800px] mx-auto">
        
        <div className="mb-24 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-[48px] md:text-[64px] font-semibold text-white tracking-[-0.03em] leading-tight"
          >
            {content.title} <br />
            <span className="text-[#86868b]">{content.subtitle}</span>
          </motion.h2>
        </div>

        <div className="border-t border-white/10">
          {content.questions.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <article key={index} className="border-b border-white/10 overflow-hidden">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex justify-between items-center py-8 text-left outline-none group"
                  aria-expanded={isOpen}
                >
                  <span className={`text-xl md:text-2xl font-medium tracking-tight transition-colors duration-500 ${
                    isOpen ? 'text-white' : 'text-[#f5f5f7] opacity-80 group-hover:opacity-100'
                  }`}>
                    {item.question}
                  </span>
                  
                  <div className={`transition-transform duration-500 flex items-center justify-center ${isOpen ? 'rotate-45 text-white' : 'text-[#86868b]'}`}>
                    <Icon icon="ph:plus-light" className="text-3xl font-light" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                    >
                      <div className="pb-10 text-[#86868b] text-lg md:text-xl leading-relaxed max-w-[650px] font-normal tracking-tight">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </article>
            );
          })}
        </div>

        <div className="mt-20 text-center">
            <a 
              href={content.cta.link} 
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center text-[#0C8BD2] text-xl font-medium hover:underline decoration-1 underline-offset-8 transition-all"
            >
              {content.cta.text}
              <Icon icon="ph:arrow-right-bold" className="ml-2 text-sm transition-transform group-hover:translate-x-2" />
            </a>
        </div>
      </div>
    </section>
  );
}