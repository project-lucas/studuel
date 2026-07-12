// Le débrief d'habitudes de l'onglet Moi : l'élève référence ses habitudes
// actuelles (les freins), chacune mise en face de l'habitude saine qui la
// remplace, avec le bénéfice chiffré qui donne envie de basculer. En fin de
// journée, il raconte : frein retombé ou victoire — un débrief, pas un juge.

export type DebriefOutcome = 'bad' | 'good'

export type DebriefPair = {
  id: string
  // L'habitude actuelle (le frein), à la première personne.
  bad: string
  badEmoji: string
  // L'habitude saine suggérée en face.
  good: string
  goodEmoji: string
  // Le bénéfice concret affiché sous l'habitude saine.
  benefit: string
}

// Catalogue fermé (pas de création libre) — le contenu vit dans le code,
// comme SHOP_CATALOG au Trésor.
export const DEBRIEF_CATALOG: DebriefPair[] = [
  {
    id: 'hydratation',
    badEmoji: '🥤',
    bad: "Je bois peu d'eau dans la journée",
    goodEmoji: '💧',
    good: "Boire de l'eau régulièrement",
    benefit: "jusqu'à +15 % de mémorisation",
  },
  {
    id: 'questions',
    badEmoji: '🤐',
    bad: 'Je ne pose pas mes questions en cours',
    goodEmoji: '🙋',
    good: 'Poser mes questions en cours',
    benefit: 'des heures de reprise économisées à la maison',
  },
  {
    id: 'telephone',
    badEmoji: '📱',
    bad: 'Téléphone à côté pendant les devoirs',
    goodEmoji: '📵',
    good: 'Téléphone dans une autre pièce',
    benefit: '23 min de concentration sauvées par alerte évitée',
  },
  {
    id: 'coucher',
    badEmoji: '🌃',
    bad: 'Je me couche après minuit',
    goodEmoji: '😴',
    good: 'Me coucher avant 23 h',
    benefit: 'le sommeil profond grave la journée en mémoire',
  },
  {
    id: 'bachotage',
    badEmoji: '⏳',
    bad: 'Je révise tout la veille du contrôle',
    goodEmoji: '📆',
    good: 'Réviser en plusieurs petites sessions',
    benefit: 'rétention ×2 grâce à l’espacement',
  },
  {
    id: 'relecture',
    badEmoji: '👀',
    bad: 'Je relis mon cours sans me tester',
    goodEmoji: '🎯',
    good: 'Me tester en quiz',
    benefit: '+50 % de rétention (effet test)',
  },
  {
    id: 'pauses',
    badEmoji: '🥵',
    bad: 'Je travaille sans aucune pause',
    goodEmoji: '⏸️',
    good: '5 min de pause toutes les 25 min',
    benefit: 'attention stable jusqu’au bout de la session',
  },
  {
    id: 'petit-dej',
    badEmoji: '🍽️',
    bad: 'Je pars le ventre vide le matin',
    goodEmoji: '🥐',
    good: 'Prendre un vrai petit-déjeuner',
    benefit: '20 % de ton énergie part dans ton cerveau',
  },
]

// Icônes-boutons illustrées du débrief (batch 10 du doc de prompts). Ajouter
// l'id ici dès que ses DEUX images sont déposées dans
// public/images/debrief/<id>-bad.webp et <id>-good.webp — repli émoji sinon.
const DEBRIEF_ICON_IDS: string[] = []

export function debriefIcon(
  id: string,
  outcome: DebriefOutcome,
): string | undefined {
  return DEBRIEF_ICON_IDS.includes(id)
    ? `/images/debrief/${id}-${outcome}.webp`
    : undefined
}

export const isDebriefOutcome = (v: unknown): v is DebriefOutcome =>
  v === 'bad' || v === 'good'

export const isDebriefPairId = (v: string): boolean =>
  DEBRIEF_CATALOG.some((p) => p.id === v)

// Bilan du jour : victoires (habitude saine tenue), rechutes (frein retombé),
// et ce qui reste sans réponse. Les issues hors sélection sont ignorées.
export function debriefScore(
  selected: string[],
  outcomes: Record<string, DebriefOutcome>,
): { wins: number; slips: number; pending: number; total: number } {
  let wins = 0
  let slips = 0
  for (const id of selected) {
    if (outcomes[id] === 'good') wins++
    else if (outcomes[id] === 'bad') slips++
  }
  return {
    wins,
    slips,
    pending: selected.length - wins - slips,
    total: selected.length,
  }
}

// Le mot de la fin du débrief — encourageant, jamais culpabilisant.
export function debriefMessage(wins: number, total: number): string {
  if (total === 0) return ''
  if (wins === total) return 'Journée parfaite : toutes tes nouvelles habitudes tenues ! 🏆'
  if (wins >= Math.ceil(total / 2)) return 'Belle journée — la bascule est en route.'
  if (wins > 0) return 'Une victoire aujourd’hui, c’est une de plus qu’hier.'
  return 'Demain est une nouvelle chance : choisis UNE habitude à tenir.'
}
