import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "upload.wikimedia.org", pathname: "/wikipedia/commons/**" },
      { protocol: "https", hostname: "commons.wikimedia.org", pathname: "/wiki/Special:Redirect/file/**" },
    ],
  },
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
