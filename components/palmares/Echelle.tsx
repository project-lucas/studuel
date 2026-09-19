'use client'

import { useEffect, useState } from 'react'
import AvatarRender from '@/components/avatar/AvatarRender'
import { fetchModeLadder } from '@/app/defi/palmares-actions'
import { normalizeAvatarConfig } from '@/lib/avatar'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { formatScore, type EpreuveId } from '@/lib/palmares/epreuves'
import {
  PERIODES,
  indiceRupture,
  metalDuRang,
  parseEchelle,
  phraseEchelleVide,
  type LigneEchelle,
  type Periode,
} from '@/lib/palmares/echelle'

/**
 * L'ÉCHELLE d'une épreuve : les dix premiers de ma classe et ma ligne, cette
 * semaine ou de toujours. Chargée à l'ouverture (jamais avant : c'est un
 * détail qu'on déplie), et rendue telle que la base la connaît — prénom seul,
 * avatar, score. Ma ligne est surlignée ; si elle est loin sous le top, une
 * ligne « … » marque la distance à combler.
 */
export default function Echelle({
  mode,
  initiale = 'semaine',
  lignesInitiales,
}: {
  mode: EpreuveId
  initiale?: Periode
  /** Pour les tests et le rendu serveur : des lignes déjà là. */
  lignesInitiales?: LigneEchelle[]
}) {
  const [periode, setPeriode] = useState<Periode>(initiale)
  // Une liste par période, chargée à la première ouverture de chacune ; null =
  // pas encore lue. On ne remet rien à null : rebasculer sur une période déjà
  // lue la montre tout de suite.
  const [parPeriode, setParPeriode] = useState<Record<Periode, LigneEchelle[] | null>>({
    semaine: lignesInitiales && initiale === 'semaine' ? lignesInitiales : null,
    toujours: lignesInitiales && initiale === 'toujours' ? lignesInitiales : null,
  })
  const lignes = parPeriode[periode]

  useEffect(() => {
    if (lignes !== null) return
    let vivant = true
    fetchModeLadder(mode, periode)
      .then((l) => {
        if (vivant) setParPeriode((p) => ({ ...p, [periode]: parseEchelle(l) }))
      })
      .catch(() => {
        if (vivant) setParPeriode((p) => ({ ...p, [periode]: [] }))
      })
    return () => {
      vivant = false
    }
  }, [mode, periode, lignes])

  const rupture = lignes ? indiceRupture(lignes) : -1

  return (
    <div className="palm-liste">
      <div className="palm-periodes" role="tablist" aria-label="Période">
        {PERIODES.map((p) => (
          <button
            key={p.id}
            type="button"
            role="tab"
            aria-selected={periode === p.id}
            className={cn('palm-periode', periode === p.id && 'palm-periode--active')}
            onClick={() => {
              if (periode === p.id) return
              sfx.tap()
              setPeriode(p.id)
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      {lignes === null ? (
        <p className="palm-liste-vide" aria-busy="true">
          On lit l’échelle…
        </p>
      ) : lignes.length === 0 ? (
        <p className="palm-liste-vide">{phraseEchelleVide(periode)}</p>
      ) : (
        <ol className="palm-lignes">
          {lignes.map((l, i) => {
            const metal = metalDuRang(l.rank)
            return (
              <li key={`${l.rank}-${l.name}-${i}`} className="contents">
                {i === rupture ? (
                  <li className="palm-rupture" aria-hidden="true">
                    …
                  </li>
                ) : null}
                <div className={cn('palm-ligne', l.isMe && 'palm-ligne--moi', metal && `palm-ligne--${metal}`)}>
                  <span className="palm-ligne-rang">{l.rank}</span>
                  <span className="palm-ligne-avatar" aria-hidden="true">
                    <AvatarRender config={normalizeAvatarConfig(l.avatar ?? {})} className="size-full" />
                  </span>
                  <span className="palm-ligne-nom">
                    {l.isMe ? 'Toi' : l.name}
                    {l.isMe ? <small> · {l.name}</small> : null}
                  </span>
                  <span className="palm-ligne-score">{formatScore(mode, l.score)}</span>
                </div>
              </li>
            )
          })}
        </ol>
      )}
    </div>
  )
}
