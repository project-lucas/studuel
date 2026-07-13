'use client'

import { cn } from '@/lib/utils'

export type OnbVariant = 'primary' | 'yellow' | 'ghost'

// Classe du bouton 3D « façon Duolingo » (définies dans globals.css sous `.onb`).
export function onbButtonClass(variant: OnbVariant = 'primary'): string {
  return cn(
    'onb-btn',
    variant === 'yellow' && 'onb-btn-yellow',
    variant === 'ghost' && 'onb-btn-ghost',
  )
}

// Bouton d'action de l'onboarding. Socle dur qui s'enfonce au press.
export default function OnbButton({
  variant = 'primary',
  className,
  type = 'button',
  ...props
}: React.ComponentProps<'button'> & { variant?: OnbVariant }) {
  return (
    <button
      type={type}
      className={cn(onbButtonClass(variant), className)}
      {...props}
    />
  )
}
