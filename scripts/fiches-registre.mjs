// LE REGISTRE DES FICHES PDF — ce que l'app sait d'une fiche sans lire la base.
//
//   node scripts/fiches-registre.mjs
//
// Relit les index `contenu/fiches/<niveau>/<matière>.json` et le contenu de
// chaque fiche, et écrit `lib/fiches/registre.ts` : chapitre → niveau, matière,
// slug, titre affiché, accroche. C'est par ce registre que la page Fiche d'un
// chapitre (`/reviser/<matière>/<chapitre>/carte`) sait qu'une fiche PDF existe
// pour lui — et donc qu'il faut la vendre, et la servir — et par lui que la
// route `/api/fiches/<chapitre>` nomme l'objet à signer dans le bucket.
//
// Pourquoi un fichier généré et pas une lecture de la base : la liste est la
// même pour tous, elle ne change qu'à une livraison de fiches, et une lecture
// de plus par ouverture de chapitre coûterait 60 ms pour rien (la règle de
// l'encyclopédie). Le test lib/fiches/contenu.test.ts refuse un registre en
// retard sur les index.

import fs from 'node:fs'
import path from 'node:path'
import { listerFiches } from './fiches-rendre.mjs'

const RACINE = path.resolve(import.meta.dirname, '..')
const SORTIE = path.join(RACINE, 'lib', 'fiches', 'registre.ts')

/**
 * Le texte d'une fiche, en texte BRUT : les chaînes du JSON parlent le
 * mini-langage du rendu (`**gras**`, `&nbsp;`, `<i>`), que React afficherait
 * tel quel dans l'app (« libre&nbsp;? » s'est vu à l'écran).
 */
export function texteBrut(s) {
  return String(s ?? '')
    .replace(/<[^>]+>/g, '')
    .replace(/\*\*|==|__|~~|\[\[|\]\]/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .trim()
}

/** Le registre, trié par chapitre : un ordre stable, pour que la sortie ne bouge qu'avec le contenu. */
export function registre() {
  return listerFiches()
    .map(({ niveau, matiere, index, fiche }) => ({
      chapitre: index.chapitre,
      niveau,
      matiere,
      slug: index.slug,
      titre: index.titre,
      titreAffiche: texteBrut(fiche.titre ?? index.titre),
      accroche: texteBrut(fiche.accroche),
    }))
    .sort((a, b) => a.chapitre.localeCompare(b.chapitre))
}

/** Le texte du module TypeScript. */
export function texteDuRegistre(entrees) {
  const lignes = entrees.map(
    (e) =>
      `  ${JSON.stringify(e.chapitre)}: { niveau: ${JSON.stringify(e.niveau)}, matiere: ${JSON.stringify(e.matiere)}, slug: ${JSON.stringify(e.slug)}, titre: ${JSON.stringify(e.titre)}, titreAffiche: ${JSON.stringify(e.titreAffiche)}, accroche: ${JSON.stringify(e.accroche)} },`,
  )
  return `// GÉNÉRÉ par \`node scripts/fiches-registre.mjs\` — ne pas éditer à la main.
// Une fiche PDF par chapitre : ${entrees.length} fiches (docs/fiches-mvp.md).

/** Ce que l'app sait d'une fiche PDF : où elle est rangée, et de quoi la présenter. */
export type FichePdf = {
  niveau: string
  matiere: string
  slug: string
  /** Le titre du chapitre, tel que l'index le nomme. */
  titre: string
  /** Le titre écrit sur la fiche, parfois plus court (« Pythagore »). */
  titreAffiche: string
  /** L'accroche manuscrite sous le titre. */
  accroche: string
}

/** Les fiches PDF, par identifiant de chapitre. */
export const FICHES_PDF: Readonly<Record<string, FichePdf>> = {
${lignes.join('\n')}
}
`
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.filename)) {
  const entrees = registre()
  fs.mkdirSync(path.dirname(SORTIE), { recursive: true })
  fs.writeFileSync(SORTIE, texteDuRegistre(entrees))
  console.log(`${entrees.length} fiches → ${path.relative(RACINE, SORTIE)}`)
}
