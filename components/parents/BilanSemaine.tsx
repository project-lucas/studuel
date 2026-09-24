import Link from 'next/link'
import { ArrowRight, Lightbulb, MessageSquareHeart } from 'lucide-react'
import type { BilanSemaine as Bilan, Geste } from '@/lib/parents-bilan'

/**
 * Le bilan de la semaine et les gestes du parent — en tête de la carte de
 * chaque enfant, AVANT les chiffres.
 *
 * POURQUOI EN TÊTE. Un parent ouvre cet écran une fois par semaine et le lit
 * dix secondes. Les six blocs de chiffres en dessous répondent à « combien ? » ;
 * ce bloc-ci répond à « ça va ? » (le bilan, en phrases) et à « qu'est-ce que
 * je fais ? » (deux ou trois gestes, chacun relié à la fiche qui l'explique).
 * C'est ce qui fait d'un tableau de bord un coach.
 *
 * Le ton colore le liseré : jaune solaire quand il y a de quoi féliciter,
 * corail quand il faut agir, violet sinon — des rôles de la charte, jamais
 * un jugement en rouge sur un enfant.
 */
export default function BilanSemaine({
  bilan,
  gestes,
  conseilsHref,
}: {
  bilan: Bilan
  gestes: Geste[]
  /** Le volet Conseils, où chaque geste renvoie à sa fiche. */
  conseilsHref: string
}) {
  const liseré =
    bilan.ton === 'bravo'
      ? 'border-highlight bg-highlight/[0.08]'
      : bilan.ton === 'attention'
        ? 'border-destructive/40 bg-destructive/[0.04]'
        : 'border-primary/25 bg-primary/[0.04]'

  return (
    <section className={`carte mb-5 border-2 p-4 ${liseré}`} aria-label="Bilan de la semaine">
      <h4 className="font-heading flex items-center gap-1.5 text-sm font-extrabold">
        <MessageSquareHeart className="text-primary size-4" strokeWidth={2.4} aria-hidden="true" />
        Cette semaine
      </h4>
      <p className="mt-1.5 text-[15px] leading-relaxed">
        {bilan.phrases.map((p, i) => (
          <span key={i}>
            {i > 0 ? ' ' : ''}
            {i === 0 ? <span className="font-semibold">{p}</span> : p}
          </span>
        ))}
      </p>

      {gestes.length > 0 ? (
        <>
          <h5 className="titre-section mt-4 mb-1.5 flex items-center gap-1.5">
            <Lightbulb className="size-3.5" strokeWidth={2.6} aria-hidden="true" />
            Ce que vous pouvez faire
          </h5>
          <ul className="flex flex-col gap-2">
            {gestes.map((g, i) => (
              <li key={g.id} className="flex items-start gap-2.5 text-sm">
                <span className="bg-primary text-primary-foreground mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold">
                  {i + 1}
                </span>
                <span className="min-w-0">
                  {g.texte}{' '}
                  <Link
                    href={`${conseilsHref}#conseil-${g.conseilId}`}
                    className="text-primary inline-flex items-center gap-0.5 font-semibold whitespace-nowrap underline-offset-4 hover:underline"
                  >
                    Pourquoi
                    <ArrowRight className="size-3" aria-hidden="true" />
                  </Link>
                </span>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </section>
  )
}
