'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { PartyPopper, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { sfx } from '@/lib/sounds'
import { shareStory } from '@/components/story-share'
import type { Palier } from '@/lib/palier'
import ConfettiRain from '@/components/ConfettiRain'

// Chaque palier n'est fêté qu'UNE fois (mémoire locale, comme la fête de
// matière) : pas de re-tir au re-rendu, ni si l'élève redescend puis refranchit.
const storageKey = (id: string) => `studuel-palier-fete:${id}`

/**
 * Bulle de célébration plein écran au passage d'un palier (nouvelle arène,
 * promotion de ligue — demain, échelle géographique). Confettis, gros emoji,
 * nom du palier, et bouton « Partager » (Web Share API avec visuel façon
 * story ; repli : partage texte, puis copie dans le presse-papiers).
 * S'affiche UNE seule fois par palier (mémoire locale) — sauf `once=false`,
 * pour les paliers re-franchissables dont l'appelant gère déjà le re-tir
 * (ex. promotion de ligue détectée par LeaguePromotionWatch).
 */
export default function PalierCelebration({
  palier,
  once = true,
  onClose,
}: {
  palier: Palier
  once?: boolean
  onClose?: () => void
}) {
  const [visible, setVisible] = useState(false)
  const [shareState, setShareState] = useState<
    'idle' | 'sharing' | 'copied' | 'failed'
  >('idle')
  const dismissRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (once && window.localStorage.getItem(storageKey(palier.id))) return
    // Petit délai : l'écran s'installe, puis la fête éclate.
    const timer = setTimeout(() => {
      setVisible(true)
      sfx.levelUp()
    }, 600)
    return () => clearTimeout(timer)
  }, [palier.id, once])

  // Focus sur le bouton de fermeture à l'ouverture (clavier/lecteur d'écran).
  useEffect(() => {
    if (visible) dismissRef.current?.focus()
  }, [visible])

  if (!visible) return null

  const dismiss = () => {
    window.localStorage.setItem(storageKey(palier.id), '1')
    sfx.complete()
    setVisible(false)
    onClose?.()
  }

  const share = async () => {
    if (shareState === 'sharing') return
    setShareState('sharing')
    const outcome = await shareStory(
      { title: palier.title, emoji: palier.emoji, headline: palier.name },
      palier.shareText,
    )
    setShareState(
      outcome === 'copied' ? 'copied' : outcome === 'failed' ? 'failed' : 'idle',
    )
  }

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${palier.title} ${palier.name}`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6"
    >
      <ConfettiRain />
      <div className="pop-in relative w-full max-w-sm rounded-3xl bg-card p-6 text-center shadow-xl ring-1 ring-foreground/10">
        <span className="float-slow block text-7xl" aria-hidden="true">
          {palier.emoji}
        </span>
        <p className="font-heading mt-3 text-2xl font-extrabold tracking-tight uppercase italic">
          {palier.title}
        </p>
        <p className="font-heading mt-1 text-lg font-bold text-primary">
          {palier.name}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">{palier.subtitle}</p>

        <div className="mt-5 flex flex-col gap-2">
          <Button
            onClick={share}
            disabled={shareState === 'sharing'}
            className="w-full rounded-full bg-highlight text-foreground hover:bg-highlight/90"
          >
            <Share2 className="size-4" aria-hidden="true" />
            {shareState === 'sharing' ? 'Partage…' : 'Partager en story'}
          </Button>
          <Button
            ref={dismissRef}
            onClick={dismiss}
            variant="secondary"
            className="w-full rounded-full"
          >
            <PartyPopper className="size-4" aria-hidden="true" /> Continuer
          </Button>
        </div>
        {shareState === 'copied' ? (
          <p role="status" className="mt-2 text-xs font-medium text-muted-foreground">
            Message copié — colle-le où tu veux !
          </p>
        ) : null}
        {shareState === 'failed' ? (
          <p role="status" className="mt-2 text-xs font-medium text-destructive">
            Partage indisponible sur cet appareil.
          </p>
        ) : null}
      </div>
    </div>,
    document.body,
  )
}
