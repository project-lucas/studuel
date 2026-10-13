import GroupesPanel from '@/components/coach/GroupesPanel'
import { lireGroupes } from '@/lib/coach/server'

export const dynamic = 'force-dynamic'

// LES GROUPES ET LEURS CODES : créer, renommer, régénérer le code, archiver.
export default async function GroupesPage() {
  const groupes = await lireGroupes()
  if (groupes === null) {
    return (
      <div className="carte p-6">
        <h1 className="titre-section">Les groupes ne sont pas encore prêts</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          La migration <code>560_coaching.sql</code> n’est pas exécutée en base.
        </p>
      </div>
    )
  }
  return <GroupesPanel groupes={groupes} />
}
