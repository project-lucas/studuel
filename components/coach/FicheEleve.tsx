import {
  formaterDerniereActivite,
  formaterDuree,
  type LigneCoach,
  type Verdict,
} from '@/lib/coach/statut'
import type { FicheEleve as Fiche } from '@/lib/coach/server'
import { cn } from '@/lib/utils'
import PastilleStatut, { LIBELLE_STATUT } from './PastilleStatut'

/**
 * LA FICHE — l'en-tête (prénom, classe, groupe, statut et ses raisons), quatre
 * chiffres, les quatre dernières semaines en barres, les matières du plus
 * faible au plus fort, les contrôles à venir. Un écran de BILAN : le feu
 * tricolore y est admis, et l'or n'y a rien à faire.
 */
export default function FicheEleve({
  fiche,
  ligne,
  verdict,
  aujourdhui,
}: {
  fiche: Fiche
  ligne: LigneCoach
  verdict: Verdict
  aujourdhui: string
}) {
  const maxSemaine = Math.max(1, ...fiche.weeks.map((w) => w.seconds))
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="flex flex-col gap-4">
        <header className="carte p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="font-heading text-3xl font-extrabold">
                {ligne.prenom}
                {ligne.pseudo ? <span className="ml-2 text-base font-bold text-muted-foreground">@{ligne.pseudo}</span> : null}
              </h1>
              <p className="mt-1 text-sm font-semibold text-muted-foreground">
                {[ligne.classe, `${ligne.groupe}${ligne.categorie && ligne.categorie !== ligne.groupe ? ` · ${ligne.categorie}` : ''}`]
                  .filter(Boolean)
                  .join(' · ')}{' '}
                · rattaché le {ligne.rattacheLe}
              </p>
            </div>
            <div className="text-right">
              <PastilleStatut statut={verdict.statut} texte className="text-sm" />
              {verdict.raisons.length > 0 ? (
                <ul className="mt-1 text-xs font-semibold text-muted-foreground">
                  {verdict.raisons.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-1 text-xs font-semibold text-muted-foreground">{LIBELLE_STATUT[verdict.statut]} cette semaine</p>
              )}
            </div>
          </div>

          <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Chiffre libelle="Dernière activité" valeur={formaterDerniereActivite(ligne.derniereActivite, aujourdhui)} alerte={verdict.statut === 'rouge'} />
            <Chiffre libelle="Temps · 7 jours" valeur={formaterDuree(fiche.week_seconds)} sous={ligne.secondes4s > 0 ? `moy. ${formaterDuree(ligne.secondes4s / 4)} / sem.` : undefined} />
            <Chiffre libelle="Jours actifs · 7 j" valeur={`${fiche.week_active_days} / 7`} />
            <Chiffre libelle="Quiz · 7 jours" valeur={String(fiche.sessions_7)} sous={`${fiche.sessions_total} au total`} />
          </dl>
        </header>

        <section className="carte p-5" aria-labelledby="semaines">
          <h2 id="semaines" className="titre-section">Les quatre dernières semaines</h2>
          <ol className="mt-4 grid grid-cols-4 items-end gap-3" aria-label="Temps de révision par semaine">
            {fiche.weeks.map((w, i) => (
              <li key={w.start} className="flex flex-col items-center gap-1.5">
                <span className="font-heading text-sm font-extrabold tabular-nums">{formaterDuree(w.seconds)}</span>
                <span className="flex h-32 w-full items-end rounded-xl bg-secondary/60 p-1" aria-hidden="true">
                  <span
                    className={cn('block w-full rounded-lg', i === fiche.weeks.length - 1 ? 'bg-primary' : 'bg-primary/55')}
                    style={{ height: `${Math.max(4, Math.round((w.seconds / maxSemaine) * 100))}%` }}
                  />
                </span>
                <span className="text-xs font-semibold text-muted-foreground">
                  {i === fiche.weeks.length - 1 ? 'cette semaine' : `sem. du ${w.start.slice(8, 10)}/${w.start.slice(5, 7)}`}
                </span>
                <span className="text-[11px] font-bold text-muted-foreground">{w.active_days} j actifs</span>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <div className="flex flex-col gap-4">
        <section className="carte p-5" aria-labelledby="matieres">
          <h2 id="matieres" className="titre-section">Scores par matière</h2>
          {fiche.per_subject.length === 0 ? (
            <p className="mt-2 text-sm font-semibold text-muted-foreground">Aucun quiz joué dans sa classe.</p>
          ) : (
            <ul className="mt-3 space-y-2.5">
              {fiche.per_subject.map((s) => {
                const pct = Math.round(s.ratio * 100)
                return (
                  <li key={s.subject}>
                    <div className="flex items-baseline justify-between text-sm">
                      <span className="font-bold">{s.subject}</span>
                      <span className={cn('font-heading font-extrabold tabular-nums', pct < 50 ? 'text-(--destructive)' : pct < 70 ? 'text-(--warning)' : 'text-(--success)')}>
                        {pct} %
                        <span className="ml-1 text-xs font-semibold text-muted-foreground">· {s.attempts} essai{s.attempts > 1 ? 's' : ''}</span>
                      </span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-secondary" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label={`${s.subject} : ${pct} %`}>
                      <div className={cn('h-full rounded-full', pct < 50 ? 'bg-(--destructive)' : pct < 70 ? 'bg-(--warning)' : 'bg-(--success)')} style={{ width: `${Math.max(3, pct)}%` }} />
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
          {fiche.avg_ratio !== null ? (
            <p className="mt-3 text-xs font-semibold text-muted-foreground">
              Moyenne toutes matières : {Math.round(fiche.avg_ratio * 100)} % (meilleur essai par quiz, dans sa classe).
            </p>
          ) : null}
        </section>

        <section className="carte p-5" aria-labelledby="controles">
          <h2 id="controles" className="titre-section">Contrôles à venir</h2>
          {fiche.controles.length === 0 ? (
            <p className="mt-2 text-sm font-semibold text-muted-foreground">Aucun contrôle annoncé.</p>
          ) : (
            <ul className="mt-2 space-y-1.5 text-sm">
              {fiche.controles.map((c) => (
                <li key={c.id} className="flex justify-between gap-2">
                  <span className="font-bold capitalize">{c.subject_slug.replace(/-/g, ' ')}</span>
                  <span className="font-semibold text-muted-foreground tabular-nums">{c.exam_date}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}

function Chiffre({ libelle, valeur, sous, alerte = false }: { libelle: string; valeur: string; sous?: string; alerte?: boolean }) {
  return (
    <div className="rounded-2xl bg-secondary/60 px-3 py-2.5">
      <dt className="text-[11px] font-extrabold tracking-wide text-muted-foreground uppercase">{libelle}</dt>
      <dd className={cn('font-heading mt-0.5 text-xl leading-tight font-extrabold', alerte && 'text-(--destructive)')}>{valeur}</dd>
      {sous ? <dd className="text-xs font-semibold text-muted-foreground">{sous}</dd> : null}
    </div>
  )
}
