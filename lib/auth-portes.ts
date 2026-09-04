// -----------------------------------------------------------------------------
// LES PORTES D'ENTRÉE DE L'APP, ET OÙ ELLES MÈNENT.
//
// Deux questions pures, sans réseau ni base :
//
// 1. Quels fournisseurs OAuth sont RÉELLEMENT actifs côté Supabase ? Le
//    tableau de bord expose `GET /auth/v1/settings` (public, clé anon), qui
//    dit pour chaque fournisseur s'il est activé. L'écran d'inscription
//    montrait « Continuer avec Apple » et « Continuer avec Google » en tête,
//    au-dessus de l'e-mail, alors que NI L'UN NI L'AUTRE n'était activé :
//    chaque élève qui choisissait la porte la plus visible tombait sur une
//    erreur. On ne montre une porte que si elle s'ouvre.
//
// 2. Une fois connecté, où va-t-on ? La règle existait dans `signIn`, mais la
//    connexion par Google/Apple ne passe pas par `signIn` — elle revient par
//    `/auth/callback`. La règle vit donc ici, une fois, pour les deux chemins.
// -----------------------------------------------------------------------------

export type FournisseurOAuth = 'google' | 'apple'

export type PortesOAuth = Readonly<Record<FournisseurOAuth, boolean>>

export const AUCUNE_PORTE_OAUTH: PortesOAuth = Object.freeze({
  google: false,
  apple: false,
})

/**
 * Lit la réponse de `GET /auth/v1/settings` et en tire les portes ouvertes.
 * Tout ce qui n'est pas explicitement `true` est fermé : une réponse
 * inattendue (panne, JSON tronqué, champ absent) ne fait jamais apparaître
 * un bouton mort — c'est le défaut qu'on corrige, pas un cas limite.
 */
export function portesOAuthDepuisSettings(settings: unknown): PortesOAuth {
  if (!settings || typeof settings !== 'object') return AUCUNE_PORTE_OAUTH
  const external = (settings as { external?: unknown }).external
  if (!external || typeof external !== 'object') return AUCUNE_PORTE_OAUTH
  const lu = external as Record<string, unknown>
  return {
    google: lu.google === true,
    apple: lu.apple === true,
  }
}

export function auMoinsUnePorteOAuth(portes: PortesOAuth): boolean {
  return portes.google || portes.apple
}

export type ProfilPourDestination = {
  onboarded?: boolean | null
  profile_type?: string | null
} | null

/**
 * Où envoyer un compte qui vient de se connecter.
 *
 * - Un PARENT n'a pas de classe : les onglets élève l'auraient posé sur
 *   « Dis-nous ta classe », un écran qui ne le concerne pas (et `/parents`
 *   n'est dans aucune barre de navigation — il serait perdu).
 * - Un compte jamais configuré (première connexion, ou profil sans classe)
 *   passe par l'onboarding.
 * - Sinon, l'arène : la porte d'un jeu, pas celle d'un cahier de textes.
 */
export function destinationApresConnexion(profil: ProfilPourDestination): string {
  if (profil?.profile_type === 'parent') return '/parents'
  return profil?.onboarded ? '/defi' : '/onboarding'
}

/**
 * Chemin interne sûr pour un `?next=` : relatif à la racine, jamais
 * protocol-relative (`//evil.example`), sinon la racine. Même règle que
 * `/auth/callback`, exposée pour les appelants qui construisent le lien.
 */
export function cheminInterne(brut: string | null | undefined): string {
  if (!brut) return '/'
  return brut.startsWith('/') && !brut.startsWith('//') ? brut : '/'
}
