import type { StaticImageData } from 'next/image'
import n1 from '@/public/images/chiffres/1.webp'
import n2 from '@/public/images/chiffres/2.webp'
import n3 from '@/public/images/chiffres/3.webp'
import n4 from '@/public/images/chiffres/4.webp'
import n5 from '@/public/images/chiffres/5.webp'
import n6 from '@/public/images/chiffres/6.webp'
import n7 from '@/public/images/chiffres/7.webp'
import n8 from '@/public/images/chiffres/8.webp'
import n9 from '@/public/images/chiffres/9.webp'
import n10 from '@/public/images/chiffres/10.webp'
import n11 from '@/public/images/chiffres/11.webp'
import n12 from '@/public/images/chiffres/12.webp'
import n13 from '@/public/images/chiffres/13.webp'
import n14 from '@/public/images/chiffres/14.webp'
import n15 from '@/public/images/chiffres/15.webp'
import n16 from '@/public/images/chiffres/16.webp'
import n17 from '@/public/images/chiffres/17.webp'
import n18 from '@/public/images/chiffres/18.webp'
import n19 from '@/public/images/chiffres/19.webp'

/**
 * LES NUMÉROS DE FICHE PEINTS — 1 à 19 (`scripts/chiffres.mjs`).
 *
 * UN NOMBRE ENTIER PAR IMAGE, et non les dix chiffres à composer. C'est ce qui
 * a été dessiné, et c'est le plus simple à poser : aucun assemblage, donc aucune
 * chasse à régler entre le « 1 » et le « 2 » d'un « 12 ». Le prix est un plafond
 * — au-delà de 19, il n'y a plus d'image.
 *
 * CE PLAFOND SE FRANCHIT SANS RIEN CASSER : `numeroIllustre` renvoie `undefined`
 * et l'appelant retombe sur le chiffre écrit en Baloo 2, exactement comme avant
 * ce lot. Une matière à vingt-cinq fiches reste donc lisible ; elle mélange
 * seulement deux styles de numéro passé la vingtième. Le jour où ça se voit, la
 * sortie est de dessiner 20 à 30 et de les ajouter ici — pas de toucher au reste.
 *
 * LES DESSINS SONT IMPORTÉS, PAS DÉSIGNÉS PAR LEUR CHEMIN, pour la même raison
 * que dans `Navigation.tsx` et `SupportChips.tsx` : un chemin littéral est une
 * URL stable, donc remplacer un dessin laisserait l'optimiseur de Next et le
 * cache des navigateurs servir l'ANCIEN.
 */
const NUMEROS: Record<number, StaticImageData> = {
  1: n1,
  2: n2,
  3: n3,
  4: n4,
  5: n5,
  6: n6,
  7: n7,
  8: n8,
  9: n9,
  10: n10,
  11: n11,
  12: n12,
  13: n13,
  14: n14,
  15: n15,
  16: n16,
  17: n17,
  18: n18,
  19: n19,
}

/** Le nombre peint, ou `undefined` s'il sort de la série dessinée. */
export function numeroIllustre(n: number): StaticImageData | undefined {
  return Number.isInteger(n) ? NUMEROS[n] : undefined
}
