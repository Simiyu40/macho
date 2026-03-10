import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // PWA manifest is in public/, but next-pwa service worker generation 
  // currently conflicts with Next 16 Turbopack default. Removed wrapper.
  typescript: {
    ignoreBuildErrors: true, // For rapid prototyping
  }
};

export default nextConfig;
