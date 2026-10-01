'use client'

import { useEffect, useRef, useState } from 'react'
import { Loader2, ZoomIn, ZoomOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { sfx } from '@/lib/sounds'

/** Les crans de la loupe : la page à la largeur de l'écran, puis deux agrandissements. */
const ZOOMS = [1, 1.6, 2.2] as const

/**
 * Le sujet habillé, lu DANS l'app, page après page.
 *
 * Pourquoi pas une <iframe> sur le PDF : Chrome sur Android ne sait pas en
 * afficher une (il propose de télécharger), et Safari sur iPhone n'en montre
 * que la première page. pdf.js peint chaque page dans un <canvas>, au pixel
 * près (devicePixelRatio), partout pareil.
 *
 * LA LOUPE. L'app interdit le pincement (viewport sans zoom, cf. CLAUDE.md :
 * un pincement sur une table de jeu laissait l'écran décalé) — or une page A4
 * à 390 px se lit mal. Deux boutons agrandissent donc les pages, qui défilent
 * alors aussi de côté ; chaque changement de cran repeint à la bonne
 * résolution plutôt que d'étirer une image floue. Le ratio de pixels est
 * plafonné à 2 : quinze pages de physique en 2,2× à 3× pèseraient des
 * centaines de Mo de mémoire sur un téléphone.
 *
 * pdf.js n'est chargé qu'ici (import dynamique) : il ne pèse rien ailleurs.
 */
export default function LecteurPdf({ src, titre }: { src: string; titre: string }) {
  const boite = useRef<HTMLDivElement>(null)
  const [etat, setEtat] = useState<'charge' | 'pret' | 'erreur'>('charge')
  const [pages, setPages] = useState(0)
  const [cran, setCran] = useState(0)
  const zoom = ZOOMS[cran]

  useEffect(() => {
    let annule = false
    let detruire: (() => Promise<void>) | null = null

    async function lire() {
      const conteneur = boite.current
      if (!conteneur) return
      const pdfjs = await import('pdfjs-dist')
      pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        'pdfjs-dist/build/pdf.worker.min.mjs',
        import.meta.url,
      ).toString()
      const tache = pdfjs.getDocument({ url: src })
      detruire = () => tache.destroy()
      const doc = await tache.promise
      if (annule) return
      setPages(doc.numPages)
      conteneur.replaceChildren()
      // La largeur de la COLONNE (le parent qui défile), pas celle du contenu
      // agrandi : sinon chaque cran repartirait de la taille précédente.
      const largeur = (conteneur.parentElement ?? conteneur).clientWidth * zoom
      const ratio = Math.min(window.devicePixelRatio || 1, 2)

      for (let n = 1; n <= doc.numPages; n += 1) {
        if (annule) return
        const page = await doc.getPage(n)
        const brut = page.getViewport({ scale: 1 })
        const vue = page.getViewport({ scale: (largeur / brut.width) * ratio })
        const canvas = document.createElement('canvas')
        canvas.width = Math.floor(vue.width)
        canvas.height = Math.floor(vue.height)
        canvas.style.width = `${largeur}px`
        canvas.style.aspectRatio = `${brut.width} / ${brut.height}`
        canvas.className = 'block max-w-none rounded-xl bg-white shadow-carte'
        canvas.setAttribute('role', 'img')
        canvas.setAttribute('aria-label', `${titre}, page ${n} sur ${doc.numPages}`)
        conteneur.appendChild(canvas)
        await page.render({ canvas, viewport: vue }).promise
        if (n === 1) setEtat('pret')
      }
    }

    lire().catch(() => {
      if (!annule) setEtat('erreur')
    })
    return () => {
      annule = true
      void detruire?.()
    }
  }, [src, titre, zoom])

  function changer(sens: 1 | -1) {
    const suivant = Math.min(Math.max(cran + sens, 0), ZOOMS.length - 1)
    if (suivant === cran) return
    sfx.tap()
    setCran(suivant)
  }

  return (
    <div className="relative">
      {etat === 'charge' ? (
        <p className="flex items-center justify-center gap-2 py-16 text-sm font-semibold text-muted-foreground">
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          Ouverture du sujet…
        </p>
      ) : null}
      {etat === 'erreur' ? (
        <div className="carte flex flex-col items-center gap-3 px-4 py-8 text-center">
          <p className="font-heading font-extrabold">Le sujet ne s’affiche pas ici</p>
          <p className="max-w-xs text-sm text-muted-foreground">
            Ton navigateur n’a pas pu l’ouvrir. Tu peux le télécharger et le lire à côté.
          </p>
          <Button asChild>
            <a href={src} download>
              Télécharger le PDF
            </a>
          </Button>
        </div>
      ) : null}

      <div className="-mx-4 overflow-x-auto px-4 pb-1">
        <div ref={boite} className="flex w-max min-w-full flex-col gap-3" aria-busy={etat === 'charge'} />
      </div>

      {etat === 'pret' && pages > 0 ? (
        <p className="mt-3 text-center text-xs font-semibold text-muted-foreground">
          {pages} pages · fin du sujet
        </p>
      ) : null}

      {/* La loupe : collée en bas de l'écran, au-dessus de la barre d'onglets. */}
      {etat === 'pret' ? (
        <div className="sticky bottom-24 z-10 mt-3 flex justify-end">
          <div className="flex items-center gap-1 rounded-full border bg-card p-1 shadow-carte">
            <Button
              size="icon-sm"
              variant="ghost"
              aria-label="Réduire les pages"
              disabled={cran === 0}
              onClick={() => changer(-1)}
            >
              <ZoomOut aria-hidden="true" />
            </Button>
            <span className="min-w-10 text-center text-xs font-extrabold text-muted-foreground tabular-nums">
              {Math.round(zoom * 100)} %
            </span>
            <Button
              size="icon-sm"
              variant="ghost"
              aria-label="Agrandir les pages"
              disabled={cran === ZOOMS.length - 1}
              onClick={() => changer(1)}
            >
              <ZoomIn aria-hidden="true" />
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
