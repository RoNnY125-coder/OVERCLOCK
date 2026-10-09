import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // In local development, proxy /api/backend/* → local backend server
    // In production (Vercel), NEXT_PUBLIC_API_BASE_URL is set to the Railway URL directly
    // so no rewrite is needed — the frontend calls Railway directly.
    if (process.env.NODE_ENV !== "development") {
      return [];
    }

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
