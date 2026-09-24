import {
  TAILLE_GROUPE,
  calculerCoffre,
  contenuCoffre,
  echelon as echelonDe,
  finDeSemaine,
  lundiUTC,
  type BilanLigue,
  type EtatLigue,
  type MembreLigue,
} from '@/lib/ligue'

// -----------------------------------------------------------------------------
// UNE LIGUE D'EXEMPLE, pour le visiteur (signalée « Aperçu », jamais déguisée
// en vraie) et pour la page de développement `/dev/ligue`. Déterministe :
// mêmes noms, mêmes XP à chaque rendu — pas de Math.random, qui ferait
// diverger l'hydratation.
// -----------------------------------------------------------------------------

const NOMS = [
  'Léa', 'Rayan', 'Inès', 'Hugo', 'Chloé', 'Adam', 'Jade', 'Lucas', 'Manon', 'Nathan',
  'Emma', 'Yanis', 'Lina', 'Louis', 'Sarah', 'Noah', 'Zoé', 'Ethan', 'Camille', 'Sacha',
  'Maëlys', 'Tom', 'Lou', 'Enzo', 'Anna', 'Théo', 'Rose', 'Malo', 'Alice', 'Gabin',
]

/** L'XP du n-ième (1 = le premier) : strictement décroissante, un peu irrégulière. */
function xpAuRang(rang: number, index: number): number {
  const base = 90 + 40 * index
  return Math.max(0, base + (TAILLE_GROUPE - rang) * 26 + ((rang * 7) % 11) * 2)
}

/** Le coffre de la semaine passée, prêt à ouvrir, au niveau demandé. */
function coffrePretDe(niveau: number, maintenant: Date): EtatLigue['coffresPrets'] {
  const contenu = contenuCoffre(niveau)
  if (!contenu) return []
  const lundi = new Date(Date.parse(lundiUTC(maintenant)) - 7 * 86_400_000).toISOString().slice(0, 10)
  return [{ semaine: lundi, niveau: contenu.niveau, points: contenu.seuil + 40, xp: contenu.xp, gemmes: contenu.gemmes }]
}

export function ligueApercu({
  maintenant,
  echelon = 2,
  monRang = 9,
  monNom = 'Sacha',
  inscrit = true,
  nbAmis = 3,
  bilan = null,
  coffrePret = 0,
}: {
  maintenant: Date
  echelon?: number
  monRang?: number
  monNom?: string
  inscrit?: boolean
  nbAmis?: number
  bilan?: BilanLigue | null
  /** Niveau du coffre de la semaine passée, prêt à ouvrir (0 : aucun). */
  coffrePret?: number
}): EtatLigue {
  const index = echelonDe(echelon).index
  const rangMoi = Math.min(TAILLE_GROUPE, Math.max(1, monRang))
  const autres = NOMS.filter((n) => n !== monNom)
  const groupe: MembreLigue[] = Array.from({ length: TAILLE_GROUPE }, (_, i) => {
    const rang = i + 1
    const moi = rang === rangMoi
    const nom = moi ? monNom : autres[(i - (rang > rangMoi ? 1 : 0)) % autres.length]
    return {
      cle: moi ? 'moi' : `apercu-${rang}`,
      id: moi ? 'moi' : null,
      nom,
      portrait: '',
      xp: xpAuRang(rang, index),
      rang,
      // Un rival sur trois est une IA : l'aperçu montre la vraie pastille.
      robot: !moi && rang % 3 === 0,
      moi,
    }
  })
  const xpMoi = groupe[rangMoi - 1].xp
  // Des amis qui jouent un peu, beaucoup, passionnément : le coffre se remplit.
  const xpAmis = [420, 260, 90, 610, 35, 150, 0, 300, 75, 500, 20, 5].slice(0, nbAmis)
  const xpSemaine = inscrit ? xpMoi : 0
  return {
    semaine: lundiUTC(maintenant),
    fin: finDeSemaine(maintenant).toISOString(),
    echelon: index,
    inscrit,
    groupe: inscrit ? groupe : [],
    xpSemaine,
    nbAmis,
    amis: [],
    bilan,
    coffre: { xpMoi: xpSemaine, nbAmis, ...calculerCoffre(xpSemaine, xpAmis) },
    coffresPrets: coffrePretDe(coffrePret, maintenant),
  }
}
