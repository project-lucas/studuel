'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import { QrCode, Share2, UserPlus, X } from 'lucide-react'
import { sfx } from '@/lib/sounds'

interface FriendQrButtonProps {
  /** Code ami de l'élève (profiles.friend_code) — encodé dans le QR vert. */
  friendCode: string
}

/**
 * Le bouton vert « Mon QR code » de l'onglet Amis : ouvre une modale avec
 * MON QR — quiconque le scanne devient mon ami (route /amis/ajouter/<code>).
 * (Déplacé depuis la rangée sociale de l'arène Défi.)
 */
export default function FriendQrButton({ friendCode }: FriendQrButtonProps) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const reduce = useReducedMotion()

  // URL absolue encodée dans le QR. Sans danger au rendu : la modale (seul
  // endroit où elle s'affiche) ne s'ouvre qu'après un tap, donc côté client.
  const shareUrl =
    typeof window === 'undefined'
      ? ''
      : `${window.location.origin}/amis/ajouter/${friendCode}`

  // Fermeture au clavier (Échap), comme les autres modales de l'app.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const share = async () => {
    sfx.tap()
    const data = {
      title: 'Studuel — deviens mon ami !',
      text: 'Scanne ou ouvre ce lien pour devenir mon ami sur Studuel :',
      url: shareUrl,
    }
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share(data)
        return
      } catch {
        // Partage annulé par l'élève : rien à faire.
        return
      }
    }
    await navigator.clipboard?.writeText(shareUrl)
    setCopied(true)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          sfx.tap()
          setOpen(true)
        }}
        aria-haspopup="dialog"
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-[oklch(0.72_0.13_150)] bg-gradient-to-b from-[oklch(0.66_0.16_150)] to-[oklch(0.53_0.15_152)] px-4 py-2.5 shadow-[0_10px_22px_-10px_oklch(0.48_0.15_152)] transition-transform active:scale-95 focus-visible:ring-4 focus-visible:ring-[oklch(0.66_0.16_150)]/40 focus-visible:outline-none"
      >
        <QrCode className="size-4 text-white" aria-hidden="true" />
        <span className="font-heading text-sm font-extrabold text-white">
          Mon QR code à scanner
        </span>
      </button>

      {typeof document !== 'undefined'
        ? createPortal(
            <AnimatePresence>
              {open ? (
                <motion.div
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4"
                  role="dialog"
                  aria-modal="true"
                  aria-label="Ajouter un ami par QR code"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  onClick={() => setOpen(false)}
                >
                  <motion.div
                    className="flex w-full max-w-sm flex-col items-center gap-4 rounded-3xl border border-[oklch(0.75_0.12_150)]/60 bg-gradient-to-b from-[oklch(0.6_0.15_150)] to-[oklch(0.48_0.14_152)] p-6 text-center shadow-[0_24px_60px_-20px_rgba(0,0,0,0.7)]"
                    initial={reduce ? { opacity: 0 } : { scale: 0.9, opacity: 0 }}
                    animate={reduce ? { opacity: 1 } : { scale: 1, opacity: 1 }}
                    exit={reduce ? { opacity: 0 } : { scale: 0.9, opacity: 0 }}
                    transition={{ type: 'tween', duration: 0.2, ease: 'easeOut' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex w-full items-center gap-3">
                      <UserPlus
                        className="size-5 shrink-0 text-white"
                        aria-hidden="true"
                      />
                      <h2 className="font-heading min-w-0 flex-1 truncate text-left text-xl font-extrabold text-white">
                        Ajouter un ami
                      </h2>
                      <button
                        type="button"
                        onClick={() => setOpen(false)}
                        aria-label="Fermer"
                        className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 active:scale-90"
                      >
                        <X className="size-5" strokeWidth={2.4} aria-hidden="true" />
                      </button>
                    </div>

                    {shareUrl ? (
                      <div className="rounded-2xl bg-white p-3 shadow-inner">
                        <QRCodeSVG
                          value={shareUrl}
                          size={208}
                          marginSize={1}
                          fgColor="#14532d"
                          bgColor="#ffffff"
                          aria-label="Ton QR code ami — à faire scanner"
                        />
                      </div>
                    ) : null}

                    <p className="text-sm font-semibold text-white/90">
                      Toute personne qui scanne ce code sera ajoutée
                      instantanément à ta liste d’amis !
                    </p>
                    <p className="font-mono text-sm font-bold tracking-[0.2em] text-white">
                      {friendCode}
                    </p>

                    <button
                      type="button"
                      onClick={share}
                      className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-white/25 bg-white/15 px-4 py-2.5 font-heading text-sm font-extrabold text-white transition-transform active:scale-95"
                    >
                      <Share2 className="size-4" aria-hidden="true" />
                      Partager
                    </button>
                    {copied ? (
                      <span className="text-xs font-bold text-highlight">
                        Lien copié !
                      </span>
                    ) : null}
                  </motion.div>
                </motion.div>
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </>
  )
}
