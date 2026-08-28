// Setup des tests de composants (projet « composants », environnement jsdom).
// Étend `expect` avec les matchers DOM (toBeInTheDocument, toHaveTextContent…)
// et nettoie le DOM entre deux tests — sans globals Vitest, l'auto-cleanup de
// testing-library ne s'enregistre pas, on le fait donc explicitement.
import '@testing-library/jest-dom/vitest'
import { afterEach, vi } from 'vitest'
import { createElement } from 'react'
import { cleanup } from '@testing-library/react'

afterEach(() => {
  cleanup()
})

// `next/image` REMPLACÉ PAR UN `<img>` NU.
//
// Le composant de Next exige une `width` et une `height` — il les tire
// normalement de l'import statique du fichier (`StaticImageData`), que le
// bundler remplit à la compilation. Vitest, lui, résout un `.webp` importé en
// une simple CHAÎNE : le composant se retrouve sans dimensions et jette
// « Image is missing required width property », ce qui fait tomber tout écran
// portant une illustration — vingt tests de ChapterList d'un coup, pour une
// raison qui n'a rien à voir avec ce qu'ils vérifient.
//
// Le remplaçant accepte les deux formes de `src` (chaîne ou objet) et écarte
// les props propres à Next, qui ne sont pas des attributs HTML valides et
// polluraient la console d'avertissements React.
vi.mock('next/image', () => {
  // Props propres à Next : elles ne sont pas des attributs HTML valides et
  // rempliraient la console d'avertissements React si on les laissait passer.
  const PROPS_NEXT = new Set([
    'fill',
    'priority',
    'quality',
    'placeholder',
    'blurDataURL',
    'loader',
    'unoptimized',
  ])

  return {
    __esModule: true,
    default: (props: Record<string, unknown>) => {
      const attributs: Record<string, unknown> = {}
      for (const [cle, valeur] of Object.entries(props)) {
        if (cle !== 'src' && !PROPS_NEXT.has(cle)) attributs[cle] = valeur
      }
      const src = props.src
      const url =
        typeof src === 'string'
          ? src
          : ((src as { src?: string } | null)?.src ?? '')
      return createElement('img', { ...attributs, src: url })
    },
  }
})
