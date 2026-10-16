import { Barres, Bloc, MigrationAbsente, Periode, Tuile } from '@/components/console/kit/Kit'
import { dureeCourte, libellePage } from '@/lib/insights/insights'
import { lireUsage, periodeDepuis } from '@/lib/insights/server'

export const dynamic = 'force-dynamic'

const nf = (n: number) => n.toLocaleString('fr-FR')
const APPAREIL: Record<string, string> = { mobile: 'Téléphone', tablette: 'Tablette', ordinateur: 'Ordinateur', '?': 'Inconnu' }

/**
 * L'USAGE DES ÉCRANS (16/10/2026, migration 590) : ce que la base ne voit pas —
 * les écrans ouverts, le temps qu'on y passe, les recherches qui ne trouvent
 * rien, les appareils. Le journal ne commence qu'avec le déploiement de la 590.
 */
export default async function UsagePage({ searchParams }: { searchParams: Promise<{ j?: string }> }) {
  const { j } = await searchParams
  const jours = periodeDepuis(j, [1, 7, 30, 90], 7)
  const u = await lireUsage(jours)
  if (!u) return <MigrationAbsente fichier="590_evenements_app.sql" quoi="Le journal d’usage" />

  const peuVues = [...u.pages].filter((p) => p.vues > 0).sort((a, b) => a.vues - b.vues).slice(0, 10)
  const longues = [...u.pages].filter((p) => p.vues >= 5).sort((a, b) => b.tempsMedianS - a.tempsMedianS).slice(0, 10)
  const totalAppareils = u.appareils.reduce((s, a) => s + a.n, 0)

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-muted-foreground">
          {u.total ? `${nf(u.total)} événements` : 'Aucun événement encore'}
          {u.depuis ? ` · journal ouvert le ${new Date(u.depuis).toLocaleDateString('fr-FR')}` : ''}
        </p>
        <Periode chemin="/admin/usage" jours={jours} choix={[1, 7, 30, 90]} />
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Tuile libelle="Sessions" valeur={nf(u.sessions.n)} sous={`${nf(u.sessions.connectees)} connectées`} />
        <Tuile libelle="Écrans par session" valeur={String(u.sessions.pagesMoy).replace('.', ',')} />
        <Tuile libelle="Durée médiane" valeur={dureeCourte(u.sessions.dureeMedianeS)} sous="temps écran visible" />
        <Tuile
          libelle="Appareils"
          valeur={totalAppareils ? `${Math.round(((u.appareils.find((a) => a.appareil === 'mobile')?.n ?? 0) / totalAppareils) * 100)} %` : '—'}
          sous="sur téléphone"
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Bloc titre="Les écrans les plus vus" aide="Vues, visiteurs uniques et temps médian passé (écran visible).">
          <Barres
            lignes={u.pages.slice(0, 20).map((p) => ({
              cle: p.page,
              libelle: libellePage(p.page),
              valeur: p.vues,
              sous: `${nf(p.visiteurs)} visiteurs · ${dureeCourte(p.tempsMedianS)} médian · ${p.page}`,
            }))}
            vide="Le journal se remplit dès que l’app est utilisée avec la 590 déployée."
          />
        </Bloc>
        <div className="flex flex-col gap-5">
          <Bloc titre="Recherches sans résultat" aide="Ce que les élèves cherchent et ne trouvent pas : du contenu qui manque, ou un mot qu’on n’attendait pas.">
            {u.recherchesVides.length === 0 ? (
              <p className="text-sm font-semibold text-muted-foreground">Aucune sur la période.</p>
            ) : (
              <ul className="flex flex-wrap gap-2">
                {u.recherchesVides.map((r) => (
                  <li key={r.texte} className="rounded-full bg-secondary px-3 py-1 text-sm font-bold" title={libellePage(r.ou)}>
                    {r.texte} <span className="text-muted-foreground tabular-nums">× {r.n}</span>
                  </li>
                ))}
              </ul>
            )}
          </Bloc>
          <Bloc titre="Où l’on reste longtemps" aide="Temps médian, écrans vus au moins 5 fois.">
            <Barres lignes={longues.map((p) => ({ cle: p.page, libelle: libellePage(p.page), valeur: p.tempsMedianS, affiche: dureeCourte(p.tempsMedianS) }))} />
          </Bloc>
          <Bloc titre="Peu visités" aide="Les écrans vus le moins souvent sur la période.">
            <Barres lignes={peuVues.map((p) => ({ cle: p.page, libelle: libellePage(p.page), valeur: p.vues }))} />
          </Bloc>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Bloc titre="Appareils">
          <Barres lignes={u.appareils.map((a) => ({ cle: a.appareil, libelle: APPAREIL[a.appareil] ?? a.appareil, valeur: a.n, affiche: `${nf(a.n)} sessions` }))} />
        </Bloc>
        <Bloc titre="Gestes notés" aide="Les boutons et actions suivis par l’app.">
          <Barres lignes={u.gestes.slice(0, 20).map((g) => ({ cle: `${g.nom}-${g.cible}`, libelle: g.cible ? `${g.nom} · ${g.cible}` : g.nom, valeur: g.n, sous: `${nf(g.visiteurs)} visiteurs` }))} />
        </Bloc>
      </div>
    </div>
  )
}
