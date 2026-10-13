// LES FICHES DE RÉVISION EN PDF — ce qui se calcule sans réseau.
//
// Une fiche PDF est vendue PAR CHAPITRE, par la porte qui existe déjà
// (`chapter_unlocks`, 30 gemmes, ou l'abonnement) ; ce module ne connaît que
// le registre (généré depuis contenu/fiches/) et les noms des objets dans les
// buckets de la migration 563. La signature de l'URL, qui a besoin de la
// session de l'élève, vit dans pdf-server.ts.

import { FICHES_PDF, type FichePdf } from './registre'

export type { FichePdf }

/** Le bucket PRIVÉ des PDF : un objet par chapitre. */
export const BUCKET_FICHES = 'fiches'

/** Le bucket PUBLIC des illustrations de fiche, en 360 px : elles vendent la fiche. */
export const BUCKET_APERCUS = 'fiches-apercus'

/** Une URL signée vit le temps d'ouvrir ou d'enregistrer le PDF, pas plus. */
export const DUREE_URL_SIGNEE_S = 600

/** La fiche PDF d'un chapitre, s'il en a une. */
export function fichePdfDe(chapitreId: string): FichePdf | null {
  return FICHES_PDF[chapitreId] ?? null
}

/** Le nom de l'objet PDF dans le bucket — ce que `fiche_pdf_acces` (563) attend. */
export function nomPdf(chapitreId: string): string {
  return `${chapitreId}.pdf`
}

/** Le nom de l'illustration dans le bucket des aperçus. */
export function nomApercu(chapitreId: string): string {
  return `${chapitreId}.webp`
}

/** L'adresse de l'app qui sert le PDF (elle redirige vers l'URL signée). */
export function hrefFichePdf(chapitreId: string, { telecharger = false } = {}): string {
  return `/api/fiches/${chapitreId}${telecharger ? '?dl=1' : ''}`
}

/**
 * Le nom du fichier enregistré sur le téléphone : « Calcul integral - Tle.pdf ».
 * Sans accent ni signe exotique : l'en-tête Content-Disposition n'aime ni les
 * uns ni les autres, et un nom ASCII s'ouvre partout.
 */
export function nomDeTelechargement(fiche: Pick<FichePdf, 'titreAffiche' | 'niveau'>): string {
  const asciiser = (s: string) =>
    s
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[’']/g, ' ')
      .replace(/[^A-Za-z0-9 .,()-]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  const titre = asciiser(fiche.titreAffiche) || 'Fiche de revision'
  const niveau = asciiser(fiche.niveau)
  return `${niveau ? `${titre} - ${niveau}` : titre}.pdf`
}
