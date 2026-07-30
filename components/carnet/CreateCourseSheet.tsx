'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, SquarePen } from 'lucide-react'
import { sfx } from '@/lib/sounds'
import { MAX_TITLE_LEN } from '@/lib/carnet-cours'
import { createCourse } from '@/app/reviser/cours/actions'
import BottomSheet from '@/components/carnet/BottomSheet'

/**
 * La feuille « Nouveau cours », partagée par le + flottant (CarnetFab) et la
 * carte IA du carnet : le NOM d'abord (fini les « Nouveau cours » fantômes qui
 * rendaient la liste illisible), puis les deux façons de démarrer — écrire ses
 * questions soi-même, ou les faire rédiger par l'IA (`?ia=1` ouvre sa feuille
 * directement sur l'écran du cours).
 */
export default function CreateCourseSheet({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [pending, startTransition] = useTransition()
  const [failed, setFailed] = useState(false)

  const ready = name.trim().length > 0

  const create = (withAi: boolean) => {
    if (pending || !ready) return
    sfx.tap()
    setFailed(false)
    startTransition(async () => {
      const res = await createCourse(name.trim())
      if (res.ok && res.id) {
        onClose()
        setName('')
        router.push(`/reviser/cours/${res.id}${withAi ? '?ia=1' : ''}`)
      } else {
        setFailed(true)
      }
    })
  }

  return (
    <BottomSheet open={open} onClose={onClose} title="Nouveau cours">
      <div className="flex flex-col gap-2.5">
        {/* 1. Le nom, d'abord : c'est lui qui rend la liste lisible. */}
        <label className="flex flex-col gap-1.5">
          <span className="px-1 text-xs font-bold text-muted-foreground">
            Le nom de ton cours
          </span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={MAX_TITLE_LEN}
            autoFocus
            placeholder="Anglais — verbes irréguliers"
            aria-label="Nom du cours"
            className="min-h-12 rounded-2xl border border-black/10 bg-white px-4 text-base font-semibold text-foreground outline-none placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-primary/40"
          />
        </label>

        {/* 2. Les deux façons de le remplir, au même niveau. */}
        <button
          type="button"
          disabled={pending || !ready}
          onClick={() => create(false)}
          className="flex cursor-pointer items-center gap-3 rounded-2xl bg-primary px-4 py-3.5 text-left text-primary-foreground shadow-sm transition active:translate-y-px disabled:opacity-50"
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
          disabled={pending || !ready}
          onClick={() => create(true)}
          className="flex cursor-pointer items-center gap-3 rounded-2xl bg-highlight/25 px-4 py-3.5 text-left text-foreground ring-1 ring-highlight/50 transition active:translate-y-px disabled:opacity-50"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-highlight/60">
            <Sparkles className="size-5" strokeWidth={2.4} aria-hidden="true" />
          </span>
          <span className="min-w-0">
            <span className="font-heading block text-sm font-extrabold">
              Questions écrites par l&apos;IA
            </span>
            <span className="block text-xs text-muted-foreground">
              Colle ton cours ou donne un thème, elle rédige — tu valides
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
  )
}
