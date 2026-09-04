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
  type EpreuveId,
} from '@/lib/coach/oral'
import {
  CONSIGNE_ORAL,
  ficheOral,
  lireConseils,
} from '@/lib/coach/oral-conseils'

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
  return (data as string) === 'ok'
    ? { statut: 'ok' }
    : { statut: 'introuvable' }
}

// -----------------------------------------------------------------------------
// L'AVIS DE MARCEL SUR UN PASSAGE — le seul appel au modèle de tout l'atelier.
//
// La promesse de l'écran ne bouge pas : l'audio reste sur l'appareil. Marcel
// n'entend RIEN. Il lit les faits que l'élève vient de produire (épreuve, sujet
// annoncé, durée tenue, cases cochées après réécoute) et rend quatre actions
// pour le prochain passage. La fiche envoyée est fabriquée par un module pur et
// testé (lib/coach/oral-conseils), dont un test vérifie qu'aucune trace d'audio
// ne peut s'y glisser.
//
// C'est un geste EXPLICITE de l'élève, jamais automatique, et il passe par la
// même porte que les questions (`coach_ask_allowed`) : il se décompte du quota
// du jour comme le reste. Les quatre barreaux de l'échelle, eux, restent
// gratuits de bout en bout — c'est l'avis, et lui seul, qui se paie.
// -----------------------------------------------------------------------------

const AI_DEFAULT_MODEL = 'gpt-4o-mini'

export type ConseilsResult = {
  ok: boolean
  conseils?: string[]
  quota?: boolean
  plafond?: boolean
  unavailable?: boolean
}

export async function conseilsOral(input: {
  epreuveId: string
  sujet: string
  secondes: number
  criteres: Criteres
}): Promise<ConseilsResult> {
  const user = await getCurrentUser()
  if (!user) return { ok: false }

  const supabase = await createClient()

  const { data: verdict, error } = await supabase.rpc('coach_ask_allowed', {
    p_kind: 'oral',
  })
  if (error) {
    if (error.code !== 'PGRST202') {
      console.error('[oral] porte illisible:', error.message)
    }
    return { ok: false, unavailable: true }
  }
  if (verdict === 'plafond') return { ok: false, plafond: true }
  if (verdict !== 'quota' && verdict !== 'jeton')
    return { ok: false, quota: true }

  const apiKey = process.env.AI_API_KEY ?? process.env.OPENAI_API_KEY ?? null
  if (!apiKey) return { ok: false, unavailable: true }

  const fiche = ficheOral({
    epreuveId: epreuveOf(input?.epreuveId ?? '').id as EpreuveId,
    sujet: typeof input?.sujet === 'string' ? input.sujet : '',
    secondes: Number.isFinite(input?.secondes)
      ? Math.min(7200, Math.max(0, Math.floor(input.secondes)))
      : 0,
    criteres: {
      intro: input?.criteres?.intro === true,
      plan: input?.criteres?.plan === true,
      transitions: input?.criteres?.transitions === true,
    },
  })

  try {
    const { default: OpenAI } = await import('openai')
    const client = new OpenAI({
      apiKey,
      ...(process.env.AI_BASE_URL ? { baseURL: process.env.AI_BASE_URL } : {}),
      timeout: 20_000,
      maxRetries: 1,
    })

    const completion = await client.chat.completions.create({
      model: process.env.AI_MODEL ?? AI_DEFAULT_MODEL,
      max_tokens: 320,
      messages: [
        { role: 'system', content: CONSIGNE_ORAL },
        {
          role: 'user',
          content: `<passage>
${fiche}
</passage>`,
        },
      ],
    })

    const conseils = lireConseils(completion.choices[0]?.message?.content ?? '')
    if (conseils.length === 0) return { ok: false }
    return { ok: true, conseils }
  } catch (err) {
    console.error(
      '[oral] avis impossible:',
      err instanceof Error ? err.message : 'inconnu',
    )
    return { ok: false }
  }
}
