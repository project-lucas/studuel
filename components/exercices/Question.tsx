'use client'

import { useMemo, useState, type ReactNode } from 'react'
import { Check, Lightbulb, LoaderCircle, RotateCcw, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { lireNombre } from '@/lib/exercices/normaliser'
import type { Cle, Document, QuestionPublique, Reponse } from '@/lib/exercices/types'
import { cn } from '@/lib/utils'
import { Inline, type ZonesDoc } from './commun'
import DocumentVue from './DocumentVue'
import s from './manuel.module.css'

/** Ce que le serveur a dit d'une question (exercice_verifier). */
export type StatutQuestion = {
  essais: number
  juste: boolean
  fini: boolean
  bons?: number
  total?: number
  correction?: { cle: Cle; affichage?: string; explication: string }
}

export const STATUT_VIERGE: StatutQuestion = { essais: 0, juste: false, fini: false }

type Brouillon = {
  ids: string[]
  texte: string
  paires: Record<string, string>
  items: Record<string, string>
  trous: string[]
}

const VIERGE: Brouillon = { ids: [], texte: '', paires: {}, items: {}, trous: [] }

/** La réponse à envoyer, ou null si elle n'est pas complète. */
function reponseDe(q: QuestionPublique, b: Brouillon): Reponse | null {
  switch (q.type) {
    case 'choix':
    case 'zone':
      return b.ids.length > 0 ? { ids: b.ids } : null
    case 'ordre':
      return b.ids.length === q.items.length ? { ids: b.ids } : null
    case 'nombre': {
      const n = lireNombre(b.texte)
      return n === null ? null : { valeur: n }
    }
    case 'texte':
      return b.texte.trim() ? { texte: b.texte.trim() } : null
    case 'association':
      return Object.keys(b.paires).length === q.gauche.length ? { paires: b.paires } : null
    case 'categories':
      return Object.keys(b.items).length === q.items.length ? { items: b.items } : null
    case 'trous': {
      const n = q.segments.filter((x) => typeof x === 'number').length
      const t = Array.from({ length: n }, (_, i) => b.trous[i] ?? '')
      return t.every((x) => x.trim()) ? { trous: t.map((x) => x.trim()) } : null
    }
  }
}

function consigneGeste(q: QuestionPublique): string | null {
  switch (q.type) {
    case 'zone':
      return q.multiple ? 'Touche toutes les bonnes réponses sur le document.' : 'Touche la bonne réponse sur le document.'
    case 'choix':
      return q.multiple ? 'Plusieurs réponses possibles.' : null
    case 'ordre':
      return 'Touche les étiquettes dans le bon ordre.'
    case 'association':
      return 'Touche un élément à gauche, puis celui qui lui correspond à droite.'
    case 'categories':
      return 'Touche une étiquette, puis la case où la ranger.'
    default:
      return null
  }
}

export default function Question({
  q,
  numero,
  documents,
  statut,
  enCours,
  active,
  onVerifier,
}: {
  q: QuestionPublique
  numero: number
  documents: Document[]
  statut: StatutQuestion
  enCours: boolean
  active: boolean
  onVerifier: (r: Reponse) => void
}) {
  const [b, setB] = useState<Brouillon>(VIERGE)
  // Après un premier essai faux, le brouillon reste : l'élève corrige SA réponse.
  const verrou = statut.fini || enCours
  const reponse = reponseDe(q, b)
  const rate = statut.essais > 0 && !statut.juste
  const cle = statut.correction?.cle

  const basculer = (id: string, multiple: boolean) =>
    setB((x) => ({
      ...x,
      ids: x.ids.includes(id) ? x.ids.filter((y) => y !== id) : multiple ? [...x.ids, id] : [id],
    }))

  return (
    <article
      className={cn(s.question, active && !statut.fini && s.questionActive, s.apparition)}
      aria-label={`Question ${numero}`}
      data-question={numero}
    >
      <div className="flex items-start gap-2.5">
        <span className={cn(s.pastilleNumero, statut.fini && (statut.juste ? s.pastilleJuste : s.pastilleFausse))} aria-hidden="true">
          {statut.fini ? statut.juste ? <Check className="size-4" strokeWidth={3} /> : <X className="size-4" strokeWidth={3} /> : numero}
        </span>
        <div className="min-w-0 flex-1 pt-0.5">
          <p className="text-[0.98rem] leading-snug font-bold">
            <Inline texte={q.enonce} />
          </p>
          {consigneGeste(q) && !statut.fini ? <p className="mt-0.5 text-xs font-semibold text-[var(--encre-douce)]">{consigneGeste(q)}</p> : null}
        </div>
      </div>

      <div className="mt-3">
        <Widget q={q} b={b} setB={setB} verrou={verrou} basculer={basculer} documents={documents} statut={statut} cle={cle} />
      </div>

      {/* Le retour : juste, le coup de pouce, ou la correction. */}
      {statut.fini ? (
        <Retour statut={statut} q={q} />
      ) : rate ? (
        <div className={cn(s.coupDePouce, 'mt-3 flex gap-2', s.apparition)} role="status">
          <Lightbulb className="mt-0.5 size-4 shrink-0 text-[color-mix(in_oklch,var(--highlight),black_35%)]" aria-hidden="true" />
          <div>
            <p className="font-extrabold">
              Pas tout à fait…
              {statut.total && statut.total > 1 ? ` ${statut.bons ?? 0} sur ${statut.total} ${statut.bons === 1 ? 'est juste' : 'sont justes'}.` : ''}
            </p>
            <p className="mt-0.5">{q.aide ? <Inline texte={q.aide} /> : 'Relis bien le document et réessaie : il te reste un essai.'}</p>
          </div>
        </div>
      ) : null}

      {!statut.fini ? (
        <Button
          className="mt-3 min-h-11 w-full rounded-full text-[0.95rem]"
          disabled={!reponse || enCours}
          onClick={() => reponse && onVerifier(reponse)}
        >
          {enCours ? (
            <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
          ) : rate ? (
            <RotateCcw className="size-4" aria-hidden="true" />
          ) : (
            <Check className="size-4" aria-hidden="true" />
          )}
          {rate ? 'Réessayer' : 'Vérifier'}
        </Button>
      ) : null}
    </article>
  )
}

function Retour({ statut, q }: { statut: StatutQuestion; q: QuestionPublique }) {
  const c = statut.correction
  const montrerAffichage = c?.affichage && !statut.juste && (q.type === 'nombre' || q.type === 'texte' || q.type === 'trous')
  return (
    <div className={cn(s.explication, !statut.juste && s.explicationRatee, 'mt-3', s.apparition)} role="status">
      <p className="font-extrabold">
        {statut.juste ? (statut.essais <= 1 ? 'Bravo, c’est juste !' : 'Bien rattrapé !') : 'La bonne réponse :'}
        {montrerAffichage ? <span className="ml-1 text-[var(--success)]">{c?.affichage}</span> : null}
      </p>
      {c?.explication ? (
        <p className="mt-0.5">
          <Inline texte={c.explication} />
        </p>
      ) : null}
    </div>
  )
}

// --------------------------------------------------------------- les widgets

function Widget({
  q,
  b,
  setB,
  verrou,
  basculer,
  documents,
  statut,
  cle,
}: {
  q: QuestionPublique
  b: Brouillon
  setB: (f: (x: Brouillon) => Brouillon) => void
  verrou: boolean
  basculer: (id: string, multiple: boolean) => void
  documents: Document[]
  statut: StatutQuestion
  cle?: Cle
}) {
  const justes = cle && 'ids' in cle ? new Set(cle.ids) : undefined
  switch (q.type) {
    case 'choix':
      return (
        <div className="grid gap-2">
          {q.options.map((o) => {
            const choisie = b.ids.includes(o.id)
            const juste = justes?.has(o.id)
            return (
              <button
                key={o.id}
                type="button"
                disabled={verrou}
                aria-pressed={choisie}
                onClick={() => basculer(o.id, q.multiple)}
                className={cn(
                  s.puce,
                  'w-full',
                  !justes && choisie && s.puceChoisie,
                  justes && juste && s.puceJuste,
                  justes && choisie && !juste && s.puceFausse,
                )}
              >
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--muted)] text-xs font-extrabold uppercase">{o.id}</span>
                <Inline texte={o.texte} />
              </button>
            )
          })}
        </div>
      )

    case 'zone': {
      const index = documents.findIndex((d) => d.id === q.document)
      const doc = documents[index]
      if (!doc) return null
      const zones: ZonesDoc = {
        actif: !verrou,
        choisies: new Set(b.ids),
        basculer: (id) => basculer(id, q.multiple),
        justes: statut.fini ? justes : undefined,
      }
      return <DocumentVue doc={doc} numero={index + 1} zones={zones} portee={q.portee} compact />
    }

    case 'nombre':
    case 'texte':
      return (
        <label className="flex items-center gap-2">
          <span className="sr-only">Ta réponse</span>
          <input
            className={cn(s.champ, statut.fini && (statut.juste ? 'border-[var(--success)]' : 'border-[var(--destructive)]'))}
            inputMode={q.type === 'nombre' ? 'decimal' : 'text'}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            disabled={verrou}
            value={b.texte}
            maxLength={80}
            placeholder={q.type === 'texte' ? (q.placeholder ?? 'Ta réponse') : 'Ta réponse'}
            onChange={(e) => {
              const v = e.target.value
              setB((x) => ({ ...x, texte: v }))
            }}
          />
          {q.type === 'nombre' && q.unite ? <span className="shrink-0 text-lg font-extrabold">{q.unite}</span> : null}
        </label>
      )

    case 'ordre':
      return <Ordre q={q} b={b} setB={setB} verrou={verrou} cle={cle} />
    case 'association':
      return <Association q={q} b={b} setB={setB} verrou={verrou} cle={cle} />
    case 'categories':
      return <Categories q={q} b={b} setB={setB} verrou={verrou} cle={cle} />
    case 'trous':
      return <Trous q={q} b={b} setB={setB} verrou={verrou} fini={statut.fini} juste={statut.juste} />
  }
}

type PropsWidget<T extends QuestionPublique['type']> = {
  q: Extract<QuestionPublique, { type: T }>
  b: Brouillon
  setB: (f: (x: Brouillon) => Brouillon) => void
  verrou: boolean
  cle?: Cle
}

/** L'ORDRE : on touche les étiquettes dans l'ordre ; toucher une étiquette posée la retire. */
function Ordre({ q, b, setB, verrou, cle }: PropsWidget<'ordre'>) {
  const texte = new Map(q.items.map((i) => [i.id, i.texte] as const))
  const restants = q.items.filter((i) => !b.ids.includes(i.id))
  const bonOrdre = cle?.type === 'ordre' ? cle.ids : null
  return (
    <div className="grid gap-3">
      <ol className="grid gap-1.5" aria-label="Ton ordre">
        {Array.from({ length: q.items.length }, (_, i) => {
          const id = b.ids[i]
          const bonne = bonOrdre ? bonOrdre[i] === id : null
          return (
            <li key={i} className="flex items-center gap-2">
              <span className="w-5 text-right text-sm font-extrabold text-[var(--encre-douce)]">{i + 1}.</span>
              {id ? (
                <button
                  type="button"
                  disabled={verrou}
                  onClick={() => setB((x) => ({ ...x, ids: x.ids.filter((y) => y !== id) }))}
                  className={cn(s.puce, 'flex-1', bonne === true && s.puceJuste, bonne === false && s.puceFausse)}
                >
                  <Inline texte={texte.get(id) ?? ''} />
                </button>
              ) : (
                <span className="flex min-h-[2.6rem] flex-1 items-center rounded-[0.9rem] border-2 border-dashed border-[var(--border)] px-3 text-sm text-[var(--encre-douce)]">
                  {i === b.ids.length ? '← touche une étiquette' : ''}
                </span>
              )}
            </li>
          )
        })}
      </ol>
      {restants.length ? (
        <div className="flex flex-wrap gap-2" aria-label="Étiquettes à placer">
          {restants.map((it) => (
            <button key={it.id} type="button" disabled={verrou} onClick={() => setB((x) => ({ ...x, ids: [...x.ids, it.id] }))} className={s.puce}>
              <Inline texte={it.texte} />
            </button>
          ))}
        </div>
      ) : null}
      {bonOrdre && bonOrdre.some((id, i) => b.ids[i] !== id) ? (
        <p className="text-sm">
          <span className="font-extrabold">Le bon ordre : </span>
          {bonOrdre.map((id) => texte.get(id)).join(' → ')}
        </p>
      ) : null}
    </div>
  )
}

const COULEURS_PAIRES = ['var(--t-bleu)', 'var(--t-corail)', 'var(--t-vert)', 'var(--t-ambre)', 'var(--t-violet)', 'var(--t-turquoise)']

/** L'ASSOCIATION : un élément à gauche, puis son partenaire à droite ; la paire prend une couleur. */
function Association({ q, b, setB, verrou, cle }: PropsWidget<'association'>) {
  const [gauche, setGauche] = useState<string | null>(null)
  const rang = new Map(q.gauche.map((g, i) => [g.id, i] as const))
  const partenaireDe = useMemo(() => new Map(Object.entries(b.paires).map(([g, d]) => [d, g] as const)), [b.paires])
  const juste = cle?.type === 'association' ? cle.paires : null
  const pastille = (g: string | undefined): ReactNode =>
    g !== undefined ? (
      <span className="flex size-5 shrink-0 items-center justify-center rounded-full text-[0.7rem] font-extrabold text-white" style={{ background: COULEURS_PAIRES[(rang.get(g) ?? 0) % COULEURS_PAIRES.length] }}>
        {(rang.get(g) ?? 0) + 1}
      </span>
    ) : null
  return (
    <div className="grid gap-3">
      <div className="grid grid-cols-2 gap-2">
        <div className="grid content-start gap-2">
          {q.gauche.map((g) => (
            <button
              key={g.id}
              type="button"
              disabled={verrou}
              aria-pressed={gauche === g.id}
              onClick={() => setGauche(gauche === g.id ? null : g.id)}
              className={cn(s.puce, 'w-full', gauche === g.id && s.puceChoisie, juste && (juste[g.id] === b.paires[g.id] ? s.puceJuste : s.puceFausse))}
            >
              {pastille(b.paires[g.id] ? g.id : undefined)}
              <Inline texte={g.texte} />
            </button>
          ))}
        </div>
        <div className="grid content-start gap-2">
          {q.droite.map((d) => {
            const g = partenaireDe.get(d.id)
            return (
              <button
                key={d.id}
                type="button"
                disabled={verrou || (!gauche && !g)}
                onClick={() => {
                  if (!gauche) {
                    // Toucher une paire déjà faite la défait.
                    if (g) setB((x) => ({ ...x, paires: Object.fromEntries(Object.entries(x.paires).filter(([k]) => k !== g)) }))
                    return
                  }
                  setB((x) => {
                    const sans = Object.fromEntries(Object.entries(x.paires).filter(([k, v]) => k !== gauche && v !== d.id))
                    return { ...x, paires: { ...sans, [gauche]: d.id } }
                  })
                  setGauche(null)
                }}
                className={cn(s.puce, 'w-full', gauche && 'shadow-[inset_0_0_0_2px_color-mix(in_oklch,var(--primary),transparent_55%),0_3px_0_var(--border)]')}
              >
                {pastille(g)}
                <Inline texte={d.texte} />
              </button>
            )
          })}
        </div>
      </div>
      {juste && q.gauche.some((g) => juste[g.id] !== b.paires[g.id]) ? (
        <ul className="grid gap-0.5 text-sm">
          {q.gauche.map((g) => (
            <li key={g.id}>
              <span className="font-bold">{g.texte}</span> → {q.droite.find((d) => d.id === juste[g.id])?.texte}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

/** LE RANGEMENT : une étiquette, puis sa case. */
function Categories({ q, b, setB, verrou, cle }: PropsWidget<'categories'>) {
  const [choisi, setChoisi] = useState<string | null>(null)
  const libres = q.items.filter((i) => !b.items[i.id])
  const juste = cle?.type === 'categories' ? cle.items : null
  return (
    <div className="grid gap-3">
      {libres.length ? (
        <div className="flex flex-wrap gap-2" aria-label="Étiquettes à ranger">
          {libres.map((it) => (
            <button key={it.id} type="button" disabled={verrou} aria-pressed={choisi === it.id} onClick={() => setChoisi(choisi === it.id ? null : it.id)} className={cn(s.puce, choisi === it.id && s.puceChoisie)}>
              <Inline texte={it.texte} />
            </button>
          ))}
        </div>
      ) : null}
      <div className={cn('grid gap-2', q.categories.length > 2 ? 'sm:grid-cols-2' : 'grid-cols-2')}>
        {q.categories.map((c) => (
          <div
            key={c.id}
            role="button"
            tabIndex={verrou || !choisi ? -1 : 0}
            aria-label={`Ranger dans ${c.texte}`}
            onClick={() => {
              if (verrou || !choisi) return
              setB((x) => ({ ...x, items: { ...x.items, [choisi]: c.id } }))
              setChoisi(null)
            }}
            onKeyDown={(e) => {
              if ((e.key === 'Enter' || e.key === ' ') && choisi && !verrou) {
                e.preventDefault()
                setB((x) => ({ ...x, items: { ...x.items, [choisi]: c.id } }))
                setChoisi(null)
              }
            }}
            className={cn(
              'min-h-[5.5rem] rounded-2xl border-2 border-dashed p-2 transition-colors',
              choisi && !verrou ? 'cursor-pointer border-[var(--primary)] bg-[color-mix(in_oklch,var(--primary),white_94%)]' : 'border-[var(--border)] bg-[var(--muted)]/40',
            )}
          >
            <p className="mb-1.5 text-center text-[0.78rem] font-extrabold tracking-wide uppercase">
              <Inline texte={c.texte} />
            </p>
            <div className="flex flex-wrap gap-1.5">
              {q.items
                .filter((it) => b.items[it.id] === c.id)
                .map((it) => (
                  <button
                    key={it.id}
                    type="button"
                    disabled={verrou}
                    onClick={(e) => {
                      e.stopPropagation()
                      setB((x) => ({ ...x, items: Object.fromEntries(Object.entries(x.items).filter(([k]) => k !== it.id)) }))
                    }}
                    className={cn(s.puce, '!min-h-9 !py-1 text-[0.82rem]', juste && (juste[it.id] === c.id ? s.puceJuste : s.puceFausse))}
                  >
                    <Inline texte={it.texte} />
                  </button>
                ))}
            </div>
          </div>
        ))}
      </div>
      {juste && q.items.some((it) => juste[it.id] !== b.items[it.id]) ? (
        <ul className="grid gap-0.5 text-sm">
          {q.categories.map((c) => (
            <li key={c.id}>
              <span className="font-bold">{c.texte} : </span>
              {q.items
                .filter((it) => juste[it.id] === c.id)
                .map((it) => it.texte)
                .join(', ')}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

/** LE TEXTE À TROUS : avec une banque, on touche un mot pour remplir le premier trou libre (ou le trou choisi). */
function Trous({
  q,
  b,
  setB,
  verrou,
  fini,
  juste,
}: PropsWidget<'trous'> & { fini: boolean; juste: boolean }) {
  const [actif, setActif] = useState(0)
  const n = q.segments.filter((x) => typeof x === 'number').length
  const valeur = (i: number) => b.trous[i] ?? ''
  const poser = (i: number, v: string) =>
    setB((x) => {
      const t = Array.from({ length: n }, (_, k) => x.trous[k] ?? '')
      t[i] = v
      return { ...x, trous: t }
    })
  return (
    <div className="grid gap-3">
      <p className="text-[0.98rem] leading-[2.3rem]">
        {q.segments.map((seg, k) =>
          typeof seg === 'string' ? (
            <Inline key={k} texte={seg} />
          ) : q.banque ? (
            <button
              key={k}
              type="button"
              disabled={verrou}
              onClick={() => (valeur(seg) ? poser(seg, '') : setActif(seg))}
              className={cn(s.trou, valeur(seg) && s.trouRempli, actif === seg && !verrou && 'border-[var(--primary)]', fini && (juste ? 'border-[var(--success)]' : 'border-[var(--destructive)]'))}
              aria-label={`Trou ${seg + 1}${valeur(seg) ? ` : ${valeur(seg)}` : ''}`}
            >
              {valeur(seg) || '…'}
            </button>
          ) : (
            <input
              key={k}
              aria-label={`Trou ${seg + 1}`}
              disabled={verrou}
              value={valeur(seg)}
              maxLength={40}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              onChange={(e) => poser(seg, e.target.value)}
              className={cn(s.trou, 'w-28 bg-white outline-none focus:border-[var(--primary)]', fini && (juste ? 'border-[var(--success)]' : 'border-[var(--destructive)]'))}
            />
          ),
        )}
      </p>
      {q.banque && !verrou ? (
        <div className="flex flex-wrap gap-2" aria-label="Banque de mots">
          {q.banque.map((mot, i) => (
            <button
              key={i}
              type="button"
              className={s.puce}
              onClick={() => {
                const cible = valeur(actif) ? Array.from({ length: n }, (_, k) => k).find((k) => !valeur(k)) : actif
                if (cible === undefined) return
                poser(cible, mot)
                const suivant = Array.from({ length: n }, (_, k) => k).find((k) => k !== cible && !valeur(k))
                if (suivant !== undefined) setActif(suivant)
              }}
            >
              {mot}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
