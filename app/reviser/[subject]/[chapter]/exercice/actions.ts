'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { aiClient, aiModel, extractJsonObject, quotaOk } from '@/lib/ia-server'
import { canAccessPremiumTests, getUserTierFor } from '@/lib/subscription'
import { gradeLabel } from '@/lib/grades'
import { isMissingSchemaObject } from '@/lib/schema-fallback'
import {
  DIFFICULTE_DEFAUT,
  estDifficulte,
  exercicePublic,
  extraitCours,
  parseCorrection,
  parseExercice,
  promptCorrection,
  promptExercice,
  styleExercice,
  REPONSE_MAX_LEN,
  type Correction,
  type Difficulte,
  type Exercice,
  type StyleExercice,
} from '@/lib/exercice'

// L'EXERCICE DE CHAPITRE — le faux contrôle rédigé et corrigé par l'IA.
//
// Deux actions, et une seule façon de dépenser un appel IA : l'abonnement
// d'abord (c'est l'offre Studuel+), le quota du jour ensuite (migration 360 :
// 12 appels par élève et par jour, génération et correction confondues). La
// logique — style, prompts, lecture stricte des réponses — vit dans
// lib/exercice.ts ; ici on lit, on appelle, on range.
//
// L'épreuve est PARTAGÉE (table chapter_exercices) : un chapitre a le même
// cours pour tout le monde, donc son contrôle est généré une fois et resservi.
// La copie et sa note sont à l'élève seul (chapter_exercice_reponses).

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/** Pourquoi une action n'a pas abouti — l'écran choisit son message. */
export type RaisonExercice =
  | 'auth'
  | 'premium'
  | 'quota'
  | 'indisponible'
  | 'introuvable'
  | 'erreur'

export type ExerciceServi = {
  id: string
  style: StyleExercice
  difficulte: Difficulte
  /** Le sujet SANS son corrigé (cf. exercicePublic). */
  exercice: Exercice
}

export type ResultatExercice =
  | { ok: true; exercice: ExerciceServi }
  | { ok: false; raison: RaisonExercice }

export type ResultatCopie =
  | { ok: true; correction: Correction }
  | { ok: false; raison: RaisonExercice }

type ChapitreRow = {
  id: string
  title: string
  level: string
  subject: { slug: string; name: string } | null
}

type LigneExercice = {
  id: string
  style: StyleExercice
  contenu: unknown
  difficulte?: number | null
}

/** Relit une ligne de chapter_exercices ; `null` si son contenu est illisible. */
function servir(
  row: LigneExercice | null,
  difficulte: Difficulte,
): ExerciceServi | null {
  const exercice = row ? parseExercice(row.contenu) : null
  if (!row || !exercice) return null
  return {
    id: row.id,
    style: row.style,
    difficulte: estDifficulte(row.difficulte) ? row.difficulte : difficulte,
    // Le corrigé d'un sujet du catalogue ne part JAMAIS avant la copie.
    exercice: exercicePublic(exercice),
  }
}

/**
 * Le sujet déjà rangé pour ce chapitre et ce niveau : celui du CATALOGUE
 * d'abord (écrit d'avance et relu, migration 365), sinon le dernier rédigé par
 * l'IA à ce niveau. Tant que la migration 364 n'est pas passée, les colonnes
 * n'existent pas : on relit alors le dernier sujet, comme avant.
 */
async function sujetRange(
  supabase: Awaited<ReturnType<typeof createClient>>,
  chapterId: string,
  difficulte: Difficulte,
): Promise<ExerciceServi | null> {
  const { data: range, error } = await supabase
    .from('chapter_exercices')
    .select('id, style, contenu, difficulte')
    .eq('chapter_id', chapterId)
    .eq('difficulte', difficulte)
    // 'catalogue' passe avant 'ia' dans l'ordre alphabétique.
    .order('origine', { ascending: true })
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle<LigneExercice>()
  if (!error) return servir(range, difficulte)
  if (!isMissingSchemaObject(error)) {
    console.error('[exercice] lecture impossible:', error.message)
    return null
  }
  const { data: ancien } = await supabase
    .from('chapter_exercices')
    .select('id, style, contenu')
    .eq('chapter_id', chapterId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle<LigneExercice>()
  return servir(ancien, difficulte)
}

/**
 * L'exercice du chapitre au niveau demandé : le sujet rangé (catalogue, puis
 * IA), ou un NOUVEAU rédigé par l'IA si on le demande (« Un autre sujet ») ou
 * s'il n'en existe aucun. Rédiger coûte un appel du quota ; resservir, rien.
 */
export async function obtenirExercice(
  chapterId: string,
  difficulteDemandee: number = DIFFICULTE_DEFAUT,
  nouveau = false,
): Promise<ResultatExercice> {
  if (!UUID_RE.test(String(chapterId))) return { ok: false, raison: 'introuvable' }
  const difficulte = estDifficulte(difficulteDemandee)
    ? difficulteDemandee
    : DIFFICULTE_DEFAUT
  const supabase = await createClient()
  const user = await getCurrentUser()
  if (!user) return { ok: false, raison: 'auth' }

  const tier = await getUserTierFor(supabase, user.id)
  if (!canAccessPremiumTests(tier)) return { ok: false, raison: 'premium' }

  const { data: chapitre } = await supabase
    .from('chapters')
    .select('id, title, level, subject:subjects!inner(slug, name)')
    .eq('id', chapterId)
    .maybeSingle<ChapitreRow>()
  if (!chapitre?.subject) return { ok: false, raison: 'introuvable' }

  if (!nouveau) {
    const range = await sujetRange(supabase, chapterId, difficulte)
    if (range) return { ok: true, exercice: range }
  }

  const { data: lessons } = await supabase
    .from('lessons')
    .select('title, content')
    .eq('chapter_id', chapterId)
    .order('position', { ascending: true })
    .returns<{ title: string; content: string | null }[]>()
  const cours = extraitCours(lessons ?? [])
  if (cours.length === 0) return { ok: false, raison: 'introuvable' }

  // Le quota AVANT le client : un appel refusé compte (198), c'est voulu.
  if (!(await quotaOk(supabase, 'exercice'))) return { ok: false, raison: 'quota' }
  const client = await aiClient()
  if (!client) return { ok: false, raison: 'indisponible' }

  const style = styleExercice(chapitre.subject.slug, chapitre.subject.name)
  const { system, user: message } = promptExercice({
    matiere: chapitre.subject.name,
    niveau: gradeLabel(chapitre.level) ?? '',
    chapitre: chapitre.title,
    cours,
    style,
    difficulte,
  })

  let raw = ''
  try {
    const completion = await client.chat.completions.create({
      model: aiModel(),
      max_tokens: 2_000,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: message },
      ],
    })
    raw = completion.choices[0]?.message?.content ?? ''
  } catch (error) {
    // Le message SEUL : l'objet d'erreur du SDK porte le corps de la requête.
    console.error(
      '[exercice] rédaction impossible:',
      error instanceof Error ? error.message : 'inconnu',
    )
    return { ok: false, raison: 'erreur' }
  }

  const redige = parseExercice(extractJsonObject(raw))
  if (!redige) {
    console.error('[exercice] réponse du modèle illisible')
    return { ok: false, raison: 'erreur' }
  }
  // Le prompt ne demande pas de corrigé : on n'en range pas un par accident.
  const exercice = exercicePublic(redige)

  const ligne = {
    chapter_id: chapterId,
    style,
    contenu: exercice,
    created_by: user.id,
  }
  let { data: inseree, error } = await supabase
    .from('chapter_exercices')
    .insert({ ...ligne, difficulte, origine: 'ia' })
    .select('id')
    .single<{ id: string }>()
  if (error && isMissingSchemaObject(error)) {
    // 364 pas encore passée : la ligne d'avant, sans niveau.
    ;({ data: inseree, error } = await supabase
      .from('chapter_exercices')
      .insert(ligne)
      .select('id')
      .single<{ id: string }>())
  }
  if (error || !inseree) {
    console.error('[exercice] enregistrement impossible:', error?.message)
    return { ok: false, raison: 'erreur' }
  }

  return { ok: true, exercice: { id: inseree.id, style, difficulte, exercice } }
}

type ExerciceRow = {
  id: string
  chapter_id: string
  contenu: unknown
  chapter: {
    level: string
    subject: { name: string } | null
  } | null
}

/**
 * Rend une copie : l'IA la note contre le barème, la note et la correction
 * sont rangées pour l'élève, et la tuile « Exercice » du chapitre s'en
 * souvient (meilleure note). Une copie vide est acceptée — le contrôle
 * ramasse les copies à la sonnerie — et vaut ce qu'elle vaut.
 */
export async function rendreCopie(
  exerciceId: string,
  reponse: string,
): Promise<ResultatCopie> {
  if (!UUID_RE.test(String(exerciceId))) return { ok: false, raison: 'introuvable' }
  const copie = typeof reponse === 'string' ? reponse.slice(0, REPONSE_MAX_LEN) : ''

  const supabase = await createClient()
  const user = await getCurrentUser()
  if (!user) return { ok: false, raison: 'auth' }

  const tier = await getUserTierFor(supabase, user.id)
  if (!canAccessPremiumTests(tier)) return { ok: false, raison: 'premium' }

  const { data: row } = await supabase
    .from('chapter_exercices')
    .select('id, chapter_id, contenu, chapter:chapters!inner(level, subject:subjects!inner(name))')
    .eq('id', exerciceId)
    .maybeSingle<ExerciceRow>()
  const exercice = row ? parseExercice(row.contenu) : null
  if (!row?.chapter?.subject || !exercice) return { ok: false, raison: 'introuvable' }

  if (!(await quotaOk(supabase, 'exercice'))) return { ok: false, raison: 'quota' }
  const client = await aiClient()
  if (!client) return { ok: false, raison: 'indisponible' }

  const { system, user: message } = promptCorrection({
    matiere: row.chapter.subject.name,
    niveau: gradeLabel(row.chapter.level) ?? '',
    exercice,
    reponse: copie,
  })

  let raw = ''
  try {
    const completion = await client.chat.completions.create({
      model: aiModel(),
      max_tokens: 2_000,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: message },
      ],
    })
    raw = completion.choices[0]?.message?.content ?? ''
  } catch (error) {
    console.error(
      '[exercice] correction impossible:',
      error instanceof Error ? error.message : 'inconnu',
    )
    return { ok: false, raison: 'erreur' }
  }

  const correction = parseCorrection(
    extractJsonObject(raw),
    exercice.bareme,
    exercice.corrige,
  )
  if (!correction) {
    console.error('[exercice] correction du modèle illisible')
    return { ok: false, raison: 'erreur' }
  }

  const { error } = await supabase.from('chapter_exercice_reponses').insert({
    user_id: user.id,
    exercice_id: row.id,
    chapter_id: row.chapter_id,
    reponse: copie,
    note: correction.note,
    sur: correction.sur,
    feedback: {
      points: correction.points,
      bilan: correction.bilan,
      corrige: correction.corrige,
    },
  })
  if (error) {
    // La correction est là, l'élève la voit : on la lui montre même si la
    // mémoire a raté — mais on le dit dans les logs.
    console.error('[exercice] copie non enregistrée:', error.message)
  }

  revalidatePath('/reviser')
  return { ok: true, correction }
}
