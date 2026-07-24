import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pastille « N » de développement (indicateur de route Next) : masquée. Elle
  // se posait en bas à gauche et chevauchait la barre d'onglets. Dev-only par
  // nature (jamais dans un build de prod) — on la coupe aussi en dev pour ne
  // pas polluer l'aperçu mobile. Les erreurs de compilation restent affichées.
  devIndicators: false,
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
