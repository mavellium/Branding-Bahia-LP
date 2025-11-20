'use client'
import Image from "next/image";
import { useState } from "react";

export default function About() {
    const [activeTab, setActiveTab] = useState(1);

    return (
        <section className="w-full px-4 sm:px-6 lg:px-10 bg-black">
            <div className="flex flex-col-reverse lg:flex-row p-4 sm:p-8 lg:p-10 gap-6 lg:gap-10 justify-center items-center">
                <div className="w-full max-w-[1000px] lg:max-w-[1200px] bg-[#1D1D1F] p-6 sm:p-10 lg:p-15 rounded-3xl lg:rounded-4xl">
                    <h2 className="font-bold text-sm sm:text-[15px] lg:text-[16px] text-white pb-2">
                        Quem está por trás
                    </h2>
                    <h1 className="font-bold text-2xl sm:text-3xl lg:text-4xl xl:text-[48px] text-white mb-6 lg:mb-10">
                        Marcos Ramos
                    </h1>

                    <div className="flex flex-col items-start justify-start w-full max-w-[700px]">
                        <div className="flex w-full mb-4 lg:mb-3">
                            {/* Botão 1 */}
                            <button
                                onClick={() => setActiveTab(1)}
                                className={`py-3 px-3 sm:px-3 lg:px-4 flex-1 rounded-l-lg font-bold cursor-pointer text-xs sm:text-sm lg:text-[16px] transition-all duration-300
                                    ${activeTab === 1
                                        ? 'text-white bg-[#2C2C2C]'
                                        : 'bg-[#040404] text-white hover:bg-[#040404]/30 hover:text-white'
                                    }`}
                                aria-label="Botão Fundador da Branding Bahia"
                            >
                                Fundador da Branding Bahia
                            </button>

                            {/* Botão 2 */}
                            <button
                                onClick={() => setActiveTab(2)}
                                className={`py-3 px-3 sm:px-3 lg:px-4 flex-1 rounded-r-lg font-bold cursor-pointer text-xs sm:text-sm lg:text-[16px] transition-all duration-300
                                    ${activeTab === 2
                                        ? 'text-white bg-[#2C2C2C]'
                                        : 'bg-[#040404] text-white hover:bg-[#040404]/30 hover:text-white'
                                    }`}
                                aria-label="Como eu gero renda para as pessoas"
                            >
                                Como eu gero renda para as pessoas
                            </button>
                        </div>

                        <div className="bg-[#040404] p-4 sm:p-6 lg:p-8 rounded-lg w-full max-w-full lg:max-w-[700px]">
                            {activeTab === 1 && (
                                <div className="text-[#F0F0F0] flex flex-col gap-3 sm:gap-4 lg:gap-5 min-h-[100px] sm:min-h-[120px] lg:min-h-[150px]">
                                    <span className="text-sm sm:text-base">Marcos criou a Agência Branding Bahia para ajudar empreendedores a venderem de forma prática e estratégica.</span>
                                    <span className="text-sm sm:text-base">A agência atua no estado da Bahia, com foco em tráfego pago, criação de campanhas de alta performance e estruturação de vendas para produtos físicos.</span>
                                </div>
                            )}

                            {activeTab === 2 && (
                                <div className="text-[#F0F0F0] flex flex-col gap-3 sm:gap-4 lg:gap-5 min-h-[100px] sm:min-h-[120px] lg:min-h-[150px]">
                                    <span className="text-sm sm:text-base">Consultor certificado oficialmente pelo Mercado Livre em vendas e estruturação de lojas na plataforma.</span>
                                    <span className="text-sm sm:text-base">Já ajudou dezenas de vendedores a crescerem no maior marketplace da América Latina, utilizando anúncios otimizados, posicionamento estratégico e técnicas práticas que aumentam visibilidade, tráfego e conversão.</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}