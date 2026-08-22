// -----------------------------------------------------------------------------
// Le RYTHME d'un palier : comment le format d'un jeu (lib/jeux/formats) se règle
// au palier 1 comme au palier 5.
//
// Les formats sont écrits à la main pour le palier de référence (Confirmé). Ce
// module en dérive les quatre autres — chrono, vies, objectif — et, surtout,
// RÉÉCRIT la règle affichée à l'intro. C'est le point délicat : les règles sont
// des phrases avec des chiffres dedans (« 2 grains de sable », « 8 secondes »).
// Servir la phrase d'origine sur un format re-réglé afficherait un mensonge à
// l'écran de lancement. Hors palier de référence, on affiche donc une règle
// FACTUELLE, écrite dans le vocabulaire du jeu, tirée des paramètres réels.
//
// La banque de questions, elle, se règle dans le fichier de chaque jeu
// (lib/jeux/calcul-mental.ts…) : ici on ne touche qu'au tempo.
// -----------------------------------------------------------------------------
import { MIN_WAVE_SECONDS, type GameFormat } from '@/lib/jeux/formats'
import { DEFAULT_PALIER, palierDef, type PalierLevel } from '@/lib/jeux/paliers'
import { CALCUL_TIER_BRIEF } from '@/lib/jeux/calcul-mental'
import { CONJUGAISON_TIER_BRIEF } from '@/lib/jeux/conjugaison-eclair'

/**
 * Les trois coefficients d'un palier :
 * - `tempo`   multiplie les durées (au-dessus de 1 : on respire ; en dessous : ça presse) ;
 * - `lives`   s'ajoute au nombre de vies (jamais en dessous d'une) ;
 * - `target`  multiplie ce qu'il faut atteindre (escales, vagues, étages, prises).
 *
 * Trois leviers et pas un seul : une difficulté qui ne serait qu'un chrono plus
 * court n'est pas un défi, c'est une punition.
 */
type PalierCoefs = { tempo: number; lives: number; target: number }

const COEFS: Record<PalierLevel, PalierCoefs> = {
  1: { tempo: 1.45, lives: 2, target: 0.7 },
  2: { tempo: 1.2, lives: 1, target: 0.85 },
  3: { tempo: 1, lives: 0, target: 1 },
  4: { tempo: 0.85, lives: -1, target: 1.15 },
  5: { tempo: 0.72, lives: -1, target: 1.3 },
}

/** Plancher des chronos par question : en dessous, ce n'est plus un jeu de réflexe. */
const MIN_QUESTION_SECONDS = 3
/** Plancher d'un chrono global : une partie plus courte ne se joue pas. */
const MIN_GLOBAL_SECONDS = 20

/** Durée re-réglée, arrondie au demi-seconde le plus proche, jamais sous `min`. */
function scaleSeconds(value: number, tempo: number, min: number): number {
  return Math.max(min, Math.round(value * tempo * 2) / 2)
}

/** Compte re-réglé (escales, vagues, étages…), jamais sous `min`. */
function scaleCount(value: number, factor: number, min = 1): number {
  return Math.max(min, Math.round(value * factor))
}

function scaleLives(value: number, delta: number): number {
  return Math.max(1, value + delta)
}

/**
 * Le format d'un jeu réglé sur un palier. Le palier de référence rend le format
 * tel quel — règle littéraire comprise.
 */
export function scaleFormat(format: GameFormat, level: PalierLevel): GameFormat {
  if (level === DEFAULT_PALIER) return format
  const c = COEFS[level]
  const p = format.params
  let params = p

  switch (p.mechanic) {
    case 'sprint':
      // La durée de la course ne bouge PAS : elle est la promesse du jeu
      // (« 40 s chrono ») et deux sprints de longueurs différentes ne se
      // comparent plus. C'est le seuil du bonus de vitesse qui se resserre —
      // et, l'essentiel, la banque de questions qui change de niveau.
      params = {
        mechanic: 'sprint',
        sprint: {
          seconds: p.sprint.seconds,
          fastMs: Math.round(p.sprint.fastMs * c.tempo),
        },
      }
      break
    case 'vies':
      params = {
        mechanic: 'vies',
        vies: {
          lives: scaleLives(p.vies.lives, c.lives),
          questionSeconds:
            p.vies.questionSeconds === null
              ? null
              : scaleSeconds(p.vies.questionSeconds, c.tempo, MIN_QUESTION_SECONDS),
          target: scaleCount(p.vies.target, c.target, 4),
        },
      }
      break
    case 'paliers':
      params = {
        mechanic: 'paliers',
        paliers: {
          waves: scaleCount(p.paliers.waves, c.target, 2),
          waveSize: p.paliers.waveSize,
          startSeconds: scaleSeconds(
            p.paliers.startSeconds,
            c.tempo,
            MIN_WAVE_SECONDS + 1,
          ),
          // Le chrono fond PLUS VITE quand le palier monte : diviser par le
          // tempo accélère la chute là où le multiplier l'adoucirait.
          stepSeconds: Math.round((p.paliers.stepSeconds / c.tempo) * 2) / 2,
          lives: scaleLives(p.paliers.lives, c.lives),
        },
      }
      break
    case 'expedition':
      params = {
        mechanic: 'expedition',
        expedition: {
          stops: scaleCount(p.expedition.stops, c.target, 4),
          questionSeconds: scaleSeconds(
            p.expedition.questionSeconds,
            c.tempo,
            MIN_QUESTION_SECONDS,
          ),
        },
      }
      break
    case 'ascension': {
      const floors = scaleCount(p.ascension.floors, c.target, 4)
      params = {
        mechanic: 'ascension',
        ascension: {
          floors,
          // La chute s'aggrave d'un étage au sommet de l'échelle, s'adoucit en bas.
          fall: Math.max(1, p.ascension.fall + (level >= 5 ? 1 : level <= 1 ? -1 : 0)),
          questionSeconds:
            p.ascension.questionSeconds === null
              ? null
              : scaleSeconds(
                  p.ascension.questionSeconds,
                  c.tempo,
                  MIN_QUESTION_SECONDS,
                ),
          // Les essais suivent les étages : le rapport essais/étages faisait
          // tout l'équilibre du réglage d'origine, on le conserve.
          attempts: Math.max(
            floors,
            Math.round((p.ascension.attempts / p.ascension.floors) * floors),
          ),
        },
      }
      break
    }
    case 'ordre':
      params = {
        mechanic: 'ordre',
        ordre: {
          boards:
            p.ordre.boards === null
              ? null
              : scaleCount(p.ordre.boards, c.target, 2),
          globalSeconds:
            p.ordre.globalSeconds === null
              ? null
              : scaleSeconds(p.ordre.globalSeconds, c.tempo, MIN_GLOBAL_SECONDS),
          lives: p.ordre.lives === null ? null : scaleLives(p.ordre.lives, c.lives),
          itemsPerBoard: p.ordre.itemsPerBoard,
        },
      }
      break
    case 'ultime':
      // L'épreuve ultime est HORS de l'échelle des paliers : elle est la même
      // pour tout le monde, c'est ce qui rend ses résultats comparables. La
      // re-régler par palier détruirait sa raison d'être.
      return format
  }

  return { ...format, params, rule: factualRule({ ...format, params }, level) }
}

// ------------------------------------------------------------------ la règle

/** Une durée à la française : « 6 s », « 7,5 s » (jamais « 7.5 s »). */
function seconds(value: number): string {
  return `${String(value).replace('.', ',')} s`
}

function plural(count: number, word: string): string {
  return `${count} ${word}${count > 1 && !word.endsWith('s') ? 's' : ''}`
}

/**
 * La règle d'un format re-réglé, en une phrase, tirée UNIQUEMENT des paramètres
 * réels. Moins littéraire que la règle d'origine — mais vraie, ce qui compte
 * davantage sur l'écran qui lance la partie.
 */
export function factualRule(format: GameFormat, level: PalierLevel): string {
  const p = format.params
  const l = format.lexicon
  const head = `Palier ${level} · ${palierDef(level).name}.`
  switch (p.mechanic) {
    case 'sprint':
      return `${head} ${p.sprint.seconds} secondes chrono, enchaîne le plus de ${l.steps} possible.`
    case 'vies':
      return `${head} ${plural(p.vies.target, l.step)} à réussir, ${plural(p.vies.lives, 'vie')}${
        p.vies.questionSeconds === null
          ? ', aucun chrono'
          : `, ${seconds(p.vies.questionSeconds)} par question`
      }.`
    case 'paliers':
      return `${head} ${plural(p.paliers.waves, l.step)} de ${p.paliers.waveSize} questions, ${seconds(
        p.paliers.startSeconds,
      )} au départ puis ${seconds(p.paliers.stepSeconds)} de moins à chaque fois, ${plural(
        p.paliers.lives,
        'vie',
      )}.`
    case 'expedition':
      return `${head} ${plural(p.expedition.stops, l.step)}, ${seconds(
        p.expedition.questionSeconds,
      )} chacune — rien ne t'élimine.`
    case 'ascension':
      return `${head} ${plural(p.ascension.floors, l.step)} à gravir : +1 par bonne réponse, −${
        p.ascension.fall
      } par erreur, ${plural(p.ascension.attempts, 'essai')}.`
    case 'ordre':
      return `${head} ${
        p.ordre.boards === null
          ? `${p.ordre.globalSeconds} secondes pour en reconstituer un maximum`
          : `${plural(p.ordre.boards, l.step)} de ${p.ordre.itemsPerBoard} éléments`
      }${p.ordre.lives === null ? '' : `, ${plural(p.ordre.lives, 'erreur')} tolérée${p.ordre.lives > 1 ? 's' : ''}`}.`
    case 'ultime':
      return `Une seule vie, aucune fin : un ${l.step} tous les ${p.ultime.perLevel} succès.`
  }
}

// ------------------------------------------------------------------ le chrono

/**
 * Ce jeu a-t-il un TEMPS DE BOUCLAGE qui veuille dire quelque chose ?
 *
 * Non pour les mécaniques à chrono global — un sprint de 40 secondes dure 40
 * secondes pour tout le monde, et « record : 40,0 s » serait une pastille vide
 * qui laisserait croire à une course qu'on ne court pas. Là, ce qui départage
 * reste le score.
 *
 * Oui partout ailleurs : vies, paliers, expédition, ascension et tableaux sans
 * chrono se bouclent d'autant plus vite qu'on répond vite et juste.
 */
export function hasTimeRecord(format: GameFormat): boolean {
  const p = format.params
  if (p.mechanic === 'sprint') return false
  if (p.mechanic === 'ordre') return p.ordre.globalSeconds === null
  return true
}

// ------------------------------------------------------- les jetons de la carte

/**
 * Ce qui change à ce palier, en deux ou trois jetons : les chiffres qui
 * comptent, plus la promesse de la banque quand le jeu en a une graduée. C'est
 * ce que la carte du jeu affiche sous chaque barreau de l'échelle — la
 * différence entre deux paliers doit se LIRE avant de se jouer.
 */
export function palierChips(format: GameFormat, level: PalierLevel): string[] {
  const scaled = scaleFormat(format, level)
  const p = scaled.params
  const l = scaled.lexicon
  const chips: string[] = []
  switch (p.mechanic) {
    case 'sprint':
      chips.push(`${p.sprint.seconds} s chrono`)
      break
    case 'vies':
      chips.push(plural(p.vies.target, l.step))
      chips.push(plural(p.vies.lives, 'vie'))
      if (p.vies.questionSeconds !== null) {
        chips.push(`${seconds(p.vies.questionSeconds)} / question`)
      }
      break
    case 'paliers':
      chips.push(plural(p.paliers.waves, l.step))
      chips.push(`${seconds(p.paliers.startSeconds)} au départ`)
      chips.push(plural(p.paliers.lives, 'vie'))
      break
    case 'expedition':
      chips.push(plural(p.expedition.stops, l.step))
      chips.push(`${seconds(p.expedition.questionSeconds)} / ${l.step}`)
      break
    case 'ascension':
      chips.push(plural(p.ascension.floors, l.step))
      chips.push(`−${p.ascension.fall} par erreur`)
      break
    case 'ordre':
      if (p.ordre.boards !== null) chips.push(plural(p.ordre.boards, l.step))
      if (p.ordre.globalSeconds !== null) chips.push(`${p.ordre.globalSeconds} s chrono`)
      if (p.ordre.lives !== null) chips.push(plural(p.ordre.lives, 'vie'))
      break
    case 'ultime':
      chips.push('1 vie')
      chips.push('sans fin')
      break
  }
  const bank = bankBrief(format.id, level)
  if (bank) chips.unshift(bank)
  return chips
}

/**
 * Ce que la BANQUE sert à ce palier, quand elle est graduée. Les jeux dont la
 * banque ne l'est pas encore ne racontent rien ici plutôt que de promettre un
 * contenu qui ne change pas — la carte ne ment jamais sur ce qu'on va jouer.
 */
export function bankBrief(gameId: string, level: PalierLevel): string | null {
  return BANK_BRIEFS[gameId]?.[level] ?? null
}

/** Vrai si la banque du jeu change réellement d'un palier à l'autre. */
export function hasGradedBank(gameId: string): boolean {
  return gameId in BANK_BRIEFS
}

const BANK_BRIEFS: Record<string, Record<PalierLevel, string>> = {
  'calcul-mental': CALCUL_TIER_BRIEF,
  'conjugaison-eclair': CONJUGAISON_TIER_BRIEF,
}
