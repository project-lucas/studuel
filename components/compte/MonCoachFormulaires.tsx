'use client'

import { useState, useTransition } from 'react'
import { quitterGroupe, rejoindreGroupe } from '@/app/compte/coach-actions'
import { afficherCode, codeValide, normaliserCode } from '@/lib/coach/code'

export default function MonCoachFormulaires({ rattache }: { rattache: boolean }) {
  const [enCours, startTransition] = useTransition()
  const [erreur, setErreur] = useState<string | null>(null)
  const [confirme, setConfirme] = useState(false)
  const [valeur, setValeur] = useState('')

  if (rattache) {
    return (
      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
        {confirme ? (
          <>
            <span className="font-semibold text-muted-foreground">Quitter le groupe ? Ton coach ne te verra plus.</span>
            <button
              type="button"
              disabled={enCours}
              onClick={() =>
                startTransition(async () => {
                  const r = await quitterGroupe()
                  if (!r.ok) setErreur(r.erreur)
                })
              }
              className="h-9 rounded-full bg-(--destructive) px-3 font-extrabold text-white disabled:opacity-50"
            >
              Oui, quitter
            </button>
            <button type="button" onClick={() => setConfirme(false)} className="h-9 px-2 font-bold text-muted-foreground">
              Non
            </button>
          </>
        ) : (
          <button type="button" onClick={() => setConfirme(true)} className="font-medium text-primary underline underline-offset-4">
            Quitter le groupe
          </button>
        )}
        {erreur ? <span className="font-bold text-(--destructive)" role="alert">{erreur}</span> : null}
      </div>
    )
  }

  const code = normaliserCode(valeur)
  return (
    <form
      className="mt-3 flex gap-2"
      action={(fd) =>
        startTransition(async () => {
          const r = await rejoindreGroupe(fd)
          if (!r.ok) setErreur(r.erreur)
          else setErreur(null)
        })
      }
    >
      <input
        name="code"
        value={afficherCode(code)}
        onChange={(e) => {
          setValeur(e.target.value)
          setErreur(null)
        }}
        autoCapitalize="characters"
        autoComplete="off"
        spellCheck={false}
        maxLength={9}
        placeholder="ABCD EFGH"
        aria-label="Code du groupe"
        className="font-heading h-11 min-w-0 flex-1 rounded-xl border bg-background px-3 text-center text-base font-extrabold tracking-[0.18em] uppercase outline-none focus:border-primary"
      />
      <button
        type="submit"
        disabled={!codeValide(code) || enCours}
        className="font-heading h-11 shrink-0 rounded-full bg-primary px-4 text-sm font-extrabold text-primary-foreground disabled:opacity-50"
      >
        Rejoindre
      </button>
      {erreur ? <p className="basis-full text-sm font-bold text-(--destructive)" role="alert">{erreur}</p> : null}
    </form>
  )
}
