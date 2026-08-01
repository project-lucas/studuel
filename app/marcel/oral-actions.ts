'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { isMissingSchemaObject } from '@/lib/schema-fallback'
import {
  epreuveOf,
  nettoyerCommentaire,
  verifierSujet,
  type BarreauId,
  type Criteres,
} from '@/lib/coach/oral'

// Les actions de l'échelle de l'oral (migration 222).
//
// ⚠️ AUCUN AUDIO NE PASSE PAR ICI, et ce n'est pas un oubli : l'enregistrement
// du barreau 3 reste dans le navigateur (MediaRecorder → URL locale) et meurt
// avec l'onglet. Ces actions ne transportent qu'une durée et trois booléens.
// Pas de voix de mineur sur nos serveurs — donc pas de RGPD à porter, pas de
// stockage à payer, et rien à fuiter.

export type PassageResult =
  | { statut: 'ok' }
  | { statut: 'invalide'; raison: string }
  | { statut: 'indisponible' }
  | { statut: 'erreur' }

/** Barreaux 2 et 3 : un passage que l'élève vient de faire. */
export async function enregistrerPassage(
  barreau: BarreauId,
  sujetBrut: string,
  epreuveId: string,
  duree: number,
  criteres: Criteres | null,
): Promise<PassageResult> {
  const sujet = verifierSujet(sujetBrut)
  if (!sujet.ok) return { statut: 'invalide', raison: sujet.raison }

  const user = await getCurrentUser()
  if (!user) return { statut: 'erreur' }

  const secondes = Number.isFinite(duree)
    ? Math.min(7200, Math.max(0, Math.floor(duree)))
    : 0

  const supabase = await createClient()
  const { error } = await supabase.from('oral_sessions').insert({
    user_id: user.id,
    barreau,
    epreuve: epreuveOf(epreuveId).id,
    sujet: sujet.valeur,
    duree: secondes,
    intro: criteres?.intro ?? null,
    plan: criteres?.plan ?? null,
    transitions: criteres?.transitions ?? null,
  })

  if (error) {
    if (isMissingSchemaObject(error)) return { statut: 'indisponible' }
    console.error('[oral] passage non enregistré:', error.message)
    return { statut: 'erreur' }
  }

  revalidatePath('/marcel')
  return { statut: 'ok' }
}

export type DemandeResult =
  | { statut: 'envoyee' }
  | { statut: 'deja' }
  | { statut: 'pas-ami' }
  | { statut: 'trop' }
  | { statut: 'invalide'; raison: string }
  | { statut: 'indisponible' }
  | { statut: 'erreur' }

/** Barreau 4 : demander à un ami d'écouter. L'amitié est vérifiée EN BASE. */
export async function demanderEcoute(
  listenerId: string,
  sujetBrut: string,
  epreuveId: string,
): Promise<DemandeResult> {
  const sujet = verifierSujet(sujetBrut)
  if (!sujet.ok) return { statut: 'invalide', raison: sujet.raison }

  const supabase = await createClient()
  const { data, error } = await supabase.rpc('request_oral_listen', {
    p_listener_id: listenerId,
    p_sujet: sujet.valeur,
    p_epreuve: epreuveOf(epreuveId).id,
  })

  if (error) {
    if (isMissingSchemaObject(error)) return { statut: 'indisponible' }
    console.error('[oral] demande non envoyée:', error.message)
    return { statut: 'erreur' }
  }

  revalidatePath('/marcel')
  revalidatePath('/amis')
  switch (data as string) {
    case 'sent':
      return { statut: 'envoyee' }
    case 'already':
      return { statut: 'deja' }
    case 'rate_limited':
      return { statut: 'trop' }
    default:
      return { statut: 'pas-ami' }
  }
}

export type EcouteResult =
  | { statut: 'ok' }
  | { statut: 'introuvable' }
  | { statut: 'deja' }
  | { statut: 'indisponible' }
  | { statut: 'erreur' }

/** L'auditeur coche les trois cases. Le passage entre au compteur de l'orateur. */
export async function repondreEcoute(
  requestId: string,
  criteres: Criteres,
  commentaireBrut?: string | null,
): Promise<EcouteResult> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('answer_oral_listen', {
    p_request_id: requestId,
    p_intro: criteres.intro,
    p_plan: criteres.plan,
    p_transitions: criteres.transitions,
    p_commentaire: nettoyerCommentaire(commentaireBrut),
  })

  if (error) {
    if (isMissingSchemaObject(error)) return { statut: 'indisponible' }
    console.error('[oral] écoute non enregistrée:', error.message)
    return { statut: 'erreur' }
  }

  revalidatePath('/amis')
  revalidatePath('/marcel')
  const code = data as string
  if (code === 'ok') return { statut: 'ok' }
  if (code === 'already') return { statut: 'deja' }
  return { statut: 'introuvable' }
}

/** Refuser — sans laisser la demande en attente indéfiniment. */
export async function refuserEcoute(requestId: string): Promise<EcouteResult> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('decline_oral_listen', {
    p_request_id: requestId,
  })
  if (error) {
    if (isMissingSchemaObject(error)) return { statut: 'indisponible' }
    return { statut: 'erreur' }
  }
  revalidatePath('/amis')
  return (data as string) === 'ok' ? { statut: 'ok' } : { statut: 'introuvable' }
}
