'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Play } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import {
  QUESTION_TYPES,
  TYPE_LABEL,
  type CourseChapter,
  type CourseQuestionType,
} from '@/lib/carnet-cours'
import {
  LONGUEURS,
  MODES,
  MODE_AIDE,
  MODE_LABEL,
  SENS,
  SENS_LABEL,
  type Mode,
  type Sens,
} from '@/lib/carnet/session-options'
import BottomSheet from '@/components/carnet/BottomSheet'

/** Une étiquette de l'élève, telle qu'affichée dans le choix de portée. */
export type EtiquetteChoix = { id: string; label: string }

type PorteeChoisie =
  | { kind: 'tout' }
  | { kind: 'chapitre'; chapterId: string }
  | { kind: 'erreurs' }
  | { kind: 'etiquette'; tagId: string }

function Rangee({
  titre,
  children,
}: {
  titre: string
  children: React.ReactNode
}) {
  return (
    <div>
      <p className="font-heading mb-1.5 px-1 text-xs font-extrabold text-foreground">
        {titre}
      </p>
      {children}
    </div>
  )
}

function Puce({
  actif,
  onClick,
  children,
}: {
  actif: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-pressed={actif}
      onClick={onClick}
      className={cn(
        'cursor-pointer rounded-xl px-3 py-2 text-xs font-extrabold transition',
        actif
          ? 'bg-primary text-primary-foreground'
          : 'bg-muted/60 text-muted-foreground hover:bg-muted',
      )}
    >
      {children}
    </button>
  )
}

/**
 * « COMMENT TU VEUX RÉVISER ? » — la feuille qui remplace un menu à deux
 * entrées (« tout le cours » / « un chapitre »).
 *
 * C'est ici que se joue la promesse du produit : être meilleur qu'Anki et
 * Wooflash sur la PERSONNALISATION. Cinq décisions, et pas une de plus —
 * chacune remplace un choix que l'élève prenait mal tout seul, ou pas du tout :
 *
 *   portée   — dont « mes erreurs », qui n'existait nulle part ;
 *   sens     — vital en langues, et les colonnes de langue dormaient en base ;
 *   types    — réviser ses seules flashcards avant une interro de vocabulaire ;
 *   longueur — « dix cartes » est une session qu'on finit ;
 *   mode     — apprendre (échéances) / s'entraîner / examen blanc.
 *
 * Les réglages partent dans l'URL : une session se remet en favori et se
 * relance à l'identique.
 */
export default function SessionOptionsSheet({
  courseId,
  chapters,
  etiquettes,
  open,
  onClose,
}: {
  courseId: string
  chapters: CourseChapter[]
  etiquettes: EtiquetteChoix[]
  open: boolean
  onClose: () => void
}) {
  const router = useRouter()
  const [portee, setPortee] = useState<PorteeChoisie>({ kind: 'tout' })
  const [sens, setSens] = useState<Sens>('recto-verso')
  const [types, setTypes] = useState<CourseQuestionType[]>([])
  const [longueur, setLongueur] = useState<number | null>(null)
  const [mode, setMode] = useState<Mode>('apprentissage')

  const href = useMemo(() => {
    const p = new URLSearchParams()
    if (portee.kind === 'chapitre') p.set('chapitre', portee.chapterId)
    else if (portee.kind === 'erreurs') p.set('portee', 'erreurs')
    else if (portee.kind === 'etiquette') {
      p.set('portee', 'etiquette')
      p.set('tag', portee.tagId)
    }
    if (sens !== 'recto-verso') p.set('sens', sens)
    if (types.length > 0) p.set('types', types.join(','))
    if (longueur !== null) p.set('long', String(longueur))
    if (mode !== 'apprentissage') p.set('mode', mode)
    const q = p.toString()
    return `/reviser/cours/${courseId}/reviser${q ? `?${q}` : ''}`
  }, [courseId, portee, sens, types, longueur, mode])

  const basculerType = (t: CourseQuestionType) => {
    sfx.tap()
    setTypes((liste) =>
      liste.includes(t) ? liste.filter((x) => x !== t) : [...liste, t],
    )
  }

  return (
    <BottomSheet open={open} onClose={onClose} title="Comment tu veux réviser ?">
      <div className="flex flex-col gap-3.5">
        <Rangee titre="Quoi">
          <div className="flex flex-wrap gap-1.5">
            <Puce
              actif={portee.kind === 'tout'}
              onClick={() => {
                sfx.tap()
                setPortee({ kind: 'tout' })
              }}
            >
              Tout le cours
            </Puce>
            {/* « Mes erreurs » n'existait NULLE PART : c'est pourtant la
                première chose qu'un élève veut refaire. */}
            <Puce
              actif={portee.kind === 'erreurs'}
              onClick={() => {
                sfx.tap()
                setPortee({ kind: 'erreurs' })
              }}
            >
              Mes erreurs
            </Puce>
            {chapters.map((c) => (
              <Puce
                key={c.id}
                actif={
                  portee.kind === 'chapitre' && portee.chapterId === c.id
                }
                onClick={() => {
                  sfx.tap()
                  setPortee({ kind: 'chapitre', chapterId: c.id })
                }}
              >
                {c.title}
              </Puce>
            ))}
            {etiquettes.map((e) => (
              <Puce
                key={e.id}
                actif={portee.kind === 'etiquette' && portee.tagId === e.id}
                onClick={() => {
                  sfx.tap()
                  setPortee({ kind: 'etiquette', tagId: e.id })
                }}
              >
                #{e.label}
              </Puce>
            ))}
          </div>
        </Rangee>

        <Rangee titre="Comment">
          <div className="flex flex-col gap-1.5">
            {MODES.map((m) => (
              <button
                key={m}
                type="button"
                aria-pressed={mode === m}
                onClick={() => {
                  sfx.tap()
                  setMode(m)
                }}
                className={cn(
                  'cursor-pointer rounded-2xl px-3 py-2.5 text-left transition',
                  mode === m
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted/60 text-foreground hover:bg-muted',
                )}
              >
                <span className="font-heading block text-sm font-extrabold">
                  {MODE_LABEL[m]}
                </span>
                <span
                  className={cn(
                    'block text-[11px] font-semibold',
                    mode === m ? 'opacity-80' : 'text-muted-foreground',
                  )}
                >
                  {MODE_AIDE[m]}
                </span>
              </button>
            ))}
          </div>
        </Rangee>

        <Rangee titre="Sens des flashcards">
          <div className="flex gap-1.5">
            {SENS.map((s) => (
              <Puce key={s} actif={sens === s} onClick={() => {
                sfx.tap()
                setSens(s)
              }}>
                {SENS_LABEL[s]}
              </Puce>
            ))}
          </div>
        </Rangee>

        <Rangee titre="Types de questions">
          <div className="flex flex-wrap gap-1.5">
            <Puce
              actif={types.length === 0}
              onClick={() => {
                sfx.tap()
                setTypes([])
              }}
            >
              Tous
            </Puce>
            {QUESTION_TYPES.map((t) => (
              <Puce
                key={t}
                actif={types.includes(t)}
                onClick={() => basculerType(t)}
              >
                {TYPE_LABEL[t]}
              </Puce>
            ))}
          </div>
        </Rangee>

        <Rangee titre="Longueur">
          <div className="flex gap-1.5">
            {LONGUEURS.map((l) => (
              <Puce
                key={String(l)}
                actif={longueur === l}
                onClick={() => {
                  sfx.tap()
                  setLongueur(l)
                }}
              >
                {l === null ? 'Tout' : `${l} cartes`}
              </Puce>
            ))}
          </div>
        </Rangee>

        <button
          type="button"
          onClick={() => {
            sfx.tap()
            onClose()
            router.push(href)
          }}
          className="font-heading flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3.5 text-sm font-extrabold text-primary-foreground shadow-sm transition active:translate-y-px"
        >
          <Play className="size-4 fill-current" aria-hidden="true" />
          Commencer
        </button>
      </div>
    </BottomSheet>
  )
}
