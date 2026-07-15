'use client'

import { useState } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { Button } from '@/components/ui/button'

// Bouton « quitter » d'une activité (quiz, examen blanc, révision…) qui, quand
// une session est en cours (`guarded`), demande confirmation façon Duolingo
// (« Tu nous quittes déjà ? — tu perdras ta progression »). Sans progression à
// perdre, il se comporte comme BackButton (retour direct).
//
// La modale passe par un portail sur <body> : l'écran d'activité est posé en
// marges négatives / plein écran, un overlay ancré ailleurs évite tout piège de
// z-index ou de contexte d'empilement.
export default function QuitGuardButton({
  fallback,
  guarded = true,
  label = 'Quitter',
  className,
  children,
  title = 'Tu nous quittes déjà ?',
  body = 'Si tu quittes maintenant, tu perdras ta progression sur cette activité.',
}: {
  fallback: string
  guarded?: boolean
  label?: string
  className?: string
  children?: React.ReactNode
  title?: string
  body?: string
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  // Retour réel si l'historique interne existe (le bouton retour du téléphone
  // reste cohérent), sinon remontée au parent logique — même règle que
  // BackButton.
  const leave = () => {
    if (window.history.length > 2) router.back()
    else router.push(fallback)
  }

  const onClick = () => {
    sfx.tap()
    if (guarded) setOpen(true)
    else leave()
  }

  return (
    <>
      <button
        type="button"
        aria-label={label}
        title={label}
        onClick={onClick}
        className={cn(
          'inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-card text-foreground shadow-sm transition-transform active:scale-95',
          className,
        )}
      >
        {children}
      </button>

      {open && typeof document !== 'undefined'
        ? createPortal(
            <div
              role="dialog"
              aria-modal="true"
              aria-label={title}
              className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 p-4 sm:items-center"
              onClick={() => setOpen(false)}
            >
              <div
                className="w-full max-w-sm rounded-3xl bg-card p-6 text-center shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src="/images/mascotte/flamme-affamee.webp"
                  alt=""
                  width={96}
                  height={96}
                  className="mx-auto size-24 object-contain"
                />
                <h2 className="font-heading mt-2 text-2xl font-bold text-foreground">
                  {title}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">{body}</p>

                <Button
                  size="lg"
                  className="mt-6 w-full rounded-full font-bold"
                  onClick={() => {
                    sfx.tap()
                    setOpen(false)
                  }}
                >
                  Continuer à apprendre
                </Button>
                <button
                  type="button"
                  onClick={() => {
                    sfx.tap()
                    setOpen(false)
                    leave()
                  }}
                  className="mt-3 w-full py-2 text-sm font-bold text-destructive transition-opacity hover:opacity-80"
                >
                  Quitter
                </button>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  )
}
