// LES GAINS — ce qu'une fin de partie a rapporté, et comment ça vole vers le
// bandeau du haut.
//
// LE GESTE VIENT DE CLASH ROYALE. Quand on améliore une carte, on ne lit pas
// « −4000 or » dans un tableau : une poignée de pièces JAILLIT de la carte,
// décrit un arc vers le compteur du haut, et le compteur monte à mesure
// qu'elles y tombent. Le joueur voit d'où vient la récompense, où elle va, et
// que son solde a changé — trois informations, un seul geste, aucun texte.
//
// Studuel avait le contraire : les récompenses étaient versées en base et le
// compteur du bandeau les découvrait au prochain rendu, sans que rien ne relie
// les deux. Un élève finissait un quiz, remontait, et son solde avait changé
// tout seul. Ce module donne le vocabulaire du trajet ; le vol lui-même est
// dans `components/recompenses/`.
//
// TOUT CE QUI EST CALCULABLE VIT ICI, pur et testé : combien de jetons pour un
// montant, comment on répartit le montant entre eux, quand chacun part. Le
// composant ne fait que jouer ce que ce module a décidé — sinon la seule façon
// de vérifier une animation serait de la regarder.

/** Les unités qu'une fin de partie peut rapporter. */
export type UniteGain = 'xp' | 'ecu' | 'gemme' | 'couronne' | 'trophee'

/** Un gain : une unité, un montant positif. */
export type Gain = {
  unite: UniteGain
  montant: number
}

export type DefinitionUnite = {
  unite: UniteGain
  /** Nom au singulier, tel qu'on le dit à l'élève. */
  un: string
  /** Nom au pluriel. */
  plusieurs: string
  /**
   * La pastille du bandeau qui reçoit le vol, repérée par `data-hud-cible`.
   *
   * `null` = cette unité n'a AUCUN compteur permanent à l'écran. Elle s'affiche
   * alors dans le panneau et ne vole pas : faire converger des trophées vers un
   * coin vide serait une promesse que l'interface ne tient pas.
   */
  cible: string | null
}

/**
 * Le catalogue, dans l'ORDRE D'AFFICHAGE du panneau — et cet ordre est un
 * choix : du plus fréquent (l'XP, gagnée à chaque acquisition) au plus rare
 * (la gemme). On lit la ligne de gauche à droite comme on lit une phrase, et
 * la rareté arrive en fin de phrase, là où elle s'entend.
 */
export const UNITES: readonly DefinitionUnite[] = [
  { unite: 'xp', un: 'XP', plusieurs: 'XP', cible: 'xp' },
  { unite: 'couronne', un: 'couronne', plusieurs: 'couronnes', cible: null },
  { unite: 'trophee', un: 'trophée', plusieurs: 'trophées', cible: null },
  { unite: 'ecu', un: 'écu', plusieurs: 'écus', cible: 'ecu' },
  { unite: 'gemme', un: 'cristal', plusieurs: 'cristaux', cible: 'gemme' },
] as const

const RANG = new Map(UNITES.map((d, i) => [d.unite, i]))

/** La définition d'une unité (jamais `undefined` : le catalogue est exhaustif). */
export function definition(unite: UniteGain): DefinitionUnite {
  return UNITES[RANG.get(unite) ?? 0]
}

/** « 1 écu », « 12 écus » — le libellé lu par les lecteurs d'écran. */
export function libelleGain(gain: Gain): string {
  const def = definition(gain.unite)
  return `${gain.montant} ${gain.montant > 1 ? def.plusieurs : def.un}`
}

/**
 * Met les gains en forme pour l'affichage : les montants d'une même unité sont
 * ADDITIONNÉS, les montants nuls ou négatifs disparaissent, et le tout revient
 * dans l'ordre du catalogue.
 *
 * L'addition n'est pas un confort. Une fin de quiz peut verser l'XP de la 2e
 * couronne puis celle de la 3e : deux appels, deux gains, une seule chose du
 * point de vue de l'élève. Deux pastilles « +40 XP » et « +60 XP » côte à côte
 * lui feraient chercher la différence.
 *
 * Les montants négatifs (un trophée perdu) sortent : ce panneau annonce des
 * RÉCOMPENSES. Une perte se dit ailleurs, et pas avec une fanfare.
 */
export function agregerGains(gains: readonly Gain[] | null | undefined): Gain[] {
  // ⚠️ TOLÈRE L'ABSENCE. Ces gains traversent une Server Action, et une page
  // encore chargée pendant un déploiement peut appeler une version qui ne les
  // renvoyait pas : `gains` arrive alors `undefined`. Un écran de fin ne doit
  // pas tomber parce que sa décoration manque — il n'affiche rien.
  if (!Array.isArray(gains)) return []
  const totaux = new Map<UniteGain, number>()
  for (const g of gains) {
    if (!g || !RANG.has(g.unite)) continue
    const montant = Number(g.montant)
    if (!Number.isFinite(montant) || montant <= 0) continue
    totaux.set(g.unite, (totaux.get(g.unite) ?? 0) + Math.floor(montant))
  }
  return [...totaux.entries()]
    .map(([unite, montant]) => ({ unite, montant }))
    .sort((a, b) => (RANG.get(a.unite) ?? 0) - (RANG.get(b.unite) ?? 0))
}

/** Y a-t-il quoi que ce soit à fêter ? */
export function aDesGains(gains: readonly Gain[]): boolean {
  return agregerGains(gains).length > 0
}

// ------------------------------------------------------------------ les jetons

/** Jamais moins de trois jetons : un seul objet qui vole n'est pas une pluie. */
export const JETONS_MIN = 3
/** Jamais plus de douze : au-delà l'œil ne compte plus, il voit du bruit. */
export const JETONS_MAX = 12

/**
 * Combien de jetons pour un montant.
 *
 * PAS UN PAR UNITÉ. Clash Royale ne fait pas voler 4 000 pièces pour 4 000 or :
 * il en fait voler une douzaine. Le nombre de jetons dit l'ORDRE DE GRANDEUR du
 * gain, pas sa valeur — la valeur, c'est le compteur qui la dit en montant.
 *
 * La racine carrée donne exactement cette courbe : elle sépare bien les petits
 * gains (5 XP → 3 jetons, 30 → 6) et sature poliment sur les gros (250 → 12).
 * Une échelle linéaire aurait fait voler 5 jetons pour 5 XP puis buté sur le
 * plafond dès 12, où tout se serait mis à se ressembler.
 */
export function jetonsPour(montant: number): number {
  const m = Number(montant)
  if (!Number.isFinite(m) || m <= 0) return 0
  return Math.min(JETONS_MAX, Math.max(JETONS_MIN, Math.ceil(Math.sqrt(m))))
}

/**
 * Découpe un montant en `n` parts entières dont la somme fait EXACTEMENT le
 * montant — c'est ce qui permet au compteur de monter jeton après jeton et de
 * finir juste.
 *
 * ⚠️ LA SOMME EXACTE EST TOUT L'ENJEU. Répartir 5 XP sur 3 jetons avec un
 * arrondi naïf (`Math.round(5/3)` × 3) donnerait 6 : le compteur afficherait un
 * point de plus que la base, jusqu'au prochain rafraîchissement qui le ferait
 * redescendre tout seul. Un solde qui recule sans raison, c'est un bug que
 * l'élève voit et que personne ne reproduit.
 *
 * Les restes vont aux DERNIERS jetons : la fin du vol est le moment où le
 * regard est déjà sur le compteur.
 */
export function repartir(montant: number, n: number): number[] {
  const m = Math.max(0, Math.floor(Number(montant) || 0))
  const parts = Math.max(0, Math.floor(Number(n) || 0))
  if (parts === 0) return []
  const base = Math.floor(m / parts)
  const reste = m - base * parts
  return Array.from({ length: parts }, (_, i) =>
    // Les `reste` derniers jetons portent une unité de plus.
    i >= parts - reste ? base + 1 : base,
  )
}

// -------------------------------------------------------------------- le vol

/** Écart maximal entre deux départs (ms) — au-delà, la pluie se disperse. */
export const ECART_MAX = 55
/** Toute la volée est partie en moins de ça (ms). */
export const SALVE_MAX = 460

export type VolJeton = {
  /** Départ, en ms après le début de la volée. */
  retard: number
  /** Durée du trajet, en ms. */
  duree: number
  /** Décalage horizontal au départ, en px (négatif = vers la gauche). */
  ecartX: number
  /** Hauteur de l'arc, en px — le jeton monte avant de tomber sur la cible. */
  arc: number
}

/**
 * Le trajet du jeton `i` d'une volée de `n`.
 *
 * TROIS IRRÉGULARITÉS VOULUES, et aucune tirée au sort. Un tirage rendrait le
 * rendu impossible à tester, et surtout impossible à corriger : on ne peut pas
 * régler une animation dont on ne peut pas rejouer une image. Les trois motifs
 * ci-dessous sont périodiques, donc reproductibles à l'identique.
 *
 *  · les jetons ne partent pas ensemble (`retard`) — une salve simultanée se lit
 *    comme UN objet qui grossit, pas comme une poignée de pièces ;
 *  · ils ne mettent pas le même temps (`duree`, période 3) — sinon ils arrivent
 *    en rang, et le compteur monte d'un coup au lieu de s'égrener ;
 *  · ils s'écartent en éventail (`ecartX`) puis se rejoignent sur la cible,
 *    ce qui donne l'entonnoir caractéristique du geste.
 */
export function volJeton(i: number, n: number): VolJeton {
  const total = Math.max(1, Math.floor(n))
  const index = Math.min(Math.max(0, Math.floor(i)), total - 1)
  const ecart = total > 1 ? Math.min(ECART_MAX, SALVE_MAX / (total - 1)) : 0

  return {
    retard: Math.round(index * ecart),
    duree: 620 + (index % 3) * 70,
    // Éventail centré : le jeton du milieu part droit, les autres s'écartent.
    ecartX: Math.round((index - (total - 1) / 2) * 22),
    // L'arc alterne haut/bas d'un jeton à l'autre pour que les trajectoires ne
    // se superposent pas en une seule courbe épaisse.
    arc: 54 + (index % 4) * 16,
  }
}

/** Quand la volée entière est arrivée (ms) — le moment de resynchroniser. */
export function dureeVolee(n: number): number {
  if (n <= 0) return 0
  let fin = 0
  for (let i = 0; i < n; i += 1) {
    const v = volJeton(i, n)
    fin = Math.max(fin, v.retard + v.duree)
  }
  return fin
}
