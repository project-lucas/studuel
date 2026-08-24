'use client'

import { useMemo, useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { ClipboardPaste, Plus, Rows3, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import {
  lireCollage,
  MAX_CARTES_IMPORT,
  MAX_FACE,
  nettoyerSaisie,
  RAISON_LABEL,
  SEPARATEUR_LABEL,
  type Separateur,
} from '@/lib/carnet/import-colle'
import { creerCartesEnLot } from '@/app/reviser/cours/actions'
import BottomSheet from '@/components/carnet/BottomSheet'

type Mode = 'rafale' | 'collage'

type Ligne = { recto: string; verso: string }

const LIGNE_VIDE: Ligne = { recto: '', verso: '' }

/**
 * LA porte d'entrée en masse du carnet — celle qui manquait.
 *
 * Deux façons de remplir un cours sans jamais changer de page :
 *
 *   • RAFALE — une ligne = une carte, `Entrée` ouvre la suivante. C'est le
 *     geste de Quizlet et de Wooflash, et c'est ce qui décide si un élève
 *     remplit son cours ou l'abandonne : avant, écrire vingt flashcards
 *     demandait vingt navigations.
 *
 *   • COLLAGE — on colle sa liste (tableur, notes, autre appli), l'app devine
 *     le séparateur et montre un APERÇU avant d'écrire quoi que ce soit.
 *
 * Les deux finissent dans la même action (`creerCartesEnLot`) et passent par la
 * même logique pure que l'aperçu : ce qui est montré est ce qui est écrit.
 */
export default function SaisieRapide({
  courseId,
  chapterId,
  open,
  onClose,
}: {
  courseId: string
  chapterId: string | null
  open: boolean
  onClose: () => void
}) {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>('rafale')
  const [lignes, setLignes] = useState<Ligne[]>([
    { ...LIGNE_VIDE },
    { ...LIGNE_VIDE },
    { ...LIGNE_VIDE },
  ])
  const [colle, setColle] = useState('')
  const [separateur, setSeparateur] = useState<Separateur | undefined>(undefined)
  const [pending, startTransition] = useTransition()
  const [message, setMessage] = useState<string | null>(null)
  const rectosRef = useRef<(HTMLInputElement | null)[]>([])

  const lecture = useMemo(
    () => (mode === 'collage' ? lireCollage(colle, separateur) : null),
    [mode, colle, separateur],
  )
  const cartesRafale = useMemo(() => nettoyerSaisie(lignes), [lignes])

  const aEcrire = mode === 'collage' ? (lecture?.cartes ?? []) : cartesRafale
  const pret = aEcrire.length > 0 && !pending

  const majLigne = (i: number, patch: Partial<Ligne>) => {
    setLignes((liste) =>
      liste.map((l, j) => (j === i ? { ...l, ...patch } : l)),
    )
  }

  const ajouterLigne = (apres: number) => {
    setLignes((liste) => [
      ...liste.slice(0, apres + 1),
      { ...LIGNE_VIDE },
      ...liste.slice(apres + 1),
    ])
    // Le focus suit : c'est ce qui fait qu'on enchaîne sans lever les mains.
    window.setTimeout(() => rectosRef.current[apres + 1]?.focus(), 0)
  }

  const retirerLigne = (i: number) => {
    setLignes((liste) =>
      liste.length <= 1 ? [{ ...LIGNE_VIDE }] : liste.filter((_, j) => j !== i),
    )
  }

  const enregistrer = () => {
    if (!pret) return
    sfx.tap()
    setMessage(null)
    startTransition(async () => {
      const res = await creerCartesEnLot(courseId, chapterId, aEcrire)
      if (res.ok) {
        sfx.complete()
        setLignes([{ ...LIGNE_VIDE }, { ...LIGNE_VIDE }, { ...LIGNE_VIDE }])
        setColle('')
        setSeparateur(undefined)
        onClose()
        router.refresh()
      } else {
        setMessage('L’enregistrement a échoué. Réessaie dans un instant.')
      }
    })
  }

  return (
    <BottomSheet open={open} onClose={onClose} title="Ajouter des cartes">
      <div className="flex flex-col gap-3">
        {/* Le choix du geste, en deux onglets. */}
        <div
          role="tablist"
          aria-label="Façon d’ajouter des cartes"
          className="flex gap-1.5 rounded-2xl bg-muted/60 p-1"
        >
          {(
            [
              { id: 'rafale' as Mode, label: 'À la suite', Icon: Rows3 },
              { id: 'collage' as Mode, label: 'Coller une liste', Icon: ClipboardPaste },
            ]
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={mode === t.id}
              onClick={() => {
                sfx.tap()
                setMode(t.id)
                setMessage(null)
              }}
              className={cn(
                'font-heading flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-extrabold transition',
                mode === t.id
                  ? 'bg-white text-foreground shadow-sm'
                  : 'text-muted-foreground',
              )}
            >
              <t.Icon className="size-3.5" aria-hidden="true" />
              {t.label}
            </button>
          ))}
        </div>

        {mode === 'rafale' ? (
          <div className="flex flex-col gap-2">
            <p className="px-1 text-[11px] font-semibold text-muted-foreground">
              Recto puis verso. <kbd className="font-bold">Entrée</kbd> ouvre la
              ligne suivante.
            </p>
            <ul className="flex max-h-80 flex-col gap-1.5 overflow-y-auto">
              {lignes.map((l, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  <span className="w-5 shrink-0 text-right text-[10px] font-bold text-muted-foreground tabular-nums">
                    {i + 1}
                  </span>
                  <input
                    ref={(el) => {
                      rectosRef.current[i] = el
                    }}
                    value={l.recto}
                    onChange={(e) => majLigne(i, { recto: e.target.value })}
                    maxLength={MAX_FACE}
                    placeholder="Recto"
                    aria-label={`Recto de la carte ${i + 1}`}
                    className="min-h-11 min-w-0 flex-1 rounded-xl border border-black/10 bg-white px-3 text-sm font-semibold text-foreground outline-none placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-primary/40"
                  />
                  <input
                    value={l.verso}
                    onChange={(e) => majLigne(i, { verso: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        ajouterLigne(i)
                      }
                    }}
                    maxLength={MAX_FACE}
                    placeholder="Verso"
                    aria-label={`Verso de la carte ${i + 1}`}
                    className="min-h-11 min-w-0 flex-1 rounded-xl border border-black/10 bg-white px-3 text-sm font-semibold text-foreground outline-none placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-primary/40"
                  />
                  <button
                    type="button"
                    onClick={() => retirerLigne(i)}
                    aria-label={`Retirer la carte ${i + 1}`}
                    className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="size-3.5" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => ajouterLigne(lignes.length - 1)}
              className="flex cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-muted/60 py-2 text-xs font-extrabold text-foreground hover:bg-muted"
            >
              <Plus className="size-3.5" aria-hidden="true" />
              Une ligne de plus
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <label className="flex flex-col gap-1.5">
              <span className="px-1 text-[11px] font-semibold text-muted-foreground">
                Colle ta liste — un mot et sa définition par ligne. L’app devine
                comment tes colonnes sont séparées.
              </span>
              <textarea
                value={colle}
                onChange={(e) => setColle(e.target.value)}
                rows={7}
                placeholder={'dog\tchien\ncat\tchat\nbird ; oiseau'}
                aria-label="Liste à importer"
                className="rounded-2xl border border-black/10 bg-white px-3 py-2.5 font-mono text-xs text-foreground outline-none placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-primary/40"
              />
            </label>

            {lecture && colle.trim().length > 0 ? (
              <div className="flex flex-col gap-2 rounded-2xl bg-muted/40 p-3">
                <p className="text-[11px] font-bold text-foreground">
                  {lecture.cartes.length} carte
                  {lecture.cartes.length > 1 ? 's' : ''} lue
                  {lecture.cartes.length > 1 ? 's' : ''} — colonnes séparées par
                  la {SEPARATEUR_LABEL[lecture.separateur]}.
                </p>

                {/* Corriger la devinette sans retoucher son texte. */}
                <div className="flex flex-wrap gap-1">
                  {(
                    [
                      'tabulation',
                      'point-virgule',
                      'virgule',
                      'tiret',
                    ] as Separateur[]
                  ).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSeparateur(s)}
                      aria-pressed={lecture.separateur === s}
                      className={cn(
                        'cursor-pointer rounded-full px-2.5 py-1 text-[10px] font-extrabold transition',
                        lecture.separateur === s
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-white text-muted-foreground ring-1 ring-black/5',
                      )}
                    >
                      {SEPARATEUR_LABEL[s]}
                    </button>
                  ))}
                </div>

                {/* L'aperçu : rien n'est écrit avant que l'élève ait vu. */}
                {lecture.cartes.length > 0 ? (
                  <ul className="flex max-h-40 flex-col gap-1 overflow-y-auto">
                    {lecture.cartes.slice(0, 30).map((c, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 rounded-lg bg-white px-2 py-1.5 text-[11px]"
                      >
                        <span className="min-w-0 flex-1 truncate font-bold text-foreground">
                          {c.recto}
                        </span>
                        <span className="text-muted-foreground" aria-hidden="true">
                          →
                        </span>
                        <span className="min-w-0 flex-1 truncate text-muted-foreground">
                          {c.verso}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : null}

                {lecture.rejets.length > 0 ? (
                  <details className="text-[11px]">
                    <summary className="cursor-pointer font-bold text-destructive">
                      {lecture.rejets.length} ligne
                      {lecture.rejets.length > 1 ? 's' : ''} non lue
                      {lecture.rejets.length > 1 ? 's' : ''}
                    </summary>
                    <ul className="mt-1 flex flex-col gap-0.5">
                      {lecture.rejets.slice(0, 12).map((r) => (
                        <li key={r.ligne} className="text-muted-foreground">
                          <span className="font-bold">ligne {r.ligne}</span> —{' '}
                          {RAISON_LABEL[r.raison]}
                        </li>
                      ))}
                    </ul>
                  </details>
                ) : null}
              </div>
            ) : null}
          </div>
        )}

        {message ? (
          <p
            role="alert"
            className="rounded-2xl bg-destructive/10 px-3 py-2 text-xs font-semibold text-destructive"
          >
            {message}
          </p>
        ) : null}

        <button
          type="button"
          disabled={!pret}
          onClick={enregistrer}
          className="font-heading cursor-pointer rounded-2xl bg-primary px-4 py-3.5 text-sm font-extrabold text-primary-foreground shadow-sm transition active:translate-y-px disabled:opacity-50"
        >
          {pending
            ? 'Enregistrement…'
            : aEcrire.length === 0
              ? 'Ajouter les cartes'
              : `Ajouter ${aEcrire.length} carte${aEcrire.length > 1 ? 's' : ''}`}
        </button>
        <p className="text-center text-[10px] font-semibold text-muted-foreground">
          {MAX_CARTES_IMPORT} cartes au maximum d’un coup.
        </p>
      </div>
    </BottomSheet>
  )
}
