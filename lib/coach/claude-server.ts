import 'server-only'

import Anthropic from '@anthropic-ai/sdk'
import { betaZodOutputFormat } from '@anthropic-ai/sdk/helpers/beta/zod'
import { z } from 'zod'

/**
 * L'APPEL À CLAUDE DE L'ASSISTANT DU COACH (16/10/2026). Le SDK officiel
 * (`@anthropic-ai/sdk`), clé `ANTHROPIC_API_KEY` côté serveur seulement.
 *
 * Modèle : Claude Sonnet 5.5 — le choix validé par Lucas pour les « gros
 * travaux » de rédaction (bilans, brouillons, tri), à $2 / $10 le million de
 * jetons : un tri de cent élèves coûte quelques centimes. Effort `medium`.
 * Les réponses structurées passent par un schéma (`betaZodOutputFormat`) : pas
 * de JSON à deviner. Le repli côté serveur (`fallbacks: 'default'`) relance la
 * demande sur un autre modèle si un filtre de sécurité la refuse par erreur.
 */

const MODELE = 'claude-sonnet-5-5'

export type ResultatClaude<T> =
  | { ok: true; valeur: T; jetons: { entree: number; sortie: number } }
  | { ok: false; erreur: string }

let client: Anthropic | null = null
function claude(): Anthropic | null {
  if (!process.env.ANTHROPIC_API_KEY) return null
  client ??= new Anthropic({ timeout: 90_000, maxRetries: 2 })
  return client
}

export function claudeConfigure(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY)
}

function erreurLisible(e: unknown): string {
  if (e instanceof Anthropic.AuthenticationError) return 'La clé de l’API Claude est refusée : vérifie ANTHROPIC_API_KEY.'
  if (e instanceof Anthropic.RateLimitError) return 'Claude est saturé pour l’instant : réessaie dans une minute.'
  if (e instanceof Anthropic.BadRequestError) return 'La demande a été refusée par l’API Claude.'
  if (e instanceof Anthropic.APIConnectionError) return 'Impossible de joindre l’API Claude.'
  if (e instanceof Anthropic.APIError) return `L’API Claude a répondu une erreur (${e.status ?? '?'}).`
  return 'L’assistant n’a pas pu répondre.'
}

/** Une demande dont la réponse suit un schéma. */
export async function demanderStructure<S extends z.ZodType>(
  consigne: string,
  donnees: string,
  schema: S,
  maxTokens = 6000,
): Promise<ResultatClaude<z.infer<S>>> {
  const c = claude()
  if (!c) return { ok: false, erreur: 'L’assistant n’est pas branché : la variable ANTHROPIC_API_KEY manque sur le serveur.' }
  try {
    const r = await c.beta.messages.parse({
      model: MODELE,
      max_tokens: maxTokens,
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      output_config: { effort: 'medium', format: betaZodOutputFormat(schema) },
      system: consigne,
      messages: [{ role: 'user', content: donnees }],
    })
    if (r.stop_reason === 'refusal') return { ok: false, erreur: 'Claude a refusé cette demande.' }
    if (r.stop_reason === 'max_tokens') return { ok: false, erreur: 'La réponse était trop longue : réessaie sur moins d’élèves.' }
    if (!r.parsed_output) return { ok: false, erreur: 'La réponse de Claude était illisible : réessaie.' }
    return { ok: true, valeur: r.parsed_output as z.infer<S>, jetons: { entree: r.usage.input_tokens, sortie: r.usage.output_tokens } }
  } catch (e) {
    console.error('[assistant] appel Claude :', e instanceof Error ? e.message : e)
    return { ok: false, erreur: erreurLisible(e) }
  }
}

/** Une demande dont la réponse est un texte libre. */
export async function demanderTexte(consigne: string, donnees: string, maxTokens = 2000): Promise<ResultatClaude<string>> {
  const c = claude()
  if (!c) return { ok: false, erreur: 'L’assistant n’est pas branché : la variable ANTHROPIC_API_KEY manque sur le serveur.' }
  try {
    const r = await c.beta.messages.create({
      model: MODELE,
      max_tokens: maxTokens,
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      output_config: { effort: 'medium' },
      system: consigne,
      messages: [{ role: 'user', content: donnees }],
    })
    if (r.stop_reason === 'refusal') return { ok: false, erreur: 'Claude a refusé cette demande.' }
    const texte = r.content
      .flatMap((b) => (b.type === 'text' ? [b.text] : []))
      .join('\n')
      .trim()
    if (!texte) return { ok: false, erreur: 'Claude n’a rien répondu : réessaie.' }
    return { ok: true, valeur: texte, jetons: { entree: r.usage.input_tokens, sortie: r.usage.output_tokens } }
  } catch (e) {
    console.error('[assistant] appel Claude :', e instanceof Error ? e.message : e)
    return { ok: false, erreur: erreurLisible(e) }
  }
}

/** Le schéma du tri du matin (lib/coach/assistant : ResultatTri). */
export const SCHEMA_TRI = z.object({
  synthese: z.string(),
  eleves: z.array(
    z.object({
      code: z.string(),
      urgence: z.enum(['haute', 'moyenne', 'basse']),
      raison: z.string(),
      action: z.string(),
      message: z.string(),
    }),
  ),
})
