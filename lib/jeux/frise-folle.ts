// La Frise folle — la banque du salon Histoire-Géo, en remise en ordre.
//
// Cinq événements arrivent en vrac ; il faut les toucher du plus ancien au plus
// récent. Chaque tuile posée révèle sa date : le jeu CORRIGE en même temps qu'il
// teste, et une frise ratée laisse quand même une trace.
//
// Les frises sont écrites DANS L'ORDRE CHRONOLOGIQUE ici ; le mélange (et donc
// la solution) est calculé par `boardFromOrdered`. On ne peut donc pas écrire
// une frise dont la solution serait fausse.
import { drawBoards, type OrderBoard, type OrderItem } from '@/lib/jeux/ordering'

type Frise = { id: string; prompt: string; ordered: OrderItem[] }

// Repères choisis dans le programme du collège et du lycée, avec des écarts
// francs entre les dates : une frise dont deux événements tiennent dans la même
// décennie se joue à pile ou face, ce n'est pas un jeu.
export const FRISES: Frise[] = [
  {
    id: 'antiquite',
    prompt: 'De la préhistoire à la chute de Rome',
    ordered: [
      { label: 'Premières peintures de Lascaux', hint: '≈ 17 000 av. J.-C.' },
      { label: 'Construction des pyramides de Gizeh', hint: '≈ 2 560 av. J.-C.' },
      { label: 'Fondation de Rome (légende)', hint: '753 av. J.-C.' },
      { label: 'Victoire de César à Alésia', hint: '52 av. J.-C.' },
      { label: 'Chute de l’Empire romain d’Occident', hint: '476' },
    ],
  },
  {
    id: 'moyen-age',
    prompt: 'Le Moyen Âge, du sacre aux cathédrales',
    ordered: [
      { label: 'Baptême de Clovis', hint: '≈ 496' },
      { label: 'Couronnement de Charlemagne', hint: '800' },
      { label: 'Première croisade', hint: '1096' },
      { label: 'Début de la guerre de Cent Ans', hint: '1337' },
      { label: 'Jeanne d’Arc lève le siège d’Orléans', hint: '1429' },
    ],
  },
  {
    id: 'temps-modernes',
    prompt: 'Les Temps modernes',
    ordered: [
      { label: 'Christophe Colomb atteint l’Amérique', hint: '1492' },
      { label: 'Édit de Nantes', hint: '1598' },
      { label: 'Louis XIV s’installe à Versailles', hint: '1682' },
      { label: 'Publication de l’Encyclopédie', hint: '1751' },
      { label: 'Prise de la Bastille', hint: '14 juillet 1789' },
    ],
  },
  {
    id: 'dix-neuvieme',
    prompt: 'Le XIXᵉ siècle français',
    ordered: [
      { label: 'Sacre de Napoléon Iᵉʳ', hint: '1804' },
      { label: 'Défaite de Waterloo', hint: '1815' },
      { label: 'Abolition de l’esclavage en France', hint: '1848' },
      { label: 'Proclamation de la IIIᵉ République', hint: '1870' },
      { label: 'Lois de Jules Ferry sur l’école', hint: '1881-1882' },
    ],
  },
  {
    id: 'guerres',
    prompt: 'Le siècle des guerres mondiales',
    ordered: [
      { label: 'Début de la Première Guerre mondiale', hint: '1914' },
      { label: 'Armistice de Rethondes', hint: '11 novembre 1918' },
      { label: 'Appel du 18 Juin', hint: '1940' },
      // L'ordonnance du 21 avril 1944 précède le Débarquement de six semaines :
      // l'ordre inverse (l'intuition courante) serait faux.
      { label: 'Droit de vote des femmes en France', hint: '21 avril 1944' },
      { label: 'Débarquement de Normandie', hint: '6 juin 1944' },
    ],
  },
  {
    id: 'contemporain',
    prompt: 'Le monde depuis 1945',
    ordered: [
      { label: 'Création de l’ONU', hint: '1945' },
      { label: 'Traité de Rome (marché commun)', hint: '1957' },
      { label: 'Premier pas sur la Lune', hint: '1969' },
      { label: 'Chute du mur de Berlin', hint: '1989' },
      { label: 'Passage à l’euro fiduciaire', hint: '2002' },
    ],
  },
  {
    id: 'sciences',
    prompt: 'Les grandes découvertes scientifiques',
    ordered: [
      { label: 'Copernic place le Soleil au centre', hint: '1543' },
      { label: 'Newton publie la loi de la gravitation', hint: '1687' },
      { label: 'Pasteur vaccine contre la rage', hint: '1885' },
      { label: 'Marie Curie, premier prix Nobel', hint: '1903' },
      { label: 'Découverte de la structure de l’ADN', hint: '1953' },
    ],
  },
  {
    id: 'republiques',
    prompt: 'Les Républiques françaises',
    ordered: [
      { label: 'Iᵉʳᵉ République', hint: '1792' },
      { label: 'IIᵉ République', hint: '1848' },
      { label: 'IIIᵉ République', hint: '1870' },
      { label: 'IVᵉ République', hint: '1946' },
      { label: 'Vᵉ République', hint: '1958' },
    ],
  },
]

/** Nombre d'événements par frise — la promesse du catalogue. */
export const FRISE_SIZE = 5

export function buildFrisePool(seed: string, count: number): OrderBoard[] {
  return drawBoards(FRISES, count, seed)
}
