// Classe-moi l'instrument — la banque du salon MUSIQUE (14/10/2026, Lucas :
// « pour la musique, oui, un mode sur les instruments »).
// Un instrument s'affiche : à quelle famille appartient-il ? Les leurres sont
// les autres familles de l'orchestre (cordes frottées, cordes pincées, bois,
// cuivres, percussions, claviers). Le sel du jeu : les pièges — le saxophone
// est en métal mais c'est un BOIS (il a une anche), la flûte traversière aussi,
// le piano est un clavier dont les cordes sont frappées…
//
// « Chaque mode commence doucement » : la banque est GRADUÉE — les instruments
// que tout le monde nomme aux premiers paliers, les pièges et les instruments
// rares ensuite. Générateur déterministe.
import { seededRng, type ModeQuestion } from '@/lib/defi-modes'
import { DEFAULT_PALIER } from '@/lib/jeux/paliers'
import { pickDistinct, shuffleWith } from '@/lib/jeux/shuffle'

export type FamilleInstrument =
  | 'Cordes frottées'
  | 'Cordes pincées'
  | 'Bois'
  | 'Cuivres'
  | 'Percussions'
  | 'Claviers'

const FAMILLES: FamilleInstrument[] = [
  'Cordes frottées',
  'Cordes pincées',
  'Bois',
  'Cuivres',
  'Percussions',
  'Claviers',
]

export type Instrument = {
  id: string
  name: string
  emoji: string
  famille: FamilleInstrument
  /** Premier palier où l'instrument est tiré (1 = dès le départ, 3 = confirmé, 4 = expert). */
  from: 1 | 3 | 4
  tip: string
}

export const INSTRUMENTS: readonly Instrument[] = [
  // --- Dès le départ : ceux que tout le monde nomme ------------------------
  { id: 'violon', name: 'le violon', emoji: '🎻', famille: 'Cordes frottées', from: 1, tip: 'Un archet frotte ses quatre cordes : cordes frottées.' },
  { id: 'guitare', name: 'la guitare', emoji: '🎸', famille: 'Cordes pincées', from: 1, tip: 'On pince ou on gratte ses cordes avec les doigts ou un médiator.' },
  { id: 'piano', name: 'le piano', emoji: '🎹', famille: 'Claviers', from: 1, tip: 'Un clavier : chaque touche lance un marteau sur une corde.' },
  { id: 'trompette', name: 'la trompette', emoji: '🎺', famille: 'Cuivres', from: 1, tip: 'On fait vibrer ses lèvres dans l’embouchure : un cuivre.' },
  { id: 'batterie', name: 'la batterie', emoji: '🥁', famille: 'Percussions', from: 1, tip: 'On la frappe : percussions.' },
  { id: 'flute-a-bec', name: 'la flûte à bec', emoji: '🪈', famille: 'Bois', from: 1, tip: 'Le souffle fend un biseau : un bois, celui de l’école.' },
  { id: 'violoncelle', name: 'le violoncelle', emoji: '🎻', famille: 'Cordes frottées', from: 1, tip: 'Le grand frère du violon, joué assis, à l’archet.' },
  { id: 'harpe', name: 'la harpe', emoji: '🪕', famille: 'Cordes pincées', from: 1, tip: 'Quarante-sept cordes pincées à la main.' },
  { id: 'tambour', name: 'le tambour', emoji: '🥁', famille: 'Percussions', from: 1, tip: 'Une peau tendue qu’on frappe : percussions.' },
  { id: 'clarinette', name: 'la clarinette', emoji: '🎶', famille: 'Bois', from: 1, tip: 'Une anche simple vibre contre le bec : un bois.' },
  { id: 'orgue', name: 'l’orgue', emoji: '🎹', famille: 'Claviers', from: 1, tip: 'Des claviers et un pédalier qui ouvrent des tuyaux.' },
  { id: 'trombone', name: 'le trombone', emoji: '🎺', famille: 'Cuivres', from: 1, tip: 'Une coulisse qui allonge le tube : un cuivre.' },
  { id: 'maracas', name: 'les maracas', emoji: '🪇', famille: 'Percussions', from: 1, tip: 'On les secoue : percussions.' },
  { id: 'ukulele', name: 'le ukulélé', emoji: '🎸', famille: 'Cordes pincées', from: 1, tip: 'Quatre cordes pincées, la petite guitare d’Hawaï.' },
  // --- Confirmé : les pièges et l'orchestre ---------------------------------
  { id: 'saxophone', name: 'le saxophone', emoji: '🎷', famille: 'Bois', from: 3, tip: 'En métal, mais une anche vibre dans le bec : c’est un BOIS. Le piège classique.' },
  { id: 'flute-traversiere', name: 'la flûte traversière', emoji: '🪈', famille: 'Bois', from: 3, tip: 'En métal aujourd’hui, mais née en bois : la famille a gardé son nom.' },
  { id: 'contrebasse', name: 'la contrebasse', emoji: '🎻', famille: 'Cordes frottées', from: 3, tip: 'La plus grave des cordes frottées — on la joue aussi en pizzicato dans le jazz.' },
  { id: 'cor', name: 'le cor d’harmonie', emoji: '📯', famille: 'Cuivres', from: 3, tip: 'Un tube enroulé de près de quatre mètres : un cuivre.' },
  { id: 'hautbois', name: 'le hautbois', emoji: '🎶', famille: 'Bois', from: 3, tip: 'Deux anches l’une contre l’autre : il donne le la à l’orchestre.' },
  { id: 'timbales', name: 'les timbales', emoji: '🥁', famille: 'Percussions', from: 3, tip: 'Des percussions accordées : on règle leur note avec une pédale.' },
  { id: 'clavecin', name: 'le clavecin', emoji: '🎹', famille: 'Claviers', from: 3, tip: 'Un clavier dont les cordes sont pincées par des plectres, pas frappées.' },
  { id: 'alto', name: 'l’alto', emoji: '🎻', famille: 'Cordes frottées', from: 3, tip: 'Entre le violon et le violoncelle, un peu plus grave que le violon.' },
  { id: 'xylophone', name: 'le xylophone', emoji: '🎵', famille: 'Percussions', from: 3, tip: 'Des lames de bois frappées avec des baguettes.' },
  { id: 'tuba', name: 'le tuba', emoji: '🎺', famille: 'Cuivres', from: 3, tip: 'Le plus grave des cuivres, la basse de la fanfare.' },
  { id: 'banjo', name: 'le banjo', emoji: '🪕', famille: 'Cordes pincées', from: 3, tip: 'Des cordes pincées sur une peau tendue : le son du bluegrass.' },
  { id: 'synthetiseur', name: 'le synthétiseur', emoji: '🎹', famille: 'Claviers', from: 3, tip: 'Un clavier électronique qui fabrique ses sons.' },
  // --- Expert : les instruments rares -----------------------------------------
  { id: 'basson', name: 'le basson', emoji: '🎶', famille: 'Bois', from: 4, tip: 'Une anche double sur un long tuyau replié : la basse des bois.' },
  { id: 'cor-anglais', name: 'le cor anglais', emoji: '🎶', famille: 'Bois', from: 4, tip: 'Ni cor, ni anglais : un hautbois plus grave, à anche double.' },
  { id: 'mandoline', name: 'la mandoline', emoji: '🪕', famille: 'Cordes pincées', from: 4, tip: 'Huit cordes pincées par paires, le trémolo italien.' },
  { id: 'vibraphone', name: 'le vibraphone', emoji: '🎵', famille: 'Percussions', from: 4, tip: 'Des lames de métal frappées, avec un moteur qui fait vibrer le son.' },
  { id: 'bugle', name: 'le bugle', emoji: '🎺', famille: 'Cuivres', from: 4, tip: 'Le cousin rond de la trompette, au son plus doux.' },
  { id: 'viole-de-gambe', name: 'la viole de gambe', emoji: '🎻', famille: 'Cordes frottées', from: 4, tip: 'L’ancêtre baroque du violoncelle, tenue entre les jambes.' },
  { id: 'celesta', name: 'le célesta', emoji: '🎹', famille: 'Claviers', from: 4, tip: 'Un clavier qui frappe des lames de métal : la fée Dragée de Casse-Noisette.' },
  { id: 'luth', name: 'le luth', emoji: '🪕', famille: 'Cordes pincées', from: 4, tip: 'Les cordes pincées de la Renaissance.' },
]

/** Un « brief » par palier, pour la carte du jeu (lib/jeux/palier-format). */
export const INSTRUMENT_TIER_BRIEF: Record<1 | 2 | 3 | 4 | 5, string> = {
  1: 'Les instruments que tout le monde nomme',
  2: 'Les instruments que tout le monde nomme',
  3: 'Les pièges : saxophone, flûte traversière, clavecin',
  4: 'Tout l’orchestre, jusqu’aux instruments rares',
  5: 'Tout l’orchestre, jusqu’aux instruments rares',
}

/** Les instruments tirables à ce palier. */
export function instrumentsForTier(tier: number): Instrument[] {
  const level = Math.min(5, Math.max(1, Math.round(tier))) || DEFAULT_PALIER
  return INSTRUMENTS.filter((i) => i.from <= level)
}

export function buildClasseInstrumentPool(
  seed: string,
  count = 30,
  tier: number = DEFAULT_PALIER,
): ModeQuestion[] {
  const rng = seededRng(`classe-instrument:${seed}:${tier}`)
  const stock = instrumentsForTier(tier)
  // Sans répétition tant que le stock suffit ; au-delà, on reboucle sur un
  // second mélange (une partie de 30 questions sur 14 instruments au palier 1).
  const ordre: Instrument[] = []
  while (ordre.length < count) ordre.push(...shuffleWith(rng, stock))
  return ordre.slice(0, count).map((instrument, i) => {
    const decoys = pickDistinct(
      rng,
      FAMILLES.filter((f) => f !== instrument.famille),
      3,
    )
    const options = shuffleWith(rng, [instrument.famille, ...decoys])
    return {
      id: `jx-musique-${instrument.id}-${i}`,
      prompt: `${instrument.emoji} ${instrument.name.charAt(0).toUpperCase()}${instrument.name.slice(1)} : quelle famille ?`,
      options,
      correctIndex: options.indexOf(instrument.famille),
      explanation: instrument.tip,
      subject: 'Musique',
    }
  })
}
