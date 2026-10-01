// Le balisage minimal du texte d'un corrigé, lu en segments :
//   **gras** · *italique* · `code` · $formule$
//
// Pur : le rendu (KaTeX pour les formules) est l'affaire du composant. Une
// formule et un code sont ATOMIQUES — un astérisque à l'intérieur (« a*b »,
// « x^* ») n'ouvre pas d'italique. Un balisage jamais refermé est rendu tel
// quel plutôt que d'avaler la fin du paragraphe.

export type Segment =
  | { type: 'texte'; valeur: string; gras: boolean; italique: boolean }
  | { type: 'code'; valeur: string }
  | { type: 'formule'; valeur: string }

function ferme(texte: string, depuis: number, marque: string): number {
  let i = depuis
  while (i < texte.length) {
    const j = texte.indexOf(marque, i)
    if (j === -1) return -1
    if (texte[j - 1] !== '\\') return j
    i = j + 1
  }
  return -1
}

export function lireTexte(texte: string): Segment[] {
  const out: Segment[] = []
  let gras = false
  let italique = false
  let tampon = ''

  const pousser = () => {
    if (tampon) out.push({ type: 'texte', valeur: tampon, gras, italique })
    tampon = ''
  }

  let i = 0
  while (i < texte.length) {
    const c = texte[i]
    if (c === '\\' && texte[i + 1] === '$') {
      tampon += '$'
      i += 2
      continue
    }
    if (c === '$' || c === '`') {
      const fin = ferme(texte, i + 1, c)
      if (fin > i + 1) {
        pousser()
        out.push({ type: c === '$' ? 'formule' : 'code', valeur: texte.slice(i + 1, fin) })
        i = fin + 1
        continue
      }
    }
    if (c === '*' && texte[i + 1] === '*') {
      // Un gras qui s'ouvre sans se refermer reste du texte.
      if (gras || texte.indexOf('**', i + 2) !== -1) {
        pousser()
        gras = !gras
        i += 2
        continue
      }
    } else if (c === '*') {
      if (italique || texte.indexOf('*', i + 1) !== -1) {
        pousser()
        italique = !italique
        i += 1
        continue
      }
    }
    tampon += c
    i += 1
  }
  pousser()
  return out
}

/** Le texte sans balisage — pour un `aria-label`, un titre d'onglet, un extrait. */
export function texteBrut(texte: string): string {
  return lireTexte(texte)
    .map((s) => s.valeur)
    .join('')
}
