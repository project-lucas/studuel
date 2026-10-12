// -----------------------------------------------------------------------------
// LE CAHIER D'EXERCICES D'UNE MATIÈRE — la porte « Exercices » de son dossier.
//
// Lucas, 05/10/2026 : « le cahier d'exercices de la matière n'est pas
// accessible tout de suite, il faut fouiller ». Il ne s'ouvrait que depuis un
// chapitre (thème, fiche, support, cahier). Il a maintenant sa porte : tous les
// MANUELS de la matière — un par thème, comme le livre de `lib/exercices/livre`
// — et un MARQUE-PAGE, la première page qu'il reste à faire.
//
// Pur et testé : la route lit trois listes, ce module en fait la vue. Les
// règles de déblocage sont celles du cahier (`etatsExercices`), chapitre par
// chapitre — le premier exercice d'un chapitre est toujours ouvert.
// -----------------------------------------------------------------------------

import { hrefPage } from './livre'
import { etatsExercices } from './progression'
import type { Etoiles } from './types'

export type ChapitreSource = {
  id: string
  titre: string
  /** Le thème du programme (`chapters.theme`), `null` s'il n'en a pas. */
  theme: string | null
}

export type ExerciceSource = {
  id: string
  chapitreId: string
  position: number
  etoiles: Etoiles
  titre: string
}

export type ManuelCahier = {
  /** Le thème, ou l'identifiant du chapitre quand il forme un manuel à lui seul. */
  cle: string
  titre: string
  pages: number
  reussies: number
  /** Combien de chapitres (de fiches) le manuel réunit. */
  chapitres: number
  /** La première page qu'il reste à faire — ou la première, s'il est fini. */
  href: string
}

export type MarquePage = {
  /** Numéro de la page dans le cahier de la matière, à partir de 1. */
  numero: number
  titre: string
  etoiles: Etoiles
  /** Le manuel (le thème) où elle se trouve. */
  manuel: string
  href: string
}

export type CahierMatiere = {
  total: number
  reussis: number
  /** `null` quand tout le cahier est réussi. */
  marque: MarquePage | null
  manuels: ManuelCahier[]
}

/**
 * Assemble le cahier : les chapitres dans l'ordre du programme, rangés par
 * thème ; un chapitre sans thème forme un manuel à lui seul (la règle du livre).
 * Un chapitre sans exercice n'a pas de page ; un manuel sans page n'apparaît pas.
 */
export function construireCahierMatiere(input: {
  matiere: string
  chapitres: readonly ChapitreSource[]
  exercices: readonly ExerciceSource[]
  /** Les identifiants des exercices que l'élève a réussis. */
  reussis: ReadonlySet<string>
}): CahierMatiere {
  const { matiere, chapitres, exercices, reussis } = input
  const parChapitre = new Map<string, ExerciceSource[]>()
  for (const e of exercices) {
    const liste = parChapitre.get(e.chapitreId) ?? []
    liste.push(e)
    parChapitre.set(e.chapitreId, liste)
  }
  const resultats = new Map([...reussis].map((id) => [id, { reussi: true }]))

  const manuels: ManuelCahier[] = []
  const parCle = new Map<string, ManuelCahier & { aFaire: boolean }>()
  let marque: MarquePage | null = null
  let numero = 0
  let total = 0
  let faits = 0

  for (const chapitre of chapitres) {
    const siens = [...(parChapitre.get(chapitre.id) ?? [])].sort((a, b) => a.position - b.position)
    if (siens.length === 0) continue
    const cle = chapitre.theme ?? chapitre.id
    const titre = chapitre.theme ?? chapitre.titre
    let manuel = parCle.get(cle)
    if (!manuel) {
      manuel = {
        cle,
        titre,
        pages: 0,
        reussies: 0,
        chapitres: 0,
        href: hrefPage(matiere, chapitre.id, siens[0].position),
        aFaire: false,
      }
      parCle.set(cle, manuel)
      manuels.push(manuel)
    }
    manuel.chapitres += 1

    const etats = etatsExercices(siens, resultats)
    for (const exercice of siens) {
      numero += 1
      total += 1
      manuel.pages += 1
      const etat = etats.get(exercice.id)
      if (etat === 'reussi') {
        faits += 1
        manuel.reussies += 1
        continue
      }
      if (etat !== 'ouvert') continue
      const href = hrefPage(matiere, chapitre.id, exercice.position)
      // La première page ouverte du manuel devient son adresse…
      if (!manuel.aFaire) {
        manuel.aFaire = true
        manuel.href = href
      }
      // … et la première du cahier, son marque-page.
      marque ??= { numero, titre: exercice.titre, etoiles: exercice.etoiles, manuel: titre, href }
    }
  }

  return {
    total,
    reussis: faits,
    marque,
    manuels: manuels.map(({ cle, titre, pages, reussies, chapitres: n, href }) => ({
      cle,
      titre,
      pages,
      reussies,
      chapitres: n,
      href,
    })),
  }
}
