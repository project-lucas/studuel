'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import {
  isQuestionReady,
  isQuestionType,
  normalizeQuestionContent,
  MAX_FEEDBACK_LEN,
} from '@/lib/carnet-cours'

// Génération IA du carnet : questions d'un cours et feedback d'une question.
// Fournisseur CONFIGURABLE et compatible OpenAI (DeepSeek inclus) :
//   AI_BASE_URL  — URL de base (défaut : OpenAI) ; DeepSeek : https://api.deepseek.com
//   AI_MODEL     — modèle (défaut : gpt-4o-mini ; DeepSeek : deepseek-chat)
//   AI_API_KEY   — clé du fournisseur (repli : OPENAI_API_KEY, déjà en place)
// Sans clé : { ok:false, unavailable:true } → message clair côté UI.

const AI_DEFAULT_MODEL = 'gpt-4o-mini'
const MAX_AI_QUESTIONS = 15
const MAX_THEME_LEN = 500

type AiResult = {
  ok: boolean
  /** Aucune clé configurée : la génération est indisponible (pas une erreur). */
  unavailable?: boolean
  created?: number
  feedback?: string
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
  })
}

async function requireUserId() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return { supabase, userId: user?.id ?? null }
}

// Extrait le premier tableau JSON d'une réponse de modèle (avec ou sans
// clôture markdown).
function extractJsonArray(raw: string): unknown[] | null {
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

const GENERATION_SYSTEM = `Tu écris des questions de révision pour un élève français (collège/lycée), en français.
Réponds UNIQUEMENT avec un tableau JSON, sans texte autour. Chaque élément est un objet :
- QCM : {"type":"qcm","content":{"enonce":"…","choix":[{"texte":"…","correct":true},{"texte":"…","correct":false},{"texte":"…","correct":false},{"texte":"…","correct":false}],"feedback":"courte explication"}}
- Flashcard : {"type":"flashcard","content":{"recto":"…","verso":"…","langue_recto":null,"langue_verso":null}}
- Vrai/Faux : {"type":"vrai_faux","content":{"enonce":"affirmation","reponse":true,"feedback":"courte explication"}}
- Texte à trous : {"type":"texte_a_trous","content":{"texte":"phrase avec le mot clé [entre crochets]"}}
- Réponse libre : {"type":"reponse_libre","content":{"enonce":"…","reponses":["réponse acceptée","variante"]}}
Questions factuelles, adaptées au niveau demandé, une seule bonne réponse par QCM sauf mention contraire.`

/**
 * Génère `count` questions sur `theme` et les insère dans le cours (au niveau
 * racine ou dans `chapterId`). `style` oriente le mélange de types.
 */
export async function generateCourseQuestions(
  courseId: string,
  chapterId: string | null,
  theme: string,
  count: number,
  style: 'qcm' | 'flashcard' | 'mixte',
): Promise<AiResult> {
  const { supabase, userId } = await requireUserId()
  if (!userId || typeof courseId !== 'string') return { ok: false }

  const cleanTheme =
    typeof theme === 'string' ? theme.trim().slice(0, MAX_THEME_LEN) : ''
  if (cleanTheme.length === 0) return { ok: false }
  const n = Math.min(
    MAX_AI_QUESTIONS,
    Math.max(1, Number.isFinite(count) ? Math.floor(count) : 5),
  )

  // Propriété du cours (défense en profondeur, en plus de la RLS).
  const { data: course } = await supabase
    .from('carnet_courses')
    .select('id, title')
    .eq('id', courseId)
    .eq('owner_id', userId)
    .maybeSingle()
  if (!course) return { ok: false }

  const client = await aiClient()
  if (!client) return { ok: false, unavailable: true }

  const styleText =
    style === 'qcm'
      ? 'Uniquement des QCM.'
      : style === 'flashcard'
        ? 'Uniquement des flashcards.'
        : 'Mélange les types (QCM, flashcards, vrai/faux, textes à trous, réponses libres).'

  let raw = ''
  try {
    const completion = await client.chat.completions.create({
      model: process.env.AI_MODEL ?? AI_DEFAULT_MODEL,
      max_tokens: 3_000,
      messages: [
        { role: 'system', content: GENERATION_SYSTEM },
        {
          role: 'user',
          content: `Cours : « ${String(course.title)} ». Thème demandé : « ${cleanTheme} ». Génère ${n} questions. ${styleText}`,
        },
      ],
    })
    raw = completion.choices[0]?.message?.content ?? ''
  } catch (error) {
    console.error('[carnet-ia] appel du modèle impossible:', error)
    return { ok: false }
  }

  const items = extractJsonArray(raw)
  if (!items) {
    console.error('[carnet-ia] réponse du modèle illisible')
    return { ok: false }
  }

  // Position de départ : à la suite du conteneur cible.
  let posQuery = supabase
    .from('carnet_questions')
    .select('position')
    .eq('course_id', courseId)
    .order('position', { ascending: false })
    .limit(1)
  posQuery =
    chapterId === null
      ? posQuery.is('chapter_id', null)
      : posQuery.eq('chapter_id', chapterId)
  const { data: posRows } = await posQuery
  let position =
    posRows && posRows.length > 0 ? Number(posRows[0].position) + 1 : 0

  // Chaque item est validé par la normalisation ; on ne garde que les
  // questions complètes (jouables) parmi les `n` demandées.
  const inserts: Record<string, unknown>[] = []
  for (const item of items.slice(0, n)) {
    if (!item || typeof item !== 'object') continue
    const o = item as Record<string, unknown>
    if (!isQuestionType(o.type)) continue
    const content = normalizeQuestionContent(o.type, o.content)
    if (!isQuestionReady(o.type, content)) continue
    inserts.push({
      course_id: courseId,
      chapter_id: chapterId,
      type: o.type,
      position: position++,
      content,
    })
  }
  if (inserts.length === 0) return { ok: false }

  const { error } = await supabase.from('carnet_questions').insert(inserts)
  if (error) {
    console.error('[carnet-ia] insertion des questions impossible:', error.message)
    return { ok: false }
  }
  revalidatePath(`/reviser/cours/${courseId}`)
  revalidatePath('/reviser')
  return { ok: true, created: inserts.length }
}

/**
 * Génère un court feedback pédagogique pour une question (éditeur : bouton
 * « Générer un feedback »). Ne l'enregistre pas — l'éditeur le place dans le
 * champ, l'élève reste maître du contenu.
 */
export async function generateQuestionFeedback(
  enonce: string,
  bonneReponse: string,
): Promise<AiResult> {
  const { userId } = await requireUserId()
  if (!userId) return { ok: false }

  const cleanEnonce =
    typeof enonce === 'string' ? enonce.trim().slice(0, MAX_THEME_LEN) : ''
  const cleanReponse =
    typeof bonneReponse === 'string'
      ? bonneReponse.trim().slice(0, MAX_THEME_LEN)
      : ''
  if (cleanEnonce.length === 0) return { ok: false }

  const client = await aiClient()
  if (!client) return { ok: false, unavailable: true }

  try {
    const completion = await client.chat.completions.create({
      model: process.env.AI_MODEL ?? AI_DEFAULT_MODEL,
      max_tokens: 200,
      messages: [
        {
          role: 'system',
          content:
            "Tu es un professeur bienveillant. On te donne une question de révision et sa bonne réponse. Rédige en français un feedback d'une à deux phrases qui explique pourquoi c'est la bonne réponse, en tutoyant l'élève. Pas de liste, pas d'emojis.",
        },
        {
          role: 'user',
          content: `Question : ${cleanEnonce}\nBonne réponse : ${cleanReponse}`,
        },
      ],
    })
    const feedback = completion.choices[0]?.message?.content
      ?.trim()
      .slice(0, MAX_FEEDBACK_LEN)
    if (!feedback) return { ok: false }
    return { ok: true, feedback }
  } catch (error) {
    console.error('[carnet-ia] génération du feedback impossible:', error)
    return { ok: false }
  }
}
