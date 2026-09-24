'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { QRCodeSVG } from 'qrcode.react'
import { QrCode, Share2, UserPlus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useDialogFocus } from '@/lib/use-dialog'
import { useSortieAnimee } from '@/components/useSortieAnimee'
import { useFermeAuMasquage } from '@/components/useFermeAuMasquage'

interface FriendQrButtonProps {
  /** Code ami de l'élève (profiles.friend_code) — encodé dans le QR. */
  friendCode: string
}

/**
 * Le bouton « Mon QR code » de l'onglet Amis : ouvre une modale avec MON QR —
 * quiconque le scanne devient mon ami (route /amis/ajouter/<code>).
 * (Déplacé depuis la rangée sociale de l'arène Défi.)
 *
 * Bouton et fenêtre ont été verts (un dégradé à eux, un QR vert foncé) : le
 * vert est un état, pas une action, et cette fenêtre est la seule de l'app à
 * avoir sa propre couleur. Elle est blanche comme les autres, ses boutons sont
 * ceux de la maison, et le QR est noir sur blanc — ce qu'un lecteur lit le mieux.
 */
export default function FriendQrButton({ friendCode }: FriendQrButtonProps) {
  const [open, setOpen] = useState(false)
  useFermeAuMasquage(setOpen, false)
  const panel = useRef<HTMLDivElement>(null)
  useDialogFocus(panel, open)
  const [copied, setCopied] = useState(false)
  // Reste montée le temps de l'animation de sortie (CSS, sans framer-motion).
  const { monte, etat, onAnimationEnd } = useSortieAnimee(open)

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
      <Button
        type="button"
        variant="outline"
        size="lg"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className="w-full"
      >
        <QrCode aria-hidden="true" />
        Mon QR code à scanner
      </Button>

      {typeof document !== 'undefined'
        ? createPortal(
            monte ? (
                <div
                  data-etat={etat}
                  className="modale-voile fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4"
                  role="dialog"
                  aria-modal="true"
                  aria-label="Ajouter un ami par QR code"
                  onClick={() => setOpen(false)}
                >
                  <div
                    ref={panel}
                    data-etat={etat}
                    onAnimationEnd={onAnimationEnd}
                    className="modale-panneau flex w-full max-w-sm flex-col items-center gap-4 rounded-3xl bg-card p-6 text-center text-foreground shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)] ring-1 ring-foreground/10 outline-none"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex w-full items-center gap-3">
                      <UserPlus
                        className="size-5 shrink-0 text-primary"
                        aria-hidden="true"
                      />
                      <h2 className="font-heading min-w-0 flex-1 truncate text-left text-xl font-extrabold">
                        Ajouter un ami
                      </h2>
                      <button
                        type="button"
                        onClick={() => setOpen(false)}
                        aria-label="Fermer"
                        className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted active:scale-90"
                      >
                        <X className="size-5" strokeWidth={2.4} aria-hidden="true" />
                      </button>
                    </div>

                    {shareUrl ? (
                      <div className="rounded-2xl bg-white p-3 ring-1 ring-black/5">
                        <QRCodeSVG
                          value={shareUrl}
                          size={208}
                          marginSize={1}
                          aria-label="Ton QR code ami — à faire scanner"
                        />
                      </div>
                    ) : null}

                    <p className="text-sm font-semibold text-muted-foreground">
                      Toute personne qui scanne ce code sera ajoutée
                      instantanément à ta liste d’amis !
                    </p>
                    <p className="font-mono text-sm font-bold tracking-[0.2em]">
                      {friendCode}
                    </p>

                    <Button type="button" size="lg" onClick={share} className="w-full">
                      <Share2 aria-hidden="true" />
                      Partager
                    </Button>
                    {copied ? (
                      <span className="text-xs font-bold text-success">
                        Lien copié !
                      </span>
                    ) : null}
                  </div>
                </div>
              ) : null,
            document.body,
          )
        : null}
    </>
  )
}
