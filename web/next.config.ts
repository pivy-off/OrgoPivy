import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // API rewrites for development (production uses environment variable)
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "/api/:path*", // Keep API routes in Next.js
      },
    ];
  },
};

export default nextConfig;
