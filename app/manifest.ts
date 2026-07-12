import type { MetadataRoute } from "next";

// Manifest PWA : permet d'installer Scolaria sur l'écran d'accueil
// (icône, plein écran sans barre d'adresse, splash indigo).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Scolaria",
    short_name: "Scolaria",
    description: "Apprends, teste-toi, progresse — de la 6e à la Terminale.",
    start_url: "/",
    display: "standalone",
    // Valeurs figées des tokens --background et --primary (le manifest
    // ne peut pas lire les variables CSS, il exige des couleurs statiques).
    background_color: "#fcfcfe",
    theme_color: "#312e81",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
