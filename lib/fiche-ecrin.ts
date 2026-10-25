// -----------------------------------------------------------------------------
// L'ÉCRIN DE DÉBLOCAGE D'UNE FICHE (25/10/2026, cadrage « le jeu vivant » § H).
//
// Lucas, sur l'ancien écran (cadenas gris, paragraphe gris, bouton violet) :
// « texte illisible et pas nécessaire, bouton pas satisfaisant, ni Clash
// Royale friendly… c'est un aboutissement de temps de travail de débloquer une
// fiche ». Ici, ce qui se calcule : le solde (peut-on payer, ce qu'il reste, ce
// qui manque) et les images servies — la fiche ROULÉE quand elle est livrée,
// l'illustration de la fiche de révision du Marché en attendant.
//
// Ce module n'importe rien de serveur : lu par `components/fiche/*` (client).
// -----------------------------------------------------------------------------

import {
  GEM_COST_CHAPTER,
  REFERRAL_GEM_REWARD,
  gemsAfterSpend,
  gemsLabel,
  gemsShortfall,
} from '@/lib/gems'

/** La fiche roulée au sceau, et la même déroulée (livrées par le chantier d'assets). */
export const ROULEAU_FERME = '/images/fiche/rouleau.webp'
export const ROULEAU_OUVERT = '/images/fiche/rouleau-ouvert.webp'
/**
 * Le repli tant que le rouleau n'est pas dessiné : la « Fiche de révision » du
 * Marché — depuis le 24/09/2026 c'est LE dessin de la fiche pour toute l'app
 * (journal économie), bien plus parlant qu'un coffre.
 */
export const REPLI_FICHE = '/images/boutique/marche/fiche.webp'

/** Ce que le serveur a trouvé dans `public/` : un chemin, ou null quand l'image manque. */
export type RouleauFiche = { ferme: string | null; ouvert: string | null }

export type ImagesEcrin = {
  ferme: string
  ouvert: string
  /** Vrai quand on montre le repli (pas de rouleau dessiné) : l'écrin pose alors son sceau en CSS. */
  repli: boolean
}

/** Les deux images de l'écrin : le rouleau s'il existe, sinon le repli (et le fermé fait l'ouvert). */
export function imagesEcrin(rouleau: RouleauFiche | null | undefined): ImagesEcrin {
  const ferme = rouleau?.ferme ?? null
  if (!ferme) return { ferme: REPLI_FICHE, ouvert: REPLI_FICHE, repli: true }
  return { ferme, ouvert: rouleau?.ouvert ?? ferme, repli: false }
}

export type SoldeEcrin = {
  /** Le solde suffit pour la fiche. */
  peut: boolean
  /** Ce qui restera après (ou le solde tel quel quand il ne suffit pas). */
  apres: number
  /** Ce qui manque (0 quand le solde suffit). */
  manque: number
  /** La petite ligne sous le bouton. */
  phrase: string
}

/** Le solde, lu pour l'écrin : « Il te reste 45 gemmes » ou « Il te manque 20 gemmes — invite un ami… ». */
export function soldeEcrin(gems: number): SoldeEcrin {
  const solde = Math.max(0, Math.floor(Number(gems) || 0))
  const manque = gemsShortfall(solde)
  if (manque === 0) {
    return {
      peut: true,
      apres: gemsAfterSpend(solde),
      manque: 0,
      phrase: `Il te reste ${gemsLabel(solde)}`,
    }
  }
  return {
    peut: false,
    apres: solde,
    manque,
    phrase: `Il te manque ${gemsLabel(manque)} — invite un ami : vous en gagnez ${REFERRAL_GEM_REWARD} chacun`,
  }
}

/** Le prix écrit sur le bouton d'or (le cristal illustré se pose à côté). */
export const PRIX_FICHE = GEM_COST_CHAPTER

/** « Dépenser 30 gemmes ? » — le titre de la confirmation. */
export const TITRE_CONFIRMATION = `Dépenser ${gemsLabel(GEM_COST_CHAPTER)} ?`

/** Le temps de l'ouverture (ms) avant de montrer la vraie fiche : le rouleau se déroule, les éclats fusent. */
export const DUREE_OUVERTURE = 1400
