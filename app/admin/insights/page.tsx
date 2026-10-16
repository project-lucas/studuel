import { MigrationAbsente } from '@/components/console/kit/Kit'
import TableauInsights from '@/components/console/insights/TableauInsights'
import { lireInsights, periodeDepuis } from '@/lib/insights/server'

export const dynamic = 'force-dynamic'

/**
 * LES INSIGHTS DE STUDUEL (16/10/2026, migration 589) — Lucas : « les matières
 * les plus appréciées, ce qui est très utilisé, peu utilisé, ce qui doit être
 * traité ». Tout vient de ce que la base sait déjà : l'audience, l'activité,
 * l'usage de chaque fonctionnalité (par sa source d'XP), les matières, les
 * jeux, Marcel, les heures de travail, les achats. Les CONSTATS d'abord : ce
 * que Lucas doit lire en arrivant.
 */
export default async function InsightsPage({ searchParams }: { searchParams: Promise<{ j?: string }> }) {
  const { j } = await searchParams
  const jours = periodeDepuis(j, [7, 30, 90, 365], 30)
  const i = await lireInsights(jours)
  if (!i) return <MigrationAbsente fichier="589_insights_admin.sql" quoi="Le tableau des insights" />
  return <TableauInsights i={i} jours={jours} />
}
