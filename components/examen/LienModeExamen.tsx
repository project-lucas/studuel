import Link from 'next/link'
import { ChevronRight, GraduationCap } from 'lucide-react'
import { compteARebours, examenDe, joursAvantExamen, phaseDe } from '@/lib/examen/parcours'
import { toDayKey } from '@/lib/streak'

/**
 * LA PORTE DU MODE EXAMEN sur l'accueil Réviser (15/10/2026) : une seule ligne,
 * seulement en 3e, 1re et Terminale — « Le brevet · J-252 · Les fondations ».
 * Le compte à rebours et la phase disent à l'élève où il en est sans qu'il ait
 * à le demander ; le détail est dans l'onglet Examen du bureau de Marcel.
 */
export default function LienModeExamen({ classe }: { classe: string | null }) {
  const examen = examenDe(classe)
  if (!examen) return null
  const jours = joursAvantExamen(examen, toDayKey(new Date()))
  if (jours < 0) return null
  const phase = phaseDe(jours)
  return (
    <Link
      href="/marcel?onglet=examen"
      className="carte flex min-h-14 items-center gap-3 px-3.5 py-2.5 transition active:translate-y-px"
      aria-label={`Mode examen : ${examen.nom}, ${compteARebours(jours)}, phase ${phase.titre}`}
    >
      <span className="bg-secondary text-primary grid size-10 shrink-0 place-items-center rounded-2xl">
        <GraduationCap aria-hidden="true" className="size-5" strokeWidth={2.4} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="font-heading block text-[15px] leading-tight font-extrabold">
          {examen.nom} · {compteARebours(jours)}
        </span>
        <span className="text-muted-foreground block truncate text-xs font-semibold">
          {phase.titre} — ton chemin jusqu’au jour J
        </span>
      </span>
      <ChevronRight aria-hidden="true" className="text-muted-foreground size-5 shrink-0" />
    </Link>
  )
}
