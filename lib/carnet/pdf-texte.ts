// -----------------------------------------------------------------------------
// LE TEXTE D'UN PDF, PRÊT POUR L'IA — la partie pure.
//
// « Insérer un PDF » (10/09/2026, Lucas : « comme Wooflash ») : l'élève choisit
// le PDF de son cours, le navigateur en extrait le texte (pdf.js, dans
// `components/carnet/lirePdf.ts`), et ce texte part à l'IA comme un cours
// collé — même porte, même validation carte par carte. Ici : comment on
// recolle les morceaux que pdf.js rend (une liste de fragments par page) en
// un texte lisible, et la borne au-delà de laquelle le serveur couperait de
// toute façon (`MAX_THEME_LEN` dans `app/carnet/cours/ai-actions.ts`).
// -----------------------------------------------------------------------------

/** Ce que l'IA lit au plus — la même borne que le serveur. */
export const LIMITE_TEXTE_PDF = 12_000

/** Pages au-delà desquelles on arrête de lire : un manuel entier n'est pas un cours. */
export const MAX_PAGES_PDF = 40

/**
 * Recolle les fragments d'un PDF en texte : les fragments d'une page sont
 * séparés d'une espace, les pages d'une ligne vide, et les blancs répétés
 * sont ramenés à un seul. Une page vide (scan, image) ne laisse rien.
 */
export function assemblerTextePdf(pages: readonly (readonly string[])[]): string {
  return pages
    .map((fragments) =>
      fragments
        .map((f) => f.replace(/\s+/g, ' ').trim())
        .filter((f) => f.length > 0)
        .join(' '),
    )
    .filter((page) => page.length > 0)
    .join('\n\n')
}

/**
 * Coupe le texte à la borne de l'IA, sur une fin de mot, et dit s'il a fallu
 * couper — pour le montrer à l'élève plutôt que de tronquer en silence.
 */
export function tronquerPourIa(texte: string): { texte: string; tronque: boolean } {
  if (texte.length <= LIMITE_TEXTE_PDF) return { texte, tronque: false }
  const coupe = texte.slice(0, LIMITE_TEXTE_PDF)
  const dernierBlanc = coupe.lastIndexOf(' ')
  return { texte: (dernierBlanc > 0 ? coupe.slice(0, dernierBlanc) : coupe).trimEnd(), tronque: true }
}
