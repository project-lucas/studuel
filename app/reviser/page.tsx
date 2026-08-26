import Link from 'next/link'
import { contentLevelFor } from '@/lib/grades'
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
import CarnetAiCard from '@/components/carnet/CarnetAiCard'
import RevoirBand from '@/components/carnet/RevoirBand'
import CarnetTile from '@/components/carnet/CarnetTile'
import SerieBar from '@/components/reviser/SerieBar'
import MarcelFab from '@/components/reviser/MarcelFab'
import SubjectMasteryCelebration from '@/components/SubjectMasteryCelebration'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import {
  getSubjectsCached,
  getGradeChaptersCached,
  getSubjectLevelsCached,
} from '@/lib/catalog'
import { subjectsWithContentAt } from '@/lib/subject-visibility'
import { readRowTolerant } from '@/lib/profile-read'
import { getChapterMastery, chapterState } from '@/lib/mastery'
import { fetchJoursActifs } from '@/lib/jours-actifs'
import { getChapitresVus } from '@/lib/chapitres-vus'
import { progressionMatiere, type ChapitreProgression } from '@/lib/progression'
import {
  toDayKey,
  computeStreak,
  weekProgress,
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
import {
  isQuestionReady,
  isQuestionType,
  normalizeQuestionContent,
} from '@/lib/carnet-cours'
import {
  bilanCours,
  couronnes,
  estDue,
  etatInitial,
  type CardState,
} from '@/lib/carnet/planification'
import { rowToState } from '@/lib/carnet/etats-server'
import { examHeroUrgency, type SubjectExamHint } from '@/lib/next-exam'
import type { Subject } from '@/lib/types'

export const metadata = { title: 'Réviser — Studuel' }
export const dynamic = 'force-dynamic'

// Les colonnes du profil dont cet écran a besoin, toutes migrations confondues.
// `tutorial_completed` (188) peut ne pas exister encore : elle ressort alors à
// `undefined`, et c'est la mémoire locale du navigateur qui tranche
// (cf. lib/tour-local) — sans quoi le tour guidé ne se lançait JAMAIS.
type ProfileRow = {
  full_name: string | null
  grade_level: string | null
  selected_subjects: unknown
  profile_type: string | null
  daily_goal_minutes: number | null
  tutorial_completed?: boolean | null
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
    // header — même définition que sur l'onglet Moi. UNE lecture agrégée
    // (migration 323) au lieu de quatre : la page transférait des milliers de
    // lignes sur 400 jours pour n'en tirer qu'un ensemble d'au plus 400 dates.
    activityDays,
    { data: courseRows },
    { data: courseQuestionRows },
    { data: carnetStateRows },
    { data: controleRows },
    { data: sessionRows },
    cachedSubjects,
    chapitresVus,
  ] = await Promise.all([
    readRowTolerant<ProfileRow>(supabase, 'profiles', 'id', user.id, [
      'full_name',
      'grade_level',
      'selected_subjects',
      'profile_type',
      'daily_goal_minutes',
      'tutorial_completed',
    ]),
    getChapterMastery(supabase, user.id),
    fetchJoursActifs(supabase, user.id),
    // Cours de Mon carnet (carnet_courses, migration 186) : l'étagère des
    // cours façon Wooflash — échec isolé (migration pas passée) → bloc vide.
    supabase
      .from('carnet_courses')
      .select('id, title, description, icon, color')
      .eq('owner_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(60),
    // Questions des cours du carnet (type + contenu : il faut distinguer les
    // brouillons des questions jouables pour le moteur « à revoir ») — borné
    // comme les autres listes de la page, la RLS limite aux cours de l'élève.
    supabase
      .from('carnet_questions')
      .select('id, course_id, type, content')
      .limit(2_000),
    // ÉTAT de chaque carte (migration 315) : il nourrit le héros « À revoir
    // aujourd'hui », les badges par cours et les couronnes de maîtrise.
    // Avant, cette page relisait les 4 000 DERNIÈRES TENTATIVES et rejouait la
    // règle d'échéance sur chacune, à chaque affichage — un coût qui grandissait
    // indéfiniment avec l'usage. L'échéance se LIT maintenant.
    supabase
      .from('carnet_question_states')
      .select(
        'question_id, phase, step, interval_days, ease, streak, reps, lapses, is_leech, due_at, last_seen_at',
      )
      .eq('user_id', user.id)
      .limit(2_000),
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
    // Ce que le prof a traité (migration 224) : c'est le dénominateur des
    // couronnes. Sans cette lecture, cet écran et le tableau de Marcel
    // afficheraient deux pourcentages différents pour la même matière.
    getChapitresVus(supabase, user.id),
  ])

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
  const [cachedChapters, subjectLevels] = await Promise.all([
    getGradeChaptersCached(grade),
    // Couples (matière, niveau) TOUS niveaux confondus : c'est eux qui disent
    // si une matière a du contenu, y compris hors-niveau (culture générale).
    getSubjectLevelsCached(),
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
      .eq('level', contentLevelFor(grade))
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
  const streak = computeStreak(activityDays)
  const week = weekProgress(activityDays)

  // L'objectif quotidien ne s'AFFICHE plus sur cet écran (l'anneau de minutes
  // est parti avec la carte de mission — le HUD et l'onglet Moi portent déjà le
  // temps travaillé). Il reste lu : c'est lui qui dimensionne les séances du
  // plan de révision d'un contrôle et la durée des sessions proposées.
  const goalMinutes = profile.daily_goal_minutes ?? 15

  // --- Matières suivies (profil onboarding) -----------------------------------
  const selected = Array.isArray(profile?.selected_subjects)
    ? (profile.selected_subjects as string[])
    : null
  const allSubjects = subjects ?? []
  // TOUTES les matières du niveau, y compris celles qui n'ont pas encore de
  // chapitre. On les masquait (elles menaient à une page vide, un cul-de-sac
  // cliquable) — décision de Lucas le 02/08 : chaque classe doit montrer son
  // programme ENTIER, le contenu manquant se remplit ensuite. Une matière vide
  // n'est donc plus cachée mais ANNONCÉE : sa carte porte « Bientôt »
  // (`emptySlugs` ci-dessous), ce qui dit la vérité au lieu de laisser croire à
  // une panne.
  //
  // Le Défi, lui, garde le filtre : là une matière sans question ne donne pas
  // une page vide mais un duel qui ne peut pas se jouer.
  const ofLevel = allSubjects.filter((s) => s.levels.includes(grade))
  const withContent = new Set(
    subjectsWithContentAt(ofLevel, subjectLevels, grade).map((s) => s.slug),
  )
  const emptySlugs = new Set(
    ofLevel.map((s) => s.slug).filter((slug) => !withContent.has(slug)),
  )
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
  // Les chapitres regroupés par matière, dans la forme qu'attend
  // `progressionMatiere` — LA définition du pourcentage d'une matière, partagée
  // avec le tableau Progrès de Marcel. Avant, cet écran faisait sa propre
  // moyenne (somme / total) : les couronnes et Marcel pouvaient annoncer deux
  // chiffres différents pour la même matière.
  const parMatiere = new Map<string, ChapitreProgression[]>()

  for (const c of levelChapters ?? []) {
    const subject = subjectById.get(c.subject_id)
    const p = mastery.get(c.id)
    const liste = parMatiere.get(c.subject_id) ?? []
    liste.push({
      value: p?.value ?? 0,
      state: chapterState(p),
      vuEnCours: chapitresVus.has(c.id),
    })
    parMatiere.set(c.subject_id, liste)
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

  // --- Anneaux des tuiles -------------------------------------------------------
  const progressBySlug: Record<string, number> = {}
  for (const s of ofLevel) {
    progressBySlug[s.slug] = progressionMatiere(parMatiere.get(s.id) ?? []).pct
  }

  // Contrôles annoncés (migration 203) : ils alimentent les pastilles de la
  // barre de semaine et le compte à rebours posé sur la carte de la matière.
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

  // --- « On s'y remet ? » : les sessions à reprendre, classées par l'app
  //     (contrôle actif > reprise du plus avancé > fragile > découverte).
  //     La carte de mission a disparu ; son classement, lui, reste le bon — il
  //     nourrit maintenant la rangée des deux dernières sessions.
  const { mission, ensuite } = pickMission({
    today,
    controles,
    subjectNameBySlug: Object.fromEntries(
      allSubjects.map((s) => [s.slug, s.name]),
    ),
    chapters: candidates,
    goalMinutes,
  })

  // Les sessions à reprendre, re-liées à leur objet Subject complet (icône +
  // couleur de pastille). La meilleure session vient en tête — c'est ce que
  // portait la carte de mission ; le composant en fait sa carte violette.
  //
  // Le catalogue COMPLET, et non les seules matières suivies : un contrôle
  // s'annonce sur n'importe quelle matière du niveau (la feuille « + Contrôle »
  // les propose toutes), et une matière décochée au crayon faisait jusqu'ici
  // disparaître sa session de préparation sans un mot.
  const subjectBySlug = new Map(allSubjects.map((s) => [s.slug, s]))
  // Le contrôle porté par la mission : c'est sa DATE qui donne l'échéance
  // affichée sur la carte de tête.
  const controleById = new Map(controles.map((c) => [c.id, c]))
  const resumeItems: ResumeItem[] = [
    ...(mission ? [mission] : []),
    ...ensuite,
  ].flatMap((m) => {
    const subject = subjectBySlug.get(m.subjectSlug)
    if (!subject) return []
    const controle = m.controleId ? controleById.get(m.controleId) : undefined
    return [
      {
        subject,
        chapterId: m.chapterId,
        chapterTitle: m.chapterTitle,
        // `kind`, `progress` et l'échéance étaient JETÉS ici : la session de
        // préparation d'un contrôle arrivait à l'écran en carte anonyme, et son
        // `progress: null` (voulu — une séance de plan n'a pas d'avancement)
        // était écrasé en `0`, ce qui affichait « 0 % fait » la veille d'un
        // contrôle. L'urgence existait dans le moteur, pas dans l'interface.
        kind: m.kind,
        progress: m.progress,
        minutes: m.minutes,
        urgency: controle ? examHeroUrgency(controle.date, today) : null,
        // Les séances du plan de préparation, comptées : ce sont les bâtons
        // verts de la carte. Le « 1/3 » existait déjà (derivePlanView) mais ne
        // vivait que dans l'écran de préparation — la révision espacée ne se
        // voyait donc jamais là où l'élève regarde vraiment.
        prep: controle
          ? (() => {
              const view = derivePlanView(controle, today)
              return { done: view.done, total: view.total, missed: view.missed }
            })()
          : null,
      },
    ]
  })

  // Matières + chapitres du niveau : la matière première de la feuille
  // « Annoncer un contrôle » (le « + » de la barre de série).
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
  // Questions JOUABLES par cours (brouillons exclus) : c'est la matière des
  // badges « à revoir » et des couronnes de chaque cours.
  const playableByCourse = new Map<string, string[]>()
  const playableQuestions: { id: string; courseId: string }[] = []
  for (const row of courseQuestionRows ?? []) {
    if (!isQuestionType(row.type)) continue
    const content = normalizeQuestionContent(row.type, row.content)
    if (!isQuestionReady(row.type, content)) continue
    const courseId = String(row.course_id)
    const id = String(row.id)
    playableQuestions.push({ id, courseId })
    const list = playableByCourse.get(courseId)
    if (list) list.push(id)
    else playableByCourse.set(courseId, [id])
  }

  const nowIso = new Date().toISOString()
  // Les états lus, indexés par question. Une carte sans ligne n'a jamais été
  // vue : état neuf, donc due.
  const etatsCarnet = new Map<string, CardState>()
  for (const row of carnetStateRows ?? []) {
    etatsCarnet.set(
      String(row.question_id),
      rowToState(row as Parameters<typeof rowToState>[0], nowIso),
    )
  }
  const etatDe = (qid: string): CardState =>
    etatsCarnet.get(qid) ?? etatInitial(nowIso)

  // Le total dû, tous cours confondus : c'est le chiffre du héros « À revoir ».
  const dueTotal = playableQuestions.filter((q) =>
    estDue(etatDe(q.id), nowIso),
  ).length

  const courseItems: CourseShelfItem[] = (courseRows ?? []).map((r) => {
    const id = String(r.id)
    const playable = playableByCourse.get(id) ?? []
    const bilan = bilanCours(
      playable.map((qid) => ({ id: qid, state: etatDe(qid) })),
      nowIso,
    )
    return {
      id,
      title: String(r.title ?? 'Sans titre'),
      description: r.description ? String(r.description) : null,
      icon: r.icon ? String(r.icon) : null,
      color: r.color ? String(r.color) : null,
      questionCount: playable.length,
      dueCount: bilan.dues,
      // Les couronnes se comptent désormais sur les cartes ACQUISES (intervalle
      // ≥ 21 jours), et non sur « dernier essai juste » : une carte devinée une
      // fois ne vaut pas une carte sue depuis deux mois.
      crowns: couronnes(bilan),
    }
  })

  // Tour guidé. La base fait autorité dès qu'elle répond ; si la colonne 188
  // n'existe pas encore, on passe la main au composant, qui lira la mémoire
  // locale du navigateur. Avant ce changement, `=== false` ne pouvait jamais
  // être vrai sans la migration : une fonctionnalité entière, écrite et
  // testée, ne s'était jamais déclenchée chez un seul élève.

  return (
    <div className="flex flex-col gap-3">
      <TabHeader title="Réviser" />
      {/* Tour guidé post-onboarding (spotlights sur la nav + bulles). */}
      <TourGuide etatEnBase={profile.tutorial_completed} />
      {/* Fête (une seule fois) les matières arrivées à 90 % ou 100 %. */}
      <SubjectMasteryCelebration
        entries={followed.map((s) => ({
          slug: s.slug,
          name: s.name,
          pct: progressBySlug[s.slug] ?? 0,
        }))}
      />
      {/* Deux espaces : « Mes matières » (la série, ce qu'on reprend, le
          programme) et « Mon carnet » (les cours que l'élève écrit lui-même —
          rien d'autre). */}
      <ReviserSpaces
        reviser={
          <div className="flex flex-col gap-4">
            {/* La tête de Marcel, flottante en bas à droite : depuis qu'il n'a
                plus d'onglet, c'est LA porte du coach. Elle ne vit que dans ce
                volet — le carnet a son propre « + » au même endroit, et le volet
                inactif est `hidden`, donc retiré du rendu. */}
            <MarcelFab />
            {/* TROIS blocs, dans cet ordre : où j'en suis (la série), ce que je
                reprends (deux sessions), où je vais (mes dossiers). */}
            <SubjectsHome
              subjects={ofLevel}
              selected={selected}
              grade={grade}
              progressBySlug={progressBySlug}
              examBySubject={examBySubject}
              emptySlugs={emptySlugs}
              carnetSlot={
                /* La porte d'entrée du carnet : un bouton-icône collé à la
                   loupe de la rangée de commandes (l'ancienne tuile pleine
                   largeur vivait sous le pli). */
                <CarnetTile
                  coursesCount={courseItems.length}
                  questionsCount={courseItems.reduce(
                    (sum, c) => sum + c.questionCount,
                    0,
                  )}
                />
              }
              topSlot={
                /* DEUX blocs avant les matières, plus cinq. L'accueil empilait
                   la mission du jour, la ligne des contrôles, la boucle
                   post-contrôle, le rail des sessions et le bandeau trajet :
                   autant de propositions à trancher avant d'apercevoir la
                   première matière, sur l'écran que l'élève ouvre le plus
                   souvent. */
                <>
                  {/* 1. La série : la semaine, l'historique de l'année, et le
                      seul geste d'organisation gardé ici (annoncer un
                      contrôle). */}
                  <SerieBar
                    streak={streak}
                    week={week}
                    today={today}
                    activeDays={[...activityDays]}
                    controles={controles}
                    subjectMeta={subjectMeta}
                    subjects={examSubjects}
                    chaptersBySubject={chaptersBySubject}
                    existingExamChapters={[...existingExamChapters]}
                    goalMinutes={goalMinutes}
                  />
                  {/* 2. « On s'y remet ? » — deux sessions à reprendre, pas une
                      réserve qui défile. */}
                  <ResumeSessions items={resumeItems} />
                </>
              }
            />
          </div>
        }
        carnet={
          <div className="flex flex-col gap-4">
            {/* LE CARNET NE FAIT PLUS QU'UNE CHOSE : créer et tenir ses propres
                dossiers de cours. Tout ce qui s'y était accumulé (héros « à
                revoir », objectif examen, sessions en réserve, cartes de
                préparation de contrôle, bandeau trajet) est parti : un volet
                nommé « Mon carnet » qui ouvre sur cinq blocs dont aucun n'est un
                cours, c'est un tiroir à fourre-tout, pas un carnet. */}
            {/* Créer, de partout dans la liste : le « + » flottant (il ne vit
                que dans ce volet, le panneau inactif étant `hidden`). */}
            <CarnetFab />
            {/* Ce que la journée réclame, en une bande — et le seul lien de
                l'app vers la session transverse, restée orpheline. */}
            <RevoirBand dues={dueTotal} />
            {/* « Mes cours » — LE bloc du carnet, en tableau de bord :
                couronnes, badges « à revoir », ▶ direct, brouillons repliés. */}
            <CoursesShelf items={courseItems} />
            {/* L'argument massue, enfin visible : l'IA rédige les questions
                depuis le cours de l'élève (même feuille que le +). */}
            <CarnetAiCard />
          </div>
        }
      />
    </div>
  )
}
