'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { PartyPopper, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { sfx } from '@/lib/sounds'
import type { Palier } from '@/lib/palier'

// Chaque palier n'est fêté qu'UNE fois (mémoire locale, comme la fête de
// matière) : pas de re-tir au re-rendu, ni si l'élève redescend puis refranchit.
const storageKey = (id: string) => `studuel-palier-fete:${id}`

// Pluie de confettis déterministe (positions/délais par index — pas de
// Math.random au rendu), même recette que SubjectMasteryCelebration.
function ConfettiRain() {
  const colors = ['bg-primary', 'bg-highlight', 'bg-chart-2', 'bg-chart-4']
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 32 }, (_, i) => (
        <span
          key={i}
          className={`confetti-piece ${colors[i % colors.length]}`}
          style={{
            left: `${(i * 31 + 7) % 100}%`,
            animationDelay: `${(i % 8) * 0.24}s`,
            animationDuration: `${2.2 + (i % 5) * 0.4}s`,
          }}
        />
      ))}
    </div>
  )
}

// Image « story » 1080×1920 générée à la volée pour le partage : fond violet
// de marque (token --primary résolu au runtime), gros emoji, nom du palier,
// signature Studuel. Rendue en File pour navigator.share({ files }).
async function buildStoryImage(palier: Palier): Promise<File | null> {
  try {
    const canvas = document.createElement('canvas')
    canvas.width = 1080
    canvas.height = 1920
    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    const styles = getComputedStyle(document.documentElement)
    const primary = styles.getPropertyValue('--primary').trim() || 'rebeccapurple'
    const highlight = styles.getPropertyValue('--highlight').trim() || 'gold'

    const bg = ctx.createLinearGradient(0, 0, 0, 1920)
    bg.addColorStop(0, primary)
    bg.addColorStop(1, `color-mix(in oklch, ${primary}, black 55%)`)
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, 1080, 1920)

    // Confettis figés, dérivés de l'index (déterministe).
    for (let i = 0; i < 40; i++) {
      ctx.fillStyle = i % 3 === 0 ? highlight : 'rgba(255,255,255,0.35)'
      const x = (i * 173 + 91) % 1080
      const y = (i * 389 + 127) % 1920
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(((i * 47) % 360) * (Math.PI / 180))
      ctx.fillRect(-7, -12, 14, 24)
      ctx.restore()
    }

    ctx.textAlign = 'center'
    ctx.fillStyle = 'rgba(255,255,255,0.85)'
    ctx.font = 'bold 56px system-ui, sans-serif'
    ctx.fillText(palier.title.toUpperCase(), 540, 560)

    ctx.font = '300px serif'
    ctx.fillText(palier.emoji, 540, 1010)

    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 88px system-ui, sans-serif'
    ctx.fillText(palier.name, 540, 1230)

    ctx.fillStyle = highlight
    ctx.font = 'bold 48px system-ui, sans-serif'
    ctx.fillText('⭐ Rejoins-moi sur Studuel ⭐', 540, 1650)

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/png'),
    )
    if (!blob) return null
    return new File([blob], 'palier-studuel.png', { type: 'image/png' })
  } catch {
    // Canvas indisponible (vieux navigateur…) : le partage texte prend le relais.
    return null
  }
}

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
    const url = window.location.origin
    const text = `${palier.shareText} ${url}`
    try {
      const file = await buildStoryImage(palier)
      if (file && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], text: palier.shareText })
        setShareState('idle')
        return
      }
      if (navigator.share) {
        await navigator.share({ text })
        setShareState('idle')
        return
      }
      await navigator.clipboard.writeText(text)
      setShareState('copied')
    } catch (err) {
      // L'élève a refermé la feuille de partage : pas une erreur.
      if (err instanceof Error && err.name === 'AbortError') {
        setShareState('idle')
        return
      }
      try {
        await navigator.clipboard.writeText(text)
        setShareState('copied')
      } catch {
        setShareState('failed')
      }
    }
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
