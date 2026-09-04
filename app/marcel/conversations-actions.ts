'use server'

import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { dernierEchange, nettoyerTitre } from '@/lib/coach/conversations'
import type { ConversationResume, Message } from '@/lib/coach/conversations'
import {
  chargerEntete,
  chargerMessages,
  listerFils,
} from '@/lib/coach/conversations-server'
import { rangerCartes, rangerEchange } from '@/lib/coach/carnet-pont'
import { lireCartes } from '@/lib/coach/cartes-ia'

// L'HISTORIQUE DES FILS — lire, rouvrir, renommer, oublier.
//
// Quatre gestes, quatre actions, aucune logique : les règles sont dans
// lib/coach/conversations (pur, testé) et l'accès en base dans son voisin
// -server. La propriété est garantie par la RLS de la migration 349 : un
// identifiant volé ne rend rien et n'écrit rien, sans qu'on ait à le vérifier
// deux fois.
//
// Aucune de ces actions ne coûte un appel au modèle. Aucune ne touche au quota.

export type HistoriqueResult = {
  ok: boolean
  conversations: ConversationResume[]
  /** Migration 349 pas encore exécutée — l'écran s'en passe sans casser. */
  unavailable?: boolean
}

export async function listerConversations(): Promise<HistoriqueResult> {
  const user = await getCurrentUser()
  if (!user) return { ok: false, conversations: [] }

  const supabase = await createClient()
  const fils = await listerFils(supabase, user.id)
  if ('indisponible' in fils) {
    return { ok: false, conversations: [], unavailable: true }
  }
  return { ok: true, conversations: fils }
}

export type FilResult = {
  ok: boolean
  titre?: string
  matiere?: string | null
  messages: Message[]
}

/** Rouvre un fil : son titre, sa matière, ses messages dans l'ordre. */
export async function chargerConversation(id: string): Promise<FilResult> {
  const user = await getCurrentUser()
  if (!user || typeof id !== 'string') return { ok: false, messages: [] }

  const supabase = await createClient()
  const entete = await chargerEntete(supabase, id)
  if (!entete) return { ok: false, messages: [] }

  return {
    ok: true,
    titre: entete.titre,
    matiere: entete.matiere,
    messages: await chargerMessages(supabase, id),
  }
}

export type Ok = { ok: boolean }

/**
 * Renomme un fil. Le titre vide est REFUSÉ plutôt qu'écrit : il effacerait le
 * seul repère de la ligne dans l'historique.
 */
export async function renommerConversation(
  id: string,
  titre: string,
): Promise<{ ok: boolean; titre?: string }> {
  const user = await getCurrentUser()
  if (!user || typeof id !== 'string') return { ok: false }

  const propre = nettoyerTitre(titre)
  if (propre === null) return { ok: false }

  const supabase = await createClient()
  const { error } = await supabase
    .from('coach_conversations')
    .update({ title: propre })
    .eq('id', id)
    .eq('owner_id', user.id)

  if (error) {
    console.error('[marcel] renommage impossible:', error.message)
    return { ok: false }
  }
  return { ok: true, titre: propre }
}

/**
 * Oublie un fil. Les messages partent avec lui (ON DELETE CASCADE) — mais pas
 * les cartes déjà rangées dans le carnet : une fois là-bas, elles appartiennent
 * au carnet, et supprimer une conversation ne doit pas vider une révision.
 */
export async function supprimerConversation(id: string): Promise<Ok> {
  const user = await getCurrentUser()
  if (!user || typeof id !== 'string') return { ok: false }

  const supabase = await createClient()
  const { error } = await supabase
    .from('coach_conversations')
    .delete()
    .eq('id', id)
    .eq('owner_id', user.id)

  if (error) {
    console.error('[marcel] suppression impossible:', error.message)
    return { ok: false }
  }
  return { ok: true }
}

export type CarnetResult = {
  ok: boolean
  courseId?: string
  cours?: string
  /** Le fil n'a pas encore d'échange complet : rien à ranger. */
  vide?: boolean
}

/**
 * Le bouton « Dans mon carnet », sous une réponse de Marcel.
 *
 * Même destination que la phrase « envoie ça dans mon carnet » (lib/coach/
 * vers-carnet) : un seul chemin d'écriture, deux façons de le déclencher. Le
 * bouton existe parce qu'une fonctionnalité qu'il faut deviner en la tapant
 * n'est utilisée par personne.
 */
export async function rangerDansCarnet(
  conversationId: string,
): Promise<CarnetResult> {
  const user = await getCurrentUser()
  if (!user || typeof conversationId !== 'string') return { ok: false }

  const supabase = await createClient()
  const echange = dernierEchange(await chargerMessages(supabase, conversationId))
  if (!echange) return { ok: false, vide: true }

  const range = await rangerEchange(supabase, user.id, echange)
  if (!range) return { ok: false }

  return { ok: true, courseId: range.courseId, cours: range.cours }
}

/**
 * Range les cartes que Marcel vient de fabriquer et que l'élève a RELUES.
 *
 * Rien n'est écrit avant ce geste : un modèle se trompe, et le carnet est le
 * support de révision de l'élève — il n'a pas à y découvrir des cartes fausses
 * qu'il n'a jamais validées. C'est la même règle que la génération du carnet
 * (« l'IA rédige, TU valides »).
 */
export async function rangerCartesProposees(
  cartes: readonly { recto: string; verso: string }[],
): Promise<CarnetResult & { ajoutees?: number }> {
  const user = await getCurrentUser()
  if (!user || !Array.isArray(cartes) || cartes.length === 0) {
    return { ok: false, vide: true }
  }

  // Ce qui revient du client n'est jamais cru sur parole, même si c'est nous
  // qui le lui avons envoyé : on relit les cartes avec le même filtre qu'à la
  // sortie du modèle.
  const propres = lireCartes(JSON.stringify(cartes))
  if (propres.length === 0) return { ok: false, vide: true }

  const supabase = await createClient()
  const range = await rangerCartes(supabase, user.id, propres)
  if (!range) return { ok: false }

  return {
    ok: true,
    courseId: range.courseId,
    cours: range.cours,
    ajoutees: range.ajoutees,
  }
}
