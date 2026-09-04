// -----------------------------------------------------------------------------
// LE COMMENTAIRE DE COURSE — les mots qui tombent pendant le duel, et les
// bulles du rival.
//
// Une course sans commentaire est une jauge qui bouge. Ce qui la rend vivante,
// c'est qu'on lui DISE ce qui vient d'arriver : « Nina te double », « Question
// dorée », « Sprint final ». Court, un seul message à la fois, jamais deux
// lignes — c'est le bandeau de Clash Royale, pas un chat.
//
// Le rival PARLE aussi, en bulle, quand il marque un coup ou en encaisse un :
// c'est ce qui le rend présent. Les phrases sont tirées de la graine et de son
// tempérament, donc un rival ne dit jamais deux fois la même chose dans la
// même course, et deux rivaux ne parlent pas pareil.
//
// Rien ici ne rabaisse l'élève. La moquerie vient du rival vers LUI-MÊME ou
// vers la course, jamais vers celui qui joue.
// -----------------------------------------------------------------------------

import { seededRng } from '@/lib/defi-modes'
import type { Temperament } from '@/lib/duel/rival'

export type CourseMoment =
  | 'depart'
  | 'me-double'
  | 'rival-double'
  | 'doree'
  | 'sprint'
  | 'serie-3'
  | 'serie-6'
  | 'serie-cassee'
  | 'me-arrivee'
  | 'rival-arrivee'
  | 'dernieres-secondes'

export type Commentaire = {
  texte: string
  /** Le ton pilote la couleur du bandeau : or = à moi, corail = au rival, violet = neutre. */
  ton: 'moi' | 'rival' | 'neutre' | 'dore'
}

/** Le bandeau d'un moment de course. */
export function commentaire(moment: CourseMoment, rivalName: string): Commentaire {
  switch (moment) {
    case 'depart':
      return { texte: 'Première barre pleine gagne !', ton: 'neutre' }
    case 'me-double':
      return { texte: 'Tu passes devant !', ton: 'moi' }
    case 'rival-double':
      return { texte: `${rivalName} te double !`, ton: 'rival' }
    case 'doree':
      return { texte: 'Question dorée · points ×2', ton: 'dore' }
    case 'sprint':
      return { texte: 'Sprint final !', ton: 'neutre' }
    case 'serie-3':
      return { texte: 'Série de 3 · points ×2', ton: 'moi' }
    case 'serie-6':
      return { texte: 'En feu · points ×3', ton: 'moi' }
    case 'serie-cassee':
      return { texte: 'Série perdue', ton: 'rival' }
    case 'me-arrivee':
      return { texte: 'Barre pleine !', ton: 'moi' }
    case 'rival-arrivee':
      return { texte: `${rivalName} a fini…`, ton: 'rival' }
    case 'dernieres-secondes':
      return { texte: 'Dix secondes !', ton: 'neutre' }
  }
}

/** Ce qui fait parler le rival. */
export type RivalMood = 'marque' | 'rate' | 'double' | 'double-par' | 'serie' | 'arrivee'

const BULLES: Record<Temperament, Record<RivalMood, string[]>> = {
  fleche: {
    marque: ['Hop !', 'Suivant !', 'Trop rapide.'],
    rate: ['Oups.', 'Trop vite…', 'Argh.'],
    double: ['Devant !', 'Je passe !'],
    'double-par': ['Hé !', 'Reviens là !'],
    serie: ['Ça enchaîne !', 'Rien ne m’arrête.'],
    arrivee: ['Fini !', 'Ligne franchie.'],
  },
  metronome: {
    marque: ['Une de plus.', 'Régulier.', 'Bien.'],
    rate: ['Hmm.', 'Pas celle-là.', 'Noté.'],
    double: ['Je reprends la tête.', 'Doucement mais sûrement.'],
    'double-par': ['Intéressant.', 'On verra à la fin.'],
    serie: ['Tout roule.', 'Comme une horloge.'],
    arrivee: ['Terminé.', 'Comme prévu.'],
  },
  finisseur: {
    marque: ['J’arrive.', 'Encore une.', 'Ça monte.'],
    rate: ['Pas grave.', 'Je garde mes forces.', 'Bof.'],
    double: ['Le sprint, c’est maintenant.', 'Te voilà derrière.'],
    'double-par': ['Profite, ça ne durera pas.', 'Je reviens.'],
    serie: ['Là, je décolle.', 'Ça y est.'],
    arrivee: ['Dernière ligne droite… gagnée.', 'Je vous l’avais dit.'],
  },
  irregulier: {
    marque: ['Ha ha !', 'Chanceux ?', 'Ça marche !'],
    rate: ['Zut.', 'N’importe quoi.', 'Ça arrive.'],
    double: ['Surprise !', 'Coucou.'],
    'double-par': ['Quoi ?!', 'Noooon.'],
    serie: ['Je suis lancé !', 'Ça, c’était pas prévu.'],
    arrivee: ['Fini ! Enfin je crois.', 'Waouh.'],
  },
}

/**
 * La bulle du rival pour un moment donné. `index` distingue les occurrences
 * dans la course (la 3e bonne réponse ne dit pas ce que disait la 1re).
 * Un replay (vrai élève) n'a pas de tempérament : il parle en métronome, la
 * voix la plus neutre — on ne fait pas dire à un vrai élève ce qu'il n'a pas dit.
 */
export function bulleRival(
  seed: string,
  temperament: Temperament | null,
  mood: RivalMood,
  index: number,
): string {
  const voix = BULLES[temperament ?? 'metronome'][mood]
  const rng = seededRng(`${seed}#bulle#${mood}#${index}`)
  return voix[Math.min(voix.length - 1, Math.floor(rng() * voix.length))]
}

/**
 * Le rival ne parle pas à chaque coup : ce serait un moulin. Il parle quand
 * quelque chose ARRIVE (dépassement, arrivée, série), et une bonne réponse
 * ordinaire ne fait parler qu'une fois sur trois.
 */
export function rivalParle(mood: RivalMood, index: number): boolean {
  if (mood === 'marque') return index % 3 === 1
  if (mood === 'rate') return index % 2 === 0
  return true
}
