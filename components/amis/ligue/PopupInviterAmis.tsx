'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import { Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import PortraitJoueur from '@/components/amis/PortraitJoueur'
import CoffreDessin from '@/components/amis/CoffreDessin'
import { CristalIcon } from '@/components/ui/MonnaieIcon'
import { useSortieAnimee } from '@/components/useSortieAnimee'
import { useDialogFocus } from '@/lib/use-dialog'
import { AMIS_MAX } from '@/lib/ligue'
import { REFERRAL_GEM_REWARD } from '@/lib/gems'
import { sfx } from '@/lib/sounds'
import type { AvatarAffiche } from '@/lib/avatar-affiche'
import { partagerInvitation, type IssuePartage } from './partager'

// -----------------------------------------------------------------------------
// « FAIS ÉQUIPE AVEC TES AMIS » — la fenêtre de Duolingo (Lucas, 24/09/2026 :
// « met en place ce pop-up proprement »). Deux personnages côte à côte, moi et
// un « ??? » en pointillés, UNE phrase qui dit le gain, UN gros bouton. Elle
// s'ouvre d'elle-même une fois par semaine sur l'onglet Amis tant que moins de
// 10 amis comptent dans le coffre d'équipe (`doitProposerInvitation`). « Plus
// tard » la ferme sans rien dire de plus.
//
// Le lien partagé est celui du parrainage : l'ami qui s'inscrit avec devient
// mon ami tout de suite, et son XP tombe dans mon coffre d'équipe.
// -----------------------------------------------------------------------------

const sAbonner = () => () => {}

export default function PopupInviterAmis({
  open,
  onClose,
  nbAmis,
  myFriendCode,
  monId,
  monPortrait,
  monAvatar = null,
}: {
  open: boolean
  onClose: () => void
  nbAmis: number
  myFriendCode: string
  monId: string
  monPortrait: string
  monAvatar?: AvatarAffiche | null
}) {
  const panneau = useRef<HTMLDivElement>(null)
  const { monte, etat, onAnimationEnd } = useSortieAnimee(open)
  // Rien au rendu serveur ni à l'hydratation : un portail ouvert d'emblée
  // ne correspondrait à rien côté serveur.
  const client = useSyncExternalStore(sAbonner, () => true, () => false)
  useDialogFocus(panneau, open)
  const [issue, setIssue] = useState<IssuePartage | null>(null)

  // Échap ferme, comme toutes les fenêtres de l'app.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!monte || !client) return null

  const n = Math.min(AMIS_MAX, Math.max(0, nbAmis))

  const inviter = async () => {
    const resultat = await partagerInvitation(myFriendCode)
    if (resultat !== 'annule') sfx.correct()
    setIssue(resultat)
  }

  const fermer = () => {
    sfx.tap()
    setIssue(null)
    onClose()
  }

  return createPortal(
    <div
      data-etat={etat}
      className="modale-voile fixed inset-0 z-50 flex items-end justify-center bg-black/55 p-4 sm:items-center"
      onClick={fermer}
    >
      <div
        ref={panneau}
        role="dialog"
        aria-modal="true"
        aria-labelledby="inviter-titre"
        data-etat={etat}
        onAnimationEnd={onAnimationEnd}
        onClick={(e) => e.stopPropagation()}
        className="modale-panneau relative flex w-full max-w-sm flex-col items-center gap-3 rounded-3xl bg-card px-5 pt-6 pb-5 text-center shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)] ring-1 ring-foreground/10 outline-none"
      >
        <button
          type="button"
          onClick={fermer}
          aria-label="Fermer"
          className="absolute top-3 right-3 grid size-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted active:scale-90"
        >
          <X className="size-5" strokeWidth={2.4} aria-hidden="true" />
        </button>

        {/* MOI + ??? : l'équipe qu'il reste à former. */}
        <div aria-hidden="true" className="flex items-end justify-center gap-3">
          <figure className="flex flex-col items-center gap-1">
            <PortraitJoueur id={monId} portrait={monPortrait} avatar={monAvatar} className="size-20 ring-4 ring-primary/25" />
            <figcaption className="text-xs font-extrabold text-foreground">Toi</figcaption>
          </figure>
          <CoffreDessin className="mb-6 size-14" />
          <figure className="flex flex-col items-center gap-1">
            <span className="font-heading grid size-20 place-items-center rounded-full border-[3px] border-dashed border-primary/40 bg-primary/5 text-3xl font-extrabold text-primary/60">
              ?
            </span>
            <figcaption className="text-xs font-extrabold text-muted-foreground">???</figcaption>
          </figure>
        </div>

        <h2 id="inviter-titre" className="font-heading text-2xl leading-tight font-extrabold text-balance">
          Fais équipe avec tes amis
        </h2>
        <p className="text-sm font-semibold text-muted-foreground text-balance">
          Toute l’XP que ton ami gagne dans la semaine tombe dans ton coffre d’équipe, avec la tienne. Plus il monte,
          plus il contient d’XP et de gemmes quand il s’ouvre, lundi.
        </p>

        {/* D'où je pars, où m'emmène un ami de plus. */}
        <p className="flex items-center gap-2 text-sm font-extrabold tabular-nums">
          <span className="rounded-full bg-muted px-2.5 py-1 text-muted-foreground">
            {n === 0 ? 'Aucun ami' : `${n} ami${n > 1 ? 's' : ''}`} dans ton coffre
          </span>
          <span aria-hidden="true" className="text-muted-foreground">
            →
          </span>
          <span className="rounded-full bg-highlight px-2.5 py-1 text-foreground">
            {n >= AMIS_MAX ? 'Maximum atteint' : 'Son XP en plus'}
          </span>
        </p>

        <Button type="button" size="xl" shine className="mt-1 w-full" onClick={inviter} disabled={!myFriendCode}>
          {issue === 'copie' ? (
            <>
              <Check strokeWidth={2.8} aria-hidden="true" /> Lien copié
            </>
          ) : (
            'Inviter un ami'
          )}
        </Button>
        {issue === 'copie' ? (
          <p role="status" className="-mt-1 text-xs font-semibold text-success">
            Colle-le dans ta conversation avec ton ami.
          </p>
        ) : issue === 'partage' ? (
          <p role="status" className="-mt-1 text-xs font-semibold text-success">
            Invitation envoyée&nbsp;: il compte dès qu’il s’inscrit.
          </p>
        ) : null}
        <button
          type="button"
          onClick={fermer}
          className="font-heading min-h-11 w-full rounded-full text-sm font-extrabold text-primary transition-colors hover:bg-primary/5"
        >
          Plus tard
        </button>

        <p className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground">
          <CristalIcon className="-my-1 size-4" />+{REFERRAL_GEM_REWARD} gemmes pour vous deux à sa première révision
        </p>
      </div>
    </div>,
    document.body,
  )
}
