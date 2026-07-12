import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Cache client du router : un onglet revisité dans les 30 s se raffiche
    // instantanément sans repasser par le serveur (le défaut est 0 s depuis
    // Next 15). `static` couvre les segments entièrement préchargés.
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },
};

export default nextConfig;
