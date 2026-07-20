'use client'

import { useMemo, useState, useTransition } from 'react'
import { ChevronDown, Minus, Plus, TrendingDown, TrendingUp, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { removeGradeAction } from '@/app/moi/actions'
import AddGradeSheet, { type SubjectLite } from '@/components/AddGradeSheet'
import {
  anneeMatrix,
  displayedTrimestre,
  formatNote,
  trimestreDelta,
  trimestreOf,
  trimestreSummaries,
  trimestreTrendMessage,
  type SchoolGrade,
  type Trimestre,
} from '@/lib/notes'

// 'YYYY-MM-DD' → 'JJ/MM' (affichage compact des dernières notes).
const shortDate = (dayKey: string) => `${dayKey.slice(8, 10)}/${dayKey.slice(5, 7)}`

// -----------------------------------------------------------------------------
// « Tableau de l'année » : LE tableau scolaire de l'onglet Moi — une ardoise
// (`.moi-board`) où l'année est écrite à la craie : une ligne par matière, une
// colonne par trimestre (moyennes /20), moyenne générale en tête, tendance au
// bout de ligne. Filtres : trimestre (Année | T1 | T2 | T3) et matière quand la
// liste s'allonge. Le « + » ouvre la même feuille de saisie que « Mes notes ».
// Rendu depuis les props serveur : après un ajout, revalidatePath('/moi')
// rafraîchit la matrice ; `extra` couvre l'instant d'avant (fusion dédupliquée).
// -----------------------------------------------------------------------------

const TRI_FILTERS = [
  { id: 0, label: 'Année' },
  { id: 1, label: 'T1' },
  { id: 2, label: 'T2' },
  { id: 3, label: 'T3' },
] as const

// Au-delà de ce nombre de matières notées, le filtre matière apparaît.
const SUBJECT_FILTER_THRESHOLD = 4

function TrendIcon({ delta }: { delta: number | null }) {
  if (delta === null) return null
  if (delta >= 0.3)
    return (
      <TrendingUp
        className="size-3.5 text-highlight"
        aria-label={`En hausse de ${formatNote(delta)} point${delta >= 2 ? 's' : ''}`}
      />
    )
  if (delta <= -0.3)
    return (
      <TrendingDown
        className="size-3.5 opacity-70"
        aria-label={`En baisse de ${formatNote(-delta)} point${-delta >= 2 ? 's' : ''}`}
      />
    )
  return <Minus className="size-3.5 opacity-50" aria-label="Stable" />
}

export default function TableauAnnee({
  initial,
  subjects,
  today,
  needsMigration,
}: {
  initial: SchoolGrade[]
  subjects: SubjectLite[]
  today: string // clé UTC 'YYYY-MM-DD'
  needsMigration: boolean
}) {
  const [tri, setTri] = useState<0 | Trimestre>(0)
  const [subjFilter, setSubjFilter] = useState('all')
  const [adding, setAdding] = useState(false)
  // Notes ajoutées depuis CE tableau, en attendant le rafraîchissement serveur.
  const [extra, setExtra] = useState<SchoolGrade[]>([])
  // Notes retirées en optimiste (X sur « Dernières notes »), le temps de la revalidation.
  const [removedIds, setRemovedIds] = useState<Set<string>>(() => new Set())
  const [notesOpen, setNotesOpen] = useState(false)
  const [removeError, setRemoveError] = useState(false)
  const [pending, startTransition] = useTransition()

  const grades = useMemo(() => {
    const seen = new Set(initial.map((g) => g.id))
    const merged = [...initial, ...extra.filter((g) => !seen.has(g.id))]
    return removedIds.size > 0
      ? merged.filter((g) => !removedIds.has(g.id))
      : merged
  }, [initial, extra, removedIds])

  const { rows, general } = useMemo(
    () => anneeMatrix(grades, today),
    [grades, today],
  )
  const currentTri = trimestreOf(today)?.t ?? null

  // Tendance narrative (T1 → T2 → T3), reprise de « Mes notes » pour densifier
  // le tableau : « +1,2 pt depuis le trimestre dernier ».
  const summaries = trimestreSummaries(grades, today)
  const displayed = displayedTrimestre(summaries, today)
  const delta = trimestreDelta(summaries, displayed)
  const trendMessage = trimestreTrendMessage(delta)

  // Dernières notes (plus récentes d'abord) : la seule vue où l'on peut retirer
  // une note saisie par erreur.
  const recent = useMemo(
    () =>
      [...grades]
        .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
        .slice(0, 8),
    [grades],
  )
  const totalNotes = rows.reduce((s, r) => s + r.count, 0)

  const removeNote = (id: string) => {
    if (pending) return
    setRemoveError(false)
    startTransition(async () => {
      const res = await removeGradeAction(id)
      if (res.ok) setRemovedIds((prev) => new Set(prev).add(id))
      else setRemoveError(true)
    })
  }

  const nameOf = (slug: string) =>
    subjects.find((s) => s.slug === slug)?.name ?? slug
  const iconOf = (slug: string) =>
    subjects.find((s) => s.slug === slug)?.icon ?? ''

  const shownRows = rows
    .filter((r) => subjFilter === 'all' || r.subject === subjFilter)
    .filter((r) => tri === 0 || r.avgs[tri - 1] !== null)

  const chalkValue = (avg: number | null, emphase = false) =>
    avg === null ? (
      <span className="opacity-40">—</span>
    ) : (
      <span className={cn(emphase && 'text-highlight')}>{formatNote(avg)}</span>
    )

  return (
    <section
      aria-label="Tableau de l'année"
      className="moi-board relative overflow-hidden rounded-3xl px-4 pt-4 pb-5"
    >
      {/* Titre + bouton d'ajout, sur la première ligne de l'ardoise. */}
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="moi-chalk font-heading text-lg font-extrabold">
          Mon année
        </h2>
        <button
          type="button"
          onClick={() => {
            sfx.tap()
            setAdding(true)
          }}
          className="moi-chalk flex cursor-pointer items-center gap-1 rounded-full border border-white/35 bg-white/10 px-3 py-1.5 text-xs font-bold transition-colors duration-200 hover:bg-white/20 active:translate-y-px"
        >
          <Plus className="size-3.5" strokeWidth={3} aria-hidden="true" />
          Note
        </button>
      </div>

      {/* Filtre trimestre : quatre pastilles craie. */}
      <div
        role="group"
        aria-label="Filtrer par trimestre"
        className="mb-3 flex items-center gap-1.5"
      >
        {TRI_FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            aria-pressed={tri === f.id}
            onClick={() => {
              sfx.tap()
              setTri(f.id as 0 | Trimestre)
            }}
            className={cn(
              'moi-chalk cursor-pointer rounded-full px-3 py-1 text-xs font-bold transition-colors duration-200',
              tri === f.id
                ? 'bg-white/20 ring-1 ring-white/50'
                : 'opacity-60 hover:bg-white/10 hover:opacity-90',
            )}
          >
            {f.label}
            {f.id !== 0 && f.id === currentTri ? (
              <span className="sr-only"> (trimestre en cours)</span>
            ) : null}
          </button>
        ))}

        {/* Filtre matière, seulement quand le tableau se remplit. */}
        {rows.length > SUBJECT_FILTER_THRESHOLD ? (
          <select
            value={subjFilter}
            onChange={(e) => setSubjFilter(e.target.value)}
            aria-label="Filtrer par matière"
            className="moi-chalk ml-auto h-7 max-w-32 cursor-pointer rounded-full border border-white/25 bg-white/10 px-2 text-xs font-semibold [&>option]:text-foreground"
          >
            <option value="all">Toutes</option>
            {rows.map((r) => (
              <option key={r.subject} value={r.subject}>
                {nameOf(r.subject)}
              </option>
            ))}
          </select>
        ) : null}
      </div>

      {needsMigration ? (
        <p className="moi-chalk-box moi-chalk rounded-xl p-4 text-center text-sm">
          Le tableau arrive bientôt — la mise à jour (migration 167) n&apos;est
          pas encore passée.
        </p>
      ) : rows.length === 0 ? (
        <p className="moi-chalk-box moi-chalk rounded-xl p-4 text-center text-sm">
          Ton tableau est vide. Ajoute les notes de tes vrais contrôles avec le
          bouton « + Note » — moyennes et évolution s&apos;écriront ici.
        </p>
      ) : (
        <div className="moi-chalk-box rounded-xl px-2 py-1">
          <table className="w-full border-collapse">
            <thead>
              <tr className="moi-chalk text-[10px] font-bold tracking-wide uppercase opacity-60">
                <th scope="col" className="py-1.5 pl-1 text-left font-bold">
                  Matière
                </th>
                {tri === 0 ? (
                  ([1, 2, 3] as const).map((t) => (
                    <th
                      key={t}
                      scope="col"
                      className={cn(
                        'w-11 py-1.5 text-right font-bold',
                        t === currentTri && 'underline decoration-2 underline-offset-2',
                      )}
                    >
                      T{t}
                    </th>
                  ))
                ) : (
                  <>
                    <th scope="col" className="w-16 py-1.5 text-right font-bold">
                      Moy.
                    </th>
                    <th scope="col" className="w-14 py-1.5 text-right font-bold">
                      Notes
                    </th>
                  </>
                )}
                <th scope="col" className="w-6 py-1.5">
                  <span className="sr-only">Tendance</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Moyenne générale d'abord — le chiffre du bulletin. */}
              {subjFilter === 'all' ? (
                <tr className="moi-chalk border-t border-white/15 text-sm font-extrabold">
                  <th scope="row" className="py-2 pl-1 text-left">
                    Moyenne générale
                  </th>
                  {tri === 0 ? (
                    general.map((avg, i) => (
                      <td
                        key={i}
                        className="py-2 text-right font-mono tabular-nums"
                      >
                        {chalkValue(avg, i + 1 === currentTri)}
                      </td>
                    ))
                  ) : (
                    <>
                      <td className="py-2 text-right font-mono tabular-nums">
                        {chalkValue(general[tri - 1], true)}
                      </td>
                      <td className="py-2 text-right font-mono text-xs tabular-nums opacity-60">
                        {shownRows.reduce((s, r) => s + r.count, 0)}
                      </td>
                    </>
                  )}
                  <td />
                </tr>
              ) : null}

              {shownRows.map((r) => (
                <tr
                  key={r.subject}
                  className="moi-chalk border-t border-white/15 text-sm font-semibold"
                >
                  <th
                    scope="row"
                    className="max-w-0 truncate py-2 pl-1 text-left font-semibold"
                  >
                    <span aria-hidden="true" className="mr-1">
                      {iconOf(r.subject)}
                    </span>
                    {nameOf(r.subject)}
                  </th>
                  {tri === 0 ? (
                    r.avgs.map((avg, i) => (
                      <td
                        key={i}
                        className="py-2 text-right font-mono tabular-nums"
                      >
                        {chalkValue(avg)}
                      </td>
                    ))
                  ) : (
                    <>
                      <td className="py-2 text-right font-mono tabular-nums">
                        {chalkValue(r.avgs[tri - 1])}
                      </td>
                      <td className="py-2 text-right font-mono text-xs tabular-nums opacity-60">
                        {r.count}
                      </td>
                    </>
                  )}
                  <td className="py-2 pr-0.5">
                    {tri === 0 ? <TrendIcon delta={r.delta} /> : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tendance + dernières notes (retrait) + légende — l'ex « Mes notes »
          fondu ici pour ne plus dupliquer les notes dans un second bloc. */}
      {rows.length > 0 && !needsMigration ? (
        <div className="mt-3">
          {trendMessage && delta !== null ? (
            <p className="moi-chalk mb-2 flex items-center gap-1.5 text-xs font-semibold">
              <TrendingUp
                className={cn(
                  'size-3.5 shrink-0',
                  delta < 0 && 'rotate-180 -scale-x-100',
                )}
                strokeWidth={2.4}
                aria-hidden="true"
              />
              {trendMessage}
            </p>
          ) : null}

          <button
            type="button"
            aria-expanded={notesOpen}
            onClick={() => {
              sfx.tap()
              setNotesOpen((o) => !o)
            }}
            className="moi-chalk flex w-full cursor-pointer items-center justify-between rounded-lg px-1 py-1.5 text-xs font-bold opacity-80 transition-opacity hover:opacity-100"
          >
            <span>Dernières notes</span>
            <ChevronDown
              className={cn('size-4 transition-transform', notesOpen && 'rotate-180')}
              aria-hidden="true"
            />
          </button>

          {notesOpen ? (
            <ul className="mt-1 flex flex-col gap-0.5">
              {recent.map((g) => (
                <li
                  key={g.id}
                  className="moi-chalk flex items-center gap-2 py-0.5 text-sm"
                >
                  <span className="shrink-0 text-sm" aria-hidden="true">
                    {iconOf(g.subject)}
                  </span>
                  <span className="min-w-0 flex-1 truncate">
                    {g.label ?? nameOf(g.subject)}
                  </span>
                  <span className="shrink-0 text-[11px] opacity-60 tabular-nums">
                    {shortDate(g.date)}
                  </span>
                  <span className="shrink-0 font-mono font-extrabold tabular-nums">
                    {formatNote(g.score)}/{formatNote(g.outOf)}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeNote(g.id)}
                    disabled={pending}
                    aria-label={`Retirer la note ${formatNote(g.score)}/${formatNote(g.outOf)} en ${nameOf(g.subject)}`}
                    className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full opacity-70 transition-colors hover:bg-white/15 hover:opacity-100 active:scale-90 disabled:opacity-40"
                  >
                    <X className="size-3.5" strokeWidth={2.4} aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          ) : null}

          {removeError ? (
            <p
              role="alert"
              className="moi-chalk mt-2 rounded-lg bg-white/10 px-2 py-1.5 text-xs font-semibold"
            >
              Impossible de retirer cette note pour le moment. Réessaie.
            </p>
          ) : null}

          <p className="moi-chalk mt-2 text-right text-[10px] opacity-50">
            Moyennes /20 ·{' '}
            {totalNotes > 1
              ? `${totalNotes} notes cette année`
              : '1 note cette année'}
          </p>
        </div>
      ) : null}

      {adding ? (
        <AddGradeSheet
          subjects={subjects}
          today={today}
          onAdded={(g) => setExtra((prev) => [g, ...prev])}
          onClose={() => setAdding(false)}
        />
      ) : null}
    </section>
  )
}
