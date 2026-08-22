// -----------------------------------------------------------------------------
// LE GARDIEN SUR LA PAGE MATIÈRE — un seul modèle de vue pour l'écusson d'angle
// et le billet de l'onglet « Mode de jeu ».
//
// POURQUOI CE MODULE. « La Traque » (lib/traque) fait déjà tout le travail : une
// jauge par matière qui monte à chaque geste de révision, un gardien qui sort de
// sa tanière à 100 points et qu'on ne peut défier qu'une heure. Mais cette jauge
// ne s'affichait QUE dans l'arène — l'élève travaillait son allemand vingt
// minutes et rien, sur la page Allemand, ne lui disait que son gardien était
// sorti. La moitié « je révise » de la boucle ne voyait jamais l'autre.
//
// Deux endroits l'affichent désormais : l'écusson dans l'angle du header (visible
// quel que soit l'onglet ouvert) et le billet du gardien dans « Mode de jeu ».
// Ils lisent le MÊME modèle, calculé ici : deux lectures indépendantes de la
// même jauge finiraient tôt ou tard par se contredire à l'écran.
//
// LA RÈGLE QUI CHANGE TOUT : tant que le gardien rôde, on ne voit qu'une
// SILHOUETTE. Le buste ne se révèle qu'au débusquage. L'anneau n'est donc pas
// un indicateur de plus, c'est un compte à rebours vers une apparition.
// -----------------------------------------------------------------------------
import type { Boss } from '@/lib/bosses'
import { countdownLabel, restantLabel, type TraqueCard } from '@/lib/traque'

export type GardienEtat =
  /** Aucune jauge lisible (migration 212 absente, visiteur) : on n'affiche rien. */
  | 'absent'
  /** Jauge à zéro : le gardien rôde, rien n'a encore été travaillé. */
  | 'taniere'
  /** La jauge monte. */
  | 'traque'
  /** Il est sorti — et il ne reste qu'une heure. */
  | 'debusque'

export type GardienVue = {
  etat: GardienEtat
  boss: Boss | null
  /** Avancement 0..1 — la portion d'anneau à peindre. */
  ratio: number
  percent: number
  /**
   * Le buste est-il révélé ? Faux tant qu'il rôde : c'est ce qui fait de
   * l'apparition une révélation et non un simple changement de couleur.
   */
  revele: boolean
  /** Titre court : « Grammatork rôde », « Grammatork est sorti ! ». */
  titre: string
  /**
   * La ligne d'action, en GESTES tant qu'il rôde (« 5 cartes de plus ») et en
   * temps une fois sorti (« 43 min »). Jamais un pourcentage nu : « 82 % » ne
   * dit pas quoi faire.
   */
  detail: string
  /** La phrase longue de la traque (« X est à 5 cartes de sortir de sa tanière »). */
  phrase: string
  /** Étiquette de la bulle posée sur l'onglet « Mode de jeu », ou null. */
  bulle: string | null
  /** Gemmes en jeu si on le bat maintenant. */
  gems: number
  /** Ce qu'annonce un lecteur d'écran sur l'écusson. */
  aria: string
}

const ABSENT: GardienVue = {
  etat: 'absent',
  boss: null,
  ratio: 0,
  percent: 0,
  revele: false,
  titre: '',
  detail: '',
  phrase: '',
  bulle: null,
  gems: 0,
  aria: '',
}

/** Ce qu'annonce la bulle de l'onglet « Mode de jeu » quand le gardien est là. */
export const BULLE_DISPONIBLE = 'Boss disponible'

/**
 * Le modèle d'affichage du gardien d'une matière.
 *
 * Ne prend PAS l'heure courante : la carte porte déjà son décompte, calculé au
 * rendu serveur. Recalculer ici rendrait la fonction non déterministe — donc
 * intestable — pour gagner quelques secondes de précision sur un compte à
 * rebours d'une heure.
 */
export function gardienVue(card: TraqueCard | null): GardienVue {
  if (!card) return ABSENT

  const sorti = card.status === 'debusque'
  const etat: GardienEtat = sorti
    ? 'debusque'
    : card.points <= 0
      ? 'taniere'
      : 'traque'

  const titre = sorti
    ? `${card.boss.name} est sorti !`
    : `${card.boss.name} rôde`
  const detail = sorti
    ? countdownLabel(card.remainingMs)
    : restantLabel(card.points)

  return {
    etat,
    boss: card.boss,
    // Un gardien sorti affiche un anneau PLEIN, quoi qu'en dise la jauge : la
    // fenêtre est ouverte, c'est le seul fait qui compte à cet instant.
    ratio: sorti ? 1 : card.ratio,
    percent: sorti ? 100 : card.percent,
    revele: sorti,
    titre,
    detail,
    phrase: card.hint,
    bulle: sorti ? BULLE_DISPONIBLE : null,
    gems: card.gems,
    aria: sorti
      ? `${card.boss.name}, ${card.boss.epithet}, est sorti de sa tanière — il disparaît dans ${countdownLabel(card.remainingMs)}`
      : `${card.boss.name} rôde — jauge à ${card.percent} %, ${restantLabel(card.points)}`,
  }
}

/** Le gardien est-il défiable maintenant ? (la seule porte du combat) */
export function peutAffronter(vue: GardienVue): boolean {
  return vue.etat === 'debusque'
}

/**
 * L'écusson doit-il s'afficher ? Non quand la traque est illisible : mieux vaut
 * pas d'écusson qu'un anneau vide qui ne bougera jamais.
 */
export function afficheEcusson(vue: GardienVue): boolean {
  return vue.etat !== 'absent'
}
