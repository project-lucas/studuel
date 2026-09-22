// -----------------------------------------------------------------------------
// LA CARTE DU BILAN — ce que la partie a CHANGÉ, en une seule carte.
//
// L'écran de fin d'un jeu de salon empilait trois nouvelles sous le score :
// une carte « Trophées » (le mouvement, le total, la prochaine victoire), une
// carte « Palmarès » (le verdict, ma place dans la classe, la prochaine
// marche) et la ligne « Journée validée ». Trois blocs à lire avant le bouton
// Rejouer, qui disaient chacun un bout de la même chose (Lucas, 22/09/2026 :
// « réunis les deux blocs, garde l'essentiel »).
//
// Ce module décide ce que la carte unique raconte, et dans quel ordre :
//   · un TITRE — le verdict du palmarès (« Premier score posé ! ») quand le
//     serveur l'a rendu, sinon le mouvement de trophées (« +8 trophées ») ;
//   · une ligne dessous — ma place de la semaine, ou le total sur ce jeu ;
//   · une PASTILLE de trophées à droite du titre, seulement quand le titre ne
//     les dit pas déjà ;
//   · un pied — ce que vaudra la PROCHAINE VICTOIRE, et la journée validée.
//
// Rien ne s'affiche qui ne soit vrai : verdict et rang viennent du serveur,
// qui voit tout le monde ; sans lui, la carte se contente des trophées, et
// sans les deux il n'y a pas de carte du tout (`null`).
//
// Pur : aucune lecture, aucun composant. Le rendu est dans
// components/jeux/CarteBilan.tsx.
// -----------------------------------------------------------------------------
import { titreVerdict, verdictPartie, type BilanPartie } from '@/lib/palmares/bilan'
import { ordinal, standingFor } from '@/lib/percentile'
import { trophyBand } from '@/lib/trophy-road'

/** Le mouvement de trophées d'une partie, tel que `apply_game_trophies` le rend. */
export type MouvementTrophees = {
  before: number
  after: number
  delta: number
}

export type PastilleTrophees = {
  texte: string
  /** `gain` : en jaune, la couleur de ce qu'on gagne. Une perte reste neutre. */
  ton: 'gain' | 'neutre'
  /** Vrai quand le texte est un nombre signé (chiffres tabulaires) ; faux pour « Rien perdu ». */
  nombre: boolean
}

export type CarteBilan = {
  /** Ce que la carte raconte en premier : le palmarès, ou à défaut les trophées. */
  icone: 'palmares' | 'trophees'
  titre: string
  sousTitre: string | null
  /** Le joueur juste au-dessus de moi cette semaine, quand il y en a un. */
  marche: string | null
  pastille: PastilleTrophees | null
  /** Ce que vaudra la prochaine victoire sur ce jeu, ou null sans trophées. */
  prochaineVictoire: number | null
  /** La journée : validée, non enregistrée, ou encore inconnue. */
  journee: 'validee' | 'non-enregistree' | null
  /** La carte mène au palmarès (/moi) dès que le bilan est là. */
  lien: boolean
}

const pluriel = (n: number, mot: string) => `${n} ${mot}${Math.abs(n) > 1 ? 's' : ''}`

/** « +8 trophées », « Rien perdu », « −5 trophées » — jamais un signe d'alerte. */
export function libelleTrophees(delta: number): string {
  if (delta > 0) return `+${pluriel(delta, 'trophée')}`
  if (delta === 0) return 'Rien perdu'
  return `−${pluriel(-delta, 'trophée')}`
}

/** Ma place de la semaine dans la classe, aux règles d'honnêteté de lib/percentile. */
export function libellePlace(bilan: Pick<BilanPartie, 'weekRank' | 'weekTotal'>): string | null {
  const place = standingFor({ rank: bilan.weekRank, total: bilan.weekTotal })
  if (place.kind === 'rang') return `${ordinal(place.rank)} de ta classe cette semaine`
  if (place.kind === 'pourcentage') {
    return place.side === 'top'
      ? `Top ${place.value} % de ta classe cette semaine`
      : `Mieux que ${place.value} % de ta classe cette semaine`
  }
  return null
}

export function carteBilan(input: {
  trophies: MouvementTrophees | null | undefined
  bilan: BilanPartie | null | undefined
  saved: boolean | null
}): CarteBilan | null {
  const trophies = input.trophies ?? null
  const bilan = input.bilan ?? null
  if (!trophies && !bilan) return null

  const journee: CarteBilan['journee'] =
    input.saved === true ? 'validee' : input.saved === false ? 'non-enregistree' : null
  const prochaineVictoire = trophies ? trophyBand(trophies.after).win : null

  if (bilan) {
    const verdict = verdictPartie({
      score: bilan.score,
      last: bilan.last,
      bestBefore: bilan.bestBefore,
    })
    // « Tu mènes ta classe » ne se dit que si la place ne le dit pas déjà :
    // « 1er de ta classe » et « Tu mènes ta classe » sur deux lignes, c'était
    // la même nouvelle lue deux fois.
    const place = libellePlace(bilan)
    const sousTitre =
      place ?? (bilan.leader?.isMe ? 'Tu mènes ta classe cette semaine' : null)
    const pastille: PastilleTrophees | null = trophies
      ? trophies.delta > 0
        ? { texte: `+${trophies.delta}`, ton: 'gain', nombre: true }
        : trophies.delta === 0
          ? { texte: 'Rien perdu', ton: 'neutre', nombre: false }
          : { texte: `−${-trophies.delta}`, ton: 'neutre', nombre: true }
      : null
    return {
      icone: 'palmares',
      titre: titreVerdict(verdict),
      sousTitre,
      marche: bilan.next ? `Prochaine marche : ${bilan.next.name} · ${bilan.next.score}` : null,
      pastille,
      prochaineVictoire,
      journee,
      lien: true,
    }
  }

  // Sans bilan (visiteur du palmarès, migration 355 pas passée), les trophées
  // font le titre : la pastille serait une redite.
  const t = trophies as MouvementTrophees
  return {
    icone: 'trophees',
    titre: libelleTrophees(t.delta),
    sousTitre: t.after > 0 ? `Total sur ce jeu : ${t.after}` : 'Tu débutes sur ce jeu',
    marche: null,
    pastille: null,
    prochaineVictoire,
    journee,
    lien: false,
  }
}
