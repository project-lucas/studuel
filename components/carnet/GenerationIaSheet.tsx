'use client'

import { useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Camera, Check, Sparkles, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { TYPE_LABEL, isQuestionType } from '@/lib/carnet-cours'
import type { OrigineQuestion } from '@/lib/carnet/origine'
import {
  enregistrerQuestionsValidees,
  proposerQuestions,
  transcrirePhoto,
  type QuestionProposee,
} from '@/app/carnet/cours/ai-actions'
import BottomSheet from '@/components/carnet/BottomSheet'

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
 *      photo dans son téléphone. L'appareil photo est en haut à droite de la
 *      feuille (Lucas, 10/09/2026) : la photo est TRANSCRITE et son texte
 *      apparaît dans le champ, où l'élève le relit avant de générer — plus
 *      d'onglet « Photo » qui envoyait l'image telle quelle.
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
  photoDisponible = false,
  texteInitial,
  origineInitiale = 'texte',
  open,
  onClose,
}: {
  courseId: string
  chapterId: string | null
  /** Classe de l'élève, pour caler le niveau des questions. */
  niveau?: string
  /** Un texte déjà lu (le PDF d'un cours, `lirePdf`) : la feuille s'ouvre
   *  dessus, source « texte », comme si l'élève l'avait collé. */
  texteInitial?: string
  /** L'origine à retenir pour les questions écrites (357) : `pdf` quand le
   *  texte initial vient d'un PDF, `texte` sinon ; `photo` s'impose dès qu'une
   *  photo a été transcrite. */
  origineInitiale?: OrigineQuestion
  /** Un modèle qui lit les images est branché (`visionDisponible()`). Sans lui,
   *  l'appareil photo reste visible mais explique qu'il n'est pas branché. */
  photoDisponible?: boolean
  open: boolean
  onClose: () => void
}) {
  const router = useRouter()
  const [texte, setTexte] = useState('')
  const [origine, setOrigine] = useState<OrigineQuestion>(origineInitiale)
  const [lecturePhoto, setLecturePhoto] = useState(false)
  const [count, setCount] = useState(8)
  const [style, setStyle] = useState<'qcm' | 'flashcard' | 'mixte'>('mixte')
  const [message, setMessage] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  // Les questions PROPOSÉES, en attente de validation. Rien n'est en base.
  const [proposees, setProposees] = useState<QuestionProposee[] | null>(null)
  const [gardees, setGardees] = useState<Set<number>>(new Set())
  const fileRef = useRef<HTMLInputElement | null>(null)

  // Le texte initial change (un PDF vient d'être lu) : on le prend, en
  // source « texte » — dérivation pendant le rendu, pas d'effet.
  const [prevTexteInitial, setPrevTexteInitial] = useState(texteInitial)
  if (texteInitial !== prevTexteInitial) {
    setPrevTexteInitial(texteInitial)
    if (typeof texteInitial === 'string') {
      setTexte(texteInitial)
      setOrigine(origineInitiale)
      setMessage(null)
    }
  }

  const pretAGenerer = texte.trim().length > 0 && !lecturePhoto

  /** L'appareil photo : la photo est lue, son texte rejoint le champ. */
  const choisirPhoto = (file: File | undefined) => {
    if (fileRef.current) fileRef.current.value = ''
    if (!file || lecturePhoto) return
    if (file.size > MAX_PHOTO_OCTETS) {
      setMessage('Cette photo est trop lourde. Reprends-la en plus petit.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = typeof reader.result === 'string' ? reader.result : null
      if (!dataUrl) return
      setMessage(null)
      setLecturePhoto(true)
      startTransition(async () => {
        const res = await transcrirePhoto(courseId, dataUrl)
        setLecturePhoto(false)
        if (res.ok && typeof res.texte === 'string' && res.texte.length > 0) {
          // Le texte lu s'ajoute à ce qui est déjà là : deux pages, deux photos.
          setTexte((t) => (t.trim().length > 0 ? `${t.trimEnd()}\n\n${res.texte}` : res.texte ?? ''))
          setOrigine('photo')
          sfx.complete()
        } else if (res.ok) {
          setMessage('Aucun texte lisible sur cette photo. Reprends-la de plus près.')
        } else if (res.unavailable) {
          setMessage('La lecture des photos n’est pas disponible pour l’instant.')
        } else if (res.quota) {
          setMessage('Tu as atteint ta limite de générations pour aujourd’hui.')
        } else {
          setMessage('Cette photo n’a pas pu être lue. Réessaie dans un instant.')
        }
      })
    }
    reader.onerror = () => setMessage('Cette photo n’a pas pu être lue.')
    reader.readAsDataURL(file)
  }

  const prendrePhoto = () => {
    sfx.tap()
    if (!photoDisponible) {
      setMessage('La lecture des photos n’est pas branchée sur ce compte pour l’instant.')
      return
    }
    fileRef.current?.click()
  }

  const generer = () => {
    if (pending || !pretAGenerer) return
    sfx.tap()
    setMessage(null)
    startTransition(async () => {
      const res = await proposerQuestions(
        courseId,
        { kind: 'texte', texte },
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
        origine,
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
    setOrigine(origineInitiale)
    setLecturePhoto(false)
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
                    gardee
                      ? 'bg-white ring-1 ring-black/5'
                      : 'bg-muted/40 opacity-50',
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
                      gardee
                        ? `Retirer la question ${i + 1}`
                        : `Garder la question ${i + 1}`
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
    <BottomSheet
      open={open}
      onClose={fermer}
      title="Ton cours → questions"
      action={
        <button
          type="button"
          disabled={pending || lecturePhoto}
          onClick={prendrePhoto}
          aria-label="Prendre mon cours en photo"
          title="Prendre mon cours en photo"
          className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-primary/10 text-primary transition active:scale-90 disabled:opacity-60"
        >
          <Camera className="size-4" strokeWidth={2.4} aria-hidden="true" />
        </button>
      }
    >
      <div className="flex flex-col gap-3">
        {/* La photo : un champ caché, ouvert par l'appareil photo du titre.
            `capture` ouvre directement l'appareil sur téléphone. */}
        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          capture="environment"
          onChange={(e) => choisirPhoto(e.target.files?.[0])}
          className="hidden"
          aria-hidden="true"
          tabIndex={-1}
        />

        <label className="flex flex-col gap-1.5">
          <span className="px-1 text-[11px] font-semibold text-muted-foreground">
            {lecturePhoto
              ? 'Lecture de la photo…'
              : 'Colle ton cours en entier, écris un thème, ou prends-le en photo.'}
          </span>
          <textarea
            value={texte}
            onChange={(e) => setTexte(e.target.value)}
            rows={7}
            placeholder="La Première Guerre mondiale : causes, déroulement, bilan…"
            aria-label="Cours ou thème"
            aria-busy={lecturePhoto}
            className={cn(
              'rounded-2xl border border-black/10 bg-white px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-primary/40',
              lecturePhoto && 'animate-pulse',
            )}
          />
        </label>

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
          {[
            { id: 'mixte' as const, label: 'Mélangé' },
            { id: 'qcm' as const, label: 'QCM' },
            { id: 'flashcard' as const, label: 'Flashcards' },
          ].map(({ id, label }) => (
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
