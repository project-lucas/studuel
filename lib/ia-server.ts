// -----------------------------------------------------------------------------
// LE CLIENT IA DU SERVEUR — partagé par le carnet (génération de questions,
// feedback, lecture de photo) et par l'Exercice de chapitre (rédaction et
// correction d'un faux contrôle).
//
// Fournisseur CONFIGURABLE et compatible OpenAI (DeepSeek inclus) :
//   AI_BASE_URL  — URL de base (défaut : OpenAI) ; DeepSeek : https://api.deepseek.com
//   AI_MODEL     — modèle (défaut : gpt-4o-mini ; DeepSeek : deepseek-chat)
//   AI_API_KEY   — clé du fournisseur (repli : OPENAI_API_KEY, déjà en place)
// Sans clé : les actions répondent { ok:false, unavailable:true } → message
// clair côté UI, jamais une erreur.
//
// ⚠️ SERVEUR SEULEMENT (suffixe `-server`, cf. CLAUDE.md) : ce module lit
// l'environnement et importe le SDK OpenAI. Il vivait dans
// app/carnet/cours/ai-actions.ts ; il en est sorti le jour où un second écran
// (l'Exercice) a eu besoin du même client, du même quota et du même lecteur
// de JSON — et parce qu'un fichier `'use server'` ne peut exporter que des
// actions, pas des utilitaires.
// -----------------------------------------------------------------------------

import type { SupabaseClient } from '@supabase/supabase-js'

export const AI_DEFAULT_MODEL = 'gpt-4o-mini'

export function aiKey(): string | null {
  return process.env.AI_API_KEY ?? process.env.OPENAI_API_KEY ?? null
}

/** Le modèle de texte principal. */
export function aiModel(): string {
  return process.env.AI_MODEL ?? AI_DEFAULT_MODEL
}

export async function aiClient(config?: { apiKey: string; baseURL?: string }) {
  const apiKey = config?.apiKey ?? aiKey()
  if (!apiKey) return null
  const baseURL = config ? config.baseURL : process.env.AI_BASE_URL
  const { default: OpenAI } = await import('openai')
  return new OpenAI({
    apiKey,
    ...(baseURL ? { baseURL } : {}),
    // Les défauts du SDK sont 10 MINUTES et 2 réessais — donc jusqu'à ~30 min
    // d'attente. Une Server Action bloquée aussi longtemps laisse l'élève sur
    // « Génération en cours… » sans aucune issue.
    timeout: 20_000,
    maxRetries: 1,
  })
}

/**
 * Les types d'appels comptés par le quota (migration 198, étendue par la 360
 * pour `exercice`). Le plafond de chacun est décidé EN BASE, jamais ici.
 */
export type QuotaKind = 'generation' | 'feedback' | 'exercice'

/**
 * Le quota quotidien d'appels IA (migration 198). C'est le seul rempart contre
 * l'usage de la clé du projet comme d'un relais LLM gratuit : le `disabled` du
 * bouton n'est qu'un garde-fou d'interface, une Server Action se rejoue.
 *
 * Tant que la migration n'est pas exécutée, la RPC est absente (PGRST202) et
 * on laisse passer — sinon déployer avant d'exécuter couperait la génération
 * pour tout le monde. Toute AUTRE erreur, elle, ferme la porte.
 */
export async function quotaOk(
  supabase: SupabaseClient,
  kind: QuotaKind,
): Promise<boolean> {
  const { data, error } = await supabase.rpc('ai_call_allowed', {
    p_kind: kind,
  })
  if (error) {
    if (error.code === 'PGRST202') return true // migration 198 en attente
    console.error('[ia] quota illisible:', error.message)
    return false
  }
  return data === true
}

// Extrait le premier tableau JSON d'une réponse de modèle (avec ou sans
// clôture markdown).
export function extractJsonArray(raw: string): unknown[] | null {
  const start = raw.indexOf('[')
  const end = raw.lastIndexOf(']')
  if (start === -1 || end === -1 || end <= start) return null
  try {
    const parsed = JSON.parse(raw.slice(start, end + 1))
    return Array.isArray(parsed) ? parsed : null
  } catch {
    return null
  }
}

// Extrait le premier objet JSON d'une réponse de modèle (avec ou sans clôture
// markdown). Un tableau n'est pas un objet : il est refusé.
export function extractJsonObject(raw: string): Record<string, unknown> | null {
  const start = raw.indexOf('{')
  const end = raw.lastIndexOf('}')
  if (start === -1 || end === -1 || end <= start) return null
  try {
    const parsed: unknown = JSON.parse(raw.slice(start, end + 1))
    return parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : null
  } catch {
    return null
  }
}
