// Le FORMAT de chaque jeu de salon — sa règle, son rythme, sa robe, son timbre.
//
// Pourquoi ce fichier existe : les jeux de salon partageaient jusqu'ici UNE
// SEULE table de jeu (un duel BO3 identique pour tous). Chaque jeu est pourtant
// vendu par une illustration qui promet une expérience à part — on cliquait sur
// « Chasse à la faute » et on retombait sur le duel de « Capitales du monde ».
// La promesse était trahie à la seconde où la partie démarrait.
//
// Ici, chaque jeu déclare : sa MÉCANIQUE (5 familles réellement différentes),
// ses PARAMÈTRES (rythme, vies, paliers), son LEXIQUE (on ne dit pas « manche »
// dans une expédition, on dit « escale »), sa ROBE (thème de couleurs défini en
// tokens dans globals.css) et son TIMBRE sonore. Tout est pur et testable ; les
// composants ne font que jouer ce que ce fichier décrit.
import type { SalonGameId } from '@/lib/jeux/catalog'
import type { GameTimbre } from '@/lib/game-audio'

// ------------------------------------------------------------- les mécaniques
// Cinq familles, choisies pour être opposées dans la SENSATION, pas seulement
// dans les réglages. Deux jeux d'une même matière ne partagent jamais la même.

export type GameMechanic =
  /** Chrono global, on enchaîne le plus possible. Récompense la vitesse pure. */
  | 'sprint'
  /** Pas de chrono : des vies. Récompense la prudence, punit le piège. */
  | 'vies'
  /** Des vagues successives, de plus en plus rapides. Récompense l'endurance. */
  | 'paliers'
  /** Un parcours fini d'escales, sans mort possible. Récompense l'exactitude. */
  | 'expedition'
  /** Une échelle : on monte d'un étage, on retombe sur erreur. Récompense la série. */
  | 'ascension'
  /**
   * Des tableaux d'éléments mélangés à remettre dans l'ordre en les touchant.
   * La seule mécanique qui n'est PAS un QCM — d'où son intérêt : elle apporte au
   * catalogue un geste que rien d'autre ne fait.
   */
  | 'ordre'

// --------------------------------------------------------------- les paramètres

export type SprintParams = {
  /** Durée totale de la course. */
  seconds: number
  /** Sous ce temps de réponse (ms), la réponse rapporte le bonus de vitesse. */
  fastMs: number
}

export type ViesParams = {
  /** Nombre d'erreurs tolérées avant la fin. */
  lives: number
  /** Chrono par question, ou null si le jeu laisse réfléchir. */
  questionSeconds: number | null
  /**
   * Bonnes réponses à accumuler pour gagner. Sans objectif, un mode à vies est
   * une punition sans horizon : on joue jusqu'à mourir, et on meurt toujours.
   */
  target: number
}

export type PaliersParams = {
  /** Nombre de vagues à franchir pour gagner. */
  waves: number
  /** Questions par vague. */
  waveSize: number
  /** Chrono par question de la 1re vague. */
  startSeconds: number
  /** Secondes retirées au chrono à chaque vague suivante (plancher à 2 s). */
  stepSeconds: number
  /** Erreurs tolérées sur l'ensemble de la partie. */
  lives: number
}

export type ExpeditionParams = {
  /** Nombre d'escales du parcours. */
  stops: number
  /** Chrono par escale (généreux : ici on ne court pas). */
  questionSeconds: number
}

export type AscensionParams = {
  /** Étage à atteindre pour gagner. */
  floors: number
  /** Étages perdus à chaque erreur. */
  fall: number
  /** Chrono par question, ou null. */
  questionSeconds: number | null
  /**
   * Essais accordés pour atteindre le sommet. SANS cette borne, l'ascension est
   * la seule mécanique du catalogue qui ne peut PAS être perdue : ni vies, ni
   * chrono global, et une erreur ne fait que redescendre. Un élève qui alterne
   * juste/faux monte et redescend indéfiniment, sans autre issue que
   * « Abandonner » — et le `lexicon.lose` de ces jeux était du code mort,
   * jamais affichable.
   */
  attempts: number
}

export type OrdreParams = {
  /**
   * Tableaux à reconstituer pour gagner, ou `null` quand c'est le chrono qui
   * décide de la fin (on en fait le plus possible).
   */
  boards: number | null
  /** Chrono global, ou `null` si le jeu se joue sur les vies. */
  globalSeconds: number | null
  /** Erreurs tolérées, ou `null` si le jeu ne tue pas. */
  lives: number | null
  /** Éléments par tableau — la promesse affichée (« 5 événements »). */
  itemsPerBoard: number
}

export type MechanicParams =
  | { mechanic: 'sprint'; sprint: SprintParams }
  | { mechanic: 'vies'; vies: ViesParams }
  | { mechanic: 'paliers'; paliers: PaliersParams }
  | { mechanic: 'expedition'; expedition: ExpeditionParams }
  | { mechanic: 'ascension'; ascension: AscensionParams }
  | { mechanic: 'ordre'; ordre: OrdreParams }

// ------------------------------------------------------------------- la robe
// Un thème = une classe `.jeu-<theme>` dans globals.css qui pose les variables
// `--jeu-accent`, `--jeu-ink`, `--jeu-surface`, `--jeu-glow`. Aucune couleur en
// dur ici ni dans les composants : on ne manipule que le NOM du thème.

export type GameTheme =
  | 'anatomie'
  | 'plaques'
  | 'frise'
  | 'grammaire'
  | 'atlas'
  | 'plume'
  | 'loupe'
  | 'foudre'
  | 'circuit'
  | 'oracle'
  | 'union'
  | 'masque'
  | 'fiesta'
  | 'mirage'
  | 'jungle'
  | 'labo'
  | 'regle'

// Le timbre sonore du jeu vit dans lib/game-audio.ts : c'est lui qui définit le
// vocabulaire des couleurs sonores (et les modes de l'Arène s'en servent aussi).
export type { GameTimbre } from '@/lib/game-audio'

/** Disposition des réponses — un jeu de tri ne se lit pas comme une traduction. */
export type GameLayout =
  /** Grille 2×2 : le regard balaye, idéal pour des réponses courtes. */
  | 'grille'
  /** Liste verticale : pour des réponses longues (phrases, définitions). */
  | 'liste'
  /** Deux gros boutons face à face : le choix binaire, tranché. */
  | 'duo'

/** Le vocabulaire du jeu — ce qui fait qu'on ne se croit pas dans un autre. */
export type GameLexicon = {
  /** L'ordre donné au joueur, au-dessus de la question. */
  verb: string
  /** Le nom d'une étape au singulier (« escale », « vague », « étage »). */
  step: string
  /** Le nom d'une étape au pluriel. */
  steps: string
  /** Le nom d'une réussite (« capitale trouvée », « piège évité »). */
  hit: string
  /** Le cri de victoire de l'écran de fin. */
  win: string
  /** Le mot de la fin quand c'est raté — jamais humiliant. */
  lose: string
}

export type GameFormat = {
  id: SalonGameId
  theme: GameTheme
  timbre: GameTimbre
  layout: GameLayout
  /** La règle en UNE phrase, affichée plein écran avant de lancer. */
  rule: string
  /** Émoji de scène, plus grand et plus présent que celui du catalogue. */
  emoji: string
  lexicon: GameLexicon
  params: MechanicParams
}

// Plancher du chrono par question des paliers : en dessous, la vitesse cesse
// d'être un défi et devient une loterie.
export const MIN_WAVE_SECONDS = 2

/** Chrono par question de la vague `index` (0-based) d'un format à paliers. */
export function waveSeconds(p: PaliersParams, index: number): number {
  return Math.max(MIN_WAVE_SECONDS, p.startSeconds - p.stepSeconds * index)
}

// ------------------------------------------------------------------ catalogue

export const GAME_FORMATS: Record<SalonGameId, GameFormat> = {
  // --- Histoire-Géo ---------------------------------------------------------
  // Un tour du monde : 8 escales, aucune mort possible, on va au bout. Le jeu
  // le plus SEREIN du catalogue — on découvre, on ne subit pas.
  capitales: {
    id: 'capitales',
    theme: 'atlas',
    timbre: 'bois',
    layout: 'grille',
    rule: '8 escales autour du monde. Personne ne t’élimine : va au bout et compte tes drapeaux.',
    emoji: '🧭',
    lexicon: {
      verb: 'Quelle est sa capitale ?',
      step: 'escale',
      steps: 'escales',
      hit: 'drapeau planté',
      win: 'Tour du monde bouclé !',
      lose: 'Retour au port',
    },
    params: { mechanic: 'expedition', expedition: { stops: 8, questionSeconds: 12 } },
  },

  // La frise : la seule mécanique du catalogue qui ne soit pas un QCM. On touche
  // 5 événements du plus ancien au plus récent, et chaque tuile posée révèle sa
  // date — le jeu corrige en même temps qu'il teste. Lent, réfléchi, sans chrono :
  // l'exact opposé de « Phrase en vrac », qui partage pourtant le même geste.
  'frise-folle': {
    id: 'frise-folle',
    theme: 'frise',
    timbre: 'bois',
    layout: 'liste',
    rule: '4 frises de 5 événements, du plus ancien au plus récent. Aucun chrono, mais 3 erreurs.',
    emoji: '📜',
    lexicon: {
      verb: 'Touche-les du plus ancien au plus récent',
      step: 'frise',
      steps: 'frises',
      hit: 'événement placé',
      win: 'Toutes les frises remontées !',
      lose: 'Le fil du temps s’est cassé',
    },
    params: {
      mechanic: 'ordre',
      ordre: {
        boards: 4,
        globalSeconds: null,
        lives: 3,
        itemsPerBoard: 5,
      },
    },
  },

  // --- Français -------------------------------------------------------------
  // Duel d'orthographe : le mot juste contre son sosie fautif, ou l'homophone
  // qui manque dans la phrase. Aucun temps mort. Le format le plus INSTINCTIF du
  // catalogue — on ne réfléchit pas, on reconnaît. D'où le sprint le plus court
  // et le seuil de vitesse le plus serré : ici, hésiter c'est déjà avoir perdu
  // du temps. (Le plus souvent deux propositions, trois quand l'homophone
  // l'exige : ses/ces/s'est, quel/quelle/qu'elle.)
  orthographe: {
    id: 'orthographe',
    theme: 'plume',
    timbre: 'cristal',
    layout: 'duo',
    rule: '40 secondes en tout, aucun chrono par question. Reconnais la bonne orthographe — ne la déduis pas.',
    emoji: '🖋️',
    lexicon: {
      verb: 'Laquelle s’écrit comme ça ?',
      step: 'passe',
      steps: 'passes',
      hit: 'graphie juste',
      win: 'Duel remporté !',
      lose: 'Fin de la passe d’armes',
    },
    params: { mechanic: 'sprint', sprint: { seconds: 40, fastMs: 1800 } },
  },

  // La chasse : on traque l'intrus. Pas de chrono — on OBSERVE. Mais 3 vies :
  // se tromper de proie coûte cher.
  'chasse-faute': {
    id: 'chasse-faute',
    theme: 'loupe',
    timbre: 'velours',
    layout: 'grille',
    rule: '12 fautes à débusquer. Prends ton temps — mais tu n’as que 3 fausses pistes.',
    emoji: '🔎',
    lexicon: {
      verb: 'Débusque le mot fautif',
      step: 'prise',
      steps: 'prises',
      hit: 'faute débusquée',
      win: 'Chasse fructueuse !',
      lose: 'La faute s’est échappée',
    },
    params: {
      mechanic: 'vies',
      vies: { lives: 3, questionSeconds: null, target: 12 },
    },
  },

  // Conjugaison éclair : le nom promet la foudre — donc des vagues courtes et
  // brutales, 6 questions par vague, chrono qui fond.
  'conjugaison-eclair': {
    id: 'conjugaison-eclair',
    theme: 'foudre',
    timbre: 'cuivre',
    layout: 'liste',
    rule: '3 orages de 6 éclairs. Chaque orage laisse une seconde de moins que le précédent.',
    emoji: '⚡',
    lexicon: {
      verb: 'Conjugue, vite',
      step: 'orage',
      steps: 'orages',
      hit: 'éclair',
      win: 'Tempête maîtrisée !',
      lose: 'Foudroyé',
    },
    params: {
      mechanic: 'paliers',
      paliers: { waves: 3, waveSize: 6, startSeconds: 7, stepSeconds: 1, lives: 4 },
    },
  },

  // --- Maths ----------------------------------------------------------------
  // La machine : 4 régimes, de plus en plus rapides. C'est le format à paliers
  // le plus EXIGEANT (2 vies seulement) — le calcul mental se mérite.
  'calcul-mental': {
    id: 'calcul-mental',
    theme: 'circuit',
    timbre: 'metal',
    layout: 'grille',
    rule: 'La machine accélère : 4 régimes, 5 opérations chacun. 2 grains de sable et elle cale.',
    emoji: '⚙️',
    lexicon: {
      verb: 'Calcule',
      step: 'régime',
      steps: 'régimes',
      hit: 'rouage aligné',
      win: 'Machine poussée à fond !',
      lose: 'La machine a calé',
    },
    params: {
      mechanic: 'paliers',
      paliers: { waves: 4, waveSize: 5, startSeconds: 8, stepSeconds: 1.5, lives: 2 },
    },
  },

  // Le seul jeu du catalogue où l'on FABRIQUE la réponse au lieu de la choisir.
  // Il tourne en expédition (5 tirages, aucune élimination) avec un chrono par
  // tirage très large : ici, la difficulté est le calcul, pas la panique. C'est
  // aussi le format le plus LENT du catalogue, ce qui le rend inconfondable
  // avec le calcul mental de la même matière.
  'compte-est-bon': {
    id: 'compte-est-bon',
    theme: 'plaques',
    timbre: 'metal',
    layout: 'grille',
    rule: '5 tirages. Six plaques, un nombre à fabriquer, 75 secondes chacun — et le droit de tout annuler.',
    emoji: '🎯',
    lexicon: {
      verb: 'Fabrique le compte',
      step: 'tirage',
      steps: 'tirages',
      hit: 'compte trouvé',
      win: 'Le compte est bon !',
      lose: 'Le compte n’y est pas',
    },
    params: { mechanic: 'expedition', expedition: { stops: 5, questionSeconds: 75 } },
  },

  // L'oracle : aucune pression temporelle, mais une échelle. Chaque bonne
  // réponse monte d'un étage, chaque erreur en fait redescendre deux. C'est le
  // seul jeu où l'on peut jouer longtemps SANS jamais finir — la tension vient
  // de la chute, pas du chrono.
  'suite-logique': {
    id: 'suite-logique',
    theme: 'oracle',
    timbre: 'velours',
    layout: 'grille',
    rule: 'Monte 10 étages. Une bonne réponse : +1. Une erreur : −2. Aucun chrono — réfléchis.',
    emoji: '🔮',
    lexicon: {
      verb: 'Quel terme vient ensuite ?',
      step: 'étage',
      steps: 'étages',
      hit: 'palier franchi',
      win: 'Sommet atteint !',
      lose: 'Redescendu au rez-de-chaussée',
    },
    params: {
      mechanic: 'ascension',
      // 30 essais pour 10 étages : large pour qui progresse (10 suffisent en
      // sans-faute), fini pour qui yo-yote.
      ascension: { floors: 10, fall: 2, questionSeconds: null, attempts: 30 },
    },
  },

  // --- Anglais --------------------------------------------------------------
  // Sprint pur : 45 secondes, combo, bonus de vitesse. Le jeu le plus NERVEUX.
  'traduction-flash': {
    id: 'traduction-flash',
    theme: 'union',
    timbre: 'cristal',
    layout: 'grille',
    rule: '45 secondes chrono. Enchaîne sans faute : la série multiplie tes points.',
    emoji: '💨',
    lexicon: {
      verb: 'Traduis',
      step: 'mot',
      steps: 'mots',
      hit: 'mot traduit',
      win: 'Sprint bouclé !',
      lose: 'Temps écoulé',
    },
    params: { mechanic: 'sprint', sprint: { seconds: 45, fastMs: 2500 } },
  },

  // Champ de mines : les faux amis SONT des pièges, donc le format punit — 2
  // vies seulement, et un chrono court qui empêche de trop réfléchir (c'est en
  // réfléchissant trop qu'on tombe dans le piège).
  'faux-amis': {
    id: 'faux-amis',
    theme: 'masque',
    timbre: 'bois',
    layout: 'liste',
    rule: '10 pièges à déjouer. 2 erreurs et c’est fini — 6 secondes pour trancher.',
    emoji: '🎭',
    lexicon: {
      verb: 'Ne tombe pas dans le piège',
      step: 'piège',
      steps: 'pièges',
      hit: 'piège évité',
      win: 'Aucun piège ne t’a eu !',
      lose: 'Le piège s’est refermé',
    },
    params: {
      mechanic: 'vies',
      vies: { lives: 2, questionSeconds: 6, target: 10 },
    },
  },

  // Même geste que la Frise folle, jeu opposé : ici on court. Pas de vies, un
  // chrono de 75 secondes, et on compte les phrases reconstruites. Une erreur ne
  // tue pas — elle coûte le temps qu'on met à comprendre pourquoi.
  'phrase-en-vrac': {
    id: 'phrase-en-vrac',
    theme: 'grammaire',
    timbre: 'cristal',
    layout: 'liste',
    rule: '75 secondes pour remettre debout un maximum de phrases anglaises. Aucune vie à perdre.',
    emoji: '🧩',
    lexicon: {
      verb: 'Remets la phrase dans l’ordre',
      step: 'phrase',
      steps: 'phrases',
      hit: 'mot placé',
      win: 'Temps écoulé — belle récolte !',
      lose: 'Temps écoulé',
    },
    params: {
      mechanic: 'ordre',
      ordre: {
        boards: null,
        globalSeconds: 75,
        lives: null,
        itemsPerBoard: 6,
      },
    },
  },

  // --- Espagnol -------------------------------------------------------------
  // Même famille que l'anglais, mais un tempo à part : plus long, plus dansant,
  // bonus de vitesse plus large (on célèbre le rythme, pas la panique).
  'traduccion-flash': {
    id: 'traduccion-flash',
    theme: 'fiesta',
    timbre: 'cuivre',
    layout: 'grille',
    rule: '60 secondes de fiesta. Plus la série est longue, plus la musique monte.',
    emoji: '🎊',
    lexicon: {
      verb: 'Traduis',
      step: 'palabra',
      steps: 'palabras',
      hit: 'mot traduit',
      win: '¡Olé !',
      lose: 'Se acabó el tiempo',
    },
    params: { mechanic: 'sprint', sprint: { seconds: 60, fastMs: 3200 } },
  },

  // Mirage : 3 vies (plus clément que les faux amis anglais) et un chrono LARGE
  // — assez pour relire la phrase espagnole, trop court pour ruminer. Là où les
  // faux amis anglais coupent au couteau, celui-ci laisse le mirage s'installer.
  'falsos-amigos': {
    id: 'falsos-amigos',
    theme: 'mirage',
    timbre: 'velours',
    layout: 'liste',
    rule: '12 mirages à dissiper, 10 secondes chacun. 3 erreurs et le désert gagne.',
    emoji: '🏜️',
    lexicon: {
      verb: 'Que veut vraiment dire ce mot ?',
      step: 'mirage',
      steps: 'mirages',
      hit: 'mirage dissipé',
      win: 'Tous les mirages dissipés !',
      lose: 'Perdu dans le mirage',
    },
    params: {
      mechanic: 'vies',
      vies: { lives: 3, questionSeconds: 10, target: 12 },
    },
  },

  // --- SVT ------------------------------------------------------------------
  // Le safari : on classe l'animal, on grimpe la canopée. Ascension courte
  // (8 étages) avec chute douce (−1) et un léger chrono : le tri doit être un
  // RÉFLEXE, pas une dissertation.
  'classe-moi-ca': {
    id: 'classe-moi-ca',
    theme: 'jungle',
    timbre: 'bois',
    layout: 'duo',
    rule: 'Grimpe 8 branches de la canopée. Bon classement : +1. Erreur : −1. 8 secondes par bête.',
    emoji: '🌿',
    lexicon: {
      verb: 'Range-le dans sa famille',
      step: 'branche',
      steps: 'branches',
      hit: 'espèce classée',
      win: 'Canopée atteinte !',
      lose: 'Redescendu au sol',
    },
    params: {
      mechanic: 'ascension',
      ascension: { floors: 8, fall: 1, questionSeconds: 8, attempts: 24 },
    },
  },

  // Le seul jeu où l'on répond en DÉSIGNANT un endroit : pas de proposition à
  // lire, donc pas d'élimination possible. On sait ou on ne sait pas. D'où une
  // expédition (8 escales, personne n'élimine) avec un chrono confortable :
  // chercher sur un schéma prend plus longtemps que choisir dans une liste.
  'anatomie-express': {
    id: 'anatomie-express',
    theme: 'anatomie',
    timbre: 'cristal',
    layout: 'grille',
    rule: '8 organes à localiser sur la silhouette. 15 secondes chacun, et rien ne t’élimine.',
    emoji: '🫀',
    lexicon: {
      verb: 'Touche-le sur la silhouette',
      step: 'organe',
      steps: 'organes',
      hit: 'organe localisé',
      win: 'Planche complète !',
      lose: 'Révision d’anatomie conseillée',
    },
    params: { mechanic: 'expedition', expedition: { stops: 8, questionSeconds: 15 } },
  },

  // --- Physique-Chimie ------------------------------------------------------
  // Le laboratoire : une expédition (aucune mort) mais serrée dans le temps —
  // 10 prélèvements à 9 secondes. On collectionne les symboles.
  'chasse-elements': {
    id: 'chasse-elements',
    theme: 'labo',
    timbre: 'cristal',
    layout: 'grille',
    rule: '10 prélèvements à isoler. Rien ne t’élimine : remplis le plus de fioles possible.',
    emoji: '⚗️',
    lexicon: {
      verb: 'Son symbole chimique ?',
      step: 'prélèvement',
      steps: 'prélèvements',
      hit: 'fiole remplie',
      win: 'Laboratoire au complet !',
      lose: 'Manipulation terminée',
    },
    params: { mechanic: 'expedition', expedition: { stops: 10, questionSeconds: 9 } },
  },

  // Le calibrage : sprint court et sec (30 s). Associer grandeur et unité doit
  // être instantané — c'est un réflexe de contrôle, pas une réflexion.
  'bonne-unite': {
    id: 'bonne-unite',
    theme: 'regle',
    timbre: 'metal',
    layout: 'grille',
    rule: '30 secondes pour calibrer un maximum d’instruments. Le réflexe, pas la réflexion.',
    emoji: '📐',
    lexicon: {
      verb: 'Quelle unité ?',
      step: 'calibrage',
      steps: 'calibrages',
      hit: 'instrument calibré',
      win: 'Tout est calibré !',
      lose: 'Fin du calibrage',
    },
    params: { mechanic: 'sprint', sprint: { seconds: 30, fastMs: 2000 } },
  },
}

/**
 * Le jeton d'accroche du billet, dans l'arène : ce que le jeu PROMET, en trois
 * mots. « Jouer » sur les 13 billets ne disait rien et laissait croire à 13 fois
 * la même partie ; « 8 escales » et « 2 vies » annoncent deux jeux différents
 * avant même qu'on ait tapé dessus — et la table de jeu tient exactement ça.
 */
export function formatTeaser(format: GameFormat): string {
  const p = format.params
  switch (p.mechanic) {
    case 'sprint':
      return `${p.sprint.seconds} s chrono`
    case 'vies':
      return `${p.vies.lives} vies · ${p.vies.target} ${format.lexicon.steps}`
    case 'paliers':
      return `${p.paliers.waves} ${format.lexicon.steps}`
    case 'expedition':
      return `${p.expedition.stops} ${format.lexicon.steps}`
    case 'ascension':
      return `${p.ascension.floors} ${format.lexicon.steps}`
    case 'ordre':
      // Le jeu chronométré vend son chrono ; celui à tableaux vend ses tableaux.
      return p.ordre.globalSeconds !== null
        ? `${p.ordre.globalSeconds} s chrono`
        : `${p.ordre.boards} ${format.lexicon.steps}`
  }
}

/** Le format d'un jeu, ou null si l'id est inconnu. */
export function gameFormat(id: string): GameFormat | null {
  return GAME_FORMATS[id as SalonGameId] ?? null
}

/** La mécanique d'un format (raccourci de lecture pour les composants). */
export function mechanicOf(format: GameFormat): GameMechanic {
  return format.params.mechanic
}

/**
 * Nombre d'étapes annoncé à l'intro (« 8 escales », « 4 régimes »…), ou null
 * pour les formats sans fin prédéterminée (sprint, vies).
 */
export function announcedSteps(format: GameFormat): number | null {
  const p = format.params
  switch (p.mechanic) {
    case 'expedition':
      return p.expedition.stops
    case 'paliers':
      return p.paliers.waves
    case 'ascension':
      return p.ascension.floors
    default:
      return null
  }
}

/**
 * Nombre de questions à préparer pour une partie, avec de la marge : une
 * mécanique sans fin (sprint, vies) peut en consommer beaucoup si le joueur est
 * bon, et une question re-servie dans la même partie casse l'illusion.
 */
export function poolSizeFor(format: GameFormat): number {
  const p = format.params
  switch (p.mechanic) {
    case 'sprint':
      // ~1 question toutes les 2 s au mieux, plus une marge confortable.
      return Math.ceil(p.sprint.seconds / 2) + 10
    case 'vies':
      // L'objectif, plus les erreurs possibles, plus une marge de sûreté.
      return p.vies.target + p.vies.lives + 8
    case 'paliers':
      return p.paliers.waves * p.paliers.waveSize + 5
    case 'expedition':
      return p.expedition.stops + 4
    case 'ascension':
      // Exactement le nombre d'essais accordés : c'est le maximum de questions
      // qu'une partie peut consommer, puisque les essais épuisés la terminent.
      // Une estimation « large marge » ne veut rien dire quand la borne est
      // connue exactement.
      return p.ascension.attempts
    case 'ordre':
      // Ici l'unité est le TABLEAU, pas la question : on en prépare autant que
      // la partie peut en consommer, chrono compris.
      return p.ordre.boards ?? Math.ceil((p.ordre.globalSeconds ?? 60) / 12) + 3
  }
}
