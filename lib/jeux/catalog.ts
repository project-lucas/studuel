// L'espace Jeux — catalogue et déblocage, logique pure.
// Deux ailes : les SALONS (1v1 par matière, réservés à ceux qui ont fait
// leurs preuves dans la matière) et les ÉQUIPES (2v2 entre amis, ouverts à
// tous — on gagne ou on perd ensemble). Les composants ne font qu'afficher.
import { MASTERY_THRESHOLDS, type ChapterMastery } from '@/lib/mastery'

// ------------------------------------------------------------------ salons

// Jeux réellement jouables aujourd'hui (les autres sont annoncés « bientôt »).
// Chaque id ci-dessous a sa banque de questions dans lib/jeux et son entrée
// dans POOL_BUILDERS (app/defi/jeux/[jeu]).
export type SalonGameId =
  | 'capitales'
  | 'orthographe'
  | 'conjugaison-eclair'
  | 'chasse-faute'
  | 'calcul-mental'
  | 'suite-logique'
  | 'traduction-flash'
  | 'faux-amis'
  | 'traduccion-flash'
  | 'falsos-amigos'
  | 'classe-moi-ca'
  | 'chasse-elements'
  | 'bonne-unite'
  | 'anatomie-express'
  | 'frise-folle'
  | 'phrase-en-vrac'
  | 'compte-est-bon'

export type SalonGame = {
  id: string
  name: string
  emoji: string
  tagline: string
  implemented: boolean
}

export type Salon = {
  subject: string
  emoji: string
  games: SalonGame[]
}

// Un catalogue volontairement fourni : chaque matière a ses jeux, pour que
// chacun trouve le sien. Les « bientôt » affichent la promesse sans mentir.
export const SALONS: Salon[] = [
  {
    subject: 'Histoire-Géo',
    emoji: '🌍',
    games: [
      {
        id: 'capitales',
        name: 'Capitales du monde',
        emoji: '🗺️',
        tagline: 'Drapeau affiché, 4 capitales — le plus rapide marque',
        implemented: true,
      },
      {
        id: 'frise-folle',
        name: 'La Frise folle',
        emoji: '📜',
        tagline: '5 événements à remettre dans l’ordre chronologique',
        implemented: true,
      },
      {
        id: 'pointe-carte',
        name: 'Pointe la carte',
        emoji: '📍',
        tagline: 'Touche la bonne zone sur la carte muette',
        implemented: false,
      },
    ],
  },
  {
    subject: 'Français',
    emoji: '✏️',
    games: [
      {
        id: 'orthographe',
        name: 'Duel d’orthographe',
        emoji: '🖋️',
        tagline: '40 secondes pour reconnaître la bonne orthographe',
        implemented: true,
      },
      {
        id: 'chasse-faute',
        name: 'Chasse à la faute',
        emoji: '🔎',
        tagline: 'Quatre mots, une seule faute — débusque l’intrus',
        implemented: true,
      },
      {
        id: 'conjugaison-eclair',
        name: 'Conjugaison éclair',
        emoji: '⚡',
        tagline: '« prendre, subjonctif présent, 3e personne » — chrono court',
        implemented: true,
      },
    ],
  },
  {
    subject: 'Maths',
    emoji: '🔢',
    games: [
      {
        id: 'calcul-mental',
        name: 'Calcul mental éclair',
        emoji: '🧮',
        tagline: 'Les opérations s’enchaînent de plus en plus vite',
        implemented: true,
      },
      {
        id: 'compte-est-bon',
        name: 'Le compte est bon',
        emoji: '🎯',
        tagline: 'Six plaques, un nombre cible — fabrique le compte',
        implemented: true,
      },
      {
        id: 'suite-logique',
        name: 'Suite logique',
        emoji: '🔮',
        tagline: 'Devine le terme suivant avant l’adversaire',
        implemented: true,
      },
    ],
  },
  {
    subject: 'Anglais',
    emoji: '🗣️',
    games: [
      {
        id: 'traduction-flash',
        name: 'Traduction flash',
        emoji: '💬',
        tagline: 'Un mot, 4 traductions — vitesse pure',
        implemented: true,
      },
      {
        id: 'faux-amis',
        name: 'Faux amis',
        emoji: '🎭',
        tagline: '« actually » ≠ actuellement — évite le piège',
        implemented: true,
      },
      {
        id: 'phrase-en-vrac',
        name: 'Phrase en vrac',
        emoji: '🧩',
        tagline: 'Remets les mots dans l’ordre avant la fin du chrono',
        implemented: true,
      },
    ],
  },
  {
    subject: 'Espagnol',
    emoji: '💃',
    games: [
      {
        id: 'traduccion-flash',
        name: 'Traducción flash',
        emoji: '💬',
        tagline: 'Una palabra, 4 traductions — vitesse pure',
        implemented: true,
      },
      {
        id: 'falsos-amigos',
        name: 'Falsos amigos',
        emoji: '🎭',
        tagline: '« constipado » ≠ constipé — évite le piège',
        implemented: true,
      },
    ],
  },
  {
    subject: 'SVT',
    emoji: '🧬',
    games: [
      {
        id: 'anatomie-express',
        name: 'Anatomie express',
        emoji: '🦴',
        tagline: 'Touche l’organe demandé sur la silhouette',
        implemented: true,
      },
      {
        id: 'classe-moi-ca',
        name: 'Classe-moi ça',
        emoji: '🐾',
        tagline: 'Mammifère, reptile ou amphibien ? Tri rapide',
        implemented: true,
      },
    ],
  },
  {
    subject: 'Physique-Chimie',
    emoji: '⚗️',
    games: [
      {
        id: 'chasse-elements',
        name: 'Chasse aux éléments',
        emoji: '🧪',
        tagline: 'Le nom de l’élément, retrouve son symbole',
        implemented: true,
      },
      {
        id: 'bonne-unite',
        name: 'La bonne unité',
        emoji: '📏',
        tagline: 'Associe grandeur et unité à toute vitesse',
        implemented: true,
      },
    ],
  },
]

// Jeu jouable par id (les liens profonds ne doivent ouvrir que du réel).
export function playableSalonGame(
  id: string,
): { salon: Salon; game: SalonGame } | null {
  for (const salon of SALONS) {
    const game = salon.games.find((g) => g.id === id && g.implemented)
    if (game) return { salon, game }
  }
  return null
}

// --------------------------------------------------------------- déblocage
// Un salon s'ouvre quand l'élève a fait ses preuves dans la matière : AU MOINS
// UN chapitre maîtrisé (≥ 80 %, le seuil « or » du carnet). Règle unique et
// lisible — l'élève sait exactement quoi faire pour entrer.

export const SALON_UNLOCK_VALUE = MASTERY_THRESHOLDS.mastered

export type SalonState = {
  unlocked: boolean
  // Meilleure maîtrise de chapitre dans la matière (0..1) — la jauge vers
  // l'ouverture du salon.
  best: number
}

export function salonState(chapterValues: number[]): SalonState {
  const best = chapterValues.reduce((m, v) => Math.max(m, v), 0)
  return { unlocked: best >= SALON_UNLOCK_VALUE, best }
}

// États de tous les salons à partir des chapitres par matière et de la
// maîtrise par chapitre. Une matière absente du programme (aucun chapitre)
// reste verrouillée à 0 — le salon affiche sa promesse sans être ouvrable.
export function salonStates(
  chaptersBySubject: Map<string, string[]>,
  mastery: ChapterMastery,
): Map<string, SalonState> {
  const states = new Map<string, SalonState>()
  for (const salon of SALONS) {
    const chapterIds = chaptersBySubject.get(salon.subject) ?? []
    const values = chapterIds.map((id) => mastery.get(id)?.value ?? 0)
    states.set(salon.subject, salonState(values))
  }
  return states
}

// ------------------------------------------------------------------ équipes
// Les modes 2v2 : ouverts à tous, sans condition. Le fort porte, le moins
// fort participe — les récompenses sont les mêmes pour toute l'équipe.

export type TeamGame = {
  id: string
  name: string
  emoji: string
  tagline: string
  implemented: boolean
}

export const TEAM_GAMES: TeamGame[] = [
  {
    id: 'relais-2v2',
    name: 'Relais 2v2',
    emoji: '🤝',
    tagline:
      'Vous répondez en alternance, un seul score : on gagne ou on perd ensemble',
    implemented: false,
  },
  {
    id: 'cerveau-collectif',
    name: 'Cerveau collectif',
    emoji: '🧠',
    tagline:
      '2 jetons « SOS coéquipier » chacun — être aidé fait partie du jeu',
    implemented: false,
  },
  {
    id: 'deux-contre-deux',
    name: '2v2 toutes matières',
    emoji: '🌈',
    tagline:
      'Le tirage alterne les matières : chacun a ses questions où briller',
    implemented: false,
  },
]
