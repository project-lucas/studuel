'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { useFermeAuMasquage } from '@/components/useFermeAuMasquage'
import { chercherFiches, type IndexFiches } from '@/lib/reviser/recherche-globale'
import { subjectVignette } from '@/lib/subject-style'
import { sfx } from '@/lib/sounds'

/**
 * LA LOUPE GLOBALE (12/10/2026, Lucas : « oui d'accord avec une icône loupe
 * globale ») — dans la rangée des commandes de l'accueil Réviser, à côté de
 * l'étoile : chercher une fiche dans TOUTES les matières de sa classe, sans
 * savoir dans quel dossier elle est. Jusque-là, la loupe ne vivait que dans
 * chaque matière.
 *
 * Un rond blanc comme l'étoile ; au tap, un écran de recherche par-dessus
 * l'onglet : le champ en haut (clavier ouvert tout de suite), une ligne par
 * fiche trouvée — la vignette de sa matière, son nom, le titre —, qui mène à
 * l'écran du chapitre. L'index (id, titre, matière de chaque fiche) est lu UNE
 * fois par session (/api/reviser/fiches) ; la recherche est synchrone, sans
 * réseau, à chaque touche (lib/reviser/recherche-globale).
 *
 * Écran transitoire d'un onglet gardé vivant : il se referme quand l'onglet
 * est masqué (`useFermeAuMasquage`). Un lien précharge à l'INTENTION
 * (pointerdown), jamais en rafale.
 */

let indexEnMemoire: Promise<IndexFiches | null> | null = null

function chargerIndex(): Promise<IndexFiches | null> {
  if (!indexEnMemoire) {
    indexEnMemoire = fetch('/api/reviser/fiches')
      .then((r) => (r.ok ? (r.json() as Promise<IndexFiches>) : null))
      .catch(() => null)
      .then((index) => {
        // Une panne ne se mémorise pas : la prochaine ouverture retentera.
        if (!index) indexEnMemoire = null
        return index
      })
  }
  return indexEnMemoire
}

const EXEMPLES = '« Thalès », « Révolution », « present perfect »…'

export default function LoupeGlobale({
  indexInitial = null,
}: {
  /** Un index déjà en main (l'aperçu /dev/loupe) : rien n'est lu au réseau. */
  indexInitial?: IndexFiches | null
}) {
  const router = useRouter()
  const [ouverte, setOuverte] = useState(false)
  const [query, setQuery] = useState('')
  const [index, setIndex] = useState<IndexFiches | null>(indexInitial)
  // L'index n'a pas pu se charger (réseau, session) : dit à l'ouverture
  // suivante de retenter.
  const [panne, setPanne] = useState(false)
  const champ = useRef<HTMLInputElement>(null)
  useFermeAuMasquage(setOuverte, false)

  useEffect(() => {
    if (!ouverte) return
    let vivant = true
    if (!indexInitial) {
      chargerIndex().then((i) => {
        if (!vivant) return
        if (i) setIndex(i)
        else setPanne(true)
      })
    }
    champ.current?.focus()
    // Le fond ne défile pas sous l'écran de recherche.
    const avant = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      vivant = false
      document.body.style.overflow = avant
    }
  }, [ouverte, indexInitial])

  const fermer = () => {
    sfx.tap()
    setQuery('')
    setOuverte(false)
  }

  const cherche = query.trim().length > 0
  const resultats = index && cherche ? chercherFiches(index, query) : []

  return (
    <>
      <button
        type="button"
        onClick={() => {
          sfx.tap()
          setPanne(false)
          setOuverte(true)
        }}
        aria-label="Chercher une fiche dans toutes les matières"
        className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-primary shadow-sm ring-1 ring-black/5 transition active:translate-y-px"
      >
        <Search className="size-4.5" strokeWidth={2.6} aria-hidden="true" />
      </button>

      {ouverte ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Chercher une fiche"
          className="fixed inset-0 z-[60] overflow-y-auto bg-background"
        >
          <div className="mx-auto w-full max-w-md px-4 pt-[calc(0.75rem+env(safe-area-inset-top))] pb-10">
            <div className="flex h-12 items-center gap-2 rounded-full bg-card pr-1 pl-4 shadow-sm ring-1 ring-black/5">
              <Search className="size-5 shrink-0 text-primary" strokeWidth={3} aria-hidden="true" />
              <input
                ref={champ}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') fermer()
                }}
                placeholder="Une fiche, dans toutes les matières"
                aria-label="Chercher une fiche"
                enterKeyHint="search"
                autoComplete="off"
                className="min-w-0 flex-1 bg-transparent text-base font-semibold outline-none placeholder:font-medium placeholder:text-muted-foreground"
              />
              <button
                type="button"
                onClick={fermer}
                aria-label="Fermer la recherche"
                className="flex size-10 shrink-0 items-center justify-center rounded-full text-muted-foreground transition active:scale-95"
              >
                <X className="size-5" strokeWidth={2.6} aria-hidden="true" />
              </button>
            </div>

            {panne ? (
              <p className="mt-6 text-center text-sm font-medium text-muted-foreground">
                La liste des fiches n’a pas pu se charger. Ferme et réessaie.
              </p>
            ) : !cherche ? (
              <p className="mt-6 text-center text-sm font-medium text-muted-foreground">
                Tape le nom d’une fiche : {EXEMPLES}
              </p>
            ) : !index ? (
              <p className="mt-6 text-center text-sm font-medium text-muted-foreground">Un instant…</p>
            ) : resultats.length === 0 ? (
              <p className="mt-6 text-center text-sm font-medium text-muted-foreground">
                Aucune fiche pour « {query.trim()} ».
              </p>
            ) : (
              <ul className="mt-4 flex flex-col gap-2">
                {resultats.map((r) => {
                  const vignette = subjectVignette(r.matiere.slug)
                  return (
                    <li key={r.fiche.id}>
                      <Link
                        href={r.href}
                        onPointerDown={() => router.prefetch(r.href)}
                        onClick={fermer}
                        className="carte flex min-h-16 items-center gap-3 p-3 transition active:scale-[0.99]"
                      >
                        <span className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-secondary">
                          {vignette ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={vignette} alt="" width={160} height={160} className="size-9 object-contain" />
                          ) : null}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="surtitre block truncate">
                            {r.matiere.nom}
                            {r.fiche.th ? ` · ${r.fiche.th}` : ''}
                          </span>
                          <span className="block font-semibold text-pretty">{r.fiche.t}</span>
                        </span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </div>
      ) : null}
    </>
  )
}
