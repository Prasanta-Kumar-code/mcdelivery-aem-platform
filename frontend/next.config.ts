import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: "/api/aem-asset",
      },
    ],
  },
};

export default nextConfig;
