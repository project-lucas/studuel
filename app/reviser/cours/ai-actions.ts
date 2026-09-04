'use server'

import { configVision } from '@/lib/coach/ia-vision'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import {
  isQuestionReady,
  isQuestionType,
  normalizeQuestionContent,
  questionSummary,
  MAX_FEEDBACK_LEN,
} from '@/lib/carnet-cours'

// Génération IA du carnet : questions d'un cours et feedback d'une question.
// Fournisseur CONFIGURABLE et compatible OpenAI (DeepSeek inclus) :
//   AI_BASE_URL  — URL de base (défaut : OpenAI) ; DeepSeek : https://api.deepseek.com
//   AI_MODEL     — modèle (défaut : gpt-4o-mini ; DeepSeek : deepseek-chat)
//   AI_API_KEY   — clé du fournisseur (repli : OPENAI_API_KEY, déjà en place)
// Sans clé : { ok:false, unavailable:true } → message clair côté UI.

const AI_DEFAULT_MODEL = 'gpt-4o-mini'
const MAX_AI_QUESTIONS = 25
/**
 * La carte du carnet promet « COLLE TON COURS ». Elle mentait : le champ était
 * borné à 500 caractères — de quoi écrire un thème, pas coller un cours. La
 * borne monte à ce que vaut vraiment un chapitre de manuel. Au-delà, on rogne
 * plutôt que de refuser : mieux vaut des questions sur les 12 000 premiers
 * caractères qu'un message d'erreur.
 */
const MAX_THEME_LEN = 12_000
/** Un feedback porte sur UNE question : la borne d'origine y reste bonne. */
const MAX_FEEDBACK_SOURCE_LEN = 500
/** Taille maximale d'une photo de cours (data URL base64). */
const MAX_IMAGE_LEN = 4_000_000

type AiResult = {
  ok: boolean
  /** Aucune clé configurée : la génération est indisponible (pas une erreur). */
  unavailable?: boolean
  /** Quota quotidien atteint (migration 198) — ce n'est pas une panne. */
  quota?: boolean
  created?: number
  feedback?: string
}

function aiKey(): string | null {
  return process.env.AI_API_KEY ?? process.env.OPENAI_API_KEY ?? null
}

async function aiClient(config?: { apiKey: string; baseURL?: string }) {
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
 * Le quota quotidien d'appels IA (migration 198). C'est le seul rempart contre
 * l'usage de la clé du projet comme d'un relais LLM gratuit : le `disabled` du
 * bouton n'est qu'un garde-fou d'interface, une Server Action se rejoue.
 *
 * Tant que la 198 n'est pas exécutée, la RPC est absente (PGRST202) et on
 * laisse passer — sinon déployer avant d'exécuter couperait la génération pour
 * tout le monde. Toute AUTRE erreur, elle, ferme la porte.
 */
async function quotaOk(
  supabase: Awaited<ReturnType<typeof createClient>>,
  kind: 'generation' | 'feedback',
): Promise<boolean> {
  const { data, error } = await supabase.rpc('ai_call_allowed', {
    p_kind: kind,
  })
  if (error) {
    if (error.code === 'PGRST202') return true // migration 198 en attente
    console.error('[carnet-ia] quota illisible:', error.message)
    return false
  }
  return data === true
}

async function requireUserId() {
  const supabase = await createClient()
  const user = await getCurrentUser()
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

/** Une question PROPOSÉE par l'IA, pas encore écrite en base. */
export type QuestionProposee = {
  type: string
  content: unknown
  /** Le résumé montré dans l'écran de validation. */
  apercu: string
}

export type PropositionResult = AiResult & {
  questions?: QuestionProposee[]
}

/** La source du contenu : du texte collé, ou la photo d'un cours. */
export type SourceIa =
  { kind: 'texte'; texte: string } | { kind: 'image'; dataUrl: string }

/**
 * PROPOSE des questions — sans rien écrire.
 *
 * L'ancienne version insérait directement en base. La carte du carnet promet
 * pourtant « l'IA rédige, TU VALIDES » : l'élève ne validait jamais rien, et
 * découvrait dans son cours des questions qu'il n'avait pas relues (dont
 * certaines fausses — un modèle se trompe). La validation n'est pas un confort,
 * c'est ce qui empêche le carnet d'enseigner des erreurs.
 *
 * Deux sources possibles : du texte (thème OU cours collé en entier), ou une
 * PHOTO du cours — parce que le cours d'un élève est une photo dans son
 * téléphone, et que le carnet n'avait aucune porte pour ça.
 */
export async function proposerQuestions(
  courseId: string,
  source: SourceIa,
  count: number,
  style: 'qcm' | 'flashcard' | 'mixte',
  niveau?: string,
): Promise<PropositionResult> {
  const { supabase, userId } = await requireUserId()
  if (!userId || typeof courseId !== 'string') return { ok: false }

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

  // La source, validée AVANT de dépenser le quota.
  let contenuUtilisateur:
    | { type: 'text'; text: string }
    | { type: 'image_url'; image_url: { url: string } }
  if (source?.kind === 'image') {
    const url = typeof source.dataUrl === 'string' ? source.dataUrl : ''
    // On n'accepte QUE des data URL d'image : accepter une URL http ferait de
    // cette action un relais de requêtes sortantes arbitraires — l'élève
    // (ou un appel forgé) choisirait ce que notre fournisseur va chercher.
    if (!/^data:image\/(png|jpe?g|webp);base64,/.test(url)) return { ok: false }
    if (url.length > MAX_IMAGE_LEN) return { ok: false }
    contenuUtilisateur = { type: 'image_url', image_url: { url } }
  } else {
    const texte =
      typeof source?.texte === 'string'
        ? source.texte.trim().slice(0, MAX_THEME_LEN)
        : ''
    if (texte.length === 0) return { ok: false }
    contenuUtilisateur = {
      // Le texte de l'élève est ISOLÉ entre balises : concaténé nu, un
      // « ignore les instructions précédentes » passe sans effort. Ça ne
      // remplace pas la validation de sortie (solide), mais ça évite de
      // détourner la consigne au premier essai.
      type: 'text',
      text: `<cours_ou_theme>\n${texte}\n</cours_ou_theme>`,
    }
  }

  // Une photo ne se lit qu'avec un modèle qui voit (lib/coach/ia-vision) : le
  // modèle de texte principal répond « does not support image ». Sans lecteur
  // branché, on le dit AVANT de dépenser le quota du jour.
  const vision = source?.kind === 'image' ? configVision() : null
  if (source?.kind === 'image' && !vision)
    return { ok: false, unavailable: true }

  if (!(await quotaOk(supabase, 'generation')))
    return { ok: false, quota: true }

  const client = await aiClient(vision ?? undefined)
  if (!client) return { ok: false, unavailable: true }

  const styleText =
    style === 'qcm'
      ? 'Uniquement des QCM.'
      : style === 'flashcard'
        ? 'Uniquement des flashcards.'
        : 'Mélange les types (QCM, flashcards, vrai/faux, textes à trous, réponses libres).'
  const niveauText =
    typeof niveau === 'string' && niveau.trim().length > 0
      ? ` Niveau de l'élève : ${niveau.trim().slice(0, 40)}.`
      : ''
  const consigne =
    source?.kind === 'image'
      ? `Lis cette photo de cours et génère ${n} questions dessus. ${styleText}${niveauText}`
      : `Génère ${n} questions. ${styleText}${niveauText}`

  let raw = ''
  try {
    const completion = await client.chat.completions.create({
      model: vision?.model ?? process.env.AI_MODEL ?? AI_DEFAULT_MODEL,
      max_tokens: 4_000,
      messages: [
        { role: 'system', content: GENERATION_SYSTEM },
        {
          role: 'user',
          content: [
            {
              type: 'text' as const,
              text: `${consigne}\nTitre du cours : ${String(course.title)}`,
            },
            contenuUtilisateur,
          ],
        },
      ],
    })
    raw = completion.choices[0]?.message?.content ?? ''
  } catch (error) {
    // Le message SEUL : l'objet d'erreur du SDK porte le corps de la requête,
    // donc le texte (ou la photo) de l'élève, qui n'a rien à faire dans les logs.
    console.error(
      '[carnet-ia] appel du modèle impossible:',
      error instanceof Error ? error.message : 'inconnu',
    )
    return { ok: false }
  }

  const items = extractJsonArray(raw)
  if (!items) {
    console.error('[carnet-ia] réponse du modèle illisible')
    return { ok: false }
  }

  // Chaque item est validé par la normalisation ; on ne garde que les questions
  // COMPLÈTES (jouables). En proposer une incomplète à la validation ferait
  // perdre du temps à l'élève pour rien.
  const questions: QuestionProposee[] = []
  for (const item of items.slice(0, n)) {
    if (!item || typeof item !== 'object') continue
    const o = item as Record<string, unknown>
    if (!isQuestionType(o.type)) continue
    const content = normalizeQuestionContent(o.type, o.content)
    if (!isQuestionReady(o.type, content)) continue
    questions.push({
      type: o.type,
      content,
      apercu: questionSummary(o.type, content),
    })
  }
  if (questions.length === 0) return { ok: false }

  return { ok: true, questions }
}

/**
 * Écrit les questions que l'élève a GARDÉES dans l'écran de validation.
 * Elles repassent par la normalisation : ce qui revient du client n'est jamais
 * cru sur parole, même si c'est nous qui le lui avons envoyé.
 */
export async function enregistrerQuestionsValidees(
  courseId: string,
  chapterId: string | null,
  questions: readonly { type: string; content: unknown }[],
): Promise<AiResult> {
  const { supabase, userId } = await requireUserId()
  if (!userId || typeof courseId !== 'string') return { ok: false }

  const { data: course } = await supabase
    .from('carnet_courses')
    .select('id')
    .eq('id', courseId)
    .eq('owner_id', userId)
    .maybeSingle()
  if (!course) return { ok: false }

  // Chapitre cible : il doit appartenir AU MÊME cours (la policy ne contrôle
  // que `course_id` — sans ce test, un appel forgé accrocherait sa question au
  // chapitre d'un autre élève, qui l'emporterait en supprimant le sien).
  if (chapterId !== null) {
    const { data: chapter } = await supabase
      .from('carnet_chapters')
      .select('id')
      .eq('id', chapterId)
      .eq('course_id', courseId)
      .maybeSingle()
    if (!chapter) return { ok: false }
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

  const inserts: Record<string, unknown>[] = []
  for (const q of (Array.isArray(questions) ? questions : []).slice(
    0,
    MAX_AI_QUESTIONS,
  )) {
    if (!q || !isQuestionType(q.type)) continue
    const content = normalizeQuestionContent(q.type, q.content)
    if (!isQuestionReady(q.type, content)) continue
    inserts.push({
      course_id: courseId,
      chapter_id: chapterId,
      type: q.type,
      position: position++,
      content,
    })
  }
  if (inserts.length === 0) return { ok: false }

  const { error } = await supabase.from('carnet_questions').insert(inserts)
  if (error) {
    console.error(
      '[carnet-ia] insertion des questions impossible:',
      error.message,
    )
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
  const { supabase, userId } = await requireUserId()
  if (!userId) return { ok: false }

  const cleanEnonce =
    typeof enonce === 'string'
      ? enonce.trim().slice(0, MAX_FEEDBACK_SOURCE_LEN)
      : ''
  const cleanReponse =
    typeof bonneReponse === 'string'
      ? bonneReponse.trim().slice(0, MAX_THEME_LEN)
      : ''
  if (cleanEnonce.length === 0) return { ok: false }

  // Le quota compte AVANT l'appel au modèle : cette action prend du texte
  // libre et renvoie la réponse du modèle, c'est donc la plus exposée des deux
  // (elle ne s'appuie sur aucune donnée possédée — l'éditeur envoie ce qu'il a
  // à l'écran, y compris avant enregistrement, et ça doit le rester).
  if (!(await quotaOk(supabase, 'feedback'))) return { ok: false, quota: true }

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
          content: `<question>\n${cleanEnonce}\n</question>\n<bonne_reponse>\n${cleanReponse}\n</bonne_reponse>`,
        },
      ],
    })
    const feedback = completion.choices[0]?.message?.content
      ?.trim()
      .slice(0, MAX_FEEDBACK_LEN)
    if (!feedback) return { ok: false }
    return { ok: true, feedback }
  } catch (error) {
    console.error(
      '[carnet-ia] génération du feedback impossible:',
      error instanceof Error ? error.message : 'inconnu',
    )
    return { ok: false }
  }
}
