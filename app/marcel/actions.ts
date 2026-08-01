'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { REGIMES, regimeOf } from '@/lib/coach/regimes'
import { isMissingSchemaObject } from '@/lib/schema-fallback'

// Demander quelque chose à Marcel.
//
// C'est le SEUL endroit de l'onglet qui coûte de l'argent, et il arrive en
// dernier — Marcel est d'abord un repère de méthode. Trois garde-fous, dans cet
// ordre :
//
//   1. la PORTE est en SQL (`coach_ask_allowed`, migration 215) : quota du jour,
//      puis jeton, jamais au-delà du plafond absolu. Le compteur monte avant la
//      réponse du modèle, y compris sur un refus ;
//   2. la RÉPONSE est courte (`max_tokens` serré) et sans historique : on
//      recompose un contexte compact à chaque tour, un fil de 30 messages se
//      repaierait 30 fois ;
//   3. le TEXTE de l'élève est isolé entre balises, et ne part jamais dans les
//      logs (l'objet d'erreur du SDK porte le corps de la requête).
//
// Fournisseur configurable et compatible OpenAI, comme le carnet
// (AI_BASE_URL / AI_MODEL / AI_API_KEY, repli OPENAI_API_KEY).

const AI_DEFAULT_MODEL = 'gpt-4o-mini'
const MAX_QUESTION_LEN = 400
const MAX_REPONSE_TOKENS = 320

export type DemandeResult = {
  ok: boolean
  reponse?: string
  /** Quota et jetons épuisés — ce n'est pas une panne. */
  quota?: boolean
  /** Plafond quotidien de coût atteint : rien ne le lève. */
  plafond?: boolean
  /** Aucune clé configurée, ou migration 215 pas encore exécutée. */
  unavailable?: boolean
}

function aiKey(): string | null {
  return process.env.AI_API_KEY ?? process.env.OPENAI_API_KEY ?? null
}

async function aiClient() {
  const apiKey = aiKey()
  if (!apiKey) return null
  const { default: OpenAI } = await import('openai')
  return new OpenAI({
    apiKey,
    ...(process.env.AI_BASE_URL ? { baseURL: process.env.AI_BASE_URL } : {}),
    // Les défauts du SDK (10 min, 2 réessais) laisseraient l'élève sur un
    // « Marcel réfléchit… » pendant une demi-heure.
    timeout: 20_000,
    maxRetries: 1,
  })
}

/**
 * La consigne de Marcel. Elle porte le RÉGIME de la matière : c'est ce qui fait
 * qu'il ne répond pas en histoire comme en maths — et c'est gratuit, la phrase
 * étant écrite d'avance dans lib/coach/regimes.
 *
 * Elle lui interdit surtout de faire le devoir à la place de l'élève : c'est
 * défendable pédagogiquement, vendable aux parents, et trois fois moins cher
 * qu'un corrigé rédigé.
 */
function consigneSysteme(matiereSlug: string | null): string {
  const regime = matiereSlug ? regimeOf(matiereSlug) : null
  const methode = regime ? ` Méthode de cette matière : ${REGIMES[regime].consigne}` : ''

  return [
    'Tu es Marcel, le professeur de Studuel. Tu tutoies un élève français de collège ou de lycée.',
    'Tu réponds en français, en 4 phrases maximum, sans liste et sans emoji.',
    'RÈGLE ABSOLUE : tu ne donnes JAMAIS la réponse toute faite ni un devoir rédigé.',
    'Tu donnes un indice, puis la première étape, et tu rends la main à l’élève.',
    'Si la question ne concerne pas les cours, tu réponds simplement que tu es là pour le travail scolaire.',
    `Tu finis par une question courte qui remet l’élève au travail.${methode}`,
  ].join(' ')
}

/**
 * Pose une question à Marcel. `matiereSlug` sert uniquement à choisir la
 * méthode : aucune donnée de l'élève n'est envoyée au modèle.
 */
export async function demanderAMarcel(
  question: string,
  matiereSlug: string | null,
): Promise<DemandeResult> {
  const user = await getCurrentUser()
  if (!user) return { ok: false }

  const propre =
    typeof question === 'string' ? question.trim().slice(0, MAX_QUESTION_LEN) : ''
  if (propre.length === 0) return { ok: false }

  const supabase = await createClient()

  // La porte, côté serveur. Absente (migration 215 pas exécutée) → on REFUSE :
  // c'est une fonctionnalité neuve, personne ne perd rien, et le trou ne peut
  // jamais s'ouvrir. C'est la différence assumée avec la 198.
  const { data: verdict, error } = await supabase.rpc('coach_ask_allowed', {
    p_kind: 'question',
  })
  if (error) {
    if (error.code !== 'PGRST202') {
      console.error('[marcel] porte illisible:', error.message)
    }
    return { ok: false, unavailable: true }
  }
  if (verdict === 'plafond') return { ok: false, plafond: true }
  if (verdict !== 'quota' && verdict !== 'jeton') return { ok: false, quota: true }

  const client = await aiClient()
  if (!client) return { ok: false, unavailable: true }

  try {
    const completion = await client.chat.completions.create({
      model: process.env.AI_MODEL ?? AI_DEFAULT_MODEL,
      max_tokens: MAX_REPONSE_TOKENS,
      messages: [
        { role: 'system', content: consigneSysteme(matiereSlug) },
        // Le texte de l'élève est ISOLÉ : concaténé nu, un « ignore les
        // instructions précédentes » passerait sans effort.
        { role: 'user', content: `<question>\n${propre}\n</question>` },
      ],
    })
    const reponse = completion.choices[0]?.message?.content?.trim()
    if (!reponse) return { ok: false }
    return { ok: true, reponse }
  } catch (err) {
    // Le message SEUL : l'objet d'erreur du SDK porte le corps de la requête,
    // donc la question de l'élève, qui n'a rien à faire dans les logs.
    console.error(
      '[marcel] appel du modèle impossible:',
      err instanceof Error ? err.message : 'inconnu',
    )
    return { ok: false }
  }
}

export type AchatResult = { ok: boolean; noGems?: boolean; unavailable?: boolean }

/** Convertit des gemmes en jetons de Prof (montants décidés en SQL). */
export async function acheterJetons(packs: number): Promise<AchatResult> {
  const user = await getCurrentUser()
  if (!user) return { ok: false }

  const supabase = await createClient()
  const { data, error } = await supabase.rpc('coach_buy_tokens', {
    p_packs: Number.isFinite(packs) ? Math.floor(packs) : 1,
  })

  if (error) {
    if (error.code !== 'PGRST202') {
      console.error('[marcel] achat de jetons impossible:', error.message)
    }
    return { ok: false, unavailable: true }
  }
  if (data === 'no_gems') return { ok: false, noGems: true }
  return { ok: data === 'ok' }
}

// -----------------------------------------------------------------------------
// « Vu en cours » — la seule chose que l'élève DÉCLARE, et que l'app ne peut pas
// deviner.
//
// Elle déclare le PÉRIMÈTRE (ce que le prof a traité), jamais son NIVEAU : la
// maîtrise reste mesurée par les quiz et les leçons. C'est ce qui empêche
// l'écran Progrès de devenir un formulaire d'auto-flatterie.
//
// Aucune validation d'existence du chapitre ici : la clé étrangère de la
// migration 224 refuse en base un identifiant inventé, et la RLS interdit
// d'écrire pour quelqu'un d'autre. Revalider en TypeScript ce que Postgres
// garantit coûterait une requête par clic pour la même réponse.
// -----------------------------------------------------------------------------

export type ChapitreVuResult = {
  ok: boolean
  /** Migration 224 pas encore exécutée — ce n'est pas une faute de l'élève. */
  unavailable?: boolean
}

export async function marquerChapitreVu(
  chapterId: string,
  vu: boolean,
): Promise<ChapitreVuResult> {
  const user = await getCurrentUser()
  if (!user) return { ok: false }

  const supabase = await createClient()

  const { error } = vu
    ? await supabase
        .from('chapitres_vus')
        // Recocher un chapitre déjà coché ne doit pas échouer sur la clé
        // primaire : deux onglets ouverts suffisent à produire ce doublon.
        .upsert(
          { user_id: user.id, chapter_id: chapterId },
          { onConflict: 'user_id,chapter_id', ignoreDuplicates: true },
        )
    : await supabase
        .from('chapitres_vus')
        .delete()
        .eq('user_id', user.id)
        .eq('chapter_id', chapterId)

  if (error) {
    if (isMissingSchemaObject(error)) return { ok: false, unavailable: true }
    console.error('[marcel] chapitre vu en cours:', error.message)
    return { ok: false }
  }

  // L'onglet Réviser lit la MÊME donnée pour ses couronnes : sans cette
  // invalidation, cocher un chapitre changerait le tableau de Marcel et
  // laisserait les cartes matières sur l'ancien compte.
  revalidatePath('/marcel')
  revalidatePath('/reviser')
  return { ok: true }
}
