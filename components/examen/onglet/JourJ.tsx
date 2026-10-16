'use client'

import { useEffect, useState } from 'react'
import { Check, Moon, Wind } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { compteARebours } from '@/lib/examen/parcours'
import { conseilDuSoir, sacDeLExamen } from '@/lib/examen/onglet'
import type { IdExamen } from '@/lib/examen/parcours'
import styles from './JourJ.module.css'

/**
 * LES DERNIERS JOURS (maquette 7) : à J-7, l’onglet devient le jour J — le
 * sac à préparer (coché dans la mémoire du navigateur : c’est une affaire de
 * la semaine, rien à garder en base), le conseil du soir, et une minute pour
 * souffler (un cercle qui gonfle et dégonfle : transform seulement, figé sous
 * mouvement réduit).
 */
export default function JourJ({ examen, nom, jours }: { examen: IdExamen; nom: string; jours: number }) {
  const sac = sacDeLExamen(examen)
  const cle = `studuel:sac:${examen}`
  const [coches, setCoches] = useState<string[]>([])
  const [souffle, setSouffle] = useState(false)

  useEffect(() => {
    try {
      const brut = window.localStorage.getItem(cle)
      // Lecture tardive d’une mémoire locale : rien côté serveur à hydrater.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (brut) setCoches(JSON.parse(brut) as string[])
    } catch {
      /* mémoire indisponible : la liste repart vide, sans gêne */
    }
  }, [cle])

  const basculer = (id: string) => {
    sfx.tap()
    const suite = coches.includes(id) ? coches.filter((c) => c !== id) : [...coches, id]
    setCoches(suite)
    try {
      window.localStorage.setItem(cle, JSON.stringify(suite))
    } catch {
      /* rien : la coche vaut pour la session */
    }
  }

  return (
    <>
      <section
        className="rounded-carte bg-card shadow-carte flex items-center gap-3 p-3.5 ring-2 ring-[color-mix(in_oklch,var(--highlight),white_35%)]"
        aria-labelledby="jourj-titre"
      >
        <div className="min-w-0 flex-1">
          <p id="jourj-titre" className="font-heading text-[38px] leading-none font-extrabold tabular-nums">
            {compteARebours(jours)}
          </p>
          <p className="font-heading mt-1 text-[15px] font-extrabold">{nom}</p>
        </div>
        <span className="bg-highlight text-accent-foreground inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11.5px] font-extrabold">
          <Moon aria-hidden="true" className="size-3.5" />
          Derniers jours
        </span>
      </section>

      <section className="carte p-3.5" aria-labelledby="jourj-sac">
        <div className="flex items-baseline justify-between">
          <h2 id="jourj-sac" className="font-heading text-[17px] font-extrabold">
            Ton sac
          </h2>
          <span className="text-muted-foreground text-[11.5px] font-extrabold">
            {sac.filter((o) => coches.includes(o.id)).length} / {sac.length}
          </span>
        </div>
        <ul className="mt-1">
          {sac.map((o) => {
            const ok = coches.includes(o.id)
            return (
              <li key={o.id}>
                <button
                  type="button"
                  aria-pressed={ok}
                  onClick={() => basculer(o.id)}
                  className={cn('flex min-h-11 w-full items-center gap-2.5 text-left text-[13px] font-bold', ok && 'text-muted-foreground')}
                >
                  <span
                    className={cn(
                      'grid size-6 shrink-0 place-items-center rounded-lg border-2',
                      ok ? 'border-success bg-success text-white' : 'border-[color-mix(in_oklch,var(--primary),white_65%)]',
                    )}
                  >
                    {ok ? <Check aria-hidden="true" className="size-4" strokeWidth={3.2} /> : null}
                  </span>
                  {o.texte}
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="carte p-3.5" aria-labelledby="jourj-soir">
        <h2 id="jourj-soir" className="font-heading text-[17px] font-extrabold">
          {jours === 0 ? 'Aujourd’hui' : 'Ce soir'}
        </h2>
        <p className="text-muted-foreground mt-0.5 text-[12.5px] leading-snug font-semibold">{conseilDuSoir(jours)}</p>
        <button
          type="button"
          onClick={() => {
            sfx.tap()
            setSouffle((s) => !s)
          }}
          aria-pressed={souffle}
          className="mt-2 flex min-h-14 w-full items-center gap-3 text-left"
        >
          <span className="bg-secondary text-primary relative grid size-12 shrink-0 place-items-center rounded-full">
            <span aria-hidden="true" className={cn(styles.bulle, souffle && styles.respire)} />
            <Wind aria-hidden="true" className="relative size-5" strokeWidth={2.6} />
          </span>
          <span className="min-w-0">
            <span className="font-heading block text-[14px] font-extrabold">{souffle ? 'Suis le cercle…' : 'Une minute pour souffler'}</span>
            <span className="text-muted-foreground block text-[11.5px] font-semibold">
              {souffle ? 'Il gonfle : inspire. Il s’arrête : bloque. Il dégonfle : souffle.' : 'Inspire 4 s, bloque 4 s, souffle 4 s'}
            </span>
          </span>
        </button>
      </section>
    </>
  )
}
