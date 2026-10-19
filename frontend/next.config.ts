import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  ...(process.env.GITHUB_PAGES === "true" ? { output: "export" as const } : {}),
  basePath:
    process.env.GITHUB_PAGES === "true" ? "/mcdelivery-aem-platform" : "",
  images: {
    unoptimized: true,
    localPatterns: [
      {
        pathname: "/api/aem-asset",
      },
    ],
  },
};

export default nextConfig;
