'use client'

import { Printer } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * IMPRIMER LE COURS — la feuille qu'on emporte au contrôle.
 *
 * Un cours de langue se révise sur écran, mais se relit sur papier : c'est la
 * demande la plus constante des élèves qui surlignent, et la seule façon de
 * réviser sans le téléphone à portée de main. Le navigateur sait déjà le faire
 * (Ctrl+P) — sauf que sur téléphone, où l'app est installée en PWA, l'élève
 * n'a AUCUN menu pour l'atteindre. D'où ce bouton.
 *
 * La mise en page papier, elle, ne vit pas ici mais dans le bloc `@media print`
 * de `globals.css` : le bandeau, la barre d'onglets et les boutons s'effacent,
 * la feuille reste seule sur la page.
 */
export default function LessonPrintButton({
  className,
}: {
  className?: string
}) {
  return (
    <button
      type="button"
      aria-label="Imprimer le cours"
      title="Imprimer le cours"
      onClick={() => window.print()}
      className={cn(
        'inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-card text-foreground shadow-sm transition-transform active:scale-95',
        className,
      )}
    >
      <Printer className="size-5" aria-hidden="true" />
    </button>
  )
}
