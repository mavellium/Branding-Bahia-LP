import Script from 'next/script';
import Faqs from "@/components/Faqs";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Headline } from "@/components/Headline";
import Authority from "@/components/Authority";
import Antithesis from "@/components/Antithesis";
import Video from "@/components/Video";
import Strategic from "@/components/Strategic";
import Services from "@/components/Services";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Branding Bahia", 
    "image": "https://www.brandingbahia.com.br/logo.png",
    "url": "https://www.brandingbahia.com.br", 
    "telephone": "+55-71-XXXXXXXXX",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Salvador",
      "addressRegion": "BA",
      "addressCountry": "BR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -12.9714,
      "longitude": -38.5014
    },
    "description": "Agência de marketing digital em Salvador especializada em tráfego pago, SEO, GEO e automação com IA.", 
    "founder": {
      "@type": "Person",
      "name": "Marcos Ramos"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Serviços de Marketing Digital",
      "itemListElement": [
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "GEO - Generative Engine Optimization" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Tráfego Pago" } }, 
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Automação com IA" } } 
      ]
    }
  };

  return (
    <>
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <Header />
      <main className="bg-black" role="main">
        <Headline /> 
        <Antithesis />
        <Video />
        <Strategic />
        <Services />
        <Authority />
        <Faqs />
      </main>
      <Footer />
    </>
  );
}