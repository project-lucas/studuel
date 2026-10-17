'use client'

import { useState, useTransition } from 'react'
import { Check, X } from 'lucide-react'
import { oublierCodeCoach, verifierCodeCoach } from '@/app/bienvenue/coach-actions'
import { afficherCode, codeValide, libelleGroupe, normaliserCode } from '@/lib/coach/code'

/**
 * « J'AI UN CODE » — sur l'écran d'intro de l'onboarding (13/10/2026, Lucas :
 * « le joueur de basket cliquera "j'ai un code", créera son compte et sera
 * automatiquement ajouté à mon interface coach »).
 *
 * Trois états : un lien discret ; le champ du code et « Rejoindre » ; puis le
 * badge « Tu rejoins U15 · coach Lucas » avec « Changer ». Le code est vérifié
 * par le serveur avant le compte (l'aperçu est public) ; le rattachement
 * lui-même se fait à l'ouverture de la session. Le parcours continue ensuite
 * comme pour tout le monde — le joueur a la même app que n'importe qui.
 */
export default function CodeCoach({
  groupe,
  onCode,
  onRetrait,
}: {
  /** Le libellé du groupe déjà vérifié (brouillon repris), ou null. */
  groupe: string | null
  onCode: (code: string, libelle: string) => void
  onRetrait: () => void
}) {
  const [ouvert, setOuvert] = useState(false)
  const [valeur, setValeur] = useState('')
  const [erreur, setErreur] = useState<string | null>(null)
  const [enCours, startTransition] = useTransition()

  if (groupe) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-2xl bg-white/70 px-4 py-3 text-left shadow-sm ring-2 ring-primary/15">
        <span className="flex min-w-0 items-center gap-2 text-[14px] font-extrabold" style={{ color: 'var(--onb-ink)' }}>
          <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
            <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
          </span>
          <span className="truncate">Tu rejoins {groupe}</span>
        </span>
        <button
          type="button"
          onClick={() => {
            onRetrait()
            setValeur('')
            setOuvert(true)
            void oublierCodeCoach()
          }}
          className="shrink-0 text-[13px] font-bold underline underline-offset-4"
          style={{ color: 'var(--onb-mut)' }}
        >
          Changer
        </button>
      </div>
    )
  }

  if (!ouvert) {
    return (
      <button
        type="button"
        onClick={() => setOuvert(true)}
        className="mx-auto -my-1 px-2 py-3 text-[14px] font-extrabold underline underline-offset-4"
        style={{ color: 'var(--onb-mut)' }}
      >
        J&apos;ai un code de coach
      </button>
    )
  }

  const code = normaliserCode(valeur)
  const pret = codeValide(code) && !enCours

  const envoyer = () => {
    if (!pret) return
    setErreur(null)
    startTransition(async () => {
      const r = await verifierCodeCoach(code)
      if (!r.ok) {
        setErreur('Code inconnu — vérifie-le avec ton coach.')
        return
      }
      onCode(r.code, libelleGroupe(r.nom, r.categorie, r.coach))
    })
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        envoyer()
      }}
      className="rounded-2xl bg-white/70 p-3 text-left shadow-sm ring-2 ring-primary/15"
    >
      <div className="flex items-center justify-between gap-2">
        <label htmlFor="code-coach" className="text-[13px] font-extrabold" style={{ color: 'var(--onb-ink)' }}>
          Le code de ton coach
        </label>
        <button
          type="button"
          onClick={() => {
            setOuvert(false)
            setErreur(null)
          }}
          aria-label="Fermer"
          className="grid size-7 place-items-center rounded-full"
          style={{ color: 'var(--onb-mut)' }}
        >
          <X className="size-4" strokeWidth={2.6} aria-hidden="true" />
        </button>
      </div>
      <div className="mt-2 flex gap-2">
        <input
          id="code-coach"
          value={afficherCode(code)}
          onChange={(e) => {
            setValeur(e.target.value)
            setErreur(null)
          }}
          autoCapitalize="characters"
          autoComplete="off"
          spellCheck={false}
          inputMode="text"
          maxLength={9}
          placeholder="ABCD EFGH"
          aria-invalid={erreur ? true : undefined}
          className="font-heading h-11 min-w-0 flex-1 rounded-xl border-2 border-primary/20 bg-white px-3 text-center text-[18px] font-extrabold tracking-[0.18em] uppercase outline-none focus:border-primary"
          style={{ color: 'var(--onb-ink)' }}
        />
        <button
          type="submit"
          disabled={!pret}
          className="font-heading h-11 shrink-0 rounded-xl bg-primary px-4 text-[14px] font-extrabold text-primary-foreground shadow-[0_3px_0_var(--onb-ink)] disabled:opacity-50"
        >
          {enCours ? '…' : 'Rejoindre'}
        </button>
      </div>
      {erreur ? (
        <p className="mt-2 text-[12.5px] font-bold text-destructive" role="alert">
          {erreur}
        </p>
      ) : (
        <p className="mt-2 text-[12px] font-semibold" style={{ color: 'var(--onb-mut)' }}>
          8 lettres et chiffres, donnés par ton coach. Tu continues ensuite comme tout le monde.
        </p>
      )}
    </form>
  )
}
