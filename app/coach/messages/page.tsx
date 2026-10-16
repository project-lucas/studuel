import { Suspense } from 'react'
import Messagerie from '@/components/messagerie/Messagerie'
import type { EleveChoix } from '@/components/messagerie/NouvelleConversation'
import { lireFils } from '@/lib/messagerie/server'
import { lireTableau } from '@/lib/coach/server'
import { lireSuiviTableau } from '@/lib/coach/suivi-server'
import { getCurrentUser } from '@/lib/supabase/user'
import { ouvrirFilAction, resumerFilAction } from './actions'

export const dynamic = 'force-dynamic'

// LES CONVERSATIONS DU COACH (migration 587) : élèves, parents, trios.
export default async function MessagesCoachPage() {
  const [user, fils, lignes, suivi] = await Promise.all([getCurrentUser(), lireFils(false), lireTableau(), lireSuiviTableau()])

  if (fils === null) {
    return (
      <div className="carte p-6">
        <h1 className="titre-section">La messagerie n’est pas encore prête</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          La migration <code>587_messagerie.sql</code> n’est pas exécutée en base.
        </p>
      </div>
    )
  }

  const eleves: EleveChoix[] = (lignes ?? []).map((l) => ({
    id: l.eleveId,
    prenom: l.prenom,
    classe: l.classe,
    groupe: l.groupe,
    parentLie: suivi?.get(l.eleveId)?.parentLie ?? false,
  }))

  return (
    <Suspense>
      <Messagerie
        filsInitiaux={fils}
        moi={user?.id ?? ''}
        mode="coach"
        eleves={eleves}
        hauteur="calc(100dvh - 7rem)"
        resumer={resumerFilAction}
        ouvrirFil={ouvrirFilAction}
      />
    </Suspense>
  )
}
