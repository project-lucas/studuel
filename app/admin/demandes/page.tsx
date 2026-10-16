import { Mail, Phone } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { compterParStatut, LIBELLE_STATUT, statutSuivant, trierDemandes, type DemandeScolaria, type StatutDemande } from '@/lib/scolaria/demandes'
import { changerStatutDemandeAction } from './actions'

export const dynamic = 'force-dynamic'

// LES DEMANDES DE BILAN DU SITE SCOLARIA (16/10/2026, migration 592) : chaque
// parent qui remplit le formulaire de scolaria.fr arrive ici. Les nouvelles
// d'abord (la plus ancienne en tête : elle attend depuis le plus longtemps),
// un bouton pour avancer (« Marquer contactée », « Clore »), une note libre.
// L'admin seul lit la table (RLS).
const LIGNES_LUES = 300

const formatDate = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Europe/Paris' })

const LIBELLE_BOUTON: Record<StatutDemande, string> = {
  nouvelle: 'Rouvrir',
  contactee: 'Marquer contactée',
  close: 'Clore',
}

const TON_STATUT: Record<StatutDemande, string> = {
  nouvelle: 'bg-highlight/30 text-foreground',
  contactee: 'bg-secondary text-secondary-foreground',
  close: 'bg-muted text-muted-foreground',
}

export default async function AdminDemandesPage() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('scolaria_demandes')
    .select('id, cree_le, parent_nom, email, telephone, eleve_prenom, classe, besoin, message, creneaux, source, statut, note, traitee_le')
    .order('cree_le', { ascending: false })
    .limit(LIGNES_LUES)
    .returns<DemandeScolaria[]>()

  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="font-heading text-3xl font-extrabold">Demandes de bilan</h1>
        <p className="rounded-2xl border border-dashed p-6 text-sm text-muted-foreground">
          La liste ne répond pas ({error.code ?? 'erreur'}) : la migration <strong>592</strong> (<code>schema/592_scolaria_demandes.sql</code>) n’est sans doute pas exécutée.
        </p>
      </div>
    )
  }

  const demandes = trierDemandes(data ?? [])
  const compte = compterParStatut(demandes)

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-heading text-3xl font-extrabold">Demandes de bilan</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {demandes.length === 0
            ? 'Aucune demande pour l’instant. Elles arrivent du formulaire de scolaria.fr.'
            : `${compte.nouvelle} à rappeler · ${compte.contactee} contactée${compte.contactee > 1 ? 's' : ''} · ${compte.close} close${compte.close > 1 ? 's' : ''}`}
        </p>
      </header>

      <ul className="space-y-4">
        {demandes.map((d) => {
          const suivant = statutSuivant(d.statut)
          return (
            <li key={d.id} className="carte p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-heading text-lg font-extrabold">
                    {d.parent_nom}
                    {d.eleve_prenom || d.classe ? (
                      <span className="font-sans text-base font-semibold text-muted-foreground">
                        {' '}
                        · {[d.eleve_prenom, d.classe].filter(Boolean).join(', ')}
                      </span>
                    ) : null}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {formatDate.format(new Date(d.cree_le))}
                    {d.source ? ` · depuis ${d.source}` : ''}
                  </p>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-sm font-extrabold ${TON_STATUT[d.statut]}`}>{LIBELLE_STATUT[d.statut]}</span>
              </div>

              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm">
                <a href={`mailto:${d.email}?subject=${encodeURIComponent('Votre demande de bilan Scolaria')}`} className="inline-flex items-center gap-1.5 font-semibold text-primary">
                  <Mail className="size-4" aria-hidden="true" /> {d.email}
                </a>
                {d.telephone ? (
                  <a href={`tel:${d.telephone.replace(/[^0-9+]/g, '')}`} className="inline-flex items-center gap-1.5 font-semibold text-primary">
                    <Phone className="size-4" aria-hidden="true" /> {d.telephone}
                  </a>
                ) : null}
              </div>

              <dl className="mt-3 space-y-1 text-sm">
                {d.besoin ? (
                  <div>
                    <dt className="inline font-semibold">Besoin :</dt> <dd className="inline">{d.besoin}</dd>
                  </div>
                ) : null}
                {d.creneaux ? (
                  <div>
                    <dt className="inline font-semibold">Disponibilités :</dt> <dd className="inline">{d.creneaux}</dd>
                  </div>
                ) : null}
              </dl>
              {d.message ? <p className="mt-2 rounded-xl bg-muted/60 p-3 text-sm whitespace-pre-wrap">{d.message}</p> : null}

              <form action={changerStatutDemandeAction} className="mt-4 flex flex-wrap items-end gap-2">
                <input type="hidden" name="id" value={d.id} />
                <label className="min-w-0 flex-1 text-xs font-semibold text-muted-foreground">
                  Note
                  <input name="note" defaultValue={d.note ?? ''} placeholder="Appelée le…, rappeler après…" className="mt-1 block h-10 w-full rounded-xl border bg-background px-3 text-sm font-normal text-foreground" />
                </label>
                {suivant ? (
                  <Button type="submit" name="statut" value={suivant} size="sm">
                    {LIBELLE_BOUTON[suivant]}
                  </Button>
                ) : (
                  <Button type="submit" name="statut" value="nouvelle" size="sm" variant="outline">
                    {LIBELLE_BOUTON.nouvelle}
                  </Button>
                )}
                <Button type="submit" name="statut" value={d.statut} size="sm" variant="outline">
                  Enregistrer la note
                </Button>
              </form>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
