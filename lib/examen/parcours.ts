// -----------------------------------------------------------------------------
// LE MODE EXAMEN (15/10/2026, Lucas : « il faut un mode examen dans la formule :
// 3e, bac de français — prépa des oraux, de l'écrit —, terminale »).
//
// Ce module dit, pour une classe : QUEL examen l'attend, QUELLES épreuves, et
// OÙ il en est sur le chemin du jour J — la phase, et ce qu'il faut faire cette
// semaine. C'est « penser pour eux, avant eux » sans un seul appel IA : tout est
// écrit d'avance et calculé à partir de la date.
//
// LES DATES SONT INDICATIVES. Le calendrier officiel de la session 2027 se
// publie à l'automne 2026 : `dateIndicative` est un repère (le milieu de la
// semaine habituelle), l'écran écrit « vers le … » et jamais une date ferme.
// Les durées et coefficients suivent la réglementation connue à l'écriture —
// à revérifier à chaque rentrée (docs/CADRAGE-STUDUEL-PLUS.md, § Examen) ; le
// Grand oral est celui de la session 2027 (deux temps de dix minutes,
// coefficient 8 en voie générale, 12 en voie technologique).
//
// Logique PURE et testée.
// -----------------------------------------------------------------------------

export type IdExamen = 'brevet' | 'bac-francais' | 'bac'

export type Ressource =
  | { type: 'annales'; matiere: string }
  | { type: 'examen-blanc'; matiere?: string }
  | { type: 'oral-francais' }
  | { type: 'marcel' }
  | { type: 'matiere'; matiere: string }

export type Epreuve = {
  id: string
  titre: string
  nature: 'ecrit' | 'oral'
  /** « 3 h », « 20 min + 30 min de préparation ». */
  duree: string
  coefficient: string | null
  /** La matière du catalogue (slug), si l'épreuve en a une. */
  matiere: string | null
  /** Ce qui t'attend, en deux ou trois lignes. */
  format: string[]
  /**
   * Le découpage du temps, quand il est connu : officiel (la dictée du brevet,
   * l'oral) ou CONSEILLÉ (`tempsConseil` : la répartition d'une épreuve de 4 h
   * qu'on conseille à l'élève ; l'écran le dit).
   */
  temps?: { minutes: number; quoi: string }[]
  tempsConseil?: boolean
  ressources: Ressource[]
}

export type Examen = {
  id: IdExamen
  nom: string
  /** Le repère du jour J (UTC), pour le compte à rebours. */
  dateIndicative: string
  /** « fin juin », « mi-juin » : ce qu'on écrit à la place d'une date ferme. */
  periode: string
  epreuves: Epreuve[]
}

const BREVET: Examen = {
  id: 'brevet',
  nom: 'Le brevet',
  dateIndicative: '2027-06-24',
  periode: 'fin juin',
  epreuves: [
    {
      id: 'brevet-francais',
      titre: 'Français',
      nature: 'ecrit',
      duree: '3 h',
      coefficient: null,
      matiere: 'francais',
      format: ['Questions sur un texte et une image', 'Une dictée et un exercice de réécriture', 'Une rédaction : imagination ou réflexion'],
      temps: [
        { minutes: 70, quoi: 'questions, grammaire' },
        { minutes: 20, quoi: 'dictée' },
        { minutes: 90, quoi: 'rédaction' },
      ],
      ressources: [{ type: 'annales', matiere: 'francais' }, { type: 'examen-blanc', matiere: 'francais' }],
    },
    {
      id: 'brevet-maths',
      titre: 'Mathématiques',
      nature: 'ecrit',
      duree: '2 h',
      coefficient: null,
      matiere: 'maths',
      format: ['Cinq à huit exercices indépendants', 'Un exercice d’algorithmique (Scratch)', 'La calculatrice est autorisée'],
      ressources: [{ type: 'annales', matiere: 'maths' }, { type: 'examen-blanc', matiere: 'maths' }],
    },
    {
      id: 'brevet-hg',
      titre: 'Histoire-géographie et EMC',
      nature: 'ecrit',
      duree: '2 h',
      coefficient: null,
      matiere: 'histoire-geo',
      format: ['Analyse de documents en histoire et en géographie', 'Un développement construit', 'Un exercice d’enseignement moral et civique'],
      ressources: [{ type: 'annales', matiere: 'histoire-geo' }, { type: 'examen-blanc', matiere: 'histoire-geo' }],
    },
    {
      id: 'brevet-sciences',
      titre: 'Sciences',
      nature: 'ecrit',
      duree: '1 h',
      coefficient: null,
      matiere: null,
      format: ['Deux disciplines sur trois : SVT, physique-chimie, technologie', 'Trente minutes par discipline'],
      temps: [
        { minutes: 30, quoi: 'première discipline' },
        { minutes: 30, quoi: 'seconde discipline' },
      ],
      ressources: [{ type: 'annales', matiere: 'svt' }, { type: 'annales', matiere: 'physique-chimie' }],
    },
    {
      id: 'brevet-oral',
      titre: 'L’oral du brevet',
      nature: 'oral',
      duree: '15 min',
      coefficient: null,
      matiere: null,
      format: ['Tu présentes un projet mené en classe', 'Un exposé, puis un entretien avec le jury'],
      temps: [
        { minutes: 5, quoi: 'exposé' },
        { minutes: 10, quoi: 'entretien' },
      ],
      ressources: [{ type: 'marcel' }],
    },
  ],
}

const BAC_FRANCAIS: Examen = {
  id: 'bac-francais',
  nom: 'Le bac de français',
  dateIndicative: '2027-06-15',
  periode: 'mi-juin (écrit), fin juin (oral)',
  epreuves: [
    {
      id: 'eaf-ecrit',
      titre: 'L’écrit',
      nature: 'ecrit',
      duree: '4 h',
      coefficient: '5',
      matiere: 'francais',
      format: ['Commentaire de texte ou dissertation sur une œuvre au programme', 'Voie technologique : commentaire, ou contraction de texte et essai'],
      temps: [
        { minutes: 60, quoi: 'brouillon : sujet, plan' },
        { minutes: 150, quoi: 'rédaction' },
        { minutes: 30, quoi: 'relecture' },
      ],
      tempsConseil: true,
      ressources: [{ type: 'annales', matiere: 'francais' }, { type: 'examen-blanc', matiere: 'francais' }],
    },
    {
      id: 'eaf-oral',
      titre: 'L’oral',
      nature: 'oral',
      duree: '20 min + 30 min de préparation',
      coefficient: '5',
      matiere: 'francais',
      format: ['Explication d’un texte de ton descriptif et une question de grammaire', 'Puis la présentation d’une œuvre choisie et un entretien'],
      temps: [
        { minutes: 30, quoi: 'préparation' },
        { minutes: 12, quoi: 'explication, grammaire' },
        { minutes: 8, quoi: 'œuvre choisie, entretien' },
      ],
      ressources: [{ type: 'oral-francais' }, { type: 'marcel' }],
    },
    {
      id: 'eam',
      titre: 'L’épreuve anticipée de mathématiques',
      nature: 'ecrit',
      duree: '2 h',
      coefficient: '2',
      matiere: 'maths',
      format: ['Automatismes et exercices courts', 'Passée en fin de première, comme le français'],
      ressources: [{ type: 'matiere', matiere: 'maths' }],
    },
  ],
}

const BAC: Examen = {
  id: 'bac',
  nom: 'Le bac',
  dateIndicative: '2027-06-15',
  periode: 'mi-juin',
  epreuves: [
    {
      id: 'bac-philo',
      titre: 'Philosophie',
      nature: 'ecrit',
      duree: '4 h',
      coefficient: '8 (voie technologique : 4)',
      matiere: 'philosophie',
      format: ['Au choix : deux sujets de dissertation ou une explication de texte'],
      temps: [
        { minutes: 60, quoi: 'brouillon : sujet, plan' },
        { minutes: 150, quoi: 'rédaction' },
        { minutes: 30, quoi: 'relecture' },
      ],
      tempsConseil: true,
      ressources: [{ type: 'annales', matiere: 'philosophie' }, { type: 'examen-blanc', matiere: 'philosophie' }],
    },
    {
      id: 'bac-specialites',
      titre: 'Les deux spécialités',
      nature: 'ecrit',
      duree: '3 h 30 à 4 h chacune',
      coefficient: '16 chacune',
      matiere: null,
      format: ['Une épreuve écrite par spécialité gardée en terminale', 'Plus une épreuve pratique en sciences (SVT, physique-chimie, NSI)'],
      ressources: [{ type: 'examen-blanc' }],
    },
    {
      id: 'grand-oral',
      titre: 'Le Grand oral',
      nature: 'oral',
      duree: '20 min + 20 min de préparation',
      coefficient: '8 (voie technologique : 12)',
      matiere: null,
      format: ['Tu présentes une question préparée avec tes spécialités, debout, dix minutes', 'Puis dix minutes d’échange avec le jury'],
      temps: [
        { minutes: 20, quoi: 'préparation' },
        { minutes: 10, quoi: 'présentation' },
        { minutes: 10, quoi: 'échange' },
      ],
      ressources: [{ type: 'marcel' }],
    },
  ],
}

export const EXAMENS: readonly Examen[] = [BREVET, BAC_FRANCAIS, BAC]

/** L'examen de l'année pour une classe — `null` hors classe à examen. */
export function examenDe(classe: string | null | undefined): Examen | null {
  if (classe === '3e') return BREVET
  if (classe === '1re' || classe === '1re techno') return BAC_FRANCAIS
  if (classe === 'Tle' || classe === 'Tle techno') return BAC
  return null
}

/** Jours avant le repère du jour J (négatif une fois passé). */
export function joursAvantExamen(examen: Pick<Examen, 'dateIndicative'>, aujourdhui: string): number {
  const cible = Date.parse(`${examen.dateIndicative}T00:00:00Z`)
  const jour = Date.parse(`${aujourdhui}T00:00:00Z`)
  return Math.round((cible - jour) / 86_400_000)
}

export type IdPhase = 'fondations' | 'entrainement' | 'sprint' | 'derniers-jours' | 'apres'

export type Phase = {
  id: IdPhase
  titre: string
  /** Le mot de la frise (quatre cases sur un téléphone). */
  court: string
  /** La règle de la phase, en une phrase. */
  regle: string
}

export const PHASES: Record<IdPhase, Phase> = {
  fondations: {
    id: 'fondations',
    titre: 'Les fondations',
    court: 'Fondations',
    regle: 'Tout voir une fois : chaque chapitre lu, chaque quiz passé, les points faibles notés.',
  },
  entrainement: {
    id: 'entrainement',
    titre: 'L’entraînement',
    court: 'Pratique',
    regle: 'Un sujet par semaine en conditions réelles, chronométré, puis le corrigé ligne à ligne.',
  },
  sprint: {
    id: 'sprint',
    titre: 'Le sprint',
    court: 'Sprint',
    regle: 'Les épreuves blanches, l’oral à voix haute, et seulement tes points faibles.',
  },
  'derniers-jours': {
    id: 'derniers-jours',
    titre: 'Les derniers jours',
    court: 'Derniers jours',
    regle: 'Plus de nouveau chapitre : tes fiches, une relecture, et du sommeil.',
  },
  apres: {
    id: 'apres',
    titre: 'C’est passé',
    court: 'Passé',
    regle: 'Bravo pour le travail. La suite se prépare dès la rentrée.',
  },
}

/** Les seuils, en jours avant le jour J. */
export const SEUILS_PHASE = { entrainement: 120, sprint: 45, derniersJours: 7 } as const

export function phaseDe(jours: number): Phase {
  if (jours < 0) return PHASES.apres
  if (jours <= SEUILS_PHASE.derniersJours) return PHASES['derniers-jours']
  if (jours <= SEUILS_PHASE.sprint) return PHASES.sprint
  if (jours <= SEUILS_PHASE.entrainement) return PHASES.entrainement
  return PHASES.fondations
}

export type ObjectifSemaine = { texte: string; href: string }

/**
 * Les trois choses à faire CETTE semaine, selon la phase et ce que l'élève a
 * déjà (`pointsFaibles` : chapitres « fragiles » de ses matières d'examen ;
 * `aCommencer` : chapitres jamais ouverts). Toujours trois, toujours un lien.
 */
export function objectifsDeLaSemaine(
  examen: Examen,
  phase: Phase,
  ctx: { pointsFaibles: number; aCommencer: number; matierePrincipale: string | null },
): ObjectifSemaine[] {
  const ecrit = examen.epreuves.find((e) => e.nature === 'ecrit' && e.matiere) ?? null
  const oral = examen.epreuves.find((e) => e.nature === 'oral') ?? null
  const matiere = ctx.matierePrincipale ?? ecrit?.matiere ?? null
  const dossier = matiere ? `/reviser/${matiere}` : '/reviser'
  const annales = matiere ? `/reviser/${matiere}?onglet=annales` : '/marcel?onglet=examen'
  const blanc = matiere ? `/reviser/examen-blanc?subject=${matiere}` : '/reviser/examen-blanc'
  const oralHref = oral && examen.id === 'bac-francais' ? '/marcel?vue=oral' : '/marcel'

  switch (phase.id) {
    case 'fondations':
      return [
        {
          texte: ctx.aCommencer > 0 ? `Ouvrir 3 chapitres jamais vus (il en reste ${ctx.aCommencer})` : 'Repasser le quiz de 3 chapitres déjà vus',
          href: dossier,
        },
        {
          texte: ctx.pointsFaibles > 0 ? `Reprendre ${Math.min(2, ctx.pointsFaibles)} point${ctx.pointsFaibles > 1 ? 's' : ''} faible${ctx.pointsFaibles > 1 ? 's' : ''}` : 'Faire une fiche du chapitre de la semaine',
          href: dossier,
        },
        { texte: 'Lire un sujet tombé, sans le faire : savoir à quoi ressemble l’épreuve', href: annales },
      ]
    case 'entrainement':
      return [
        { texte: 'Un sujet tombé en conditions réelles, chronométré', href: annales },
        { texte: 'Relire le corrigé et noter tes erreurs', href: annales },
        {
          texte: ctx.pointsFaibles > 0 ? `Retravailler ${Math.min(3, ctx.pointsFaibles)} point${ctx.pointsFaibles > 1 ? 's' : ''} faible${ctx.pointsFaibles > 1 ? 's' : ''}` : 'Un quiz par jour pour ne rien oublier',
          href: dossier,
        },
      ]
    case 'sprint':
      return [
        { texte: 'Une épreuve blanche complète', href: blanc },
        { texte: oral ? `Préparer ${oral.titre.toLowerCase()} à voix haute avec Marcel` : 'Demander à Marcel ce qu’il te reste à revoir', href: oralHref },
        { texte: 'Seulement tes points faibles, et tes fiches', href: dossier },
      ]
    case 'derniers-jours':
      return [
        { texte: 'Relire tes fiches, une matière par jour', href: '/carnet?rayon=fiches' },
        { texte: 'Préparer tes affaires et ta convocation', href: '/marcel?onglet=examen' },
        { texte: 'Te coucher tôt : le sommeil fixe ce que tu as appris', href: '/marcel?onglet=examen' },
      ]
    default:
      return [
        { texte: 'Garder le rythme avec un quiz par jour', href: '/reviser' },
        { texte: 'Découvrir la prépa du supérieur', href: '/prepa-sup' },
        { texte: 'Demander à Marcel comment préparer la suite', href: '/marcel' },
      ]
  }
}

/** Le lien d'une ressource. */
export function hrefRessource(r: Ressource): string {
  switch (r.type) {
    case 'annales':
      return `/reviser/${r.matiere}?onglet=annales`
    case 'examen-blanc':
      return r.matiere ? `/reviser/examen-blanc?subject=${r.matiere}` : '/reviser/examen-blanc'
    case 'oral-francais':
      return '/marcel?vue=oral'
    case 'marcel':
      return '/marcel'
    case 'matiere':
      return `/reviser/${r.matiere}`
  }
}

export function libelleRessource(r: Ressource): string {
  switch (r.type) {
    case 'annales':
      return 'Annales corrigées'
    case 'examen-blanc':
      return 'Épreuve blanche'
    case 'oral-francais':
      return 'Préparer l’oral avec Marcel'
    case 'marcel':
      return 'S’entraîner avec Marcel'
    case 'matiere':
      return 'Le programme'
  }
}

/** « J-34 », « Jour J », « C’est passé ». */
export function compteARebours(jours: number): string {
  if (jours > 0) return `J-${jours}`
  if (jours === 0) return 'Jour J'
  return 'C’est passé'
}
