import type { Metadata } from "next";
import { Albert_Sans } from "next/font/google";
import "./globals.css";

const albert = Albert_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mavellium | Especialistas em Landing Pages de Alta Conversão",
  description:
    "Pare de perder dinheiro com anúncios. Criamos landing pages otimizadas (Velocidade, UX e Copy) que diminuem seu Custo por Lead (CPA) e maximizam seu ROI. Peça um diagnóstico.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br" className={`${albert.className} overflow-x-hidden`}>
      <body className="antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
