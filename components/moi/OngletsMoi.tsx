'use client'

import { useState, type ReactNode } from 'react'
import { ChartNoAxesColumn, Gem, Medal, type LucideIcon } from 'lucide-react'
import { sfx } from '@/lib/sounds'
import { cn } from '@/lib/utils'

// -----------------------------------------------------------------------------
// LES TROIS ONGLETS DE MOI — refonte du 17/09/2026 (Lucas : « on s'y perd,
// c'est désagréable »).
//
// L'écran empilait six blocs de même poids sous la carte : classement, rythme,
// trajectoire, couronnes, puis un palmarès qui déroulait chaque jeu de chaque
// matière. Sur un téléphone, c'était quatre écrans de défilement sans repère —
// on ne savait ni où on était, ni ce qui restait dessous.
//
// Trois questions, trois onglets, et la barre reste collée en haut pendant
// qu'on descend :
//   • PROGRÈS    — où j'en suis (classement, rythme, trajectoire)
//   • COLLECTION — ce que j'ai gagné (couronnes, badges)
//   • PALMARÈS   — mes records (épreuves de l'Arène, duels, jeux)
//
// Les trois panneaux sont rendus par le serveur et restent montés : changer
// d'onglet est instantané, et l'animation du classement ne rejoue pas.
// -----------------------------------------------------------------------------

export type OngletMoi = {
  id: string
  label: string
  contenu: ReactNode
}

const ICONES: Record<string, LucideIcon> = {
  progres: ChartNoAxesColumn,
  collection: Gem,
  palmares: Medal,
}

export default function OngletsMoi({
  onglets,
  seule = false,
}: {
  onglets: OngletMoi[]
  /** Pas de carte au-dessus : la barre arrondit aussi ses coins du haut. */
  seule?: boolean
}) {
  const [actif, setActif] = useState(onglets[0]?.id ?? '')

  return (
    <div>
      {/* LA BARRE EST LE BAS DE LA CARTE (Lucas, 17/09/2026 : « lie le tout
          dans le bloc violet, je veux un bloc »). Posée juste sous la carte
          aux coins du bas carrés, elle reprend la teinte où le dégradé de
          `.moi-carte` s'arrête : la carte et ses sections font un seul objet.
          Elle reste collée en haut pendant le défilement, et garde alors ses
          coins arrondis.

          AUCUN ÉCART AVEC LA SECTION (Lucas, 17/09/2026 : « les deux doivent
          être liés »). Le premier bloc du panneau remonte SOUS la barre
          (`.moi-section-soudee`) : ses coins blancs apparaissent dans les arrondis
          du bas de la barre, et le violet semble s'enfoncer dans la section. */}
      <div className="sticky top-[env(safe-area-inset-top)] z-20">
        <div
          role="tablist"
          aria-label="Sections du profil"
          className={cn(
            'moi-onglets grid grid-cols-3 gap-1 px-2.5 pb-2.5',
            seule ? 'rounded-3xl pt-2.5' : 'rounded-b-3xl border-t border-white/10 pt-1.5',
          )}
        >
          {onglets.map((o) => {
            const Icone = ICONES[o.id] ?? Gem
            const selectionne = o.id === actif
            return (
              <button
                key={o.id}
                type="button"
                role="tab"
                id={`moi-onglet-${o.id}`}
                aria-selected={selectionne}
                aria-controls={`moi-panneau-${o.id}`}
                onClick={() => {
                  if (selectionne) return
                  sfx.tap()
                  setActif(o.id)
                }}
                className={cn(
                  'font-heading flex min-h-10 cursor-pointer items-center justify-center gap-1.5 rounded-xl px-1 text-[13px] font-extrabold transition',
                  selectionne
                    ? 'bg-white text-primary shadow-[0_3px_0_oklch(0_0_0/0.25)]'
                    : 'text-white/75 hover:bg-white/10 active:scale-95',
                )}
              >
                <Icone className="size-4 shrink-0" strokeWidth={2.6} aria-hidden="true" />
                <span className="truncate">{o.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {onglets.map((o) => (
        <div
          key={o.id}
          role="tabpanel"
          id={`moi-panneau-${o.id}`}
          aria-labelledby={`moi-onglet-${o.id}`}
          hidden={o.id !== actif}
          className="moi-section-soudee relative flex flex-col gap-4"
        >
          {o.contenu}
        </div>
      ))}
    </div>
  )
}
