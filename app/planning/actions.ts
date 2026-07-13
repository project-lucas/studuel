'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { RevisionPriority, RevisionStatus, RevisionKind } from '@/lib/types'

const PRIORITIES: RevisionPriority[] = ['normale', 'prioritaire', 'critique']
const STATUSES: RevisionStatus[] = ['a_faire', 'en_cours', 'a_revoir', 'maitrise']
const KINDS: RevisionKind[] = ['chapitre', 'texte']
// Échéances proposées (classes à examen) — validées côté serveur.
const EXAMS = ['brevet', 'bac_fr_ecrit', 'bac_fr_oral', 'bac_spe', 'bac_philo', 'grand_oral', 'autre']

async function requireUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return { supabase, userId: user?.id ?? null }
}

export async function addSubject(formData: FormData): Promise<void> {
  const { supabase, userId } = await requireUser()
  if (!userId) return

  const name = String(formData.get('name') ?? '').trim()
  if (!name) return
  const examRaw = String(formData.get('exam') ?? '')
  const priorityRaw = String(formData.get('priority') ?? 'normale')
  const examDateRaw = String(formData.get('exam_date') ?? '')

  await supabase.from('revision_subjects').insert({
    user_id: userId,
    name,
    exam: EXAMS.includes(examRaw) ? examRaw : null,
    exam_date: /^\d{4}-\d{2}-\d{2}$/.test(examDateRaw) ? examDateRaw : null,
    priority: PRIORITIES.includes(priorityRaw as RevisionPriority)
      ? priorityRaw
      : 'normale',
  })
  revalidatePath('/planning')
}

export async function setExamDate(
  subjectId: string,
  examDate: string | null,
): Promise<void> {
  const { supabase, userId } = await requireUser()
  if (!userId) return
  const value =
    examDate && /^\d{4}-\d{2}-\d{2}$/.test(examDate) ? examDate : null

  await supabase
    .from('revision_subjects')
    .update({ exam_date: value })
    .eq('id', subjectId)
    .eq('user_id', userId)
  revalidatePath('/planning')
}

export async function setSubjectPriority(
  subjectId: string,
  priority: RevisionPriority,
): Promise<void> {
  const { supabase, userId } = await requireUser()
  if (!userId || !PRIORITIES.includes(priority)) return

  await supabase
    .from('revision_subjects')
    .update({ priority })
    .eq('id', subjectId)
    .eq('user_id', userId)
  revalidatePath('/planning')
}

export async function deleteSubject(subjectId: string): Promise<void> {
  const { supabase, userId } = await requireUser()
  if (!userId) return

  await supabase
    .from('revision_subjects')
    .delete()
    .eq('id', subjectId)
    .eq('user_id', userId)
  revalidatePath('/planning')
}

export async function addItem(formData: FormData): Promise<void> {
  const { supabase, userId } = await requireUser()
  if (!userId) return

  const subjectId = String(formData.get('subject_id') ?? '')
  const title = String(formData.get('title') ?? '').trim()
  if (!subjectId || !title) return
  const kindRaw = String(formData.get('kind') ?? 'chapitre')

  await supabase.from('revision_items').insert({
    subject_id: subjectId,
    user_id: userId,
    title,
    kind: KINDS.includes(kindRaw as RevisionKind) ? kindRaw : 'chapitre',
  })
  revalidatePath('/planning')
}

export async function setItemStatus(
  itemId: string,
  status: RevisionStatus,
): Promise<void> {
  const { supabase, userId } = await requireUser()
  if (!userId || !STATUSES.includes(status)) return

  await supabase
    .from('revision_items')
    .update({ status })
    .eq('id', itemId)
    .eq('user_id', userId)
  revalidatePath('/planning')
}

export async function deleteItem(itemId: string): Promise<void> {
  const { supabase, userId } = await requireUser()
  if (!userId) return

  await supabase
    .from('revision_items')
    .delete()
    .eq('id', itemId)
    .eq('user_id', userId)
  revalidatePath('/planning')
}

// ---------------------------------------------------------------------------
// Coach — conseil de session du jour.
// Avec OPENAI_API_KEY : message personnalisé GPT-4o à partir du plan.
// Sans clé : phrase construite localement à partir du même plan.
// ---------------------------------------------------------------------------

export type CoachState = {
  message: string | null
  ai: boolean
}

const EXAM_LABELS_COACH: Record<string, string> = {
  brevet: 'le brevet',
  bac_fr_ecrit: "l'écrit du bac de français",
  bac_fr_oral: "l'oral du bac de français",
  bac_spe: "l'épreuve de spécialité du bac",
  bac_philo: "l'épreuve de philosophie",
  grand_oral: 'le grand oral',
  autre: 'ton échéance',
}

export async function getCoachAdvice(
  // Signature imposée par useActionState (état précédent non utilisé).
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _prev: CoachState,
): Promise<CoachState> {
  const { supabase, userId } = await requireUser()
  if (!userId) return { message: null, ai: false }

  const { buildSessionPlan } = await import('@/lib/coach')
  const { data: subjects } = await supabase
    .from('revision_subjects')
    .select(
      'id, name, exam, exam_date, priority, created_at, revision_items(id, subject_id, title, kind, status, created_at)',
    )
    .returns<import('@/lib/types').RevisionSubject[]>()

  const plan = buildSessionPlan(subjects ?? [], 3)
  if (plan.length === 0) {
    return {
      message:
        'Rien d’urgent dans ton tableau : tout est maîtrisé ou vide. Profites-en pour lancer un quiz et entretenir tes acquis !',
      ai: false,
    }
  }

  const planText = plan
    .map((e, i) => {
      const exam = e.exam ? EXAM_LABELS_COACH[e.exam] ?? e.exam : null
      const deadline =
        e.daysLeft !== null && exam
          ? ` (${exam} dans ${e.daysLeft} jour${e.daysLeft > 1 ? 's' : ''})`
          : ''
      return `${i + 1}. ${e.subjectName} — ${e.itemKind === 'texte' ? 'texte' : 'chapitre'} « ${e.itemTitle} », statut : ${e.status}${deadline}`
    })
    .join('\n')

  if (process.env.OPENAI_API_KEY) {
    try {
      const { default: OpenAI } = await import('openai')
      const openai = new OpenAI()
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        max_tokens: 220,
        messages: [
          {
            role: 'system',
            content:
              "Tu es le coach scolaire bienveillant de l'application Studuel. On te donne le plan de révision prioritaire d'un élève (collège/lycée français). Rédige en français, en tutoyant, un court conseil de session du jour : 2 à 4 phrases, concret et motivant, qui reprend les éléments du plan dans l'ordre. Pas de liste à puces, pas d'emojis.",
          },
          { role: 'user', content: `Plan du jour :\n${planText}` },
        ],
      })
      const message = completion.choices[0]?.message?.content?.trim()
      if (message) return { message, ai: true }
    } catch {
      // API indisponible : on retombe sur le message local.
    }
  }

  const first = plan[0]
  const exam = first.exam ? EXAM_LABELS_COACH[first.exam] ?? first.exam : null
  const countdown =
    first.daysLeft !== null && exam
      ? ` — ${exam} est dans ${first.daysLeft} jour${first.daysLeft > 1 ? 's' : ''}`
      : ''
  return {
    message: `Commence par ${first.subjectName} : ${first.itemKind === 'texte' ? 'le texte' : 'le chapitre'} « ${first.itemTitle} »${countdown}. Ensuite, enchaîne dans l'ordre du plan ci-dessus, puis valide avec un quiz.`,
    ai: false,
  }
}
