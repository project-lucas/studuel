'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { toDayKey } from '@/lib/streak'
import { PLANIFIER_CATALOG_ID } from '@/lib/habits'
import { trimestreOf } from '@/lib/notes'
import { GRADE_LEVELS } from '@/lib/types'

/** Un identifiant du catalogue d'habitudes est un UUID, jamais autre chose. */
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

async function requireUser() {
  const supabase = await createClient()
  const user = await getCurrentUser()
  return { supabase, userId: user?.id ?? null }
}

// Classe / année scolaire : change le niveau de l'élève (6e → Tle). Pilote tout
// le contenu filtré par niveau (Réviser, Défi, examen blanc…), d'où le
// revalidate global. GRANT UPDATE(grade_level) déjà accordé par 010_moi.sql.
export async function saveGradeLevel(grade: string): Promise<void> {
  const { supabase, userId } = await requireUser()
  if (!userId) return
  if (!GRADE_LEVELS.includes(grade as (typeof GRADE_LEVELS)[number])) return

  const { error } = await supabase
    .from('profiles')
    .update({ grade_level: grade })
    .eq('id', userId)
  if (error) console.error('[moi] classe non enregistrée:', error.message)
  // Le niveau conditionne le contenu de tous les onglets : on rafraîchit tout.
  revalidatePath('/', 'layout')
}

// `addUpcomingExams` et `removeUpcomingExam` vivaient ici : elles écrivaient
// dans `profiles.upcoming_exams` (087) via les RPC `add_upcoming_exam` /
// `remove_upcoming_exam`. Plus aucun appelant depuis que la 203 a fait du
// contrôle un objet unique — `AddExamSheet` passe par `createControle`
// (app/reviser/prep-actions.ts), qui crée le contrôle ET son plan dans la même
// transaction. Les garder, c'était offrir une seconde voie d'écriture vers une
// source que plus rien ne lit en priorité : le Défi et les dossiers Réviser
// piochent désormais dans `controles` (lib/controle-exams). Les RPC restent en
// base (rien n'est supprimé côté SQL) le temps que la reprise 211 recopie les
// anciennes lignes.

// `saveAvatar` vivait ici : elle écrivait n'importe quelle config normalisée
// dans profiles.avatar SANS aucun contrôle de possession — l'héritage de
// l'ancien éditeur libre (082), où tout était gratuit. Plus aucun appelant
// depuis l'arrivée du vestiaire, et pas enregistrée comme Server Action dans le
// build : elle n'était donc pas exploitable. Mais le jour où un composant
// client l'aurait ré-importée, elle contournait toute l'économie du vestiaire
// (`equipAvatarItemAction` est le seul chemin légitime, cf. app/moi/avatar).
// Supprimée plutôt que laissée en embuscade — cf. git si le sujet revient.

// --- Cocher une habitude pour aujourd'hui ------------------------------------
// Un tap bascule le log DU JOUR. Si l'élève n'a jamais activé cette habitude,
// elle est activée à la volée (avec la planification par défaut du catalogue) —
// habit_logs reste la source unique de vérité, aucune table parallèle.
//
// L'ancienne version n'acceptait QUE les 4 leviers de la hero card. La page
// /moi/habitudes doit pouvoir cocher n'importe laquelle des habitudes du
// catalogue : la liste fermée en dur est remplacée par la seule garantie qui
// tienne dans le temps — la clé étrangère `habits.catalog_id → habit_catalog`,
// qui refuse en base tout identifiant inventé. Un UUID mal formé est écarté
// avant même de partir (message d'erreur Postgres inutile sinon).
export async function toggleHabitudeAction(
  catalogId: string,
  date: string,
  completed: boolean,
): Promise<{ ok: boolean }> {
  const { supabase, userId } = await requireUser()
  if (!userId) return { ok: false }
  if (!UUID.test(catalogId)) return { ok: false }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return { ok: false }

  let { data: habit } = await supabase
    .from('habits')
    .select('id')
    .eq('user_id', userId)
    .eq('catalog_id', catalogId)
    .maybeSingle()

  if (!habit) {
    const { data: inserted, error } = await supabase
      .from('habits')
      .insert({ user_id: userId, catalog_id: catalogId, target: {} })
      .select('id')
      .single()
    if (error) {
      // Course possible (autre appareil) : l'UNIQUE (user_id, catalog_id) a pu
      // claquer — on relit avant d'abandonner.
      const { data: retry } = await supabase
        .from('habits')
        .select('id')
        .eq('user_id', userId)
        .eq('catalog_id', catalogId)
        .maybeSingle()
      habit = retry
    } else {
      habit = inserted
    }
  }
  if (!habit) {
    console.error('[moi] habitude introuvable/inactivable:', catalogId)
    return { ok: false }
  }

  const { error } = await supabase.from('habit_logs').upsert(
    {
      habit_id: habit.id,
      user_id: userId,
      date,
      completed,
      auto_validated: false,
    },
    { onConflict: 'habit_id,date' },
  )
  if (error) {
    console.error('[moi] habitude non enregistrée:', error.message)
    return { ok: false }
  }
  revalidatePath('/moi')
  revalidatePath('/moi/habitudes')
  return { ok: true }
}

// --- Suivre / arrêter une habitude du catalogue -------------------------------
// Le catalogue compte seize habitudes, chacune avec son « pourquoi »
// scientifique écrit en base depuis la migration 010 — et l'app n'en montrait
// aucune : les seules activables étaient les quatre leviers, activés à la
// volée par un tap. Ces deux actions ouvrent le catalogue à l'élève.

export async function suivreHabitudeAction(
  catalogId: string,
): Promise<{ ok: boolean }> {
  const { supabase, userId } = await requireUser()
  if (!userId) return { ok: false }
  if (!UUID.test(catalogId)) return { ok: false }

  // Idempotent : re-suivre une habitude déjà suivie ne doit rien casser ni
  // remettre à zéro sa planification. `target: {}` laisse `habitDays` retomber
  // sur le `default_target` du catalogue (« sport les mardis et vendredis »),
  // qui est précisément l'intention de l'habitude.
  const { error } = await supabase
    .from('habits')
    .upsert(
      { user_id: userId, catalog_id: catalogId, target: {} },
      { onConflict: 'user_id,catalog_id', ignoreDuplicates: true },
    )
  if (error) {
    console.error('[moi] habitude non activée:', error.message)
    return { ok: false }
  }
  revalidatePath('/moi')
  revalidatePath('/moi/habitudes')
  return { ok: true }
}

export async function arreterHabitudeAction(
  catalogId: string,
): Promise<{ ok: boolean }> {
  const { supabase, userId } = await requireUser()
  if (!userId) return { ok: false }
  if (!UUID.test(catalogId)) return { ok: false }
  // « Planifier ma semaine » est la mission fixe de tous : la page Moi la
  // ré-inscrit à chaque chargement. La retirer ne tiendrait pas une seconde —
  // autant ne pas proposer un bouton qui ment.
  if (catalogId === PLANIFIER_CATALOG_ID) return { ok: false }

  // Le journal part avec (ON DELETE CASCADE sur habit_logs.habit_id) : arrêter
  // une habitude efface sa série. C'est assumé et dit dans l'interface — garder
  // des logs orphelins ferait réapparaître une série morte au moindre retour.
  const { error } = await supabase
    .from('habits')
    .delete()
    .eq('user_id', userId)
    .eq('catalog_id', catalogId)
  if (error) {
    console.error('[moi] habitude non arrêtée:', error.message)
    return { ok: false }
  }
  revalidatePath('/moi')
  revalidatePath('/moi/habitudes')
  return { ok: true }
}

// --- Moyennes trimestrielles saisies — migration 187 --------------------------
// Repli de « Ta trajectoire au bac » : quand un trimestre n'a aucune note
// détaillée, l'élève tape directement la moyenne de son bulletin. L'année
// scolaire est celle du jour (convention lib/notes.ts). Renvoie { ok } pour ne
// jamais afficher un faux succès si 187 n'est pas passée.
export async function saveTermAverageAction(
  term: number,
  average: number,
): Promise<{ ok: boolean }> {
  const { supabase, userId } = await requireUser()
  if (!userId) return { ok: false }
  if (term !== 1 && term !== 2 && term !== 3) return { ok: false }
  const avg = Number(average)
  if (!Number.isFinite(avg) || avg < 0 || avg > 20) return { ok: false }

  const now = trimestreOf(toDayKey(new Date()))
  if (!now) return { ok: false }

  const { error } = await supabase.from('term_grades').upsert(
    {
      user_id: userId,
      school_year: now.year,
      term,
      average: Math.round(avg * 100) / 100,
    },
    { onConflict: 'user_id,school_year,term' },
  )
  if (error) {
    console.error('[moi] moyenne de trimestre non enregistrée:', error.message)
    return { ok: false }
  }
  revalidatePath('/moi')
  return { ok: true }
}
