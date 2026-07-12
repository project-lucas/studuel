import Link from 'next/link'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import PageHeader from '@/components/PageHeader'
import NewPasswordForm from '@/components/NewPasswordForm'
import { createClient } from '@/lib/supabase/server'

export const metadata = { title: 'Nouveau mot de passe — Scolaria' }
export const dynamic = 'force-dynamic'

// Arrivée du lien email de réinitialisation (via /auth/callback).
// Sans session, le lien a expiré ou a déjà servi : on propose d'en redemander un.
export default async function ResetPasswordPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div>
        <PageHeader title="Nouveau mot de passe" />
        <Card className="mx-auto w-full max-w-md">
          <CardHeader>
            <CardTitle>Ce lien n&apos;est plus valide</CardTitle>
            <CardDescription>
              Le lien de réinitialisation a expiré ou a déjà été utilisé.
              Redemande un email — ça prend dix secondes.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild>
              <Link href="/login/reset">Recevoir un nouveau lien</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="Nouveau mot de passe" />
      <NewPasswordForm />
    </div>
  )
}
