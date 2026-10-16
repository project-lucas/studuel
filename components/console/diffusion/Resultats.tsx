import { agregerResultats, LIBELLE_QUESTION, type AnnonceAuteur, type Question, type ReponseBrute } from '@/lib/annonces/annonces'

/** Les résultats d'un sondage, question par question (barres, moyenne, réponses libres). */
export default function Resultats({
  annonce,
  questions,
  reponses,
  anonyme,
}: {
  annonce: AnnonceAuteur | null
  questions: Question[]
  reponses: ReponseBrute[]
  anonyme: boolean
}) {
  const resultats = agregerResultats(questions, reponses)
  return (
    <section className="flex flex-col gap-4" aria-label="Résultats du sondage">
      <div className="carte flex flex-wrap items-end gap-6 p-5">
        <div className="min-w-0 flex-1">
          <p className="surtitre">Sondage</p>
          <h2 className="font-heading text-2xl font-extrabold">{annonce?.titre ?? 'Résultats'}</h2>
          {anonyme ? <p className="mt-1 text-xs font-semibold text-muted-foreground">Anonyme : les prénoms ne sont pas montrés.</p> : null}
        </div>
        <Chiffre valeur={reponses.length} libelle="réponses" />
        {annonce ? <Chiffre valeur={annonce.vues} libelle="vues" /> : null}
        {annonce && annonce.vues > 0 ? <Chiffre valeur={`${Math.round((reponses.length / annonce.vues) * 100)} %`} libelle="taux de réponse" /> : null}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {resultats.map((r, i) => (
          <article key={r.question.id} className="carte p-5">
            <p className="surtitre">
              Question {i + 1} · {LIBELLE_QUESTION[r.question.type]} · {r.repondants} réponse{r.repondants > 1 ? 's' : ''}
            </p>
            <h3 className="font-heading mt-1 text-lg font-extrabold">{r.question.libelle}</h3>
            {r.type === 'choix' || r.type === 'multiple' ? (
              <ul className="mt-3 flex flex-col gap-2">
                {[...r.options].sort((a, b) => b.n - a.n).map((o) => (
                  <li key={o.option}>
                    <div className="flex justify-between text-sm font-bold">
                      <span>{o.option}</span>
                      <span className="tabular-nums">
                        {o.n} · {Math.round(o.part * 100)} %
                      </span>
                    </div>
                    <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-secondary">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${Math.round(o.part * 100)}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            ) : r.type === 'note' ? (
              <div className="mt-3 flex items-end gap-6">
                <p className="font-heading text-5xl font-extrabold text-primary tabular-nums">{r.moyenne ?? '—'}<span className="text-xl text-muted-foreground"> / 5</span></p>
                <div className="flex h-20 flex-1 items-end gap-2">
                  {r.repartition.map((n, k) => {
                    const max = Math.max(1, ...r.repartition)
                    return (
                      <div key={k} className="flex flex-1 flex-col items-center gap-1">
                        <div className="w-full rounded-t-md bg-primary/80" style={{ height: `${Math.max(4, (n / max) * 64)}px` }} title={`${n} × ${k + 1}`} />
                        <span className="text-xs font-bold text-muted-foreground">{k + 1}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : r.type === 'texte' ? (
              <ul className="mt-3 flex max-h-80 flex-col gap-2 overflow-y-auto">
                {r.textes.length === 0 ? <li className="text-sm text-muted-foreground">Aucune réponse.</li> : null}
                {r.textes.map((t, k) => (
                  <li key={k} className="rounded-xl bg-secondary/60 px-3 py-2 text-sm">
                    <p className="whitespace-pre-wrap">{t.texte}</p>
                    <p className="mt-1 text-xs font-semibold text-muted-foreground">{[t.prenom, t.classe].filter(Boolean).join(' · ') || 'Anonyme'}</p>
                  </li>
                ))}
              </ul>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  )
}

function Chiffre({ valeur, libelle }: { valeur: number | string; libelle: string }) {
  return (
    <div className="text-right">
      <p className="font-heading text-3xl leading-none font-extrabold text-primary tabular-nums">{valeur}</p>
      <p className="mt-1 text-xs font-bold text-muted-foreground uppercase">{libelle}</p>
    </div>
  )
}
