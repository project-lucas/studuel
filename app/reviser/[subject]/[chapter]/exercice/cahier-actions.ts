'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import type { Cle, Reponse } from '@/lib/exercices/types'

// LE CAHIER D'EXERCICES — trois gestes, et le serveur juge chacun.
//
// Ces actions ne décident de RIEN : elles passent la demande aux fonctions de
// la base (migration 372), qui vérifient l'abonnement, le déblocage, jugent la
// réponse contre une clé que personne d'autre ne lit, et versent les gemmes.
// Ici on ne fait que refuser tôt ce qui est mal formé (un identifiant qui
// n'est pas un UUID, une réponse énorme) et rendre à l'écran une forme simple.

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
/** Une réponse d'élève tient largement là-dedans ; au-delà, c'est autre chose. */
const REPONSE_MAX_OCTETS = 4_000

export type RaisonCahier = 'auth' | 'premium' | 'verrouille' | 'introuvable' | 'termine' | 'quota' | 'indisponible' | 'erreur'

export type ResultatCommencer = { ok: true; passage: string } | { ok: false; raison: RaisonCahier }

export type ResultatVerifier =
  | {
      ok: true
      juste: boolean
      essais: number
      fini: boolean
      bons: number
      total: number
      correction: { cle: Cle; affichage?: string; explication: string } | null
    }
  | { ok: false; raison: RaisonCahier }

export type ResultatTerminer =
  | { ok: true; score: number; max: number; reussi: boolean; parfait: boolean; gemmes: number; xp: number; deja: boolean }
  | { ok: false; raison: RaisonCahier }

const RAISONS: readonly RaisonCahier[] = ['auth', 'premium', 'verrouille', 'introuvable', 'termine', 'quota']

function raisonDe(v: unknown): RaisonCahier {
  return RAISONS.includes(v as RaisonCahier) ? (v as RaisonCahier) : 'erreur'
}

/** « la fonction n'existe pas » : la migration 372 n'est pas encore passée. */
function manque(error: { code?: string; message?: string } | null): boolean {
  return !!error && (error.code === 'PGRST202' || error.code === '42883' || /does not exist|Could not find/i.test(error.message ?? ''))
}

/** Ne garde d'une réponse que la forme attendue — rien d'autre ne part en base. */
function assainir(r: unknown): Reponse | null {
  if (!r || typeof r !== 'object') return null
  const o = r as Record<string, unknown>
  const chaines = (v: unknown, max: number) =>
    Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string').slice(0, max).map((x) => x.slice(0, 80)) : null
  const table = (v: unknown) => {
    if (!v || typeof v !== 'object' || Array.isArray(v)) return null
    const out: Record<string, string> = {}
    for (const [k, x] of Object.entries(v as Record<string, unknown>).slice(0, 20)) if (typeof x === 'string') out[k.slice(0, 20)] = x.slice(0, 20)
    return out
  }
  if ('ids' in o) {
    const ids = chaines(o.ids, 60)
    return ids ? { ids } : null
  }
  if ('valeur' in o) return typeof o.valeur === 'number' && Number.isFinite(o.valeur) ? { valeur: o.valeur } : null
  if ('texte' in o) return typeof o.texte === 'string' ? { texte: o.texte.slice(0, 120) } : null
  if ('paires' in o) {
    const p = table(o.paires)
    return p ? { paires: p } : null
  }
  if ('items' in o) {
    const i = table(o.items)
    return i ? { items: i } : null
  }
  if ('trous' in o) {
    const t = chaines(o.trous, 10)
    return t ? { trous: t } : null
  }
  return null
}

export async function commencerExercice(exerciceId: string): Promise<ResultatCommencer> {
  if (!UUID_RE.test(String(exerciceId))) return { ok: false, raison: 'introuvable' }
  const user = await getCurrentUser()
  if (!user) return { ok: false, raison: 'auth' }
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('exercice_commencer', { p_exercice: exerciceId })
  if (error) {
    console.error('[cahier] commencer :', error.message)
    return { ok: false, raison: manque(error) ? 'indisponible' : 'erreur' }
  }
  const r = data as { ok?: boolean; passage?: string; raison?: string } | null
  if (r?.ok && typeof r.passage === 'string') return { ok: true, passage: r.passage }
  return { ok: false, raison: raisonDe(r?.raison) }
}

export async function verifierReponse(passageId: string, question: number, reponse: unknown): Promise<ResultatVerifier> {
  if (!UUID_RE.test(String(passageId)) || !Number.isInteger(question) || question < 0 || question > 20)
    return { ok: false, raison: 'introuvable' }
  const propre = assainir(reponse)
  if (!propre || JSON.stringify(propre).length > REPONSE_MAX_OCTETS) return { ok: false, raison: 'erreur' }
  const user = await getCurrentUser()
  if (!user) return { ok: false, raison: 'auth' }
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('exercice_verifier', {
    p_passage: passageId,
    p_question: question,
    p_reponse: propre,
  })
  if (error) {
    console.error('[cahier] vérifier :', error.message)
    return { ok: false, raison: manque(error) ? 'indisponible' : 'erreur' }
  }
  const r = data as Record<string, unknown> | null
  if (!r?.ok) return { ok: false, raison: raisonDe(r?.raison) }
  const c = r.correction as { cle?: Cle; affichage?: string | null; explication?: string } | null
  return {
    ok: true,
    juste: r.juste === true,
    essais: Number(r.essais) || 0,
    fini: r.fini === true,
    bons: Number(r.bons) || 0,
    total: Number(r.total) || 0,
    correction:
      c && c.cle
        ? { cle: c.cle, explication: String(c.explication ?? ''), ...(c.affichage ? { affichage: String(c.affichage) } : {}) }
        : null,
  }
}

export async function terminerExercice(passageId: string): Promise<ResultatTerminer> {
  if (!UUID_RE.test(String(passageId))) return { ok: false, raison: 'introuvable' }
  const user = await getCurrentUser()
  if (!user) return { ok: false, raison: 'auth' }
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('exercice_terminer', { p_passage: passageId })
  if (error) {
    console.error('[cahier] terminer :', error.message)
    return { ok: false, raison: manque(error) ? 'indisponible' : 'erreur' }
  }
  const r = data as Record<string, unknown> | null
  if (!r?.ok) return { ok: false, raison: raisonDe(r?.raison) }
  // Le cahier, l'écran de chapitre et le bandeau (gemmes) ont bougé.
  revalidatePath('/reviser', 'layout')
  return {
    ok: true,
    score: Number(r.score) || 0,
    max: Number(r.max) || 0,
    reussi: r.reussi === true,
    parfait: r.parfait === true,
    gemmes: Number(r.gemmes) || 0,
    xp: Number(r.xp) || 0,
    deja: r.deja === true,
  }
}
