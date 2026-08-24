'use client'

import { useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { Button } from '@/components/ui/button'
import DialogCloseButton from '@/components/DialogCloseButton'
import { useDialogFocus } from '@/lib/use-dialog'

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
  const panel = useRef<HTMLDivElement>(null)
  useDialogFocus(panel, open)

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
                ref={panel}
                className="relative w-full max-w-sm rounded-3xl bg-card p-6 text-center shadow-2xl outline-none"
                onClick={(e) => e.stopPropagation()}
              >
                <DialogCloseButton
                  onClose={() => {
                    sfx.tap()
                    setOpen(false)
                  }}
                />
                {/* LA MASCOTTE, pas la flamme. La flamme est le signe de la
                    SÉRIE dans toute l'app (et seulement d'elle, cf. la charte) :
                    la voir surgir au moment de quitter laissait croire qu'on
                    perdait sa série, alors qu'on ne perd que la session en
                    cours. Le dessin dit la vraie chose — quelqu'un qui te
                    regarde partir. Détouré depuis l'original 4000×4000 par
                    scripts/mascotte-quitter.mjs (le fond y était PEINT). */}
                <Image
                  src="/images/mascotte/quitte-deja.webp"
                  alt=""
                  width={512}
                  height={512}
                  sizes="128px"
                  className="mx-auto size-32 object-contain"
                />
                <h2 className="font-heading mt-1 text-2xl font-bold text-balance text-foreground">
                  {title}
                </h2>
                <p className="mt-2 text-sm text-pretty text-muted-foreground">
                  {body}
                </p>

                <Button
                  size="lg"
                  className="mt-6 w-full rounded-full font-bold"
                  onClick={() => setOpen(false)}
                >
                  Continuer à apprendre
                </Button>
                {/* « Quitter » est un VRAI BOUTON, pas un mot posé sous le
                    CTA. Réduit à son texte, il ne se donnait ni la taille ni
                    la matière des autres boutons de l'app : on hésitait à
                    savoir où appuyer, et la cible tactile ne faisait que la
                    largeur du mot au lieu de toute la modale.
                    La hiérarchie tient à la ROBE, pas à la forme : le violet
                    plein garde l'action qu'on veut voir choisie, le corail
                    doux (`destructive`) porte celle qui coûte. */}
                <Button
                  variant="destructive"
                  size="lg"
                  className="mt-3 w-full rounded-full font-bold"
                  onClick={() => {
                    setOpen(false)
                    leave()
                  }}
                >
                  Quitter
                </Button>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  )
}
