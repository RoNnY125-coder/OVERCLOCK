import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const isProduction = process.env.NODE_ENV === "production";
    const railwayUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    if (isProduction) {
      // In production on Vercel:
      // - If NEXT_PUBLIC_API_BASE_URL is set (Railway backend URL), calls go directly
      //   to Railway — no rewrite needed (handled client-side by api.ts).
      // - If no external backend URL is set, fall back to the bundled Python serverless function.
      if (railwayUrl) {
        // No rewrite needed — api.ts uses NEXT_PUBLIC_API_BASE_URL directly.
        return [];
      }
      // Fallback: route to bundled Python serverless function at /api/index
      return [
        {
          source: "/api/backend/:path*",
          destination: "/api/index",
        },
      ];
    }

    // Local dev: proxy to local uvicorn server
    const localBackend =
      process.env.BACKEND_INTERNAL_URL || "http://127.0.0.1:8000";
    return [
      {
        source: "/api/backend/:path*",
        destination: `${localBackend}/:path*`,
      },
    ];
  },
};

export default nextConfig;
