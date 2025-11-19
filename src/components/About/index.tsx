'use client'
import Image from "next/image";
import { useState } from "react";

export default function About() {
    const [activeTab, setActiveTab] = useState(1);

    return (
        <section className="w-full px-5 sm:px-10 bg-black">
            <div className="flex flex-col-reverse lg:flex-row p-5 sm:p-10 gap-10 justify-start items-center">
                <div className="w-full max-w-[1200px] bg-[#1D1D1F] p-15 rounded-4xl">
                    <h2 className="font-bold sm:text-[16px] text-white text-[14px] pb-2">
                        Quem está por trás
                    </h2>
                    <h1 className="font-bold sm:text-[48px] text-white text-[36px] mb-10">
                        Marcos Ramos
                    </h1>

                    <div className="flex flex-col items-start justify-start">
                        <div className="flex mb-3">
                            {/* Botão 1 */}
                            <button
                                onClick={() => setActiveTab(1)}
                                className={`py-3 px-2 sm:px-4 rounded-l-lg font-bold cursor-pointer sm:text-[16px] text-[12px] transition-all duration-300
                                    ${activeTab === 1
                                        ? 'text-white bg-[#2C2C2C]'
                                        : 'bg-[#040404] text-white hover:bg-[#040404]/30 hover:text-white'
                                    }
                                    ${activeTab !== 1 ? 'hover:brightness-125' : ''}`}
                                aria-label="Botão Fundador da Branding Bahia"
                            >
                                Fundador da Branding Bahia
                            </button>

                            {/* Botão 2 */}
                            <button
                                onClick={() => setActiveTab(2)}
                                className={`py-3 px-2 sm:px-4 rounded-r-lg font-bold cursor-pointer sm:text-[16px] text-[14px] transition-all duration-300
                                    ${activeTab === 2
                                        ? 'text-white bg-[#2C2C2C]'
                                        : 'bg-[#040404] text-white hover:bg-[#040404]/30 hover:text-white'
                                    }`}
                                aria-label="Como eu gero renda para as pessoas"
                            >
                                Como eu gero renda para as pessoas
                            </button>
                        </div>

                        <div className="bg-[#040404] p-8 rounded-lg max-w-[700px]">
                            {activeTab === 1 && (
                                <p className="text-[#F0F0F0] flex flex-col gap-5 lg:min-h-[150px] lg:max-h-[150px]">
                                    <span>Marcos criou a Agência Branding Bahia para ajudar empreendedores a venderem de forma prática e estratégica.</span>
                                    <span>A agência atua no estado da Bahia, com foco em tráfego pago, criação de campanhas de alta performance e estruturação de vendas para produtos físicos.</span>
                                </p>
                            )}

                            {activeTab === 2 && (
                                <p className="text-[#F0F0F0] flex flex-col gap-5 lg:min-h-[150px] lg:max-h-[150px]">
                                    <span>Consultor certificado oficialmente pelo Mercado Livre em vendas e estruturação de lojas na plataforma.</span>
                                    <span>Já ajudou dezenas de vendedores a crescerem no maior marketplace da América Latina, utilizando anúncios otimizados, posicionamento estratégico e técnicas práticas que aumentam visibilidade, tráfego e conversão.</span>
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
