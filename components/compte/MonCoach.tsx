import Link from 'next/link'
import { MessageCircle, Target, Users } from 'lucide-react'
import { avanceeDepuis, objectifDepuis, progressionObjectif } from '@/lib/coach/suivi'
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
  const [{ data, error }, suiviRes] = await Promise.all([supabase.rpc('mon_rattachement'), supabase.rpc('mon_suivi_coach')])
  if (error) return null
  const r = data && typeof data === 'object' ? (data as Rattachement) : null
  // L'objectif de la semaine et les messages (591) : absents tant que la migration manque.
  const suivi = !suiviRes.error && suiviRes.data && typeof suiviRes.data === 'object' ? (suiviRes.data as Record<string, unknown>) : null
  const objectif = objectifDepuis(suivi?.objectif)
  const progression = progressionObjectif(objectif, avanceeDepuis(suivi?.avancee))
  const nonLus = Number(suivi?.non_lus ?? 0) || 0
  const fils = Number(suivi?.fils ?? 0) || 0

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
          {objectif ? (
            <div className="mt-3 rounded-2xl bg-secondary/60 p-3">
              <p className="flex items-center gap-1.5 text-sm font-extrabold">
                <Target className="size-4 text-primary" aria-hidden="true" />
                {progression.atteint ? 'Objectif de la semaine atteint !' : 'Ton objectif de la semaine'}
              </p>
              {objectif.message ? <p className="mt-1 text-sm italic">« {objectif.message} »</p> : null}
              <ul className="mt-2 flex flex-col gap-2">
                {progression.lignes.map((l) => (
                  <li key={l.cle}>
                    <div className="flex justify-between text-xs font-bold">
                      <span>{l.libelle}</span>
                      <span className="tabular-nums">{l.fait} / {l.cible}</span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-card">
                      <div className={l.atteint ? 'h-full rounded-full bg-(--success)' : 'h-full rounded-full bg-primary'} style={{ width: `${Math.round(l.part * 100)}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {fils > 0 ? (
            <Link href="/messages" className="font-heading mt-3 flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-extrabold text-primary-foreground">
              <MessageCircle className="size-4" aria-hidden="true" />
              {nonLus > 0 ? `${nonLus} nouveau${nonLus > 1 ? 'x' : ''} message${nonLus > 1 ? 's' : ''} de ton coach` : 'Messages avec ton coach'}
            </Link>
          ) : null}
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
