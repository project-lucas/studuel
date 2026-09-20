import { redirect } from 'next/navigation'
import WorldBackdrop from '@/components/WorldBackdrop'
import BentoCarnet from '@/components/carnet/BentoCarnet'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { readRowTolerant } from '@/lib/profile-read'
import {
  isQuestionReady,
  isQuestionType,
  normalizeQuestionContent,
} from '@/lib/carnet-cours'
import {
  bilanCours,
  couronnes,
  etatInitial,
  type CardState,
} from '@/lib/carnet/planification'
import { rowToState } from '@/lib/carnet/etats-server'
import { normaliserPreferences } from '@/lib/carnet/preferences'
import type { CoursCarnet } from '@/lib/carnet/priorite'
import { toutLire } from '@/lib/postgrest-pages'
import { toDayKey } from '@/lib/streak'
import EtagereCapsules from '@/components/carnet/EtagereCapsules'
import { etagereCarnet } from '@/lib/capsules'
import { lireCatalogueCapsules, lireMesAchats } from '@/lib/capsules-server'

export const metadata = { title: 'Mon carnet — Studuel' }
export const dynamic = 'force-dynamic'

/**
 * L'ONGLET CARNET — le Wooflash propre à l'élève : ses cours saisis ou
 * importés, ses cartes, sa révision espacée, ses dossiers.
 *
 * REFONTE DU 08/09/2026 (Lucas : « ma semaine est à supprimer ; il faut le
 * côté répétition espacée, lui proposer le cours prioritaire ; pouvoir
 * personnaliser au maximum ; compacter les blocs »). Cette page ne fait plus
 * que LIRE : les cours, leurs questions jouables, l'état de chaque carte, les
 * préférences du carnet (356). Tout le reste — le cours prioritaire, l'ordre,
 * l'objectif du jour — est pur (`lib/carnet/priorite`, `lib/carnet/preferences`)
 * et rendu par `BentoCarnet`, qui tient l'état de l'écran.
 *
 * LE PLANNING DU CARNET (« Ma semaine », migration 353) a quitté l'écran :
 * l'onglet Semaine est LE calendrier de l'élève, il n'en faut pas un deuxième.
 * Les plans restent lisibles depuis chaque cours ; rien n'est supprimé en base.
 *
 * LA FEUILLE « NOUVEAU DOSSIER » ne demande plus qu'un nom (10/09/2026,
 * « comme Wooflash ») : les matières de Réviser ne sont plus lues ici.
 */
export default async function CarnetPage() {
  const supabase = await createClient()
  const user = await getCurrentUser()
  if (!user) redirect('/login?next=/carnet')

  const todayKey = toDayKey(new Date())

  // UNE SEULE VAGUE. Chaque lecture est isolée : si la migration correspondante
  // n'est pas passée, elle rend `data: null` (ou une colonne en moins) sans
  // faire tomber la page — le bloc concerné prend ses défauts.
  const [
    profil,
    { data: courseRows },
    { data: courseQuestionRows },
    { data: carnetStateRows },
    catalogueCapsules,
    achatsCapsules,
  ] = await Promise.all([
      // Les préférences du carnet (356) : colonne tardive, relue avec tolérance.
      readRowTolerant<{ carnet_prefs: unknown }>(supabase, 'profiles', 'id', user.id, ['carnet_prefs']),
      // Cours du carnet (186) + les trois colonnes de la 356. Si la 356 dort,
      // Postgres refuse la requête entière (42703) : on relit sans elles.
      lireCours(supabase, user.id),
      // Page par page : `.limit(2 000)` ne protégeait de rien — PostgREST
      // plafonne à 1 000 sans le dire, et un carnet plus gros perdait des
      // cartes de ses compteurs ET de sa file de révision.
      // BORNÉ AUX COURS DE L'ÉLÈVE (19/09/2026) : la RLS seule filtrait APRÈS
      // coup — sans filtre, Postgres parcourait les questions de TOUS les
      // élèves pour tester chacune. La jointure sur `carnet_courses.owner_id`
      // part de l'index des cours de l'élève.
      toutLire<{ id: string; course_id: string; type: string; content: unknown }>((from, to) =>
        supabase
          .from('carnet_questions')
          .select('id, course_id, type, content, carnet_courses!inner(owner_id)')
          .eq('carnet_courses.owner_id', user.id)
          .order('id', { ascending: true })
          .range(from, to)
          .returns<{ id: string; course_id: string; type: string; content: unknown }[]>(),
      ),
      // ÉTAT de chaque carte (315) : dues, neuves, acquises, dernière vue.
      toutLire<Parameters<typeof rowToState>[0]>((from, to) =>
        supabase
          .from('carnet_question_states')
          .select(
            'question_id, phase, step, interval_days, ease, streak, reps, lapses, is_leech, due_at, last_seen_at',
          )
          .eq('user_id', user.id)
          .order('question_id', { ascending: true })
          .range(from, to)
          .returns<Parameters<typeof rowToState>[0][]>(),
      ),
      // Les capsules de la Boutique (366) : tolérantes, vides tant que la
      // migration dort — l'étagère ne s'affiche alors pas.
      lireCatalogueCapsules(supabase),
      lireMesAchats(supabase, user.id),
    ])

  // --- Questions JOUABLES par cours (brouillons exclus) ----------------------
  const playableByCourse = new Map<string, string[]>()
  for (const row of courseQuestionRows ?? []) {
    if (!isQuestionType(row.type)) continue
    const content = normalizeQuestionContent(row.type, row.content)
    if (!isQuestionReady(row.type, content)) continue
    const courseId = String(row.course_id)
    const list = playableByCourse.get(courseId)
    if (list) list.push(String(row.id))
    else playableByCourse.set(courseId, [String(row.id)])
  }

  const nowIso = new Date().toISOString()
  const etats = new Map<string, CardState>()
  for (const row of carnetStateRows ?? []) {
    etats.set(String(row.question_id), rowToState(row as Parameters<typeof rowToState>[0], nowIso))
  }
  const etatDe = (qid: string): CardState => etats.get(qid) ?? etatInitial(nowIso)

  // Les cartes revues AUJOURD'HUI, tous cours confondus : c'est la matière de
  // l'objectif du jour, lue sur les états déjà chargés — aucune requête de plus.
  let revuesAujourdhui = 0
  for (const s of etats.values()) {
    if (s.lastSeenAt && s.lastSeenAt.slice(0, 10) === todayKey) revuesAujourdhui += 1
  }

  // --- Les dossiers ---------------------------------------------------------
  const cours: CoursCarnet[] = (courseRows ?? []).map((r) => {
    const id = String(r.id)
    const playable = playableByCourse.get(id) ?? []
    const bilan = bilanCours(playable.map((qid) => ({ id: qid, state: etatDe(qid) })), nowIso)
    let dernierRevuLe: string | null = null
    for (const qid of playable) {
      const vu = etatDe(qid).lastSeenAt?.slice(0, 10) ?? null
      if (vu && (dernierRevuLe === null || vu > dernierRevuLe)) dernierRevuLe = vu
    }
    return {
      id,
      title: String(r.title ?? 'Sans titre'),
      description: r.description ? String(r.description) : null,
      icon: r.icon ? String(r.icon) : null,
      color: r.color ? String(r.color) : null,
      subjectId: r.subject_id ? String(r.subject_id) : null,
      questionCount: playable.length,
      dueCount: bilan.dues,
      nouvelles: bilan.nouvelles,
      crowns: couronnes(bilan),
      examOn: r.exam_on ? String(r.exam_on).slice(0, 10) : null,
      objectif: r.objectif ? String(r.objectif) : null,
      epingle: r.epingle === true,
      archive: r.archive === true,
      updatedAt: String(r.updated_at ?? ''),
      dernierRevuLe,
    }
  })

  return (
    <>
      <WorldBackdrop className="tab-bg" />
      {/* Le « + » flottant vit dans BentoCarnet : une seule feuille « Nouveau
          dossier », qui connaît les dossiers existants (doublons). */}
      <BentoCarnet
        cours={cours}
        prefs={normaliserPreferences(profil?.carnet_prefs)}
        revuesAujourdhui={revuesAujourdhui}
        aujourdhui={todayKey}
        capsules={
          catalogueCapsules.length > 0 ? (
            <EtagereCapsules etagere={etagereCarnet(catalogueCapsules, achatsCapsules)} />
          ) : null
        }
      />
    </>
  )
}

type CoursRow = {
  id: string
  title: string | null
  description: string | null
  icon: string | null
  color: string | null
  updated_at: string | null
  exam_on?: string | null
  subject_id?: string | null
  objectif?: string | null
  epingle?: boolean | null
  archive?: boolean | null
}

/**
 * Les cours de l'élève, avec les colonnes tardives (316 : `exam_on`,
 * `subject_id` ; 356 : `epingle`, `archive`, `objectif`) — et sans elles si la
 * base ne les connaît pas encore. Deux tentatives au plus, jamais une page qui
 * tombe.
 */
async function lireCours(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
): Promise<{ data: CoursRow[] | null }> {
  const base = 'id, title, description, icon, color, updated_at'
  const complet = await supabase
    .from('carnet_courses')
    .select(`${base}, exam_on, subject_id, epingle, archive, objectif`)
    .eq('owner_id', userId)
    .order('updated_at', { ascending: false })
    .limit(60)
    .returns<CoursRow[]>()
  if (!complet.error) return { data: complet.data }

  const reduit = await supabase
    .from('carnet_courses')
    .select(base)
    .eq('owner_id', userId)
    .order('updated_at', { ascending: false })
    .limit(60)
    .returns<CoursRow[]>()
  return { data: reduit.data }
}
