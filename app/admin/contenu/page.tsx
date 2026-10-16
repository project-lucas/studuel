import Link from 'next/link'
import { Bloc, MigrationAbsente } from '@/components/console/kit/Kit'
import { graviteQuestion } from '@/lib/insights/insights'
import { lireATraiter } from '@/lib/insights/server'
import { cn } from '@/lib/utils'

export const dynamic = 'force-dynamic'

const GRAVITE = {
  critique: { libelle: 'Probablement fausse', classe: 'bg-(--destructive)/10 text-(--destructive)' },
  haute: { libelle: 'Très difficile', classe: 'bg-(--warning)/15 text-(--warning)' },
  moyenne: { libelle: 'Difficile', classe: 'bg-secondary text-muted-foreground' },
} as const

/**
 * CE QUI DOIT ÊTRE TRAITÉ (16/10/2026, migration 589) : la liste de travail
 * des mises à jour. Les questions que presque tous ratent (souvent une
 * question fausse ou ambiguë), les quiz aux scores les plus bas, les chapitres
 * que personne n'a jamais ouverts, les erreurs de la semaine.
 */
export default async function ContenuATraiterPage() {
  const a = await lireATraiter()
  if (!a) return <MigrationAbsente fichier="589_insights_admin.sql" quoi="La liste « À traiter »" />

  const totalMuets = a.chapitresMuets.reduce((s, c) => s + c.muets, 0)

  return (
    <div className="flex flex-col gap-5">
      <Bloc
        titre="Questions les plus ratées"
        aide="Part des élèves qui ont joué le quiz et ont cette question dans « À revoir ». Au-delà de 70 %, la question est souvent fausse, ambiguë ou hors programme (5 joueurs au moins)."
      >
        {a.questions.length === 0 ? (
          <p className="text-sm font-semibold text-muted-foreground">Pas encore assez de parties pour juger.</p>
        ) : (
          <div className="-mx-5 overflow-x-auto px-5">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="border-b text-left text-xs font-extrabold tracking-wide text-muted-foreground uppercase">
                  <th className="py-2 pr-3">Question</th>
                  <th className="py-2 pr-3">Quiz</th>
                  <th className="py-2 pr-3 text-right">Échec</th>
                  <th className="py-2">Verdict</th>
                </tr>
              </thead>
              <tbody>
                {a.questions.map((q) => {
                  const g = GRAVITE[graviteQuestion(q.taux)]
                  return (
                    <tr key={q.id} className="border-b border-primary/5 align-top">
                      <td className="py-2.5 pr-3 font-semibold">{q.question}</td>
                      <td className="py-2.5 pr-3 text-xs font-semibold text-muted-foreground">
                        {q.quiz}
                        <span className="block">{[q.matiere, q.classe].filter(Boolean).join(' · ')}</span>
                      </td>
                      <td className="py-2.5 pr-3 text-right font-heading font-extrabold tabular-nums">
                        {Math.round(q.taux * 100)} %<span className="block text-[11px] font-semibold text-muted-foreground">{q.eleves} / {q.joueurs}</span>
                      </td>
                      <td className="py-2.5">
                        <span className={cn('rounded-full px-2.5 py-1 text-xs font-bold whitespace-nowrap', g.classe)}>{g.libelle}</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Bloc>

      <div className="grid gap-5 xl:grid-cols-2">
        <Bloc titre="Quiz aux scores les plus bas" aide="Score moyen de toutes les sessions, 10 sessions au moins.">
          {a.quizBas.length === 0 ? (
            <p className="text-sm font-semibold text-muted-foreground">Aucun quiz n’a encore 10 sessions.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {a.quizBas.map((q) => (
                <li key={q.quizId} className="flex items-center gap-3 rounded-xl bg-secondary/50 px-3 py-2">
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold">{q.quiz}</span>
                    <span className="block text-xs font-semibold text-muted-foreground">
                      {[q.matiere, q.classe].filter(Boolean).join(' · ')} · {q.sessions} sessions · {q.eleves} élèves
                    </span>
                  </span>
                  <span className={cn('font-heading text-lg font-extrabold tabular-nums', q.score < 0.5 ? 'text-(--destructive)' : 'text-(--warning)')}>{Math.round(q.score * 100)} %</span>
                </li>
              ))}
            </ul>
          )}
        </Bloc>

        <Bloc titre="Erreurs de la semaine" aide="Les pannes les plus fréquentes remontées par l’app." action={{ href: '/admin/erreurs', libelle: 'Tout voir' }}>
          {a.erreurs.length === 0 ? (
            <p className="text-sm font-semibold text-(--success)">Aucune erreur cette semaine.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {a.erreurs.map((e) => (
                <li key={e.message} className="rounded-xl bg-secondary/50 px-3 py-2">
                  <p className="line-clamp-2 font-mono text-xs">{e.message}</p>
                  <p className="mt-1 text-xs font-semibold text-muted-foreground">
                    {e.n} fois · {e.eleves} élève(s) · dernière le {new Date(e.dernier).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Bloc>
      </div>

      <Bloc titre={`Chapitres jamais ouverts · ${totalMuets.toLocaleString('fr-FR')}`} aide="Par matière et par classe : aucune leçon lue depuis le début. Contenu introuvable, mal rangé, ou matière peu choisie.">
        <div className="-mx-5 overflow-x-auto px-5">
          <table className="w-full min-w-[680px] text-sm">
            <thead>
              <tr className="border-b text-left text-xs font-extrabold tracking-wide text-muted-foreground uppercase">
                <th className="py-2 pr-3">Matière</th>
                <th className="py-2 pr-3">Classe</th>
                <th className="py-2 pr-3 text-right">Jamais ouverts</th>
                <th className="py-2">Exemples</th>
              </tr>
            </thead>
            <tbody>
              {a.chapitresMuets.slice(0, 80).map((c) => (
                <tr key={`${c.matiere}-${c.classe}`} className="border-b border-primary/5 align-top">
                  <td className="py-2 pr-3 font-bold">{c.matiere}</td>
                  <td className="py-2 pr-3">{c.classe}</td>
                  <td className="py-2 pr-3 text-right font-heading font-extrabold tabular-nums">
                    {c.muets} <span className="text-xs font-semibold text-muted-foreground">/ {c.total}</span>
                  </td>
                  <td className="py-2 text-xs text-muted-foreground">{c.exemples.join(' · ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs font-semibold text-muted-foreground">
          Pour corriger une question ou un cours : <Link href="/admin" className="font-bold text-primary underline">Studio de contenu</Link>.
        </p>
      </Bloc>
    </div>
  )
}
