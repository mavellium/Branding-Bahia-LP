import { Button } from "../ui/button";

export function Headline() {
    return (
        <section className="relative w-full flex flex-col justify-center md:items-start lg:items-center overflow-hidden bg-white h-[70vh] sm:h-[75vh] md:h-[80vh] lg:h-screen py-10">
            {/* Imagem de fundo */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/headline-bg.png"
                    alt="Background"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Efeito de escurecido (gradiente inferior) */}
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Conteúdo */}
            <div className="container relative z-20">
                <div className="sm:max-w-md md:max-w-2xl text-white md:text-left px-10 md:px-5 lg:px-10 space-y-[-8px]">
                    <h1 className="font-heading font-bold text-[38px] sm:text-[55px] leading-10  sm:leading-6 md:leading-22 md:text-[80px]">
                        Mais tráfego,
                        <span className="block text-5xl sm:text-[70px] font-medium leading-14 sm:leading-22 md:leading-20 md:text-[105px]">mais leads</span>
                    </h1>
                    <p className="font-heading font-medium tracking-tight text-[17px] sm:leading-5 md:leading-15 sm:text-2xl md:text-4xl">e mais vendas para seu negócio</p>

                    <Button className="w-full max-w-[170px] sm:max-w-[200px] h-9 md:h-12 text-white bg-[#0C8BD2] mt-8 md:mt-5 flex justify-center items-center rounded-full">
                        <h1 className="text-md font-medium">QUERO MAIS LEADS</h1>
                    </Button>
                </div>
            </div>
        </section>
    );
}
