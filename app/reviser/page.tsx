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
import WeekPlannerStrip, {
  type ControleSubjectMeta,
} from '@/components/WeekPlannerStrip'
import PrepCards from '@/components/reviser/PrepCards'
import NoteInbox from '@/components/reviser/NoteInbox'
import ExamObjectiveToggle from '@/components/ExamObjectiveToggle'
import { type ExamProgressEntry } from '@/components/ExamProgress'
import OralTextsCard from '@/components/OralTextsCard'
import CommuteBanner from '@/components/CommuteBanner'
import SubjectMasteryCelebration from '@/components/SubjectMasteryCelebration'
import { createClient } from '@/lib/supabase/server'
import { avatarDataUri, normalizeAvatarConfig } from '@/lib/avatar'
import { getSubjectsCached, getGradeChaptersCached } from '@/lib/catalog'
import { examsForProfile } from '@/lib/exams'
import { getChapterMastery, chapterState } from '@/lib/mastery'
import { computeXp } from '@/lib/xp'
import { fetchWallet } from '@/lib/wallet-server'
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
} from '@/lib/prep-plan'
import type { SubjectExamHint } from '@/lib/next-exam'
import { normalizeOralList } from '@/lib/oral-texts'
import type { CommuteSlot, Subject } from '@/lib/types'

export const metadata = { title: 'Réviser — Studuel' }
export const dynamic = 'force-dynamic'

const EXAM_TITLES: Record<string, string> = {
  '3e': 'Objectif Brevet',
  '1re': 'Objectif Bac de français',
  Tle: 'Objectif Bac',
}

export default async function ReviserPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

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

  // Avatar (082) et textes du bac oral (156) restent des requêtes ISOLÉES
  // (colonne peut-être absente → dégradation propre sans casser le profil),
  // mais lancées en PARALLÈLE du profil : elles ne dépendent de rien.
  const [
    { data: profile },
    { data: avatarRow },
    { data: oralRow },
    { data: extraRow },
    { data: trophyRow },
    { data: tutorialRow, error: tutorialError },
  ] = await Promise.all([
    supabase
      .from('profiles')
      // `profile_type` vient de la 048 : une migration ANCIENNE et appliquée
      // depuis longtemps, donc rien à isoler ici (la règle des colonnes
      // tardives ne s'applique qu'aux migrations pas encore passées).
      .select(
        'full_name, grade_level, selected_subjects, commute_slots, profile_type',
      )
      .eq('id', user.id)
      .maybeSingle(),
    supabase.from('profiles').select('avatar').eq('id', user.id).maybeSingle(),
    supabase
      .from('profiles')
      .select('oral_texts')
      .eq('id', user.id)
      .maybeSingle(),
    // upcoming_exams (087) + daily_goal_minutes (048) isolés : une migration pas
    // encore passée ne doit pas faire perdre grade_level (sinon un élève onboardé
    // retombe à tort sur l'écran « Dis-nous ta classe »).
    supabase
      .from('profiles')
      .select('upcoming_exams, daily_goal_minutes')
      .eq('id', user.id)
      .maybeSingle(),
    // trophies (079) ISOLÉ : alimente la donnée « Trophées » du header ; si 079
    // n'est pas passée, échoue seul → 0, sans casser le reste.
    supabase.from('profiles').select('trophies').eq('id', user.id).maybeSingle(),
    // tutorial_completed (188) ISOLÉ : si la migration n'est pas passée, on ne
    // lance simplement pas le tour guidé (pas de harcèlement par défaut).
    supabase
      .from('profiles')
      .select('tutorial_completed')
      .eq('id', user.id)
      .maybeSingle(),
  ])
  const avatarUri = avatarDataUri(normalizeAvatarConfig(avatarRow?.avatar), 128)
  const oralTexts = normalizeOralList(
    (oralRow as { oral_texts?: unknown } | null)?.oral_texts,
  )

  const grade = profile?.grade_level ?? null

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

  const [
    cachedSubjects,
    cachedChapters,
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
    // Portefeuille (migration 192) : LA source de vérité de l'XP/niveau. Lu ici
    // pour que l'XP du header découle des mêmes actions traçables que le niveau
    // du bandeau et du profil — pas d'un second calcul concurrent. Null tant que
    // la 192 n'est pas passée → repli sur l'XP dérivée (computeXp) plus bas.
    walletRow,
  ] = await Promise.all([
    // Catalogue servi par le cache serveur (identique pour tous les élèves).
    getSubjectsCached(),
    getGradeChaptersCached(grade),
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
    fetchWallet(supabase, user.id),
  ])

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
  const firstName =
    String(profile?.full_name ?? '').split(' ')[0] || null

  // Stats du header : XP et objectif du jour (minutes travaillées aujourd'hui vs
  // objectif fixé à l'onboarding). L'XP vient du PORTEFEUILLE quand il existe
  // (source unique, même chiffre que le niveau du bandeau et du profil) ; sinon
  // repli sur l'XP dérivée de l'activité — le calcul que la 192 rejoue en SQL.
  const derivedXp = computeXp({
    quizzes: (testDays ?? []).map((t) => ({ score: Number(t.score ?? 0) })),
    decks: (studyDays ?? []).map((s) => ({
      cards_count: Number(s.cards_count ?? 0),
    })),
    lessonsCount: (lessonDays ?? []).length,
    challengesXp: (challengeDays ?? []).reduce(
      (sum, c) => sum + Number(c.xp ?? 0),
      0,
    ),
  })
  const xp =
    walletRow && walletRow.xp != null
      ? Math.max(0, Number(walletRow.xp) || 0)
      : derivedXp
  const todayMinutes = Math.floor(Number(workToday?.seconds ?? 0) / 60)
  const goalMinutes = extraRow?.daily_goal_minutes ?? 15
  const trophies = Math.max(0, Number(trophyRow?.trophies) || 0)

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

  // --- Carte « Reprendre » : fragile le plus bas > en cours le plus avancé >
  //     premier chapitre jamais commencé ----------------------------------------
  const fragiles = analyzed
    .filter((a) => a.state === 'fragile')
    .sort((a, b) => a.value - b.value)
  const enCours = analyzed
    .filter((a) => a.state === 'en_cours')
    .sort((a, b) => b.value - a.value)
  const aCommencer = analyzed.filter((a) => a.state === 'a_commencer')

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

  // « On s'y remet ? » : chapitres en cours (puis fragiles) ; à défaut, les
  // premiers chapitres à commencer. (Les cartes de contrôle vivent désormais
  // dans leur propre rangée PrepCards, plus dans cette file.)
  let resumeItems: ResumeItem[] = [...enCours, ...fragiles]
    .slice(0, 5)
    .map((a) => ({
      subject: a.subject,
      chapterId: a.chapterId,
      chapterTitle: a.chapterTitle,
      progress: a.value,
      isNew: false,
    }))
  if (resumeItems.length === 0) {
    resumeItems = aCommencer.slice(0, 3).map((a) => ({
      subject: a.subject,
      chapterId: a.chapterId,
      chapterTitle: a.chapterTitle,
      progress: 0,
      isNew: true,
    }))
  }

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
  const tourAutoStart =
    !tutorialError && tutorialRow?.tutorial_completed === false

  return (
    <div className="flex flex-col gap-4">
      <TabHeader
        title="Réviser"
        subtitle="Ton programme, tes cours et ta file du jour."
      />
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
            {/* Accueil façon carnet : bandeau de salutation (prénom, classe,
                série), puis les blocs d'action qui chevauchent le bandeau
                (série de la semaine, file du jour, reprise), et enfin la
                grille des matières. */}
            <SubjectsHome
              firstName={firstName}
              avatarUri={avatarUri}
              streak={streak}
              xp={xp}
              trophies={trophies}
              todayMinutes={todayMinutes}
              goalMinutes={goalMinutes}
              subjects={ofLevel}
              selected={selected}
              grade={grade}
              progressBySlug={progressBySlug}
              examBySubject={examBySubject}
              underHeader={false}
              topSlot={
                <>
                  {/* 0. Boucle post-contrôle : demande de note le lendemain +
                      récap effort → résultat. Rendu null s'il n'y a rien à
                      demander/afficher. */}
                  <NoteInbox
                    controles={controles}
                    today={today}
                    subjectMeta={subjectMeta}
                  />
                  {/* 1. Ta série — la semaine d'activité mise en avant, tout en
                      haut, dans une carte blanche qui chevauche le bandeau. */}
                  <div className="rev-card rounded-3xl bg-white p-4 shadow-sm ring-1 ring-black/5">
                    <WeekPlannerStrip
                      week={week}
                      controles={controles}
                      today={today}
                      subjectMeta={subjectMeta}
                      subjects={examSubjects}
                      chaptersBySubject={chaptersBySubject}
                      existingExamChapters={[...existingExamChapters]}
                      goalMinutes={goalMinutes}
                      activeDays={[...activityDays]}
                    />
                  </div>
                  {/* 2. Préparer mes contrôles — une carte par contrôle actif,
                      même couleur/intitulé que la ligne de semaine. */}
                  <PrepCards
                    controles={controles}
                    today={today}
                    subjectMeta={subjectMeta}
                  />
                  {/* 3. On s'y remet — les dernières sessions, sous la série.
                      (La carte « À revoir aujourd'hui » a été retirée d'ici :
                      elle empilait une troisième porte d'entrée au-dessus de la
                      grille des matières. La file SRS reste accessible depuis
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
