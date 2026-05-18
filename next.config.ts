import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  trailingSlash: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
      },
    ],
  },
};

export default nextConfig;
