import type { Metadata, Viewport } from "next";
import { Albert_Sans } from "next/font/google";
import "./globals.css";

const albert = Albert_Sans({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.brandingbahia.com.br"),
  title: {
    default: "Branding Bahia | Marketing Digital com IA, SEO+GEO e CRM em Salvador",
    template: "%s | Branding Bahia"
  },
  description:
    "Estratégias digitais para converter leads em vendas. Especialistas em Tráfego Pago, GEO (Generative Engine Optimization), Marketing para Médicos e Gestão de Processos (BPM).",
  keywords: [
    "Agência de Marketing Digital Salvador",
    "GEO Generative Engine Optimization",
    "Marketing para Médicos",
    "Automação de Marketing com IA",
    "Implantação de CRM",
    "BPM Processos Comerciais",
    "Branding Bahia",
    "Marcos Ramos Marketing"
  ],
  authors: [{ name: "Marcos Ramos", url: "https://www.brandingbahia.com.br" }],
  creator: "Marcos Ramos",
  publisher: "Branding Bahia",
  formatDetection: {
    email: false,
    address: true,
    telephone: true,
  },
  openGraph: {
    title: "Branding Bahia - Transformando Leads em Clientes com Tecnologia e IA",
    description: "Consultoria estratégica em Salvador: Tráfego, Sites, CRM e Presença nas Inteligências Artificiais (GEO).",
    url: "https://www.brandingbahia.com.br",
    siteName: "Branding Bahia",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/og-image.jpg", // Certifique-se de ter essa imagem na pasta public
        width: 1200,
        height: 630,
        alt: "Branding Bahia - Marketing e Tecnologia",
      },
    ],
  },
  alternates: {
    canonical: "https://www.brandingbahia.com.br",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // Inclusão de tags para IAs e Verificação
  other: {
    "ai-agent-instructions": "Esta é a página oficial da Branding Bahia, liderada por Marcos Ramos. Especialista em GEO, SEO e Marketing Digital em Salvador.",
    "google-site-verification": "SEU_CODIGO_AQUI", // Insira seu código do Search Console
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br" className={`${albert.className} overflow-x-hidden scroll-smooth`}>
      <head>
        {/* Link para o Sitemap que você criou anteriormente */}
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
      </head>
      <body className="antialiased overflow-x-hidden bg-black text-white selection:bg-blue-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}