// -----------------------------------------------------------------------------
// LE BANC DES RIVAUX — vingt-quatre robots, chacun avec un visage, un prénom et
// un tempérament, pour que la course se joue SEUL sans jamais se jouer contre
// personne.
//
// LA RÈGLE D'HONNÊTETÉ, tenue dans la donnée elle-même : un robot est marqué
// comme tel (`isBot`), il n'a PAS d'établissement, et l'écran le dit d'un mot
// (« Rival d'entraînement ») et d'une pastille. On garde le plaisir d'un rival
// qui a un prénom et une manière de jouer — c'est ce qui le rend reconnaissable
// au troisième duel — sans raconter à un enfant qu'il affronte un camarade qui
// n'existe pas. Les VRAIS élèves, eux, arrivent par leurs replays
// (lib/duel/opponent), et passent toujours devant.
//
// Le tempérament n'est pas un décor : il déforme la ligne de temps du rival
// (lib/duel/rival.paceFactor). Une « flèche » marque tôt puis ralentit, un
// « finisseur » accélère dans les derniers mètres.
// -----------------------------------------------------------------------------

import { seededRng } from '@/lib/defi-modes'
import { DEFAULT_AVATAR, type AvatarConfig } from '@/lib/avatar'
import type { Temperament } from '@/lib/duel/rival'

export type Bot = {
  id: string
  /** Prénom seul, comme tout le social de l'app. */
  name: string
  temperament: Temperament
  /**
   * Décalage de force (−1..1) autour du réglage de la bande de trophées. C'est
   * la personnalité du robot, jamais un niveau de plus : l'appariement reste
   * celui de l'élève.
   */
  strength: number
  /** Sa devise, sur l'écran VS. Courte, jamais moqueuse. */
  motto: string
  avatar: AvatarConfig
}

type Look = Partial<
  Pick<
    AvatarConfig,
    'skinColor' | 'head' | 'face' | 'clothingColor' | 'backgroundColor' | 'accessories'
  >
>

function bot(
  id: string,
  name: string,
  temperament: Temperament,
  strength: number,
  motto: string,
  look: Look,
): Bot {
  return {
    id,
    name,
    temperament,
    strength,
    motto,
    avatar: { ...DEFAULT_AVATAR, ...look, equipment: '', banner: DEFAULT_AVATAR.banner },
  }
}

// Les valeurs de `look` sont toutes des options du vestiaire (lib/avatar) :
// une tête inconnue ferait retomber DiceBear sur un rendu vide.
export const BOTS: readonly Bot[] = [
  bot('nina', 'Nina', 'fleche', 0.2, 'Je pars vite. Très vite.', { skinColor: 'edb98a', head: 'mediumBangs', face: 'driven', clothingColor: 'e279c7', backgroundColor: 'ffd0d6' }),
  bot('sofiane', 'Sofiane', 'finisseur', 0.35, 'La fin, c’est mon moment.', { skinColor: 'ae5d29', head: 'short2', face: 'calm', clothingColor: '25557c', backgroundColor: 'b1e2ff' }),
  bot('yasmine', 'Yasmine', 'metronome', 0.1, 'Une question, une réponse.', { skinColor: 'd08b5b', head: 'hijab', face: 'smile', clothingColor: '78e185', backgroundColor: 'c7f0d8' }),
  bot('malo', 'Malo', 'irregulier', -0.2, 'Ça passe ou ça casse.', { skinColor: 'ffdbb4', head: 'mohawk', face: 'cheeky', clothingColor: 'ff5c5c', backgroundColor: 'ffe08a' }),
  bot('camille', 'Camille', 'metronome', 0, 'Régulière comme une horloge.', { skinColor: 'edb98a', head: 'bun', face: 'smileBig', clothingColor: '9ddadb', backgroundColor: 'd9ccff' }),
  bot('ilyes', 'Ilyes', 'fleche', -0.3, 'Premier sur la ligne.', { skinColor: '8d5524', head: 'shaved2', face: 'smileLOL', clothingColor: 'fdea6b', backgroundColor: 'b9a6ff' }),
  bot('tom', 'Tom', 'irregulier', -0.5, 'Je réfléchis… parfois.', { skinColor: 'ffdbb4', head: 'short4', face: 'awe', clothingColor: '5199e4', backgroundColor: 'ffffff' }),
  bot('awa', 'Awa', 'finisseur', 0.55, 'Attends la dernière ligne droite.', { skinColor: '694d3d', head: 'twists', face: 'serious', clothingColor: '7c4dff', backgroundColor: 'ffe08a' }),
  bot('lea', 'Léa', 'metronome', 0.25, 'Pas de panique, jamais.', { skinColor: 'ffdbb4', head: 'longBangs', face: 'cute', clothingColor: 'e78276', backgroundColor: 'ffd0d6' }),
  bot('hugo', 'Hugo', 'fleche', 0.4, 'Le premier point est pour moi.', { skinColor: 'edb98a', head: 'flatTop', face: 'driven', clothingColor: '262e33', backgroundColor: 'b1e2ff' }),
  bot('jade', 'Jade', 'irregulier', 0.1, 'Surprise.', { skinColor: 'd08b5b', head: 'longCurly', face: 'suspicious', clothingColor: 'a7ffc4', backgroundColor: 'd9ccff' }),
  bot('sacha', 'Sacha', 'finisseur', -0.1, 'Je monte en puissance.', { skinColor: 'ffdbb4', head: 'medium2', face: 'smileTeethGap', clothingColor: 'ffcf77', backgroundColor: 'c7f0d8' }),
  bot('naim', 'Naïm', 'metronome', -0.35, 'Tranquille, mais sûr.', { skinColor: 'ae5d29', head: 'short5', face: 'eyesClosed', clothingColor: 'e6e6e6', backgroundColor: 'b9a6ff' }),
  bot('manon', 'Manon', 'fleche', 0.05, 'Trois questions, trois points.', { skinColor: 'edb98a', head: 'bangs2', face: 'lovingGrin1', clothingColor: 'ff5c5c', backgroundColor: 'ffffff' }),
  bot('nour', 'Nour', 'finisseur', 0.2, 'Je finis toujours fort.', { skinColor: 'd08b5b', head: 'bun2', face: 'smile', clothingColor: '5199e4', backgroundColor: 'ffe08a' }),
  bot('theo', 'Théo', 'irregulier', 0.3, 'Un éclair, puis un trou.', { skinColor: 'ffdbb4', head: 'pomp', face: 'explaining', clothingColor: '25557c', backgroundColor: 'ffd0d6' }),
  bot('louna', 'Louna', 'metronome', 0.45, 'Chaque seconde compte.', { skinColor: 'edb98a', head: 'long', face: 'solemn', clothingColor: '7c4dff', backgroundColor: 'c7f0d8' }),
  bot('rayan', 'Rayan', 'fleche', -0.15, 'Départ canon.', { skinColor: '8d5524', head: 'cornrows', face: 'smileBig', clothingColor: '78e185', backgroundColor: 'b1e2ff' }),
  bot('ines', 'Inès', 'finisseur', 0, 'Patience, puis tout d’un coup.', { skinColor: 'd08b5b', head: 'mediumStraight', face: 'calm', clothingColor: 'e279c7', backgroundColor: 'd9ccff' }),
  bot('gabriel', 'Gabriel', 'metronome', -0.2, 'Ni vite, ni lent : juste.', { skinColor: 'ffdbb4', head: 'short3', face: 'blank', clothingColor: '9ddadb', backgroundColor: 'ffffff', accessories: 'glasses' }),
  bot('zoe', 'Zoé', 'irregulier', -0.4, 'On verra bien !', { skinColor: 'edb98a', head: 'buns', face: 'smileLOL', clothingColor: 'fdea6b', backgroundColor: 'ffd0d6' }),
  bot('adam', 'Adam', 'fleche', 0.5, 'Je ne laisse rien passer.', { skinColor: 'ae5d29', head: 'shaved1', face: 'driven', clothingColor: '262e33', backgroundColor: 'ffe08a' }),
  bot('lina', 'Lina', 'finisseur', 0.3, 'Le sprint, c’est chez moi.', { skinColor: '694d3d', head: 'afro', face: 'cheeky', clothingColor: 'a7ffc4', backgroundColor: 'b9a6ff' }),
  bot('mathis', 'Mathis', 'metronome', 0.15, 'Une bonne réponse à la fois.', { skinColor: 'ffdbb4', head: 'hatBeanie', face: 'smile', clothingColor: 'ff5c5c', backgroundColor: 'c7f0d8', accessories: 'glasses2' }),
]

/** Un robot par identifiant, ou null. */
export function botById(id: string): Bot | null {
  return BOTS.find((b) => b.id === id) ?? null
}

/**
 * Le robot d'un duel, tiré de la graine. On écarte un homonyme de l'élève (le
 * face-à-face se casserait) et, si on nous le dit, le rival de la course
 * précédente — deux fois Nina d'affilée, ce n'est plus une rencontre.
 */
export function pickBot(
  seed: string,
  options: { excludeName?: string | null; excludeId?: string | null } = {},
): Bot {
  const rng = seededRng(`${seed}#robot`)
  const first = (options.excludeName ?? '').trim().split(' ')[0].toLowerCase()
  const eligible = BOTS.filter(
    (b) => b.id !== options.excludeId && b.name.toLowerCase() !== first,
  )
  const pool = eligible.length > 0 ? eligible : BOTS
  return pool[Math.min(pool.length - 1, Math.floor(rng() * pool.length))]
}

/** Le libellé du tempérament, pour la fiche du rival. */
export function temperamentLabel(t: Temperament): string {
  switch (t) {
    case 'fleche':
      return 'Part en flèche'
    case 'metronome':
      return 'Métronome'
    case 'finisseur':
      return 'Finit fort'
    case 'irregulier':
      return 'Imprévisible'
  }
}
