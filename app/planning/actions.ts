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

  await supabase.from('revision_subjects').insert({
    user_id: userId,
    name,
    exam: EXAMS.includes(examRaw) ? examRaw : null,
    priority: PRIORITIES.includes(priorityRaw as RevisionPriority)
      ? priorityRaw
      : 'normale',
  })
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
