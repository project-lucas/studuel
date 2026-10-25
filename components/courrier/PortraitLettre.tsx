import { GraduationCap, Sparkles } from 'lucide-react'
import PortraitJoueur from '@/components/amis/PortraitJoueur'
import PoseMarcel from '@/components/marcel/PoseMarcel'
import type { VisageLettre } from '@/lib/courrier'
import { cn } from '@/lib/utils'

/**
 * LE VISAGE DE L'EXPÉDITEUR, à gauche de la lettre : Marcel dans sa pose
 * (le buste, cadré dans un rond lavande — ses poses sont dessinées en pied),
 * l'ami avec son blason (PortraitJoueur), le coach (la toque), l'équipe
 * Studuel (l'étincelle, en violet plein).
 */
export default function PortraitLettre({ visage, className }: { visage: VisageLettre; className?: string }) {
  if (visage.genre === 'joueur') {
    return <PortraitJoueur id={visage.id} portrait={visage.portrait} className={cn('size-14', className)} />
  }
  if (visage.genre === 'marcel') {
    return (
      <span
        aria-hidden="true"
        className={cn('relative block size-14 shrink-0 overflow-hidden rounded-full bg-secondary', className)}
      >
        <PoseMarcel pose={visage.pose} hauteur={112} className="absolute top-1 left-1/2 max-w-none -translate-x-1/2 select-none" />
      </span>
    )
  }
  if (visage.genre === 'coach') {
    return (
      <span
        aria-hidden="true"
        className={cn('grid size-14 shrink-0 place-items-center rounded-full bg-secondary text-primary', className)}
      >
        <GraduationCap className="size-7" />
      </span>
    )
  }
  return (
    <span
      aria-hidden="true"
      className={cn('grid size-14 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground', className)}
    >
      <Sparkles className="size-7" />
    </span>
  )
}
