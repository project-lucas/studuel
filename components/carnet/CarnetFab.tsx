'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Sparkles, SquarePen } from 'lucide-react'
import { sfx } from '@/lib/sounds'
import { createCourse } from '@/app/reviser/cours/actions'
import BottomSheet from '@/components/carnet/BottomSheet'

/**
 * Le bouton flottant de Mon carnet : « + » ancré en bas à droite, au-dessus de
 * la barre d'onglets, qui ouvre les DEUX façons de démarrer un cours.
 *
 * Pourquoi flottant : la création vivait dans l'en-tête de l'étagère « Mes
 * cours » — donc hors de l'écran dès qu'on avait quelques cours, et hors de
 * portée du pouce. Or créer est l'action qui donne envie de revenir : elle doit
 * être atteignable de partout dans la liste, sans remonter.
 *
 * Les deux voies mènent au même écran de cours ; l'IA y ouvre directement sa
 * feuille (`?ia=1`), pour que « je veux 10 questions sur les fractions » tienne
 * en deux taps au lieu de cinq.
 */
export default function CarnetFab() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()
  const [failed, setFailed] = useState(false)

  const create = (withAi: boolean) => {
    if (pending) return
    sfx.tap()
    setFailed(false)
    startTransition(async () => {
      const res = await createCourse()
      if (res.ok && res.id) {
        setOpen(false)
        router.push(`/reviser/cours/${res.id}${withAi ? '?ia=1' : ''}`)
      } else {
        setFailed(true)
      }
    })
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          sfx.tap()
          setFailed(false)
          setOpen(true)
        }}
        aria-haspopup="dialog"
        aria-label="Créer un cours"
        className="press-3d-deep fixed right-4 bottom-24 z-40 flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg transition-transform md:bottom-8"
      >
        <Plus className="size-7" strokeWidth={2.6} aria-hidden="true" />
      </button>

      <BottomSheet
        open={open}
        onClose={() => setOpen(false)}
        title="Nouveau cours"
      >
        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            disabled={pending}
            onClick={() => create(false)}
            className="flex cursor-pointer items-center gap-3 rounded-2xl bg-primary px-4 py-3.5 text-left text-primary-foreground shadow-sm transition active:translate-y-px disabled:opacity-60"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/20">
              <SquarePen className="size-5" strokeWidth={2.4} aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="font-heading block text-sm font-extrabold">
                Cours vide
              </span>
              <span className="block text-xs opacity-80">
                Tu écris tes questions toi-même
              </span>
            </span>
          </button>

          <button
            type="button"
            disabled={pending}
            onClick={() => create(true)}
            className="flex cursor-pointer items-center gap-3 rounded-2xl bg-highlight/25 px-4 py-3.5 text-left text-foreground ring-1 ring-highlight/50 transition active:translate-y-px disabled:opacity-60"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-highlight/60">
              <Sparkles className="size-5" strokeWidth={2.4} aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="font-heading block text-sm font-extrabold">
                Cours généré par l&apos;IA
              </span>
              <span className="block text-xs text-muted-foreground">
                Donne un thème, elle écrit les questions
              </span>
            </span>
          </button>

          {failed ? (
            <p
              role="alert"
              className="rounded-2xl bg-destructive/10 px-3 py-2 text-xs font-semibold text-destructive"
            >
              La création a échoué. Réessaie dans un instant.
            </p>
          ) : null}
          {pending ? (
            <p className="text-center text-xs font-semibold text-muted-foreground">
              Création du cours…
            </p>
          ) : null}
        </div>
      </BottomSheet>
    </>
  )
}
