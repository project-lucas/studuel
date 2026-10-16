import GestionCoachs, { type CoachLigne } from '@/components/console/coachs/GestionCoachs'
import { MigrationAbsente } from '@/components/console/kit/Kit'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'

export const dynamic = 'force-dynamic'

// LES COACHS (16/10/2026, migration 591) : nommer, voir la charge, retirer.
export default async function CoachsPage() {
  const supabase = await createClient()
  const [user, { data, error }] = await Promise.all([getCurrentUser(), supabase.rpc('admin_coachs')])
  if (error) return <MigrationAbsente fichier="591_coach_suivi.sql" quoi="La gestion des coachs" />

  const coachs: CoachLigne[] = (Array.isArray(data) ? data : []).map((r) => {
    const x = r as Record<string, unknown>
    const n = (v: unknown) => Number(v ?? 0) || 0
    return {
      id: String(x.id),
      prenom: typeof x.prenom === 'string' ? x.prenom : null,
      email: typeof x.email === 'string' ? x.email : null,
      admin: x.admin === true,
      groupes: n(x.groupes),
      eleves: n(x.eleves),
      inactifs7: n(x.eleves_inactifs_7),
      messages7: n(x.messages_7),
      filsEnAttente: n(x.fils_en_attente),
      derniereConnexion: typeof x.derniere_connexion === 'string' ? x.derniere_connexion : null,
    }
  })

  return <GestionCoachs coachs={coachs} moi={user?.id ?? ''} />
}
