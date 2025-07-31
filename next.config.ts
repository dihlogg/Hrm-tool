import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    ppr: false, // Tắt PPR
  },
};

export default nextConfig;