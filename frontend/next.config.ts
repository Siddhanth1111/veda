import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: isProd ? 'https://veda-backend-virid.vercel.app' : 'http://localhost:5000',
    NEXT_PUBLIC_SOCKET_URL: isProd ? 'https://veda-backend-virid.vercel.app' : 'http://localhost:5000',
  }
};

export default nextConfig;
