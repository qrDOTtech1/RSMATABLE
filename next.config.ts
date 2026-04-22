import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Expose uniquement les vars publiques au client
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL ?? "",
  },
};

export default nextConfig;
