'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { MENTIONS, noteNecessaire, phraseVerdict, type NotesAcquises, type Voie } from '@/lib/examen/simulateur'
import { enregistrerNotes } from '@/app/examen/actions'

const CHAMPS: { cle: keyof Omit<NotesAcquises, 'voie'>; label: string }[] = [
  { cle: 'controleContinu', label: 'Ta moyenne de l’année' },
  { cle: 'francaisEcrit', label: 'Français, écrit' },
  { cle: 'francaisOral', label: 'Français, oral' },
  { cle: 'mathsAnticipees', label: 'Maths anticipées' },
]

const lire = (v: string): number | null => {
  const n = Number(v.replace(',', '.'))
  return v.trim() !== '' && Number.isFinite(n) && n >= 0 && n <= 20 ? n : null
}
const ecrire = (n: number | null) => (n === null ? '' : String(n).replace('.', ','))

/**
 * « CE QU’IL TE FAUT EN JUIN » (maquette 6) : ses notes déjà acquises (le
 * contrôle continu, les épreuves anticipées de première), la mention visée, et
 * la moyenne qu’il lui faut sur la philosophie, ses spécialités et le Grand
 * oral. Le calcul est dans lib/examen/simulateur ; les notes sont gardées
 * (migration 585) pour qu’il n’ait à les taper qu’une fois.
 */
export default function Simulateur({ initial }: { initial: NotesAcquises }) {
  const [notes, setNotes] = useState(initial)
  const [cible, setCible] = useState(MENTIONS.find((m) => m.id === 'b') ?? MENTIONS[0])
  const minuteur = useRef<number | null>(null)
  const [invalides, setInvalides] = useState<string[]>([])
  const [perdu, setPerdu] = useState(false)
  useEffect(() => () => {
    if (minuteur.current) window.clearTimeout(minuteur.current)
  }, [])

  // Gardées 800 ms après la dernière frappe. Une note hors de 0-20 n'est ni
  // comptée ni enregistrée : le champ le dit, la note d'avant reste.
  const changer = (suite: NotesAcquises) => {
    setNotes(suite)
    if (minuteur.current) window.clearTimeout(minuteur.current)
    minuteur.current = window.setTimeout(() => {
      void enregistrerNotes(suite).then((r) => setPerdu(!r.ok))
    }, 800)
  }

  const verdict = noteNecessaire(notes, cible.seuil)

  return (
    <section className="carte p-3.5" aria-labelledby="examen-simulateur">
      <div className="flex items-baseline justify-between gap-2">
        <h2 id="examen-simulateur" className="font-heading text-[17px] font-extrabold">
          Ce qu’il te faut en juin
        </h2>
        <div className="bg-secondary flex rounded-full p-0.5" role="radiogroup" aria-label="Ta voie">
          {(['generale', 'technologique'] as Voie[]).map((v) => (
            <button
              key={v}
              type="button"
              role="radio"
              aria-checked={notes.voie === v}
              onClick={() => changer({ ...notes, voie: v })}
              className={cn('min-h-8 rounded-full px-2.5 text-[11px] font-extrabold', notes.voie === v ? 'bg-card text-foreground shadow-sm' : 'text-primary')}
            >
              {v === 'generale' ? 'Générale' : 'Techno'}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-1.5">
        {CHAMPS.map((c) => (
          <label
            key={c.cle}
            className={cn('bg-secondary/60 rounded-xl px-2.5 py-1.5', invalides.includes(c.cle) && 'ring-destructive ring-2')}
          >
            <span className="text-muted-foreground block text-[10.5px] leading-tight font-bold">{c.label}</span>
            <span className="flex items-baseline gap-1">
              <input
                inputMode="decimal"
                defaultValue={ecrire(notes[c.cle])}
                placeholder="—"
                aria-label={`${c.label}, sur 20`}
                aria-invalid={invalides.includes(c.cle) || undefined}
                onChange={(e) => {
                  const v = e.target.value
                  const n = lire(v)
                  const faux = v.trim() !== '' && n === null
                  setInvalides((l) => (faux ? [...l.filter((x) => x !== c.cle), c.cle] : l.filter((x) => x !== c.cle)))
                  if (!faux) changer({ ...notes, [c.cle]: n })
                }}
                className="font-heading w-full min-w-0 bg-transparent text-[19px] leading-tight font-extrabold outline-none placeholder:text-[color-mix(in_oklch,var(--primary),white_55%)]"
              />
              <span className="text-muted-foreground text-[11px] font-bold">/20</span>
            </span>
          </label>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-4 gap-1" role="radiogroup" aria-label="La mention visée">
        {MENTIONS.filter((m) => m.id !== 'admis').map((m) => (
          <button
            key={m.id}
            type="button"
            role="radio"
            aria-checked={cible.id === m.id}
            onClick={() => {
              sfx.tap()
              setCible(m)
            }}
            className={cn(
              'min-h-11 rounded-xl px-0.5 text-center text-[11px] leading-tight font-extrabold',
              cible.id === m.id ? 'bg-primary text-primary-foreground' : 'bg-secondary text-primary',
            )}
          >
            {m.label}
            <span className="block text-[10px] opacity-75">{m.seuil}</span>
          </button>
        ))}
      </div>

      <div
        aria-live="polite"
        className="mt-2 flex items-center gap-2.5 rounded-2xl px-3 py-2.5"
        style={{ background: 'color-mix(in oklch, var(--highlight), white 75%)' }}
      >
        {verdict.etat === 'possible' || verdict.etat === 'hors-de-portee' ? (
          <b className="font-heading text-accent-foreground shrink-0 text-[30px] leading-none font-extrabold tabular-nums">
            {String(verdict.moyenne).replace('.', ',')}
          </b>
        ) : null}
        <p className="text-accent-foreground text-[12px] leading-snug font-bold">{phraseVerdict(verdict, cible)}</p>
      </div>
      {invalides.length > 0 ? (
        <p role="alert" className="text-destructive mt-1.5 text-[11.5px] font-bold">Une note se donne entre 0 et 20.</p>
      ) : perdu ? (
        <p role="status" className="text-muted-foreground mt-1.5 text-[11.5px] font-bold">Tes notes ne sont pas enregistrées : le calcul reste juste, réessaie plus tard.</p>
      ) : null}
      <p className="text-muted-foreground mt-1.5 text-[10.5px] leading-snug font-semibold">
        Coefficients de la session 2027 : contrôle continu 40, français 5 + 5, maths anticipées 2, philosophie, spécialités et Grand oral pour le reste.
      </p>
    </section>
  )
}
