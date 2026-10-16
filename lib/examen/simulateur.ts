// -----------------------------------------------------------------------------
// « CE QU'IL TE FAUT EN JUIN » — le simulateur de note du bac (16/10/2026,
// maquette 6 de assets-sources/maquettes/marcel-examen.html).
//
// Le calcul que tout élève de terminale fait sur un coin de feuille : ses notes
// de l'année (le contrôle continu) et ses épreuves anticipées de première sont
// déjà acquises ; quelle moyenne lui faut-il sur les épreuves de juin pour
// décrocher une mention ?
//
// LES COEFFICIENTS (session 2027, sur 100) : contrôle continu 40 ; épreuves
// anticipées de français, écrit 5 et oral 5 ; épreuve anticipée de
// mathématiques 2 ; philosophie 8 (voie technologique : 4) ; deux spécialités
// 16 chacune ; Grand oral 8 (voie technologique : 12). La somme fait 100 dans
// les deux voies. À revérifier à chaque rentrée, comme lib/examen/parcours.
//
// Logique PURE et testée.
// -----------------------------------------------------------------------------

export type Voie = 'generale' | 'technologique'

export type CoefficientsBac = {
  controleContinu: number
  francaisEcrit: number
  francaisOral: number
  mathsAnticipees: number
  /** Ce qui reste à passer en juin : philosophie, deux spécialités, Grand oral. */
  juin: number
}

export const COEFFICIENTS_BAC: Record<Voie, CoefficientsBac> = {
  generale: { controleContinu: 40, francaisEcrit: 5, francaisOral: 5, mathsAnticipees: 2, juin: 8 + 16 + 16 + 8 },
  technologique: { controleContinu: 40, francaisEcrit: 5, francaisOral: 5, mathsAnticipees: 2, juin: 4 + 16 + 16 + 12 },
}

export type Mention = { id: 'admis' | 'ab' | 'b' | 'tb' | 'felicitations'; label: string; seuil: number }

export const MENTIONS: readonly Mention[] = [
  { id: 'admis', label: 'Admis', seuil: 10 },
  { id: 'ab', label: 'Assez bien', seuil: 12 },
  { id: 'b', label: 'Bien', seuil: 14 },
  { id: 'tb', label: 'Très bien', seuil: 16 },
  { id: 'felicitations', label: 'Félicitations', seuil: 18 },
]

export type NotesAcquises = {
  voie: Voie
  /** La moyenne de l'année (contrôle continu), sur 20. */
  controleContinu: number | null
  francaisEcrit: number | null
  francaisOral: number | null
  mathsAnticipees: number | null
}

export type Verdict =
  | { etat: 'incomplet'; manque: string[] }
  | { etat: 'acquis' }
  | { etat: 'possible'; moyenne: number }
  | { etat: 'hors-de-portee'; moyenne: number }

/** Une note valide : un nombre entre 0 et 20. */
export function noteValide(n: unknown): n is number {
  return typeof n === 'number' && Number.isFinite(n) && n >= 0 && n <= 20
}

/** Arrondi au dixième SUPÉRIEUR : « il te faut 14,6 », jamais 14,5 qui ne suffirait pas. */
function auDixiemeSuperieur(n: number): number {
  return Math.ceil(n * 10 - 1e-9) / 10
}

/**
 * La moyenne qu'il faut obtenir aux épreuves de juin (philosophie, spécialités,
 * Grand oral) pour atteindre `seuil` sur l'ensemble.
 */
export function noteNecessaire(notes: NotesAcquises, seuil: number): Verdict {
  const manque: string[] = []
  if (!noteValide(notes.controleContinu)) manque.push('ta moyenne de l’année')
  if (!noteValide(notes.francaisEcrit)) manque.push('ta note d’écrit de français')
  if (!noteValide(notes.francaisOral)) manque.push('ta note d’oral de français')
  if (!noteValide(notes.mathsAnticipees)) manque.push('ta note de maths anticipées')
  if (manque.length > 0) return { etat: 'incomplet', manque }

  const c = COEFFICIENTS_BAC[notes.voie]
  const acquis =
    (notes.controleContinu as number) * c.controleContinu +
    (notes.francaisEcrit as number) * c.francaisEcrit +
    (notes.francaisOral as number) * c.francaisOral +
    (notes.mathsAnticipees as number) * c.mathsAnticipees
  const total = c.controleContinu + c.francaisEcrit + c.francaisOral + c.mathsAnticipees + c.juin
  const besoin = (seuil * total - acquis) / c.juin
  if (besoin <= 0) return { etat: 'acquis' }
  const moyenne = auDixiemeSuperieur(besoin)
  return moyenne > 20 ? { etat: 'hors-de-portee', moyenne } : { etat: 'possible', moyenne }
}

/** La moyenne des notes acquises (0-20), pondérée — « tes notes de 1re ». */
export function moyenneFrancais(notes: Pick<NotesAcquises, 'francaisEcrit' | 'francaisOral'>): number | null {
  if (!noteValide(notes.francaisEcrit) || !noteValide(notes.francaisOral)) return null
  return Math.round(((notes.francaisEcrit + notes.francaisOral) / 2) * 10) / 10
}

/** La phrase du verdict. */
export function phraseVerdict(v: Verdict, mention: Mention): string {
  switch (v.etat) {
    case 'incomplet':
      return `Donne-moi ${v.manque.join(', ')} : je calcule le reste.`
    case 'acquis':
      return mention.id === 'admis'
        ? 'Ton bac est déjà assuré avec tes notes. Vise une mention !'
        : `La mention ${mention.label.toLowerCase()} est déjà assurée avec tes notes. Vise plus haut !`
    case 'possible':
      return `de moyenne sur la philo, tes deux spécialités et le Grand oral.`
    case 'hors-de-portee':
      return `Même 20 partout ne suffirait pas cette année : vise la mention juste en dessous.`
  }
}
