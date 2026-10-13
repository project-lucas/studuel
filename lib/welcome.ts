import type { Subject } from '@/lib/types'
import { GRADE_LEVELS } from '@/lib/types'
import { programmeDeClasse } from '@/lib/programme-classes'
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
  // « J'ai un code » (13/10/2026) : le code d'un groupe de coach saisi sur
  // l'intro, et le nom du groupe que l'aperçu a rendu — pour le redire sur les
  // écrans suivants. Le rattachement lui-même passe par un cookie réclamé à
  // l'ouverture de la session (lib/coach-claim.ts), comme le parrainage.
  coachCode: string | null
  coachGroupe: string | null
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
  coachCode: null,
  coachGroupe: null,
}

// Ordre des écrans (numérotation du design handoff en commentaire).
export const WELCOME_STEPS = [
  'intro', //           1. Bienvenue (l'académie plein écran)
  'tuto', //            1bis. Le tuto : trois diapos illustrées (ajouté le 13/10/2026)
  'profil', //          2. Parent ou élève (hors chemin depuis le 13/10/2026 : « Je suis parent » est un lien de l'accueil)
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
  // LE CHEMIN SANS QUESTION (13/10/2026) : classe, avatar, rythme, compte.
  grade: 0.25,
  avatar: 0.5,
  dailyGoal: 0.75,
  signup: 0.92,
  // Le parcours PARENT n'a qu'un écran avant le compte : la barre y fait la
  // moitié du chemin à l'intro, et rejoint le compte.
  parentIntro: 0.5,
  // Écrans hors chemin par défaut : gardés pour qu'un brouillon repris affiche
  // toujours une barre cohérente.
  placementIntro: 0.3,
  placementQuiz: 0.4,
  placementResult: 0.44,
  goal: 0.7,
  school: 0.88,
  notifications: 0.94,
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

// LE CHEMIN SANS QUESTION (13/10/2026, Lucas : « pas de question pendant
// l'onboarding, ça représente une friction ; on fait au plus simple, mais on
// améliore le design, l'app doit montrer qu'elle promet de belles choses ; il
// doit y avoir le choix de l'avatar et le rythme par jour ; un tuto de bien
// meilleure qualité »). L'accueil est l'académie plein écran, le tuto trois
// diapos illustrées ; puis UN choix administratif (la classe, sans lequel il
// n'y a pas de programme), l'avatar, le rythme, le compte, et la bienvenue.
// Le quiz de placement, l'objectif, l'école, les notifications et le profil
// parent/élève ont quitté le chemin (les composants existent toujours ; le
// parent entre par un lien de l'accueil).

/** Les écrans posés AVANT le premier choix de l'élève (son avatar) : rien
 *  d'autre que ce qui montre l'app et ce sans quoi il n'y a pas de programme. */
export const STEPS_BEFORE_PLAY: readonly WelcomeStep[] = [
  'intro', // l'académie, un tap
  'tuto', // ce que l'app promet, en trois diapos (« Passer » possible)
  'grade', // sans la classe, impossible de servir le bon programme
]

/** Le chemin par défaut, dans l'ordre. */
export const FAST_PATH: readonly WelcomeStep[] = [
  ...STEPS_BEFORE_PLAY,
  // Le blason de joueur, AVANT le compte : c'est ce visage qu'on lui demande
  // d'enregistrer à l'écran suivant, et il part dans le metadata d'inscription
  // (le chemin « confirme ton e-mail » n'a aucune session pour l'écrire après).
  'avatar',
  'dailyGoal', // le rythme : un tap, et on avance
  'signup', // on demande le compte une fois la valeur montrée
  'plan', // « Bienvenue à l'académie », la première mission
]

/**
 * Le chemin du PARENT. Il n'a ni classe, ni avatar, ni plan : il va au compte —
 * mais pas sans savoir ce qu'il va y trouver. L'écran `parentIntro` dit les
 * trois choses que l'espace parents lui donnera et COMMENT on lie l'enfant
 * (le code de l'onglet Amis) : sans lui, le parent créait un compte pour
 * tomber sur « Aucun enfant lié » et un champ de code dont il ignorait tout.
 * Il y entre par le lien « Je suis parent » de l'accueil (plus d'écran profil).
 */
export const PARENT_PATH: readonly WelcomeStep[] = [
  'intro',
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
  // Sortis du chemin le 13/10/2026 (« pas de question pendant l'onboarding »).
  'profil',
  'placementIntro',
  'placementQuiz',
  'placementResult',
  'goal',
  'school',
  'notifications',
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
  avatar: 'avatar',
  dailyGoal: 'dailyGoal',
  signup: 'signup',
  parentIntro: 'parentIntro',
  // Un brouillon d'avant le 13/10/2026 arrêté sur le quiz de placement
  // reprend à la classe : le quiz n'est plus sur le chemin.
  placementIntro: 'grade',
  placementQuiz: 'grade',
  placementResult: 'grade',
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

// Les quatre rythmes de l'écran « objectif quotidien ». Chacun a SA flamme
// (la mascotte de la série, qui grandit avec l'effort) et SA phrase, dite par
// la flamme dans une bulle : on ne choisit pas un nombre de minutes, on
// choisit à quoi ressemblera sa semaine. Un seul rythme est conseillé.
export const DAILY_GOALS: {
  minutes: DailyGoalMinutes
  label: string
  hint: string
  flamme: string
  pitch: string
  conseille?: boolean
}[] = [
  {
    minutes: 3,
    label: 'Détente',
    hint: '3 min / jour',
    flamme: '/images/mascotte/flamme-1-etincelle.webp',
    pitch: 'Une partie dans le bus, et ta série reste allumée.',
  },
  {
    minutes: 10,
    label: 'Régulier',
    hint: '10 min / jour',
    flamme: '/images/mascotte/flamme-2-vive.webp',
    pitch: 'Assez pour progresser, assez court pour tenir. Le bon rythme !',
    conseille: true,
  },
  {
    minutes: 15,
    label: 'Sérieux',
    hint: '15 min / jour',
    flamme: '/images/mascotte/flamme-3-rayonnante.webp',
    pitch: 'Un chapitre bouclé chaque semaine. Tes notes vont le sentir.',
  },
  {
    minutes: 30,
    label: 'Intense',
    hint: '30 min / jour',
    flamme: '/images/mascotte/flamme-4-brasier.webp',
    pitch: 'Mode examen. Parfait avant le brevet ou le bac.',
  },
]

/** L'objectif du jour tenu trente jours, en heures lisibles (« 7 h 30 »). */
export function heuresParMois(minutesParJour: number): string {
  const total = minutesParJour * 30
  const heures = Math.floor(total / 60)
  const minutes = total % 60
  return minutes === 0 ? `${heures} h` : `${heures} h ${minutes}`
}

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

// Les matières d'une classe, en deux sections : celles que l'élève a
// forcément (cochées d'office) et celles qui dépendent de ses choix —
// deuxième langue, spécialités, options (proposées, décochées). Une matière
// n'apparaît que si le programme officiel de la classe la prévoit
// (lib/programme-classes) ET que l'app a du contenu à ce niveau
// (`levels`). La culture générale n'est jamais proposée : elle se débloque
// plus tard dans l'app.
export function sectionsMatieres(
  subjects: Subject[],
  grade: string | null,
): { obligatoires: Subject[]; aChoisir: Subject[] } {
  const programme = programmeDeClasse(grade)
  if (!grade || !programme) return { obligatoires: [], aChoisir: [] }
  const duNiveau = subjects.filter(
    (s) => s.category !== 'culture' && s.levels.includes(grade),
  )
  return {
    obligatoires: duNiveau.filter((s) => programme.obligatoires.includes(s.slug)),
    // Dans l'ordre du programme : les spécialités d'abord, puis langues et
    // options — et non l'ordre alphabétique, qui mêlait Allemand et Maths.
    aChoisir: duNiveau
      .filter((s) => programme.aChoisir.includes(s.slug))
      .sort(
        (a, b) =>
          programme.aChoisir.indexOf(a.slug) - programme.aChoisir.indexOf(b.slug),
      ),
  }
}

// Matières proposées pour un niveau donné (obligatoires puis à choisir, dans
// l'ordre du catalogue).
export function subjectsForGrade(
  subjects: Subject[],
  grade: string | null,
): Subject[] {
  const { obligatoires, aChoisir } = sectionsMatieres(subjects, grade)
  const proposees = new Set([...obligatoires, ...aChoisir])
  return subjects.filter((s) => proposees.has(s))
}

// Nouvelle classe → seules les matières obligatoires sont cochées ; l'élève
// coche lui-même sa LV2, ses spécialités et ses options.
export function defaultSelectedForGrade(
  subjects: Subject[],
  grade: string,
): string[] {
  return sectionsMatieres(subjects, grade).obligatoires.map((s) => s.slug)
}

// Changement de classe : la sélection repart des obligatoires de la NOUVELLE
// classe, et ne garde des anciens choix que ceux qu'elle propose encore
// (une spécialité conservée de 1re en Tle, une LV2). Sans cela, un élève
// passé de 4e en Terminale gardait Technologie et Français, et n'avait ni
// Philosophie ni Grand oral.
export function selectionPourClasse(
  subjects: Subject[],
  grade: string,
  ancienne: readonly string[],
): string[] {
  const { obligatoires, aChoisir } = sectionsMatieres(subjects, grade)
  return [
    ...obligatoires.map((s) => s.slug),
    ...aChoisir.filter((s) => ancienne.includes(s.slug)).map((s) => s.slug),
  ]
}

// La ligne de réassurance sous la grille des classes (« 8 matières · tout le
// programme de 4e »). Elle transforme un choix administratif en promesse :
// l'élève voit, avant même de continuer, que sa classe est couverte.
export function gradeReassurance(
  subjects: Subject[],
  grade: string | null,
): string | null {
  if (!grade) return null
  const n = sectionsMatieres(subjects, grade).obligatoires.length
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
  const coachCode =
    typeof d.coachCode === 'string' && /^[A-Z0-9]{8}$/.test(d.coachCode) ? d.coachCode : null
  const coachGroupe =
    coachCode && typeof d.coachGroupe === 'string' && d.coachGroupe.trim().length > 0
      ? d.coachGroupe.trim().slice(0, 60)
      : null

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
    coachCode,
    coachGroupe,
  }
}

function readPlacement(value: unknown): PlacementResult {
  if (typeof value !== 'object' || value === null) return null
  const p = value as Record<string, unknown>
  if (typeof p.correct !== 'number' || typeof p.total !== 'number') return null
  return makePlacement(p.correct, p.total)
}
