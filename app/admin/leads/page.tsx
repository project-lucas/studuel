import { createClient } from '@/lib/supabase/server'
import { compterPar, contactables, estSuperieur, LIBELLE_PROFIL, type SiteLead } from '@/lib/site-leads'

export const dynamic = 'force-dynamic'

// LES DEMANDES DU SITE STUDUEL (16/10/2026, migration 593) : les fiches
// offertes (« 10 fiches sur la matière de ton choix ») et les inscriptions
// « être prévenu » des filières du supérieur. L'admin seul lit (RLS).
const LIGNES_LUES = 1000

const formatDate = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'short', timeStyle: 'short', timeZone: 'Europe/Paris' })

function Tableau({ titre, lignes }: { titre: string; lignes: { cle: string; n: number }[] }) {
  return (
    <section className="carte p-5">
      <h2 className="titre-section text-lg">{titre}</h2>
      {lignes.length === 0 ? (
        <p className="mt-2 text-sm text-muted-foreground">Rien pour l’instant.</p>
      ) : (
        <ul className="mt-3 space-y-1.5 text-sm">
          {lignes.slice(0, 12).map((l) => (
            <li key={l.cle} className="flex justify-between gap-3">
              <span>{l.cle}</span>
              <span className="font-extrabold text-primary">{l.n}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default async function AdminLeadsPage() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('site_leads')
    .select('id, cree_le, email, profil, classe, matiere, nouvelles, source')
    .order('cree_le', { ascending: false })
    .limit(LIGNES_LUES)
    .returns<SiteLead[]>()

  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="font-heading text-3xl font-extrabold">Fiches offertes</h1>
        <p className="rounded-2xl border border-dashed p-6 text-sm text-muted-foreground">
          La liste ne répond pas ({error.code ?? 'erreur'}) : la migration <strong>593</strong> (<code>schema/593_site_fiches_offertes.sql</code>) n’est sans doute pas exécutée.
        </p>
      </div>
    )
  }

  const lignes = data ?? []
  const fiches = lignes.filter((l) => !estSuperieur(l))
  const sup = lignes.filter(estSuperieur)
  const emails = contactables(lignes)

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-heading text-3xl font-extrabold">Fiches offertes et supérieur</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {fiches.length} demande{fiches.length > 1 ? 's' : ''} de fiches · {sup.length} inscription{sup.length > 1 ? 's' : ''} au supérieur · {emails.length} contact
          {emails.length > 1 ? 's' : ''} qui accepte{emails.length > 1 ? 'nt' : ''} les nouvelles
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Tableau titre="Matières demandées" lignes={compterPar(fiches, (l) => `${l.matiere} · ${l.classe}`)} />
        <Tableau titre="Profils" lignes={compterPar(lignes, (l) => LIBELLE_PROFIL[l.profil])} />
        <Tableau titre="Classes" lignes={compterPar(fiches, (l) => l.classe)} />
        <Tableau titre="Filières du supérieur" lignes={compterPar(sup, (l) => l.matiere.replace(/^sup-/, ''))} />
      </div>

      {emails.length > 0 ? (
        <details className="carte p-5">
          <summary className="cursor-pointer font-bold">Les e-mails qui acceptent les nouvelles ({emails.length})</summary>
          <p className="mt-3 text-sm break-all text-muted-foreground">{emails.join(', ')}</p>
        </details>
      ) : null}

      <section className="carte overflow-x-auto p-5">
        <h2 className="titre-section text-lg">Les dernières demandes</h2>
        <table className="mt-3 w-full min-w-[40rem] text-left text-sm">
          <thead className="text-xs text-muted-foreground uppercase">
            <tr>
              <th className="py-2">Date</th>
              <th>E-mail</th>
              <th>Profil</th>
              <th>Classe</th>
              <th>Demande</th>
              <th>Nouvelles</th>
            </tr>
          </thead>
          <tbody>
            {lignes.slice(0, 200).map((l) => (
              <tr key={l.id} className="border-t">
                <td className="py-2 whitespace-nowrap">{formatDate.format(new Date(l.cree_le))}</td>
                <td className="break-all">{l.email}</td>
                <td>{LIBELLE_PROFIL[l.profil]}</td>
                <td>{l.classe}</td>
                <td>{estSuperieur(l) ? `Supérieur : ${l.matiere.replace(/^sup-/, '')}` : `Fiches de ${l.matiere}`}</td>
                <td>{l.nouvelles ? 'Oui' : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}
