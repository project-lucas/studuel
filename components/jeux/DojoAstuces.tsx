import { ChevronRight, Lightbulb } from 'lucide-react'
import { ASTUCES_CATALOGUE, type AstuceFiche } from '@/lib/jeux/calcul-astuces'

const FAMILLES: AstuceFiche['famille'][] = [
  'Tables',
  'Additions',
  'Soustractions',
  'Pourcentages',
  'Priorités',
]

/**
 * LE DOJO DES ASTUCES — sur la carte du jeu Calcul mental, sous la collection
 * d'étoiles : toutes les méthodes pour aller plus vite, rangées par famille,
 * avec un exemple calculé par le MÊME code que celui qui souffle l'astuce en
 * partie (`lib/jeux/calcul-astuces`). Le dojo ne peut donc pas dire autre
 * chose que le jeu.
 *
 * L'EXEMPLE D'ABORD, LA RÈGLE ENSUITE (Lucas, 22/09/2026). Chaque fiche s'ouvre
 * sur l'opération et son résultat, en grand ; dessous, la méthode en chips
 * enchaînées par des flèches (« 63 − 30 = 33 › 33 + 1 = 34 ») ; la phrase de
 * règle vient en dernier, quand l'exemple a déjà tout montré. Une méthode se
 * lit comme une suite de petits calculs, pas comme un paragraphe.
 *
 * Replié par famille (`<details>` natif) : trente-deux fiches ouvertes d'un
 * bloc feraient un mur ; cinq lignes se parcourent en trois secondes, et on
 * ouvre celle qui coince.
 */
export default function DojoAstuces() {
  return (
    <section
      aria-labelledby="dojo-astuces-titre"
      className="mb-5 rounded-3xl bg-card p-4 shadow-sm ring-1 ring-black/5"
    >
      <h2 id="dojo-astuces-titre" className="font-heading flex items-center gap-2 text-lg font-extrabold">
        <span className="bg-highlight text-foreground flex size-8 items-center justify-center rounded-xl">
          <Lightbulb className="size-4" strokeWidth={2.6} aria-hidden="true" />
        </span>
        Le dojo des astuces
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Calculer vite, ça s’apprend : {ASTUCES_CATALOGUE.length} méthodes, et
        le jeu te souffle la bonne après chaque réponse.
      </p>
      <ul className="mt-3 flex flex-col gap-2">
        {FAMILLES.map((famille) => {
          const fiches = ASTUCES_CATALOGUE.filter((f) => f.famille === famille)
          return (
            <li key={famille}>
              <details className="group rounded-2xl bg-background ring-1 ring-black/5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3">
                  <span className="font-heading font-bold">{famille}</span>
                  <span className="text-muted-foreground flex items-center gap-1 text-xs font-bold">
                    {fiches.length} astuce{fiches.length > 1 ? 's' : ''}
                    <ChevronRight
                      className="size-3.5 transition-transform group-open:rotate-90"
                      aria-hidden="true"
                    />
                  </span>
                </summary>
                <ol className="flex flex-col gap-2 border-t px-3 pt-3 pb-3">
                  {fiches.map((f) => (
                    <li key={f.id} className="rounded-2xl bg-card p-3 shadow-sm ring-1 ring-black/5">
                      <Fiche fiche={f} />
                    </li>
                  ))}
                </ol>
              </details>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

function Fiche({ fiche }: { fiche: AstuceFiche }) {
  const derniere = fiche.etapes.length - 1
  return (
    <>
      {/* 1. L'exemple : l'opération et son résultat, en grand. */}
      <p className="font-heading flex items-baseline justify-between gap-3 text-lg leading-none font-extrabold tabular-nums">
        <span>{fiche.operation}</span>
        <span aria-label={`égale ${fiche.resultat}`}>= {fiche.resultat}</span>
      </p>

      {/* 2. La méthode, étape par étape — des chips reliées par des flèches ;
             la dernière porte le résultat, en jaune. */}
      <ol className="mt-2.5 flex flex-wrap items-center gap-y-1.5" aria-label="Étapes">
        {fiche.etapes.map((etape, i) => (
          <li key={i} className="flex items-center">
            <span
              className={
                i === derniere
                  ? 'rounded-lg bg-highlight/30 px-2 py-1 font-mono text-[13px] font-bold tabular-nums'
                  : 'rounded-lg bg-muted px-2 py-1 font-mono text-[13px] font-bold tabular-nums'
              }
            >
              {etape}
            </span>
            {i < derniere ? (
              <ChevronRight className="text-muted-foreground mx-0.5 size-4 shrink-0" aria-hidden="true" />
            ) : null}
          </li>
        ))}
      </ol>

      {/* 3. La règle, après l'exemple. */}
      <p className="mt-2 text-sm text-muted-foreground">{fiche.regle}</p>
    </>
  )
}
