// -----------------------------------------------------------------------------
// LE CATALOGUE DES DÉCOUVERTES (25/10/2026, cadrage « le jeu vivant »,
// docs/CADRAGE-JEU-VIVANT.md § E).
//
// Le jeu que Lucas a montré ouvre ses fonctionnalités UNE PAR UNE : chaque
// niveau débloque un onglet ou un outil, l'annonce (« Nouveau ! ») et
// l'explique en trois bulles. Ici, la liste FERMÉE de ce qui se découvre dans
// Studuel : la clé, le nom, le niveau qui l'ouvre, où ça mène, l'onglet de la
// barre qu'elle verrouille (ou aucun) et les bulles de son mini-tour.
//
// DEUX LECTEURS, qui ne se connaissent pas :
//   · la fête de niveau (components/niveau/FeteNiveau) lit
//     `decouvertesAuNiveau(n)` pour sa section « Débloqué » ;
//   · la découverte progressive (lib/decouverte/etat, components/Navigation,
//     TourGuide) lit tout le reste.
// La migration 601 recopie la liste des clés dans `decouverte_marquer` : une
// clé ajoutée ici l'est aussi là-bas.
//
// RÈGLE : Réviser et Moi ne se verrouillent JAMAIS (`onglet: null`) ; un
// niveau d'ouverture de 1 veut dire « dès le premier jour ». Les comptes créés
// avant la 601 voient tout, quel que soit leur niveau (lib/decouverte/etat).
//
// CE MODULE N'IMPORTE RIEN : lu par des composants clients et par des tests.
// -----------------------------------------------------------------------------

/** Les onglets de la barre qui PEUVENT se verrouiller. */
export type OngletVerrouillable = 'defi' | 'amis' | 'tresor'

/** Une bulle du mini-tour d'une découverte : l'ancre `data-tour` visée (null : bulle centrée). */
export type EtapeDecouverte = {
  cible: string | null
  titre: string
  texte: string
}

export type Decouverte = {
  cle: string
  nom: string
  /** Ce que Marcel en dit, en une phrase. */
  phrase: string
  /** Le niveau qui l'ouvre (1 = dès le départ). */
  niveau: number
  /** Où elle se trouve (la page sur laquelle lancer son mini-tour). */
  href: string
  /** L'onglet de la barre qu'elle verrouille tant qu'elle n'est pas ouverte, s'il y en a un. */
  onglet: OngletVerrouillable | null
  /** Son dessin (famille de la barre d'onglets), ou null : le repli au trait. */
  dessin: string | null
  etapes: readonly EtapeDecouverte[]
}

export const DECOUVERTES: readonly Decouverte[] = [
  {
    cle: 'reviser',
    nom: 'Réviser',
    phrase: 'Ton programme, tes cours, ta série : c’est ici que tout commence.',
    niveau: 1,
    href: '/reviser',
    onglet: null,
    dessin: '/images/nav/reviser.webp',
    etapes: [
      { cible: 'tab-reviser', titre: 'Réviser', texte: 'Ton programme, chapitre par chapitre. Chaque cours lu, chaque quiz réussi rapporte de l’XP.' },
      { cible: 'serie', titre: 'Ta série', texte: 'Un jour travaillé = une flamme. Ne la laisse pas s’éteindre !' },
      { cible: 'quetes', titre: 'Les quêtes du jour', texte: 'Trois petites choses à faire chaque jour. Le coffre du soir est à la clé.' },
    ],
  },
  {
    cle: 'courrier',
    nom: 'Le courrier',
    phrase: 'Marcel t’écrit, tes amis te défient, des cadeaux t’attendent.',
    niveau: 1,
    href: '/courrier',
    onglet: null,
    dessin: '/images/courrier/enveloppe.webp',
    etapes: [
      { cible: 'courrier', titre: 'Ton courrier', texte: 'Les lettres de Marcel, les défis de tes amis et les cadeaux à récupérer arrivent ici.' },
    ],
  },
  {
    cle: 'marcel',
    nom: 'Marcel, ton coach',
    phrase: 'Il sait où tu en es et prépare ta séance. Pose-lui tes questions.',
    niveau: 2,
    href: '/marcel',
    onglet: null,
    dessin: '/images/nav/marcel.webp',
    etapes: [
      { cible: 'marcel-bureau', titre: 'Le bureau de Marcel', texte: 'Ta séance du jour, ton radar des matières, et vingt-quatre outils pour t’aider.' },
      { cible: 'marcel-champ', titre: 'Pose ta question', texte: 'Une notion, un exercice, une photo de ton cours : Marcel t’explique, sans donner la réponse toute faite.' },
    ],
  },
  {
    cle: 'bibliotheque',
    nom: 'Ma bibliothèque',
    phrase: 'Tes propres cours, tes capsules et tes fiches, rangés à un endroit.',
    niveau: 2,
    // Le mini-tour se joue sur Réviser, là où vit la PORTE de la bibliothèque
    // (le bouton `carnet-switch`) : on montre l'entrée, l'élève y entre.
    href: '/reviser',
    onglet: null,
    dessin: '/images/supports/dossiers.webp',
    etapes: [
      { cible: 'carnet-switch', titre: 'Ma bibliothèque', texte: 'C’est par ici : tes propres cours, tes capsules et tes fiches débloquées, rangés en trois rayons.' },
    ],
  },
  {
    cle: 'defi',
    nom: 'L’arène',
    phrase: 'Des duels, des modes de jeu, des trophées : viens te mesurer aux autres.',
    niveau: 2,
    href: '/defi',
    onglet: 'defi',
    dessin: '/images/nav/defi.webp',
    etapes: [
      { cible: 'tab-defi', titre: 'L’arène', texte: 'Le duel classé est une course à 1 000 points. Réponds vite, réponds juste.' },
      { cible: 'arene-duel', titre: 'Le bouton Duel', texte: 'Un rival de ton niveau t’attend. Chaque victoire rapporte des trophées.' },
      { cible: 'arene-modes', titre: 'Les modes de jeu', texte: 'Un jeu par matière, et un mode du jour. Tous rapportent de l’XP.' },
    ],
  },
  {
    cle: 'amis',
    nom: 'La ligue',
    phrase: 'Trente joueurs, une semaine : qui révise le plus monte de division.',
    niveau: 3,
    href: '/amis',
    onglet: 'amis',
    dessin: '/images/nav/amis.webp',
    etapes: [
      { cible: 'tab-amis', titre: 'La ligue de la semaine', texte: 'Ton XP de la semaine te classe parmi trente joueurs. Les premiers montent de division.' },
      { cible: 'amis-places', titre: 'Tes amis', texte: 'Chaque ami ajoute +10 % à ton XP. Dix places, dix invitations.' },
    ],
  },
  {
    cle: 'tresor',
    nom: 'La boutique',
    phrase: 'Des boosts, un bouclier de série, des capsules — et Studuel+.',
    niveau: 3,
    href: '/tresor',
    onglet: 'tresor',
    dessin: '/images/nav/tresor.webp',
    etapes: [
      { cible: 'tab-tresor', titre: 'La boutique', texte: 'Tes gemmes s’y dépensent : un Boost XP, un gel de série, une capsule.' },
      { cible: 'tresor-marche', titre: 'Le marché', texte: 'Un achat par jour. Le Boost XP double ce que tu gagnes pendant une heure.' },
    ],
  },
  {
    cle: 'gardiens',
    nom: 'Les gardiens',
    phrase: 'Chaque matière a son gardien. Il ne sort que si tu travailles.',
    niveau: 4,
    href: '/defi',
    onglet: null,
    dessin: '/images/boss/atlas.webp',
    etapes: [
      { cible: 'arene-boss', titre: 'Les gardiens', texte: 'Révise une matière le jour de son gardien : sa jauge se remplit, et tu as une heure pour l’abattre.' },
    ],
  },
] as const

export function decouverteParCle(cle: string): Decouverte | null {
  return DECOUVERTES.find((d) => d.cle === cle) ?? null
}

export function estCleDecouverte(valeur: unknown): valeur is string {
  return typeof valeur === 'string' && DECOUVERTES.some((d) => d.cle === valeur)
}

/** Ce qu'un niveau franchi ouvre — la section « Débloqué » de la fête de niveau. */
export function decouvertesAuNiveau(niveau: number): Decouverte[] {
  return DECOUVERTES.filter((d) => d.niveau === niveau)
}

/** Tout ce qui est ouvert à un niveau donné (niveau d'ouverture ≤ niveau). */
export function decouvertesOuvertes(niveau: number): Decouverte[] {
  return DECOUVERTES.filter((d) => d.niveau <= niveau)
}

/** Le niveau qui ouvre un onglet de la barre, ou 1 s'il ne se verrouille pas. */
export function niveauDOuverture(onglet: string): number {
  const d = DECOUVERTES.find((x) => x.onglet === onglet)
  return d ? d.niveau : 1
}

/** Le plus haut niveau qui ouvre encore quelque chose. */
export const DERNIER_NIVEAU_DECOUVERTE = Math.max(...DECOUVERTES.map((d) => d.niveau))
