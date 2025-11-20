import type { Metadata } from "next";
import { Albert_Sans } from "next/font/google";
import "./globals.css";

const albert = Albert_Sans({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Branding Bahia - Tráfego, Sites, CRM e Marketing para Saúde",
  description:
    "Sua parceira em crescimento digital. Oferecemos gestão de Tráfego, SEO+GEO, Marketing para Médicos e Mapeamento de Processos Comerciais (BPM). Peça uma proposta.",
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
