import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nhvuujzfmyjusmrtrxst.supabase.co",
        pathname: "/storage/v1/object/public/flowers/products/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },

  experimental: {
    serverActions: {
      bodySizeLimit: "1mb",
      allowedOrigins: ["https://example.com"],
    },
  },
};

export default nextConfig;
