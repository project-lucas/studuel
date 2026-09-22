// La feuille « Modes de jeu » de l'arène — catalogue et logique pure.
//
// REFONTE « CLASH ROYALE » (Lucas, 19/09/2026) : la feuille s'ouvre sur son
// titre, le TOTAL DE TROPHÉES, puis la LISTE des modes — plus de roulette de
// matières. Chaque matière a sa section, et dans chacune ses jeux en billets ;
// la version gratuite en ouvre un par matière, Studuel+ ouvre les autres
// (lib/jeux/acces). Puis les modes de l'Arène, communs à toutes les matières,
// dont le MODE DU JOUR, mis en vedette en tête de feuille.
//
// Les billets reprennent le gabarit des cartes « Modes de jeu » de Clash
// Royale (components/defi/ModeTicket) : UNE TEINTE PAR BILLET, comme là-bas —
// la couleur y est une identité (la palette `data-teinte` des outils de
// Marcel), jamais un bouton. Les composants ne font qu'afficher — tout le
// calcul est ici.
import {
  BLITZ_BEST_STORAGE_KEY,
  CHRONO_BEST_STORAGE_KEY,
  GAME_MODES,
  SURVIE_BEST_STORAGE_KEY,
  featuredModeId,
  modeImage,
  modeScene,
  type GameModeId,
} from '@/lib/defi-modes'
import { SALONS } from '@/lib/jeux/catalog'
import { formatTeaser, gameFormat } from '@/lib/jeux/formats'
import { gameBestKey } from '@/lib/jeux/records'
import { LIEN_STUDUEL_PLUS, jeuLibre, jeuOuvert } from '@/lib/jeux/acces'
import { programmeSlug } from '@/lib/jeux/programme'
import { subjectVignette } from '@/lib/subject-style'

/**
 * La teinte d'un billet : son IDENTITÉ (la palette `data-teinte` de
 * globals.css, à clarté perçue égale). Pas de hex en dur ici.
 */
export type TeinteBillet =
  | 'violet'
  | 'rose'
  | 'bleu'
  | 'vert'
  | 'ambre'
  | 'indigo'
  | 'corail'
  | 'turquoise'

export type ModeTicket = {
  id: string
  teinte: TeinteBillet
  name: string
  tagline: string
  emoji: string
  /**
   * La scène illustrée du CORPS du billet (bannière 16:9). Sans scène, le
   * corps porte la vignette de la matière, ou sa robe seule.
   */
  scene?: string | null
  /** L'objet détouré du TALON (à droite de la perforation). Repli : l'emoji. */
  image?: string | null
  /** Vignette du dossier de la matière (art de repli du corps). */
  vignette?: string | null
  /** Destination du billet — null tant que le jeu n'est pas construit. */
  href: string | null
  /** La pastille du corps : la RÈGLE du jeu (« 8 escales », « 60 s chrono »). */
  chip?: string
  /** Ruban en coin (« Mode du jour », « Bientôt »). */
  badge?: string
  /**
   * Clé du RECORD personnel de ce défi dans le stockage local, quand il en
   * garde un. Absente pour ce qui n'a pas de record à battre — un duel ou un
   * boss ne se mesurent pas à un compteur.
   */
  recordKey?: string
  /** Jeu de salon : ses étoiles de paliers s'affichent sur le billet. */
  gameId?: string
  /** Réservé à Studuel+ : le billet montre un cadenas et mène à la Boutique. */
  verrou?: boolean
  /** Le mode du jour : grand billet, halo, en tête de feuille. */
  vedette?: boolean
}

/** La teinte de chaque matière des salons — ses billets la portent tous. */
export const TEINTE_MATIERE: Record<string, TeinteBillet> = {
  'Histoire-Géo': 'ambre',
  Français: 'rose',
  Maths: 'bleu',
  Anglais: 'indigo',
  Espagnol: 'corail',
  SVT: 'vert',
  'Physique-Chimie': 'turquoise',
}

/** La teinte de chaque mode de l'Arène. */
const TEINTE_MODE: Record<GameModeId, TeinteBillet> = {
  duel: 'indigo',
  blitz: 'ambre',
  chrono: 'turquoise',
  survie: 'corail',
  boss: 'violet',
}

/** La règle d'un mode de l'Arène, en une pastille. */
const REGLE_MODE: Record<GameModeId, string> = {
  duel: '2 manches gagnantes',
  blitz: '60 s chrono',
  chrono: 'Le temps s’allonge',
  survie: 'Une seule vie',
  boss: 'Ton chapitre faible',
}

// Les trois modes de l'Arène qui se jouent au SCORE gardent un record local
// (même clé que leur écran de jeu). Le duel fantôme et le boss n'en ont pas :
// on ne bat pas un compteur, on bat quelqu'un.
const ARENA_RECORD_KEY: Partial<Record<GameModeId, string>> = {
  blitz: BLITZ_BEST_STORAGE_KEY,
  chrono: CHRONO_BEST_STORAGE_KEY,
  survie: SURVIE_BEST_STORAGE_KEY,
}

const ARENA_EMOJI: Record<GameModeId, string> = {
  duel: '👻',
  blitz: '⏱️',
  chrono: '⏳',
  survie: '💀',
  boss: '👑',
}

// Scènes plein-fond des billets de jeux (bannières 16:9 du batch 13 des
// prompts). Ajouter l'id ici dès que la scène est déposée dans
// public/images/defi/jeux/<id>-scene.webp — repli sur la vignette sinon.
const GAME_SCENE_IDS = [
  'conjugaison-eclair',
  'frise-folle',
  'chasse-faute',
  'capitales',
  'calcul-mental',
  'traduction-flash',
  'traduccion-flash',
  // Lot du 22/09/2026 (scripts/scenes-jeux.mjs).
  'phrase-en-vrac',
  'falsos-amigos',
  'anatomie-express',
  'classe-moi-ca',
  'chasse-elements',
  'bonne-unite',
]

export function gameScene(id: string): string | undefined {
  return GAME_SCENE_IDS.includes(id)
    ? `/images/defi/jeux/${id}-scene.webp`
    : undefined
}

/** La vignette du dossier d'une matière des salons (la même que dans Réviser). */
export function vignetteMatiere(subject: string): string | null {
  return subjectVignette(programmeSlug(subject)) ?? null
}

/**
 * Les jeux d'une matière, en billets. Un jeu construit mène à sa CARTE
 * (`/defi/jeux/{id}`) : l'échelle de ses cinq paliers. Un jeu pas encore
 * construit n'a pas de lien (ruban « Bientôt »). Un jeu réservé à Studuel+,
 * pour un élève qui ne l'a pas, porte un cadenas et mène à la Boutique.
 * Matière inconnue → [].
 *
 * `premium` : l'élève est abonné. Par défaut `true` — un appelant qui ne sait
 * pas ne verrouille rien (le serveur garde de toute façon les routes).
 */
export function subjectGameTickets(
  subject: string,
  { premium = true }: { premium?: boolean } = {},
): ModeTicket[] {
  const salon = SALONS.find((s) => s.subject === subject)
  if (!salon) return []
  const teinte = TEINTE_MATIERE[subject] ?? 'violet'
  const vignette = vignetteMatiere(subject)
  return salon.games.map((g) => {
    // La pastille annonce la RÈGLE du jeu (« 8 escales », « 2 vies · 10
    // pièges »), pas un « Jouer » interchangeable.
    const format = g.implemented ? gameFormat(g.id) : null
    const verrou = g.implemented && !jeuOuvert(g.id, premium)
    return {
      id: `${subject}:${g.id}`,
      teinte,
      name: g.name,
      tagline: g.tagline,
      emoji: g.emoji,
      scene: gameScene(g.id),
      vignette,
      href: !g.implemented ? null : verrou ? LIEN_STUDUEL_PLUS : `/defi/jeux/${g.id}`,
      chip: format ? formatTeaser(format) : g.implemented ? 'Jouer' : undefined,
      badge: g.implemented ? undefined : 'Bientôt',
      // Un jeu pas encore construit n'a évidemment pas de record.
      recordKey: g.implemented ? gameBestKey(g.id) : undefined,
      gameId: g.implemented ? g.id : undefined,
      verrou,
    }
  })
}

export type SectionMatiere = {
  subject: string
  emoji: string
  vignette: string | null
  tickets: ModeTicket[]
}

/**
 * Les sections « matière » de la feuille : chaque salon, ses billets.
 *
 * `tout` (Lucas, 19/09/2026 : « sans avoir cliqué sur ce nouveau bouton, les
 * users ne verront que 1 mode de jeu par matière ») : par défaut la feuille
 * ne montre qu'UN jeu par matière — son jeu libre (lib/jeux/acces), ouvert à
 * tous. Le bouton « tous les modes » déplie le reste : jeux Studuel+ (sous
 * cadenas pour qui ne l'a pas) et jeux « Bientôt ».
 */
export function sectionsMatieres(premium: boolean, tout = true): SectionMatiere[] {
  return SALONS.map((s) => {
    const tickets = subjectGameTickets(s.subject, { premium })
    const libre = tickets.find((t) => t.gameId !== undefined && jeuLibre(t.gameId))
    return {
      subject: s.subject,
      emoji: s.emoji,
      vignette: vignetteMatiere(s.subject),
      tickets: tout ? tickets : tickets.filter((t) => t === (libre ?? tickets[0])),
    }
  })
}

/** Combien de billets de jeux la vue par défaut garde repliés. */
export function modesReplies(premium: boolean): number {
  const tous = sectionsMatieres(premium, true).reduce((n, s) => n + s.tickets.length, 0)
  const visibles = sectionsMatieres(premium, false).reduce((n, s) => n + s.tickets.length, 0)
  return tous - visibles
}

// Les matières du programme portent le même NOM que les matières du catalogue
// de salons (« Français », « Histoire-Géo »…), mais rien ne l'impose en base :
// on retombe donc sur le SLUG, dérivable du nom de façon stable.
function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * La matière du catalogue de salons qui correspond à une matière du programme
 * (page `/reviser/[matiere]`), ou `null` quand elle n'a pas de jeux — une
 * matière sans salon ne doit rien promettre.
 */
export function salonSubjectFor(subject: {
  slug: string
  name: string
}): string | null {
  const byName = SALONS.find((s) => s.subject === subject.name)
  if (byName) return byName.subject
  const slug = slugify(subject.slug || subject.name)
  return SALONS.find((s) => slugify(s.subject) === slug)?.subject ?? null
}

// Le billet « Boss » d'une matière a été SUPPRIMÉ d'ici (chantier La Traque,
// lib/traque.ts) : un gardien ne se choisit plus dans un menu de modes, il se
// débusque en révisant. Sa carte vit dans la feuille Boss du rail de l'arène.

/**
 * Les modes de l'Arène (communs à toutes les matières), en billets. `dayKey`
 * (clé UTC du jour) désigne le MODE DU JOUR : son billet passe en vedette
 * (grand, halo, ruban) — même tirage que la salle de jeu.
 *
 * ⚠️ PLUS DE « +20 XP » SUR LES BILLETS. Jouer n'acquiert pas d'XP depuis la
 * migration 348 : le jeton annonçait un bonus que le portefeuille ne versait
 * pas, et le ruban « ×2 XP » du mode du jour doublait ce néant. Les billets
 * annoncent désormais la RÈGLE du mode, qui, elle, est vraie.
 */
export function funModeTickets(dayKey: string): ModeTicket[] {
  const featured = featuredModeId(dayKey)
  return GAME_MODES.map((m) => {
    const vedette = m.id === featured
    return {
      id: m.id,
      teinte: TEINTE_MODE[m.id],
      name: m.name,
      tagline: m.tagline,
      emoji: ARENA_EMOJI[m.id] ?? '🎮',
      image: modeImage(m.id),
      scene: modeScene(m.id),
      href: `/defi/jouer?mode=${m.id}`,
      chip: REGLE_MODE[m.id],
      badge: vedette ? 'Mode du jour' : undefined,
      recordKey: ARENA_RECORD_KEY[m.id],
      vedette,
    }
  })
}

/** Le billet « Mode Coop » : à deux, par un code d'invitation, on s'entraide. */
export function coopTicket(): ModeTicket {
  return {
    id: 'coop',
    teinte: 'vert',
    name: 'Mode Coop',
    tagline: 'À deux, par un code d’invitation : on s’entraide au lieu de s’affronter',
    emoji: '🤝',
    href: '/defi/jouer?mode=coop',
    chip: 'À deux, en direct',
  }
}

/**
 * CE QUE MONTRE LA FEUILLE « MODES DE JEU » (Lucas, 19/09/2026 : « trop de
 * modes de jeu » ; « on garde Survie, fantôme etc. mais eux vont dans le
 * plus, l'icône qui les dévoile tous »).
 *
 *   · toujours : le MODE DU JOUR en grand billet, et UN jeu par matière —
 *     son jeu libre ;
 *   · derrière le bouton « tous les modes » (`tout`) : le second jeu de
 *     chaque matière (Studuel+), puis les modes de l'Arène — les autres modes
 *     du tirage, le Duel en direct et le Mode Coop pour l'élève connecté.
 *
 * `replies` : combien de billets le bouton dévoile (sa pastille « +N »).
 */
export function vueModes({
  dayKey,
  premium,
  tout,
  connecte,
}: {
  dayKey: string
  premium: boolean
  tout: boolean
  connecte: boolean
}): {
  vedette: ModeTicket | null
  sections: SectionMatiere[]
  arene: ModeTicket[]
  replies: number
} {
  const modes = funModeTickets(dayKey)
  const vedette = modes.find((m) => m.vedette) ?? null
  const areneComplete: ModeTicket[] = [
    ...modes.filter((m) => !m.vedette),
    ...(connecte ? [duelDirectTicket(), coopTicket()] : []),
  ]
  return {
    vedette,
    sections: sectionsMatieres(premium, tout),
    arene: tout ? areneComplete : [],
    replies: modesReplies(premium) + areneComplete.length,
  }
}

/** Le billet « Duel en direct » : un ami, un QR, la même partie en même temps. */
export function duelDirectTicket(): ModeTicket {
  return {
    id: 'duel-direct',
    teinte: 'rose',
    name: 'Duel en direct',
    tagline: 'Invite un ami par QR : la même partie, en même temps',
    emoji: '⚔️',
    image: '/images/defi/modes/amidefi.webp',
    scene: modeScene('duel'),
    href: '/defi/duel-rapide',
    chip: 'Avec un ami',
  }
}
