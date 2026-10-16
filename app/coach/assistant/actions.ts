'use server'

import { createClient } from '@/lib/supabase/server'
import { aujourdhuiUtc, lireTableau } from '@/lib/coach/server'
import { lireSuiviTableau, prendreJetonIA } from '@/lib/coach/suivi-server'
import { juger } from '@/lib/coach/statut'
import { resumeObjectif } from '@/lib/coach/suivi'
import { cleCache, CONSIGNE_TRI, donneesTri, pseudonymiser, trierAvecPrenoms, type ElementTri } from '@/lib/coach/assistant'
import { demanderStructure, SCHEMA_TRI } from '@/lib/coach/claude-server'

export type TriPret = {
  synthese: string
  eleves: (ElementTri & { eleveId: string; prenom: string })[]
  creeLe: string
  total: number
}

/**
 * LE TRI DU MATIN (Claude) : qui contacter aujourd'hui, pourquoi, et quoi lui
 * dire. Un par jour (gardé en cache, `coach_assistant`) ; « Relancer » le
 * refait. Claude ne voit que des codes (E1, E2…) et des chiffres.
 */
export async function trierAction(relancer = false): Promise<{ ok: true; tri: TriPret } | { ok: false; erreur: string }> {
  const supabase = await createClient()
  const jour = aujourdhuiUtc()
  const cle = cleCache('tri', jour)
  if (!relancer) {
    const { data } = await supabase.rpc('coach_assistant_lire', { p_cle: cle })
    const c = data as { contenu?: TriPret } | null
    if (c?.contenu?.eleves) return { ok: true, tri: c.contenu }
  }

  const [lignes, suivi] = await Promise.all([lireTableau(), lireSuiviTableau()])
  if (!lignes) return { ok: false, erreur: 'Le tableau n’est pas disponible.' }
  if (lignes.length === 0) return { ok: false, erreur: 'Aucun élève dans tes groupes.' }
  const jugees = juger(lignes, jour).map((l) => {
    const s = suivi?.get(l.eleveId)
    return {
      ...l,
      objectif: s?.objMinutes ? `${resumeObjectif({ minutes: s.objMinutes, jours: s.objJours, quiz: s.objQuiz, message: null })} (fait : ${s.minutesSemaine} min, ${s.joursSemaine} j, ${s.quizSemaine} quiz)` : null,
      nonLus: s?.nonLus ?? 0,
    }
  })
  const refus = await prendreJetonIA()
  if (refus) return { ok: false, erreur: refus }
  const { eleves, table } = pseudonymiser(jugees.slice(0, 300), jour)
  const r = await demanderStructure(CONSIGNE_TRI, donneesTri(eleves, jour), SCHEMA_TRI, 8000)
  if (!r.ok) return r
  const tri: TriPret = { ...trierAvecPrenoms(r.valeur, table), creeLe: new Date().toISOString(), total: eleves.length }
  await supabase.rpc('coach_assistant_ecrire', { p_cle: cle, p_contenu: tri })
  return { ok: true, tri }
}

/** Le tri déjà fait aujourd'hui, sans appeler Claude. */
export async function lireTriDuJour(): Promise<TriPret | null> {
  const supabase = await createClient()
  const { data } = await supabase.rpc('coach_assistant_lire', { p_cle: cleCache('tri', aujourdhuiUtc()) })
  const c = data as { contenu?: TriPret } | null
  return c?.contenu?.eleves ? c.contenu : null
}
