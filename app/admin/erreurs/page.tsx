import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { compterDepuis, resumerErreurs, type LigneErreur, type SourceErreur } from '@/lib/erreurs'
import { viderErreursAction } from './actions'

export const dynamic = 'force-dynamic'

// LE JOURNAL DES ERREURS (12/10/2026) : ce qui casse chez les élèves, groupé
// par erreur — « 40 fois, 12 élèves, surtout sur /reviser » —, puis les
// dernières lignes une à une. Lu dans `erreurs_app` (migration 559) : les
// 300 dernières lignes, l'admin seul y a droit (RLS).
const LIGNES_LUES = 300
const DERNIERES_AFFICHEES = 60
const HEURE = 3_600_000

const formatDate = new Intl.DateTimeFormat('fr-FR', {
  dateStyle: 'short',
  timeStyle: 'short',
  timeZone: 'Europe/Paris',
})

const LIBELLE_SOURCE: Record<SourceErreur, string> = {
  navigateur: 'navigateur',
  serveur: 'serveur',
}

function depuis(iso: string, maintenant: Date): string {
  const minutes = Math.max(0, Math.round((maintenant.getTime() - new Date(iso).getTime()) / 60_000))
  if (minutes < 1) return 'à l’instant'
  if (minutes < 60) return `il y a ${minutes} min`
  const heures = Math.round(minutes / 60)
  if (heures < 48) return `il y a ${heures} h`
  return `il y a ${Math.round(heures / 24)} j`
}

export default async function AdminErreursPage() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('erreurs_app')
    .select('id, cree_le, source, user_id, message, nom, pile, url, digest, contexte, navigateur')
    .order('cree_le', { ascending: false })
    .limit(LIGNES_LUES)
    .returns<LigneErreur[]>()

  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="font-heading text-3xl font-extrabold">Erreurs remontées</h1>
        <p className="rounded-2xl border border-dashed p-6 text-sm text-muted-foreground">
          Le journal ne répond pas ({error.code ?? 'erreur'}) : la migration <strong>559</strong>{' '}
          (<code>schema/559_erreurs_app.sql</code>) n’est sans doute pas exécutée.
        </p>
      </div>
    )
  }

  const lignes = data ?? []
  const maintenant = new Date()
  const groupes = resumerErreurs(lignes)
  const sur24h = compterDepuis(lignes, new Date(maintenant.getTime() - 24 * HEURE))
  const sur7j = compterDepuis(lignes, new Date(maintenant.getTime() - 7 * 24 * HEURE))
  const plafondAtteint = lignes.length >= LIGNES_LUES

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-extrabold">Erreurs remontées</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {lignes.length === 0
              ? 'Aucune erreur dans le journal.'
              : `${sur24h} sur 24 h · ${sur7j} sur 7 jours · ${lignes.length} ligne${lignes.length > 1 ? 's' : ''} lue${lignes.length > 1 ? 's' : ''}${plafondAtteint ? ` (les ${LIGNES_LUES} dernières)` : ''}`}
          </p>
        </div>
        {lignes.length > 0 ? (
          <form action={viderErreursAction}>
            <Button type="submit" variant="destructive" size="sm">
              Vider le journal
            </Button>
          </form>
        ) : null}
      </header>

      {groupes.length > 0 ? (
        <section className="space-y-3">
          <h2 className="titre-section">Par erreur</h2>
          <ul className="space-y-3">
            {groupes.map((g) => (
              <li key={g.cle} className="carte p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="min-w-0 flex-1 font-semibold break-words">{g.message}</p>
                  <span className="bg-secondary text-primary shrink-0 rounded-full px-2.5 py-0.5 text-sm font-extrabold">
                    ×{g.nombre}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {g.nom ? `${g.nom} · ` : ''}
                  {g.sources.map((s) => LIBELLE_SOURCE[s]).join(' + ')} ·{' '}
                  {g.eleves === 0 ? 'anonyme' : `${g.eleves} élève${g.eleves > 1 ? 's' : ''}`} · dernière{' '}
                  {depuis(g.derniere, maintenant)}
                  {g.nombre > 1 ? ` · première ${formatDate.format(new Date(g.premiere))}` : ''}
                </p>
                {g.urls.length > 0 ? (
                  <p className="mt-1 truncate text-xs text-muted-foreground">{g.urls.join(' · ')}</p>
                ) : null}
                <details className="mt-2 text-xs">
                  <summary className="cursor-pointer text-primary">Détail de la dernière</summary>
                  <dl className="mt-2 space-y-1 text-muted-foreground">
                    {g.exemple.digest ? (
                      <div>
                        <dt className="inline font-semibold">digest :</dt>{' '}
                        <dd className="inline font-mono">{g.exemple.digest}</dd>
                      </div>
                    ) : null}
                    {g.exemple.contexte && Object.keys(g.exemple.contexte).length > 0 ? (
                      <div>
                        <dt className="inline font-semibold">contexte :</dt>{' '}
                        <dd className="inline font-mono break-all">{JSON.stringify(g.exemple.contexte)}</dd>
                      </div>
                    ) : null}
                    {g.exemple.navigateur ? (
                      <div>
                        <dt className="inline font-semibold">navigateur :</dt>{' '}
                        <dd className="inline break-all">{g.exemple.navigateur}</dd>
                      </div>
                    ) : null}
                  </dl>
                  {g.exemple.pile ? (
                    <pre className="mt-2 max-h-64 overflow-auto rounded-xl bg-muted p-3 font-mono text-[11px] leading-snug whitespace-pre-wrap break-all">
                      {g.exemple.pile}
                    </pre>
                  ) : null}
                </details>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {lignes.length > 0 ? (
        <section className="space-y-3">
          <h2 className="titre-section">Les dernières, une à une</h2>
          <ul className="carte divide-y">
            {lignes.slice(0, DERNIERES_AFFICHEES).map((l) => (
              <li key={l.id} className="px-4 py-2.5 text-sm">
                <div className="flex items-baseline gap-2">
                  <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                    {formatDate.format(new Date(l.cree_le))}
                  </span>
                  <span className="bg-muted shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
                    {LIBELLE_SOURCE[l.source]}
                  </span>
                  <span className="min-w-0 flex-1 truncate font-medium">{l.message}</span>
                </div>
                {l.url ? <p className="mt-0.5 truncate text-xs text-muted-foreground">{l.url}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  )
}
