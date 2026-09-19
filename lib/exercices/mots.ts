// -----------------------------------------------------------------------------
// LES MOTS D'UN TEXTE — le découpage partagé par l'écran et le compilateur.
//
// Une question « zone » sur un texte fait TOUCHER des mots (« touche les trois
// verbes conjugués »). Le mot se désigne par son NUMÉRO dans le document. Ce
// numéro est calculé deux fois : par le compilateur, qui range dans la clé les
// numéros des mots marqués `[[g|…]]`, et par l'écran, qui numérote les mots
// qu'il affiche. Les deux passent par CE découpage, et par lui seul : un mot
// compté différemment d'un côté et de l'autre, et l'élève qui touche le bon
// mot serait déclaré faux.
//
// Le texte garde sa mise en forme légère : `**gras**`, `*italique*`, et
// `{{3/4}}` (une fraction écrite en étage). Ces marques ne sont pas des mots.
// -----------------------------------------------------------------------------

export type Jeton =
  | { kind: 'mot'; index: number; texte: string; debut: number; gras: boolean; italique: boolean }
  | { kind: 'sep'; texte: string; gras: boolean; italique: boolean }
  | { kind: 'fraction'; num: string; den: string }

/** Les élisions françaises : « l'enfant » se touche en deux mots. */
const ELISIONS = new Set(['l', 'd', 'j', 'm', 't', 's', 'n', 'c', 'qu', 'jusqu', 'lorsqu', 'puisqu', 'quoiqu'])

const MOT = /[\p{L}\p{N}]+(?:[-'’][\p{L}\p{N}]+)*/uy

/** Coupe « l'enfant » en « l' » + « enfant », pas « aujourd'hui » ni « don't ». */
function eliser(mot: string): string[] {
  const m = /^([\p{L}]+)(['’])(.+)$/u.exec(mot)
  if (!m || !ELISIONS.has(m[1].toLowerCase())) return [mot]
  return [m[1] + m[2], ...eliser(m[3])]
}

/**
 * Découpe une chaîne en jetons. `depart` est le numéro du premier mot : un
 * document numérote ses mots d'un bout à l'autre, bloc après bloc.
 */
export function decouper(s: string, depart = 0): { jetons: Jeton[]; suivant: number } {
  const jetons: Jeton[] = []
  let index = depart
  let gras = false
  let italique = false
  let sep = ''
  const pousserSep = () => {
    if (sep) jetons.push({ kind: 'sep', texte: sep, gras, italique })
    sep = ''
  }
  let i = 0
  while (i < s.length) {
    if (s.startsWith('**', i)) {
      pousserSep()
      gras = !gras
      i += 2
      continue
    }
    if (s.startsWith('{{', i)) {
      const fin = s.indexOf('}}', i + 2)
      const corps = fin > 0 ? s.slice(i + 2, fin) : ''
      const barre = corps.indexOf('/')
      if (fin > 0 && barre > 0) {
        pousserSep()
        jetons.push({ kind: 'fraction', num: corps.slice(0, barre).trim(), den: corps.slice(barre + 1).trim() })
        i = fin + 2
        continue
      }
    }
    if (s[i] === '*') {
      pousserSep()
      italique = !italique
      i += 1
      continue
    }
    MOT.lastIndex = i
    const m = MOT.exec(s)
    if (m) {
      pousserSep()
      let debut = i
      for (const morceau of eliser(m[0])) {
        jetons.push({ kind: 'mot', index, texte: morceau, debut, gras, italique })
        index += 1
        debut += morceau.length
      }
      i += m[0].length
      continue
    }
    sep += s[i]
    i += 1
  }
  pousserSep()
  return { jetons, suivant: index }
}

/** Le texte d'un bloc (paragraphe, réplique, didascalie) — sans le nom du personnage. */
export function texteDuBloc(bloc: string | { replique: string } | { didascalie: string }): string {
  if (typeof bloc === 'string') return bloc
  if ('replique' in bloc) return bloc.replique
  return bloc.didascalie
}

const MARQUE = /\[\[([A-Za-z0-9_-]+)\|([^\]]+)\]\]/g

/**
 * Ôte les marques `[[g|mots]]` d'une chaîne et rend, pour chaque groupe, les
 * plages de caractères marquées dans la chaîne nettoyée.
 */
export function oterMarques(s: string): { texte: string; plages: { groupe: string; debut: number; fin: number }[] } {
  const plages: { groupe: string; debut: number; fin: number }[] = []
  let texte = ''
  let dernier = 0
  for (const m of s.matchAll(MARQUE)) {
    texte += s.slice(dernier, m.index)
    const debut = texte.length
    texte += m[2]
    plages.push({ groupe: m[1], debut, fin: texte.length })
    dernier = (m.index ?? 0) + m[0].length
  }
  texte += s.slice(dernier)
  return { texte, plages }
}

/**
 * Les numéros des mots marqués, par groupe, pour une suite de chaînes lues
 * dans l'ordre (les blocs d'un texte, les répliques d'un dialogue). Rend aussi
 * les chaînes nettoyées et le nombre total de mots.
 */
export function motsMarques(chaines: string[]): {
  nettoyees: string[]
  groupes: Map<string, number[]>
  total: number
} {
  const groupes = new Map<string, number[]>()
  const nettoyees: string[] = []
  let index = 0
  for (const brute of chaines) {
    const { texte, plages } = oterMarques(brute)
    nettoyees.push(texte)
    const { jetons, suivant } = decouper(texte, index)
    for (const j of jetons) {
      if (j.kind !== 'mot') continue
      for (const p of plages) {
        if (j.debut >= p.debut && j.debut < p.fin) {
          const liste = groupes.get(p.groupe) ?? []
          liste.push(j.index)
          groupes.set(p.groupe, liste)
        }
      }
    }
    index = suivant
  }
  return { nettoyees, groupes, total: index }
}

/** Le texte brut d'une chaîne balisée, pour un lecteur d'écran ou un aperçu. */
export function texteBrut(s: string): string {
  return oterMarques(s)
    .texte.replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/\{\{([^}/]+)\/([^}]+)\}\}/g, '$1/$2')
}
