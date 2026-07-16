import Link from 'next/link'
import { UserPlus } from 'lucide-react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import FriendAddCard from '@/components/FriendAddCard'
import { createClient } from '@/lib/supabase/server'

export const metadata = { title: 'Ajouter un ami — Studuel' }
export const dynamic = 'force-dynamic'

// Même format que le code ami de la migration 019 (6 caractères lisibles),
// avec la même tolérance 4→10 que l'ajout manuel — la fonction SQL tranche.
const CODE_RE = /^[A-Z0-9]{4,10}$/

/**
 * Route /amis/ajouter/[code] — l'atterrissage du QR code ami. Le QR affiché
 * dans l'arène (bouton « Ajouter un ami ») encode cette URL : le scan par
 * l'appareil photo du téléphone ouvre l'app ici, et un tap suffit pour créer
 * l'amitié (add_friend_qr, migration 163 — acceptée directement).
 */
export default async function AjouterAmiPage({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const { code } = await params
  const clean = decodeURIComponent(code ?? '')
    .trim()
    .toUpperCase()

  if (!CODE_RE.test(clean)) {
    return (
      <Shell>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Ce lien n&apos;est pas valide</CardTitle>
            <CardDescription>
              Le code ami de ce QR est illisible. Demande à ton ami de
              réafficher son QR code et rescanne-le.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild variant="outline">
              <Link href="/amis">Aller à mes amis</Link>
            </Button>
          </CardFooter>
        </Card>
      </Shell>
    )
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <Shell>
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="size-4 text-primary" /> Connecte-toi
              d&apos;abord
            </CardTitle>
            <CardDescription>
              Connecte-toi (ou crée ton compte), puis rescanne le QR code de
              ton ami pour l&apos;ajouter.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild>
              <Link href="/login">Se connecter</Link>
            </Button>
          </CardFooter>
        </Card>
      </Shell>
    )
  }

  // Le prénom derrière le code — null si la migration 163 n'est pas passée
  // ou si le code n'existe pas (le bouton affichera le message adapté).
  const { data: preview } = await supabase.rpc('friend_preview', {
    p_code: clean,
  })
  const name =
    typeof preview === 'string' && preview.trim()
      ? preview.trim().split(' ')[0]
      : null

  return (
    <Shell>
      <FriendAddCard code={clean} name={name} />
    </Shell>
  )
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-4 pb-8">
      {children}
    </div>
  )
}
