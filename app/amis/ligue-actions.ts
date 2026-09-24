'use server'

import { createClient } from '@/lib/supabase/server'
import { isMissingSchemaObject } from '@/lib/schema-fallback'
import { lireOuvertureCoffre, type OuvertureCoffre } from '@/lib/ligue'

// Les gestes de la ligue de la semaine (migration 376) et du coffre d'équipe
// (379). Le serveur décide de tout — classement, montée, gemmes, contenu du
// coffre — : ces actions ne font que le réveiller, lui dire qu'un bilan a été
// vu, ou lui demander d'ouvrir un coffre.

const SEMAINE = /^\d{4}-\d{2}-\d{2}$/

/**
 * Le bilan de la semaine a été rejoué (l'animation a joué, l'élève a touché
 * « Continuer ») : il ne reviendra plus.
 */
export async function marquerBilanVu(semaine: string): Promise<{ ok: boolean }> {
  if (!SEMAINE.test(semaine)) return { ok: false }
  const supabase = await createClient()
  const { error } = await supabase.rpc('ligue_bilan_vu', { p_semaine: semaine })
  if (error && !isMissingSchemaObject(error)) {
    console.error('[ligue] bilan non marqué :', error.message)
  }
  return { ok: !error }
}

/**
 * Réveille la ligue à chaque retour dans l'app (components/LigueVeille) : la
 * semaine passée se clôture — gemmes versées, coffre d'équipe enregistré — et
 * l'élève entre dans celle-ci dès sa première XP, même s'il n'ouvre pas
 * l'onglet Amis. Rend `bilan` quand un bilan attend d'être rejoué, `coffre`
 * quand un coffre attend d'être ouvert (clé absente avant la 379 : false).
 */
export async function toucherLigue(): Promise<{ bilan: boolean; coffre: boolean }> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('ligue_toucher')
  if (error) {
    if (!isMissingSchemaObject(error)) console.error('[ligue] réveil impossible :', error.message)
    return { bilan: false, coffre: false }
  }
  const o = data && typeof data === 'object' ? (data as { bilan?: unknown; coffre?: unknown }) : {}
  return { bilan: o.bilan === true, coffre: o.coffre === true }
}

/**
 * Ouvre le coffre d'équipe d'une semaine finie (migration 379). Le serveur
 * relit le coffre enregistré à la clôture et verse son contenu — XP et
 * gemmes —, une seule fois : rien ne vient de l'appelant que la semaine.
 * Rend ce qui a VRAIMENT été versé (c'est ce qui vole vers le bandeau).
 */
export async function ouvrirCoffre(semaine: string): Promise<OuvertureCoffre> {
  if (!SEMAINE.test(semaine)) return { ok: false, raison: 'semaine' }
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('coffre_equipe_ouvrir', { p_semaine: semaine })
  if (error) {
    if (!isMissingSchemaObject(error)) console.error('[coffre] ouverture impossible :', error.message)
    return { ok: false, raison: isMissingSchemaObject(error) ? 'bientot' : 'erreur' }
  }
  return lireOuvertureCoffre(data)
}
