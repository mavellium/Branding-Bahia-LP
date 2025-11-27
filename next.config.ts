/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['mavellium.com.br'],
    // Ou use remotePatterns para mais controle (versões mais recentes do Next.js)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mavellium.com.br',
        port: '',
        pathname: '/uploads_bahia/**',
      },
    ],
  },
}

module.exports = nextConfig