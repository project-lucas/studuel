import type { MetadataRoute } from "next";

// Manifest PWA : permet d'installer Studuel sur l'écran d'accueil
// (icône, plein écran sans barre d'adresse, splash aux couleurs de la marque).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Studuel",
    short_name: "Studuel",
    description: "Apprends, teste-toi, progresse — de la 6e à la Terminale.",
    start_url: "/",
    // Identité stable de l'app installée. Sans `id`, elle est dérivée de
    // `start_url` : un changement de page d'accueil créerait un DOUBLON sur
    // l'écran d'accueil au lieu de mettre à jour l'app existante. `"/"` résout
    // vers l'identité actuelle, donc l'ajouter ne casse rien.
    id: "/",
    display: "standalone",
    // Valeurs figées des tokens --background et --primary de globals.css (le
    // manifest ne peut pas lire les variables CSS). ⚠️ Elles avaient dérivé :
    // le splash s'ouvrait blanc-bleu puis basculait brutalement sur le crème,
    // et la barre de statut restait indigo. À resynchroniser à la main si les
    // tokens changent.
    background_color: "#ede7d6",
    theme_color: "#7a3fe0",
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
