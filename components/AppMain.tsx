'use client'

import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { estPleinEcran } from '@/lib/quiz-chrome'
import { estOngletMoi } from '@/lib/top-hud-routes'

/**
 * LE GABARIT DE PAGE — marges de lecture, ou rien du tout.
 *
 * Deux tenues, une seule décision :
 *   - route ordinaire → marges (`pt-16` sous le bandeau, `pb-24` au-dessus de
 *     la barre d'onglets) et largeur de lecture (`max-w-4xl`) ;
 *   - session plein écran (quiz, dictée) → la page prend toute la place, c'est
 *     elle qui pose son propre fond et son propre bouton en bas d'écran.
 *
 * POURQUOI UN COMPOSANT CLIENT, et pas trois lignes dans le layout racine.
 * Le layout est SERVEUR et n'est **pas re-rendu lors d'une navigation client**.
 * Le verdict pris là-haut sur l'en-tête `x-pathname` reste donc figé sur la
 * page par laquelle l'élève est entré dans l'app. Un quiz ouvert depuis la
 * fiche d'un chapitre — c'est-à-dire par un `<Link>`, le cas normal — héritait
 * ainsi des marges de l'accueil : le fond de la matière ne remplissait pas
 * l'écran et le bouton « Valider » tombait sous la barre d'onglets, hors de
 * portée. La même URL tapée à la main donnait un écran juste, ce qui rendait le
 * défaut invisible en test.
 *
 * `usePathname()` s'évalue AUSSI au rendu serveur : le premier HTML est déjà
 * dans la bonne tenue, il n'y a pas de clignotement à l'hydratation.
 */
export default function AppMain({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const pleinEcran = estPleinEcran(pathname)
  // L'onglet Moi n'a pas de bandeau (lib/top-hud-routes) : sa carte de
  // joueur prend la place du haut, sous la seule marge sûre de l'écran.
  const sansBandeau = estOngletMoi(pathname)

  return (
    // min-w-0 : sans lui, l'item flex refuse de rétrécir sous la largeur
    // intrinsèque de son contenu et la page déborde sur mobile.
    <main
      className={
        pleinEcran
          ? 'min-w-0 flex-1'
          : sansBandeau
            ? 'min-w-0 flex-1 px-4 pt-[calc(0.75rem+env(safe-area-inset-top))] pb-24 md:px-8 md:py-10'
            : 'min-w-0 flex-1 px-4 pt-16 pb-24 md:px-8 md:py-10'
      }
    >
      <div className={pleinEcran ? 'w-full' : 'mx-auto w-full max-w-4xl'}>
        {children}
      </div>
    </main>
  )
}
