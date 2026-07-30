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
    // `background_color` = fond du splash SYSTÈME (celui que l'OS affiche
    // pendant le lancement, avant le moindre pixel de l'app). Il doit donc
    // s'accorder au HAUT de notre propre écran de chargement — violet profond
    // de public/images/splash.webp une fois son voile de lecture appliqué — et
    // NON au crème de l'app : sinon le lancement enchaîne deux rideaux, crème
    // puis violet, avec une coupure franche entre les deux. L'élève doit voir
    // un seul rideau, du tap sur l'icône jusqu'au hub.
    // (Contrepartie assumée : un compte non connecté part sur /bienvenue en
    // crème, avec une transition moins douce — cas rare pour une app installée.)
    background_color: "#2e1d52",
    // Barre de statut : valeur figée du token --primary de globals.css (le
    // manifest ne peut pas lire les variables CSS). À resynchroniser à la main
    // si le violet de marque change.
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
