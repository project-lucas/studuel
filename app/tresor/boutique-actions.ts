'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { isMissingSchemaObject } from '@/lib/schema-fallback'
import { offreDuMarche, type IdOffre } from '@/lib/boutique/offres'
import {
  MESSAGE_ANONYME,
  MESSAGE_BOUTIQUE_FERMEE,
  MESSAGE_HORS_VITRINE,
  MESSAGE_PANNE,
  idObjetValide,
  lireReponseAchat,
  messageRefusObjet,
  messageRefusOffre,
} from '@/lib/boutique/achat'

// -----------------------------------------------------------------------------
// LA BOUTIQUE EN GEMMES (migration 368) — les deux achats.
//
// Tout se joue dans les RPC SECURITY DEFINER : le prix est lu EN BASE, le
// verrou est posé avant toute vérification, le débit et l'effet sont atomiques.
// Ces actions ne font qu'authentifier, filtrer ce qui n'est pas en vitrine,
// appeler, et traduire la réponse en français (lib/boutique/achat.ts).
//
// Tolérantes à l'absence de la 368 (convention du projet : le code se déploie
// avant la migration) : l'élève lit « la boutique ouvre très bientôt », jamais
// une panne qu'il croirait pouvoir réessayer.
// -----------------------------------------------------------------------------

export type ResultatAchatGemmes = { ok: true; gemmes: number } | { ok: false; message: string }

type Rpc = 'acheter_offre' | 'acheter_objet_profil'

async function acheter(
  rpc: Rpc,
  params: Record<string, string>,
  messageRefus: (raison: string) => string,
): Promise<ResultatAchatGemmes> {
  const user = await getCurrentUser()
  if (!user) return { ok: false, message: MESSAGE_ANONYME }

  const supabase = await createClient()
  const { data, error } = await supabase.rpc(rpc, params)
  if (error) {
    if (isMissingSchemaObject(error)) return { ok: false, message: MESSAGE_BOUTIQUE_FERMEE }
    console.error(`[boutique] ${rpc} impossible :`, error.message)
    return { ok: false, message: MESSAGE_PANNE }
  }

  const reponse = lireReponseAchat(data)
  if (!reponse.ok) return { ok: false, message: messageRefus(reponse.raison) }

  revalidatePath('/tresor')
  return { ok: true, gemmes: reponse.gemmes }
}

/** Achète un boost du Marché — seulement s'il y est en vente. */
export async function acheterOffre(id: IdOffre): Promise<ResultatAchatGemmes> {
  // Les anciens boosts (gels, gemmes ×2…) restent en base pour ceux déjà
  // achetés : la RPC les vendrait encore, c'est ici qu'on s'en tient au Marché.
  if (!offreDuMarche(id)) return { ok: false, message: MESSAGE_HORS_VITRINE }
  return acheter('acheter_offre', { p_offre: id }, messageRefusOffre)
}

/** Achète un objet de profil (bannière, tenue, accessoire) en gemmes. */
export async function acheterObjetProfil(id: string): Promise<ResultatAchatGemmes> {
  if (!idObjetValide(id)) return { ok: false, message: messageRefusObjet('inconnu') }
  return acheter('acheter_objet_profil', { p_item_id: id }, messageRefusObjet)
}
