import { cn } from '@/lib/utils'
import { compteARebours, PHASES, type IdPhase, type Phase } from '@/lib/examen/parcours'
import { pourcent } from '@/lib/examen/onglet'

const ORDRE: IdPhase[] = ['fondations', 'entrainement', 'sprint', 'derniers-jours']

/**
 * « OÙ J’EN SUIS ? » — la tête de l’onglet Examen (maquette 1) : le compte à
 * rebours, l’examen, l’anneau « prêt à 31 % » (chapitres maîtrisés, sujets
 * tombés faits, épreuve blanche, dossier d’oral) et les quatre étapes jusqu’au
 * jour J, avec « tu es ici ». La plaque cerclée d’or : le mode examen est un
 * pilier de Studuel+, et l’or en est l’identité.
 */
export default function HerosExamen({
  nom,
  periode,
  jours,
  phase,
  preparation,
}: {
  nom: string
  periode: string
  jours: number
  phase: Phase
  preparation: number
}) {
  const p = pourcent(preparation)
  return (
    <section
      aria-labelledby="examen-compte"
      className="rounded-carte bg-card shadow-carte p-3.5 ring-2 ring-[color-mix(in_oklch,var(--highlight),white_35%)]"
      style={{ backgroundImage: 'linear-gradient(160deg, var(--card) 55%, color-mix(in oklch, var(--highlight), white 78%))' }}
    >
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p id="examen-compte" className="font-heading text-[42px] leading-[0.95] font-extrabold tracking-tight tabular-nums">
            {compteARebours(jours)}
          </p>
          <p className="font-heading mt-1 text-[15px] leading-tight font-extrabold">
            {nom} · vers {periode.split(' (')[0]}
          </p>
          <p className="text-muted-foreground text-[11px] font-semibold">La date officielle se publie à l’automne.</p>
        </div>
        <div
          role="img"
          aria-label={`Prêt à ${p} %`}
          className="relative grid size-[82px] shrink-0 place-items-center rounded-full"
          style={{ background: `conic-gradient(var(--primary) ${p}%, var(--secondary) 0)` }}
        >
          <span className="bg-card absolute inset-[8px] rounded-full" />
          <span className="font-heading text-primary relative text-center text-[21px] leading-none font-extrabold">
            {p} %
            <span className="text-muted-foreground mt-0.5 block font-sans text-[9.5px] font-extrabold">prêt</span>
          </span>
        </div>
      </div>

      {phase.id !== 'apres' ? (
        <ol className="mt-5 grid grid-cols-4 gap-1" aria-label="Le chemin jusqu’au jour J">
          {ORDRE.map((id) => {
            const ici = id === phase.id
            return (
              <li
                key={id}
                aria-current={ici ? 'step' : undefined}
                className={cn(
                  'relative rounded-[10px] px-0.5 py-1.5 text-center text-[10.5px] leading-tight font-extrabold',
                  ici ? 'bg-highlight text-accent-foreground' : 'bg-secondary text-primary',
                )}
              >
                {ici ? (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-[9px] whitespace-nowrap text-[color-mix(in_oklch,var(--highlight),black_35%)]">
                    tu es ici
                  </span>
                ) : null}
                {PHASES[id].court}
              </li>
            )
          })}
        </ol>
      ) : null}
      <p className="text-muted-foreground mt-2 text-[12px] leading-snug font-semibold">{phase.regle}</p>
    </section>
  )
}
