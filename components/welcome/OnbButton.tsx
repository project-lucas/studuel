'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type OnbVariant = 'primary' | 'ghost'

// Le bouton d'action de l'onboarding, c'est LE bouton de l'app (23/09/2026).
// `.onb-btn` avait sa propre robe — jaune pour la fin, capitales, rayon de
// 16 px — et faisait de l'onboarding le seul monde à ses propres boutons. Le
// jaune est parti : il dit « récompense », pas « action ». Les capitales avec
// lui : « C'est parti » se lit, « C'EST PARTI » se crie. L'API reste la même
// pour les écrans : `ghost` donne le contour, tout le reste est violet plein.
export default function OnbButton({
  variant = 'primary',
  className,
  asChild = false,
  type,
  ...props
}: Omit<React.ComponentProps<typeof Button>, 'variant' | 'size'> & {
  variant?: OnbVariant
}) {
  return (
    <Button
      asChild={asChild}
      // Un <button> sans `type` soumet le formulaire qui l'entoure ; un lien
      // (`asChild`) n'a pas de type à recevoir.
      type={asChild ? type : (type ?? 'button')}
      size="xl"
      variant={variant === 'ghost' ? 'outline' : 'default'}
      className={cn('w-full', className)}
      {...props}
    />
  )
}
