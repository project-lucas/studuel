'use client'

import Image from 'next/image'
import { RefreshCw } from 'lucide-react'
import marcelTete from '@/public/images/nav/marcel.webp'
import { Button } from '@/components/ui/button'

/**
 * L'ÉCRAN D'UN PÉPIN — le même pour les trois filets de l'app (12/10/2026) :
 * la frontière d'erreur (`app/error.tsx`), la frontière racine
 * (`app/global-error.tsx`) et la page introuvable (`app/not-found.tsx`).
 *
 * Jusque-là, un plantage montrait l'écran brut de Next, en anglais, à un
 * élève de 6e. Ici : Marcel, un titre en Baloo 2, une phrase qui le déculpabilise
 * (« ce n'est pas de ta faute »), UN gros bouton violet, et le retour à
 * l'accueil en second. Sur le mur crème de l'app, sans fond.
 *
 * « Retour à l'accueil » est un VRAI lien (`<a>`, rechargement complet), pas
 * un `<Link>` : après un plantage, repartir de zéro est ce qu'on veut, et la
 * frontière racine n'a de toute façon plus de routeur sous la main.
 */
export type Pepin = 'plantage' | 'hors-connexion' | 'introuvable'

const TEXTES: Record<Pepin, { titre: string; phrase: string }> = {
  plantage: {
    titre: 'Oups, ça a cassé',
    phrase:
      'Ce n’est pas de ta faute. Réessaie ; si ça recommence, reviens à l’accueil — on est prévenus et on répare.',
  },
  'hors-connexion': {
    titre: 'Tu es hors connexion',
    phrase: 'Reconnecte-toi, puis réessaie. Les cours que tu as déjà ouverts restent lisibles.',
  },
  introuvable: {
    titre: 'Cette page n’existe pas',
    phrase: 'Le lien est peut-être ancien, ou la page a changé de place.',
  },
}

export default function EcranPepin({
  pepin,
  onReessayer,
  code,
}: {
  pepin: Pepin
  /** « Réessayer » : la frontière re-rend ses enfants (`unstable_retry`). */
  onReessayer?: () => void
  /** Le `digest` de Next : écrit en petit, il relie l'écran à /admin/erreurs. */
  code?: string | null
}) {
  const { titre, phrase } = TEXTES[pepin]
  return (
    <section className="mx-auto flex w-full max-w-md flex-col items-center px-4 pt-10 text-center">
      <Image
        src={marcelTete}
        alt=""
        width={112}
        height={112}
        priority
        className="size-28 select-none"
      />
      <h1 className="font-heading mt-4 text-3xl font-extrabold text-balance">{titre}</h1>
      <p className="mt-2 text-base font-medium text-muted-foreground text-pretty">{phrase}</p>

      <div className="mt-8 flex w-full flex-col gap-3">
        {onReessayer ? (
          <Button type="button" size="xl" shine onClick={onReessayer} className="w-full">
            <RefreshCw aria-hidden="true" />
            Réessayer
          </Button>
        ) : null}
        <Button asChild variant={onReessayer ? 'secondary' : 'default'} size={onReessayer ? 'lg' : 'xl'} className="w-full">
          {/* Un <a> et pas un <Link>, VOLONTAIREMENT (cf. l'en-tête) : après un
              plantage, un rechargement complet efface l'état cassé du
              navigateur ; une navigation client le garderait. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/">Retour à l’accueil</a>
        </Button>
      </div>

      {code ? (
        <p className="mt-6 text-xs text-muted-foreground">
          Code : <span className="font-mono">{code}</span>
        </p>
      ) : null}
    </section>
  )
}
