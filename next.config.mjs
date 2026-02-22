/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack(config) {
    // Regla para SVG
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    
    // Regla para JSON (Lottie)
    config.module.rules.push({
      test: /\.json$/,
      type: 'json',
    });
    
    return config;
  },
  images: {
    unoptimized: true,
  },
  turbopack: {}, // Agrega esto para silenciar el error de Turbopack
};

export default nextConfig;