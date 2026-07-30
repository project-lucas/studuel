import type { Metadata } from "next";
import { Suspense } from "react";
import {
  Geist,
  Geist_Mono,
  Bricolage_Grotesque,
  Nunito,
  Baloo_2,
  Fredoka,
} from "next/font/google";
import "./globals.css";
// Navigation responsive : barre d'onglets en bas (mobile) + sidebar (desktop)
import Navigation from "@/components/Navigation";
// Bandeau du haut, toujours visible (pièces + niveau) façon Clash Royale.
import TopHudLoader from "@/components/TopHudLoader";
// Pastille rouge « coffre à récupérer » posée sur l'onglet Trésor.
import NavChestBadgeLoader from "@/components/NavChestBadgeLoader";
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
// Écran de chargement au lancement, façon jeu mobile (illustration + barre).
import SplashScreen from "@/components/SplashScreen";
// Capteur « le premier écran est peint » : autorise le rideau à lever.
import AppReadyBeacon from "@/components/AppReadyBeacon";
import { shouldShowSplash, tipOfDay } from "@/lib/splash";
import { getCurrentUser } from "@/lib/supabase/user";
import { headers } from "next/headers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Titres : Bricolage Grotesque — chaleureuse, contemporaine, jamais corporate.
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

// Onboarding « Studuel » — monde visuel autonome façon Duolingo : Nunito pour
// l'UI, Baloo 2 pour le wordmark et les gros titres. Chargées ici (variables
// CSS) mais utilisées uniquement sous la portée `.onb` (page /bienvenue).
const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const baloo = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

// Pastilles d'initiales des matières (cartes « On s'y remet ? ») — police
// dédiée demandée par le design, exposée via l'utilitaire `font-initials`.
const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
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

  return (
    <html
      lang="fr"
      // Les variables de police vivent sur <html> : la règle globale
      // `font-sans` s'applique ici, elles doivent y être visibles.
      className={`light ${geistSans.variable} ${geistMono.variable} ${bricolage.variable} ${nunito.variable} ${baloo.variable} ${fredoka.variable}`}
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
              <header className="fixed inset-x-0 top-0 z-50 h-14 border-b bg-card/85 backdrop-blur-md md:hidden" />
            }
          >
            <TopHudLoader />
            {/* Dans la MÊME frontière que le bandeau : React ne révèle une
                frontière que lorsque tous ses enfants sont prêts, donc cette
                balise se monte à l'instant précis où la première vraie
                interface remplace le squelette. C'est ce signal qui autorise
                l'écran de chargement à s'ouvrir. */}
            <AppReadyBeacon />
          </Suspense>
          <Navigation
            userLabel={userLabel}
            // Pastille du Coffre streamée : la barre ne l'attend pas.
            chestBadge={
              <Suspense fallback={null}>
                <NavChestBadgeLoader />
              </Suspense>
            }
          />
          {user ? <DailyLoginReward /> : null}
          {/* min-w-0 : sans lui, l'item flex refuse de rétrécir sous la
              largeur intrinsèque de son contenu et la page déborde sur mobile. */}
          <main className="min-w-0 flex-1 px-4 pt-16 pb-24 md:px-8 md:py-10">
            <div className="mx-auto w-full max-w-4xl">
              <SwipeTabs>{children}</SwipeTabs>
            </div>
          </main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
