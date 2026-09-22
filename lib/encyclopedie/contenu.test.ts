// -----------------------------------------------------------------------------
// LE GARDE-FOU DU CORPUS.
//
// Deux cent cinquante fiches écrites à la main ne restent cohérentes que si
// quelque chose les relit à chaque `npm test`. Ce fichier passe le contrat de
// `valider.ts` sur la TOTALITÉ du corpus, vérifie que les renvois d'une fiche
// à l'autre tombent juste, et que la liste et la recherche savent s'en servir.
//
// Il ne juge pas le contenu historique — ça, c'est le travail de relecture
// (docs/encyclopedie.md). Il tient la forme, et la forme est ce qui casse en
// silence.
// -----------------------------------------------------------------------------

import { describe, expect, it } from 'vitest'
import { EVENEMENTS, PERSONNAGES, TOUTES, entreeParId, voisines } from './contenu'
import { validerCorpus } from './valider'
import { apercus } from './apercu'
import { filtrer, indexer } from './recherche'
import {
  PERIODE_TEINTES,
  PERIODES,
  estEvenement,
  estPersonnage,
  type Entree,
} from './types'

// ---------------------------------------------------------------------------
// LES LOTS SUR LE DISQUE, et non ceux du registre.
//
// Deux raisons de lire le dossier plutôt que `contenu/index.ts` : on relit
// ainsi un lot qui vient d'être écrit mais pas encore branché (c'est le cas
// pendant la rédaction), et on peut comparer les deux listes pour repérer le
// lot oublié dans le registre — une erreur silencieuse, puisqu'il ne manquerait
// « que » quinze fiches dans l'encyclopédie.
//
// `ENCY_LOT=personnages-antiquite-rome npx vitest run lib/encyclopedie` ne
// contrôle QUE ce lot : de quoi relire son fichier sans être arrêté par le
// chantier d'à côté. Les renvois, eux, restent vérifiés contre la totalité.
// ---------------------------------------------------------------------------
// `import.meta.glob` est une facilité de Vite (donc de Vitest), que le
// `tsc --noEmit` du projet ne connaît pas : d'où le passage par un type local
// plutôt qu'un `vite/client` ajouté aux types globaux pour une seule ligne.
const MODULES = (
  import.meta as unknown as {
    glob: (
      motif: string,
      options: { eager: true },
    ) => Record<string, Record<string, unknown>>
  }
).glob('./contenu/*.ts', { eager: true })

function estEntree(valeur: unknown): valeur is Entree {
  return (
    typeof valeur === 'object' &&
    valeur !== null &&
    'volet' in valeur &&
    'citations' in valeur
  )
}

const LOTS: { fichier: string; entrees: Entree[] }[] = Object.entries(MODULES)
  .filter(([chemin]) => !chemin.endsWith('/index.ts'))
  .map(([chemin, module]) => {
    const entrees = Object.values(module)
      .filter((valeur): valeur is unknown[] => Array.isArray(valeur))
      .flat()
      .filter(estEntree)
    return { fichier: chemin, entrees }
  })

const SUR_DISQUE: Entree[] = LOTS.flatMap((lot) => lot.entrees)
const LOT_CIBLE = process.env.ENCY_LOT
const A_RELIRE: Entree[] = LOT_CIBLE
  ? LOTS.filter((lot) => lot.fichier.includes(LOT_CIBLE)).flatMap((lot) => lot.entrees)
  : SUR_DISQUE

describe('le corpus', () => {
  it('tient le contrat de rédaction, fiche par fiche', () => {
    expect(A_RELIRE.length, `aucune fiche trouvée pour « ${LOT_CIBLE} »`).toBeGreaterThan(0)
    const problemes = validerCorpus(A_RELIRE, SUR_DISQUE)
    expect(problemes).toEqual([])
  })

  it('branche tous les lots écrits dans le registre', () => {
    if (LOT_CIBLE) return
    const registre = new Set(TOUTES.map((entree) => entree.id))
    const oubliees = SUR_DISQUE.filter((entree) => !registre.has(entree.id)).map(
      (entree) => entree.id,
    )
    expect(oubliees, 'lot écrit mais absent de contenu/index.ts').toEqual([])
  })

  it('a des fiches dans les deux volets', () => {
    expect(PERSONNAGES.length).toBeGreaterThan(0)
    expect(EVENEMENTS.length).toBeGreaterThan(0)
    expect(TOUTES.length).toBe(PERSONNAGES.length + EVENEMENTS.length)
  })

  it('range les fiches dans l’ordre du temps', () => {
    for (let i = 1; i < TOUTES.length; i++) {
      expect(TOUTES[i].tri).toBeGreaterThanOrEqual(TOUTES[i - 1].tri)
    }
  })

  it('donne une teinte à chaque période', () => {
    for (const periode of PERIODES) {
      expect(PERIODE_TEINTES[periode]).toBeTruthy()
    }
    // Aucune période n'est violette : dans cet écran, le violet est la couleur
    // de ce qui se clique, et rien d'autre.
    expect(Object.values(PERIODE_TEINTES)).not.toContain('violet')
  })

  it('retrouve une fiche par son identifiant', () => {
    const premiere = TOUTES[0]
    expect(entreeParId(premiere.id)?.nom).toBe(premiere.nom)
    expect(entreeParId('fiche-qui-n-existe-pas')).toBeUndefined()
  })

  it('chaîne les fiches voisines dans le même volet', () => {
    const personnages = TOUTES.filter(estPersonnage)
    if (personnages.length < 2) return
    const { apres } = voisines(personnages[0].id)
    expect(apres?.id).toBe(personnages[1].id)
    expect(voisines(personnages[0].id).avant).toBeUndefined()
  })

  it('donne un médaillon unique à chaque fiche d’une même liste', () => {
    // L'emoji est ce qui distingue deux cartes AVANT qu'on lise le nom. Il ne
    // doit donc pas se répéter dans ce que l'élève voit d'un coup : un volet,
    // une période. Deux fiches peuvent partager un emoji d'un bout à l'autre
    // du corpus (👑 sert plusieurs fois sur mille ans), jamais côte à côte.
    const groupes = new Map<string, Map<string, string[]>>()
    for (const entree of TOUTES) {
      const cle = `${entree.volet}/${entree.periode}`
      const groupe = groupes.get(cle) ?? new Map<string, string[]>()
      groupe.set(entree.emoji, [...(groupe.get(entree.emoji) ?? []), entree.id])
      groupes.set(cle, groupe)
    }
    const collisions: string[] = []
    for (const [cle, groupe] of groupes) {
      for (const [emoji, ids] of groupe) {
        if (ids.length > 1) collisions.push(`${cle} — ${emoji} : ${ids.join(', ')}`)
      }
    }
    expect(collisions).toEqual([])
  })

  it('donne à chaque fiche au moins une citation', () => {
    for (const entree of TOUTES) {
      expect(entree.citations.length, `${entree.id} sans citation`).toBeGreaterThan(0)
    }
  })

  it('attribue une citation d’événement à quelqu’un', () => {
    // Sur un portrait, la citation est du personnage lui-même : inutile de le
    // répéter. Sur un événement, une phrase anonyme n'apprend rien.
    for (const entree of TOUTES.filter(estEvenement)) {
      expect(entree.citations[0].qui, `${entree.id} : citation sans auteur`).toBeTruthy()
    }
  })
})

describe('les aperçus servis au client', () => {
  const liste = apercus(TOUTES)

  it('donne à chaque fiche des clés de recherche et une citation', () => {
    for (const apercu of liste) {
      expect(apercu.cles.length, `${apercu.id} sans clés`).toBeGreaterThan(2)
      expect(apercu.citation.length, `${apercu.id} sans citation`).toBeGreaterThan(2)
    }
  })

  it('reste léger : l’index complet tient sous 200 ko', () => {
    // Il descend dans le navigateur à chaque ouverture de l'encyclopédie. Le
    // jour où il double, c'est ici qu'on l'apprend — pas sur le terrain.
    const poids = JSON.stringify(liste).length
    expect(poids).toBeLessThan(200_000)
  })

  it('se cherche par le nom, sans accent ni apostrophe', () => {
    // `indexer` recolle la moitié invisible envoyée par le serveur et les mots
    // que la carte affiche : sans lui, on ne cherche que dans les tags.
    const index = indexer(liste)
    const cible = index.find((a) => a.nom === 'Jeanne d’Arc')
    if (!cible) return
    const trouves = filtrer(index, { volet: cible.volet, requete: 'jeanne darc' })
    expect(trouves[0]?.id).toBe(cible.id)
  })

  it('trouve une fiche par trois mots de sa citation', () => {
    // La promesse de la barre de recherche : on se souvient d'une phrase sans
    // savoir de qui elle est.
    const index = indexer(liste)
    const trouves = filtrer(index, { volet: 'personnages', requete: 'boutés hors de France' })
    expect(trouves[0]?.id).toBe('jeanne-d-arc')
  })
})

describe('la recherche répond comme un élève tape', () => {
  const index = indexer(apercus(TOUTES))

  function premier(requete: string, volet: 'personnages' | 'evenements'): string | undefined {
    return filtrer(index, { volet, requete })[0]?.id
  }

  it('comprend les rois en chiffres arabes', () => {
    // C'est comme ça qu'on parle en quatrième — et sans conversion des chiffres
    // romains, « napoleon 3 » ne rendait RIEN et « louis 14 » remontait Louis XI
    // (mort en 1483, dont « 14 » est le début).
    expect(premier('louis 14', 'personnages')).toBe('louis-xiv')
    expect(premier('louis 16', 'personnages')).toBe('louis-xvi')
    expect(premier('napoleon 3', 'personnages')).toBe('napoleon-iii')
  })

  it('cherche une date en entier, pas par son début', () => {
    expect(premier('14 juillet', 'evenements')).toBe('prise-de-la-bastille')
  })

  it('trouve par le surnom et par un mot du cours', () => {
    expect(premier('roi soleil', 'personnages')).toBe('louis-xiv')
    expect(premier('pucelle', 'personnages')).toBe('jeanne-d-arc')
  })

  it('trouve par un mot de citation', () => {
    expect(premier('eureka', 'personnages')).toBe('archimede')
    expect(premier('brioche', 'personnages')).toBe('marie-antoinette')
  })
})
