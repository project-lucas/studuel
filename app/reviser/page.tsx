import { toutLire } from '@/lib/postgrest-pages'
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
import TourGuide from '@/components/TourGuide'
import SubjectsHome from '@/components/SubjectsHome'
import ResumeSessions, { type ResumeItem } from '@/components/ResumeSessions'
import CarnetButton from '@/components/carnet/CarnetButton'
import ClasseChip from '@/components/reviser/ClasseChip'
import { isGradeLevel } from '@/lib/grades'
import SerieBar from '@/components/reviser/SerieBar'
import MarcelFab from '@/components/reviser/MarcelFab'
import PortailFixe from '@/components/PortailFixe'
import SubjectMasteryCelebration from '@/components/SubjectMasteryCelebration'
import { fetchGauges, gardiensSortis } from '@/lib/traque-server'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import {
  getSubjectsCached,
  getGradeChaptersCached,
  getSubjectLevelsCached,
} from '@/lib/catalog'
import { subjectsWithContentAt } from '@/lib/subject-visibility'
import { readRowTolerant } from '@/lib/profile-read'
import { chapterState } from '@/lib/mastery'
import { getChapterMastery } from '@/lib/mastery-server'
import { compterCapsulesNonOuvertes } from '@/lib/capsules-server'
import { fetchJoursActifs } from '@/lib/jours-actifs'
import { lireGelsSerie } from '@/lib/boutique/boosts-server'
import { normaliserPrioritaires } from '@/lib/matieres-prioritaires'
import { getChapitresVus } from '@/lib/chapitres-vus'
import { progressionMatiere, type ChapitreProgression } from '@/lib/progression'
import { toDayKey, computeStreak, weekProgress } from '@/lib/streak'
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
  /** Les matières étoilées (359) ; absente tant que la migration dort. */
  matieres_prioritaires?: unknown
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
    { data: controleRows },
    { data: sessionRows },
    cachedSubjects,
    chapitresVus,
    // Les jauges de La Traque. Lues ICI, dans la vague déjà partie : elles ne
    // dépendent ni de la classe ni du catalogue, et `buildTraqueBoard` compose
    // ensuite le plateau SANS requête. C'est le geste de l'arène, à
    // l'identique — rien ne justifierait une vague de plus pour colorer des
    // dossiers.
    jauges,
    // Les capsules achetées et jamais ouvertes (366) : la pastille du bouton
    // « Mon carnet ». Un compte en tête de requête, zéro tant que la
    // migration dort.
    capsulesNonOuvertes,
    // Les gels de série achetés en boutique (368) : les jours qu'ils ont
    // pontés comptent dans la flamme. Une ligne par clé primaire, neutre tant
    // que la migration dort.
    gelsSerie,
  ] = await Promise.all([
    readRowTolerant<ProfileRow>(supabase, 'profiles', 'id', user.id, [
      'full_name',
      'grade_level',
      'selected_subjects',
      'profile_type',
      'daily_goal_minutes',
      'tutorial_completed',
      'matieres_prioritaires',
    ]),
    getChapterMastery(supabase, user.id),
    fetchJoursActifs(supabase, user.id),
    // Cours de Mon carnet (carnet_courses, migration 186) : depuis le
    // 15/09/2026 le carnet a sa propre page (`/carnet`) ; ici on ne compte que
    // les cours et leurs questions jouables pour le résumé du bouton
    // « Mon carnet » — échec isolé (migration pas passée) → zéro.
    supabase
      .from('carnet_courses')
      .select('id')
      .eq('owner_id', user.id)
      .limit(200),
    // Questions des cours du carnet (type + contenu : il faut distinguer les
    // brouillons des questions jouables), page par page — PostgREST plafonne
    // à 1 000 lignes sans le dire, la RLS limite aux cours de l'élève.
    toutLire<{ id: string; type: string; content: unknown }>((from, to) =>
      supabase
        .from('carnet_questions')
        .select('id, type, content')
        .order('id', { ascending: true })
        .range(from, to)
        .returns<{ id: string; type: string; content: unknown }[]>(),
    ),
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
    // Les jauges de La Traque — voir `gardiens`, plus bas.
    fetchGauges(supabase, user.id),
    compterCapsulesNonOuvertes(supabase, user.id),
    lireGelsSerie(supabase, user.id),
  ])

  const grade = profile.grade_level ?? null

  // Un compte parent n'a pas de classe : sans ça, il tombait sur « Dis-nous ta
  // classe » — un écran d'élève dont la seule issue est de s'en inventer une.
  // Le test vit ICI plutôt qu'à la racine parce que le profil y est DÉJÀ
  // chargé : le faire en amont coûtait une requête de plus à chaque lancement
  // de l'app, pour tous les élèves, afin de router une poignée de parents.
  if (
    (profile as { profile_type?: string | null } | null)?.profile_type ===
    'parent'
  ) {
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
    const { data } = await toutLire((from, to) =>
      supabase
        .from('chapters')
        .select('id, subject_id, level, title, position')
        .eq('level', contentLevelFor(grade))
        .order('position', { ascending: true })
        .order('id', { ascending: true })
        .range(from, to)
        .returns<typeof cachedChapters>(),
    )
    levelChapters = data
  }

  if (error) {
    // Détail technique en console pour le dev, message rassurant pour l'élève.
    console.error(
      '[reviser] chargement des matières impossible:',
      error.message,
    )
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
  const streak = computeStreak(activityDays, new Date(), gelsSerie)
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

  // LES GARDIENS SORTIS, par matière. Un boss débusqué ne se voyait QUE sur
  // l'arène : l'élève apprenait qu'il rôdait sur un onglet, et devait deviner
  // tout seul dans quel dossier aller le chercher. Sa fenêtre dure une heure —
  // le temps de la manquer. Le dossier de sa matière prend donc l'écarlate de
  // la bannière d'alerte, sur l'écran où l'on choisit ce qu'on révise.
  //
  // `gardiensSortis` est PUR : il compose depuis les jauges déjà lues, et il
  // raisonne MATIÈRE PAR MATIÈRE — contrairement au plateau de l'arène, qui
  // n'affiche qu'une carte par gardien (voir son avertissement).
  const gardiens = gardiensSortis(jauges, ofLevel)
  const withContent = new Set(
    subjectsWithContentAt(ofLevel, subjectLevels, grade).map((s) => s.slug),
  )
  const emptySlugs = new Set(
    ofLevel.map((s) => s.slug).filter((slug) => !withContent.has(slug)),
  )
  const followed = ofLevel.filter(
    (s) =>
      selected === null || selected.length === 0 || selected.includes(s.slug),
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
  const { mission, ensuite, autresControles } = pickMission({
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
  // TOUS les contrôles actifs suivent la mission, dans l'ordre des dates :
  // plusieurs contrôles = plusieurs cartes empilées, celle du haut est le
  // plus proche. Les reprises viennent après.
  const resumeItems: ResumeItem[] = [
    ...(mission ? [mission] : []),
    ...autresControles,
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
        // L'identifiant du contrôle : c'est lui que la croix de l'angle
        // retire quand l'élève s'est trompé en l'annonçant.
        controleId: controle?.id ?? null,
        urgency: controle ? examHeroUrgency(controle.date, today) : null,
        // Les jours qui restent avant le contrôle daté : le compte à rebours
        // posé à droite de la carte (« J-5 »). Nul sans date.
        daysLeft:
          controle && controle.date !== null
            ? Math.max(0, daysBetween(today, controle.date))
            : null,
        // Les séances du plan de préparation, comptées : ce sont les bâtons
        // verts de la carte. Le « 1/3 » existait déjà (derivePlanView) mais ne
        // vivait que dans l'écran de préparation — la révision espacée ne se
        // voyait donc jamais là où l'élève regarde vraiment.
        prep: controle
          ? (() => {
              const view = derivePlanView(controle, today)
              return {
                done: view.done,
                total: view.total,
                missed: view.missed,
              }
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

  // --- Mon carnet : le résumé du bouton (n cours · n questions jouables) ------
  const carnetCoursesCount = (courseRows ?? []).length
  let carnetQuestionsCount = 0
  for (const row of courseQuestionRows ?? []) {
    if (!isQuestionType(row.type)) continue
    const content = normalizeQuestionContent(row.type, row.content)
    if (isQuestionReady(row.type, content)) carnetQuestionsCount += 1
  }

  // Tour guidé. La base fait autorité dès qu'elle répond ; si la colonne 188
  // n'existe pas encore, on passe la main au composant, qui lira la mémoire
  // locale du navigateur. Avant ce changement, `=== false` ne pouvait jamais
  // être vrai sans la migration : une fonctionnalité entière, écrite et
  // testée, ne s'était jamais déclenchée chez un seul élève.

  // `pt-3` sur mobile (Lucas, 17/09/2026 : « un peu plus de place entre la
  // barre du haut et le bloc des jours ») : la coquille laisse 8 px sous le
  // bandeau, la carte de série en gagne 12 de plus, et respire. Sur desktop la
  // ligne de la classe tient déjà cet écart.
  return (
    <div className="flex flex-col gap-3 pt-3 md:pt-0">
      {/* Plus de titre « Réviser » (Lucas, 16/09/2026) : le mot vit sous
          l'icône active de la barre. LA CLASSE tient l'ANGLE HAUT-DROIT
          (Lucas, 17/09/2026) : sur mobile, elle se pose dans la bande du
          bandeau du haut, au bord droit que les cristaux ont libéré en
          rejoignant l'écusson de niveau — même hauteur (h-14), même ligne. Un
          tap pour en changer : on s'aperçoit ici, devant le programme, qu'on
          est dans la mauvaise année, pas dans le profil. Sur desktop, pas de
          bandeau : elle reprend sa ligne, alignée à droite. La porte du carnet
          est descendue dans la carte de série. */}
      {/* Mobile : la puce vit dans <body> (PortailFixe) pour rester collée au
          bandeau pendant le défilement. Desktop :
          elle garde sa ligne, dans le flux. */}
      <PortailFixe>
        <div className="fixed top-0 right-3 z-50 flex h-14 items-center md:hidden">
          <ClasseChip current={isGradeLevel(grade) ? grade : null} />
        </div>
      </PortailFixe>
      <div className="hidden justify-end md:flex">
        <ClasseChip current={isGradeLevel(grade) ? grade : null} />
      </div>
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
      {/* UN SEUL espace : le programme officiel. Le carnet, qui partageait cet
          écran derrière un volet (`?espace=carnet`), a sa propre page depuis
          le 15/09/2026 (`app/carnet`) — le bouton « Mon carnet » du titre y
          mène. */}
      <div className="flex flex-col gap-4">
        {/* La tête de Marcel, flottante en bas à droite : depuis qu'il n'a
                plus d'onglet, c'est LA porte du coach. */}
        <MarcelFab />
        {/* TROIS blocs, dans cet ordre : où j'en suis (la série), ce que je
                reprends (deux sessions), où je vais (mes dossiers). */}
        <SubjectsHome
          subjects={ofLevel}
          selected={selected}
          prioritaires={normaliserPrioritaires(profile?.matieres_prioritaires)}
          grade={grade}
          progressBySlug={progressBySlug}
          examBySubject={examBySubject}
          emptySlugs={emptySlugs}
          gardiens={gardiens}
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
                carnetSlot={
                  <CarnetButton
                    coursesCount={carnetCoursesCount}
                    questionsCount={carnetQuestionsCount}
                    capsulesNouvelles={capsulesNonOuvertes}
                    pleineLargeur
                  />
                }
              />
              {/* 2. « On s'y remet ? » — deux sessions à reprendre, pas une
                      réserve qui défile. */}
              <ResumeSessions items={resumeItems} />
            </>
          }
        />
      </div>
    </div>
  )
}
