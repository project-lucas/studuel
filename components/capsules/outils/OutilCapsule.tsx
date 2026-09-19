'use client'

import { useState } from 'react'
import { Check, Moon, PiggyBank } from 'lucide-react'
import type { CapsuleOutil } from '@/lib/capsules'
import {
  euros,
  heuresDeCoucher,
  libelleMois,
  lireCoches,
  lireGrille,
  planEpargne,
  progressionListe,
  remplissageGrille,
  type GrillePlanning,
} from '@/lib/capsule-outils'
import { useEtatLocal } from '@/components/capsules/outils/useEtatLocal'
import { sfx } from '@/lib/sounds'
import { cn } from '@/lib/utils'

/** L'outil d'une capsule, selon son type. Son état reste dans ce navigateur. */
export default function OutilCapsule({
  capsuleId,
  outil,
}: {
  capsuleId: string
  outil: CapsuleOutil
}) {
  const cle = `studuel:capsule:${capsuleId}:outil`
  return (
    <div className="flex flex-col gap-3">
      {outil.intro ? <p className="px-1 text-sm font-semibold text-muted-foreground">{outil.intro}</p> : null}
      {outil.kind === 'checklist' ? (
        <Checklist cle={cle} items={outil.items} />
      ) : outil.kind === 'planning' ? (
        <Planning cle={cle} jours={outil.jours} moments={outil.moments} activites={outil.activites} />
      ) : outil.modele === 'sommeil' ? (
        <CalculateurSommeil />
      ) : (
        <CalculateurBudget cle={cle} />
      )}
    </div>
  )
}

// ---------------------------------------------------------------- checklist

function Checklist({ cle, items }: { cle: string; items: string[] }) {
  const [coches, setCoches] = useEtatLocal<boolean[]>(
    cle,
    items.map(() => false),
    (raw) => lireCoches(raw, items.length),
  )
  const p = progressionListe(coches)

  return (
    <div className="rounded-3xl bg-card p-3 ring-1 ring-border">
      <div className="mb-2 flex items-center justify-between gap-3 px-1">
        <p className="text-sm font-extrabold">{p.message}</p>
        <p className="font-heading text-sm font-extrabold text-primary tabular-nums">
          {p.faits}/{p.total}
        </p>
      </div>
      <div className="mb-3 h-2 overflow-hidden rounded-full bg-muted">
        <i className="block h-full rounded-full bg-primary transition-[width]" style={{ width: `${Math.round(p.ratio * 100)}%` }} />
      </div>
      <ul className="flex flex-col gap-1.5">
        {items.map((item, i) => {
          const fait = coches[i] === true
          return (
            <li key={item}>
              <button
                type="button"
                role="checkbox"
                aria-checked={fait}
                onClick={() => {
                  sfx.tap()
                  setCoches(coches.map((c, j) => (j === i ? !c : c)))
                }}
                className={cn(
                  'flex w-full cursor-pointer items-start gap-3 rounded-2xl px-3 py-2.5 text-left text-sm font-semibold ring-1 transition-colors',
                  fait ? 'bg-secondary ring-primary/25' : 'bg-background ring-border',
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border-2',
                    fait ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card',
                  )}
                >
                  {fait ? <Check className="size-3.5" strokeWidth={3.2} /> : null}
                </span>
                <span className={cn(fait && 'text-muted-foreground line-through decoration-2')}>{item}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

// ----------------------------------------------------------------- planning

function Planning({
  cle,
  jours,
  moments,
  activites,
}: {
  cle: string
  jours: string[]
  moments: string[]
  activites: string[]
}) {
  const vide = jours.map(() => moments.map(() => ''))
  const [grille, setGrille] = useEtatLocal<GrillePlanning>(cle, vide, (raw) =>
    lireGrille(raw, jours.length, moments.length, activites),
  )
  const { remplis, total } = remplissageGrille(grille)

  const choisir = (j: number, m: number, activite: string) => {
    setGrille(grille.map((ligne, jj) => ligne.map((c, mm) => (jj === j && mm === m ? activite : c))))
  }

  return (
    <div className="rounded-3xl bg-card p-3 ring-1 ring-border">
      <p className="mb-2 px-1 text-sm font-extrabold">
        {remplis === 0
          ? 'Choisis une activité par créneau.'
          : `${remplis} créneau${remplis > 1 ? 'x' : ''} sur ${total} : ta semaine prend forme.`}
      </p>
      <ul className="flex flex-col gap-2">
        {jours.map((jour, j) => (
          <li key={jour} className="rounded-2xl bg-background p-2.5 ring-1 ring-border">
            <p className="font-heading mb-1.5 px-1 text-sm font-extrabold">{jour}</p>
            <div className="grid grid-cols-2 gap-2">
              {moments.map((moment, m) => (
                <label key={moment} className="flex min-w-0 flex-col gap-1 text-[11px] font-bold text-muted-foreground">
                  {moment}
                  <select
                    value={grille[j]?.[m] ?? ''}
                    onChange={(e) => choisir(j, m, e.target.value)}
                    className={cn(
                      'h-10 w-full min-w-0 rounded-xl border px-2 text-xs font-bold',
                      grille[j]?.[m] ? 'border-primary/40 bg-secondary text-secondary-foreground' : 'bg-card text-foreground',
                    )}
                  >
                    <option value="">—</option>
                    {activites.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

// --------------------------------------------------------------- sommeil

function CalculateurSommeil() {
  const [reveil, setReveil] = useState('07:00')
  const couchers = heuresDeCoucher(reveil)

  return (
    <div className="rounded-3xl bg-card p-4 ring-1 ring-border">
      <label htmlFor="capsule-reveil" className="flex items-center gap-2 text-sm font-extrabold">
        <Moon className="size-4 text-primary" strokeWidth={2.4} aria-hidden="true" />
        À quelle heure te lèves-tu&nbsp;?
      </label>
      <input
        id="capsule-reveil"
        type="time"
        value={reveil}
        onChange={(e) => setReveil(e.target.value)}
        className="font-heading mt-2 h-12 w-full rounded-xl border bg-background px-3 text-lg font-extrabold"
      />
      {couchers.length > 0 ? (
        <ul className="mt-3 flex flex-col gap-2" aria-live="polite">
          {couchers.map((c) => (
            <li
              key={c.cycles}
              className={cn(
                'flex items-center justify-between gap-3 rounded-2xl px-3 py-2.5 ring-1',
                c.conseille ? 'bg-secondary ring-primary/25' : 'bg-background ring-border',
              )}
            >
              <span>
                <span className="font-heading block text-2xl leading-none font-extrabold text-primary tabular-nums">
                  {c.heure}
                </span>
                <span className="text-xs font-bold text-muted-foreground">
                  {c.cycles} cycles · {c.sommeil} de sommeil
                </span>
              </span>
              <span className={cn('rounded-full px-2 py-0.5 text-[11px] font-extrabold', c.conseille ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground')}>
                {c.conseille ? 'Conseillé' : 'Nuit courte'}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
      <p className="mt-3 text-[11px] font-semibold text-muted-foreground">
        Compte environ 15 minutes pour t’endormir : c’est déjà inclus.
      </p>
    </div>
  )
}

// ----------------------------------------------------------------- budget

type Budget = { argent: string; depenses: string; objectif: string; deja: string }

const BUDGET_VIDE: Budget = { argent: '', depenses: '', objectif: '', deja: '' }

function lireBudget(raw: unknown): Budget {
  if (!raw || typeof raw !== 'object') return BUDGET_VIDE
  const o = raw as Record<string, unknown>
  const champ = (v: unknown) => (typeof v === 'string' && /^\d{0,6}([.,]\d{0,2})?$/.test(v) ? v : '')
  return { argent: champ(o.argent), depenses: champ(o.depenses), objectif: champ(o.objectif), deja: champ(o.deja) }
}

const nombre = (s: string) => (s.trim() === '' ? Number.NaN : Number(s.replace(',', '.')))

function CalculateurBudget({ cle }: { cle: string }) {
  const [b, setB] = useEtatLocal<Budget>(cle, BUDGET_VIDE, lireBudget)
  const plan = planEpargne({
    argentMensuel: nombre(b.argent),
    depensesMensuelles: nombre(b.depenses),
    objectif: nombre(b.objectif),
    dejaEconomise: b.deja.trim() === '' ? 0 : nombre(b.deja),
  })

  const champ = (id: keyof Budget, label: string) => (
    <label className="flex flex-col gap-1 text-xs font-bold">
      {label}
      <span className="relative">
        <input
          inputMode="decimal"
          value={b[id]}
          onChange={(e) => {
            const v = e.target.value
            if (/^\d{0,6}([.,]\d{0,2})?$/.test(v)) setB({ ...b, [id]: v })
          }}
          placeholder="0"
          className="h-11 w-full rounded-xl border bg-background pr-8 pl-3 text-base font-extrabold tabular-nums"
        />
        <span aria-hidden="true" className="absolute top-1/2 right-3 -translate-y-1/2 text-sm font-bold text-muted-foreground">
          €
        </span>
      </span>
    </label>
  )

  return (
    <div className="rounded-3xl bg-card p-4 ring-1 ring-border">
      <p className="flex items-center gap-2 text-sm font-extrabold">
        <PiggyBank className="size-4 text-primary" strokeWidth={2.4} aria-hidden="true" />
        Ton objectif d’épargne
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2.5">
        {champ('argent', 'Argent reçu par mois')}
        {champ('depenses', 'Dépenses par mois')}
        {champ('objectif', 'Prix de ton objectif')}
        {champ('deja', 'Déjà de côté')}
      </div>
      <p aria-live="polite" className="mt-4 rounded-2xl bg-secondary px-3 py-3 text-sm font-bold text-secondary-foreground">
        {plan.kind === 'incomplet'
          ? 'Remplis ce que tu reçois, ce que tu dépenses et le prix de ton objectif.'
          : plan.kind === 'atteint'
            ? 'Tu as déjà assez de côté : ton objectif est atteint !'
            : plan.kind === 'impossible'
              ? `Il te manque ${euros(plan.deficit)} chaque mois : pour avancer, dépense un peu moins ou attends une rentrée d’argent.`
              : `En mettant ${euros(plan.epargneMensuelle)} de côté chaque mois, tu y es dans ${libelleMois(plan.mois)}.`}
      </p>
    </div>
  )
}
