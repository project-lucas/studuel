import Link from 'next/link'
import { Dumbbell, Map, Mic, Repeat, TriangleAlert } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { subjectInitials } from '@/lib/subject-style'
import { REGIMES, seanceFor, type Regime } from '@/lib/coach/regimes'
import type { MatiereSuivie } from '@/lib/coach/marcel-server'
import SeanceCard from './SeanceCard'

// « On ne révise pas l'histoire comme les maths » — l'écran qui le prouve.
//
// Le régime est porté par l'ICÔNE et le nom, pas par une couleur inventée : la
// DA n'a que quatre rôles sémantiques (violet = action, jaune = récompense,
// corail = alerte) et fabriquer quatre teintes de régime en dur les diluerait.

const ICONE: Record<Regime, LucideIcon> = {
  pratique: Dumbbell,
  restitution: Map,
  expression: Mic,
  langue: Repeat,
}

/** Durée de la séance type présentée en exemple. */
const DEMO_MINUTES = 10

export default function MethodePanel({
  matieres,
  courante,
}: {
  matieres: MatiereSuivie[]
  courante: MatiereSuivie | null
}) {
  if (matieres.length === 0) {
    return (
      <p className="bg-card text-muted-foreground rounded-[20px] p-5 text-center text-[13px] leading-relaxed font-semibold">
        Choisis tes matières dans Réviser, et je te dirai comment on travaille
        chacune d’elles.
      </p>
    )
  }

  const regime = courante?.regime ?? null
  const spec = regime === null ? null : REGIMES[regime]
  const Icone = regime === null ? null : ICONE[regime]

  return (
    <div>
      {/* Le sélecteur de matière : des liens, l'état vit dans l'URL. */}
      <nav aria-label="Matière" className="mb-2.5 flex gap-1.5 overflow-x-auto pb-0.5">
        {matieres.map((matiere) => {
          const active = matiere.slug === courante?.slug
          return (
            <Link
              key={matiere.slug}
              href={`/marcel?vue=methode&matiere=${matiere.slug}`}
              aria-current={active ? 'true' : undefined}
              className={cn(
                'font-heading flex h-11 min-w-11 shrink-0 items-center justify-center rounded-xl px-3 text-xs font-extrabold transition-colors',
                active
                  ? 'bg-foreground text-background shadow-[0_2px_0_rgba(0,0,0,.25)]'
                  : 'bg-card text-muted-foreground shadow-[0_2px_0_rgba(36,48,79,.07)]',
              )}
              title={matiere.name}
            >
              {subjectInitials(matiere.slug, matiere.name)}
            </Link>
          )
        })}
      </nav>

      {spec && Icone && courante && regime !== null ? (
        <>
          <section className="from-primary relative overflow-hidden rounded-[20px] bg-gradient-to-b to-[color-mix(in_oklch,var(--primary),black_26%)] p-3.5 text-white shadow-[0_14px_26px_-20px_color-mix(in_oklch,var(--primary),transparent_5%),inset_0_1px_0_rgba(255,255,255,.28)]">
            <p className="flex items-center gap-1.5 text-[10px] font-black tracking-[.15em] text-white/80 uppercase">
              <Icone aria-hidden="true" className="size-3.5" />
              Régime · {spec.name}
            </p>
            <h2 className="font-heading mt-1 mb-2 text-[19px] font-extrabold">
              {courante.name}
            </h2>
            <p className="text-[12.5px] leading-snug text-white/95">
              « {spec.marcel} »
            </p>
            <p className="mt-2.5 flex items-center gap-2 border-t border-white/20 pt-2.5 text-[11.5px] font-extrabold">
              Ce que je mesure : {spec.mesure}
            </p>
          </section>

          <SeanceCard etapes={seanceFor(regime, DEMO_MINUTES)} minutes={DEMO_MINUTES} />

          <section className="bg-destructive/12 mt-3 flex items-start gap-2.5 rounded-[17px] p-3">
            <TriangleAlert
              aria-hidden="true"
              className="text-destructive mt-0.5 size-4 shrink-0"
            />
            <p className="text-[12px] leading-snug font-semibold text-[color-mix(in_oklch,var(--destructive),black_35%)]">
              <b className="font-extrabold">Le piège :</b> {spec.piege}
            </p>
          </section>
        </>
      ) : (
        // Matière hors doctrine : Marcel se tait plutôt que de dire une bêtise.
        <p className="bg-card text-muted-foreground rounded-[20px] p-5 text-center text-[13px] leading-relaxed font-semibold">
          Sur cette matière, je n’ai pas de méthode à te donner — elle se
          travaille ailleurs qu’ici, et je préfère me taire que dire une bêtise.
        </p>
      )}
    </div>
  )
}
