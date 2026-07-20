import Link from 'next/link'
import { Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Écran de verrouillage premium d'un support de leçon dont le quiz est réservé
// à Studuel+ (cohérent avec /test/[id] et la carte mentale). On montre le
// paywall plutôt qu'un trompeur « bientôt » quand le contenu existe mais que
// l'élève n'y a pas droit.
export default function LessonSupportLock({
  support,
  backHref,
}: {
  support: string
  backHref: string
}) {
  return (
    <div className="mx-auto max-w-md rounded-3xl border p-8 text-center">
      <span className="bg-card mx-auto mb-3 flex size-14 items-center justify-center rounded-2xl border shadow-sm">
        <Lock className="text-muted-foreground size-6" aria-hidden="true" />
      </span>
      <p className="font-heading font-semibold text-balance">
        {support} de cette leçon est réservé à Studuel+.
      </p>
      <p className="text-muted-foreground mt-2 text-sm">
        Abonne-toi pour débloquer les quiz premium, ou entraîne-toi d&apos;abord
        avec les leçons gratuites.
      </p>
      <div className="mt-4 flex flex-col items-center gap-2">
        <Button asChild className="rounded-full">
          <Link href="/compte">Débloquer avec Studuel+</Link>
        </Button>
        <Link
          href={backHref}
          className="text-muted-foreground text-sm font-medium underline underline-offset-4"
        >
          Retour à la leçon
        </Link>
      </div>
    </div>
  )
}
