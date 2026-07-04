import { redirect } from 'next/navigation'
import { LogOut, BadgeCheck } from 'lucide-react'
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
import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/app/login/actions'

export const metadata = { title: 'Mon compte — Scolaria' }
export const dynamic = 'force-dynamic'

const TIER_LABELS: Record<string, string> = {
  free: 'Gratuit',
  tier1: 'Offre 1',
  tier2: 'Offre 2',
  tier3: 'Offre 3',
}

export default async function ComptePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, subscription_tier')
    .eq('id', user.id)
    .single()

  const tier = profile?.subscription_tier ?? 'free'

  return (
    <div>
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
          {tier === 'free' ? (
            <p className="text-muted-foreground">
              Passe à l’Offre 1 pour débloquer tous les tests premium.
            </p>
          ) : null}
        </CardContent>
        <CardFooter>
          <form action={signOut}>
            <Button variant="outline" type="submit">
              <LogOut className="size-4" /> Se déconnecter
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  )
}
