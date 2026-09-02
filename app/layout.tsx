import type { Metadata } from "next";
import { Suspense } from "react";
import { Nunito, Baloo_2 } from "next/font/google";
import "./globals.css";
// Navigation responsive : barre d'onglets en bas (mobile) + sidebar (desktop)
import Navigation from "@/components/Navigation";
// Bandeau du haut, toujours visible (pièces + niveau) façon Clash Royale.
import TopHudLoader from "@/components/TopHudLoader";
// Pastille rouge « coffre à récupérer » posée sur l'onglet Trésor.
import NavChestBadgeLoader from "@/components/NavChestBadgeLoader";
import NavAvatarLoader from "@/components/NavAvatarLoader";
import NavMoiBust from "@/components/NavMoiBust";
// Balayage horizontal (façon Clash Royale) : change d'onglet depuis n'importe
// quel endroit de l'écran.
import SwipeTabs from "@/components/SwipeTabs";
// Rebond sonore aux extrémités : « bwomp » grave quand on tire une liste au-delà
// de son haut ou de son bas (aucun son pendant le défilement normal).
import ScrollEdgeSound from "@/components/ScrollEdgeSound";
// Cadeau de connexion : crédite les pièces du jour au premier passage.
import DailyLoginReward from "@/components/DailyLoginReward";
// Retour matériel du téléphone : reste dans l'app au lieu de la quitter.
import BackGuard from "@/components/BackGuard";
// Toasts globaux (« Enregistré ✓ ») : file lib/toast, aucun provider.
import Toaster from "@/components/Toaster";
import RecompensesProvider from "@/components/recompenses/RecompensesProvider";
// Écran de chargement au lancement, façon jeu mobile (illustration + barre).
import SplashScreen from "@/components/SplashScreen";
// Capteur « le premier écran est peint » : autorise le rideau à lever.
import AppReadyBeacon from "@/components/AppReadyBeacon";
// Gabarit de page : marges de lecture, ou plein écran. Client, pour suivre la
// navigation — cf. son en-tête.
import AppMain from "@/components/AppMain";
import { estPleinEcran } from "@/lib/quiz-chrome";
import { shouldShowSplash, tipOfDay } from "@/lib/splash";
import { getCurrentUser } from "@/lib/supabase/user";
import { headers } from "next/headers";

// DEUX POLICES, PAS SIX. La charte n'en a jamais eu que deux — Nunito pour le
// corps, Baloo 2 pour les titres — mais l'app en téléchargeait six sur CHAQUE
// page : Geist et Geist Mono (survivances d'avant la refonte, plus utilisées
// que comme repli), Bricolage Grotesque (zéro usage dans tout le dépôt) et
// Fredoka (les seules pastilles d'initiales des matières). Six familles, c'est
// six fichiers qui bloquent le premier rendu sur un réseau mobile, pour deux
// qui font le travail.
//
// Et elles sont désormais chargées en VARIABLE : en listant les graisses une à
// une, on demandait un fichier PAR graisse — six pour Nunito, trois pour Baloo.
// Sans `weight`, next/font sert la version variable, un seul fichier qui les
// contient toutes.
const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  display: "swap",
});

const baloo = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Studuel",
  description: "Apprends, teste-toi, progresse — de la 6e à la Terminale.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Utilisateur courant pour l'affichage du lien compte dans la navigation.
  // Vérification LOCALE du jeton (getClaims) et mémoïsée pour la requête : ce
  // layout, le bandeau du haut et la page se partagent une seule résolution,
  // là où chacun payait auparavant son propre aller-retour vers l'Auth API.
  const user = await getCurrentUser();
  const userLabel = user?.user_metadata?.full_name || user?.email || null;

  // Le rideau ne joue que pour le JEU, et uniquement pour un élève connecté :
  // pas devant l'onboarding, la connexion, l'espace parents ni l'admin. Le
  // `x-pathname` est posé par proxy.ts (même mécanique que TopHudLoader).
  const pathname = (await headers()).get("x-pathname") ?? "";
  const showSplash = shouldShowSplash(pathname, Boolean(user));
  // PLEIN ÉCRAN : une session de quiz fait disparaître le bandeau du haut et la
  // barre d'onglets. Pendant l'exercice, l'app s'efface — cf. `lib/quiz-chrome`
  // pour les trois raisons (distraction, compteurs figés, place du pouce).
  //
  // ⚠️ CE VERDICT NE SERT PLUS QU'AU SQUELETTE DU BANDEAU, ci-dessous. Il ne
  // décide plus de l'affichage : ce layout est serveur et n'est PAS re-rendu
  // lors d'une navigation client, donc son verdict reste figé sur la page
  // d'entrée dans l'app. Le masquage est passé dans `Navigation`, `TopHud` et
  // `AppMain`, tous clients, qui le réévaluent à chaque changement de route.
  // Le squelette, lui, n'apparaît qu'au rendu initial : le décider ici est
  // exact, et évite d'envoyer une barre grise sur un quiz ouvert par URL.
  const pleinEcran = estPleinEcran(pathname);

  return (
    <html
      lang="fr"
      // Les variables de police vivent sur <html> : la règle globale
      // `font-sans` s'applique ici, elles doivent y être visibles.
      className={`light ${nunito.variable} ${baloo.variable}`}
    >
      <body className="antialiased">
        {/* Écran de chargement : l'astuce est tirée ici (serveur) pour que les
            deux rendus affichent la même phrase — sinon React signale une
            différence d'hydratation sur le tout premier écran de l'app. */}
        {showSplash ? (
          <SplashScreen tip={tipOfDay(new Date().toISOString().slice(0, 10))} />
        ) : null}
        {/* Mobile first : contenu entre la barre du haut (compte) et la barre
            d'onglets du bas ; sur desktop la sidebar sticky passe à gauche et
            le contenu est centré en largeur de lecture confortable */}
        <div className="flex min-h-screen">
          <BackGuard />
          <ScrollEdgeSound />
          {/* Bandeau du haut streamé : ne bloque pas le rendu de la page. Le
              repli est une barre vide de même hauteur (aucun saut de mise en
              page). */}
          <Suspense
            fallback={
              pleinEcran ? null : (
                <header className="fixed inset-x-0 top-0 z-50 h-14 border-b bg-card/85 backdrop-blur-md md:hidden" />
              )
            }
          >
            {/* Toujours monté : c'est TopHud (client) qui se masque selon la
                route. Le sauter ici le supprimerait pour toute la session,
                ce layout n'étant pas re-rendu en navigation client. */}
            <TopHudLoader />
            {/* Dans la MÊME frontière que le bandeau : React ne révèle une
                frontière que lorsque tous ses enfants sont prêts, donc cette
                balise se monte à l'instant précis où la première vraie
                interface remplace le squelette. C'est ce signal qui autorise
                l'écran de chargement à s'ouvrir. */}
            <AppReadyBeacon />
          </Suspense>
          {/* Idem : la barre se masque elle-même (client) sur les routes sans
              chrome, au lieu d'être absente du rendu serveur. */}
          <Navigation
            userLabel={userLabel}
            // Pastille du Coffre streamée : la barre ne l'attend pas.
            chestBadge={
              <Suspense fallback={null}>
                <NavChestBadgeLoader />
              </Suspense>
            }
            // Avatar de l'onglet Moi, streamé de la même façon. Le repli est le
            // buste dessiné, ici comme dans le chargeur : la case de l'onglet
            // n'est jamais vide, ni pendant l'attente ni après une panne.
            avatarSlot={
              <Suspense fallback={<NavMoiBust />}>
                <NavAvatarLoader />
              </Suspense>
            }
          />
          {user ? <DailyLoginReward /> : null}
          {/* LES RÉCOMPENSES QUI VOLENT (Clash Royale) : monté ICI, autour du
              contenu, et une seule fois pour toute l'application. Les jetons
              doivent survoler la page ENTIÈRE — bandeau compris — donc échapper
              à tout conteneur qui découpe ; et la couche doit être unique,
              sinon deux écrans de fin montés ensemble feraient deux volées et
              deux rafraîchissements concurrents. Il ne rend rien tant que
              personne n'a rien gagné. */}
          <RecompensesProvider>
            <AppMain>
              <SwipeTabs>{children}</SwipeTabs>
            </AppMain>
          </RecompensesProvider>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
