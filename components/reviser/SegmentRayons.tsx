'use client'

import { sfx } from '@/lib/sounds'
import { rayonCourt, tabId, type ModeTab } from '@/lib/subject-template'
import s from './Sommaire.module.css'

/**
 * LES RAYONS DE LA PORTE « COURS », en segment (05/10/2026) : Programme ·
 * Fiches · Grammaire · Anciens en français, Histoire · Géographie ·
 * Encyclopédie en histoire-géo.
 *
 * Ils étaient des pilules du même rang que « Mode de jeu » et « Annales » ; ce
 * sont des endroits où CHERCHER une fois qu'on apprend, pas d'autres choses à
 * faire — d'où le second étage, plus discret que le rail des portes.
 *
 * Le nom court (« Anciens ») est ce qu'on lit ; le nom entier (« Anciens
 * programmes ») est ce qu'entend un lecteur d'écran.
 */
export default function SegmentRayons({
  rayons,
  actif,
  onChange,
}: {
  rayons: ModeTab[]
  /** L'identifiant du rayon ouvert (« programme:fiches », « encyclopedie »). */
  actif: string
  onChange: (id: string) => void
}) {
  return (
    <nav aria-label="Les rayons du cours" className={s.segment}>
      {rayons.map((rayon) => {
        const id = tabId(rayon)
        const ouvert = id === actif
        return (
          <button
            key={id}
            type="button"
            aria-current={ouvert ? 'page' : undefined}
            aria-label={rayon.label}
            onClick={() => {
              if (ouvert) return
              sfx.tap()
              onChange(id)
            }}
            className={s.rayon}
          >
            {rayonCourt(rayon.label)}
          </button>
        )
      })}
    </nav>
  )
}
