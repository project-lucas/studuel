import { Suspense } from 'react'
import { revalidatePath } from 'next/cache'
import { ShieldAlert } from 'lucide-react'
import Messagerie from '@/components/messagerie/Messagerie'
import { MigrationAbsente } from '@/components/console/kit/Kit'
import { lireFils } from '@/lib/messagerie/server'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'

export const dynamic = 'force-dynamic'

async function traiter(formData: FormData) {
  'use server'
  const id = Number(formData.get('id'))
  if (!Number.isInteger(id)) return
  const supabase = await createClient()
  await supabase.rpc('admin_signalement_traiter', { p_id: id })
  revalidatePath('/admin/supervision')
}

/**
 * LA SUPERVISION (16/10/2026, migration 587) : des coachs recrutés écrivent à
 * des élèves mineurs. L'admin lit TOUS les fils (en lecture seule) et traite
 * les messages signalés. C'est aussi ce qui protège les coachs.
 */
export default async function SupervisionPage() {
  const supabase = await createClient()
  const [user, fils, signalements] = await Promise.all([getCurrentUser(), lireFils(true), supabase.rpc('admin_signalements')])
  if (fils === null) return <MigrationAbsente fichier="587_messagerie.sql" quoi="La supervision" />
  const liste = Array.isArray(signalements.data) ? (signalements.data as Record<string, unknown>[]) : []
  // Les fils ouverts SANS parent lié dans l'app : le coach a coché « consentement
  // écrit » ou « majeur ». À vérifier de temps en temps.
  const sansParent = fils.filter((f) => f.type === 'eleve' && (f.consentement === 'papier' || f.consentement === 'majeur'))

  return (
    <div className="flex flex-col gap-5">
      {sansParent.length ? (
        <section className="carte p-5">
          <h2 className="titre-section">Fils sans parent lié · {sansParent.length}</h2>
          <p className="mt-0.5 text-xs font-semibold text-muted-foreground">
            Ouverts sur la déclaration du coach (consentement écrit recueilli, ou élève majeur). À vérifier.
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {sansParent.map((f) => (
              <li key={f.id}>
                <a href={`/admin/supervision?fil=${f.id}`} className="inline-flex h-9 items-center gap-1.5 rounded-full bg-secondary px-3 text-xs font-bold">
                  {f.elevePrenom}
                  {f.eleveClasse ? ` · ${f.eleveClasse}` : ''} · coach {f.coachPrenom} · {f.consentement === 'majeur' ? 'majeur' : 'écrit'}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      <section className="carte p-5">
        <h2 className="titre-section flex items-center gap-2">
          <ShieldAlert className="size-5 text-(--destructive)" aria-hidden="true" />
          Messages signalés · {liste.length}
        </h2>
        {liste.length === 0 ? (
          <p className="mt-2 text-sm font-semibold text-muted-foreground">Aucun signalement à traiter.</p>
        ) : (
          <ul className="mt-3 flex flex-col gap-2">
            {liste.map((s) => (
              <li key={String(s.id)} className="flex flex-wrap items-start gap-3 rounded-2xl bg-(--destructive)/8 p-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm">« {String(s.corps ?? '') || 'Pièce jointe'} »</p>
                  <p className="mt-1 text-xs font-semibold text-muted-foreground">
                    Écrit par {String(s.auteur_prenom ?? '?')} · signalé par {String(s.par_prenom ?? '?')} : {String(s.raison ?? '')} ·{' '}
                    {new Date(String(s.cree_le)).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}
                  </p>
                </div>
                <a href={`/admin/supervision?fil=${String(s.conversation_id)}`} className="h-9 rounded-full bg-card px-3 text-xs leading-9 font-bold text-primary">
                  Voir le fil
                </a>
                <form action={traiter}>
                  <input type="hidden" name="id" value={String(s.id)} />
                  <button type="submit" className="h-9 rounded-full bg-foreground px-3 text-xs font-bold text-background">
                    Traité
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Suspense>
        <Messagerie filsInitiaux={fils} moi={user?.id ?? ''} mode="supervision" hauteur="calc(100dvh - 9rem)" />
      </Suspense>
    </div>
  )
}
