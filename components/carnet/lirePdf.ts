'use client'

import { MAX_PAGES_PDF, assemblerTextePdf } from '@/lib/carnet/pdf-texte'

/** Taille au-delà de laquelle un PDF est refusé sans être ouvert. */
export const MAX_PDF_OCTETS = 15_000_000

/**
 * Lit le texte d'un PDF DANS LE NAVIGATEUR (pdf.js), page après page,
 * jusqu'à `MAX_PAGES_PDF`. Le fichier ne quitte pas le téléphone : seul le
 * texte part ensuite à l'IA, comme un cours collé. pdf.js est chargé à la
 * demande — il ne pèse rien tant qu'on ne touche pas « Insérer un PDF ».
 *
 * Un PDF scanné (des images, pas de texte) rend une chaîne vide : c'est à
 * l'appelant de le dire à l'élève, et de lui proposer la photo.
 */
export async function lireTextePdf(file: File): Promise<string> {
  if (file.size > MAX_PDF_OCTETS) throw new Error('pdf-trop-lourd')
  const pdfjs = await import('pdfjs-dist')
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
  ).toString()

  const tache = pdfjs.getDocument({ data: await file.arrayBuffer() })
  try {
    const doc = await tache.promise
    const pages: string[][] = []
    const total = Math.min(doc.numPages, MAX_PAGES_PDF)
    for (let i = 1; i <= total; i += 1) {
      const page = await doc.getPage(i)
      const contenu = await page.getTextContent()
      pages.push(contenu.items.map((item) => ('str' in item ? item.str : '')))
    }
    return assemblerTextePdf(pages)
  } finally {
    // Libère le worker et la mémoire du document, même si une page a échoué.
    await tache.destroy()
  }
}
