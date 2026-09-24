import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Nunito, Baloo_2 } from "next/font/google";
import "./globals.css";
// Navigation responsive : barre d'onglets en bas (mobile) + sidebar (desktop)
import Navigation from "@/components/Navigation";
// Bandeau du haut, toujours visible (pièces + niveau) façon Clash Royale.
import TopHudLoader from "@/components/TopHudLoader";
// Pastille rouge « du neuf cette semaine » posée sur l'onglet Boutique.
import NavBoutiqueBadgeLoader from "@/components/NavBoutiqueBadgeLoader";
import NavAvatarLoader from "@/components/NavAvatarLoader";
import NavMoiBust from "@/components/NavMoiBust";
// Balayage horizontal (façon Clash Royale) : change d'onglet depuis n'importe
// quel endroit de l'écran.
// Préchargeur d'onglets : les quatre autres onglets sont demandés au routeur
// en arrière-plan, un par un, pour qu'un tap les ouvre sans attendre.
import PrechargeurOnglets from "@/components/PrechargeurOnglets";
// Rebond sonore aux extrémités : « bwomp » grave quand on tire une liste au-delà
// de son haut ou de son bas (aucun son pendant le défilement normal).
import ScrollEdgeSound from "@/components/ScrollEdgeSound";
// Cadeau de connexion : crédite les pièces du jour au premier passage.
// Retour matériel du téléphone : reste dans l'app au lieu de la quitter.
import BackGuard from "@/components/BackGuard";
// Toasts globaux (« Enregistré ✓ ») : file lib/toast, aucun provider.
import Toaster from "@/components/Toaster";
import RecompensesProvider from "@/components/recompenses/RecompensesProvider";
import OngletsVivants from "@/components/OngletsVivants";
// Écran de chargement au lancement, façon jeu mobile (illustration + barre).
import SplashScreen from "@/components/SplashScreen";
import LigueVeille from "@/components/LigueVeille";
import NavAmisBadge from "@/components/amis/ligue/NavAmisBadge";
// Capteur « le premier écran est peint » : autorise le rideau à lever.
import AppReadyBeacon from "@/components/AppReadyBeacon";
// Gabarit de page : marges de lecture, ou plein écran. Client, pour suivre la
// navigation — cf. son en-tête.
import AppMain from "@/components/AppMain";
import WorldBackdrop from "@/components/WorldBackdrop";
// Le rideau « tourne ton téléphone » et le verrou d'orientation : l'app se
// joue à la verticale, et seulement (Lucas, 22/09/2026).
import GardePortrait from "@/components/GardePortrait";
import { estPleinEcran } from "@/lib/quiz-chrome";
import { scriptSuiteLancement, shouldShowSplash, tipOfDay } from "@/lib/splash";
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

// PAS DE ZOOM (Lucas, 22/09/2026 : « enlève la possibilité de zoomer, ça fait
// bugger »). Un pincement sur une table de jeu ou une carte d'exercice
// agrandissait la page entière et laissait l'écran décalé ; `user-scalable=no`
// et l'échelle plafonnée le coupent, et `viewport-fit=cover` laisse l'app
// peindre jusque sous l'encoche (les marges `env(safe-area-inset-*)` font le
// reste). Les textes restent agrandissables par les réglages du téléphone.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
  defi,
  reviser,
  amis,
  moi,
  tresor,
}: Readonly<{
  children: React.ReactNode;
  // LES CINQ ONGLETS, chacun dans son emplacement (`app/@defi`…) : ils restent
  // montés d'un onglet à l'autre, comme chez Clash Royale (components/OngletsVivants).
  defi: React.ReactNode;
  reviser: React.ReactNode;
  amis: React.ReactNode;
  moi: React.ReactNode;
  tresor: React.ReactNode;
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
        <GardePortrait />
        {/* LE MUR DE L'APP : le papier quadrillé (`.tab-bg`), posé UNE fois et
            sous tous les mondes (-z-20). L'arène et la course classée peignent
            leur scène par-dessus (-z-10) ; tout le reste — onglets, dossiers,
            chapitres, cours, quiz, Marcel, Parents, Compte — est posé sur ce
            papier. Jusqu'au 22/09/2026 il n'était posé que sur les onglets de
            liste, page par page : on touchait un dossier et il disparaissait,
            l'écran « attendait un fond ». */}
        <WorldBackdrop className="tab-bg -z-20" />
        {/* Écran de chargement : l'astuce est tirée ici (serveur) pour que les
            deux rendus affichent la même phrase — sinon React signale une
            différence d'hydratation sur le tout premier écran de l'app. */}
        {showSplash ? (
          <>
            <SplashScreen tip={tipOfDay(new Date().toISOString().slice(0, 10))} />
            {/* Arrivée de l'écran de lancement statique (public/lancement.html,
                le point d'entrée de l'app installée) : la barre reprend où
                elle en était au lieu de repartir de zéro. Joue avant
                l'hydratation, n'écrit que dans <head> (lib/splash). */}
            <script dangerouslySetInnerHTML={{ __html: scriptSuiteLancement() }} />
          </>
        ) : null}
        {/* Mobile first : contenu entre la barre du haut (compte) et la barre
            d'onglets du bas ; sur desktop la sidebar sticky passe à gauche et
            le contenu est centré en largeur de lecture confortable */}
        <div className="flex min-h-screen">
          <BackGuard />
          <ScrollEdgeSound />
          {/* Ne rend rien. Réservé aux élèves connectés : un visiteur n'a
              que des vitrines, inutile de les calculer d'avance. */}
          {user ? <PrechargeurOnglets /> : null}
          {/* La ligue de la semaine se clôture joueur par joueur : ce réveil
              fait entrer l'élève dans son groupe et lui verse ses gains, même
              s'il n'ouvre pas l'onglet Amis (migration 376). Ne rend rien. */}
          {user ? <LigueVeille /> : null}
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
            // Pastille de la Boutique streamée : la barre ne l'attend pas.
            boutiqueBadge={
              <Suspense fallback={null}>
                <NavBoutiqueBadgeLoader />
              </Suspense>
            }
            // Avatar de l'onglet Moi, streamé de la même façon. Le repli est le
            // buste dessiné, ici comme dans le chargeur : la case de l'onglet
            // n'est jamais vide, ni pendant l'attente ni après une panne.
            // Pastille de l'onglet Amis : un bilan de la ligue attend.
            amisBadge={user ? <NavAmisBadge /> : null}
            avatarSlot={
              <Suspense fallback={<NavMoiBust />}>
                <NavAvatarLoader />
              </Suspense>
            }
          />
          {/* LES RÉCOMPENSES QUI VOLENT (Clash Royale) : monté ICI, autour du
              contenu, et une seule fois pour toute l'application. Les jetons
              doivent survoler la page ENTIÈRE — bandeau compris — donc échapper
              à tout conteneur qui découpe ; et la couche doit être unique,
              sinon deux écrans de fin montés ensemble feraient deux volées et
              deux rafraîchissements concurrents. Il ne rend rien tant que
              personne n'a rien gagné. */}
          <RecompensesProvider>
            <AppMain>
              <OngletsVivants
                onglets={{
                  "/defi": defi,
                  "/reviser": reviser,
                  "/amis": amis,
                  "/moi": moi,
                  "/tresor": tresor,
                }}
              >
                {children}
              </OngletsVivants>
            </AppMain>
          </RecompensesProvider>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
