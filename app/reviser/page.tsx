import Link from 'next/link'
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
import SubjectsHome from '@/components/SubjectsHome'
import ReviserSpaces from '@/components/ReviserSpaces'
import ResumeSessions, { type ResumeItem } from '@/components/ResumeSessions'
import CarnetLibrary from '@/components/CarnetLibrary'
import CarnetCreateFab from '@/components/CarnetCreateFab'
import WeekPlannerStrip from '@/components/WeekPlannerStrip'
import ExamObjectiveToggle from '@/components/ExamObjectiveToggle'
import { type ExamProgressEntry } from '@/components/ExamProgress'
import OralTextsCard from '@/components/OralTextsCard'
import CommuteBanner from '@/components/CommuteBanner'
import ReviewQueueCard from '@/components/ReviewQueueCard'
import SubjectMasteryCelebration from '@/components/SubjectMasteryCelebration'
import { createClient } from '@/lib/supabase/server'
import { avatarDataUri, normalizeAvatarConfig } from '@/lib/avatar'
import { getSubjectsCached, getGradeChaptersCached } from '@/lib/catalog'
import { examsForProfile } from '@/lib/exams'
import { getChapterMastery, chapterState } from '@/lib/mastery'
import { computeXp } from '@/lib/xp'
import { getReviewItems, reviewQueue, countsBySubject } from '@/lib/srs'
import {
  toDayKey,
  computeStreak,
  weekProgress,
  activityCutoff,
} from '@/lib/streak'
import {
  normalizeExamList,
  activeExams,
  examHintsBySubject,
} from '@/lib/next-exam'
import { normalizeOralList } from '@/lib/oral-texts'
import {
  isLibraryKind,
  normalizeContent,
  normalizeTitle,
  isContentReady,
} from '@/lib/library'
import {
  previewLines,
  previewMeta,
  type ShelfItem,
} from '@/lib/library-shelf'
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
          description="Ta série, ton avancement et ton programme, au même endroit."
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
  const [{ data: profile }, { data: avatarRow }, { data: oralRow }] =
    await Promise.all([
      supabase
        .from('profiles')
        .select(
          'full_name, grade_level, selected_subjects, commute_slots, upcoming_exams, daily_goal_minutes',
        )
        .eq('id', user.id)
        .maybeSingle(),
      supabase.from('profiles').select('avatar').eq('id', user.id).maybeSingle(),
      supabase
        .from('profiles')
        .select('oral_texts')
        .eq('id', user.id)
        .maybeSingle(),
    ])
  const avatarUri = avatarDataUri(normalizeAvatarConfig(avatarRow?.avatar), 128)
  const oralTexts = normalizeOralList(
    (oralRow as { oral_texts?: unknown } | null)?.oral_texts,
  )

  const grade = profile?.grade_level ?? null

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
    reviews,
    // Journées d'activité (tous types confondus) pour la flamme de série du
    // header — même définition que sur l'onglet Moi. On récupère au passage les
    // colonnes qui alimentent l'XP du header (score, cartes, xp du défi).
    { data: testDays },
    { data: studyDays },
    { data: lessonDays },
    { data: challengeDays },
    { data: libraryRows },
    // Temps travaillé aujourd'hui (work_daily, migration 084) → objectif du jour
    // du header. Bucket par date UTC, cohérent avec la série.
    { data: workToday },
  ] = await Promise.all([
    // Catalogue servi par le cache serveur (identique pour tous les élèves).
    getSubjectsCached(),
    getGradeChaptersCached(grade),
    getChapterMastery(supabase, user.id),
    getReviewItems(supabase, user.id),
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
    // Bibliothèque de Mon carnet (library_items, migration 158) : les 60
    // derniers contenus suffisent à l'étagère — échec isolé → bloc vide.
    supabase
      .from('library_items')
      .select('id, kind, title, content, updated_at')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(60),
    supabase
      .from('work_daily')
      .select('seconds')
      .eq('user_id', user.id)
      .eq('day', toDayKey(new Date()))
      .maybeSingle(),
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

  // File « À revoir aujourd'hui » : items SRS dus + Revanche.
  const queue = reviewQueue(reviews, toDayKey(new Date()))

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

  // Stats du header : XP dérivée de l'activité réelle (lib/xp) et objectif du
  // jour (minutes travaillées aujourd'hui vs objectif fixé à l'onboarding).
  const xp = computeXp({
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
  const todayMinutes = Math.floor(Number(workToday?.seconds ?? 0) / 60)
  const goalMinutes = profile?.daily_goal_minutes ?? 15

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

  // Contrôles à venir (migration 087) → annotation des dossiers : chaque matière
  // qui a un contrôle proche porte un liseré coloré + un compte à rebours.
  const today = toDayKey(new Date())
  const upcomingExams = activeExams(
    normalizeExamList(profile?.upcoming_exams),
    today,
  )
  const examBySubject = examHintsBySubject(upcomingExams, today)

  // « On s'y remet ? » : chapitres en cours (puis fragiles) ; à défaut, les
  // premiers chapitres à commencer.
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

  // --- Bibliothèque (Mon carnet) : aperçus calculés côté serveur ----------------
  // On ne transfère au client que des miniatures (lignes rognées), jamais le
  // contenu complet des fiches.
  const nowIso = new Date().toISOString()
  const shelfItems: ShelfItem[] = (libraryRows ?? [])
    .filter((r) => isLibraryKind(r.kind))
    .map((r) => {
      const content = normalizeContent(r.kind, r.content)
      return {
        id: String(r.id),
        kind: r.kind,
        title: normalizeTitle(r.title),
        ready: isContentReady(r.kind, content),
        updatedAt: String(r.updated_at ?? ''),
        lines: previewLines(r.kind, content),
        meta: previewMeta(r.kind, content),
      }
    })

  return (
    <div className="flex flex-col gap-4">
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
                  {/* 1. Ta série — la semaine d'activité mise en avant, tout en
                      haut, dans une carte blanche qui chevauche le bandeau. */}
                  <div className="rev-card rounded-3xl bg-white p-4 shadow-sm ring-1 ring-black/5">
                    <WeekPlannerStrip
                      week={week}
                      exams={upcomingExams}
                      today={today}
                      subjects={examSubjects}
                      activeDays={[...activityDays]}
                    />
                  </div>
                  {/* 2. À revoir aujourd'hui — LA porte de la file SRS +
                      Revanche (entrée unique, l'ancienne tuile jumelle des
                      outils a été retirée). Absente si la file est vide. */}
                  <ReviewQueueCard
                    total={queue.length}
                    revanche={queue.filter((i) => i.in_revanche).length}
                    subjects={[...countsBySubject(queue).entries()].sort(
                      (a, b) => b[1] - a[1],
                    )}
                  />
                  {/* 3. On s'y remet — les dernières sessions, sous la série. */}
                  <ResumeSessions items={resumeItems} />
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
              Ton carnet de bord scolaire : ta bibliothèque de fiches, quiz et
              cartes mentales.
            </p>
            {/* La Bibliothèque — LE bloc du carnet : fiches, quiz et cartes
                mentales visibles directement (aperçus, filtres par type,
                groupes de récence), création sans quitter le carnet.
                (Contrôles à venir, maîtrise et examen blanc retirés d'ici :
                l'examen blanc vit désormais dans chaque dossier de matière.) */}
            <CarnetLibrary items={shelfItems} now={nowIso} />
            {/* Descriptif de l'oral (1re français). */}
            {hasFrenchOral ? <OralTextsCard initial={oralTexts} /> : null}
            {/* Bouton flottant « + » : créer fiche quiz / flash cards / carte
                mentale sans quitter le carnet. */}
            <CarnetCreateFab />
          </div>
        }
      />
    </div>
  )
}
