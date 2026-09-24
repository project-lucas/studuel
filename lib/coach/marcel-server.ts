import type { SupabaseClient } from '@supabase/supabase-js'
import { chapterState } from '@/lib/mastery'
import { getChapterMastery } from '@/lib/mastery-server'
import {
  getSubjectsCached,
  getGradeChaptersCached,
  getGradeQuizzesCached,
  getQuizQuestionCountsCached,
} from '@/lib/catalog'
import { HORS_NIVEAU } from '@/lib/types'
import { readRowTolerant } from '@/lib/profile-read'
import { toDayKey, computeStreak } from '@/lib/streak'
import { debutDuMois } from '@/lib/coach/credits'
import { fetchJoursActifs } from '@/lib/jours-actifs'
import { rowsToControles, type ControleRow, type SessionRow } from '@/lib/prep-plan'
import { pickMission, type ChapterCandidate } from '@/lib/mission'
import type { Subject } from '@/lib/types'
import type { Tier } from '@/lib/subscription'
import { pointDuJour, type PointDuJour } from './point-du-jour'
import { hasRegime, regimeOf, type Regime } from './regimes'
import {
  couvertureFor,
  type ChapitreCouvert,
  type CouvertureMatiere,
} from './couverture'
import { examsForProfile } from '@/lib/exams'
import { normalizeOralList } from '@/lib/oral-texts'
import { getChapitresVus } from '../chapitres-vus'
import { lireGelsSerie } from '@/lib/boutique/boosts-server'

// Résolution SERVEUR du point du jour de Marcel. La décision est PURE et testée
// (./point-du-jour, ./regimes) ; ce module ne fait que rassembler les données.
//
// Il reprend EXACTEMENT la source de Réviser : mêmes chapitres, même maîtrise,
// mêmes contrôles, même `pickMission`. C'est la condition du partage décidé
// avec Lucas — deux résolutions concurrentes annonceraient deux missions
// différentes, et l'élève aurait deux patrons.

type ProfileRow = {
  grade_level: string | null
  selected_subjects: unknown
  daily_goal_minutes: number | null
  subscription_tier: string | null
  gems: number | null
  oral_texts: unknown
}

/** Une matière suivie, prête pour le sélecteur de l'onglet Méthode. */
export type MatiereSuivie = {
  slug: string
  name: string
  color: string
  regime: Regime | null
}

export type MarcelSnapshot = {
  point: PointDuJour
  matieres: MatiereSuivie[]
  streak: number
  grade: string | null
  /** Aucune matière suivie n'a de chapitre : l'onglet Méthode n'a rien à dire. */
  catalogueVide: boolean
  /**
   * slug de matière → questions disponibles AU NIVEAU de l'élève. Sert à ne
   * proposer un contrôle que là où il y a de quoi le remplir (cf.
   * ./entrainement) — le catalogue est inégal, l'annoncer vaut mieux que de
   * servir un sujet creux.
   */
  disponiblesBySlug: Record<string, number>
  /**
   * Ce que Marcel sait VRAIMENT lire aujourd'hui : la couverture du programme.
   * Pas la typologie d'erreur — elle n'existe sur aucune question du catalogue,
   * et un écran qui prétendrait dire « pourquoi » tu te trompes mentirait.
   */
  couverture: CouvertureMatiere[]
  /**
   * Les chapitres bruts qui ont produit `couverture`. Le tableau Progrès les
   * reçoit tels quels et rappelle `couvertureFor` lui-même à chaque case cochée :
   * une seule fonction calcule le pourcentage, côté serveur comme côté client,
   * donc aucun risque que la case cochée et le total affiché divergent.
   */
  chapitresCouverts: ChapitreCouvert[]
  /**
   * Les matières qui tombent à l'examen de l'année (brevet, bac de français,
   * bac). Vide hors classe à examen — le mode examen ne s'affiche alors pas.
   */
  slugsExamen: string[]
  /**
   * Le descriptif de l'oral (1re français, migration 156) : ce que l'élève doit
   * savoir présenter. `null` quand l'épreuve ne le concerne pas.
   */
  oral: { total: number; maitrises: number } | null
  /** De quoi afficher la porte de « Demander à Marcel » sans aller-retour. */
  demande: {
    tier: Tier
    utilisesAujourdhui: number
    /** Crédits dépensés ce mois-ci (migration 378). */
    depensesMois: number
    jetons: number
    gemmes: number
  }
}

const DEFAULT_GOAL = 15

/**
 * Rassemble tout ce dont l'onglet Marcel a besoin, en une passe.
 *
 * Les requêtes indépendantes partent ENSEMBLE : cet écran est le premier que
 * l'élève ouvre après la barre de nav, il n'a pas les moyens d'une cascade.
 */
export async function getMarcelSnapshot(
  supabase: SupabaseClient,
  userId: string,
): Promise<MarcelSnapshot> {
  // UNE VAGUE (19/09/2026, chantier latence). Le profil était attendu seul,
  // puis tout le reste partait : deux allers-retours en file. Seuls le
  // programme et les quiz de la classe dépendent du profil — et ils viennent
  // du cache serveur ; ils sont CHAÎNÉS sur lui, tout le reste part d'emblée.
  const profileP = readRowTolerant<ProfileRow>(
    supabase,
    'profiles',
    'id',
    userId,
    [
      'grade_level',
      'selected_subjects',
      'daily_goal_minutes',
      'subscription_tier',
      'gems',
      'oral_texts',
    ],
  )

  const [
    profile,
    allSubjects,
    levelChapters,
    gradeQuizzes,
    questionCounts,
    mastery,
    activityDays,
    { data: controleRows },
    { data: sessionRows },
    { data: coachCalls },
    { data: coachTokens },
    { data: coachCredits },
    chapitresVus,
    gelsSerie,
  ] = await Promise.all([
    profileP,
    getSubjectsCached(),
    profileP.then((p) => (p?.grade_level ? getGradeChaptersCached(p.grade_level) : [])),
    // Catalogue mis en cache serveur : identique pour tous les élèves de la
    // classe, donc jamais rechargé par utilisateur.
    profileP.then((p) =>
      p?.grade_level
        ? getGradeQuizzesCached(p.grade_level, HORS_NIVEAU)
        : ([] as { id: string; subject: string; lesson_id: string | null }[]),
    ),
    getQuizQuestionCountsCached(),
    getChapterMastery(supabase, userId),
    // La série : `jours_actifs()`, comme Réviser, Moi et le bandeau du haut
    // (carnet et leçons compris). Marcel lisait trois tables sur 400 jours et
    // oubliait les leçons terminées : sa flamme pouvait être plus courte que
    // celle du bandeau, pour le même élève.
    fetchJoursActifs(supabase, userId),
    supabase
      .from('controles')
      .select(
        'id, subject_slug, chapters, exam_date, grade, note, note_prompted, snooze_date',
      )
      .eq('user_id', userId)
      .returns<ControleRow[]>(),
    // Les séances de préparation vivent dans `sessions_preparation` (203).
    // Marcel lisait `controle_sessions`, une table qui n'a jamais existé : la
    // requête échouait en silence et sa mission ignorait les contrôles
    // planifiés (19/09/2026).
    supabase
      .from('sessions_preparation')
      .select(
        'id, controle_id, planned_date, duration_min, chapter_id, status, position',
      )
      .eq('user_id', userId)
      .returns<SessionRow[]>(),
    // Compteur et solde du Prof (migration 215). Absents tant qu'elle n'est pas
    // exécutée : l'écran affiche alors le quota plein, et c'est la RPC — donc le
    // serveur — qui refusera. Aucune décision ne se prend ici.
    supabase
      .from('coach_calls')
      .select('attempts')
      .eq('user_id', userId)
      .eq('day_bucket', toDayKey(new Date()))
      .maybeSingle(),
    supabase
      .from('coach_tokens')
      .select('balance')
      .eq('user_id', userId)
      .maybeSingle(),
    // Les crédits du mois (378). Absente : 0 dépensé — c'est la RPC qui décide.
    supabase
      .from('coach_credits')
      .select('depenses')
      .eq('user_id', userId)
      .eq('mois', debutDuMois(new Date()))
      .maybeSingle(),
    // Ce que le prof a traité, déclaré par l'élève (migration 224) : c'est le
    // dénominateur du pourcentage de chaque matière.
    getChapitresVus(supabase, userId),
    // Les gels de série achetés en boutique (368) : Marcel voit la même flamme
    // que le bandeau du haut.
    lireGelsSerie(supabase, userId),
  ])

  const grade = profile?.grade_level ?? null
  const goalMinutes = profile?.daily_goal_minutes ?? DEFAULT_GOAL

  // --- Matières suivies (choix d'onboarding, repli sur tout le catalogue) ------
  const selected = Array.isArray(profile?.selected_subjects)
    ? (profile.selected_subjects as string[])
    : []
  const followed: Subject[] =
    selected.length > 0
      ? allSubjects.filter((s) => selected.includes(s.id) || selected.includes(s.slug))
      : allSubjects

  const followedIds = new Set(followed.map((s) => s.id))
  const subjectById = new Map(followed.map((s) => [s.id, s]))

  // --- Candidats à la mission : mêmes règles que Réviser, à la lettre ---------
  const candidates: ChapterCandidate[] = []
  for (const chapter of levelChapters) {
    if (!followedIds.has(chapter.subject_id)) continue
    const subject = subjectById.get(chapter.subject_id)
    if (!subject) continue
    const progress = mastery.get(chapter.id)
    candidates.push({
      subjectSlug: subject.slug,
      subjectName: subject.name,
      chapterId: chapter.id,
      chapterTitle: chapter.title,
      state: chapterState(progress),
      value: progress?.value ?? 0,
    })
  }

  // Mêmes candidats que la mission — une seule lecture du programme — augmentés
  // de la seule chose que l'app ne peut pas deviner : ce que le prof a traité.
  const chapitresCouverts: ChapitreCouvert[] = candidates.map((c) => ({
    chapterId: c.chapterId,
    chapterTitle: c.chapterTitle,
    subjectSlug: c.subjectSlug,
    subjectName: c.subjectName,
    state: c.state,
    value: c.value,
    vuEnCours: chapitresVus.has(c.chapterId),
  }))

  // --- Ce qui tombe à l'examen de l'année -------------------------------------
  // Dérivé du profil, comme sur Réviser : aucune configuration manuelle. Vide en
  // 6e→2de, où il n'y a pas d'épreuve officielle.
  const slugsExamen = grade
    ? examsForProfile(
        grade,
        followed.map((s) => s.slug),
        allSubjects,
      ).map((e) => e.subject.slug)
    : []

  // Le descriptif de l'oral (migration 156) ne concerne que le bac de français.
  // Ailleurs, `null` : Marcel ne compte pas des textes que personne ne doit
  // présenter.
  const textes = normalizeOralList(profile?.oral_texts)
  const oral =
    grade === '1re' && slugsExamen.includes('francais')
      ? {
          total: textes.length,
          maitrises: textes.filter((t) => t.status === 'maitrise').length,
        }
      : null

  // --- Série et historique ----------------------------------------------------
  const streak = computeStreak(activityDays, new Date(), gelsSerie)

  // « Jour 1 » ne se déduit pas de la série (elle tombe à zéro après une pause)
  // mais de l'absence TOTALE d'activité et de maîtrise : c'est la seule lecture
  // qui distingue un nouvel élève d'un élève qui revient.
  const hasHistory = activityDays.size > 0 || mastery.size > 0

  // --- Questions disponibles par matière, au niveau de l'élève ---------------
  // `quizzes.subject` porte le NOM d'affichage de la matière, pas son slug :
  // on repasse par le catalogue pour retomber sur des slugs, seule clé stable.
  const questionsByQuiz = new Map(questionCounts)
  const slugByName = new Map(allSubjects.map((s) => [s.name, s.slug]))
  const disponiblesBySlug: Record<string, number> = {}
  for (const quiz of gradeQuizzes) {
    const slug = slugByName.get(quiz.subject)
    if (!slug) continue
    disponiblesBySlug[slug] =
      (disponiblesBySlug[slug] ?? 0) + (questionsByQuiz.get(quiz.id) ?? 0)
  }

  const today = toDayKey(new Date())
  const controles = rowsToControles(controleRows ?? [], sessionRows ?? [])

  const plan = pickMission({
    today,
    controles,
    subjectNameBySlug: Object.fromEntries(allSubjects.map((s) => [s.slug, s.name])),
    chapters: candidates,
    goalMinutes,
  })

  // --- Matières du sélecteur : celles que Marcel sait coacher, en tête --------
  const avecChapitres = new Set(candidates.map((c) => c.subjectSlug))
  const matieres: MatiereSuivie[] = followed
    .filter((s) => avecChapitres.has(s.slug) || hasRegime(s.slug))
    .map((s) => ({
      slug: s.slug,
      name: s.name,
      color: s.color,
      regime: regimeOf(s.slug),
    }))
    // Les matières hors doctrine passent en queue : Marcel n'a rien à en dire,
    // elles ne doivent pas occuper la première case du sélecteur.
    .sort((a, b) => Number(b.regime !== null) - Number(a.regime !== null))

  return {
    point: pointDuJour({
      plan,
      // La file « À revoir » du carnet demande à elle seule une demi-douzaine de
      // requêtes ; elle n'entre pas dans la décision, seulement dans une
      // étiquette. Elle sera branchée quand l'écran « S'entraîner » la chargera
      // déjà — d'ici là Marcel n'affiche pas un chiffre qu'il n'a pas lu.
      srsDue: 0,
      streak,
      hasHistory,
      goalMinutes,
    }),
    matieres,
    streak,
    grade,
    catalogueVide: candidates.length === 0,
    disponiblesBySlug,
    couverture: couvertureFor(chapitresCouverts),
    chapitresCouverts,
    slugsExamen,
    oral,
    demande: {
      tier: (profile?.subscription_tier as Tier) ?? 'free',
      utilisesAujourdhui: Number(coachCalls?.attempts ?? 0),
      depensesMois: Number(coachCredits?.depenses ?? 0),
      jetons: Number(coachTokens?.balance ?? 0),
      gemmes: Number(profile?.gems ?? 0),
    },
  }
}
