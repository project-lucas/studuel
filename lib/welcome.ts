import type { Subject } from '@/lib/types'
import { GRADE_LEVELS } from '@/lib/types'
import { GRADE_SHORT_LABELS } from '@/lib/grades'
import { isPortraitKey, type PortraitKey } from '@/lib/portraits'

// Parcours d'accueil « façon Duolingo » (page /bienvenue) — direction fidèle au
// design handoff Studuel : 14 écrans, on qualifie l'élève, on l'accroche avec
// le duel, puis on lui livre un plan perso. Le parcours vit AVANT la création de
// compte : on stocke les réponses en local, puis on les applique à l'inscription
// (metadata → trigger handle_new_user). Toute la logique testable vit ici ; les
// composants ne font qu'afficher et orchestrer.

export type ProfileType = 'eleve' | 'parent'

export type Source =
  | 'tiktok'
  | 'instagram'
  | 'youtube'
  | 'ami'
  | 'app_store'
  | 'autre'

// Objectif n°1 de l'élève (écran 5) — sert à personnaliser le plan final.
export type Goal = 'controles' | 'moyenne' | 'examen' | 'avance' | 'defi'

// Objectif quotidien exprimé en minutes (écran 8), façon Duolingo.
export type DailyGoalMinutes = 3 | 10 | 15 | 30

export type PlacementLevel = 'debutant' | 'intermediaire' | 'avance'

// Résultat du test de placement (écran 10) — null tant qu'il n'a pas été fait
// ou s'il a été sauté (« Je débute, passer »).
export type PlacementResult = {
  correct: number
  total: number
  level: PlacementLevel
} | null

export type OnboardingAnswers = {
  profileType: ProfileType | null
  source: Source | null
  goal: Goal | null
  grade: string | null
  subjects: string[]
  dailyGoalMinutes: DailyGoalMinutes
  placement: PlacementResult
  friendsInvited: boolean
  notificationsEnabled: boolean
  // École = clan (choisie à l'écran « ton établissement »). Appliquée APRÈS la
  // création du compte (l'onboarding est pré-auth), d'où le stockage en brouillon.
  schoolName: string | null
  schoolCity: string | null
  // Le blason de joueur choisi à l'écran « Ton avatar » (lib/portraits). Il
  // part dans le metadata d'inscription (→ profiles.avatar par le trigger,
  // migration 361) ou dans applyOnboarding au retour OAuth.
  avatar: PortraitKey | null
}

export const EMPTY_ANSWERS: OnboardingAnswers = {
  profileType: null,
  source: null,
  goal: null,
  grade: null,
  subjects: [],
  dailyGoalMinutes: 10,
  placement: null,
  friendsInvited: false,
  notificationsEnabled: false,
  schoolName: null,
  schoolCity: null,
  avatar: null,
}

// Ordre des écrans (numérotation du design handoff en commentaire).
export const WELCOME_STEPS = [
  'intro', //           1. Bienvenue (splash + logo)
  'profil', //          2. Parent ou élève
  'parentIntro', //     2bis. Ce que le parent va trouver (parcours parent — ajouté le 22/09/2026)
  'motivation', //      3. Motivation (le crayon te parle)
  'source', //          4. Comment tu nous as connu ?
  'goal', //            5. Objectif n°1
  'grade', //           6. Ta classe
  'school', //          6bis. Ton établissement = ton clan
  'subjects', //        7. Matières (choix multiple)
  'dailyGoal', //       8. Objectif quotidien (minutes)
  'placementIntro', //  9. Placement — intro
  'placementQuiz', //  10. Mini-quiz de placement
  'placementResult', // 10ter. Le résultat du placement (ajouté le 22/09/2026)
  'avatar', //         10bis. Ton avatar (blason de joueur — ajouté le 16/09/2026)
  'friends', //        11. Défie tes amis
  'notifications', //  12. Notifications
  'signup', //         13. Créer un compte
  'plan', //           14. Plan personnalisé (récap)
] as const

export type WelcomeStep = (typeof WELCOME_STEPS)[number]

export function isWelcomeStep(value: unknown): value is WelcomeStep {
  return (
    typeof value === 'string' &&
    (WELCOME_STEPS as readonly string[]).includes(value)
  )
}

// Progression de la barre par écran (valeurs du design). La barre n'apparaît
// pas sur l'accueil, le profil, la motivation ni le plan final (null).
// Recalé sur le NOUVEL ordre (cf. FAST_PATH plus bas) : la barre doit refléter
// le chemin réellement parcouru, sinon elle ment. Elle avance vite jusqu'au jeu
// — c'est la promesse « on y est presque » qui fait franchir les trois écrans.
const STEP_PROGRESS: Partial<Record<WelcomeStep, number>> = {
  grade: 0.2,
  placementIntro: 0.3,
  placementQuiz: 0.4,
  placementResult: 0.44,
  avatar: 0.48,
  signup: 0.55,
  goal: 0.7,
  dailyGoal: 0.8,
  school: 0.88,
  notifications: 0.94,
  // Le parcours PARENT n'a que deux écrans après le profil : la barre y fait
  // la moitié du chemin à l'intro, et rejoint le compte.
  parentIntro: 0.3,
  // Écrans hors chemin par défaut : gardés pour qu'un brouillon repris affiche
  // toujours une barre cohérente.
  source: 0.6,
  subjects: 0.75,
  friends: 0.9,
}

export function stepProgress(step: WelcomeStep): number | null {
  return STEP_PROGRESS[step] ?? null
}

// --- Ordre du parcours : « jouer d'abord, questionner ensuite » --------------
//
// Les écrans ci-dessus décrivent le design complet. L'ORDRE dans lequel on
// les enchaîne, lui, est une décision produit — et c'est elle qu'on a changée.
//
// Le parcours d'origine posait DOUZE écrans de questions avant que l'élève ne
// touche à une seule question de son programme. Or l'écran qui vend l'app n'est
// aucun de ces douze : c'est le mini-quiz. Chaque écran placé avant lui est un
// péage devant la démonstration.
//
// Nouvel ordre : le strict nécessaire (qui es-tu, quelle classe) puis LE JEU,
// et tout le reste APRÈS la création du compte — quand l'élève est investi et
// qu'un abandon ne coûte plus l'acquisition.
//
// Rien n'est supprimé : les écrans écartés du chemin par défaut existent
// toujours (composants et logique intacts). Les remettre = les rajouter ici.
// Ce qui n'est pas demandé prend une valeur par défaut saine — les matières
// découlent déjà de la classe (defaultSelectedForGrade), l'objectif quotidien a
// son défaut.

/** Les écrans posés AVANT le premier jeu. Toute addition ici se paie en
 *  abandons : n'y mettre que ce sans quoi le jeu ne peut pas démarrer. */
export const STEPS_BEFORE_PLAY: readonly WelcomeStep[] = [
  'intro', // le splash, un tap
  'profil', // parent ou élève : la seule vraie bifurcation du produit
  'grade', // sans la classe, impossible de servir le bon programme
]

/** Le chemin par défaut, dans l'ordre. */
export const FAST_PATH: readonly WelcomeStep[] = [
  ...STEPS_BEFORE_PLAY,
  'placementIntro', // → le jeu
  'placementQuiz', // ← LA démonstration
  // LE RÉSULTAT, tout de suite après le jeu. Le quiz est le sommet émotionnel
  // du parcours ; l'enchaîner sans un mot sur l'écran de l'avatar, c'est
  // gâcher le moment où l'élève vient de prouver quelque chose. Un score, un
  // niveau, une phrase — et la promesse que le plan en tient compte. Sauté
  // avec le quiz : « Je débute, passer » ne montre pas un résultat vide.
  'placementResult',
  // Le blason de joueur, JUSTE AVANT le compte : l'élève vient de jouer, il se
  // choisit un visage — et c'est ce visage qu'on lui demande d'enregistrer à
  // l'écran suivant. Avant le compte et non après, pour que le choix parte
  // dans le metadata d'inscription : le chemin « confirme ton e-mail » n'a
  // aucune session pour l'écrire plus tard.
  'avatar',
  'signup', // on demande le compte une fois la valeur montrée
  'goal', // à partir d'ici : du confort, plus de l'acquisition
  'dailyGoal',
  'school', // ton établissement = ton clan (cf. lib/clan-week)
  'notifications',
  'plan',
]

/**
 * Le chemin du PARENT. Il n'a ni classe, ni quiz, ni plan : il va au compte —
 * mais pas sans savoir ce qu'il va y trouver. L'écran `parentIntro` dit les
 * trois choses que l'espace parents lui donnera et COMMENT on lie l'enfant
 * (le code de l'onglet Amis) : sans lui, le parent créait un compte pour
 * tomber sur « Aucun enfant lié » et un champ de code dont il ignorait tout.
 */
export const PARENT_PATH: readonly WelcomeStep[] = [
  'intro',
  'profil',
  'parentIntro',
  'signup',
]

/** Écrans conservés dans le code mais retirés du chemin par défaut :
 *  `motivation` (pur habillage), `source` (attribution marketing),
 *  `subjects` (déduit de la classe), `friends` (le clan le remplace). */
export const OFF_PATH: readonly WelcomeStep[] = [
  'motivation',
  'source',
  'subjects',
  'friends',
]

/**
 * L'écran suivant, ou null à la fin du parcours.
 *
 * Le parcours PARENT court-circuite tout ce qui est élève : un parent n'a ni
 * classe, ni objectif quotidien, ni quiz de placement. Il passe par son écran
 * de présentation, puis va droit au compte.
 */
export function nextStep(
  step: WelcomeStep,
  answers: OnboardingAnswers,
): WelcomeStep | null {
  if (answers.profileType === 'parent') {
    const i = PARENT_PATH.indexOf(step)
    // Un parent qui arrive au compte a fini : la suite est l'espace parents.
    if (step === 'signup') return null
    // Hors du chemin parent (brouillon élève repris puis « je suis parent ») :
    // on rejoint le chemin à sa présentation.
    if (i === -1) return 'parentIntro'
    return i + 1 < PARENT_PATH.length ? PARENT_PATH[i + 1] : null
  }

  const i = FAST_PATH.indexOf(step)
  // Un écran hors chemin (remis à la main, ou repris d'un brouillon plus
  // ancien) ne bloque pas : on rejoint le chemin au compte.
  if (i === -1) return 'signup'
  return i + 1 < FAST_PATH.length ? FAST_PATH[i + 1] : null
}

/** Combien d'écrans séparent l'ouverture de l'app du premier jeu. Sert de
 *  garde-fou testé : cette valeur ne doit pas remonter sans décision explicite. */
export function screensBeforePlay(): number {
  return STEPS_BEFORE_PLAY.length
}

// --- Reprise d'un parcours interrompu ----------------------------------------
//
// Le brouillon des RÉPONSES survivait déjà à un rechargement ; l'ÉCRAN, non :
// l'élève qui revenait (onglet fermé, appel, app passée en arrière-plan sur
// mobile) repartait de l'intro et retraversait ses écrans déjà remplis.
// On mémorise donc aussi l'écran courant, et on y revient — mais seulement
// AVANT le compte : après, l'élève est connecté et la page le renvoie dans
// l'app (le confort restant prend ses valeurs par défaut).

export const STORAGE_STEP_KEY = 'studuel:onboarding:etape'

/** Les écrans où un parcours peut REPRENDRE, et vers quel écran. */
const RESUME_TARGET: Partial<Record<WelcomeStep, WelcomeStep>> = {
  grade: 'grade',
  placementIntro: 'placementIntro',
  // Les questions du quiz ne sont pas mémorisées : on repart de son intro,
  // un tap plus tôt, plutôt que sur un quiz sans questions.
  placementQuiz: 'placementIntro',
  placementResult: 'placementResult',
  avatar: 'avatar',
  signup: 'signup',
  parentIntro: 'parentIntro',
}

/**
 * Où reprendre un brouillon, ou null pour repartir de l'intro.
 *
 * On ne reprend jamais plus loin que ce que les réponses permettent : un
 * écran mémorisé à « avatar » sans classe dans le brouillon (brouillon
 * effacé, ou réponses invalides) ramènerait sur un parcours incohérent — on
 * recule alors jusqu'au premier écran dont la réponse manque.
 */
export function resumeStep(
  savedStep: unknown,
  answers: OnboardingAnswers,
): WelcomeStep | null {
  if (!isWelcomeStep(savedStep)) return null
  const target = RESUME_TARGET[savedStep]
  if (!target) return null
  if (answers.profileType === null) return null

  if (answers.profileType === 'parent') {
    return target === 'parentIntro' || target === 'signup' ? target : 'parentIntro'
  }

  if (target === 'parentIntro') return null
  if (answers.grade === null) return 'grade'
  // Le résultat n'a de sens que si le quiz a été FAIT (pas sauté, pas vide).
  if (target === 'placementResult' && !answers.placement?.total) {
    return 'placementIntro'
  }
  return target
}

/** Le chemin parcouru pour arriver à `step`, pour reconstruire l'historique du
 *  bouton « retour » après une reprise. */
export function pathTo(step: WelcomeStep, answers: OnboardingAnswers): WelcomeStep[] {
  const path = answers.profileType === 'parent' ? PARENT_PATH : FAST_PATH
  const i = path.indexOf(step)
  return i <= 0 ? [] : [...path.slice(0, i)]
}

// --- Catalogues d'options ---------------------------------------------------

export const SOURCES: { value: Source; label: string }[] = [
  { value: 'tiktok', label: 'TikTok' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'ami', label: 'Un ami / la famille' },
  { value: 'app_store', label: 'App Store' },
  { value: 'autre', label: 'Autre' },
]

export const GOALS: { value: Goal; label: string }[] = [
  { value: 'controles', label: 'Réussir mes contrôles' },
  { value: 'moyenne', label: 'Remonter ma moyenne' },
  { value: 'examen', label: 'Préparer le brevet / le bac' },
  { value: 'avance', label: "Prendre de l'avance" },
  { value: 'defi', label: 'Défier mes amis' },
]

// Titre du plan final (écran 14), personnalisé selon l'objectif n°1.
export const GOAL_HEADLINE: Record<Goal, string> = {
  controles: 'Objectif : cartonner tes contrôles 🎯',
  moyenne: 'Objectif : remonter ta moyenne 🚀',
  examen: 'Objectif : décrocher ton examen 🏆',
  avance: "Objectif : prendre de l'avance ⚡",
  defi: 'Objectif : dominer tes duels 🔥',
}

// La PREMIÈRE MISSION du plan (écran 14) : un geste concret, pas une promesse.
// Un plan qui dit « Studuel s'occupe du reste » laisse l'élève devant cinq
// onglets ; un plan qui dit « déclare ton contrôle » lui met le doigt sur le
// bon bouton. La mission découle de l'objectif, et elle est là où le bouton
// « Commencer » l'emmène (cf. destinationApresPlan).
export type PremiereMission = {
  titre: string
  detail: string
  /** L'écran de l'app où cette mission se joue. */
  destination: '/defi' | '/reviser'
}

const MISSION_PAR_OBJECTIF: Record<Goal, PremiereMission> = {
  controles: {
    titre: 'Déclare ton prochain contrôle',
    detail: 'Studuel te découpe les révisions jour par jour, jusqu’au jour J.',
    destination: '/reviser',
  },
  moyenne: {
    titre: 'Lance ton premier duel',
    detail: 'Une course de 90 secondes sur ton programme, contre un élève de ta classe.',
    destination: '/defi',
  },
  examen: {
    titre: 'Ouvre ton programme',
    detail: 'Chaque chapitre a son cours, sa fiche et son quiz : coche-les un à un.',
    destination: '/reviser',
  },
  avance: {
    titre: 'Ouvre ton programme',
    detail: 'Prends le chapitre suivant avant la classe — il t’attend déjà.',
    destination: '/reviser',
  },
  defi: {
    titre: 'Lance ton premier duel',
    detail: 'Gagne tes premiers trophées et entre au classement de ton école.',
    destination: '/defi',
  },
}

const MISSION_PAR_DEFAUT: PremiereMission = MISSION_PAR_OBJECTIF.moyenne

export function premiereMission(answers: OnboardingAnswers): PremiereMission {
  return answers.goal ? MISSION_PAR_OBJECTIF[answers.goal] : MISSION_PAR_DEFAUT
}

/** Où le bouton « Commencer » du plan emmène. Un parent va à son espace ; un
 *  élève va là où se joue sa première mission. */
export function destinationApresPlan(answers: OnboardingAnswers): string {
  if (answers.profileType === 'parent') return '/parents'
  return premiereMission(answers).destination
}

export const DAILY_GOALS: {
  minutes: DailyGoalMinutes
  label: string
  hint: string
}[] = [
  { minutes: 3, label: 'Détente', hint: '3 min / jour' },
  { minutes: 10, label: 'Régulier', hint: '10 min / jour' },
  { minutes: 15, label: 'Sérieux', hint: '15 min / jour' },
  { minutes: 30, label: 'Intense', hint: '30 min / jour' },
]

const DAILY_GOAL_MINUTES: DailyGoalMinutes[] = [3, 10, 15, 30]

export function isDailyGoalMinutes(n: unknown): n is DailyGoalMinutes {
  return typeof n === 'number' && DAILY_GOAL_MINUTES.includes(n as DailyGoalMinutes)
}

// Étiquettes d'affichage des classes (exposants du design). Elles vivent
// désormais dans lib/grades, avec la liste des classes qu'elles nomment — deux
// listes séparées, c'est une classe ajoutée d'un côté et pas de l'autre.
export const GRADE_LABELS: Record<string, string> = GRADE_SHORT_LABELS

// --- Conversions & scoring --------------------------------------------------

// La colonne legacy `profiles.daily_goal` est en sessions/jour (utilisée par la
// capacité, la série, etc.). On dérive les sessions depuis les minutes choisies
// pour ne rien casser : minutes = source de vérité de l'onboarding.
export function minutesToSessions(minutes: DailyGoalMinutes): number {
  if (minutes >= 30) return 3
  if (minutes >= 15) return 2
  return 1
}

// Niveau de placement à partir du score du mini-quiz. Sauté / vide → débutant.
export function placementLevel(correct: number, total: number): PlacementLevel {
  if (total <= 0) return 'debutant'
  const ratio = correct / total
  if (ratio >= 0.8) return 'avance'
  if (ratio >= 0.4) return 'intermediaire'
  return 'debutant'
}

export function makePlacement(correct: number, total: number): PlacementResult {
  const safeTotal = Math.max(0, total)
  const safeCorrect = Math.max(0, Math.min(correct, safeTotal))
  return {
    correct: safeCorrect,
    total: safeTotal,
    level: placementLevel(safeCorrect, safeTotal),
  }
}

// --- Le résultat du placement (écran 10ter) ---------------------------------

export const PLACEMENT_LEVEL_LABEL: Record<PlacementLevel, string> = {
  debutant: 'Débutant',
  intermediaire: 'Intermédiaire',
  avance: 'Avancé',
}

export type PlacementFeedback = {
  /** « 4 / 5 » */
  score: string
  level: PlacementLevel
  levelLabel: string
  /** Le titre de l'écran — une réaction, pas un verdict. */
  titre: string
  /** Ce que le score change au plan. */
  phrase: string
  /** Vrai quand ça mérite des confettis. */
  celebration: boolean
}

// Un placement n'est jamais une mauvaise nouvelle : l'écran l'a promis
// (« aucune mauvaise réponse ») et il tient parole. Le score bas dit « on part
// des bases » — ce qui est exactement ce que fait le plan. Le score haut
// est fêté : c'est la seule chose que l'élève vient de gagner, et la première.
export function placementFeedback(placement: PlacementResult): PlacementFeedback | null {
  if (!placement || placement.total <= 0) return null
  const { correct, total, level } = placement
  const levelLabel = PLACEMENT_LEVEL_LABEL[level]
  if (level === 'avance') {
    return {
      score: `${correct} / ${total}`,
      level,
      levelLabel,
      titre: correct === total ? 'Sans faute !' : 'Très solide !',
      phrase:
        'Tu maîtrises déjà l’essentiel : ton plan ira droit aux chapitres qui font la différence.',
      celebration: true,
    }
  }
  if (level === 'intermediaire') {
    return {
      score: `${correct} / ${total}`,
      level,
      levelLabel,
      titre: 'Bonne base !',
      phrase:
        'Tu as les fondations : ton plan alterne rappels rapides et nouveaux chapitres.',
      celebration: false,
    }
  }
  return {
    score: `${correct} / ${total}`,
    level,
    levelLabel,
    titre: 'On part des bases',
    phrase:
      'C’est le meilleur point de départ : ton plan commence par les notions clés, une par une.',
    celebration: false,
  }
}

// --- Matières ---------------------------------------------------------------

// Matières proposées pour un niveau donné.
export function subjectsForGrade(
  subjects: Subject[],
  grade: string | null,
): Subject[] {
  if (!grade) return []
  return subjects.filter((s) => s.levels.includes(grade))
}

// Nouvelle classe → tout coché par défaut (l'élève décoche ses options).
export function defaultSelectedForGrade(
  subjects: Subject[],
  grade: string,
): string[] {
  return subjectsForGrade(subjects, grade).map((s) => s.slug)
}

// La ligne de réassurance sous la grille des classes (« 8 matières · tout le
// programme de 4e »). Elle transforme un choix administratif en promesse :
// l'élève voit, avant même de continuer, que sa classe est couverte.
export function gradeReassurance(
  subjects: Subject[],
  grade: string | null,
): string | null {
  if (!grade) return null
  const n = subjectsForGrade(subjects, grade).length
  if (n === 0) return null
  const label = GRADE_SHORT_LABELS[grade as keyof typeof GRADE_SHORT_LABELS] ?? grade
  return `${n} matière${n > 1 ? 's' : ''} · tout le programme de ${label}`
}

// --- Validation d'avancement ------------------------------------------------

// L'écran en cours autorise-t-il le bouton primaire « Continuer » ? Ne concerne
// que les écrans à bouton standard (profil, source, goal, grade, subjects,
// dailyGoal). Les autres écrans ont leurs propres boutons → true.
export function canAdvance(
  step: WelcomeStep,
  answers: OnboardingAnswers,
): boolean {
  switch (step) {
    case 'profil':
      return answers.profileType !== null
    case 'source':
      return answers.source !== null
    case 'goal':
      return answers.goal !== null
    case 'grade':
      return answers.grade !== null
    case 'subjects':
      return answers.subjects.length > 0
    case 'dailyGoal':
      return isDailyGoalMinutes(answers.dailyGoalMinutes)
    case 'avatar':
      return answers.avatar !== null
    default:
      return true
  }
}

// --- Persistance locale (reprise du parcours après un rafraîchissement) -----

export const STORAGE_KEY = 'studuel:onboarding'

export function serializeAnswers(answers: OnboardingAnswers): string {
  return JSON.stringify(answers)
}

// Relit prudemment le brouillon : toute valeur douteuse retombe sur le défaut.
export function parseAnswers(raw: string | null): OnboardingAnswers {
  if (!raw) return { ...EMPTY_ANSWERS }
  let data: unknown
  try {
    data = JSON.parse(raw)
  } catch {
    return { ...EMPTY_ANSWERS }
  }
  if (typeof data !== 'object' || data === null) return { ...EMPTY_ANSWERS }
  const d = data as Record<string, unknown>

  const profileType =
    d.profileType === 'eleve' || d.profileType === 'parent'
      ? d.profileType
      : null
  const source = SOURCES.some((s) => s.value === d.source)
    ? (d.source as Source)
    : null
  const goal = GOALS.some((g) => g.value === d.goal) ? (d.goal as Goal) : null
  const grade =
    typeof d.grade === 'string' &&
    (GRADE_LEVELS as readonly string[]).includes(d.grade)
      ? d.grade
      : null
  const subjects = Array.isArray(d.subjects)
    ? d.subjects.filter(
        (s): s is string =>
          typeof s === 'string' && s.length > 0 && s.length < 64,
      )
    : []
  const dailyGoalMinutes = isDailyGoalMinutes(d.dailyGoalMinutes)
    ? d.dailyGoalMinutes
    : 10
  const placement = readPlacement(d.placement)
  const friendsInvited = d.friendsInvited === true
  const notificationsEnabled = d.notificationsEnabled === true
  const schoolName =
    typeof d.schoolName === 'string' && d.schoolName.trim().length > 0
      ? d.schoolName.trim().slice(0, 120)
      : null
  const schoolCity =
    typeof d.schoolCity === 'string' && d.schoolCity.trim().length > 0
      ? d.schoolCity.trim().slice(0, 80)
      : null
  const avatar = isPortraitKey(d.avatar) ? d.avatar : null

  return {
    profileType,
    source,
    goal,
    grade,
    subjects,
    dailyGoalMinutes,
    placement,
    friendsInvited,
    notificationsEnabled,
    schoolName,
    schoolCity,
    avatar,
  }
}

function readPlacement(value: unknown): PlacementResult {
  if (typeof value !== 'object' || value === null) return null
  const p = value as Record<string, unknown>
  if (typeof p.correct !== 'number' || typeof p.total !== 'number') return null
  return makePlacement(p.correct, p.total)
}
