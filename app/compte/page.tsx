import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  LogOut,
  BadgeCheck,
  Compass,
  HeartHandshake,
  Wrench,
} from 'lucide-react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import PageHeader from '@/components/PageHeader'
import BackButton from '@/components/BackButton'
import NotificationsOptIn from '@/components/NotificationsOptIn'
import GradeSelector from '@/components/GradeSelector'
import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/app/login/actions'
import { GRADE_LEVELS, type GradeLevel } from '@/lib/types'

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
  const {
    data: { user },
  } = await supabase.auth.getUser()

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
    }>()

  const tier = profile?.subscription_tier ?? 'free'
  // Classe courante validée contre la liste fermée (null si non renseignée).
  const gradeLevel: GradeLevel | null = GRADE_LEVELS.includes(
    profile?.grade_level as GradeLevel,
  )
    ? (profile!.grade_level as GradeLevel)
    : null

  return (
    <div>
      <div className="mb-4">
        <BackButton fallback="/reviser" />
      </div>
      <PageHeader title="Mon compte" />

      <Card className="mx-auto w-full max-w-md">
        <CardHeader>
          <CardTitle>{profile?.full_name || user.email}</CardTitle>
          <CardDescription>{user.email}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p className="flex items-center gap-2">
            <BadgeCheck className="size-4 text-primary" />
            Abonnement : <strong>{TIER_LABELS[tier] ?? tier}</strong>
          </p>
          <p className="text-muted-foreground">
            {profile?.grade_level
              ? `Classe : ${profile.grade_level} · Objectif : ${profile.daily_goal ?? 1} session${(profile.daily_goal ?? 1) > 1 ? 's' : ''}/jour`
              : 'Classe non renseignée'}{' '}
            —{' '}
            <Link
              href="/onboarding"
              className="font-medium text-primary underline underline-offset-4"
            >
              modifier
            </Link>
          </p>
          {tier === 'free' ? (
            <p className="text-muted-foreground">
              Passe à Studuel+ pour débloquer tous les tests premium.
            </p>
          ) : null}
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2">
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
          {profile?.is_admin ? (
            <Button asChild variant="outline">
              <Link href="/admin">
                <Wrench className="size-4" /> Studio de contenu
              </Link>
            </Button>
          ) : null}
        </CardFooter>
      </Card>

      {/* Choix de la classe : déplacé ici depuis l'onglet Moi (c'est un réglage
          de compte, pas un indicateur de progrès). Pilote tout le contenu. */}
      <div className="mx-auto mt-4 w-full max-w-md">
        <GradeSelector current={gradeLevel} />
      </div>

      <NotificationsOptIn />
    </div>
  )
}
