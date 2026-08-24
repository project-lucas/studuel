'use client'

import { useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Camera, Check, Sparkles, Trash2, Type } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { TYPE_LABEL, isQuestionType } from '@/lib/carnet-cours'
import {
  enregistrerQuestionsValidees,
  proposerQuestions,
  type QuestionProposee,
} from '@/app/reviser/cours/ai-actions'
import BottomSheet from '@/components/carnet/BottomSheet'

type Source = 'texte' | 'photo'

/** Taille au-delà de laquelle une photo est refusée (avant encodage base64). */
const MAX_PHOTO_OCTETS = 2_800_000

/**
 * « Ton cours → questions » — avec, ENFIN, la validation que la carte promet.
 *
 * Deux promesses étaient affichées et non tenues :
 *
 *   1. « COLLE TON COURS » — le champ acceptait 500 caractères. On n'y colle
 *      pas un cours, on y écrit un thème. Il accepte maintenant un chapitre
 *      entier, et surtout : une PHOTO, puisque le cours d'un élève est une
 *      photo dans son téléphone.
 *
 *   2. « TU VALIDES » — les questions étaient écrites DIRECTEMENT en base.
 *      L'élève ne validait rien et découvrait dans son cours des questions
 *      qu'il n'avait jamais relues. Elles passent désormais par cet écran :
 *      il garde, il jette, une par une, et RIEN n'est écrit avant qu'il ait
 *      touché « Ajouter ».
 */
export default function GenerationIaSheet({
  courseId,
  chapterId,
  niveau,
  open,
  onClose,
}: {
  courseId: string
  chapterId: string | null
  /** Classe de l'élève, pour caler le niveau des questions. */
  niveau?: string
  open: boolean
  onClose: () => void
}) {
  const router = useRouter()
  const [source, setSource] = useState<Source>('texte')
  const [texte, setTexte] = useState('')
  const [photo, setPhoto] = useState<string | null>(null)
  const [count, setCount] = useState(8)
  const [style, setStyle] = useState<'qcm' | 'flashcard' | 'mixte'>('mixte')
  const [message, setMessage] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  // Les questions PROPOSÉES, en attente de validation. Rien n'est en base.
  const [proposees, setProposees] = useState<QuestionProposee[] | null>(null)
  const [gardees, setGardees] = useState<Set<number>>(new Set())
  const fileRef = useRef<HTMLInputElement | null>(null)

  const pretAGenerer =
    source === 'texte' ? texte.trim().length > 0 : photo !== null

  const choisirPhoto = (file: File | undefined) => {
    if (!file) return
    if (file.size > MAX_PHOTO_OCTETS) {
      setMessage('Cette photo est trop lourde. Reprends-la en plus petit.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setPhoto(typeof reader.result === 'string' ? reader.result : null)
      setMessage(null)
    }
    reader.onerror = () => setMessage('Cette photo n’a pas pu être lue.')
    reader.readAsDataURL(file)
  }

  const generer = () => {
    if (pending || !pretAGenerer) return
    sfx.tap()
    setMessage(null)
    startTransition(async () => {
      const res = await proposerQuestions(
        courseId,
        source === 'photo' && photo
          ? { kind: 'image', dataUrl: photo }
          : { kind: 'texte', texte },
        count,
        style,
        niveau,
      )
      if (res.ok && res.questions && res.questions.length > 0) {
        setProposees(res.questions)
        // Tout est gardé par défaut : l'élève RETIRE ce qui ne va pas, il n'a
        // pas à cocher vingt cases pour obtenir ce qu'il a demandé.
        setGardees(new Set(res.questions.map((_, i) => i)))
        sfx.complete()
      } else if (res.unavailable) {
        setMessage('La génération n’est pas disponible pour l’instant.')
      } else if (res.quota) {
        setMessage('Tu as atteint ta limite de générations pour aujourd’hui.')
      } else {
        setMessage('La génération a échoué. Réessaie dans un instant.')
      }
    })
  }

  const enregistrer = () => {
    if (pending || !proposees) return
    const choisies = proposees.filter((_, i) => gardees.has(i))
    if (choisies.length === 0) return
    sfx.tap()
    startTransition(async () => {
      const res = await enregistrerQuestionsValidees(
        courseId,
        chapterId,
        choisies.map((q) => ({ type: q.type, content: q.content })),
      )
      if (res.ok) {
        sfx.complete()
        fermer()
        router.refresh()
      } else {
        setMessage('L’enregistrement a échoué. Réessaie dans un instant.')
      }
    })
  }

  const fermer = () => {
    setProposees(null)
    setGardees(new Set())
    setTexte('')
    setPhoto(null)
    setMessage(null)
    onClose()
  }

  // ---------------------------------------------------- écran de validation ---
  if (proposees) {
    return (
      <BottomSheet
        open={open}
        onClose={fermer}
        title={`${proposees.length} question${proposees.length > 1 ? 's' : ''} proposée${proposees.length > 1 ? 's' : ''}`}
      >
        <div className="flex flex-col gap-3">
          <p className="px-1 text-[11px] font-semibold text-muted-foreground">
            Relis-les. Retire ce qui est faux ou hors sujet — rien n’est encore
            dans ton cours.
          </p>

          <ul className="flex max-h-96 flex-col gap-1.5 overflow-y-auto">
            {proposees.map((q, i) => {
              const gardee = gardees.has(i)
              return (
                <li
                  key={i}
                  className={cn(
                    'flex items-start gap-2 rounded-2xl px-3 py-2.5 transition',
                    gardee ? 'bg-white ring-1 ring-black/5' : 'bg-muted/40 opacity-50',
                  )}
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-[10px] font-extrabold text-primary uppercase">
                      {isQuestionType(q.type) ? TYPE_LABEL[q.type] : q.type}
                    </span>
                    <span className="mt-0.5 block text-xs leading-snug font-semibold text-foreground">
                      {q.apercu}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      sfx.tap()
                      setGardees((set) => {
                        const copie = new Set(set)
                        if (copie.has(i)) copie.delete(i)
                        else copie.add(i)
                        return copie
                      })
                    }}
                    aria-pressed={gardee}
                    aria-label={
                      gardee ? `Retirer la question ${i + 1}` : `Garder la question ${i + 1}`
                    }
                    className={cn(
                      'flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg transition',
                      gardee
                        ? 'bg-primary/10 text-primary'
                        : 'bg-black/5 text-muted-foreground',
                    )}
                  >
                    {gardee ? (
                      <Check className="size-4" aria-hidden="true" />
                    ) : (
                      <Trash2 className="size-3.5" aria-hidden="true" />
                    )}
                  </button>
                </li>
              )
            })}
          </ul>

          {message ? (
            <p
              role="alert"
              className="rounded-2xl bg-destructive/10 px-3 py-2 text-xs font-semibold text-destructive"
            >
              {message}
            </p>
          ) : null}

          <div className="flex flex-col gap-2">
            <button
              type="button"
              disabled={pending || gardees.size === 0}
              onClick={enregistrer}
              className="font-heading cursor-pointer rounded-2xl bg-primary px-4 py-3.5 text-sm font-extrabold text-primary-foreground shadow-sm transition active:translate-y-px disabled:opacity-50"
            >
              {pending
                ? 'Ajout…'
                : `Ajouter ${gardees.size} question${gardees.size > 1 ? 's' : ''}`}
            </button>
            <button
              type="button"
              onClick={() => {
                sfx.tap()
                setProposees(null)
              }}
              className="font-heading cursor-pointer rounded-2xl bg-muted/60 px-4 py-3 text-sm font-extrabold text-foreground"
            >
              Regénérer
            </button>
          </div>
        </div>
      </BottomSheet>
    )
  }

  // -------------------------------------------------------------- formulaire ---
  return (
    <BottomSheet open={open} onClose={fermer} title="Ton cours → questions">
      <div className="flex flex-col gap-3">
        <div
          role="tablist"
          aria-label="Source du cours"
          className="flex gap-1.5 rounded-2xl bg-muted/60 p-1"
        >
          {(
            [
              { id: 'texte' as Source, label: 'Texte', Icon: Type },
              { id: 'photo' as Source, label: 'Photo du cours', Icon: Camera },
            ]
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={source === t.id}
              onClick={() => {
                sfx.tap()
                setSource(t.id)
                setMessage(null)
              }}
              className={cn(
                'font-heading flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-extrabold transition',
                source === t.id
                  ? 'bg-white text-foreground shadow-sm'
                  : 'text-muted-foreground',
              )}
            >
              <t.Icon className="size-3.5" aria-hidden="true" />
              {t.label}
            </button>
          ))}
        </div>

        {source === 'texte' ? (
          <label className="flex flex-col gap-1.5">
            <span className="px-1 text-[11px] font-semibold text-muted-foreground">
              Colle ton cours en entier, ou écris juste un thème.
            </span>
            <textarea
              value={texte}
              onChange={(e) => setTexte(e.target.value)}
              rows={7}
              placeholder="La Première Guerre mondiale : causes, déroulement, bilan…"
              aria-label="Cours ou thème"
              className="rounded-2xl border border-black/10 bg-white px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-primary/40"
            />
          </label>
        ) : (
          <div className="flex flex-col gap-2">
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              capture="environment"
              onChange={(e) => choisirPhoto(e.target.files?.[0])}
              className="hidden"
            />
            {photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photo}
                alt="Aperçu de la photo du cours"
                className="max-h-56 w-full rounded-2xl object-contain ring-1 ring-black/5"
              />
            ) : null}
            <button
              type="button"
              onClick={() => {
                sfx.tap()
                fileRef.current?.click()
              }}
              className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-muted/60 px-4 py-4 text-sm font-extrabold text-foreground hover:bg-muted"
            >
              <Camera className="size-4" aria-hidden="true" />
              {photo ? 'Changer de photo' : 'Prendre ou choisir une photo'}
            </button>
          </div>
        )}

        <label className="flex items-center gap-3 px-1">
          <span className="text-xs font-bold text-muted-foreground">
            Combien ?
          </span>
          <input
            type="range"
            min={3}
            max={25}
            step={1}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--primary)]"
          />
          <span className="font-heading w-6 text-right text-sm font-extrabold text-foreground tabular-nums">
            {count}
          </span>
        </label>

        <div className="flex gap-1.5">
          {(
            [
              { id: 'mixte' as const, label: 'Mélangé' },
              { id: 'qcm' as const, label: 'QCM' },
              { id: 'flashcard' as const, label: 'Flashcards' },
            ]
          ).map(({ id, label }) => (
            <button
              key={id}
              type="button"
              aria-pressed={style === id}
              onClick={() => {
                sfx.tap()
                setStyle(id)
              }}
              className={cn(
                'flex-1 cursor-pointer rounded-xl px-2 py-2 text-xs font-extrabold transition',
                style === id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted/60 text-muted-foreground',
              )}
            >
              {label}
            </button>
          ))}
        </div>

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
          disabled={pending || !pretAGenerer}
          onClick={generer}
          className="font-heading flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3.5 text-sm font-extrabold text-primary-foreground shadow-sm transition active:translate-y-px disabled:opacity-50"
        >
          <Sparkles className="size-4" aria-hidden="true" />
          {pending ? 'Rédaction en cours…' : 'Rédiger les questions'}
        </button>
        <p className="text-center text-[10px] font-semibold text-muted-foreground">
          Tu les reliras avant qu’elles entrent dans ton cours.
        </p>
      </div>
    </BottomSheet>
  )
}
