'use client'

import { useCallback, useEffect, useRef, useState, type ReactNode, type TouchEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BookOpen, ChevronLeft, ChevronRight, Lock } from 'lucide-react'
import { avecSens, sensDuGeste, voisinage, type Livre, type PageLivre } from '@/lib/exercices/livre'
import s from './livre.module.css'

/** Ce qu'on touche pour répondre ne tourne jamais la page. */
const INTERACTIF = 'input, textarea, select, button, a, label, [role="button"], [data-zone], svg'

/**
 * LA LISEUSE — un exercice présenté comme la page d'un manuel numérique.
 * En tête, le titre courant (le thème, le chapitre) et le folio « p. 7 / 24 »,
 * avec une barre d'avancée découpée par chapitre ; en pied, de quoi tourner la
 * page vers la précédente ou la suivante. On tourne aussi d'un glissé du doigt
 * ou avec les flèches du clavier. La page qui entre « tourne » (transform et
 * opacité seulement).
 *
 * Plus de sommaire en tiroir (26/10/2026, Lucas : « je ne pense pas que ce
 * soit nécessaire… renvoyer simplement au chapitre ou exercice suivant ») : la
 * page suivante passe d'elle-même au chapitre d'après, et le cahier propose
 * le chapitre suivant en pied.
 */
export default function Liseuse({
  livre,
  chapitreId,
  position,
  sens,
  children,
}: {
  livre: Livre
  chapitreId: string
  position: number
  /** Le sens dans lequel on vient de tourner la page (animation d'entrée). */
  sens: 'suivante' | 'precedente' | null
  children: ReactNode
}) {
  const router = useRouter()
  const [refus, setRefus] = useState(false)
  const depart = useRef<{ x: number; y: number } | null>(null)
  const v = voisinage(livre, chapitreId, position)

  const tourner = useCallback(
    (cible: PageLivre | null, direction: 'suivante' | 'precedente') => {
      if (!cible) return
      if (cible.etat === 'verrouille') {
        // Peut-être vient-on de réussir la page : on relit le livre.
        setRefus(true)
        router.refresh()
        return
      }
      router.push(avecSens(cible.href, direction))
    },
    [router],
  )

  useEffect(() => {
    if (!v) return
    const auClavier = (e: KeyboardEvent) => {
      const cible = e.target as HTMLElement | null
      if (cible?.closest('input, textarea, select, [contenteditable="true"]')) return
      if (e.key === 'ArrowRight') tourner(v.suivante, 'suivante')
      if (e.key === 'ArrowLeft') tourner(v.precedente, 'precedente')
    }
    window.addEventListener('keydown', auClavier)
    return () => window.removeEventListener('keydown', auClavier)
  }, [v, tourner])

  if (!v) return <>{children}</>

  const debutGeste = (e: TouchEvent) => {
    const cible = e.target as HTMLElement
    depart.current = cible.closest(INTERACTIF) ? null : { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }
  const finGeste = (e: TouchEvent) => {
    if (!depart.current) return
    const t = e.changedTouches[0]
    const direction = sensDuGeste(t.clientX - depart.current.x, t.clientY - depart.current.y)
    depart.current = null
    if (direction === 'suivante') tourner(v.suivante, 'suivante')
    if (direction === 'precedente') tourner(v.precedente, 'precedente')
  }

  const lue = v.courante.numero
  return (
    <div onTouchStart={debutGeste} onTouchEnd={finGeste} className="flex flex-col gap-4">
      <header className={s.titreCourant}>
        <BookOpen className="size-5 shrink-0 text-[var(--primary)]" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <p className={s.livreNom}>
            Manuel · {livre.titre}
            <span className={s.chapitreNom}>{v.section.titre}</span>
          </p>
          <div className={s.avancee} aria-hidden="true">
            {livre.sections.map((sec) => {
              const part = Math.min(1, Math.max(0, (lue - sec.debut + 1) / (sec.fin - sec.debut + 1)))
              return (
                <span key={sec.id} className={s.troncon} style={{ flexGrow: sec.fin - sec.debut + 1 }}>
                  <span className={s.remplissage} style={{ transform: `scaleX(${part})` }} />
                </span>
              )
            })}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-0.5">
          <button
            type="button"
            className={s.fleche}
            onClick={() => tourner(v.precedente, 'precedente')}
            disabled={!v.precedente}
            aria-label="Page précédente"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
          </button>
          <span className={s.folio} aria-label={`Page ${lue} sur ${v.total}`}>
            p. {lue}
            <small> / {v.total}</small>
          </span>
          <button
            type="button"
            className={s.fleche}
            onClick={() => tourner(v.suivante, 'suivante')}
            disabled={!v.suivante}
            aria-label="Page suivante"
            data-verrou={v.suivante?.etat === 'verrouille' || undefined}
          >
            {v.suivante?.etat === 'verrouille' ? <Lock className="size-3.5" aria-hidden="true" /> : <ChevronRight className="size-4" aria-hidden="true" />}
          </button>
        </div>
      </header>

      <div key={`${chapitreId}-${position}`} className={s.page} data-sens={sens ?? undefined}>
        {children}
      </div>

      <footer className="flex flex-col gap-2">
        <div className={s.pied}>
          {v.precedente ? (
            <Link href={avecSens(v.precedente.href, 'precedente')} className={s.tourner} data-cote="precedente">
              <span className={s.tournerSens}>
                <ChevronLeft className="size-4" aria-hidden="true" /> p. {v.precedente.numero}
              </span>
              <span className={s.tournerTitre}>{v.precedente.titre}</span>
            </Link>
          ) : (
            <span className={s.bordLivre + ' self-center'}>Début du manuel</span>
          )}
          {v.suivante ? (
            <button
              type="button"
              className={s.tourner}
              data-cote="suivante"
              aria-disabled={v.suivante.etat === 'verrouille'}
              onClick={() => tourner(v.suivante, 'suivante')}
            >
              <span className={s.tournerSens}>
                p. {v.suivante.numero}{' '}
                {v.suivante.etat === 'verrouille' ? (
                  <Lock className="size-3.5" aria-hidden="true" />
                ) : (
                  <ChevronRight className="size-4" aria-hidden="true" />
                )}
              </span>
              <span className={s.tournerTitre}>{v.suivante.titre}</span>
            </button>
          ) : (
            <span className={s.bordLivre + ' self-center'}>Fin du manuel</span>
          )}
        </div>
        {refus && v.suivante?.etat === 'verrouille' ? (
          <p className={s.bordLivre} role="status">
            Réussis cette page pour tourner la suivante.
          </p>
        ) : (
          <p className={s.bordLivre}>Glisse la page du doigt pour la tourner.</p>
        )}
      </footer>
    </div>
  )
}
