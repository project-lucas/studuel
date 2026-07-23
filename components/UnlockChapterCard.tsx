'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Lock, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import GemIcon from '@/components/ui/GemIcon'
import { unlockChapterWithGem } from '@/app/reviser/[subject]/[chapter]/actions'
import {
  GEM_COST_CHAPTER,
  gemsAfterSpend,
  gemsLabel,
  missingGemsLabel,
} from '@/lib/gems'
import { sfx } from '@/lib/sounds'
import { toast } from '@/lib/toast'
import { useDialog } from '@/lib/use-dialog'

// L'écran de déverrouillage d'un chapitre — le moment où la gemme se dépense.
//
// Deux portes, jamais une seule : la gemme (gratuite, gagnée en invitant) ET
// l'abonnement. Un élève sans gemme ne doit pas se retrouver devant un mur :
// on lui dit ce qui manque, puis comment en gagner (inviter un ami) avant de
// lui proposer de payer. C'est tout le pari du système — le contenu s'ouvre
// par le social.
//
// La dépense passe par une feuille de CONFIRMATION : une gemme est rare (3 au
// départ) et le déblocage définitif — pas de dépense sur un simple tap.
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
  const [confirming, setConfirming] = useState(false)
  const canUnlock = gems >= GEM_COST_CHAPTER
  const missing = missingGemsLabel(gems)

  return (
    <div className="relative">
      <div aria-hidden="true">{children}</div>

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-4 text-center">
        {/* Le cadenas annonce la couleur ET le prix, d'un seul coup d'œil. */}
        <span className="bg-card flex items-center gap-2 rounded-2xl border px-4 py-3 shadow-md">
          <Lock className="text-muted-foreground size-5" aria-hidden="true" />
          <span className="flex items-center gap-1 font-heading text-sm font-bold">
            <GemIcon className="size-4" aria-hidden="true" />
            {gemsLabel(GEM_COST_CHAPTER)}
          </span>
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
            onClick={() => setConfirming(true)}
          >
            <GemIcon className="size-4" aria-hidden="true" />
            Utiliser {gemsLabel(GEM_COST_CHAPTER)}
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
            : `${missing} — invite un ami : vous en gagnez chacun une`}
        </p>

        <Link
          href="/compte"
          className="text-muted-foreground hover:text-foreground text-xs font-medium underline underline-offset-4"
        >
          Ou débloque tout avec Studuel+
        </Link>
      </div>

      {confirming ? (
        <ConfirmUnlockSheet
          chapterId={chapterId}
          gems={gems}
          onClose={() => setConfirming(false)}
        />
      ) : null}
    </div>
  )
}

// Feuille de confirmation : récapitule le prix et le solde APRÈS dépense, puis
// seulement débite. Elle ne se ferme d'elle-même qu'en cas de succès réel —
// sinon elle affiche l'erreur et reste ouverte, pas de fausse impression.
function ConfirmUnlockSheet({
  chapterId,
  gems,
  onClose,
}: {
  chapterId: string
  gems: number
  onClose: () => void
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  useDialog(onClose)

  function handleConfirm() {
    if (pending) return
    sfx.tap()
    setError(null)
    startTransition(async () => {
      const { ok, message } = await unlockChapterWithGem(chapterId)
      if (ok) {
        toast(message)
        // Le serveur a ouvert le chapitre : on recharge pour afficher le
        // vrai contenu, qu'on n'avait volontairement pas chargé jusqu'ici.
        router.refresh()
        onClose()
        return
      }
      setError(message)
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Confirmer le déblocage"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-t-3xl bg-white p-5 shadow-xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-lg font-extrabold text-foreground">
            Débloquer ce chapitre ?
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted active:scale-90"
          >
            <X className="size-5" strokeWidth={2.4} aria-hidden="true" />
          </button>
        </div>

        <p className="text-sm text-muted-foreground">
          Sa carte mentale et ses fiches de révision seront à toi pour
          toujours — même si tu n&apos;as plus de gemmes plus tard.
        </p>

        <div className="mt-4 flex items-center justify-between rounded-2xl border bg-muted/40 px-4 py-3 text-sm font-medium">
          <span className="flex items-center gap-1.5">
            <GemIcon className="size-4" aria-hidden="true" />
            Coût : {gemsLabel(GEM_COST_CHAPTER)}
          </span>
          <span className="text-muted-foreground">
            Après : {gemsLabel(gemsAfterSpend(gems))}
          </span>
        </div>

        {error ? (
          <p className="text-destructive mt-3 text-sm font-medium" role="alert">
            {error}
          </p>
        ) : null}

        <div className="mt-4 flex flex-col gap-2">
          <Button
            className="w-full rounded-full"
            onClick={handleConfirm}
            disabled={pending}
          >
            <GemIcon className="size-4" aria-hidden="true" />
            {pending ? 'Déblocage…' : 'Confirmer le déblocage'}
          </Button>
          <Button
            variant="ghost"
            className="w-full rounded-full"
            onClick={onClose}
            disabled={pending}
          >
            Pas maintenant
          </Button>
        </div>
      </div>
    </div>
  )
}
