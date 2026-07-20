import { Coins } from 'lucide-react'
import type { WorkLevel } from '@/lib/work-level'

// Barre du haut de l'onglet Moi (maquette « miroir motivant ») : à gauche le
// niveau de travail avec sa mini barre de progression, à droite le solde de
// pièces et le mini-avatar. Purement affichage — tout est calculé côté page.
export default function MoiTopBar({
  level,
  coins,
  avatarUri,
}: {
  level: WorkLevel
  coins: number
  avatarUri: string
}) {
  const pct = Math.round(level.progress * 100)

  return (
    <div className="flex items-center justify-between gap-2">
      <div
        className="flex items-center gap-2 rounded-full bg-white py-1.5 pr-3 pl-1.5 shadow-sm ring-1 ring-black/5"
        aria-label={`Niveau ${level.level} — ${pct} % vers le niveau suivant`}
      >
        <span className="flex size-7 items-center justify-center rounded-full bg-primary font-mono text-sm font-extrabold text-primary-foreground tabular-nums">
          {level.level}
        </span>
        <div>
          <p className="text-[11px] leading-none font-extrabold tracking-wide text-foreground">
            NIVEAU {level.level}
          </p>
          <div className="mt-1 flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className="moi-track block h-1.5 w-16 overflow-hidden rounded-full"
            >
              <span
                className="block h-full rounded-full bg-primary"
                style={{ width: `${pct}%` }}
              />
            </span>
            <span className="text-[10px] leading-none font-bold text-muted-foreground tabular-nums">
              {pct}%
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span
          className="flex items-center gap-1.5 rounded-full bg-white px-3 py-2 shadow-sm ring-1 ring-black/5"
          aria-label={`${coins} pièces`}
        >
          <Coins className="size-4 text-highlight" strokeWidth={2.4} aria-hidden="true" />
          <span className="font-mono text-sm font-extrabold text-foreground tabular-nums">
            {coins}
          </span>
        </span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={avatarUri}
          alt="Mon avatar"
          className="size-10 rounded-full bg-white shadow-sm ring-2 ring-white"
        />
      </div>
    </div>
  )
}
