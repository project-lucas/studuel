// -----------------------------------------------------------------------------
// LE DIAGRAMME D'EFFORT DE /moi — logique pure.
//
// CE QU'IL RÉPOND, ET POURQUOI CETTE FORME. La question de l'élève n'est pas
// « combien ai-je travaillé » mais « est-ce que je travaille au bon endroit ».
// Une barre d'heures seule est une statistique ; deux repères sur la même ligne
// — ce que tu DONNES contre ce que ça PÈSE — sont un verdict. L'écart entre les
// deux EST le message du diagramme, et tout ce module sert à le calculer.
//
// DEUX BLOCS, ET LE SECOND N'EST PAS « SECONDAIRE ». En haut les matières de
// l'épreuve, en bas le reste : c'est la hiérarchie que l'élève cherche. Mais en
// terminale le contrôle continu vaut 40 % du bac et il est fait des matières du
// bas — d'où le libellé « aussi au programme » et un poids résiduel plutôt que
// zéro (cf. lib/exam-weights.ts).
//
// CE N'EST PAS UN CHRONO. La base ne ventile aucun temps par matière (cf. la
// migration 325) : on mesure un VOLUME de travail — questions répondues, leçons
// lues — dont on dérive une durée APPROCHÉE. D'où `minutes` et jamais `seconds`,
// et l'affichage avec un « ≈ ». Confondre les deux ferait mentir un écran dont
// tout l'intérêt est d'être juste.
// -----------------------------------------------------------------------------

import type { ExamPoints } from '@/lib/exam-weights'
import { weightsAreComparable } from '@/lib/exam-weights'

/** Ce que rend `effort_by_subject` (migration 325), une ligne par matière. */
export type EffortInput = {
  slug: string
  questions: number
  lessons: number
}

/**
 * MOYENNE SCOLAIRE PAR MATIÈRE, ramenée sur 20 — `null` quand l'élève n'a saisi
 * aucune note dans cette matière.
 *
 * C'est la troisième dimension du diagramme, et celle qui change tout : le
 * travail seul dit un CHOIX, la moyenne dit un BESOIN. Un élève à 6/20 en
 * physique-chimie qui n'y passe que 4 % de son temps n'est pas « mal réparti »,
 * il est en train de perdre une matière — et aucune comparaison part/poids ne le
 * dirait.
 */
export type MoyennesParMatiere = Record<string, number | null>

/**
 * SEUIL DE RETARD, sur 20. Dix, c'est la moyenne : en dessous, la matière n'est
 * pas « perfectible », elle est en échec, et c'est le seul chiffre de cet écran
 * qui appelle un geste immédiat. Volontairement STRICT — un seuil à 12 mettrait
 * en alerte la moitié d'un bulletin ordinaire et l'alerte ne voudrait plus rien.
 */
export const SEUIL_RETARD = 10

/**
 * BARÈME DE CONVERSION EN MINUTES.
 *
 * Ordres de grandeur mesurés sur les écrans du projet, pas des constantes
 * théoriques : une question de quiz se lit, se réfléchit et se valide en une
 * demi-minute ; une leçon du programme annonce elle-même « ~6 min » sur sa
 * ligne (`chapter.minutes`). Ils ne servent QU'À l'affichage approché — aucun
 * classement, aucun verdict n'en dépend, tout se calcule en parts.
 */
export const MINUTES_PAR_QUESTION = 0.5
export const MINUTES_PAR_LECON = 6

/**
 * ÉCART À PARTIR DUQUEL ON PARLE. Dix points de pourcentage entre ce qu'une
 * matière reçoit et ce qu'elle pèse. En dessous, on se tait : sur cinq
 * matières, cinq pastilles d'alerte ne sont plus une alerte, et l'élève cesse
 * de les lire. Au-dessus, l'écart est réel et vaut d'être nommé.
 */
export const ECART_SIGNIFICATIF = 0.1

/** Plancher de l'échelle des pistes : en dessous, les barres seraient des traits. */
const ECHELLE_MIN = 0.25
/** Pas d'arrondi de l'échelle, pour qu'elle ne saute pas à chaque session. */
const ECHELLE_PAS = 0.05

/**
 * `en_retard` passe AVANT les deux autres : une matière sous la moyenne prime
 * sur tout écart de répartition, à l'épreuve comme hors épreuve.
 */
export type EffortVerdict = 'en_retard' | 'trop' | 'a_rattraper' | null

export type EffortRow = {
  slug: string
  name: string
  /** Part de l'effort total, 0..1. */
  share: number
  /** Part que pèse la matière à l'épreuve, 0..1 — `null` hors épreuve. */
  weight: number | null
  /** Durée APPROCHÉE, en minutes. */
  minutes: number
  /** Moyenne sur 20, ou `null` si aucune note saisie dans cette matière. */
  moyenne: number | null
  verdict: EffortVerdict
}

/**
 * Le régime d'affichage, décidé par le niveau :
 * · `comparaison` — plusieurs matières à l'épreuve : les deux repères par ligne ;
 * · `part` — une seule matière à l'épreuve (bac de français) : pas de repère,
 *   on dit sa part de temps et rien de plus ;
 * · `simple` — aucune épreuve à ce niveau : un seul bloc trié par effort.
 */
export type EffortRegime = 'comparaison' | 'part' | 'simple'

export type EffortDiagram = {
  regime: EffortRegime
  /** Durée APPROCHÉE de tout l'effort de la fenêtre, en minutes. */
  totalMinutes: number
  /** Les matières de l'épreuve, effort décroissant. */
  exam: EffortRow[]
  /** Les autres, effort décroissant. */
  autres: EffortRow[]
  /**
   * Largeur pleine d'une piste, en part (0..1). Toutes les lignes la partagent
   * — c'est ce qui rend les barres comparables ENTRE ELLES et à leur repère.
   */
  scale: number
  /** La phrase du haut : le déséquilibre principal, ou `null` s'il n'y en a pas. */
  phrase: string | null
}

/** Une matière du catalogue, réduite à ce dont ce module a besoin. */
export type EffortSubject = { slug: string; name: string }

const minutesDe = (e: EffortInput) =>
  e.questions * MINUTES_PAR_QUESTION + e.lessons * MINUTES_PAR_LECON

/** Arrondi de l'échelle au pas supérieur, jamais sous le plancher. */
function echelle(parts: number[]): number {
  const max = parts.reduce((m, p) => (p > m ? p : m), 0)
  const arrondi = Math.ceil(max / ECHELLE_PAS) * ECHELLE_PAS
  return Math.min(1, Math.max(ECHELLE_MIN, arrondi))
}

/**
 * LA PHRASE. Un seul déséquilibre nommé, jamais une liste : c'est elle qui
 * tient la promesse « en une seconde », le diagramme ne fait que la démontrer.
 *
 * L'ordre de priorité n'est pas arbitraire — le manque passe AVANT l'excès.
 * « Tu délaisses le français » appelle un geste ; « tu fais beaucoup de maths »
 * n'en appelle aucun, et sonne comme un reproche adressé à un élève qui
 * travaille.
 */
function phraseDe(rows: EffortRow[], regime: EffortRegime): string | null {
  // LE RETARD PARLE EN PREMIER, ET MÊME SANS ÉPREUVE. Une matière sous la
  // moyenne est un fait vérifiable qui appelle un geste ; un écart de
  // répartition n'est qu'une tendance. Découvrir « 6/20 en physique-chimie » a
  // plus de valeur pour l'élève que n'importe quel pourcentage de temps — et
  // ça vaut en 6e comme en terminale, d'où ce bloc AVANT le test de régime.
  const retards = rows
    .filter((r) => r.verdict === 'en_retard' && r.moyenne !== null)
    .sort((a, b) => (a.moyenne ?? 20) - (b.moyenne ?? 20))
  if (retards.length > 0) {
    const r = retards[0]
    return `${r.name} : ${note(r.moyenne ?? 0)} de moyenne, et ${pct(r.share)} de ton travail.`
  }

  if (regime !== 'comparaison') return null

  const ecart = (r: EffortRow) => (r.weight ?? 0) - r.share
  const manques = rows
    .filter((r) => r.verdict === 'a_rattraper' && r.weight !== null)
    .sort((a, b) => ecart(b) - ecart(a))
  if (manques.length > 0) {
    const r = manques[0]
    return `${r.name} pèse ${pct(r.weight ?? 0)} de ton épreuve et reçoit ${pct(r.share)} de ton travail.`
  }

  const exces = rows
    .filter((r) => r.verdict === 'trop' && r.weight !== null)
    .sort((a, b) => -ecart(b) - -ecart(a))
  if (exces.length > 0) {
    const r = exces[0]
    return `${r.name} reçoit ${pct(r.share)} de ton travail pour ${pct(r.weight ?? 0)} de ton épreuve.`
  }

  return 'Ton travail est bien réparti sur les matières de ton épreuve.'
}

const pct = (v: number) => `${Math.round(v * 100)} %`
/** « 6/20 », « 12,5/20 » — la virgule décimale, jamais le point. */
const note = (v: number) =>
  `${(Math.round(v * 10) / 10).toString().replace('.', ',')}/20`

/**
 * Construit le diagramme.
 *
 * `effort` vient de la RPC (325) et ne contient QUE les matières travaillées.
 * Les matières de l'épreuve absentes de cette liste sont ajoutées à zéro : une
 * matière d'examen jamais ouverte est précisément ce que l'élève doit voir, et
 * l'omettre serait le mensonge le plus coûteux de cet écran.
 */
export function buildEffort({
  effort,
  subjects,
  weights,
  moyennes = {},
}: {
  effort: EffortInput[]
  subjects: EffortSubject[]
  weights: ExamPoints
  /** Moyennes saisies par l'élève, par slug. Absentes = diagramme du travail seul. */
  moyennes?: MoyennesParMatiere
}): EffortDiagram {
  const nomDe = new Map(subjects.map((s) => [s.slug, s.name]))
  const parSlug = new Map(effort.map((e) => [e.slug, e]))

  // ENTRENT TOUTES, TRAVAILLÉES OU NON : les matières de l'épreuve, et celles
  // où l'élève a saisi une note. Les deux pour la même raison — une matière
  // d'examen jamais ouverte et une matière à 6/20 jamais rouverte sont
  // exactement ce que cet écran doit faire remonter. Les taire serait le
  // mensonge le plus coûteux du bloc.
  for (const slug of [...Object.keys(weights), ...Object.keys(moyennes)]) {
    if (!parSlug.has(slug)) parSlug.set(slug, { slug, questions: 0, lessons: 0 })
  }

  const lignes = [...parSlug.values()].map((e) => ({
    slug: e.slug,
    minutes: minutesDe(e),
  }))
  const totalMinutes = lignes.reduce((s, l) => s + l.minutes, 0)

  const totalPoints = Object.values(weights).reduce((s, p) => s + p, 0)
  const comparable = weightsAreComparable(weights)
  const regime: EffortRegime =
    Object.keys(weights).length === 0 ? 'simple' : comparable ? 'comparaison' : 'part'

  const rows: EffortRow[] = lignes.map((l) => {
    const share = totalMinutes > 0 ? l.minutes / totalMinutes : 0
    const points = weights[l.slug]
    const weight =
      comparable && points !== undefined && totalPoints > 0
        ? points / totalPoints
        : null
    // UNE SEULE MATIÈRE TRAVAILLÉE : sa part vaut 1 par construction, et un
    // verdict tiré de là ne dirait rien de l'élève. On se tait.
    const seule = lignes.filter((x) => x.minutes > 0).length <= 1
    const moyenne = moyennes[l.slug] ?? null

    // L'ORDRE DES TROIS VERDICTS EST LE SENS DU BLOC.
    //   1. `en_retard` — un fait, vérifiable, qui ne dépend d'aucune moyenne
    //      d'écran ni d'aucun barème. Il prime toujours, épreuve ou pas.
    //   2. `trop` / `a_rattraper` — une tendance de répartition, qui n'a de
    //      sens que face à un poids d'épreuve, et jamais sur une seule matière
    //      travaillée (sa part vaut 1 par construction).
    const verdict: EffortVerdict =
      moyenne !== null && moyenne < SEUIL_RETARD
        ? 'en_retard'
        : weight === null || seule
          ? null
          : share - weight >= ECART_SIGNIFICATIF
            ? 'trop'
            : weight - share >= ECART_SIGNIFICATIF
              ? 'a_rattraper'
              : null

    return {
      slug: l.slug,
      name: nomDe.get(l.slug) ?? l.slug,
      share,
      weight,
      minutes: l.minutes,
      moyenne,
      verdict,
    }
  })

  // LE RETARD REMONTE EN TÊTE DE SON BLOC, avant même le plus gros effort : une
  // matière en échec est ce qu'il faut voir en premier, et la reléguer sous
  // trois matières bien tenues serait la cacher. À égalité, l'effort décide.
  const parEffort = (a: EffortRow, b: EffortRow) =>
    Number(b.verdict === 'en_retard') - Number(a.verdict === 'en_retard') ||
    b.minutes - a.minutes ||
    a.name.localeCompare(b.name, 'fr')

  const exam = rows.filter((r) => r.slug in weights).sort(parEffort)
  const autres = rows.filter((r) => !(r.slug in weights)).sort(parEffort)

  return {
    regime,
    totalMinutes,
    exam,
    autres,
    scale: echelle([
      ...rows.map((r) => r.share),
      ...rows.map((r) => r.weight ?? 0),
    ]),
    phrase: phraseDe(exam, regime),
  }
}

/** « 2 h 40 », « 25 min » — la durée approchée, telle qu'elle s'affiche. */
export function dureeLabel(minutes: number): string {
  const m = Math.max(0, Math.round(minutes))
  if (m < 60) return `${m} min`
  const h = Math.floor(m / 60)
  const reste = m % 60
  return reste === 0 ? `${h} h` : `${h} h ${String(reste).padStart(2, '0')}`
}

// -----------------------------------------------------------------------------
// LE RADAR — la sélection et l'ORDRE de ses axes.
//
// ⚠️ CE QU'UN RADAR NE SAIT PAS FAIRE, et comment on le contourne ici. Trois
// défauts lui sont intrinsèques, ils ne se corrigent pas, ils se BORNENT :
//
//   1. IL DEVIENT ILLISIBLE PASSÉ SIX AXES — d'où `RADAR_AXES_MAX`. Les
//      matières qui ne tiennent pas restent listées dessous, en barres : rien
//      n'est caché, mais rien n'est entassé non plus.
//
//   2. L'AIRE DU POLYGONE N'EST PAS UNE MESURE : elle change si l'on permute
//      deux axes. C'est pourquoi l'ordre ci-dessous est FIGÉ et déterministe
//      (l'épreuve d'abord, par poids décroissant), et jamais trié par la valeur
//      de l'élève. La forme devient alors reconnaissable d'une semaine à
//      l'autre — « ma forme » — au lieu de se réarranger à chaque session.
//
//   3. IL FLATTE : une toile à moitié pleine a toujours l'air d'un bon
//      résultat. Le remède est le SECOND POLYGONE — le contour doré du barème.
//      Sans lui, un radar dit « voilà ta forme » ; avec lui, il dit « voilà
//      l'écart entre ta forme et celle qu'il faudrait ». C'est la seule
//      variante d'un radar qui affirme quelque chose de vérifiable.
//
// EN DESSOUS DE TROIS AXES, IL N'Y A PAS DE POLYGONE — deux points font un
// segment, un point fait une tache. La fonction rend alors un tableau vide et
// l'appelant retombe sur les barres, qui n'ont pas ce plancher.
// -----------------------------------------------------------------------------

/** Au-delà, les axes se marchent dessus et les étiquettes se chevauchent. */
export const RADAR_AXES_MAX = 6
/** En dessous, un radar n'a pas de forme. */
export const RADAR_AXES_MIN = 3

/**
 * Les axes du radar, dans leur ordre d'affichage (sens horaire depuis le haut).
 *
 * PRIORITÉ, et elle est celle de l'élève : les matières de l'épreuve d'abord —
 * c'est ce qui se joue —, puis les matières EN RETARD hors épreuve — c'est ce
 * qui brûle —, puis les plus travaillées pour compléter la toile.
 */
export function radarAxes(diagram: EffortDiagram): EffortRow[] {
  const axes: EffortRow[] = []
  const vus = new Set<string>()
  const pousser = (r: EffortRow) => {
    if (vus.has(r.slug) || axes.length >= RADAR_AXES_MAX) return
    vus.add(r.slug)
    axes.push(r)
  }

  // L'ÉPREUVE, par poids décroissant — un ordre qui ne dépend PAS de l'élève,
  // donc stable d'une semaine à l'autre (cf. le défaut n°2 ci-dessus).
  for (const r of [...diagram.exam].sort(
    (a, b) => (b.weight ?? 0) - (a.weight ?? 0) || a.name.localeCompare(b.name, 'fr'),
  )) {
    pousser(r)
  }
  // Les retards hors épreuve : ils doivent être SUR la toile, pas dans la liste
  // du dessous — c'est la découverte que cet écran existe pour provoquer.
  for (const r of diagram.autres) {
    if (r.verdict === 'en_retard') pousser(r)
  }
  // Puis les plus travaillées, pour que la toile ait une forme.
  for (const r of diagram.autres) pousser(r)

  return axes.length >= RADAR_AXES_MIN ? axes : []
}
