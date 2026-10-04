// -----------------------------------------------------------------------------
// LA SEMAINE DE SÉRIE, EN FLAMMES (04/10/2026, Lucas : « il faut trouver autre
// chose — le côté animation, une animation particulière s'il est en série et
// s'il a fait une semaine parfaite »).
//
// Les sept jours de la carte de série ne sont plus des pastilles violettes
// cochées : un jour fait est une FLAMME, un jour manqué une BRAISE qui fume,
// aujourd'hui une flamme fantôme « à allumer ». Les jours faits d'affilée sont
// reliés par une MÈCHE ambrée : la série se VOIT comme une chaîne. À
// l'affichage, une étincelle court le long de la mèche et allume les flammes
// une à une (la mèche qui brûle) ; sept jours sur sept, et la semaine passe à
// l'OR (flammes couronnées, mèche dorée, médaille).
//
// Ce module dit l'ÉTAT, la GÉOMÉTRIE des mèches et le TEMPO de l'allumage ;
// le composant (components/reviser/SemaineFlammes) ne fait que les jouer. Pur
// et testé.
// -----------------------------------------------------------------------------

/** Un jour de la bande (même forme que `weekProgress`, lundi = 0). */
export type JourSemaine = {
  done: boolean
  isToday: boolean
  isFuture: boolean
  /** Un GEL de série a couvert ce jour (user_wallet.jours_geles) : il ponte la
   *  série sans compter comme travaillé — il se dessine en glace. */
  gele?: boolean
}

export type EtatJour = 'fait' | 'gele' | 'aujourdhui' | 'manque' | 'avenir'

export function etatDuJour(j: JourSemaine): EtatJour {
  if (j.done) return 'fait'
  if (j.gele) return 'gele'
  if (j.isToday) return 'aujourdhui'
  if (j.isFuture) return 'avenir'
  return 'manque'
}

/** Une MÈCHE : des jours faits d'affilée, de `debut` à `fin` (index inclus). */
export type Meche = { debut: number; fin: number }

/**
 * Les mèches de la semaine : chaque suite d'au moins deux jours faits. Un jour
 * GELÉ ne casse pas la mèche (le gel ponte la série) : elle passe à travers la
 * glace — mais elle commence et finit toujours sur un jour fait.
 */
export function mechesDeLaSemaine(semaine: readonly JourSemaine[]): Meche[] {
  const out: Meche[] = []
  let debut = -1
  let dernierFait = -1
  const clore = () => {
    if (debut >= 0 && dernierFait > debut) out.push({ debut, fin: dernierFait })
    debut = -1
    dernierFait = -1
  }
  semaine.forEach((j, i) => {
    if (j.done) {
      if (debut < 0) debut = i
      dernierFait = i
    } else if (!(j.gele && debut >= 0)) {
      clore()
    }
  })
  clore()
  return out
}

/** Sept jours sur sept : la semaine passe à l'or. */
export function semaineParfaite(semaine: readonly JourSemaine[]): boolean {
  return semaine.length === 7 && semaine.every((j) => j.done)
}

/** Les jours faits de la semaine. */
export function joursFaits(semaine: readonly JourSemaine[]): number {
  return semaine.filter((j) => j.done).length
}

/**
 * La série est-elle « en feu » ? Le jour est fait et la veille aussi (ou la
 * série stockée le dit, pour un lundi qui prolonge la semaine passée) : la
 * mèche qui mène à aujourd'hui brûle, et sa flamme de tête danse.
 */
export function enSerie(semaine: readonly JourSemaine[], serie: number): boolean {
  const i = semaine.findIndex((j) => j.isToday)
  if (i < 0 || !semaine[i].done) return false
  return serie >= 2 || (i > 0 && semaine[i - 1].done)
}

/** Le pas de l'allumage entre deux jours voisins, en ms. */
export const PAS_ALLUMAGE_MS = 110

/**
 * Quand la flamme du jour `i` s'allume : les jours d'une mèche s'allument un
 * à un dans l'ordre (l'étincelle passe), un jour seul s'allume avec le premier
 * de la semaine. Le temps part de 0 au premier jour fait.
 */
export function retardAllumage(semaine: readonly JourSemaine[], i: number): number {
  const premier = semaine.findIndex((j) => j.done)
  if (premier < 0 || !semaine[i]?.done) return 0
  return (i - premier) * PAS_ALLUMAGE_MS
}

/**
 * La mèche en pourcentage de la rangée : elle va du CENTRE du premier jeton au
 * centre du dernier (sept colonnes égales).
 */
export function geometrieMeche(m: Meche, colonnes = 7): { gauche: number; largeur: number } {
  const pas = 100 / colonnes
  return { gauche: (m.debut + 0.5) * pas, largeur: (m.fin - m.debut) * pas }
}

/** La phrase sous la semaine — elle dit ce qui se joue cette semaine. */
export function phraseSemaine(semaine: readonly JourSemaine[]): string {
  const faits = joursFaits(semaine)
  if (semaineParfaite(semaine)) return 'Semaine parfaite : sept jours sur sept !'
  const restants = semaine.filter((j) => !j.done && (j.isFuture || j.isToday)).length
  if (faits + restants === 7) {
    return restants === 1
      ? 'Encore aujourd’hui et la semaine est parfaite.'
      : `Encore ${restants} jours pour une semaine parfaite.`
  }
  return `${faits} jour${faits > 1 ? 's' : ''} sur 7 cette semaine.`
}
