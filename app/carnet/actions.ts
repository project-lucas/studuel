'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { normaliserPreferences, type PreferencesCarnet } from '@/lib/carnet/preferences'

// -----------------------------------------------------------------------------
// LES GESTES DU CARNET, À L'ÉCHELLE DU CARNET : régler ses préférences,
// épingler, archiver, poser un objectif sur un dossier (migration 356).
//
// Les gestes SUR LE CONTENU d'un cours (chapitres, questions, réglages de
// révision) restent dans `app/carnet/cours/actions.ts` : ici on ne touche
// qu'à la façon dont le carnet se présente.
//
// TOLÉRANCE : tant que la 356 n'est pas passée, Postgres répond 42703 (colonne
// inconnue). On le dit à l'élève en français plutôt que de laisser l'écran
// annoncer un « échec » sans cause.
// -----------------------------------------------------------------------------

export type ResultatCarnet = { ok: boolean; message?: string }

const OBJECTIF_MAX = 120

async function session() {
  const user = await getCurrentUser()
  if (!user) return null
  return { supabase: await createClient(), userId: user.id }
}

function colonneAbsente(error: { code?: string; message: string } | null): boolean {
  return Boolean(error && (error.code === '42703' || /does not exist/i.test(error.message)))
}

const MISE_A_JOUR = 'Cette personnalisation arrive bientôt sur ton compte — mise à jour en cours.'

/** Enregistre les préférences du carnet (normalisées ici, jamais telles quelles). */
export async function enregistrerPreferencesCarnet(brut: unknown): Promise<ResultatCarnet> {
  const s = await session()
  if (!s) return { ok: false, message: 'Connecte-toi pour personnaliser ton carnet.' }

  const prefs: PreferencesCarnet = normaliserPreferences(brut)
  const { error } = await s.supabase
    .from('profiles')
    .update({ carnet_prefs: prefs })
    .eq('id', s.userId)

  if (error) {
    console.error('[carnet] préférences refusées :', error.message)
    return { ok: false, message: colonneAbsente(error) ? MISE_A_JOUR : 'Les réglages n’ont pas pu être enregistrés.' }
  }
  revalidatePath('/carnet')
  return { ok: true }
}

/** Une écriture sur UN dossier de l'élève, avec la vérification de propriété. */
async function modifierCours(id: string, patch: Record<string, unknown>): Promise<ResultatCarnet> {
  const s = await session()
  if (!s) return { ok: false, message: 'Connecte-toi pour modifier ton carnet.' }
  if (typeof id !== 'string' || id.length === 0) return { ok: false, message: 'Cours inconnu.' }

  const { error } = await s.supabase
    .from('carnet_courses')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('owner_id', s.userId)

  if (error) {
    console.error('[carnet] modification refusée :', error.message)
    return { ok: false, message: colonneAbsente(error) ? MISE_A_JOUR : 'La modification n’a pas pu être enregistrée.' }
  }
  revalidatePath('/carnet')
  revalidatePath(`/carnet/cours/${id}`)
  return { ok: true }
}

/** Épingle (ou détache) un dossier : il passe devant, quel que soit l'ordre. */
export async function epinglerCours(id: string, epingle: boolean): Promise<ResultatCarnet> {
  return modifierCours(id, { epingle: Boolean(epingle) })
}

/** Range (ou ressort) un dossier : hors de la grille, jamais supprimé. */
export async function archiverCours(id: string, archive: boolean): Promise<ResultatCarnet> {
  return modifierCours(id, { archive: Boolean(archive) })
}

/** L'objectif libre d'un dossier, coupé à 120 caractères ; vide = retiré. */
export async function definirObjectifCours(id: string, objectif: string | null): Promise<ResultatCarnet> {
  const texte = typeof objectif === 'string' ? objectif.trim().slice(0, OBJECTIF_MAX) : ''
  return modifierCours(id, { objectif: texte.length > 0 ? texte : null })
}
