import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const isProduction = process.env.NODE_ENV === "production";
    const localBackendUrl = process.env.BACKEND_INTERNAL_URL;

    if (isProduction) {
      // On Vercel: route API calls to the Python serverless function
      return [
        {
          source: "/api/backend/:path*",
          destination: "/api/index",
        },
      ];
    }

    // Local dev: proxy to local uvicorn server
    return [
      {
        source: "/api/backend/:path*",
        destination: `${localBackendUrl || "http://127.0.0.1:8000"}/:path*`,
      },
    ];
  },
};

export default nextConfig;
