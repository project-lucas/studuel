import { scorePercent, subjectState, subjectStateLabel } from '@/lib/parents'
import type { SubjectRow } from '@/lib/parents-suivi'

/**
 * Le score par matière — TOUTES les matières, de la plus fragile à la mieux
 * tenue.
 *
 * POURQUOI CE CHANGEMENT. L'écran n'affichait que « les trois matières à
 * renforcer ». Trois faiblesses présentées seules donnent d'un enfant qui va
 * bien le portrait d'un enfant en difficulté : le parent ne voyait jamais
 * l'ensemble, donc jamais la proportion. Un élève à 14 de moyenne avec trois
 * matières à 11 lisait la même carte qu'un élève en décrochage.
 *
 * FEU TRICOLORE ET NON VIOLET/JAUNE. Même dérogation, et pour la même raison,
 * que le tableau Progrès de Marcel (`components/marcel/ProgresPanel.tsx`,
 * actée dans CLAUDE.md) : sur un écran de BILAN, le jaune de la récompense se
 * lit comme une alarme de plus à côté du corail, et « maîtrisé » en violet ne
 * se distingue plus d'un bouton d'action. `success` → `warning` → `destructive`
 * sont des rôles existants de la charte, pas des couleurs inventées.
 *
 * Les matières trop peu travaillées pour être jugées restent dans la liste, en
 * fin de tri et signalées : les cacher ferait croire qu'elles n'ont pas été
 * abordées — c'est faux, et c'est justement là qu'un parent peut agir.
 */
export default function MatieresSuivi({ rows }: { rows: SubjectRow[] }) {
  if (rows.length === 0) {
    return (
      <section>
        <h4 className="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">
          Par matière
        </h4>
        <p className="text-muted-foreground rounded-xl border border-dashed p-3.5 text-sm">
          Aucun quiz passé pour l’instant — les matières apparaîtront ici dès les
          premiers exercices.
        </p>
      </section>
    )
  }

  return (
    <section>
      <h4 className="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">
        Par matière
      </h4>
      <ul className="flex flex-col gap-2.5">
        {rows.map((row) => {
          const pct = scorePercent(row.ratio)
          return (
            <li key={row.subject} className="flex items-center gap-3">
              <span className="w-24 shrink-0 truncate text-sm font-medium sm:w-32">
                {row.subject}
              </span>

              <span className="bg-muted h-2 flex-1 overflow-hidden rounded-full">
                {row.judgeable ? (
                  <span
                    className={`block h-full rounded-full ${BAR[subjectState(row.ratio)]}`}
                    style={{ width: `${Math.max(pct, 3)}%` }}
                  />
                ) : (
                  // Pas de barre pour une matière non jugeable : dessiner un
                  // pourcentage assis sur un seul quiz, c'est afficher du bruit
                  // avec l'autorité d'une mesure.
                  <span className="bg-muted-foreground/25 block h-full w-full rounded-full" />
                )}
              </span>

              <span
                className={`w-24 shrink-0 text-right text-xs font-medium ${
                  row.judgeable ? TEXT[subjectState(row.ratio)] : 'text-muted-foreground'
                }`}
              >
                {row.judgeable ? (
                  <>
                    <span className="tabular-nums">{pct} %</span>
                    <span className="text-muted-foreground block text-[10px] leading-tight">
                      {subjectStateLabel(row.ratio)}
                    </span>
                  </>
                ) : (
                  <span className="text-[10px] leading-tight">
                    Trop peu d’exercices
                  </span>
                )}
              </span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

const BAR = {
  fragile: 'bg-destructive',
  en_cours: 'bg-warning',
  maitrise: 'bg-success',
} as const

// Les aplats passent tels quels ; le TEXTE, non. Le corail et le vert de la
// charte ne font que 3,5:1 sur blanc — lisibles en barre, insuffisants en
// petits caractères. On les assombrit exactement comme le fait le tableau
// Progrès de Marcel, qui a déjà tranché ce point : même DA, même correction,
// pas une deuxième règle de contraste dans le projet.
const TEXT = {
  fragile: 'text-[color-mix(in_oklch,var(--destructive),black_20%)]',
  en_cours: 'text-warning',
  maitrise: 'text-[color-mix(in_oklch,var(--success),black_20%)]',
} as const
