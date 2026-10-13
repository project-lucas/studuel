'use client'

import './globals.css'
import { useEffect } from 'react'
import EcranPepin from '@/components/EcranPepin'
import { signalerErreur } from '@/lib/erreurs-client'

// LA FRONTIÈRE RACINE : quand c'est la mise en page elle-même qui plante
// (`app/layout.tsx`, son `template`). Elle REMPLACE le layout, donc elle porte
// son propre <html> et <body>, et ses propres styles (globals.css). Sans les
// polices de l'app (next/font vit dans le layout) : la police système fait le
// travail, l'écran reste le même.
export default function ErreurGlobale({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  useEffect(() => {
    signalerErreur(error, { ou: 'frontiere-racine', digest: error.digest ?? null })
  }, [error])

  return (
    <html lang="fr" className="light">
      <body className="tab-bg min-h-screen antialiased">
        <main className="px-4 pt-10">
          <EcranPepin pepin="plantage" onReessayer={unstable_retry} code={error.digest ?? null} />
        </main>
      </body>
    </html>
  )
}
