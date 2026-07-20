import 'server-only'

import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { claimReferral } from '@/lib/gems-access'
import { REFERRAL_COOKIE } from '@/lib/gems'

/**
 * Réclame le code de parrainage déposé par le lien d'invitation (/parrain/CODE)
 * dès qu'une session existe.
 *
 * ⚠️ À APPELER SUR **TOUS** LES CHEMINS QUI OUVRENT UNE SESSION, sans exception.
 * L'élève qui a cliqué sur le lien d'un ami peut atteindre son compte par
 * quatre routes différentes, et le parrainage doit survivre aux quatre :
 *
 *   1. inscription email avec session immédiate  → signUpWelcome
 *   2. inscription email AVEC CONFIRMATION       → /auth/callback, puis signIn
 *   3. inscription OAuth (Google / Apple)        → applyOnboarding
 *   4. simple reconnexion plus tard              → signIn
 *
 * Le cas 2 est le piège : `signUp` renvoie une session `null`, la fonction
 * d'inscription rend la main avant toute réclamation, et le parcours repart
 * ensuite par le callback puis par une connexion classique. Tant que ces deux
 * points d'entrée n'appelaient pas cette fonction, un parcours d'inscription
 * parfaitement légitime perdait le parrainage à 100 %, silencieusement — ni le
 * parrain ni le filleul ne touchaient leur gemme et rien ne le signalait.
 *
 * Appeler cette fonction plusieurs fois est sans danger : elle sort tout de
 * suite s'il n'y a pas de cookie, et la fonction SQL `claim_referral` refuse un
 * compte déjà parrainé (`'already'`).
 *
 * Best-effort de bout en bout : aucune erreur ici ne doit compromettre une
 * connexion réussie. Un parrainage raté se rattrape, pas un compte perdu.
 * Aucune gemme n'est versée à cet instant — elles tombent à la première
 * session de révision du filleul (trigger SQL sur `test_sessions`).
 */
export async function claimPendingReferral(): Promise<void> {
  try {
    const jar = await cookies()
    const code = jar.get(REFERRAL_COOKIE)?.value
    if (!code) return

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    // Pas encore de session : on GARDE le cookie pour le prochain point
    // d'entrée. Le supprimer ici reviendrait à jeter le parrainage.
    if (!user) return

    const result = await claimReferral(supabase, code)

    // On ne conserve le cookie que sur panne technique : tous les autres
    // verdicts ('claimed', 'self', 'already', 'too_late', 'not_found') sont
    // définitifs, et le garder ferait rejouer l'appel à chaque écran.
    if (result !== 'error') jar.delete(REFERRAL_COOKIE)
  } catch {
    // Cookie illisible, Supabase injoignable, ou contexte qui n'autorise pas
    // l'écriture de cookies : on laisse filer, le prochain chemin réessaiera.
  }
}
