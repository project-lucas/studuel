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
    // Porté de 30 s à 2 min le 22/08/2026. Chaque onglet est une page
    // entièrement dynamique (10 à 15 requêtes Supabase) : revenir dessus au
    // bout de 40 s la faisait entièrement recalculer, alors que rien n'avait
    // bougé. Deux minutes couvrent un aller-retour normal entre onglets, et les
    // mutations qui comptent (XP, gemmes, trophées) appellent déjà
    // `revalidatePath`, donc elles cassent le cache quand il le faut.
    staleTimes: {
      dynamic: 120,
      static: 300,
    },
  },
};

export default nextConfig;
