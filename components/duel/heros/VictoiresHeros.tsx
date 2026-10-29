'use client'

import Image from 'next/image'
import { Check, Lock, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import GemIcon from '@/components/ui/GemIcon'
import { cn } from '@/lib/utils'
import type { CinematiqueVictoire, Heros } from '@/lib/heros/catalogue'
import { victoireDisponible } from '@/lib/heros/combat'

// LES CINÉMATIQUES DE VICTOIRE d'un héros — le rayon où l'on choisit celle qui
// se jouera au prochain K.O., et où l'on découvre celles à acheter. Chaque
// carte se regarde avant l'achat (« Voir ») : on n'achète pas une fête à
// l'aveugle. Le paiement réel (gemmes, côté serveur) n'est pas branché : la
// démo débloque sans rien débiter, et le dit.

export default function VictoiresHeros({
  heros,
  possedees,
  choisie,
  onVoir,
  onChoisir,
  onDebloquer,
}: {
  heros: Heros
  possedees: readonly string[]
  /** La cinématique équipée (id). */
  choisie: string
  onVoir: (victoire: CinematiqueVictoire) => void
  onChoisir: (id: string) => void
  /** Démo seulement : débloque sans débiter de gemmes. */
  onDebloquer: (id: string) => void
}) {
  return (
    <ul className="grid grid-cols-2 gap-3">
      {heros.victoires.map((v) => {
        const disponible = victoireDisponible(v, possedees)
        const equipee = v.id === choisie
        return (
          <li
            key={v.id}
            className={cn(
              'flex flex-col overflow-hidden rounded-2xl border-[3px] bg-card text-foreground',
              equipee ? 'border-primary' : 'border-[color-mix(in_oklab,var(--primary)_22%,var(--card))]',
            )}
          >
            <button
              type="button"
              onClick={() => onVoir(v)}
              className="relative aspect-[3/4] w-full overflow-hidden"
              aria-label={`Voir la cinématique ${v.nom}`}
            >
              <Image
                unoptimized
                src={v.tableaux[v.tableaux.length - 1].image}
                alt=""
                fill
                sizes="(max-width: 640px) 45vw, 240px"
                className="object-cover"
              />
              <span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1 bg-gradient-to-t from-[color-mix(in_oklab,var(--foreground)_75%,transparent)] to-transparent pt-6 pb-2 text-xs font-extrabold text-card">
                <Play className="size-3.5" aria-hidden="true" /> Voir
              </span>
              {!disponible ? (
                <span className="absolute top-2 right-2 grid size-7 place-items-center rounded-full bg-card text-foreground">
                  <Lock className="size-3.5" aria-hidden="true" />
                </span>
              ) : null}
            </button>
            <div className="flex flex-1 flex-col gap-2 p-2.5">
              <div>
                <p className="font-heading text-sm leading-tight font-extrabold">{v.nom}</p>
                <p className="text-[0.7rem] leading-snug text-muted-foreground">{v.devise}</p>
              </div>
              {equipee ? (
                <span className="mt-auto inline-flex h-9 items-center justify-center gap-1 rounded-full bg-primary/10 text-xs font-extrabold text-primary">
                  <Check className="size-3.5" aria-hidden="true" /> Équipée
                </span>
              ) : disponible ? (
                <Button size="sm" className="mt-auto h-9" onClick={() => onChoisir(v.id)}>
                  Équiper
                </Button>
              ) : (
                <Button
                  size="sm"
                  className="mt-auto h-9 bg-highlight text-accent-foreground hover:bg-highlight/90"
                  onClick={() => onDebloquer(v.id)}
                >
                  <GemIcon className="size-3.5" /> {v.prixGemmes}
                </Button>
              )}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
