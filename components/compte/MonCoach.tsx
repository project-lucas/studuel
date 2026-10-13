import { Users } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import MonCoachFormulaires from './MonCoachFormulaires'

type Rattachement = {
  groupe_id: string
  nom: string
  categorie: string | null
  coach: string
  rattache_le: string
}

/**
 * « MON COACH » (Mon compte, 13/10/2026) — ce que l'élève voit de son
 * rattachement : le groupe, le coach, depuis quand, ce que le coach voit, et
 * « Quitter le groupe ». Sans rattachement : le champ du code (le même que
 * « J'ai un code » de l'onboarding). Rien tant que la migration 560 n'est pas
 * passée : la carte ne s'affiche pas.
 */
export default async function MonCoach() {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('mon_rattachement')
  if (error) return null
  const r = data && typeof data === 'object' ? (data as Rattachement) : null

  return (
    <section aria-label="Mon coach" className="carte mx-auto mt-4 w-full max-w-md p-4">
      <h2 className="titre-section flex items-center gap-2">
        <Users className="size-5 text-primary" aria-hidden="true" />
        Mon coach
      </h2>
      {r ? (
        <>
          <p className="mt-2 text-sm">
            Tu es dans le groupe <strong>{r.nom}</strong>
            {r.categorie && r.categorie !== r.nom ? ` (${r.categorie})` : ''} de{' '}
            <strong>{r.coach}</strong>, depuis le {r.rattache_le.slice(8, 10)}/{r.rattache_le.slice(5, 7)}/{r.rattache_le.slice(0, 4)}.
          </p>
          <p className="mt-1 text-xs font-semibold text-muted-foreground">
            Ton coach voit tes jours d’activité, ton temps de révision, tes scores par matière et
            tes contrôles à venir — pas tes amis, ni tes achats, ni ton avatar.
          </p>
        </>
      ) : (
        <p className="mt-2 text-sm text-muted-foreground">
          Si un coach te suit, saisis le code de son groupe.
        </p>
      )}
      <MonCoachFormulaires rattache={r !== null} />
    </section>
  )
}
