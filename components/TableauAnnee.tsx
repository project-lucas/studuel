'use client'

import { useMemo, useState } from 'react'
import { Minus, Plus, TrendingDown, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import AddGradeSheet, { type SubjectLite } from '@/components/AddGradeSheet'
import {
  anneeMatrix,
  formatNote,
  trimestreOf,
  type SchoolGrade,
  type Trimestre,
} from '@/lib/notes'

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

  const grades = useMemo(() => {
    const seen = new Set(initial.map((g) => g.id))
    return [...initial, ...extra.filter((g) => !seen.has(g.id))]
  }, [initial, extra])

  const { rows, general } = useMemo(
    () => anneeMatrix(grades, today),
    [grades, today],
  )
  const currentTri = trimestreOf(today)?.t ?? null

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

      {/* Légende craie, discrète : les moyennes sont ramenées sur 20. */}
      {rows.length > 0 && !needsMigration ? (
        <p className="moi-chalk mt-2 text-right text-[10px] opacity-50">
          Moyennes /20 ·{' '}
          {rows.reduce((s, r) => s + r.count, 0) > 1
            ? `${rows.reduce((s, r) => s + r.count, 0)} notes cette année`
            : '1 note cette année'}
        </p>
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
