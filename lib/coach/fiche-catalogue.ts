// -----------------------------------------------------------------------------
// « FAIS-MOI UNE FICHE SUR… » — ELLE EXISTE DÉJÀ (15/10/2026).
//
// Le mode « Faire une fiche » est le plus cher de Marcel (~820 jetons de
// sortie, trois indices). Or Studuel a DÉJÀ une fiche de révision pour chacun
// de ses 2 947 chapitres, écrite, relue et mise en page — c'est le plus gros
// travail fait en amont de toute l'app. Quand la demande désigne clairement un
// chapitre de la classe de l'élève, Marcel répond donc SANS le modèle : « elle
// existe, la voici », gratuitement. L'élève peut toujours insister (« fais-moi
// la mienne ») : la demande repart alors au modèle, et se paie.
//
// La PRÉCISION passe avant tout : on ne répond que si UN chapitre se détache
// (tous les mots de la demande dans son titre). Deux candidats, aucun mot
// significatif : la demande part au modèle, comme avant.
//
// Logique PURE.
// -----------------------------------------------------------------------------

import { searchKey } from '@/lib/subject-template'
import type { IndexFiches, MatiereIndex, FicheIndex } from '@/lib/reviser/recherche-globale'

/** Les mots de la COMMANDE, qui ne disent rien du chapitre. */
const MOTS_COMMANDE = new Set(
  (
    'fais faire fait moi une un des les le la l d de du sur pour avec ma mon mes fiche fiches revision revisions resume ' +
    'resumer resumes chapitre chapitres cours lecon lecons sujet theme peux tu stp svp merci vite rapide courte complete ' +
    'synthese fait ecris ecrire donne donner propose cree creer prepare preparer aide aider sais besoin voudrais veux ' +
    'controle interro demain bac brevet partie en au aux et ou'
  ).split(' '),
)

export type FicheTrouvee = {
  chapitreId: string
  titre: string
  matiere: MatiereIndex
  /** La page Fiche du chapitre. */
  href: string
}

function significatifs(question: string): string[] {
  return searchKey(question)
    .split(' ')
    .filter((m) => m.length >= 3 && !MOTS_COMMANDE.has(m))
}

/** Un mot de la demande se retrouve-t-il dans le texte (au pluriel près) ? */
function contient(foin: string[], mot: string): boolean {
  const racine = mot.length > 4 && mot.endsWith('s') ? mot.slice(0, -1) : mot
  return foin.some((f) => f === mot || f.startsWith(racine))
}

export function ficheDuCatalogue(question: string, index: IndexFiches): FicheTrouvee | null {
  const mots = significatifs(question)
  if (mots.length === 0) return null

  const parSlug = new Map(index.matieres.map((m) => [m.slug, m]))
  const dansLeTitre: { fiche: FicheIndex; matiere: MatiereIndex }[] = []
  for (const fiche of index.fiches) {
    const matiere = parSlug.get(fiche.m)
    if (!matiere) continue
    const titre = searchKey(fiche.t).split(' ')
    if (mots.every((m) => contient(titre, m))) dansLeTitre.push({ fiche, matiere })
  }

  // Un seul chapitre se détache : c'est lui. Plusieurs (« la guerre ») : on
  // ne devine pas, le modèle demandera de préciser.
  if (dansLeTitre.length !== 1) return null
  const [{ fiche, matiere }] = dansLeTitre
  return {
    chapitreId: fiche.id,
    titre: fiche.t,
    matiere,
    href: `/reviser/${matiere.slug}/${fiche.id}/carte`,
  }
}

/** Ce que Marcel répond, sans le modèle. */
export function reponseFicheExistante(f: FicheTrouvee): string {
  return [
    `## Elle existe déjà`,
    `Studuel a une fiche de révision pour « ${f.titre} » (${f.matiere.nom}) : une page, relue, avec ce qu’il faut retenir.`,
    'Ouvre-la avec le bouton ci-dessous. Si tu préfères une fiche faite à partir de TON cours, dis-le-moi et je l’écris.',
  ].join('\n')
}
