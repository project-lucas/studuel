import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Clock, GraduationCap } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PointDuJour } from '@/lib/coach/point-du-jour'

// Le point du jour : le diagnostic de Marcel, sa consigne de méthode, un seul
// bouton. Composant d'AFFICHAGE — il ne décide de rien, tout vient de
// `lib/coach/point-du-jour` (pur et testé).
//
// Le bouton porte l'ENCRE VIOLETTE sur fond crème, jamais l'or : la règle maison
// dit violet = action, or = récompense, et la seule dérogation assumée est le
// Duel de /defi (décor entièrement violet). Ici le fond de page est crème.

/** L'illustration de Marcel dépend du ton — il n'a pas la même tête tous les jours. */
const VISAGE: Record<PointDuJour['ton'], string> = {
  jour1: '/images/mascotte/reaction-bonne-1.webp',
  controle: '/images/mascotte/reaction-bonne-3.webp',
  reprise: '/images/mascotte/reaction-bonne-2.webp',
  decouverte: '/images/mascotte/reaction-bonne-1.webp',
  avance: '/images/mascotte/reaction-bonne-5.webp',
}

export default function PointDuJourHero({ point }: { point: PointDuJour }) {
  const { ton, titre, consigne, raisons, cta, href } = point

  return (
    <section
      className={cn(
        'relative overflow-hidden rounded-3xl p-4 text-white',
        // Le violet est SCULPTÉ à partir du token, pas recopié en hex : trois
        // valeurs figées (#9159ee/#6b31cd/#4d1aa2) auraient continué de vivre
        // leur vie le jour où --primary bouge.
        'bg-[radial-gradient(130%_100%_at_88%_-10%,color-mix(in_oklch,var(--highlight),transparent_70%),transparent_58%),linear-gradient(168deg,color-mix(in_oklch,var(--primary),white_10%)_0%,color-mix(in_oklch,var(--primary),black_14%)_48%,color-mix(in_oklch,var(--primary),black_30%)_100%)]',
        'shadow-[0_18px_32px_-20px_color-mix(in_oklch,var(--primary),black_34%),inset_0_1px_0_rgba(255,255,255,.3)]',
      )}
    >
      {/* Halo doré, purement décoratif — coupé si l'utilisateur demande moins
          de mouvement (cf. globals.css). */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-16 size-52 rounded-full bg-[radial-gradient(circle,color-mix(in_oklch,var(--highlight),transparent_72%),transparent_68%)]"
      />

      <div className="relative flex items-start gap-3">
        <span className="relative grid size-[74px] shrink-0 place-items-center rounded-full shadow-[inset_0_0_0_1.5px_rgba(255,255,255,.28)]">
          <Image
            src={VISAGE[ton]}
            alt=""
            width={148}
            height={148}
            priority
            className="size-full object-contain drop-shadow-[0_6px_12px_rgba(0,0,0,.35)]"
          />
        </span>

        <div className="min-w-0 flex-1 pt-0.5">
          <p className="text-highlight mb-1.5 flex items-center gap-1.5 text-[10px] font-black tracking-[.15em] uppercase">
            <GraduationCap aria-hidden="true" className="size-3" />
            Marcel · le point du jour
          </p>
          <h2 className="font-heading text-[16.5px] leading-[1.3] font-bold text-balance">
            {titre}
          </h2>
          {consigne && (
            <p className="mt-2 text-[12.5px] leading-snug font-semibold text-white/85">
              {consigne}
            </p>
          )}
        </div>
      </div>

      {raisons.length > 0 && (
        <ul className="relative mt-3 flex flex-wrap gap-1.5">
          {raisons.map((raison) => (
            <li
              key={raison.key}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10.5px] font-extrabold',
                raison.urgent
                  ? 'bg-destructive text-white'
                  : 'bg-white/15 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,.16)]',
              )}
            >
              {raison.urgent && <Clock aria-hidden="true" className="size-3" />}
              {raison.label}
            </li>
          ))}
        </ul>
      )}

      {href ? (
        <Link
          href={href}
          className="font-heading text-primary relative mt-3.5 flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(180deg,var(--card),color-mix(in_oklch,var(--background),white_58%))] px-4 text-base font-extrabold shadow-[0_4px_0_color-mix(in_oklch,var(--primary),black_44%),0_8px_16px_-8px_rgba(0,0,0,.55)] transition-transform active:translate-y-0.5 active:shadow-[0_2px_0_color-mix(in_oklch,var(--primary),black_44%)]"
        >
          {cta}
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      ) : (
        // Rien à lancer : on ne fabrique pas un bouton mort, on le dit.
        <p className="relative mt-3.5 rounded-2xl bg-white/12 px-4 py-3 text-center text-[13px] font-bold text-white/90 shadow-[inset_0_0_0_1.5px_rgba(255,255,255,.28)]">
          Ta série est déjà validée aujourd’hui.
        </p>
      )}
    </section>
  )
}
