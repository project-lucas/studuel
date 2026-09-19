import Link from 'next/link'
import { Check, Sparkles } from 'lucide-react'
import CouvertureCapsule from '@/components/capsules/CouvertureCapsule'
import type { AchatCapsule, Capsule } from '@/lib/capsules'

/**
 * « MES CAPSULES », EN TÊTE DU CARNET (Lucas, 18/09/2026). Les capsules
 * achetées dans la Boutique, les jamais ouvertes d'abord (marquées
 * « Nouveau » : ce sont elles que la pastille du bouton « Mon carnet »
 * signale). Sans achat, une invitation vers la Boutique.
 */
export default function EtagereCapsules({
  etagere,
}: {
  etagere: { capsule: Capsule; achat: AchatCapsule }[]
}) {
  return (
    <section aria-labelledby="mes-capsules" className="rounded-3xl bg-card p-3 ring-1 ring-border">
      <div className="flex items-center justify-between gap-3 px-1">
        <h2 id="mes-capsules" className="font-heading text-lg font-extrabold">
          Mes capsules
        </h2>
        <Link href="/tresor#capsules" className="text-xs font-extrabold text-primary">
          Boutique
        </Link>
      </div>

      {etagere.length === 0 ? (
        <Link
          href="/tresor#capsules"
          className="press-3d mt-2 flex items-center gap-3 rounded-2xl bg-secondary p-3"
        >
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground">
            <Sparkles className="size-5" strokeWidth={2.4} aria-hidden="true" />
          </span>
          <span className="min-w-0 text-sm">
            <span className="font-heading block font-extrabold text-secondary-foreground">
              Débloque ta première capsule
            </span>
            <span className="font-semibold text-muted-foreground">
              Sommeil, argent, orientation… des mini-formations à gagner avec tes gemmes.
            </span>
          </span>
        </Link>
      ) : (
        <ul className="capsule-rayon -mx-3 mt-2 flex gap-2.5 overflow-x-auto px-3 pt-1 pb-2">
          {etagere.map(({ capsule, achat }) => (
            <li key={capsule.id} className="w-36 shrink-0 snap-start">
              <Link
                href={`/carnet/capsules/${capsule.id}`}
                className="press-3d flex h-full flex-col overflow-hidden rounded-2xl bg-background ring-1 ring-border"
              >
                <CouvertureCapsule capsule={capsule} taille="carte" className="h-24">
                  {achat.ouverteLe === null ? (
                    <span className="absolute top-2 left-2 rounded-full bg-destructive px-2 py-0.5 text-[10px] font-extrabold text-white shadow-sm">
                      Nouveau
                    </span>
                  ) : achat.termineeLe !== null ? (
                    <span className="absolute top-2 left-2 flex items-center gap-0.5 rounded-full bg-card px-2 py-0.5 text-[10px] font-extrabold text-primary shadow-sm">
                      <Check className="size-3" strokeWidth={3} aria-hidden="true" /> Terminée
                    </span>
                  ) : null}
                </CouvertureCapsule>
                <span className="line-clamp-2 p-2.5 text-sm leading-tight font-extrabold">{capsule.titre}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
