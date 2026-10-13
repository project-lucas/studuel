import Link from 'next/link'
import TableauCoach from '@/components/coach/TableauCoach'
import { juger } from '@/lib/coach/statut'
import { aujourdhuiUtc, lireGroupes, lireTableau } from '@/lib/coach/server'

export const dynamic = 'force-dynamic'

// LE TABLEAU — tous les élèves de tous mes groupes, en UNE lecture
// (`coach_tableau`), jugés ici (lib/coach/statut) : les décrochés en tête.
export default async function CoachPage() {
  const [lignes, groupes] = await Promise.all([lireTableau(), lireGroupes()])

  if (lignes === null || groupes === null) {
    return (
      <div className="carte p-6">
        <h1 className="titre-section">Le tableau n’est pas encore prêt</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          La migration <code>560_coaching.sql</code> n’est pas exécutée en base : les groupes,
          les codes et le tableau arrivent avec elle.
        </p>
      </div>
    )
  }

  const aujourdhui = aujourdhuiUtc()
  const actifs = groupes.filter((g) => g.archiveLe === null)

  if (actifs.length === 0) {
    return (
      <div className="carte p-6">
        <h1 className="titre-section">Commence par un groupe</h1>
        <p className="mt-2 max-w-prose text-sm text-muted-foreground">
          Crée un groupe (U15, U17… ou un seul pour tout le centre) : il porte un code à huit
          caractères. Un joueur qui le saisit sur « J’ai un code » à l’inscription arrive ici tout
          seul, dès son premier jour.
        </p>
        <Link
          href="/coach/groupes"
          className="font-heading mt-4 inline-flex h-11 items-center rounded-full bg-primary px-6 text-sm font-extrabold text-primary-foreground"
        >
          Créer mon premier groupe
        </Link>
      </div>
    )
  }

  return (
    <TableauCoach
      lignes={juger(lignes, aujourdhui)}
      groupes={actifs.map((g) => ({ id: g.id, nom: g.nom, categorie: g.categorie }))}
      aujourdhui={aujourdhui}
    />
  )
}
