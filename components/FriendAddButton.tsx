'use client'

import { useEffect, useState, useTransition } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Check, Copy, UserPlus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import FriendQrButton from '@/components/FriendQrButton'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { addFriendByCode } from '@/app/amis/actions'

/**
 * « Ajouter un ami » de l'onglet Amis, version bouton-icône : un rond en haut
 * à droite de la page qui ouvre une modale avec tout le nécessaire — mon QR à
 * faire scanner, mon code à copier, et le champ « code d'un ami ».
 * (Remplace l'ancienne grande carte en bas de page.)
 */
export default function FriendAddButton({
  myFriendCode,
}: {
  myFriendCode: string
}) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [copyFailed, setCopyFailed] = useState(false)
  const [code, setCode] = useState('')
  const [feedback, setFeedback] = useState<{
    ok: boolean
    message: string
  } | null>(null)
  const [isAdding, startAdding] = useTransition()
  const reduce = useReducedMotion()

  // Fermeture au clavier (Échap), comme les autres modales de l'app.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const copyCode = async () => {
    if (!myFriendCode) return
    try {
      await navigator.clipboard.writeText(myFriendCode)
      setCopyFailed(false)
      setCopied(true)
      sfx.tap()
      setTimeout(() => setCopied(false), 1600)
    } catch {
      // Presse-papiers indisponible (contexte non sécurisé, permission…) :
      // on le dit au lieu de laisser un tap sans effet.
      setCopyFailed(true)
    }
  }

  const submitCode = (e: React.FormEvent) => {
    e.preventDefault()
    const value = code.trim()
    if (!value || isAdding) return
    sfx.tap()
    startAdding(async () => {
      const res = await addFriendByCode(value)
      setFeedback(res)
      if (res.ok) setCode('')
    })
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
        aria-label="Ajouter un ami"
        className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition active:scale-95"
      >
        <UserPlus className="size-5" strokeWidth={2.4} aria-hidden="true" />
      </button>

      {typeof document !== 'undefined'
        ? createPortal(
            <AnimatePresence>
              {open ? (
                <motion.div
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4"
                  role="dialog"
                  aria-modal="true"
                  aria-label="Ajouter un ami"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  onClick={() => setOpen(false)}
                >
                  <motion.div
                    className="flex w-full max-w-sm flex-col gap-3 rounded-3xl bg-card p-5 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)] ring-1 ring-foreground/10"
                    initial={reduce ? { opacity: 0 } : { scale: 0.9, opacity: 0 }}
                    animate={reduce ? { opacity: 1 } : { scale: 1, opacity: 1 }}
                    exit={reduce ? { opacity: 0 } : { scale: 0.9, opacity: 0 }}
                    transition={{ type: 'tween', duration: 0.2, ease: 'easeOut' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-2">
                      <UserPlus
                        className="size-5 shrink-0 text-primary"
                        strokeWidth={2.4}
                        aria-hidden="true"
                      />
                      <h2 className="font-heading min-w-0 flex-1 truncate text-lg font-bold">
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

                    <p className="text-sm text-muted-foreground">
                      Fais scanner ton QR code : vous devenez amis direct. Par
                      code, ton ami reçoit une demande à accepter.
                    </p>

                    {/* Mon QR à faire scanner — quiconque le scanne devient mon ami. */}
                    {myFriendCode ? (
                      <FriendQrButton friendCode={myFriendCode} />
                    ) : null}

                    <button
                      type="button"
                      onClick={copyCode}
                      disabled={!myFriendCode}
                      aria-label={
                        myFriendCode
                          ? `Copier ton code ${myFriendCode}`
                          : 'Code indisponible'
                      }
                      className="flex items-center justify-between gap-2 rounded-full border bg-muted/50 px-4 py-2 font-mono text-sm font-bold transition-colors hover:bg-muted disabled:opacity-60"
                    >
                      {myFriendCode || '——————'}
                      {copied ? (
                        <Check className="size-4 text-green-600" />
                      ) : (
                        <Copy className="size-4 text-muted-foreground" />
                      )}
                    </button>
                    {copyFailed ? (
                      <p role="status" className="px-1 text-xs text-destructive">
                        Copie impossible sur cet appareil — recopie ton code à
                        la main.
                      </p>
                    ) : null}

                    <form className="flex items-center gap-2" onSubmit={submitCode}>
                      <input
                        type="text"
                        value={code}
                        onChange={(e) => {
                          setCode(e.target.value.toUpperCase())
                          if (feedback) setFeedback(null)
                        }}
                        maxLength={10}
                        autoCapitalize="characters"
                        autoComplete="off"
                        placeholder="Code d’un ami…"
                        aria-label="Entrer le code d’un ami"
                        className="h-10 min-w-0 flex-1 rounded-full border bg-card px-4 font-mono text-sm tracking-wide uppercase outline-none placeholder:font-sans placeholder:normal-case placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40"
                      />
                      <Button
                        type="submit"
                        className="rounded-full"
                        disabled={isAdding || code.trim().length === 0}
                      >
                        {isAdding ? (
                          'Envoi…'
                        ) : (
                          <>
                            Ajouter <ArrowRight className="size-4" />
                          </>
                        )}
                      </Button>
                    </form>
                    {feedback ? (
                      <p
                        role="status"
                        aria-live="polite"
                        className={cn(
                          'px-1 text-sm font-medium',
                          feedback.ok
                            ? 'text-green-700 dark:text-green-400'
                            : 'text-destructive',
                        )}
                      >
                        {feedback.message}
                      </p>
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
