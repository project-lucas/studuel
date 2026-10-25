import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  LogOut,
  BadgeCheck,
  Compass,
  HeartHandshake,
  Users,
  Wrench,
} from 'lucide-react'
import BasculeStuduelPlus from '@/components/compte/BasculeStuduelPlus'
import { Button } from '@/components/ui/button'
import SoundToggle from '@/components/ui/SoundToggle'
import EnTetePage from '@/components/reviser/EnTetePage'
import NotificationsOptIn from '@/components/NotificationsOptIn'
import GradeSelector from '@/components/GradeSelector'
import MonCoach from '@/components/compte/MonCoach'
import SupprimerCompte from '@/components/compte/SupprimerCompte'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { signOut } from '@/app/login/actions'
import { GRADE_LEVELS, type GradeLevel } from '@/lib/types'
import { gradeLabel } from '@/lib/grades'

export const metadata = { title: 'Mon compte — Studuel' }
export const dynamic = 'force-dynamic'

// Noms COMMERCIAUX des paliers, alignés sur lib/premium.ts (PLANS). L'app
// disait « Offre 1 » ici et « Studuel+ » sur l'écran de conversion, pour le
// même abonnement : l'élève ne pouvait pas faire le lien entre ce qu'on lui
// vend et ce qu'il possède. `tier1`/`tier2`/`tier3` restent les identifiants
// techniques, jamais montrés.
const TIER_LABELS: Record<string, string> = {
  free: 'Gratuit',
  tier1: 'Studuel+',
  tier2: 'Studuel+',
  tier3: 'Studuel+ Famille',
}

export default async function ComptePage() {
  const supabase = await createClient()
  const user = await getCurrentUser()

  if (!user) redirect('/login')

  // select('*') : tolère une base où la migration 028 (is_admin) n'est pas
  // encore passée — la colonne manquante ne casse pas la page.
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle<{
      full_name: string | null
      subscription_tier: string | null
      grade_level: string | null
      daily_goal: number | null
      is_admin?: boolean
      profile_type?: string | null
    }>()

  const tier = profile?.subscription_tier ?? 'free'
  // Un coach (560) ou un admin : l'espace coach, et la bascule Studuel+ pour
  // vérifier les deux faces de l'app avec un seul compte (561). Miroir de
  // `est_coach()`.
  const coach = profile?.is_admin === true || profile?.profile_type === 'coach'
  // Classe courante validée contre la liste fermée (null si non renseignée).
  const gradeLevel: GradeLevel | null = GRADE_LEVELS.includes(
    profile?.grade_level as GradeLevel,
  )
    ? (profile!.grade_level as GradeLevel)
    : null

  return (
    <div>
      {/* Une page à retour : l'en-tête commun (EnTetePage), et chaque bloc est
          une `.carte` à titre de section — plus de Card shadcn à pied beige
          ni de carte « jouet » à liseré violet au milieu (chantier
          d'homogénéité, 24/09/2026). */}
      <EnTetePage retour={{ fallback: '/moi' }} titre="Mon compte" />

      {/* Coach ou admin : l'interrupteur Studuel+ en tête des réglages, pour
          passer librement d'une face de l'app à l'autre (561). */}
      {coach ? <BasculeStuduelPlus actif={tier !== 'free'} /> : null}

      <section aria-label="Mon profil" className="carte mx-auto w-full max-w-md p-4">
        <h2 className="titre-section truncate">{profile?.full_name || user.email}</h2>
        <p className="mt-0.5 truncate text-sm font-semibold text-muted-foreground">{user.email}</p>
        <div className="mt-3 space-y-2 text-sm">
          <p className="flex items-center gap-2">
            <BadgeCheck className="size-4 text-primary" aria-hidden="true" />
            Abonnement : <strong>{TIER_LABELS[tier] ?? tier}</strong>
          </p>
          <p className="text-muted-foreground">
            {profile?.grade_level
              ? `Classe : ${gradeLabel(profile.grade_level) ?? profile.grade_level} · Objectif : ${profile.daily_goal ?? 1} session${(profile.daily_goal ?? 1) > 1 ? 's' : ''}/jour`
              : 'Classe non renseignée'}{' '}
            —{' '}
            <Link
              href="/onboarding"
              className="-my-2 inline-block px-1 py-2 font-medium text-primary underline underline-offset-4"
            >
              modifier
            </Link>
          </p>
          <p>
            <Link
              href="/plus"
              className="-my-2 inline-block py-2 font-medium text-primary underline underline-offset-4"
            >
              {tier === 'free' ? 'Ce que comprend Studuel+' : 'Mon Studuel+ : rente, Marcel, mode examen'}
            </Link>
          </p>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <form action={signOut}>
            <Button variant="outline" type="submit">
              <LogOut className="size-4" /> Se déconnecter
            </Button>
          </form>
          <Button asChild variant="outline">
            <Link href="/parents">
              <HeartHandshake className="size-4" /> Espace parents
            </Link>
          </Button>
          {/* Relance le tour guidé des onglets (chemin forcé ?tour=1). */}
          <Button asChild variant="outline">
            <Link href="/reviser?tour=1">
              <Compass className="size-4" /> Revoir le tutoriel
            </Link>
          </Button>
        </div>
        {/* LA CONSOLE (16/10/2026) : coach et admin y entrent d'ici, en grand. */}
        {coach ? (
          <div className="mt-4 flex flex-col gap-2 border-t pt-4">
            {profile?.is_admin ? (
              <Button asChild size="xl" className="w-full">
                <Link href="/admin/insights">
                  <Wrench className="size-5" /> Espace admin
                </Link>
              </Button>
            ) : null}
            <Button asChild size="xl" variant={profile?.is_admin ? 'secondary' : 'default'} className="w-full">
              <Link href="/coach">
                <Users className="size-5" /> Espace coach
              </Link>
            </Button>
          </div>
        ) : null}
      </section>

      {/* « Mon coach » (560) : le groupe de coach auquel l'élève est rattaché,
          ou le champ du code. Absent tant que la migration n'est pas passée. */}
      <MonCoach />

      {/* Choix de la classe : déplacé ici depuis l'onglet Moi (c'est un réglage
          de compte, pas un indicateur de progrès). Pilote tout le contenu. */}
      <div className="mx-auto mt-4 w-full max-w-md">
        <GradeSelector current={gradeLevel} />
      </div>

      {/* Sons et vibrations. L'interrupteur n'existait QUE dans l'en-tête d'une
          session de flashcards : pour couper le son de l'app en cours ou en
          bibliothèque, il fallait ouvrir un paquet de cartes pour aller chercher
          le bouton dedans. Sur une app qui sonne à chaque tap, c'était le
          réglage le plus demandé et le plus caché. Sa place est ici, avec les
          autres réglages de compte. */}
      <div className="mx-auto mt-4 w-full max-w-md">
        <SoundToggle variant="reglage" />
      </div>

      <NotificationsOptIn />

      {/* LES PAGES LÉGALES ET LA SUPPRESSION DU COMPTE (25/10/2026) : exigées
          par les stores et le RGPD. Liens internes seulement. */}
      <nav aria-label="Informations légales" className="mx-auto mt-8 flex w-full max-w-md flex-wrap justify-center gap-x-4 px-2 text-xs font-bold text-muted-foreground">
        <Link href="/cgu" className="py-2 underline underline-offset-4">CGU</Link>
        <Link href="/confidentialite" className="py-2 underline underline-offset-4">Confidentialité</Link>
        <Link href="/mentions-legales" className="py-2 underline underline-offset-4">Mentions légales</Link>
      </nav>

      <SupprimerCompte abonne={tier !== 'free'} />

      {/* LES CRÉDITS — ce que la licence demande, là où l'élève ne le cherche
          pas mais où il est honnête de le mettre : la flamme animée de la
          série (Freepik, Flaticon — licence gratuite avec attribution). Une
          ligne, en bas de la page des réglages, sans lien externe : l'app
          n'ouvre pas de site tiers à un mineur depuis un bas de page. */}
      <p className="mx-auto mt-4 w-full max-w-md px-2 text-center text-[11px] font-semibold text-muted-foreground">
        Flamme animée par Freepik (Flaticon).
      </p>
    </div>
  )
}
