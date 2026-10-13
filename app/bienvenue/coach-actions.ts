'use server'

import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { COACH_COOKIE, COACH_COOKIE_JOURS, codeValide, normaliserCode } from '@/lib/coach/code'

/**
 * « J'AI UN CODE » (13/10/2026) — l'onboarding est public : on vérifie le code
 * d'un groupe de coach AVANT le compte (`coach_code_apercu`, ouverte à anon,
 * migration 560) et on le pose dans un cookie, que `claimPendingCoachCode`
 * réclame dès qu'une session existe — sur tous les chemins d'inscription et
 * de connexion, comme le parrainage.
 */
export type ApercuCodeCoach =
  | { ok: true; code: string; nom: string; categorie: string | null; coach: string }
  | { ok: false }

export async function verifierCodeCoach(brut: string): Promise<ApercuCodeCoach> {
  const code = normaliserCode(typeof brut === 'string' ? brut : '')
  if (!codeValide(code)) return { ok: false }

  const supabase = await createClient()
  const { data, error } = await supabase.rpc('coach_code_apercu', { p_code: code })
  if (error || !data || typeof data !== 'object') return { ok: false }
  const d = data as { nom?: unknown; categorie?: unknown; coach?: unknown }
  if (typeof d.nom !== 'string') return { ok: false }

  const jar = await cookies()
  jar.set(COACH_COOKIE, code, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: COACH_COOKIE_JOURS * 86_400,
  })
  return {
    ok: true,
    code,
    nom: d.nom,
    categorie: typeof d.categorie === 'string' ? d.categorie : null,
    coach: typeof d.coach === 'string' ? d.coach : 'ton coach',
  }
}

/** L'élève retire son code avant de créer le compte : le cookie part avec. */
export async function oublierCodeCoach(): Promise<void> {
  const jar = await cookies()
  jar.delete(COACH_COOKIE)
}
