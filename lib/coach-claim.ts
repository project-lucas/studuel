import 'server-only'

import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { COACH_COOKIE, codeValide, normaliserCode } from '@/lib/coach/code'

/**
 * Rattache le compte au groupe de coach dont le code a été saisi dans
 * l'onboarding (« J'ai un code »), dès qu'une session existe.
 *
 * Même mécanique et mêmes points d'appel que le parrainage
 * (lib/referral-claim.ts) : le code est posé dans un cookie AVANT le compte,
 * et réclamé sur TOUS les chemins qui ouvrent une session — inscription avec
 * session immédiate, inscription avec confirmation d'e-mail (callback puis
 * connexion), retour OAuth, simple connexion. Appeler plusieurs fois est sans
 * danger : la RPC `rattachement_par_code` (560) répond 'deja' à un compte
 * déjà rattaché.
 *
 * Best-effort : aucune erreur ici ne doit compromettre une connexion réussie.
 */
export async function claimPendingCoachCode(): Promise<void> {
  try {
    const jar = await cookies()
    const brut = jar.get(COACH_COOKIE)?.value
    if (!brut) return
    const code = normaliserCode(brut)
    if (!codeValide(code)) {
      jar.delete(COACH_COOKIE)
      return
    }

    const user = await getCurrentUser()
    // Pas encore de session : on GARDE le cookie pour le prochain point d'entrée.
    if (!user) return

    const supabase = await createClient()
    const { error } = await supabase.rpc('rattachement_par_code', { p_code: code })
    // Tout verdict ('ok', 'deja', 'introuvable', 'coach') est définitif : on ne
    // garde le cookie que sur panne technique (migration absente, réseau).
    if (!error) jar.delete(COACH_COOKIE)
  } catch {
    // Cookie illisible, Supabase injoignable, contexte sans écriture de
    // cookies : on laisse filer, le prochain chemin réessaiera.
  }
}
