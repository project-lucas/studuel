'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Check, Copy, Share2 } from 'lucide-react'
import GemIcon from '@/components/ui/GemIcon'
import { sfx } from '@/lib/sounds'
import {
  REFERRAL_GEM_REWARD,
  gemsLabel,
  referralHeadline,
  type ReferralSummary,
} from '@/lib/gems'

// -----------------------------------------------------------------------------
// INVITE UN AMI — la carte de parrainage, AU FORMAT DUOLINGO (Lucas, 16/09/2026 :
// « le design n'est pas au format Duolingo, le texte n'est pas clair, il faut
// plus simple et plus visible pour la marche à suivre »).
//
// Chez Duolingo, l'écran d'invitation tient en trois choses : une
// illustration, UNE phrase qui dit le gain, et UN gros bouton « Partager mon
// lien ». Rien à déplier, rien à lire deux fois. La carte d'avant était une
// ligne repliée dont le résumé était tronqué (« +30 gemmes chacun · Invite un
// ami : vous gagnez chacu… ») et dont le détail expliquait la gemme avant
// d'expliquer quoi faire.
//
// Ici, la MARCHE À SUIVRE est la carte :
//   1. Tu partages ton lien (le bouton, violet, plein, seul appel à l'action).
//   2. Ton ami s'inscrit avec.
//   3. Il termine sa première révision → vous recevez 30 gemmes CHACUN.
// Le code en toutes lettres reste dessous, en petit et copiable, pour l'élève
// qui préfère le dicter — c'est le même code que le lien.
//
// Le solde de gemmes n'est plus affiché ici : il est dans le bandeau du haut.
// -----------------------------------------------------------------------------

export default function ParrainageCard({
  myFriendCode,
  summary,
  nu = false,
}: {
  myFriendCode: string
  summary: ReferralSummary
  /** Sans habillage de carte : rendue DANS la fenêtre « Inviter un ami ». */
  nu?: boolean
}) {
  const [copied, setCopied] = useState<'lien' | 'code' | null>(null)

  const shareUrl =
    typeof window === 'undefined' ? '' : `${window.location.origin}/parrain/${myFriendCode}`
  const shareText = `Rejoins-moi sur Studuel avec mon lien : on gagne ${REFERRAL_GEM_REWARD} gemmes chacun 💎`

  const flash = (quoi: 'lien' | 'code') => {
    setCopied(quoi)
    setTimeout(() => setCopied(null), 2000)
  }

  async function handleShare() {
    // Partage natif quand le téléphone le propose (le chemin qui convertit le
    // mieux : l'élève reste dans sa conversation). Repli sur le presse-papier
    // partout ailleurs, et sur rien du tout si les deux sont refusés — une
    // invitation ratée ne doit jamais casser la page.
    sfx.tap()
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Studuel', text: shareText, url: shareUrl })
        return
      }
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`)
      flash('lien')
    } catch {
      // Partage annulé par l'élève ou refusé par le navigateur : on se tait.
    }
  }

  async function handleCopyCode() {
    try {
      await navigator.clipboard.writeText(myFriendCode)
      flash('code')
    } catch {
      // Presse-papier indisponible : le code reste lisible et recopiable à la main.
    }
  }

  const etapes = [
    'Partage ton lien à un ami.',
    'Il s’inscrit avec ce lien.',
    `Il termine sa première révision : vous recevez ${gemsLabel(REFERRAL_GEM_REWARD)} chacun.`,
  ]

  return (
    <section
      aria-label="Invite un ami"
      className={
        nu
          ? 'text-foreground'
          : 'overflow-hidden rounded-3xl bg-card p-4 text-foreground shadow-sm ring-1 ring-black/5'
      }
    >
      <div className="flex items-center gap-3">
        <Image
          src="/images/amis/parrainage.webp"
          alt=""
          aria-hidden="true"
          width={128}
          height={128}
          className="size-16 shrink-0 select-none object-contain"
        />
        <div className="min-w-0 flex-1">
          <h2 className="font-heading text-lg leading-tight font-extrabold">Invite un ami</h2>
          <p className="mt-0.5 flex items-center gap-1 text-sm font-bold text-primary">
            <GemIcon className="size-4" aria-hidden="true" />+{gemsLabel(REFERRAL_GEM_REWARD)}{' '}
            pour toi et pour lui
          </p>
        </div>
      </div>

      {/* La marche à suivre, numérotée : trois étapes, une ligne chacune. */}
      <ol className="mt-3 flex flex-col gap-1.5">
        {etapes.map((texte, i) => (
          <li key={texte} className="flex items-start gap-2.5 text-sm font-semibold">
            <span
              aria-hidden="true"
              className="font-heading mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/12 text-[11px] font-extrabold text-primary"
            >
              {i + 1}
            </span>
            <span className="text-foreground/85">{texte}</span>
          </li>
        ))}
      </ol>

      {/* LE bouton : plein, violet, pleine largeur. */}
      <button
        type="button"
        onClick={handleShare}
        disabled={!myFriendCode}
        className="font-heading mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-[15px] font-extrabold text-primary-foreground shadow-md transition active:scale-[0.98] disabled:opacity-50"
      >
        {copied === 'lien' ? (
          <>
            <Check className="size-5" strokeWidth={2.8} aria-hidden="true" />
            Lien copié
          </>
        ) : (
          <>
            <Share2 className="size-5" strokeWidth={2.6} aria-hidden="true" />
            Partager mon lien
          </>
        )}
      </button>

      {/* Le code, en secondaire : pour le dicter à voix haute. */}
      <button
        type="button"
        onClick={handleCopyCode}
        disabled={!myFriendCode}
        aria-label={`Copier mon code d'invitation ${myFriendCode}`}
        className="mt-2 flex min-h-10 w-full items-center justify-center gap-2 rounded-2xl text-xs font-bold text-muted-foreground transition hover:bg-muted/60 disabled:opacity-50"
      >
        Ou donne ton code :{' '}
        <span className="font-mono text-sm font-extrabold tracking-[0.2em] text-foreground">
          {myFriendCode || '······'}
        </span>
        {copied === 'code' ? (
          <Check className="size-3.5 text-primary" aria-hidden="true" />
        ) : (
          <Copy className="size-3.5" aria-hidden="true" />
        )}
      </button>

      {/* L'état, une ligne : où en sont mes invitations. Masqué tant que rien
          n'a démarré — la carte dit déjà quoi faire. */}
      {summary.pending > 0 || summary.activated > 0 ? (
        <p className="mt-2 text-center text-xs font-semibold text-muted-foreground">
          {referralHeadline(summary)}
        </p>
      ) : null}
    </section>
  )
}
