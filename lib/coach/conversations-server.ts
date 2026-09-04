import type { SupabaseClient } from '@supabase/supabase-js'
import { isMissingSchemaObject } from '@/lib/schema-fallback'
import {
  MAX_QUESTION_LEN,
  MAX_REPONSE_LEN,
  titreAuto,
  type ConversationResume,
  type Message,
} from './conversations'

// LES FILS DE MARCEL, CÔTÉ SERVEUR — lecture et écriture, rien de plus.
//
// Les règles (comment un fil se nomme, ce qu'on rappelle au modèle, où est le
// dernier échange) vivent dans ./conversations, pur et testé. Ici on parle à
// Postgres, et on encaisse le seul accident prévisible : la migration 349 pas
// encore exécutée.
//
// REPLI ASSUMÉ, à l'inverse de la porte des jetons (215). Là-bas, table absente
// = REFUS, parce qu'un compteur manquant ouvrirait un trou de coût. Ici, table
// absente = on répond quand même, sans garder le fil : personne ne perd
// d'argent, et l'élève garde son coach le temps que la migration passe.

/** Au-delà, les plus vieux fils sont oubliés (à la création d'un fil neuf). */
export const MAX_FILS_GARDES = 50

/** Tables absentes : l'appelant continue sans historique, il ne casse pas. */
export type SansTable = { indisponible: true }

function estIndisponible(error: { code?: string; message: string }): boolean {
  return isMissingSchemaObject(error)
}

/** Les fils de l'élève, du plus récent au plus ancien. */
export async function listerFils(
  supabase: SupabaseClient,
  userId: string,
): Promise<ConversationResume[] | SansTable> {
  const { data, error } = await supabase
    .from('coach_conversations')
    .select('id, title, updated_at')
    .eq('owner_id', userId)
    .order('updated_at', { ascending: false })
    .limit(MAX_FILS_GARDES)

  if (error) {
    if (estIndisponible(error)) return { indisponible: true }
    console.error('[marcel] historique illisible:', error.message)
    return []
  }

  return (data ?? []).map((row) => ({
    id: String(row.id),
    titre: String(row.title),
    maj: String(row.updated_at),
  }))
}

/**
 * Les messages d'un fil, dans l'ordre. La RLS fait le contrôle de propriété —
 * un identifiant volé ne rend rien.
 */
export async function chargerMessages(
  supabase: SupabaseClient,
  conversationId: string,
): Promise<Message[]> {
  const { data, error } = await supabase
    .from('coach_messages')
    .select('id, role, content')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })

  if (error) {
    if (!estIndisponible(error)) {
      console.error('[marcel] fil illisible:', error.message)
    }
    return []
  }

  return (data ?? []).map((row) => ({
    id: String(row.id),
    role: row.role === 'marcel' ? 'marcel' : 'eleve',
    texte: String(row.content),
  }))
}

/** Le titre et la matière d'un fil — pour rouvrir l'écran dans son contexte. */
export async function chargerEntete(
  supabase: SupabaseClient,
  conversationId: string,
): Promise<{ titre: string; matiere: string | null } | null> {
  const { data, error } = await supabase
    .from('coach_conversations')
    .select('title, subject_slug')
    .eq('id', conversationId)
    .maybeSingle()

  if (error || !data) return null
  return {
    titre: String(data.title),
    matiere: data.subject_slug ? String(data.subject_slug) : null,
  }
}

/**
 * Écrit un échange : la question, puis la réponse. Crée le fil au premier tour
 * et le nomme avec la question.
 *
 * Rend l'identifiant du fil (le même qu'à l'entrée s'il existait), ou `null`
 * quand rien n'a pu être écrit — l'appelant a déjà sa réponse à afficher, il ne
 * doit pas la perdre pour autant.
 */
export async function enregistrerEchange(
  supabase: SupabaseClient,
  userId: string,
  params: {
    conversationId: string | null
    question: string
    reponse: string
    matiereSlug: string | null
  },
): Promise<{ conversationId: string; titre: string } | null> {
  const question = params.question.slice(0, MAX_QUESTION_LEN)
  const reponse = params.reponse.slice(0, MAX_REPONSE_LEN)
  let conversationId = params.conversationId
  let titre = titreAuto(question)

  if (conversationId === null) {
    const { data, error } = await supabase
      .from('coach_conversations')
      .insert({
        owner_id: userId,
        title: titre,
        subject_slug: params.matiereSlug,
      })
      .select('id, title')
      .single()

    if (error || !data) {
      if (!estIndisponible(error ?? { message: '' })) {
        console.error('[marcel] fil impossible à ouvrir:', error?.message)
      }
      return null
    }
    conversationId = String(data.id)
    titre = String(data.title)
    await oublierLesPlusVieux(supabase, userId)
  } else {
    // Le fil existe : son titre ne bouge pas (l'élève a pu le renommer), mais
    // sa date de dernière activité, si — c'est elle qui trie l'historique.
    const { data } = await supabase
      .from('coach_conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId)
      .eq('owner_id', userId)
      .select('title')
      .maybeSingle()
    if (data) titre = String(data.title)
  }

  const { error } = await supabase.from('coach_messages').insert([
    { conversation_id: conversationId, role: 'eleve', content: question },
    { conversation_id: conversationId, role: 'marcel', content: reponse },
  ])
  if (error) {
    console.error('[marcel] messages non écrits:', error.message)
    return null
  }

  return { conversationId, titre }
}

/**
 * Le ménage : au-delà de cinquante fils, les plus vieux s'effacent.
 *
 * Sans lui, l'historique deviendrait une liste infinie que personne ne fait
 * défiler — et une table qui grossit pour rien. Fait UNIQUEMENT à l'ouverture
 * d'un fil neuf : c'est le seul moment où le compte peut dépasser.
 */
async function oublierLesPlusVieux(
  supabase: SupabaseClient,
  userId: string,
): Promise<void> {
  const { data, error } = await supabase
    .from('coach_conversations')
    .select('id')
    .eq('owner_id', userId)
    .order('updated_at', { ascending: false })
    .range(MAX_FILS_GARDES, MAX_FILS_GARDES + 49)

  if (error || !data || data.length === 0) return

  await supabase
    .from('coach_conversations')
    .delete()
    .in(
      'id',
      data.map((row) => String(row.id)),
    )
}
