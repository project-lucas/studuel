// L'ENREGISTREMENT D'UN RAPPORT D'ERREUR, CÔTÉ SERVEUR — par la RPC
// `erreur_signaler` (migration 559), qui tronque, borne la rafale et range la
// ligne dans `erreurs_app`. Le serveur n'a que la clé anonyme : c'est la RPC
// (SECURITY DEFINER) qui écrit, jamais une insertion directe.
//
// Module serveur : importé par la route /api/erreurs et par instrumentation.ts.
// Jamais par un composant client (il tirerait @supabase/ssr dans le paquet).

import { createServerClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { RapportErreur } from '@/lib/erreurs'

/**
 * Écrit le rapport. Rend `false` sans lever si la base refuse (migration 559
 * pas encore exécutée, rafale dépassée…) : l'erreur est alors journalisée sur
 * la sortie standard, pour que les logs du serveur en gardent au moins la trace.
 */
export async function enregistrerErreur(
  supabase: SupabaseClient,
  rapport: RapportErreur,
  navigateur: string | null,
): Promise<boolean> {
  const { error } = await supabase.rpc('erreur_signaler', {
    p_source: rapport.source,
    p_message: rapport.message,
    p_nom: rapport.nom,
    p_pile: rapport.pile,
    p_url: rapport.url,
    p_digest: rapport.digest,
    p_contexte: rapport.contexte,
    p_navigateur: navigateur ? navigateur.slice(0, 300) : null,
  })
  if (error) {
    console.error('[erreurs] enregistrement impossible :', error.message, '—', rapport.source, rapport.message)
    return false
  }
  return true
}

/** Les cookies d'un en-tête `cookie` brut, pour @supabase/ssr. */
export function lireCookies(enTete: string | null | undefined): { name: string; value: string }[] {
  if (!enTete) return []
  return enTete
    .split(';')
    .map((morceau) => morceau.trim())
    .filter((morceau) => morceau.length > 0)
    .map((morceau) => {
      const i = morceau.indexOf('=')
      if (i < 0) return { name: morceau, value: '' }
      return { name: morceau.slice(0, i), value: morceau.slice(i + 1) }
    })
}

/**
 * Un client Supabase bâti depuis l'EN-TÊTE `cookie` d'une requête — pour
 * `onRequestError` (instrumentation.ts), qui n'a pas accès à `cookies()` de
 * Next mais reçoit les en-têtes. La session de l'élève y est : la ligne porte
 * son identifiant, comme pour un rapport parti du navigateur.
 */
export function clientDepuisEnTeteCookie(enTete: string | null | undefined): SupabaseClient {
  const cookies = lireCookies(enTete)
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookies
        },
        setAll() {
          // Rien à écrire : on n'a pas de réponse à qui donner un cookie.
        },
      },
    },
  )
}
