import type { NextConfig } from "next";
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/pim',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
