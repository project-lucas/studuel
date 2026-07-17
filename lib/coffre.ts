// Le Coffre — boutique de produits numériques (onglet dédié).
// Logique PURE + catalogues : deux familles de produits.
//   1. Capsules d'apprentissage — mini-formations vidéo (méthode, sommeil…),
//      prix en euros (micro-achat 1–3 €), la première offerte.
//   2. Personnalisation — fonds d'écran, crédits de cartes mentales, skins,
//      payés avec les pièces de l'économie du Coffre (lib/tresor).
// La base ne stockera que des ids d'accès ; prix et libellés vivent ici.

// --------------------------------------------------------------- capsules (€)

// Teinte d'« emballage » d'une capsule : une clé sémantique résolue en dégradé
// côté composant (tokens du design system, jamais de hex en dur).
export type CapsuleAccent = 'violet' | 'soleil' | 'corail' | 'prune' | 'ocean'

export type Capsule = {
  id: string
  /** Titre commercial de la mini-formation. */
  title: string
  /** Sous-titre : la promesse en une ligne. */
  tagline: string
  /** Durée annoncée de la vidéo, ex. « 9 min ». */
  duration: string
  /** Prix en euros. 0 = offerte. */
  priceEuros: number
  /** Étiquette de gratuité (capsules à 0 €), ex. « Offerte à tous ». */
  freeLabel?: string
  emoji: string
  accent: CapsuleAccent
  /** Vidéo prête à être regardée. false = « Bientôt ». */
  available: boolean
  /** Ce que l'élève y apprend (puces de la fiche produit). */
  covers: string[]
}

// L'ordre = l'ordre d'affichage. La première capsule est offerte (accroche),
// les suivantes sont des micro-achats. Les « Bientôt » tiennent la promesse
// d'une collection qui s'agrandit.
export const CAPSULES: Capsule[] = [
  {
    id: 'sommeil',
    title: 'Le sommeil, ton super-pouvoir',
    tagline: 'Je t’explique tout : mieux dormir = mieux apprendre.',
    duration: '9 min',
    priceEuros: 0,
    freeLabel: 'Offerte à tous',
    emoji: '😴',
    accent: 'violet',
    available: true,
    covers: [
      'Pourquoi une nuit courte ruine tes révisions',
      'Le rituel du soir en 4 gestes',
      'L’erreur des écrans (et comment la corriger)',
    ],
  },
  {
    id: 'methode',
    title: 'La méthode de travail qui change tout',
    tagline: 'Arrête de réviser au hasard — travaille malin, pas plus.',
    duration: '12 min',
    priceEuros: 3,
    emoji: '🎯',
    accent: 'soleil',
    available: true,
    covers: [
      'Planifier une semaine réaliste',
      'La technique pour retenir sans relire 10 fois',
      'Gérer un gros chapitre sans paniquer',
    ],
  },
  {
    id: 'glycemie',
    title: 'Glycémie & concentration',
    tagline: 'Ce que tu manges décide de ta concentration en cours.',
    duration: '8 min',
    priceEuros: 2,
    emoji: '🍎',
    accent: 'prune',
    available: true,
    covers: [
      'Le petit-déj qui tient jusqu’à midi',
      'Le coup de barre de 14 h expliqué',
      'Quoi grignoter avant un contrôle',
    ],
  },
  {
    id: 'stress',
    title: 'Gérer le stress avant un contrôle',
    tagline: 'Transforme le trac en énergie le jour J.',
    duration: '10 min',
    priceEuros: 2,
    emoji: '🧘',
    accent: 'ocean',
    available: false,
    covers: [
      'La respiration qui calme en 60 secondes',
      'Préparer la veille pour dormir tranquille',
      'Quoi faire si ta tête se vide devant la copie',
    ],
  },
  {
    id: 'memoire',
    title: 'Mémoriser 2× plus vite',
    tagline: 'Les astuces de mémoire des meilleurs élèves.',
    duration: '11 min',
    priceEuros: 3,
    emoji: '🧠',
    accent: 'corail',
    available: false,
    covers: [
      'La répétition espacée, simplement',
      'Fabriquer des images qui restent',
      'Réviser en marchant, en bus, partout',
    ],
  },
]

// Formate un prix en euros à la française : « Offert », « 2 € », « 2,50 € ».
export function euroLabel(priceEuros: number): string {
  if (priceEuros <= 0) return 'Offert'
  const isWhole = Number.isInteger(priceEuros)
  const value = isWhole
    ? String(priceEuros)
    : priceEuros.toFixed(2).replace('.', ',')
  return `${value} €`
}

// Étiquette du bouton d'une capsule selon son état.
export function capsuleCta(capsule: Capsule): string {
  if (!capsule.available) return 'Bientôt'
  if (capsule.priceEuros <= 0) return 'Regarder'
  return `Débloquer · ${euroLabel(capsule.priceEuros)}`
}

export function capsuleById(id: string): Capsule | null {
  return CAPSULES.find((c) => c.id === id) ?? null
}

// --------------------------------------------------- personnalisation (pièces)

export type PersoCategory = 'fond' | 'credit' | 'skin'

export type PersoProduct = {
  id: string
  name: string
  desc: string
  /** Prix en pièces (économie du Coffre). */
  priceCoins: number
  emoji: string
  category: PersoCategory
  /** Achetable maintenant. false = « Bientôt ». */
  available: boolean
}

export const PERSO_CATEGORIES: { id: PersoCategory; label: string; emoji: string }[] = [
  { id: 'fond', label: 'Fonds d’écran', emoji: '🖼️' },
  { id: 'credit', label: 'Cartes mentales', emoji: '🧩' },
  { id: 'skin', label: 'Skins', emoji: '✨' },
]

export const PERSO_CATALOG: PersoProduct[] = [
  {
    id: 'fond-galaxie',
    name: 'Fond Galaxie',
    desc: 'Un ciel étoilé profond pour tout l’écran.',
    priceCoins: 180,
    emoji: '🌌',
    category: 'fond',
    available: true,
  },
  {
    id: 'fond-pastel',
    name: 'Fond Pastel',
    desc: 'Des dégradés doux, tout en douceur.',
    priceCoins: 120,
    emoji: '🎨',
    category: 'fond',
    available: true,
  },
  {
    id: 'fond-neon',
    name: 'Fond Néon',
    desc: 'Ambiance arcade, lumières vives.',
    priceCoins: 200,
    emoji: '🌈',
    category: 'fond',
    available: false,
  },
  {
    id: 'credit-5',
    name: 'Pack 5 cartes mentales',
    desc: 'Cinq cartes mentales à générer sur tes chapitres.',
    priceCoins: 200,
    emoji: '🧩',
    category: 'credit',
    available: true,
  },
  {
    id: 'credit-15',
    name: 'Pack 15 cartes mentales',
    desc: 'De quoi cartographier tout un trimestre.',
    priceCoins: 500,
    emoji: '🗺️',
    category: 'credit',
    available: true,
  },
  {
    id: 'skin-go-or',
    name: 'Bouton GO doré',
    desc: 'Un bouton de défi en or massif.',
    priceCoins: 150,
    emoji: '🥇',
    category: 'skin',
    available: true,
  },
  {
    id: 'skin-cadre-cyber',
    name: 'Cadre de profil Cyber',
    desc: 'Encadre ton avatar façon futur.',
    priceCoins: 160,
    emoji: '🤖',
    category: 'skin',
    available: false,
  },
]

export function persoByCategory(category: PersoCategory): PersoProduct[] {
  return PERSO_CATALOG.filter((p) => p.category === category)
}
