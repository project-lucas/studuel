'use client'

import { useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronRight, Plus, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { toast } from '@/lib/toast'
import {
  buildCourseTree,
  TYPE_LABEL,
  type ChapterNode,
  type CourseChapter,
} from '@/lib/carnet-cours'
import { deleteChapter, deleteQuestion, renameChapter } from '@/app/carnet/cours/actions'
import { CHAPTER_ICON, TEINTE_CONTENU, TYPE_ICON } from '@/components/carnet/style'
import { teinteDossier, teinteQuestion } from '@/lib/carnet/origine'
import type { CourseQuestionRow } from '@/components/carnet/types'

// -----------------------------------------------------------------------------
// LES CHAPITRES D'UN DOSSIER — des rangées dans le bloc du dossier, rien de plus.
//
// Refonte du 10/09/2026 (Lucas : « épure le tout, je n'y comprends rien, on
// repart de zéro ici », puis « Chapitres & Questions comme Wooflash »).
// Chaque chapitre est UNE LIGNE : son icône, son nom (on le touche pour le
// renommer), et LE + à côté du nom, qui ouvre « Créer du contenu » ciblé sur
// lui. Ses questions sont listées dessous, dépliées d'emblée ; on touche une
// question pour l'ouvrir, la corbeille la supprime.
//
// CODE COULEUR (Lucas, 10/09/2026) : la pastille d'un dossier dit ce qu'il
// contient — rouge si un PDF y a été inséré, violet s'il a des flashcards,
// jaune sinon ; chaque question porte la même lecture (lib/carnet/origine.ts).
//
// Ce qui a été retiré avec l'ancien `CourseTree` : la poignée de
// réordonnancement, le menu ⋮ (déplacer, dupliquer, sous-chapitre), le
// texte d'accueil. Un chapitre se renomme et se supprime depuis son nom, et
// c'est tout. Les sous-chapitres qui existent déjà en base restent affichés
// en retrait ; on n'en crée plus d'ici.
// -----------------------------------------------------------------------------

type Rappels = {
  /** Le + d'un chapitre : créer du contenu dedans. */
  onAjouter: (chapterId: string) => void
}

/** Toutes les questions d'un dossier, sous-dossiers compris. */
function questionsDuDossier(node: ChapterNode<CourseQuestionRow>): CourseQuestionRow[] {
  return [...node.questions, ...node.children.flatMap(questionsDuDossier)]
}

function LigneQuestion({
  courseId,
  question,
  pending,
  executer,
}: {
  courseId: string
  question: CourseQuestionRow
  pending: boolean
  executer: (fn: () => Promise<void>) => void
}) {
  const router = useRouter()
  const Icone = TYPE_ICON[question.type]
  const teinte = TEINTE_CONTENU[teinteQuestion(question)]
  return (
    <li className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => {
          sfx.tap()
          router.push(`/carnet/cours/${courseId}/question/${question.id}`)
        }}
        className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 rounded-xl py-1.5 text-left active:bg-muted/50"
      >
        <span className={cn('flex size-7 shrink-0 items-center justify-center rounded-lg', teinte)}>
          <Icone className="size-3.5" strokeWidth={2.2} aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="line-clamp-1 text-[13px] font-semibold text-foreground">{question.summary}</span>
          <span className="block text-[10px] font-bold text-muted-foreground">
            {TYPE_LABEL[question.type]}
            {question.ready ? '' : ' · brouillon'}
          </span>
        </span>
      </button>
      <button
        type="button"
        disabled={pending}
        aria-label={`Supprimer la question ${question.summary}`}
        onClick={() => {
          if (!window.confirm('Supprimer cette question ?')) return
          sfx.tap()
          executer(async () => {
            const r = await deleteQuestion(courseId, question.id)
            if (!r.ok) toast('La question n’a pas pu être supprimée.', 'error')
          })
        }}
        className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted-foreground/60 transition hover:bg-destructive/10 hover:text-destructive disabled:opacity-60"
      >
        <Trash2 className="size-4" aria-hidden="true" />
      </button>
    </li>
  )
}

function LigneDossier({
  courseId,
  node,
  profondeur,
  renommerDemande,
  onRenommerFin,
  rappels,
  pending,
  executer,
}: {
  courseId: string
  node: ChapterNode<CourseQuestionRow>
  profondeur: number
  /** Le chapitre vient d'être créé : son nom s'ouvre en saisie tout de suite. */
  renommerDemande: boolean
  onRenommerFin: () => void
  rappels: Rappels
  pending: boolean
  executer: (fn: () => Promise<void>) => void
}) {
  const [ouvert, setOuvert] = useState(true)
  const [renommer, setRenommer] = useState(renommerDemande)
  const [brouillon, setBrouillon] = useState(node.title)
  const nb = node.totalQuestions
  const teinte = TEINTE_CONTENU[teinteDossier(questionsDuDossier(node))]

  const validerNom = () => {
    setRenommer(false)
    onRenommerFin()
    const titre = brouillon.trim()
    if (titre.length === 0 || titre === node.title) {
      setBrouillon(node.title)
      return
    }
    executer(async () => {
      const r = await renameChapter(courseId, node.id, titre)
      if (!r.ok) toast('Le nom n’a pas pu être enregistré.', 'error')
    })
  }

  const supprimer = () => {
    const ok = window.confirm(
      `Supprimer « ${node.title} »${nb > 0 ? ` et ses ${nb} question${nb > 1 ? 's' : ''}` : ''} ?`,
    )
    if (!ok) return
    sfx.tap()
    setRenommer(false)
    onRenommerFin()
    executer(async () => {
      const r = await deleteChapter(courseId, node.id)
      if (!r.ok) toast('Le chapitre n’a pas pu être supprimé.', 'error')
    })
  }

  return (
    <li className={cn(profondeur > 0 && 'ml-4 border-l-2 border-primary/10 pl-2')}>
      <div className="flex items-center gap-1.5 py-1.5">
        <button
          type="button"
          onClick={() => {
            sfx.tap()
            setOuvert((v) => !v)
          }}
          aria-expanded={ouvert}
          aria-label={ouvert ? `Replier ${node.title}` : `Déplier ${node.title}`}
          className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-lg text-muted-foreground"
        >
          <ChevronRight
            className={cn('size-4 transition-transform', ouvert && 'rotate-90')}
            aria-hidden="true"
          />
        </button>
        <span className={cn('flex size-9 shrink-0 items-center justify-center rounded-xl', teinte)}>
          <CHAPTER_ICON className="size-[18px]" strokeWidth={2.2} aria-hidden="true" />
        </span>

        {renommer ? (
          <form
            className="flex min-w-0 flex-1 items-center gap-1.5"
            onSubmit={(e) => {
              e.preventDefault()
              validerNom()
            }}
          >
            <input
              autoFocus
              value={brouillon}
              onChange={(e) => setBrouillon(e.target.value)}
              onFocus={(e) => e.currentTarget.select()}
              onBlur={validerNom}
              maxLength={120}
              aria-label="Nom du chapitre"
              className="font-heading min-w-0 flex-1 rounded-xl border border-primary/40 bg-white px-2 py-1.5 text-sm font-extrabold text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none"
            />
            <button
              type="button"
              disabled={pending}
              // `onMouseDown` : le blur de l'input validerait le nom avant le clic.
              onMouseDown={(e) => e.preventDefault()}
              onClick={supprimer}
              aria-label={`Supprimer le chapitre ${node.title}`}
              className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-destructive/10 text-destructive disabled:opacity-60"
            >
              <Trash2 className="size-4" aria-hidden="true" />
            </button>
          </form>
        ) : (
          <>
            <button
              type="button"
              onClick={() => {
                sfx.tap()
                setBrouillon(node.title)
                setRenommer(true)
              }}
              aria-label={`Renommer ${node.title}`}
              className="min-w-0 flex-1 cursor-pointer text-left"
            >
              <span className="font-heading line-clamp-1 text-[14px] font-extrabold text-foreground">
                {node.title}
              </span>
              <span className="block text-[10px] font-bold text-muted-foreground">
                {nb === 0 ? 'Vide' : `${nb} question${nb > 1 ? 's' : ''}`}
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                sfx.tap()
                rappels.onAjouter(node.id)
              }}
              aria-haspopup="dialog"
              aria-label={`Créer du contenu dans ${node.title}`}
              className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition active:scale-90"
            >
              <Plus className="size-5" strokeWidth={2.6} aria-hidden="true" />
            </button>
          </>
        )}
      </div>

      {ouvert && (node.questions.length > 0 || node.children.length > 0) ? (
        <ul className="mb-1 flex flex-col pl-9">
          {node.questions.map((q) => (
            <LigneQuestion key={q.id} courseId={courseId} question={q} pending={pending} executer={executer} />
          ))}
          {node.children.map((enfant) => (
            <LigneDossier
              key={enfant.id}
              courseId={courseId}
              node={enfant}
              profondeur={profondeur + 1}
              renommerDemande={false}
              onRenommerFin={onRenommerFin}
              rappels={rappels}
              pending={pending}
              executer={executer}
            />
          ))}
        </ul>
      ) : null}
    </li>
  )
}

export default function DossiersDuCours({
  courseId,
  chapters,
  questions,
  renommerId,
  onRenommerFin,
  onAjouter,
}: {
  courseId: string
  chapters: CourseChapter[]
  questions: CourseQuestionRow[]
  /** Le chapitre qui vient d'être créé, à nommer tout de suite. */
  renommerId: string | null
  onRenommerFin: () => void
} & Rappels) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const executer = (fn: () => Promise<void>) => {
    startTransition(async () => {
      await fn()
      router.refresh()
    })
  }

  const arbre = useMemo(() => buildCourseTree(chapters, questions), [chapters, questions])
  const rappels: Rappels = { onAjouter }

  if (arbre.chapters.length === 0 && arbre.rootQuestions.length === 0) {
    return (
      <p className="py-6 text-center text-sm font-semibold text-muted-foreground">
        Ce dossier est vide. Ajoute un dossier pour commencer.
      </p>
    )
  }

  return (
    <div aria-busy={pending}>
      <ul className="flex flex-col">
        {arbre.chapters.map((node) => (
          <LigneDossier
            key={node.id}
            courseId={courseId}
            node={node}
            profondeur={0}
            renommerDemande={node.id === renommerId}
            onRenommerFin={onRenommerFin}
            rappels={rappels}
            pending={pending}
            executer={executer}
          />
        ))}
      </ul>

      {/* Les questions posées hors chapitre (génération IA ou PDF sur le
          dossier entier) : on ne les cache pas, on les nomme. */}
      {arbre.rootQuestions.length > 0 ? (
        <div className="mt-2">
          <p className="mb-1 px-1 text-[11px] font-extrabold tracking-wide text-muted-foreground uppercase">
            Sans chapitre
          </p>
          <ul className="flex flex-col pl-1">
            {arbre.rootQuestions.map((q) => (
              <LigneQuestion key={q.id} courseId={courseId} question={q} pending={pending} executer={executer} />
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
