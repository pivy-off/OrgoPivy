import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

/** Force Turbopack to treat this folder as the app root (avoids wrong lockfile / parent detection). */
const turbopackRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: turbopackRoot,
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
