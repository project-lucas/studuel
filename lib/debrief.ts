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

// -----------------------------------------------------------------------------
// Récompense du débrief du jour — un petit gain de pièces qui met le bloc « en
// évidence » : terminer son point du jour vaut quelque chose. Montant FIXE (pas
// indexé sur les victoires) pour que la promesse affichée reste stable et qu'on
// récompense l'acte de faire son débrief, pas la performance. Voir 081.
// -----------------------------------------------------------------------------
export const DEBRIEF_REWARD_COINS = 10

// Le débrief du jour est « terminé » quand chaque habitude référencée a reçu une
// issue (rechute ou victoire). Sélection vide → jamais terminé (rien à raconter).
export function debriefComplete(
  selected: string[],
  outcomes: Record<string, DebriefOutcome>,
): boolean {
  if (selected.length === 0) return false
  return selected.every((id) => isDebriefOutcome(outcomes[id]))
}

// Pièces à créditer pour le débrief du jour : le forfait s'il est terminé, 0
// sinon. Gardé pur et minuscule pour être testé et réutilisé côté action/UI.
export function debriefDailyReward(
  selected: string[],
  outcomes: Record<string, DebriefOutcome>,
): number {
  return debriefComplete(selected, outcomes) ? DEBRIEF_REWARD_COINS : 0
}

// -----------------------------------------------------------------------------
// Rétrospective annuelle — « ce que j'ai coaché cette année ». On agrège tous
// les débriefs du jour sur la période pour donner à l'élève une vision claire de
// son parcours : par habitude (victoires / rechutes / réponses), et en global.
// -----------------------------------------------------------------------------
export type DebriefLogEntry = {
  pair_id: string
  date: string
  outcome: DebriefOutcome
}

export type DebriefPairStat = {
  id: string
  bad: string
  good: string
  goodEmoji: string
  wins: number
  slips: number
  answered: number
}

export type DebriefYearStats = {
  // Une entrée par habitude coachée (sélectionnée ou présente dans l'historique),
  // triée : plus de victoires d'abord, puis plus de réponses.
  perPair: DebriefPairStat[]
  totalWins: number
  totalSlips: number
  totalAnswered: number
  // Jours distincts où l'élève a fait au moins un débrief.
  daysCoached: number
  // Part de victoires sur l'ensemble des réponses (0..1, 0 si aucune réponse).
  winRate: number
  // L'habitude la mieux tenue (le plus de victoires), null si rien.
  bestPairId: string | null
}

export function debriefYearStats(
  selected: string[],
  // Accepte les lignes brutes de debrief_logs (outcome typé string en base).
  logs: ReadonlyArray<{ pair_id: string; date: string; outcome: string }>,
): DebriefYearStats {
  const valid = logs.filter((l) => isDebriefPairId(l.pair_id) && isDebriefOutcome(l.outcome))

  // Univers des habitudes à afficher : celles référencées + celles vues passer.
  const ids = new Set<string>()
  for (const id of selected) if (isDebriefPairId(id)) ids.add(id)
  for (const l of valid) ids.add(l.pair_id)

  const perPair: DebriefPairStat[] = []
  for (const id of ids) {
    const meta = DEBRIEF_CATALOG.find((p) => p.id === id)
    if (!meta) continue
    const mine = valid.filter((l) => l.pair_id === id)
    const wins = mine.filter((l) => l.outcome === 'good').length
    const slips = mine.filter((l) => l.outcome === 'bad').length
    perPair.push({
      id,
      bad: meta.bad,
      good: meta.good,
      goodEmoji: meta.goodEmoji,
      wins,
      slips,
      answered: wins + slips,
    })
  }
  perPair.sort((a, b) => b.wins - a.wins || b.answered - a.answered)

  const totalWins = perPair.reduce((s, p) => s + p.wins, 0)
  const totalSlips = perPair.reduce((s, p) => s + p.slips, 0)
  const totalAnswered = totalWins + totalSlips
  const daysCoached = new Set(valid.map((l) => l.date)).size
  const bestPairId = perPair.length > 0 && perPair[0].wins > 0 ? perPair[0].id : null

  return {
    perPair,
    totalWins,
    totalSlips,
    totalAnswered,
    daysCoached,
    winRate: totalAnswered > 0 ? totalWins / totalAnswered : 0,
    bestPairId,
  }
}
