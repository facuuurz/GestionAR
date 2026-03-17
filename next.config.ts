import type { NextConfig } from "next";

// This helps invalidate sessions across restarts in development when JWT_SECRET_KEY is missing
const getDevelopmentSecret = () => {
  if (process.env.JWT_SECRET_KEY) return process.env.JWT_SECRET_KEY;
  if (process.env.NODE_ENV === "production") return "gestionar-super-secret-key";
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

const nextConfig: NextConfig = {
  env: {
    RUNTIME_JWT_SECRET: getDevelopmentSecret(),
  },
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
};

export default nextConfig;
