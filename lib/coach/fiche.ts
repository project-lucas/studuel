// LIRE UNE RÉPONSE DE MARCEL — la mettre en forme sans embarquer un moteur.
//
// Le mode « fiche » demande au modèle un format précis : un titre « # », des
// sections « ## », des puces « - ». Affiché tel quel, ça donne des dièses et des
// tirets au milieu d'une bulle — l'élève voit la plomberie, et une fiche qui ne
// se survole pas n'est pas une fiche.
//
// On ne charge PAS un moteur markdown pour ça : trois formes suffisent, et un
// moteur complet, c'est 40 Ko de JavaScript sur un écran qui en a déjà, plus
// une porte ouverte au HTML arbitraire d'un modèle. Ici, rien n'est interprété
// comme du HTML : on rend des blocs typés, que le composant peint lui-même.
//
// Le mode « exercice » y gagne aussi : il rend des étapes numérotées, qui
// tombent dans le même vocabulaire (des puces).

export type BlocFiche =
  | { type: 'titre'; texte: string }
  | { type: 'section'; texte: string }
  | { type: 'puce'; texte: string }
  | { type: 'texte'; texte: string }

/** Une puce : « - », « • », « * », ou « 1) » / « 2. ». */
const PUCE = /^\s*(?:[-–—•*]|\d+[.)])\s+/

export function lireFiche(brut: string): BlocFiche[] {
  const blocs: BlocFiche[] = []

  for (const ligne of brut.split('\n')) {
    const propre = ligne.trim()
    if (propre.length === 0) continue

    if (propre.startsWith('###')) {
      blocs.push({ type: 'section', texte: nettoyer(propre.replace(/^#+/, '')) })
    } else if (propre.startsWith('##')) {
      blocs.push({ type: 'section', texte: nettoyer(propre.replace(/^#+/, '')) })
    } else if (propre.startsWith('#')) {
      blocs.push({ type: 'titre', texte: nettoyer(propre.replace(/^#+/, '')) })
    } else if (PUCE.test(propre)) {
      blocs.push({ type: 'puce', texte: nettoyer(propre.replace(PUCE, '')) })
    } else {
      blocs.push({ type: 'texte', texte: nettoyer(propre) })
    }
  }

  return blocs.filter((b) => b.texte.length > 0)
}

/**
 * Retire le gras et l'italique de markdown, qui arrivent en prime : on ne les
 * rend pas, et « **important** » avec ses astérisques est pire que « important »
 * sans son gras.
 */
function nettoyer(texte: string): string {
  return texte
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/(?<!\w)[*_](.+?)[*_](?!\w)/g, '$1')
    .trim()
}

/**
 * La réponse a-t-elle une structure, ou est-ce un simple paragraphe ? Sert à ne
 * pas fabriquer une mise en page pour quatre phrases d'indice.
 */
export function estStructuree(blocs: readonly BlocFiche[]): boolean {
  return blocs.some((b) => b.type !== 'texte')
}
