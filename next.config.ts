import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Manual service worker registration found in layout.tsx. 
  // Custom PWA logic is in public/sw.js.
  typescript: {
    ignoreBuildErrors: true, // For rapid prototyping
  }
};

export default nextConfig;
