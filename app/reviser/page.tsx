import Link from 'next/link'
import { redirect } from 'next/navigation'
import { CircleUser, GraduationCap, TriangleAlert } from 'lucide-react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import PageHeader from '@/components/PageHeader'
import TabHeader from '@/components/TabHeader'
import TourGuide from '@/components/TourGuide'
import SubjectsHome from '@/components/SubjectsHome'
import ReviserSpaces from '@/components/ReviserSpaces'
import ResumeSessions, { type ResumeItem } from '@/components/ResumeSessions'
import CoursesShelf, {
  type CourseShelfItem,
} from '@/components/carnet/CoursesShelf'
import CarnetFab from '@/components/carnet/CarnetFab'
import CarnetTile from '@/components/carnet/CarnetTile'
import MissionHero from '@/components/reviser/MissionHero'
import PrepCards from '@/components/reviser/PrepCards'
import NoteInbox from '@/components/reviser/NoteInbox'
import ExamObjectiveToggle from '@/components/ExamObjectiveToggle'
import { type ExamProgressEntry } from '@/components/ExamProgress'
import OralTextsCard from '@/components/OralTextsCard'
import CommuteBanner from '@/components/CommuteBanner'
import SubjectMasteryCelebration from '@/components/SubjectMasteryCelebration'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { getSubjectsCached, getGradeChaptersCached } from '@/lib/catalog'
import { readRowTolerant } from '@/lib/profile-read'
import { examsForProfile } from '@/lib/exams'
import { getChapterMastery, chapterState } from '@/lib/mastery'
import {
  toDayKey,
  computeStreak,
  weekProgress,
  activityCutoff,
} from '@/lib/streak'
import {
  rowsToControles,
  derivePlanView,
  controleTitle,
  countdownTag,
  daysBetween,
  type ControleRow,
  type SessionRow,
  type Controle,
  type ControleSubjectMeta,
} from '@/lib/prep-plan'
import { pickMission, type ChapterCandidate } from '@/lib/mission'
import type { SubjectExamHint } from '@/lib/next-exam'
import { normalizeOralList } from '@/lib/oral-texts'
import type { CommuteSlot, Subject } from '@/lib/types'

export const metadata = { title: 'Réviser — Studuel' }
export const dynamic = 'force-dynamic'

// Les colonnes du profil dont cet écran a besoin, toutes migrations confondues.
// `tutorial_completed` (188) peut ne pas exister encore : elle ressort alors à
// `undefined` et le tour guidé ne se lance simplement pas.
type ProfileRow = {
  full_name: string | null
  grade_level: string | null
  selected_subjects: unknown
  commute_slots: unknown
  profile_type: string | null
  oral_texts: unknown
  upcoming_exams: unknown
  daily_goal_minutes: number | null
  tutorial_completed: boolean | null
}

const EXAM_TITLES: Record<string, string> = {
  '3e': 'Objectif Brevet',
  '1re': 'Objectif Bac de français',
  Tle: 'Objectif Bac',
}

export default async function ReviserPage() {
  const supabase = await createClient()
  const user = await getCurrentUser()

  if (!user) {
    return (
      <div>
        <PageHeader
          title="Réviser"
          description="Ton programme, tes cours et ta file du jour."
        />
        <Card className="mx-auto w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CircleUser className="size-4" /> Connecte-toi pour réviser
            </CardTitle>
            <CardDescription>
              Tes matières s&apos;adaptent à ta classe, de la 6e à la Terminale.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild>
              <Link href="/login">Se connecter</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // --- UNE SEULE VAGUE ----------------------------------------------------------
  // Tout ce qui ne dépend pas de la classe part ensemble. Avant, la page
  // enchaînait deux vagues séquentielles (profil, PUIS le reste) et lisait la
  // table `profiles` QUATRE fois pour la même ligne — un aller-retour par
  // colonne « tardive » à isoler. `readRowTolerant` fait la même isolation,
  // mais après coup et seulement en cas de besoin : une requête, toutes les
  // colonnes, retrait automatique de celles que le schéma ne connaît pas
  // encore (`tutorial_completed` de la 188 tant qu'elle n'est pas exécutée).
  //
  // Les gardes « pas de classe » / « compte parent » plus bas peuvent donc
  // jeter le résultat de requêtes déjà parties. C'est assumé : elles ne
  // concernent qu'un premier lancement ou un compte parent, et ces requêtes
  // sont parallèles — elles ne coûtent aucun délai au cas courant.
  const [
    profile,
    mastery,
    // Journées d'activité (tous types confondus) pour la flamme de série du
    // header — même définition que sur l'onglet Moi. On récupère au passage les
    // colonnes qui alimentent l'XP du header (score, cartes, xp du défi).
    { data: testDays },
    { data: studyDays },
    { data: lessonDays },
    { data: challengeDays },
    { data: courseRows },
    { data: courseQuestionRows },
    // Temps travaillé aujourd'hui (work_daily, migration 084) → objectif du jour
    // du header. Bucket par date UTC, cohérent avec la série.
    { data: workToday },
    { data: controleRows },
    { data: sessionRows },
    cachedSubjects,
  ] = await Promise.all([
    readRowTolerant<ProfileRow>(supabase, 'profiles', 'id', user.id, [
      'full_name',
      'grade_level',
      'selected_subjects',
      'commute_slots',
      'profile_type',
      'oral_texts',
      'upcoming_exams',
      'daily_goal_minutes',
      'tutorial_completed',
    ]),
    getChapterMastery(supabase, user.id),
    // Fenêtre glissante : ces requêtes ne servent qu'à la série et à la
    // semaine — inutile de retransférer tout l'historique d'un élève assidu
    // (400 jours couvrent toute série affichable).
    supabase
      .from('test_sessions')
      .select('created_at, score')
      .eq('user_id', user.id)
      .gte('created_at', activityCutoff()),
    supabase
      .from('study_sessions')
      .select('created_at, cards_count')
      .eq('user_id', user.id)
      .gte('created_at', activityCutoff()),
    supabase
      .from('lesson_completions')
      .select('created_at')
      .eq('user_id', user.id)
      .gte('created_at', activityCutoff()),
    supabase
      .from('challenge_sessions')
      .select('created_at, xp')
      .eq('user_id', user.id)
      .gte('created_at', activityCutoff()),
    // Cours de Mon carnet (carnet_courses, migration 186) : l'étagère des
    // cours façon Wooflash — échec isolé (migration pas passée) → bloc vide.
    supabase
      .from('carnet_courses')
      .select('id, title, description, icon, color')
      .eq('owner_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(60),
    // Compteur de questions par cours (ids seuls : jamais le contenu
    // complet) — borné comme les autres listes de la page.
    supabase.from('carnet_questions').select('course_id').limit(2_000),
    supabase
      .from('work_daily')
      .select('seconds')
      .eq('user_id', user.id)
      .eq('day', toDayKey(new Date()))
      .maybeSingle(),
    // Contrôles + plans de préparation (migration 203) : les deux tables sont
    // lues en isolation — si 203 n'est pas passée, `error` non nul et data null,
    // sans casser le reste de la page (le client Supabase ne lève pas).
    supabase
      .from('controles')
      .select(
        'id, subject_slug, chapters, exam_date, grade, note, note_prompted, snooze_date',
      )
      .eq('user_id', user.id)
      .returns<ControleRow[]>(),
    supabase
      .from('sessions_preparation')
      .select(
        'id, controle_id, planned_date, duration_min, chapter_id, status, position',
      )
      .eq('user_id', user.id)
      .returns<SessionRow[]>(),
    // Catalogue servi par le cache serveur (identique pour tous les élèves).
    getSubjectsCached(),
  ])

  const oralTexts = normalizeOralList(profile.oral_texts)

  const grade = profile.grade_level ?? null

  // Un compte parent n'a pas de classe : sans ça, il tombait sur « Dis-nous ta
  // classe » — un écran d'élève dont la seule issue est de s'en inventer une.
  // Le test vit ICI plutôt qu'à la racine parce que le profil y est DÉJÀ
  // chargé : le faire en amont coûtait une requête de plus à chaque lancement
  // de l'app, pour tous les élèves, afin de router une poignée de parents.
  if ((profile as { profile_type?: string | null } | null)?.profile_type === 'parent') {
    redirect('/parents')
  }

  if (!grade) {
    return (
      <div>
        <PageHeader title="Réviser" />
        <Card className="mx-auto w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="size-4" /> Dis-nous ta classe
            </CardTitle>
            <CardDescription>
              Ton programme dépend de ta classe — configure-la en 30 secondes.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild>
              <Link href="/onboarding">Choisir ma classe</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // Seule requête qui dépend de la classe — et elle est servie par le cache
  // serveur (unstable_cache, 5 min), donc sans aller-retour Supabase la plupart
  // du temps. Tout le reste est déjà chargé au-dessus, en une vague.
  const cachedChapters = await getGradeChaptersCached(grade)

  // Repli authentifié : cache froid ou migration 026 pas encore exécutée.
  let subjects: Subject[] = cachedSubjects
  let error: { message: string } | null = null
  if (subjects.length === 0) {
    const res = await supabase
      .from('subjects')
      .select('*')
      .order('name')
      .returns<Subject[]>()
    subjects = res.data ?? []
    error = res.error
  }
  let levelChapters = cachedChapters
  if (levelChapters.length === 0) {
    const { data } = await supabase
      .from('chapters')
      .select('id, subject_id, level, title, position')
      .eq('level', grade)
      .order('position', { ascending: true })
      .returns<typeof cachedChapters>()
    levelChapters = data ?? []
  }

  if (error) {
    // Détail technique en console pour le dev, message rassurant pour l'élève.
    console.error('[reviser] chargement des matières impossible:', error.message)
    return (
      <div>
        <PageHeader title="Réviser" />
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TriangleAlert className="size-4 text-destructive" />
              Tes matières sont momentanément indisponibles
            </CardTitle>
            <CardDescription>
              On n&apos;arrive pas à charger ton programme pour l&apos;instant.
              Réessaie dans quelques instants — si ça persiste, reviens un peu
              plus tard.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  // Série vivante pour la flamme du header.
  const activityDays = new Set(
    [
      ...(testDays ?? []),
      ...(studyDays ?? []),
      ...(lessonDays ?? []),
      ...(challengeDays ?? []),
    ].map((s) => String(s.created_at).slice(0, 10)),
  )
  const streak = computeStreak(activityDays)
  const week = weekProgress(activityDays)

  // Série + objectif du jour : les deux seules stats conservées sur cet écran
  // (elles vivent désormais en tête de la carte « Ta semaine »). XP et trophées
  // ne sont plus calculés ni affichés ici — le HUD et le Défi les portent.
  const todayMinutes = Math.floor(Number(workToday?.seconds ?? 0) / 60)
  const goalMinutes = profile.daily_goal_minutes ?? 15

  // --- Matières suivies (profil onboarding) -----------------------------------
  const selected = Array.isArray(profile?.selected_subjects)
    ? (profile.selected_subjects as string[])
    : null
  const allSubjects = subjects ?? []
  const ofLevel = allSubjects.filter((s) => s.levels.includes(grade))
  const followed = ofLevel.filter(
    (s) => selected === null || selected.length === 0 || selected.includes(s.slug),
  )
  const followedIds = new Set(followed.map((s) => s.id))
  const subjectById = new Map(followed.map((s) => [s.id, s]))

  // --- Analyse chapitre par chapitre ------------------------------------------
  type Analyzed = {
    subject: Subject
    chapterId: string
    chapterTitle: string
    value: number
    state: ReturnType<typeof chapterState>
  }
  const analyzed: Analyzed[] = []
  const sums = new Map<string, { sum: number; total: number }>()

  for (const c of levelChapters ?? []) {
    const subject = subjectById.get(c.subject_id)
    const agg = sums.get(c.subject_id) ?? { sum: 0, total: 0 }
    const p = mastery.get(c.id)
    agg.sum += p?.value ?? 0
    agg.total += 1
    sums.set(c.subject_id, agg)
    if (!subject || !followedIds.has(c.subject_id)) continue
    analyzed.push({
      subject,
      chapterId: c.id,
      chapterTitle: c.title,
      value: p?.value ?? 0,
      state: chapterState(p),
    })
  }

  // --- Candidats à la mission du jour : les chapitres analysés, mis à plat.
  //     Le classement (en cours > fragiles > à commencer) vit dans lib/mission.
  const candidates: ChapterCandidate[] = analyzed.map((a) => ({
    subjectSlug: a.subject.slug,
    subjectName: a.subject.name,
    chapterId: a.chapterId,
    chapterTitle: a.chapterTitle,
    state: a.state,
    value: a.value,
  }))

  // --- Objectif examen (classes à examen uniquement) ---------------------------
  const exams = examsForProfile(grade, selected, allSubjects)
  // Descriptif de l'oral : réservé à la 1re qui suit le français (bac de
  // français écrit + oral). Ailleurs, pas de liste de textes à présenter.
  const hasFrenchOral =
    grade === '1re' && exams.some((e) => e.subject.slug === 'francais')
  const examEntries: ExamProgressEntry[] = exams
    .map(({ subject }) => {
      const agg = sums.get(subject.id) ?? { sum: 0, total: 0 }
      return {
        label: subject.name,
        subject,
        total: agg.total,
        progress: agg.total > 0 ? agg.sum / agg.total : 0,
      }
    })
    .filter((e) => e.total > 0)

  // --- Anneaux des tuiles -------------------------------------------------------
  const progressBySlug: Record<string, number> = {}
  for (const s of ofLevel) {
    const agg = sums.get(s.id)
    progressBySlug[s.slug] =
      agg && agg.total > 0 ? Math.round((agg.sum / agg.total) * 100) : 0
  }

  // Créneaux de trajet : la bannière « mode trajet » ne s'affiche que dans
  // ces fenêtres (elle se teste côté client, en heure de Paris).
  const commuteSlots: CommuteSlot[] = Array.isArray(profile?.commute_slots)
    ? (profile.commute_slots as CommuteSlot[])
    : []

  // Contrôles + plans de préparation (migration 203) : LA source unique de
  // « Ta semaine » (ligne + pastilles), des cartes de préparation et de la
  // boucle post-contrôle. Une seule entité, plusieurs vues synchronisées.
  const today = toDayKey(new Date())
  const controles: Controle[] = rowsToControles(
    controleRows ?? [],
    sessionRows ?? [],
  )

  // Métadonnée d'affichage par matière (couleur de pastille + nom du libellé),
  // sur TOUT le catalogue : un contrôle se déclare sur un chapitre du niveau,
  // mais la matière peut n'avoir aucun chapitre de ce niveau dans `ofLevel`.
  const subjectMeta: Record<string, ControleSubjectMeta> = {}
  for (const s of allSubjects) {
    subjectMeta[s.slug] = { name: s.name, color: s.color }
  }

  // Annotation des dossiers de matières : le contrôle actif le plus proche par
  // matière → liseré coloré + compte à rebours (dérivé des contrôles, plus de
  // upcoming_exams). Proximité en 3 paliers (imminent ≤ 2 j, bientôt ≤ 6 j).
  const examBySubject: Record<string, SubjectExamHint> = {}
  for (const c of controles) {
    if (derivePlanView(c, today).isComplete) continue
    if (examBySubject[c.subject]) continue
    const d = c.date === null ? null : daysBetween(today, c.date)
    const proximity =
      d === null ? 'far' : d <= 2 ? 'imminent' : d <= 6 ? 'soon' : 'far'
    examBySubject[c.subject] = {
      proximity,
      label: countdownTag(c.date, today) ?? 'à venir',
      chapterTitle: controleTitle(c, subjectMeta[c.subject]?.name ?? c.subject),
    }
  }

  // --- Mission du jour + « Ensuite » : l'app choisit LA session à lancer
  //     (contrôle actif > reprise > découverte), le reste part en suggestions.
  const { mission, ensuite } = pickMission({
    today,
    controles,
    subjectNameBySlug: Object.fromEntries(
      allSubjects.map((s) => [s.slug, s.name]),
    ),
    chapters: candidates,
    goalMinutes,
  })

  // Les suggestions du rail « Ensuite », re-liées à leur objet Subject complet
  // (icône + couleur de pastille).
  const subjectBySlug = new Map(followed.map((s) => [s.slug, s]))
  const resumeItems: ResumeItem[] = ensuite.flatMap((m) => {
    const subject = subjectBySlug.get(m.subjectSlug)
    if (!subject) return []
    return [
      {
        subject,
        chapterId: m.chapterId,
        chapterTitle: m.chapterTitle,
        progress: m.progress ?? 0,
        minutes: m.minutes,
        isNew: m.isNew,
      },
    ]
  })

  // Le contrôle porté par le héros ne se répète pas dans la rangée de cartes de
  // préparation — les autres contrôles actifs y restent visibles.
  const prepControles = mission?.controleId
    ? controles.filter((c) => c.id !== mission.controleId)
    : controles

  // Données de la carte « Mes contrôles à venir » : matières + chapitres du
  // niveau (identique à l'onglet Moi, la carte est partagée).
  const subjectByIdAll = new Map(allSubjects.map((s) => [s.id, s]))
  const examSubjects: { slug: string; name: string; icon: string }[] = []
  const seenExamSubjects = new Set<string>()
  for (const ch of levelChapters ?? []) {
    const subj = subjectByIdAll.get(ch.subject_id)
    if (!subj) continue
    if (!seenExamSubjects.has(subj.slug)) {
      seenExamSubjects.add(subj.slug)
      examSubjects.push({ slug: subj.slug, name: subj.name, icon: subj.icon })
    }
  }
  examSubjects.sort((a, b) => a.name.localeCompare(b.name, 'fr'))

  // Chapitres par matière (slug → { id, title }) + chapitres déjà planifiés :
  // de quoi ouvrir la bulle « Nouveau contrôle » directement depuis la barre de
  // semaine, sans détour par le carnet (même contrat qu'AddExamSheet).
  const chaptersBySubject: Record<string, { id: string; title: string }[]> = {}
  for (const ch of levelChapters ?? []) {
    const subj = subjectByIdAll.get(ch.subject_id)
    if (!subj) continue
    ;(chaptersBySubject[subj.slug] ??= []).push({ id: ch.id, title: ch.title })
  }
  // Chapitres déjà couverts par un contrôle (pour le repère « déjà annoncé » de
  // la feuille d'ajout).
  const existingExamChapters = new Set(
    controles.flatMap((c) => c.chapters.map((ch) => ch.id)),
  )

  // --- Mes cours (Mon carnet) : étagère calculée côté serveur -----------------
  // Compteur de questions par cours (la RLS limite déjà aux cours de l'élève).
  const questionCountByCourse = new Map<string, number>()
  for (const row of courseQuestionRows ?? []) {
    const key = String(row.course_id)
    questionCountByCourse.set(key, (questionCountByCourse.get(key) ?? 0) + 1)
  }
  const courseItems: CourseShelfItem[] = (courseRows ?? []).map((r) => ({
    id: String(r.id),
    title: String(r.title ?? 'Sans titre'),
    description: r.description ? String(r.description) : null,
    icon: r.icon ? String(r.icon) : null,
    color: r.color ? String(r.color) : null,
    questionCount: questionCountByCourse.get(String(r.id)) ?? 0,
  }))

  // Tour guidé : uniquement si la colonne existe (188) et dit « jamais vu ».
  // Colonne absente → `undefined`, donc jamais `=== false` : le tour ne se
  // lance pas, exactement comme quand la lecture isolée échouait.
  const tourAutoStart = profile.tutorial_completed === false

  return (
    <div className="flex flex-col gap-3">
      <TabHeader title="Réviser" />
      {/* Tour guidé post-onboarding (spotlights sur la nav + bulles). */}
      <TourGuide autoStart={tourAutoStart} />
      {/* Fête (une seule fois) les matières arrivées à 90 % ou 100 %. */}
      <SubjectMasteryCelebration
        entries={followed.map((s) => ({
          slug: s.slug,
          name: s.name,
          pct: progressBySlug[s.slug] ?? 0,
        }))}
      />
      {/* Deux espaces façon Decks / Collection : « Mes matières » (le
          programme) et « Mon carnet » (les données scolaires : contrôles,
          maîtrise, préparation examen — les chiffres d'activité vivent sur
          l'onglet Moi, pas ici). */}
      <ReviserSpaces
        reviser={
          <div className="flex flex-col gap-4">
            {/* Plus de carte d'identité : les blocs d'action (série/semaine,
                contrôles, reprise) arrivent d'emblée, puis la grille des
                matières — pour que la session du jour soit au-dessus du pli. */}
            <SubjectsHome
              subjects={ofLevel}
              selected={selected}
              grade={grade}
              progressBySlug={progressBySlug}
              examBySubject={examBySubject}
              topSlot={
                <>
                  {/* 1. LA mission du jour : l'app a choisi la meilleure session
                      (lib/mission), un seul CTA. Le héros porte aussi série,
                      objectif éditable, semaine datée, nouveau contrôle et
                      historique. */}
                  <MissionHero
                    mission={mission}
                    streak={streak}
                    todayMinutes={todayMinutes}
                    goalMinutes={goalMinutes}
                    week={week}
                    today={today}
                    controles={controles}
                    subjectMeta={subjectMeta}
                    subjects={examSubjects}
                    chaptersBySubject={chaptersBySubject}
                    existingExamChapters={[...existingExamChapters]}
                    activeDays={[...activityDays]}
                  />
                  {/* 2. Boucle post-contrôle : bannière d'une ligne (repliée),
                      APRÈS la mission — l'administratif ne passe plus devant. */}
                  <NoteInbox
                    controles={controles}
                    today={today}
                    subjectMeta={subjectMeta}
                  />
                  {/* 3. Les autres contrôles actifs (celui du héros ne se
                      répète pas). */}
                  <PrepCards
                    controles={prepControles}
                    today={today}
                    subjectMeta={subjectMeta}
                  />
                  {/* 4. « Ensuite » — les sessions en réserve, cartes tactiles
                      sans triple bouton. (La file SRS reste accessible depuis
                      l'historique des duels, la bannière de matière et les
                      notifications — cf. lib/notifications SRS_URL.) */}
                  <ResumeSessions
                    items={resumeItems}
                    goalReached={goalMinutes > 0 && todayMinutes >= goalMinutes}
                  />
                  {/* Rappel contextuel : pendant le trajet, un temps mort = de
                      l'XP. */}
                  <CommuteBanner slots={commuteSlots} />
                </>
              }
            />
            {/* La porte d'entrée du carnet : une tuile dédiée sous le
                programme (remplace le segmented control d'en haut). */}
            <CarnetTile
              coursesCount={courseItems.length}
              questionsCount={courseItems.reduce(
                (sum, c) => sum + c.questionCount,
                0,
              )}
            />
          </div>
        }
        carnet={
          <div className="flex flex-col gap-4">
            {/* Objectif examen tout en haut : pastille icône + % global,
                dépliable sur le tableau d'avancement par matière (rendu null
                hors classes à examen). */}
            <ExamObjectiveToggle
              title={EXAM_TITLES[grade] ?? 'Objectif examen'}
              entries={examEntries}
            />
            {/* Une ligne d'intro : dire à l'élève ce qu'est ce carnet. */}
            <p className="px-1 text-sm text-muted-foreground">
              Ton carnet de cours : crée tes cours, remplis-les de questions et
              révise-les.
            </p>
            {/* Créer, de partout dans la liste : le « + » flottant (il ne vit
                que dans ce volet, le panneau inactif étant `hidden`). */}
            <CarnetFab />
            {/* Descriptif de l'oral (1re français). */}
            {hasFrenchOral ? <OralTextsCard initial={oralTexts} /> : null}
            {/* « Mes cours » — LE bloc du carnet : les cours façon Wooflash
                (chapitres imbriqués + questions de 5 types), création sans
                quitter le carnet. Remplace l'ancienne Bibliothèque (les
                library_items restent en base, plus affichés ici). */}
            <CoursesShelf items={courseItems} />
          </div>
        }
      />
    </div>
  )
}
