import { CristalIcon } from '@/components/ui/MonnaieIcon'
import { cn } from '@/lib/utils'

/**
 * Un prix en gemmes : le nombre puis le cristal illustré, le même objet que le
 * bandeau. « Offerte » à zéro — un prix de 0 se lit comme une erreur.
 */
export default function PrixGemmes({
  montant,
  className,
  iconeClassName = 'size-4',
}: {
  montant: number
  className?: string
  iconeClassName?: string
}) {
  if (montant <= 0) {
    return <span className={cn('font-heading font-extrabold', className)}>Offerte</span>
  }
  return (
    <span
      className={cn('font-heading inline-flex items-center gap-1 font-extrabold tabular-nums', className)}
      aria-label={`${montant} gemmes`}
    >
      <span aria-hidden="true">{montant.toLocaleString('fr-FR')}</span>
      <CristalIcon className={iconeClassName} />
    </span>
  )
}
