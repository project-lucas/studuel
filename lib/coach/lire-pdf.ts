// La lecture d'un PDF joint à une question pour Marcel, DANS LE NAVIGATEUR.
// À part de lib/coach/piece-jointe (lu aussi par le serveur) : pdf.js et son
// worker n'ont rien à faire dans le paquet serveur.

import { MAX_TEXTE_LEN } from './piece-jointe'

/** Les pages lues d'un PDF : au-delà, le texte dépasse déjà ce que Marcel lit. */
const PAGES_PDF_MAX = 30

/**
 * Lit le TEXTE d'un PDF dans le navigateur (pdf.js, le même que le lecteur des
 * annales), borné. Un PDF scanné n'a pas de texte : l'erreur `pdf-sans-texte`
 * permet à l'écran de proposer la photo à la place.
 */
export async function lirePdf(file: File): Promise<string> {
  const pdfjs = await import('pdfjs-dist')
  pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString()
  const tache = pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) })
  const doc = await tache.promise
  let texte = ''
  try {
    for (let i = 1; i <= Math.min(doc.numPages, PAGES_PDF_MAX) && texte.length < MAX_TEXTE_LEN; i++) {
      const page = await doc.getPage(i)
      const contenu = await page.getTextContent()
      texte += contenu.items.map((x) => ('str' in x ? x.str : '')).join(' ') + '\n\n'
    }
  } finally {
    void tache.destroy()
  }
  const propre = texte.replace(/[ \t]+/g, ' ').trim()
  if (propre.length < 20) throw new Error('pdf-sans-texte')
  return propre.slice(0, MAX_TEXTE_LEN)
}
