'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import GemIcon from '@/components/ui/GemIcon'
import { unlockChapterWithGem } from '@/app/reviser/[subject]/[chapter]/actions'
import { gemsLabel } from '@/lib/gems'

// L'écran de déverrouillage d'un chapitre — le moment où la gemme se dépense.
//
// Deux portes, jamais une seule : la gemme (gratuite, gagnée en invitant) ET
// l'abonnement. Un élève sans gemme ne doit pas se retrouver devant un mur :
// on lui montre comment en gagner (inviter un ami) avant de lui proposer de
// payer. C'est tout le pari du système — le contenu s'ouvre par le social.
export default function UnlockChapterCard({
  chapterId,
  gems,
  children,
}: {
  chapterId: string
  gems: number
  /** L'aperçu flouté affiché derrière (un leurre, jamais le vrai contenu). */
  children: React.ReactNode
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const canUnlock = gems >= 1

  function handleUnlock() {
    setError(null)
    startTransition(async () => {
      const { ok, message } = await unlockChapterWithGem(chapterId)
      if (ok) {
        // Le serveur a ouvert le chapitre : on recharge pour afficher le
        // vrai contenu, qu'on n'avait volontairement pas chargé jusqu'ici.
        router.refresh()
        return
      }
      setError(message)
    })
  }

  return (
    <div className="relative">
      <div aria-hidden="true">{children}</div>

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-4 text-center">
        <span className="bg-card flex size-14 items-center justify-center rounded-2xl border shadow-md">
          <Lock className="text-muted-foreground size-6" aria-hidden="true" />
        </span>

        <p className="font-heading max-w-xs font-semibold text-balance">
          Débloque ce chapitre avec une gemme
        </p>
        <p className="text-muted-foreground max-w-xs text-sm text-balance">
          Tu gardes sa carte mentale et ses fiches de révision pour toujours.
        </p>

        {canUnlock ? (
          <Button
            className="rounded-full"
            onClick={handleUnlock}
            disabled={pending}
          >
            <GemIcon className="size-4" aria-hidden="true" />
            {pending ? 'Déblocage…' : 'Utiliser 1 gemme'}
          </Button>
        ) : (
          <Button asChild className="rounded-full">
            <Link href="/amis">Gagner des gemmes</Link>
          </Button>
        )}

        <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
          <GemIcon className="size-3.5" aria-hidden="true" />
          {canUnlock
            ? `Il te reste ${gemsLabel(gems)}`
            : 'Invite un ami : vous gagnez chacun une gemme'}
        </p>

        {error ? (
          <p className="text-destructive text-xs font-medium" role="alert">
            {error}
          </p>
        ) : null}

        <Link
          href="/compte"
          className="text-muted-foreground hover:text-foreground text-xs font-medium underline underline-offset-4"
        >
          Ou débloque tout avec Studuel+
        </Link>
      </div>
    </div>
  )
}
