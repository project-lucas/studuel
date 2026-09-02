import { Crown, Sparkles, Trophy } from 'lucide-react'
import { CristalIcon, EcuIcon } from '@/components/ui/MonnaieIcon'
import type { UniteGain } from '@/lib/gains'
import { cn } from '@/lib/utils'

/**
 * LE DESSIN D'UNE UNITÉ DE GAIN — le même partout : dans la case « Gagné » de
 * l'écran de fin, dans le panneau de récompenses, et sur le jeton qui s'en
 * détache pour voler vers le bandeau.
 *
 * C'est cette identité qui fait tenir le geste : on reconnaît l'objet qui
 * arrive là-haut comme celui qui vient de partir d'ici. Deux dessins
 * différents pour la même monnaie, et le vol ne raconte plus rien.
 *
 * Écus et cristaux sont des ILLUSTRATIONS (les mêmes fichiers que les pastilles
 * du bandeau) ; les trois autres sont des pictogrammes, faute de dessin — et
 * c'est cohérent : ce sont aussi les trois qui ne volent pas.
 */
export default function IconeUnite({
  unite,
  className,
}: {
  unite: UniteGain
  className?: string
}) {
  if (unite === 'ecu') return <EcuIcon className={cn('size-5', className)} />
  if (unite === 'gemme')
    return <CristalIcon className={cn('size-5', className)} />
  if (unite === 'couronne')
    return (
      <Crown
        className={cn('size-4', className)}
        strokeWidth={2.6}
        aria-hidden="true"
      />
    )
  if (unite === 'trophee')
    return (
      <Trophy
        className={cn('size-4', className)}
        strokeWidth={2.6}
        aria-hidden="true"
      />
    )
  return (
    <Sparkles
      className={cn('size-4', className)}
      strokeWidth={2.6}
      aria-hidden="true"
    />
  )
}
