// Conjugaison éclair — la banque du salon Français.
// Un verbe, un temps, une personne : trouve la bonne forme parmi quatre. Les
// leurres sont les fautes classiques du collège (futur vs conditionnel, mode
// oublié, terminaison bricolée). Générateur déterministe comme les capitales.
import { seededRng, type ModeQuestion } from '@/lib/defi-modes'
import { shuffleWith } from '@/lib/jeux/shuffle'
import { DEFAULT_PALIER, PALIERS, type PalierLevel } from '@/lib/jeux/paliers'

// La forme juste et ses trois sosies fautifs, avec l'énoncé et l'astuce.
export type ConjugationItem = {
  id: string
  verb: string
  tense: string
  person: string
  right: string
  wrong: [string, string, string]
  tip: string
}

export const CONJUGATIONS: ConjugationItem[] = [
  {
    id: 'prendre-subj',
    verb: 'prendre',
    tense: 'subjonctif présent',
    person: '3ᵉ personne du singulier (qu’il…)',
    right: 'qu’il prenne',
    wrong: ['qu’il prend', 'qu’il prends', 'qu’il prenait'],
    tip: 'Au subjonctif présent : « qu’il prenne », avec deux n.',
  },
  {
    id: 'faire-futur',
    verb: 'faire',
    tense: 'futur simple',
    person: '1ʳᵉ personne du singulier (je…)',
    right: 'je ferai',
    wrong: ['je ferais', 'je fairai', 'je ferrai'],
    tip: 'Futur : « je ferai » (sans s). « je ferais » est du conditionnel.',
  },
  {
    id: 'aller-present',
    verb: 'aller',
    tense: 'présent',
    person: '3ᵉ personne du pluriel (ils…)',
    right: 'ils vont',
    wrong: ['ils allent', 'ils vontent', 'ils vons'],
    tip: '« aller » est irrégulier : ils vont.',
  },
  {
    id: 'etre-imparfait',
    verb: 'être',
    tense: 'imparfait',
    person: '2ᵉ personne du pluriel (vous…)',
    right: 'vous étiez',
    wrong: ['vous êtiez', 'vous étier', 'vous étiés'],
    tip: 'Imparfait de être : vous étiez.',
  },
  {
    id: 'avoir-subj',
    verb: 'avoir',
    tense: 'subjonctif présent',
    person: '3ᵉ personne du singulier (qu’il…)',
    right: 'qu’il ait',
    wrong: ['qu’il ai', 'qu’il a', 'qu’il aie'],
    tip: 'Subjonctif : qu’il ait (avec t). « qu’il aie » est la 1ʳᵉ personne.',
  },
  {
    id: 'voir-futur',
    verb: 'voir',
    tense: 'futur simple',
    person: '3ᵉ personne du singulier (il…)',
    right: 'il verra',
    wrong: ['il voira', 'il vera', 'il verrait'],
    tip: 'Futur de voir : il verra (deux r).',
  },
  {
    id: 'pouvoir-present',
    verb: 'pouvoir',
    tense: 'présent',
    person: '1ʳᵉ personne du singulier (je…)',
    right: 'je peux',
    wrong: ['je peut', 'je peus', 'je peuxe'],
    tip: '« je peux » : les verbes en -oir prennent un x à je et tu.',
  },
  {
    id: 'finir-present',
    verb: 'finir',
    tense: 'présent',
    person: '2ᵉ personne du pluriel (vous…)',
    right: 'vous finissez',
    wrong: ['vous finez', 'vous finisez', 'vous finissiez'],
    tip: '2ᵉ groupe : vous finissez (présent). « finissiez » est de l’imparfait.',
  },
  {
    id: 'manger-imparfait',
    verb: 'manger',
    tense: 'imparfait',
    person: '1ʳᵉ personne du pluriel (nous…)',
    right: 'nous mangions',
    wrong: ['nous mangeons', 'nous mangeions', 'nous mangonts'],
    tip: 'Imparfait : nous mangions. « nous mangeons » est du présent.',
  },
  {
    id: 'appeler-present',
    verb: 'appeler',
    tense: 'présent',
    person: '3ᵉ personne du singulier (il…)',
    right: 'il appelle',
    wrong: ['il appele', 'il apelle', 'il appèle'],
    tip: '« appeler » double le l : il appelle.',
  },
  {
    id: 'jeter-present',
    verb: 'jeter',
    tense: 'présent',
    person: '3ᵉ personne du singulier (il…)',
    right: 'il jette',
    wrong: ['il jete', 'il jète', 'il jetes'],
    tip: '« jeter » double le t : il jette.',
  },
  {
    id: 'dire-present',
    verb: 'dire',
    tense: 'présent',
    person: '2ᵉ personne du pluriel (vous…)',
    right: 'vous dites',
    wrong: ['vous disez', 'vous ditez', 'vous disiez'],
    tip: '« vous dites » est irrégulier (comme « vous faites »).',
  },
  {
    id: 'aimer-conditionnel',
    verb: 'aimer',
    tense: 'conditionnel présent',
    person: '1ʳᵉ personne du singulier (je…)',
    right: 'j’aimerais',
    wrong: ['j’aimerai', 'j’aimerrais', 'j’aimais'],
    tip: 'Conditionnel : j’aimerais (avec s). « j’aimerai » est du futur.',
  },
  {
    id: 'vouloir-subj',
    verb: 'vouloir',
    tense: 'subjonctif présent',
    person: '3ᵉ personne du singulier (qu’il…)',
    right: 'qu’il veuille',
    wrong: ['qu’il veut', 'qu’il veuil', 'qu’il voulle'],
    tip: 'Subjonctif irrégulier : qu’il veuille.',
  },
  {
    id: 'savoir-present',
    verb: 'savoir',
    tense: 'présent',
    person: '1ʳᵉ personne du singulier (je…)',
    right: 'je sais',
    wrong: ['je sait', 'je saie', 'je savs'],
    tip: '« je sais » : irrégulier, terminaison en -s.',
  },
  {
    id: 'courir-futur',
    verb: 'courir',
    tense: 'futur simple',
    person: '3ᵉ personne du singulier (il…)',
    right: 'il courra',
    wrong: ['il courera', 'il courira', 'il courrait'],
    tip: 'Futur de courir : il courra (deux r, comme mourir → mourra).',
  },
  {
    id: 'venir-passe-simple',
    verb: 'venir',
    tense: 'passé simple',
    person: '3ᵉ personne du singulier (il…)',
    right: 'il vint',
    wrong: ['il vena', 'il venit', 'il venut'],
    tip: 'Passé simple irrégulier : il vint.',
  },
  {
    id: 'partir-present',
    verb: 'partir',
    tense: 'présent',
    person: '1ʳᵉ personne du singulier (je…)',
    right: 'je pars',
    wrong: ['je part', 'je partis', 'je pare'],
    tip: '« je pars » : 3ᵉ groupe, terminaison en -s.',
  },
  {
    id: 'rendre-present',
    verb: 'rendre',
    tense: 'présent',
    person: '3ᵉ personne du singulier (il…)',
    right: 'il rend',
    wrong: ['il rends', 'il rende', 'il rendt'],
    tip: 'Verbes en -dre : il rend (pas de t ajouté).',
  },
  {
    id: 'ecrire-passe-compose',
    verb: 'écrire',
    tense: 'passé composé',
    person: '3ᵉ personne du singulier (il…)',
    right: 'il a écrit',
    wrong: ['il a écris', 'il a écrivé', 'il a écrivu'],
    tip: 'Participe passé irrégulier : écrit.',
  },
  {
    id: 'aller-futur',
    verb: 'aller',
    tense: 'futur simple',
    person: '1ʳᵉ personne du singulier (je…)',
    right: 'j’irai',
    wrong: ['j’allerai', 'j’irais', 'j’irerai'],
    tip: 'Au futur, « aller » devient ir- : j’irai. « J’irais » est du conditionnel.',
  },
  {
    id: 'faire-present-vous',
    verb: 'faire',
    tense: 'présent',
    person: '2ᵉ personne du pluriel (vous…)',
    right: 'vous faites',
    wrong: ['vous faisez', 'vous faitez', 'vous faisent'],
    tip: 'Un des trois verbes en -tes au présent : vous êtes, vous dites, vous faites.',
  },
  {
    id: 'pouvoir-passe-compose',
    verb: 'pouvoir',
    tense: 'passé composé',
    person: '1ʳᵉ personne du singulier (j’…)',
    right: 'j’ai pu',
    wrong: ['j’ai peu', 'j’ai pouvu', 'j’ai pouvé'],
    tip: 'Participe passé de « pouvoir » : pu — à ne pas confondre avec « peu ».',
  },
  {
    id: 'venir-imparfait',
    verb: 'venir',
    tense: 'imparfait',
    person: '3ᵉ personne du pluriel (ils…)',
    right: 'ils venaient',
    wrong: ['ils viennaient', 'ils venait', 'ils venaits'],
    tip: 'À l’imparfait, la 3ᵉ personne du pluriel se termine toujours par -aient.',
  },
]

// ------------------------------------------------------------- les paliers
// La banque est graduée par le TEMPS demandé, pas par le verbe : « qu'il
// prenne » au subjonctif piège un lycéen là où « ils vont » au présent ne
// piège plus personne dès la 6e.
//
// Elle est graduée par ORDRE et non par filtre : vingt-quatre formes ne
// suffisent pas à remplir cinq banques étanches, et un palier haut réduit à
// cinq questions re-servirait la même trois fois dans la partie — exactement ce
// que `lib/jeux/pools` interdit. On sert donc d'abord les temps du palier, puis
// les autres : la partie commence toujours à la bonne difficulté, et elle a de
// quoi tenir jusqu'au bout.

/** Le rang de difficulté d'un temps : 1 courant, 2 récit, 3 piège. */
export function tenseTier(tense: string): 1 | 2 | 3 {
  if (tense === 'présent' || tense === 'futur simple') return 1
  if (tense === 'imparfait' || tense === 'passé composé') return 2
  return 3
}

/** Ce que la banque sert à chaque palier — affiché sur la carte du jeu. */
export const CONJUGAISON_TIER_BRIEF: Record<PalierLevel, string> = {
  1: 'Présent et futur — les temps du quotidien',
  2: 'Présent, futur, imparfait',
  3: 'Tous les temps, mélangés',
  4: 'Passé composé, conditionnel et subjonctif d’abord',
  5: 'Subjonctif, conditionnel, passé simple — les temps qui piègent',
}

/**
 * Les groupes de temps servis à ce palier, dans l'ordre. Chaque groupe est
 * mélangé, les groupes s'enchaînent : le premier donne le ton de la partie.
 */
const TIER_ORDER: Record<PalierLevel, readonly (readonly number[])[]> = {
  1: [[1], [2], [3]],
  2: [[1, 2], [3]],
  3: [[1, 2, 3]],
  4: [[2, 3], [1]],
  5: [[3], [2], [1]],
}

function orderedForLevel(rng: () => number, tier: number): ConjugationItem[] {
  // La banque est FINIE : au-delà du dernier palier (épreuve ultime), il n'y a
  // rien de plus dur à servir. On reste donc sur l'ordre le plus exigeant
  // plutôt que d'inventer un cran qui n'existe pas — et c'est précisément
  // pourquoi ce jeu n'a pas encore d'épreuve ultime (cf. ULTIME_GAMES).
  const level = Math.min(PALIERS.length, Math.max(1, Math.round(tier))) as PalierLevel
  return TIER_ORDER[level].flatMap((group) =>
    shuffleWith(
      rng,
      CONJUGATIONS.filter((c) => group.includes(tenseTier(c.tense))),
    ),
  )
}

export function buildConjugaisonPool(
  seed: string,
  count = 30,
  tier: number = DEFAULT_PALIER,
): ModeQuestion[] {
  const rng = seededRng(`conjugaison:${tier}:${seed}`)
  const pool = orderedForLevel(rng, tier).slice(
    0,
    Math.min(count, CONJUGATIONS.length),
  )
  return pool.map((c) => {
    const options = shuffleWith(rng, [c.right, ...c.wrong])
    return {
      id: `jx-conj-${c.id}`,
      prompt: `Conjugue « ${c.verb} » — ${c.tense}, ${c.person}`,
      options,
      correctIndex: options.indexOf(c.right),
      explanation: c.tip,
      subject: 'Français',
    }
  })
}
