/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: "/docs/menu-dorada-foods.pdf",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
