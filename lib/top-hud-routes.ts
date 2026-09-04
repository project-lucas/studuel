// Où le bandeau du haut (TopHud) doit rester invisible — logique pure, partagée
// par le chargeur serveur et le composant client.
//
// DEUX VERDICTS, ET IL NE FAUT PAS LES CONFONDRE.
//
//   - `isHudHidden` dit s'il faut MASQUER le bandeau. Il est lu par le
//     composant CLIENT, donc réévalué à chaque navigation. C'est le seul qui
//     décide de l'affichage.
//
//   - `isHudDataSkipped` dit si le chargeur SERVEUR peut se dispenser de
//     l'authentification et des 5 requêtes Supabase. Il est volontairement
//     PLUS ÉTROIT, et ce n'est pas une négligence : le layout racine n'étant
//     pas re-rendu en navigation client, un bandeau sauté au rendu initial
//     n'existe pour le reste de la session. Économiser les requêtes sur une
//     route revient donc à dire « on ne reviendra pas de cette route sans
//     recharger la page ». Vrai de l'onboarding, qui se termine par une
//     redirection serveur. FAUX du quiz, qu'on quitte par un bouton — d'où
//     `/test/` présent dans le premier verdict et absent du second.

import { estChromeMasque, estOnboarding } from '@/lib/quiz-chrome'

/**
 * L'ONGLET MOI N'A PAS DE BANDEAU. La carte de joueur porte déjà le niveau,
 * la série, les trophées et les monnaies gagnées : les quatre pastilles du
 * bandeau, juste au-dessus, les redisaient (Lucas, 04/09/2026 : « cela fait
 * doublon, je veux que le bloc violet prenne la place du haut »). Exactement
 * `/moi` : le vestiaire et les habitudes gardent leur bandeau.
 */
export function estOngletMoi(pathname: string): boolean {
  return pathname === '/moi'
}

/** Le bandeau du haut doit-il être masqué sur ce chemin ? */
export function isHudHidden(pathname: string): boolean {
  return estChromeMasque(pathname) || estOngletMoi(pathname)
}

/**
 * Le chargeur serveur peut-il sauter ses requêtes ? Voir l'avertissement en
 * tête de fichier avant d'ajouter une route ici.
 */
export function isHudDataSkipped(pathname: string): boolean {
  return estOnboarding(pathname)
}

/**
 * Sur l'écran d'arène (/defi exactement), la pastille « Niveau » du bandeau se
 * replie : l'arène porte déjà SA pastille niveau + barre d'XP (ProfileChip,
 * haut-gauche) et deux compteurs de niveau à quelques pixels d'écart se
 * contredisaient (anneau en % contre libellé 750/1000). Pièces et réglages
 * restent ; les sous-pages du Défi (/defi/jouer…) gardent le bandeau complet.
 */
export function isHudLevelHidden(pathname: string): boolean {
  return pathname === '/defi'
}

/**
 * L'ENGRENAGE DES RÉGLAGES A QUITTÉ LE BANDEAU. Il n'y a plus qu'une porte vers
 * `/compte` pour un élève connecté : la carte de profil de l'onglet **Moi**.
 *
 * Il y en avait quatre — l'engrenage du bandeau (sur tous les écrans), le menu
 * de l'arène, la carte de profil, et la sidebar du bureau. Trois de trop pour
 * un écran qu'on ouvre une fois par mois, et la quatrième coûtait cher : le
 * bandeau est une rangée d'objets `shrink-0`, si bien que le carré de 44 px de
 * l'engrenage se payait sur le SEUL élément élastique, la pastille de niveau.
 * Mesuré sur un iPhone 14 (390 px) : elle tombait à 74 px au lieu de 149, son
 * libellé « NIVEAU 7 » réduit à 10 px de large et sa barre d'XP à 10 px. Le
 * réglage le plus rare de l'app écrasait le compteur le plus regardé.
 *
 * ⚠️ LE VISITEUR, LUI, GARDE SON BOUTON — et ce n'est pas une exception, c'est
 * la même règle : ce bouton-là n'est pas un engrenage mais un « Se connecter »,
 * la seule porte d'entrée du bandeau pour qui n'a pas de compte. D'où le
 * paramètre `connected` : la règle porte sur les RÉGLAGES, pas sur la case.
 *
 * `/defi` reste dans la règle pour le visiteur : l'arène a son propre
 * « Se connecter » dans le menu.
 */
export function isHudAccountHidden(pathname: string, connected: boolean): boolean {
  return connected || pathname === '/defi'
}

/**
 * Routes dont le fond est une SCÈNE SOMBRE (l'arène et ses salles de jeu), par
 * opposition au fond crème du reste de l'app.
 *
 * Le bandeau y flottait en pastilles crème et jaune plein : posé sur le ciel
 * violet de l'arène, il se lisait comme de l'interface web collée sur une
 * illustration — la seule chose de l'écran qui n'avait pas l'air dessinée. Sur
 * ces routes, il prend le même matériau que le reste du HUD de jeu : le verre
 * de nuit hérité de l'écran de chargement (`.olympe-glass`), l'or réservé aux
 * VALEURS (chiffres, barres).
 */
export function isHudOverDarkScene(pathname: string): boolean {
  return pathname === '/defi' || pathname.startsWith('/defi/')
}
