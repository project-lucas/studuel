import {
  ArrowDownUp,
  Compass,
  Gauge,
  Heart,
  MoveUp,
  Rocket,
  type LucideIcon,
} from 'lucide-react'
import type { GameMechanic } from '@/lib/jeux/formats'

/**
 * L'icône d'en-tête d'une table de jeu, choisie sur la MÉCANIQUE : dans la
 * barre du haut, elle annonce en un pictogramme ce qui va se passer (une course,
 * des vies à perdre, des paliers, un parcours, une montée). C'est le premier
 * signal que ce jeu n'est pas celui d'à côté.
 */
export const MECHANIC_ICON: Record<GameMechanic, LucideIcon> = {
  sprint: Rocket,
  vies: Heart,
  paliers: Gauge,
  expedition: Compass,
  ascension: MoveUp,
  ordre: ArrowDownUp,
}
