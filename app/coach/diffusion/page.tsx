import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import Compositeur from '@/components/console/diffusion/Compositeur'
import Historique from '@/components/console/diffusion/Historique'
import Resultats from '@/components/console/diffusion/Resultats'
import { lireAnnoncesAuteur, lireResultats } from '@/lib/annonces/server'
import { lireGroupes } from '@/lib/coach/server'
import { lireRolesConsole } from '@/lib/console/server'

export const dynamic = 'force-dynamic'

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// LA DIFFUSION ET LES SONDAGES (migration 588) : rédiger, choisir le public,
// suivre la portée, lire les résultats d'un sondage (`?annonce=`).
export default async function DiffusionPage({ searchParams }: { searchParams: Promise<{ type?: string; annonce?: string }> }) {
  const { type, annonce } = await searchParams
  const [roles, annonces, groupes] = await Promise.all([lireRolesConsole(), lireAnnoncesAuteur(), lireGroupes()])

  if (annonces === null) {
    return (
      <div className="carte p-6">
        <h1 className="titre-section">La diffusion n’est pas encore prête</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          La migration <code>588_annonces_sondages.sql</code> n’est pas exécutée en base.
        </p>
      </div>
    )
  }

  if (annonce && UUID.test(annonce)) {
    const res = await lireResultats(annonce)
    return (
      <div className="flex flex-col gap-4">
        <Link href="/coach/diffusion" className="inline-flex w-fit items-center gap-1.5 text-sm font-bold text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" aria-hidden="true" /> Diffusion
        </Link>
        {res ? (
          <Resultats annonce={annonces.find((a) => a.id === annonce) ?? null} questions={res.questions} reponses={res.reponses} anonyme={res.anonyme} />
        ) : (
          <p className="carte p-6 text-sm text-muted-foreground">Ce sondage n’existe pas, ou il n’est pas à toi.</p>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <Compositeur
        key={type === 'sondage' ? 'sondage' : 'message'}
        admin={roles.admin}
        groupes={(groupes ?? []).filter((g) => g.archiveLe === null).map((g) => ({ id: g.id, nom: g.nom }))}
        typeInitial={type === 'sondage' ? 'sondage' : 'message'}
      />
      <section className="flex flex-col gap-3">
        <h2 className="titre-section">{roles.admin ? 'Tous les envois' : 'Mes envois'}</h2>
        <Historique annonces={annonces} admin={roles.admin} />
      </section>
    </div>
  )
}
