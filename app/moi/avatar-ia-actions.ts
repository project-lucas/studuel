'use server'

import { createClient } from '@/lib/supabase/server'
import { isMissingSchemaObject } from '@/lib/schema-fallback'
import { srcAvatarIa } from '@/lib/avatar-ia'

// L'atelier « Marcel dessine ton avatar » (onglet Moi, migration 378). Le
// dessin lui-même passe par la route app/api/avatar-ia (une dizaine de
// secondes) ; ces actions-ci ouvrent l'atelier et gardent un dessin.

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/

export type AtelierAvatar = {
  /** La migration 378 est là (sinon : « bientôt »). */
  disponible: boolean
  credits: { mensuels: number; restants: number } | null
  /** Mes derniers dessins, à reprendre sans rien dépenser. */
  avatars: { id: string; src: string; demande: string }[]
}

/** Ce qu'il faut pour ouvrir l'atelier : mes crédits du mois, mes dessins. */
export async function ouvrirAtelierAvatar(): Promise<AtelierAvatar> {
  const supabase = await createClient()
  const [etat, mes] = await Promise.all([supabase.rpc('credits_etat'), supabase.rpc('avatar_ia_mes')])
  if (etat.error) {
    if (!isMissingSchemaObject(etat.error)) console.error('[avatar-ia] crédits illisibles :', etat.error.message)
    return { disponible: false, credits: null, avatars: [] }
  }
  // Sans session, la base ne dit rien : pas d'atelier.
  if (!etat.data || typeof etat.data !== 'object') return { disponible: false, credits: null, avatars: [] }
  const e = etat.data as { mensuels?: unknown; restants?: unknown }
  const avatars = (Array.isArray(mes.data) ? mes.data : []).flatMap((a) => {
    const x = a as { id?: unknown; demande?: unknown }
    return typeof x.id === 'string' && UUID.test(x.id)
      ? [{ id: x.id, src: srcAvatarIa(x.id), demande: typeof x.demande === 'string' ? x.demande : '' }]
      : []
  })
  return {
    disponible: true,
    credits: { mensuels: Math.max(0, Number(e.mensuels) || 0), restants: Math.max(0, Number(e.restants) || 0) },
    avatars,
  }
}

/** « Garder cet avatar » : mon portrait devient ce dessin. */
export async function garderAvatarIa(id: string): Promise<{ ok: boolean }> {
  if (!UUID.test(id)) return { ok: false }
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('avatar_ia_appliquer', { p_job: id })
  if (error) {
    if (!isMissingSchemaObject(error)) console.error('[avatar-ia] avatar non gardé :', error.message)
    return { ok: false }
  }
  return { ok: data === true }
}
