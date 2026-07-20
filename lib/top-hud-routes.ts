// Où le bandeau du haut (TopHud) doit rester invisible — logique pure, partagée
// par le chargeur serveur et le composant client.
//
// Deux gardes, deux rôles :
//   - côté SERVEUR (TopHudLoader), elle évite de payer l'authentification + 5
//     requêtes Supabase pour un bandeau qui ne s'affichera pas ;
//   - côté CLIENT (TopHud), elle reste indispensable : le layout racine n'est
//     PAS re-rendu lors d'une navigation client, donc un élève qui arrive sur
//     /bienvenue depuis une autre page garde le bandeau déjà monté.

/** Parcours plein écran (façon Duolingo) : aucun bandeau. */
const HIDDEN_PREFIXES = ['/bienvenue'] as const

/** Le bandeau du haut doit-il être masqué sur ce chemin ? */
export function isHudHidden(pathname: string): boolean {
  return HIDDEN_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  )
}
