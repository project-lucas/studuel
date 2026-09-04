// Logique pure du template générique de page matière (/reviser/[matiereSlug]).
// Tout ce que la page calcule à partir des données Supabase vit ici : statut et
// couronnes d'un chapitre, progression globale de la matière, libellés d'état
// des contenus. Aucune logique spécifique à une matière : ajouter une matière =
// ajouter des lignes en base, zéro code.

import { isExamYear } from '@/lib/annales'
import { LESSON_FLOOR } from '@/lib/mastery'
import type { ExamProximity } from '@/lib/next-exam'
import type { ModeQuestion } from '@/lib/defi-modes'
import type { TraqueCard } from '@/lib/traque'
import type { ExamPaper } from '@/lib/exam-papers'
import type { Standing } from '@/lib/percentile'

// ---------------------------------------------------------------------------
// Onglets de la page matière.
//
// DEUX OU TROIS onglets, pas sept. Les quatre onglets de format (Quiz,
// Flashcards, Cartes mentales, Défis) listaient les MÊMES chapitres quatre fois
// de suite : une matrice transposée, où l'élève scrollait quatre listes
// identiques pour changer d'exercice sur un chapitre. Ils fusionnent dans
// « Mode de jeu », où chaque chapitre porte ses formats en pastilles, et où le
// Boss (un panneau, pas une liste) prend la tête. « Annales » ne s'ajoute que
// les années à examen.

export type ModeKey = 'programme' | 'jeu' | 'annales'

/**
 * Pictogramme d'un onglet, désigné par son NOM (le composant fait la
 * correspondance avec l'icône) : `lib/` reste pur, sans JSX ni dépendance à une
 * bibliothèque d'icônes.
 */
export type ModeIcon = 'manette'

export type ModeTab = {
  key: ModeKey
  label: string
  icon?: ModeIcon
  /**
   * Discipline filtrée par cet onglet, quand la matière en réunit plusieurs
   * (« histoire » / « geographie »). `undefined` = l'onglet montre tout.
   */
  discipline?: string
}

// ---------------------------------------------------------------------------
// Les matières dont le dossier a PLUSIEURS RAYONS.
//
// « Histoire-Géo » n'est pas une matière, c'en est DEUX dans un seul dossier —
// deux cours, deux professeurs parfois, deux épreuves. Depuis que le programme
// est rangé (colonne `theme`), la page aligne 15 chapitres dont l'élève ne
// cherche jamais que la moitié. La colonne `chapters.discipline` (migration 247)
// permet de couper la liste : l'onglet « Programme » se dédouble en « Histoire »
// et « Géographie », et chacun ne montre que les siens.
//
// LE FRANÇAIS A ÉLARGI CETTE COLONNE, et c'est assumé : ses trois rayons ne sont
// pas trois disciplines mais trois USAGES du même dossier — le « programme »
// (les quatre objets d'étude et leurs œuvres au bac), les « fiches » (le rayon
// des fiches de lecture, plus de deux cent cinquante œuvres qu'on vient chercher
// une par une, jamais dans l'ordre) et la « grammaire » (les points de langue
// interrogés à l'oral). Le besoin est exactement le même que pour l'histoire-géo
// — couper une liste que personne ne parcourt en entier — et le mécanisme aussi,
// jusqu'au compte du header et au CTA « Reprendre » recalculés par rayon. Une
// colonne `section` en doublon de celle-ci n'aurait rien réglé de plus.
//
// Le nom affiché est ici, pas en base : la base stocke une clé stable et sans
// accent, l'app décide comment l'écrire à l'élève.

export const DISCIPLINE_LABELS: Record<string, string> = {
  histoire: 'Histoire',
  geographie: 'Géographie',
  programme: 'Programme',
  fiches: 'Fiches',
  grammaire: 'Grammaire',
}

export function disciplineLabel(discipline: string): string {
  return DISCIPLINE_LABELS[discipline] ?? discipline
}

/**
 * Les disciplines présentes dans une matière, DANS L'ORDRE DU PROGRAMME (celui
 * d'apparition des chapitres), sans doublon et sans les chapitres qui n'en
 * portent pas.
 *
 * Renvoie un tableau VIDE quand il n'y en a qu'une (ou aucune) : une seule
 * discipline ne se filtre pas, ce serait un onglet unique renommé.
 */
export function disciplinesOf(
  chapters: { discipline?: string | null }[],
): string[] {
  const found: string[] = []
  for (const chapter of chapters) {
    const discipline = chapter.discipline || null
    if (discipline && !found.includes(discipline)) found.push(discipline)
  }
  return found.length > 1 ? found : []
}

/**
 * L'identifiant d'un onglet, tel qu'il circule dans l'état du composant et
 * dans l'URL : « programme », « jeu », ou « programme:geographie ».
 *
 * Une clé seule ne suffit plus depuis que deux onglets peuvent partager la même
 * (les deux disciplines sont deux onglets « programme »).
 */
export function tabId(tab: { key: ModeKey; discipline?: string }): string {
  return tab.discipline ? `${tab.key}:${tab.discipline}` : tab.key
}

/**
 * Les onglets de la matière, selon la classe.
 *
 * « Annales » n'existe QUE pour les années qui finissent sur une épreuve
 * nationale (3e, 1re, Tle — cf. lib/annales) : proposer des sujets d'examen à
 * un 5e serait du bruit, et l'absence d'onglet dit mieux que n'importe quel
 * message que ce n'est pas son année.
 *
 * « Mes erreurs » n'est plus un onglet : la file de la matière se lance depuis
 * le bandeau « À revoir » en tête du programme, et le CHAPITRE porte ses
 * propres erreurs dans ses tuiles — là où on décide quoi travailler.
 */
export function modesFor(
  grade: string | null | undefined,
  disciplines: string[] = [],
): ModeTab[] {
  const tabs: ModeTab[] =
    disciplines.length > 1
      ? // Un dossier à plusieurs rayons n'a pas UNE liste : l'histoire-géo en a
        // deux (deux disciplines), le français trois (le programme, les fiches
        // de lecture, la grammaire). L'onglet « Programme » laisse donc place à
        // un onglet par rayon, dans l'ordre où les chapitres se présentent.
        disciplines.map((discipline) => ({
          key: 'programme' as const,
          label: disciplineLabel(discipline),
          discipline,
        }))
      : // « Programme » plutôt que « Chapitres » : c'est le mot de l'élève et
        // celui du BO — la liste ne dit pas un type d'objet, elle dit l'année
        // à couvrir.
        [{ key: 'programme', label: 'Programme' }]
  // La manette : c'est l'onglet qui se JOUE (boss, jeux de l'arène, défis).
  tabs.push({ key: 'jeu', label: 'Mode de jeu', icon: 'manette' })
  if (isExamYear(grade)) tabs.push({ key: 'annales', label: 'Annales' })
  return tabs
}

// Anciennes clés d'URL (`?onglet=boss`, `?onglet=quiz`… depuis la feuille Modes
// de jeu et les liens déjà partagés), les noms d'onglets d'avant le renommage,
// et « erreurs » qui n'a plus d'onglet : toutes restent valides et retombent
// sur l'onglet qui porte désormais leur contenu. Valeur inconnue — ou onglet
// absent pour cette classe — → undefined, c'est-à-dire Programme.
const LEGACY_MODE_ALIASES: Record<string, ModeKey> = {
  chapitres: 'programme',
  erreurs: 'programme',
  entrainement: 'jeu',
  quiz: 'jeu',
  flashcards: 'jeu',
  cartes: 'jeu',
  defis: 'jeu',
  boss: 'jeu',
}

/**
 * L'onglet à ouvrir d'après `?onglet=…`, rendu sous forme d'IDENTIFIANT
 * (« jeu », « programme:geographie »).
 *
 * Trois formes acceptées : l'identifiant complet, une clé seule (`programme`
 * sur une matière à deux disciplines ouvre la première d'entre elles), et les
 * anciennes clés de format déjà partagées dans des liens.
 * `undefined` = le premier onglet, c'est-à-dire le programme.
 */
export function modeFromParam(
  raw: string | undefined,
  modes: ModeTab[],
): string | undefined {
  if (!raw) return undefined
  // 1. l'identifiant complet, tel que la barre d'onglets l'écrit.
  const exact = modes.find((m) => tabId(m) === raw)
  if (exact) return tabId(exact)
  // 2. une clé seule : on ouvre le PREMIER onglet qui la porte — sur une
  //    matière à deux disciplines, `?onglet=programme` ouvre l'histoire.
  const key = (['programme', 'jeu', 'annales'] as ModeKey[]).includes(
    raw as ModeKey,
  )
    ? (raw as ModeKey)
    : LEGACY_MODE_ALIASES[raw]
  // Un onglet que cette classe n'a pas (annales en 4e) ne s'ouvre pas.
  const tab = key ? modes.find((m) => m.key === key) : undefined
  return tab ? tabId(tab) : undefined
}

// ---------------------------------------------------------------------------
// Avancement d'un chapitre.

export type ChapterStatus = 'non_commence' | 'en_cours' | 'complete'

// Au-delà de ce ratio (meilleur quiz), le chapitre est considéré complété —
// aligné sur la maîtrise plutôt que sur un 100 % décourageant.
export const COMPLETE_THRESHOLD = 0.8

// Paliers des trois couronnes (façon Clash Royale) : chaque seuil franchi
// allume une couronne, la troisième coïncide avec « complété ».
export const CROWN_THRESHOLDS = [LESSON_FLOOR, 0.6, COMPLETE_THRESHOLD] as const

export type ChapterActivity = {
  bestQuizRatio: number | null // meilleur score (0..1) parmi les quiz du chapitre
  lessonDone: boolean // au moins une leçon terminée
}

// Valeur d'avancement 0..1 d'un chapitre : meilleur quiz, avec le plancher
// LESSON_FLOOR dès qu'une leçon est terminée — même règle que lib/mastery.
export function chapterValue(activity: ChapterActivity): number {
  let value = activity.bestQuizRatio ?? 0
  if (activity.lessonDone) value = Math.max(value, LESSON_FLOOR)
  return Math.min(Math.max(value, 0), 1)
}

export function chapterStatus(value: number): ChapterStatus {
  if (value >= COMPLETE_THRESHOLD) return 'complete'
  if (value > 0) return 'en_cours'
  return 'non_commence'
}

// « Terminé » et non « Complété » : le second est un calque de l'anglais
// « completed », le premier est le mot français — et celui que la coche de la
// ligne dit déjà.
export const STATUS_LABELS: Record<ChapterStatus, string> = {
  non_commence: 'Non commencé',
  en_cours: 'En cours',
  complete: 'Terminé',
}

// Nombre de couronnes (0..3) allumées pour une valeur d'avancement donnée.
export function crowns(value: number): number {
  return CROWN_THRESHOLDS.filter((t) => value >= t).length
}

// ---------------------------------------------------------------------------
// Progression globale de la matière : « X/Y chapitres · Z% ».

export type SubjectProgress = {
  done: number // chapitres complétés
  total: number
  pct: number // moyenne des avancements, en %
}

export function subjectProgress(values: number[]): SubjectProgress {
  const total = values.length
  const done = values.filter((v) => chapterStatus(v) === 'complete').length
  const pct =
    total > 0
      ? Math.round((values.reduce((s, v) => s + v, 0) / total) * 100)
      : 0
  return { done, total, pct }
}

/**
 * L'avancement d'un CHAPITRE du programme (un groupe de fiches), avec la MÊME
 * règle que le header de la matière : la barre suit la moyenne des
 * avancements, le compte ne dit que les fiches terminées.
 *
 * La jauge d'un chapitre ne comptait que ses fiches à 80 % : sur un chapitre
 * de quatorze fiches, elle restait à zéro pendant des jours alors que celle du
 * header, en haut du même écran, bougeait au premier quiz. Deux jauges, deux
 * règles — l'élève ne pouvait pas savoir laquelle croire.
 */
export function chapterGroupProgress(
  rows: { value: number }[],
): SubjectProgress {
  return subjectProgress(rows.map((r) => r.value))
}

// ---------------------------------------------------------------------------
// Le chapitre où l'élève doit cliquer.
//
// Une liste de 28 chapitres sans point d'entrée est un mur : l'ancien CTA
// « Commencer » ne se posait QUE sur le chapitre 1 d'un élève 100 % neuf et
// disparaissait au premier quiz. Ici il y a toujours exactement UNE ligne mise
// en avant, tant qu'il reste quelque chose à faire.

export type ResumeCta = { chapterId: string; label: string }

export const RESUME_LABELS = {
  reprendre: 'Reprendre',
  commencer: 'Commencer',
} as const

/**
 * Le chapitre à reprendre : le premier commencé mais pas fini (« Reprendre »),
 * sinon le premier jamais ouvert (« Commencer »). Tout complété → aucun CTA,
 * la matière est finie et le mettre en avant serait mentir.
 */
export function resumeCta(
  chapters: { id: string; status: ChapterStatus }[],
): ResumeCta | null {
  const enCours = chapters.find((c) => c.status === 'en_cours')
  if (enCours) return { chapterId: enCours.id, label: RESUME_LABELS.reprendre }
  const neuf = chapters.find((c) => c.status === 'non_commence')
  if (neuf) return { chapterId: neuf.id, label: RESUME_LABELS.commencer }
  return null
}

// ---------------------------------------------------------------------------
// Durée d'un chapitre.
//
// « ~6 min » avant de cliquer : le premier levier d'engagement en révision
// mobile — l'élève doit savoir dans quoi il s'engage, pas le découvrir.

export const READING_WPM = 180 // lecture d'un cours, collège/lycée
export const SECONDS_PER_QUESTION = 30

/**
 * Durée estimée d'un chapitre, en minutes : le temps de lecture de ses cours
 * plus le temps de ses questions. `null` quand il n'y a rien à estimer — mieux
 * vaut pas de durée qu'une durée inventée.
 */
export function estimateMinutes(input: {
  words: number
  questions: number
}): number | null {
  if (input.words <= 0 && input.questions <= 0) return null
  const minutes =
    input.words / READING_WPM + (input.questions * SECONDS_PER_QUESTION) / 60
  return Math.max(1, Math.round(minutes))
}

export function minutesLabel(minutes: number): string {
  return `~${minutes} min`
}

/**
 * « de » + nom de matière, avec l'élision du français : « d’Anglais »,
 * « d’Histoire », mais « de Maths ». Le « h » compte comme une voyelle — les
 * matières qui commencent par un h (histoire, histoire-géo) sont toutes à h
 * muet.
 */
export function deLaMatiere(name: string): string {
  const voyelle = /^[aeiouyhàâäéèêëîïôöùûüœ]/i.test(name.trim())
  return voyelle ? `d’${name}` : `de ${name}`
}

// ---------------------------------------------------------------------------
// Le quiz d'un chapitre du programme.
//
// Les contrôles, au collège comme au lycée, tombent PAR CHAPITRE. Or le
// chapitre du programme n'était qu'un dossier : pour réviser « Le groupe
// nominal » d'un coup, il fallait enchaîner ses six quiz un par un, et
// l'examen blanc, lui, tire sur toute la matière. Le quiz du chapitre tire
// dans les questions de TOUTES ses fiches, en conditions d'examen blanc
// (chrono, bilan fiche par fiche à la fin).

/** En dessous, le chapitre n'a qu'une fiche : son quiz est déjà celui-là. */
export const CHAPTER_QUIZ_MIN_FICHES = 2

/** L'adresse du quiz d'un chapitre du programme (l'examen blanc, ciblé). */
export function chapterQuizHref(subjectSlug: string, theme: string): string {
  const params = new URLSearchParams({ subject: subjectSlug, chapitre: theme })
  return `/reviser/examen-blanc?${params.toString()}`
}

/** Un chapitre du programme mérite-t-il son quiz ? */
export function hasChapterQuiz(group: {
  theme: string | null
  chapters: unknown[]
}): boolean {
  return group.theme !== null && group.chapters.length >= CHAPTER_QUIZ_MIN_FICHES
}

/** Compte de mots d'un cours, tolérant au markdown et au contenu vide. */
export function countWords(content: string | null | undefined): number {
  if (!content) return 0
  const words = content.trim().split(/\s+/).filter(Boolean)
  return words.length
}

// ---------------------------------------------------------------------------
// Bandeau « Examen blanc ».
//
// Il était le PREMIER élément cliquable de la page, y compris pour un élève à
// 0 % : proposer l'épreuve finale à quelqu'un qui n'a pas ouvert un chapitre.
// Il ne monte en tête que lorsqu'il a du sens ; sinon il descend en pied de
// liste, où il reste trouvable sans détourner du chapitre à faire.

export const EXAM_BANNER_MIN_PCT = 30
export const EXAM_BANNER_EXAM_DAYS = 14

/**
 * Le bandeau mérite-t-il la tête de page ? Oui si l'élève a de quoi être évalué
 * (≥ 30 % de la matière), ou si un contrôle approche (≤ 14 jours) — auquel cas
 * l'examen blanc est exactement ce qu'il cherche.
 */
export function examBannerOnTop(
  pct: number,
  daysToExam: number | null,
): boolean {
  if (pct >= EXAM_BANNER_MIN_PCT) return true
  return daysToExam !== null && daysToExam <= EXAM_BANNER_EXAM_DAYS
}

// ---------------------------------------------------------------------------
// Vue-modèle passé du Server Component à l'UI (sérialisable).

export type ChapterExamHint = {
  label: string // « Contrôle dans 3 jours », « Contrôle demain »…
  proximity: ExamProximity
}

export type ChapterRow = {
  id: string
  position: number
  title: string
  status: ChapterStatus
  /**
   * Avancement 0..1 de la ligne (`chapterValue`). C'est lui que la jauge d'un
   * chapitre du programme moyenne — le statut seul ne suffit pas : une barre
   * ne se recompose pas depuis des « en cours ».
   */
  value: number
  crowns: number
  href: string
  examHint: ChapterExamHint | null
  /** Durée estimée du chapitre (« ~6 min »), `null` s'il n'y a rien à estimer. */
  minutes: number | null
  /** Axe / thème du programme (migration 234), `null` si la base ne l'a pas. */
  theme: string | null
  /**
   * Discipline du chapitre (migration 247) dans une matière qui en réunit
   * plusieurs, `null` sinon. C'est elle que filtrent les onglets Histoire /
   * Géographie.
   */
  discipline: string | null
}

// ---------------------------------------------------------------------------
// Regroupement par axe du programme.
//
// 28 chapitres à plat, c'est une liste qu'on ne relit pas. Les programmes sont
// déjà écrits en sections (les 4 chapitres de langue de l'anglais Tle, les
// thèmes d'histoire…) : on leur rend leurs sections. Le groupe porte alors le
// mot « chapitre » (« Chapitre 2 · Le groupe verbal ») et ses lignes deviennent
// des fiches — cf. `chapterUnit`. Sans la colonne `theme` en base, un seul
// groupe anonyme : l'affichage à plat d'avant, sans régression.

export type ChapterGroup = {
  /** `null` = groupe implicite, rendu sans en-tête (aucun thème en base). */
  theme: string | null
  chapters: ChapterRow[]
}

export function groupChaptersByTheme(chapters: ChapterRow[]): ChapterGroup[] {
  if (chapters.length === 0) return []
  if (chapters.every((c) => !c.theme)) return [{ theme: null, chapters }]

  const groups: ChapterGroup[] = []
  const byTheme = new Map<string, ChapterGroup>()
  for (const chapter of chapters) {
    const theme = chapter.theme || null
    // Les chapitres sans thème d'une matière qui en a se rangent ensemble, à
    // leur place d'apparition — pas dans un fourre-tout final qui casserait
    // l'ordre du programme.
    const key = theme ?? ' sans-theme'
    let group = byTheme.get(key)
    if (!group) {
      group = { theme, chapters: [] }
      byTheme.set(key, group)
      groups.push(group)
    }
    group.chapters.push(chapter)
  }
  return groups
}

/**
 * Le mot qui nomme UNE LIGNE de la liste du programme.
 *
 * Sans thème en base, une ligne EST un chapitre : « 0/28 chapitres ». Mais dès
 * que le programme est rangé (colonne `theme`, migration 234), ce sont les
 * GROUPES qui portent les chapitres du programme — « Chapitre 2 · Le groupe
 * verbal » — et chaque ligne dessous n'en est qu'une fiche. Continuer à compter
 * « 24 chapitres » en tête de page contredirait alors les « Chapitre 1 à 4 »
 * affichés juste en dessous.
 */
export function chapterUnit(
  chapters: { theme: string | null }[],
): 'chapitre' | 'fiche' {
  return chapters.some((c) => c.theme) ? 'fiche' : 'chapitre'
}

/**
 * LE CATALOGUE EN CACHE EST-IL PÉRIMÉ ?
 *
 * La page matière lit le programme dans un cache serveur de 300 s, puis relit
 * FRAÎCHEMENT les axes des mêmes chapitres (une requête légère). Les deux
 * listes portent sur la même table, la même matière et le même niveau : les
 * comparer suffit à savoir ce que vaut le cache.
 *
 * - un chapitre du cache absent de la liste fraîche = un FANTÔME, supprimé en
 *   base ; on le retire de l'affichage ;
 * - un chapitre de la liste fraîche absent du cache = le cache ne connaît pas
 *   un chapitre qui EXISTE : il est périmé, et le filtrer ne suffit plus. C'est
 *   ce qui est arrivé à l'allemand de Terminale le 20/08/2026 : la migration
 *   249 a supprimé les 3 fiches d'avant et posé 36 fiches neuves ; le cache
 *   servait encore les 3 disparues, aucune ne survivait au filtre, et la page
 *   annonçait « Le programme d'Allemand en Tle arrive bientôt » sur un dossier
 *   plein. Dans ce cas la page relit le programme sans cache (`getProgrammeFresh`).
 *
 * Le second cas est le seul qui coûte une requête de plus, et il ne dure que le
 * temps du TTL après une migration de contenu.
 */
export function catalogIsStale(
  cached: { id: string }[],
  fresh: { id: string }[],
): boolean {
  const connus = new Set(cached.map((c) => c.id))
  return fresh.some((c) => !connus.has(c.id))
}

/**
 * ⚠️ IL N'Y A PLUS DE NUMÉRO DE CHAPITRE, ET C'EST DÉFINITIF.
 *
 * `MATIERES_SANS_ORDRE` / `chaptersAreNumbered` vivaient ici : la philosophie
 * était la seule matière à ne pas annoncer « Chapitre 1 · La conscience »,
 * parce que son programme est une LISTE DE NOTIONS sans ordre imposé. Le
 * raisonnement était juste — et il valait pour toutes les autres : chaque
 * professeur traite son programme dans la progression qu'il choisit, l'élève
 * qui commence par le dernier chapitre n'est pas en retard de sept, et le
 * numéro occupait la place du TITRE, seul mot qui dise ce qu'on va réviser.
 *
 * L'exception a donc été généralisée le 2026-08-28 : plus de surtitre
 * « CHAPITRE 2 » sur les groupes, plus de préfixe « Chapitre 3 · » sur les
 * listes à plat, et plus de liste d'exceptions à tenir à jour.
 *
 * Ce qui RESTE : le rang de la fiche DANS son chapitre (la pastille de gauche,
 * `ChapterList` → `rangParFiche`). Il situe une ligne à l'écran et porte l'état
 * « terminé » ; il ne promet aucun parcours.
 */
/** Le groupe à ouvrir à l'arrivée : celui qui porte le chapitre à reprendre. */
export function openGroupIndex(
  groups: ChapterGroup[],
  resume: ResumeCta | null,
): number {
  if (!resume) return 0
  const index = groups.findIndex((g) =>
    g.chapters.some((c) => c.id === resume.chapterId),
  )
  return index >= 0 ? index : 0
}

// ---------------------------------------------------------------------------
// LA RECHERCHE DANS LA LISTE.
//
// Le rayon des fiches de lecture du français aligne 260 œuvres sous un seul
// chapitre : personne ne descend jusqu'à « Zazie dans le métro » à la molette.
// Et on ne vient jamais y lire la liste — on vient chercher UNE œuvre, celle
// que le professeur a donnée. Un champ de recherche remplace ce scroll.
//
// Il n'apparaît qu'au-delà de `SEARCH_MIN_CHAPTERS` lignes : sur les six
// chapitres d'un dossier de physique, il n'y a rien à chercher, et le champ ne
// serait qu'une case de plus avant la liste.

/** À partir de combien de lignes la liste mérite son champ de recherche. */
export const SEARCH_MIN_CHAPTERS = 12

/**
 * Forme comparable d'un texte : sans accent, sans casse, sans ponctuation.
 *
 * L'élève tape « cœur simple » ou « coeur simple », « Art » ou « art », jamais
 * « « Un cœur simple », Trois Contes, Gustave Flaubert ». Les ligatures sont
 * défaites AVANT la décomposition Unicode, qui ne les touche pas (œ n'est pas
 * un o accentué), et tout ce qui n'est ni lettre ni chiffre devient une espace
 * — c'est ce qui fait tomber les guillemets et les apostrophes des titres.
 */
export function searchKey(text: string): string {
  return text
    .replace(/œ/gi, 'oe')
    .replace(/æ/gi, 'ae')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

/**
 * Les lignes qui répondent à une recherche.
 *
 * Chaque mot tapé doit se retrouver dans le titre OU dans le chapitre qui la
 * coiffe — « rimbaud bateau » trouve « Le Bateau ivre », Arthur Rimbaud, et
 * « lecture » ramène tout le chapitre « Fiches de lecture ». Une recherche vide
 * rend la liste entière : le champ ne cache jamais rien tant qu'il est vide.
 */
export function matchChapters<T extends { title: string; theme: string | null }>(
  chapters: T[],
  query: string,
): T[] {
  const mots = searchKey(query).split(' ').filter(Boolean)
  if (mots.length === 0) return chapters
  return chapters.filter((c) => {
    const foin = searchKey(`${c.title} ${c.theme ?? ''}`)
    return mots.every((mot) => foin.includes(mot))
  })
}

// ---------------------------------------------------------------------------
// Les formats d'un chapitre, en pastilles (Cours, Quiz, Flashcards, Carte
// mentale, Défi, Mes erreurs). Ils se posent LÀ OÙ on choisit quoi travailler :
// dans le chapitre et en pied de cours. L'onglet « Mode de jeu » en a porté une
// liste, chapitre par chapitre — c'était le Programme redit une deuxième fois,
// et elle a été retirée.

export type SupportKind =
  | 'cours'
  | 'quiz'
  | 'flashcards'
  | 'carte'
  | 'defi'
  | 'erreurs'

export type SupportChip = {
  kind: SupportKind
  label: string
  /** État lisible : « 7/10 », « 12 cartes · 4 à revoir », « Débloquer »… */
  meta: string
  /**
   * Version COURTE de l'état, pour la pastille posée sous l'icône des tuiles
   * carrées (« 7/10 », « --/10 », « 4 à revoir »). `null` = rien à dire : la
   * tuile porte alors juste son icône, ou la coche si c'est fait. Le `meta`
   * long, lui, sert les tuiles en pleine largeur, qui ont la place.
   */
  badge: string | null
  href: string
  done: boolean
  locked?: boolean
  /** Récompense promise AVANT de jouer (« +20 XP »), miroir de lib/wallet. */
  xp?: number
}

export const SUPPORT_LABELS: Record<SupportKind, string> = {
  cours: 'Cours',
  quiz: 'Quiz',
  flashcards: 'Flashcards',
  // « Carte mentale », comme le titre de la page qu'il ouvre. Le support s'est
  // appelé « Fiches » : le mot que l'élève emploie pour ses fiches de révision.
  // Mais dans un dossier rangé sous ses chapitres, le header compte déjà des
  // « fiches » (les lignes du programme) — le même mot désignait deux choses,
  // et la page derrière s'intitulait une troisième. SEULE SOURCE du nom : il
  // change ici pour l'écran de chapitre, le pied de cours et la fiche dépliée
  // à la fois.
  carte: 'Carte mentale',
  defi: 'Défi',
  erreurs: 'Mes erreurs',
}

// ---------------------------------------------------------------------------
// Libellés d'état des contenus.

// Quiz : « 7/10 » (meilleur essai) ou « Jamais tenté ».
export function quizMeta(
  best: { score: number; total: number } | null,
): string {
  if (best && best.total > 0) return `${best.score}/${best.total}`
  return NEVER_TRIED_LABEL
}

/** État « vierge » d'un contenu jamais joué, commun à toutes les vues. */
export const NEVER_TRIED_LABEL = 'Jamais tenté'

// Flashcards : « 12 cartes · 4 à revoir » (le « à revoir » vient de la file SRS).
export function flashcardsMeta(cardCount: number, dueCount: number): string {
  const cards = `${cardCount} carte${cardCount > 1 ? 's' : ''}`
  return dueCount > 0 ? `${cards} · ${dueCount} à revoir` : cards
}

// --- Pastilles courtes des tuiles carrées -----------------------------------

/**
 * Quiz : « 7/10 » quand il a été joué, « --/10 » sinon — le barème se lit AVANT
 * de cliquer, et la case vide dit qu'il reste à faire. `null` si le quiz n'a
 * aucune question à annoncer.
 */
export function quizBadge(
  best: { score: number; total: number } | null,
  questionCount: number,
): string | null {
  if (best && best.total > 0) return `${best.score}/${best.total}`
  return questionCount > 0 ? `--/${questionCount}` : null
}

/** Flashcards : la file du jour si elle existe (c'est ce qui presse), sinon le paquet. */
export function flashcardsBadge(
  cardCount: number,
  dueCount: number,
): string | null {
  if (dueCount > 0) return `${dueCount} à revoir`
  return cardCount > 0 ? `${cardCount} carte${cardCount > 1 ? 's' : ''}` : null
}

/** Mes erreurs : le nombre de notions du chapitre qui attendent dans la file. */
export function erreursMeta(count: number): string {
  return `${count} notion${count > 1 ? 's' : ''} à revoir`
}

export function erreursBadge(count: number): string | null {
  return count > 0 ? `${count} à revoir` : null
}

// Défi : l'item s'appelle « Défi · 10 questions » (le titre de leçon des seeds,
// type « L'essentiel du cours », n'apportait rien — le chapitre est déjà le
// titre de section) ; son état dit s'il a déjà été relevé.
export function defiTitle(questionCount: number): string {
  return `Défi · ${questionCount} question${questionCount > 1 ? 's' : ''}`
}

export function defiMeta(attempted: boolean): string {
  return attempted ? 'Relevé' : NEVER_TRIED_LABEL
}

// Carte mentale : « Vue d'ensemble » si le chapitre est accessible,
// « Débloquer » (affiché avec la gemme) tant qu'il est verrouillé.
export function carteMeta(locked: boolean): string {
  return locked ? 'Débloquer' : 'Vue d’ensemble'
}

export type SubjectTemplateData = {
  subject: { slug: string; name: string; color: string }
  /** Libellé long du programme affiché en clair (« 3e », « Terminale »). */
  grade: string
  /**
   * Niveau brut de l'élève (`profiles.grade_level`), qui sert à NOMMER la
   * cohorte du classement (« des 3e »). Distinct de `grade`, qui est le
   * programme suivi et peut être écrit autrement.
   */
  gradeLevel: string | null
  /**
   * Place de l'élève dans cette matière parmi son niveau. `null` quand il n'y a
   * rien d'honnête à annoncer — pas assez de quiz passés, ou cohorte trop
   * petite pour un pourcentage (docs/CADRAGE-PERCENTILE.md).
   */
  standing: Standing | null
  progress: SubjectProgress
  /**
   * La progression de CHAQUE discipline, pour les matières qui en réunissent
   * deux : le header d'un onglet « Géographie » qui compterait les 53 fiches du
   * dossier mentirait sur ce que l'onglet montre. Vide partout ailleurs.
   */
  progressByDiscipline: Record<string, SubjectProgress>
  /** Le chapitre mis en avant (« Reprendre » / « Commencer »), s'il en reste. */
  resume: ResumeCta | null
  /** Le bandeau « Examen blanc » a-t-il gagné sa place en tête de page ? */
  examOnTop: boolean
  weakCount: number
  chapters: ChapterRow[]
  // Onglet « Boss » : pool de questions 100 % matière pour affronter le boss
  // de la matière (le même de la 6e à la Terminale — bossForSubject côté client).
  bossPool: ModeQuestion[]
  /**
   * La carte du gardien de la matière — sa jauge de traque (migration 212).
   * `null` quand elle est illisible : la page n'affiche alors pas d'écusson et
   * le billet du gardien garde sa forme d'avant, toujours ouverte.
   */
  gardien: TraqueCard | null
  /**
   * Annales de la matière à ce niveau (migrations 236/237). Vide tant que les
   * migrations ne sont pas jouées : l'onglet retombe alors sur l'épreuve
   * blanche seule, sans rien casser.
   */
  papers: ExamPaper[]
}
