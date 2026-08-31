'use client'

import Image from 'next/image'

import { useState } from 'react'
import { Check, ChevronDown, Copy, Share2 } from 'lucide-react'
import GemIcon from '@/components/ui/GemIcon'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import {
  REFERRAL_GEM_REWARD,
  gemsLabel,
  referralHeadline,
  type ReferralSummary,
} from '@/lib/gems'

// Le bloc parrainage — le moteur du système de gemmes, COMPACTÉ en une ligne.
//
// C'est une action qu'on fait une fois : elle n'a plus le droit d'écraser le
// quotidien de l'onglet (défier, se comparer). La tuile d'une ligne dit le
// gain partagé (« +gemmes chacun ») ; un tap déplie le détail — code à copier,
// bouton de partage, filleuls en attente.
export default function ParrainageCard({
  myFriendCode,
  gems,
  summary,
}: {
  myFriendCode: string
  gems: number
  summary: ReferralSummary
}) {
  const [copied, setCopied] = useState(false)
  const [open, setOpen] = useState(false)

  const shareUrl =
    typeof window === 'undefined'
      ? ''
      : `${window.location.origin}/parrain/${myFriendCode}`
  const shareText = `Rejoins-moi sur Studuel avec mon code ${myFriendCode} : on gagne chacun une gemme 💎`

  async function handleShare() {
    // Partage natif quand le téléphone le propose (le chemin qui convertit le
    // mieux : l'élève reste dans sa conversation). Repli sur le presse-papier
    // partout ailleurs, et sur rien du tout si les deux sont refusés — une
    // invitation ratée ne doit jamais casser la page.
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Studuel', text: shareText, url: shareUrl })
        return
      }
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Partage annulé par l'élève ou refusé par le navigateur : on se tait.
    }
  }

  async function handleCopyCode() {
    try {
      await navigator.clipboard.writeText(myFriendCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Presse-papier indisponible : le code reste lisible et recopiable à la main.
    }
  }

  return (
    <section className="border-primary/20 from-primary/10 rounded-3xl border bg-gradient-to-br to-transparent">
      {/* La ligne repliée : tout le message en un regard, un tap pour agir. */}
      <button
        type="button"
        onClick={() => {
          sfx.tap()
          setOpen((v) => !v)
        }}
        aria-expanded={open}
        className="flex w-full cursor-pointer items-center gap-3 p-3.5 text-left"
      >
        {/* LE CHECK, PAS LA GEMME. La carte dit « vous gagnez CHACUN 30
            gemmes » : le mot qui porte l'offre est la réciprocité, pas la
            monnaie — laquelle est déjà affichée en chiffres à droite. Deux
            mains qui se tapent disent le partage ; une gemme seule répétait le
            montant. */}
        <Image
          src="/images/amis/parrainage.webp"
          alt=""
          aria-hidden="true"
          width={96}
          height={96}
          className="size-11 shrink-0 select-none object-contain"
        />
        <span className="min-w-0 flex-1">
          <span className="font-heading block truncate text-sm font-extrabold">
            Invite un ami
          </span>
          <span className="text-muted-foreground block truncate text-xs">
            +{gemsLabel(REFERRAL_GEM_REWARD)} chacun · {referralHeadline(summary)}
          </span>
        </span>
        <span
          className="bg-card flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 font-mono text-xs font-bold tabular-nums"
          aria-label={`Tu as ${gemsLabel(gems)}`}
        >
          <GemIcon className="text-primary size-3.5" aria-hidden="true" />
          {gems}
        </span>
        <ChevronDown
          className={cn(
            'text-muted-foreground size-4 shrink-0 transition-transform',
            open && 'rotate-180',
          )}
          aria-hidden="true"
        />
      </button>

      {open ? (
        <div className="px-4 pb-4">
      <p className="text-muted-foreground text-xs">
        Une gemme débloque un chapitre entier — sa carte mentale et ses fiches
        de révision — pour toujours.
      </p>

      {/* Le code, en gros et copiable : c'est l'objet qu'on s'échange. */}
      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          onClick={handleCopyCode}
          className="bg-card hover:bg-accent/40 flex flex-1 items-center justify-between gap-2 rounded-2xl border px-4 py-3 transition-colors"
          aria-label={`Copier mon code d'invitation ${myFriendCode}`}
        >
          <span className="font-mono text-lg font-bold tracking-[0.2em]">
            {myFriendCode || '······'}
          </span>
          {copied ? (
            <Check className="text-primary size-4 shrink-0" aria-hidden="true" />
          ) : (
            <Copy className="text-muted-foreground size-4 shrink-0" aria-hidden="true" />
          )}
        </button>

        <Button type="button" onClick={handleShare} className="h-[50px] rounded-2xl">
          <Share2 className="size-4" aria-hidden="true" />
          Inviter
        </Button>
      </div>

      <p className="text-muted-foreground mt-3 text-xs">
        Ton ami s&apos;inscrit avec ton code, puis termine une première
        révision : vous recevez alors {gemsLabel(REFERRAL_GEM_REWARD)} chacun.
        {summary.capped
          ? ' Tu as atteint le maximum de gemmes par parrainage.'
          : ` Il te reste ${gemsLabel(summary.gemsRemaining)} à gagner ainsi.`}
      </p>

      {/* Le statut chiffré : voir « 2 en attente » relance l'élève sur ceux qui
          n'ont pas encore révisé, ce qu'un simple total ne ferait pas. */}
      {summary.pending > 0 || summary.activated > 0 ? (
        <dl className="mt-4 grid grid-cols-2 gap-2 text-center">
          <div className="bg-card/60 rounded-2xl border px-3 py-2">
            <dt className="text-muted-foreground text-xs">En attente</dt>
            <dd className="font-mono text-lg font-bold tabular-nums">
              {summary.pending}
            </dd>
          </div>
          <div className="bg-card/60 rounded-2xl border px-3 py-2">
            <dt className="text-muted-foreground text-xs">Amis actifs</dt>
            <dd className="font-mono text-lg font-bold tabular-nums">
              {summary.activated}
            </dd>
          </div>
        </dl>
      ) : null}
        </div>
      ) : null}
    </section>
  )
}
