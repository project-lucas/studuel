'use client'

import { useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Reorder, useDragControls } from 'framer-motion'
import {
  ChevronRight,
  Copy,
  CornerDownRight,
  FolderInput,
  GripVertical,
  Pencil,
  Plus,
  Trash2,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import {
  buildCourseTree,
  canMoveChapter,
  TYPE_LABEL,
  type ChapterNode,
  type CourseChapter,
} from '@/lib/carnet-cours'
import {
  deleteChapter,
  deleteQuestion,
  duplicateChapter,
  duplicateQuestion,
  moveChapter,
  moveQuestion,
  renameChapter,
  reorderChapters,
  reorderQuestions,
} from '@/app/reviser/cours/actions'
import BottomSheet from '@/components/carnet/BottomSheet'
import { CHAPTER_ICON, TYPE_ICON } from '@/components/carnet/style'
import type { CourseQuestionRow } from '@/components/carnet/types'

// Cible d'un déplacement en cours (feuille « Déplacer vers… »).
type MoveTarget =
  | { kind: 'chapter'; id: string; title: string }
  | { kind: 'question'; id: string; title: string }

type TreeCallbacks = {
  onAddQuestion: (chapterId: string | null) => void
  onAddChapter: (parentId: string | null) => void
  onEditQuestion: (questionId: string) => void
}

// ---------------------------------------------------------------- lignes ----

/** Barre d'actions inline d'une ligne (même mécanique que la Bibliothèque). */
function RowActions({
  actions,
  onClose,
}: {
  actions: { label: string; icon: typeof Pencil; run: () => void; danger?: boolean }[]
  onClose: () => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-1 py-1.5 pl-8">
      {actions.map((a) => (
        <button
          key={a.label}
          type="button"
          onClick={() => {
            sfx.tap()
            a.run()
          }}
          className={cn(
            'flex cursor-pointer items-center gap-1 rounded-full px-2.5 py-1.5 text-[11px] font-bold',
            a.danger
              ? 'bg-destructive/10 text-destructive'
              : 'bg-muted text-foreground',
          )}
        >
          <a.icon className="size-3.5" aria-hidden="true" />
          {a.label}
        </button>
      ))}
      <button
        type="button"
        onClick={onClose}
        aria-label="Fermer le menu"
        className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
      >
        <X className="size-3.5" aria-hidden="true" />
      </button>
    </div>
  )
}

function QuestionRow({
  courseId,
  question,
  menuOpen,
  onMenu,
  onMove,
  callbacks,
  pending,
  startTransition,
}: {
  courseId: string
  question: CourseQuestionRow
  menuOpen: boolean
  onMenu: (id: string | null) => void
  onMove: (target: MoveTarget) => void
  callbacks: TreeCallbacks
  pending: boolean
  startTransition: (fn: () => Promise<void>) => void
}) {
  const controls = useDragControls()
  const Icon = TYPE_ICON[question.type]

  return (
    <Reorder.Item
      value={question.id}
      dragListener={false}
      dragControls={controls}
      className="border-b border-black/5 bg-white last:border-b-0"
    >
      <div className="flex min-w-0 items-center gap-1.5 py-2">
        {/* Poignée de drag : seule zone qui déclenche le glisser. */}
        <button
          type="button"
          aria-label={`Réordonner la question ${question.summary}`}
          onPointerDown={(e) => controls.start(e)}
          className="flex size-7 shrink-0 cursor-grab touch-none items-center justify-center rounded-lg text-muted-foreground/60 active:cursor-grabbing"
        >
          <GripVertical className="size-4" aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={() => {
            sfx.tap()
            callbacks.onEditQuestion(question.id)
          }}
          className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 text-left"
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon className="size-4" strokeWidth={2.2} aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="line-clamp-2 text-[13px] leading-snug font-semibold text-foreground">
              {question.summary}
            </span>
            <span className="mt-0.5 flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground">
              {TYPE_LABEL[question.type]}
              {!question.ready ? (
                <span className="rounded-full bg-highlight/30 px-1.5 py-px text-[9px] font-extrabold tracking-wide text-foreground/80 uppercase">
                  Brouillon
                </span>
              ) : null}
            </span>
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            sfx.tap()
            onMenu(menuOpen ? null : question.id)
          }}
          aria-label={`Options de la question ${question.summary}`}
          aria-haspopup="menu"
          className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
        >
          ⋮
        </button>
      </div>

      {menuOpen ? (
        <RowActions
          onClose={() => onMenu(null)}
          actions={[
            {
              label: 'Modifier',
              icon: Pencil,
              run: () => callbacks.onEditQuestion(question.id),
            },
            {
              label: 'Déplacer',
              icon: FolderInput,
              run: () =>
                onMove({
                  kind: 'question',
                  id: question.id,
                  title: question.summary,
                }),
            },
            {
              label: 'Dupliquer',
              icon: Copy,
              run: () => {
                if (pending) return
                startTransition(async () => {
                  await duplicateQuestion(courseId, question.id)
                  onMenu(null)
                })
              },
            },
            {
              label: 'Supprimer',
              icon: Trash2,
              danger: true,
              run: () => {
                if (pending) return
                startTransition(async () => {
                  await deleteQuestion(courseId, question.id)
                  onMenu(null)
                })
              },
            },
          ]}
        />
      ) : null}
    </Reorder.Item>
  )
}

function ChapterBlock({
  courseId,
  node,
  depth,
  allChapters,
  expanded,
  onToggle,
  menuId,
  onMenu,
  onMove,
  callbacks,
  pending,
  startTransition,
}: {
  courseId: string
  node: ChapterNode<CourseQuestionRow>
  depth: number
  allChapters: CourseChapter[]
  expanded: Set<string>
  onToggle: (id: string) => void
  menuId: string | null
  onMenu: (id: string | null) => void
  onMove: (target: MoveTarget) => void
  callbacks: TreeCallbacks
  pending: boolean
  startTransition: (fn: () => Promise<void>) => void
}) {
  const controls = useDragControls()
  const isOpen = expanded.has(node.id)
  const [renaming, setRenaming] = useState(false)
  const [draft, setDraft] = useState(node.title)
  const menuOpen = menuId === node.id

  const commitRename = () => {
    setRenaming(false)
    const title = draft.trim()
    if (title.length === 0 || title === node.title) return
    startTransition(async () => {
      await renameChapter(courseId, node.id, title)
    })
  }

  return (
    <Reorder.Item
      value={node.id}
      dragListener={false}
      dragControls={controls}
      className="border-b border-black/5 bg-white last:border-b-0"
    >
      <div className="flex min-w-0 items-center gap-1.5 py-2">
        <button
          type="button"
          aria-label={`Réordonner le chapitre ${node.title}`}
          onPointerDown={(e) => controls.start(e)}
          className="flex size-7 shrink-0 cursor-grab touch-none items-center justify-center rounded-lg text-muted-foreground/60 active:cursor-grabbing"
        >
          <GripVertical className="size-4" aria-hidden="true" />
        </button>

        {renaming ? (
          <form
            className="flex min-w-0 flex-1 items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault()
              commitRename()
            }}
          >
            <input
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={commitRename}
              maxLength={120}
              aria-label="Nouveau nom du chapitre"
              className="min-w-0 flex-1 rounded-xl border border-primary/40 bg-white px-2 py-1.5 text-sm font-semibold text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none"
            />
          </form>
        ) : (
          <button
            type="button"
            onClick={() => {
              sfx.tap()
              onToggle(node.id)
            }}
            aria-expanded={isOpen}
            className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 text-left"
          >
            <ChevronRight
              className={cn(
                'size-4 shrink-0 text-muted-foreground transition-transform',
                isOpen && 'rotate-90',
              )}
              aria-hidden="true"
            />
            <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-highlight/25 text-foreground">
              <CHAPTER_ICON
                className="size-4"
                strokeWidth={2.2}
                aria-hidden="true"
              />
            </span>
            <span className="min-w-0 flex-1">
              <span className="font-heading line-clamp-2 text-[13px] leading-snug font-extrabold text-foreground">
                {node.title}
              </span>
              <span className="mt-0.5 block text-[10px] font-bold text-muted-foreground">
                {node.totalQuestions}{' '}
                {node.totalQuestions > 1 ? 'questions' : 'question'}
              </span>
            </span>
          </button>
        )}

        <button
          type="button"
          onClick={() => {
            sfx.tap()
            onMenu(menuOpen ? null : node.id)
          }}
          aria-label={`Options du chapitre ${node.title}`}
          aria-haspopup="menu"
          className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
        >
          ⋮
        </button>
      </div>

      {menuOpen ? (
        <RowActions
          onClose={() => onMenu(null)}
          actions={[
            {
              label: 'Renommer',
              icon: Pencil,
              run: () => {
                setDraft(node.title)
                setRenaming(true)
                onMenu(null)
              },
            },
            {
              label: 'Ajouter une question',
              icon: Plus,
              run: () => {
                callbacks.onAddQuestion(node.id)
                onMenu(null)
              },
            },
            ...(depth < 3
              ? [
                  {
                    label: 'Sous-chapitre',
                    icon: CornerDownRight,
                    run: () => {
                      callbacks.onAddChapter(node.id)
                      onMenu(null)
                    },
                  },
                ]
              : []),
            {
              label: 'Déplacer',
              icon: FolderInput,
              run: () =>
                onMove({ kind: 'chapter', id: node.id, title: node.title }),
            },
            {
              label: 'Dupliquer',
              icon: Copy,
              run: () => {
                if (pending) return
                startTransition(async () => {
                  await duplicateChapter(courseId, node.id)
                  onMenu(null)
                })
              },
            },
            {
              label: 'Supprimer',
              icon: Trash2,
              danger: true,
              run: () => {
                if (pending) return
                const ok = window.confirm(
                  `Supprimer « ${node.title} » et tout son contenu (${node.totalQuestions} question${node.totalQuestions > 1 ? 's' : ''}) ?`,
                )
                if (!ok) return
                startTransition(async () => {
                  await deleteChapter(courseId, node.id)
                  onMenu(null)
                })
              },
            },
          ]}
        />
      ) : null}

      {/* Le contenu du chapitre, en retrait réduit (lisibilité 375 px). */}
      {isOpen ? (
        <div className="border-l-2 border-primary/15 pb-1 pl-2.5">
          <TreeLevel
            courseId={courseId}
            chapters={node.children}
            questions={node.questions}
            depth={depth + 1}
            allChapters={allChapters}
            expanded={expanded}
            onToggle={onToggle}
            menuId={menuId}
            onMenu={onMenu}
            onMove={onMove}
            callbacks={callbacks}
            pending={pending}
            startTransition={startTransition}
          />
        </div>
      ) : null}
    </Reorder.Item>
  )
}

// Un niveau de l'arbre : ses chapitres (réordonnables entre eux) puis ses
// questions (réordonnables entre elles).
function TreeLevel({
  courseId,
  chapters,
  questions,
  depth,
  allChapters,
  expanded,
  onToggle,
  menuId,
  onMenu,
  onMove,
  callbacks,
  pending,
  startTransition,
}: {
  courseId: string
  chapters: ChapterNode<CourseQuestionRow>[]
  questions: CourseQuestionRow[]
  depth: number
  allChapters: CourseChapter[]
  expanded: Set<string>
  onToggle: (id: string) => void
  menuId: string | null
  onMenu: (id: string | null) => void
  onMove: (target: MoveTarget) => void
  callbacks: TreeCallbacks
  pending: boolean
  startTransition: (fn: () => Promise<void>) => void
}) {
  // Ordres locaux (optimistes) — resynchronisés quand le serveur répond
  // (dérivation pendant le rendu, pas d'effet : pattern « previous props »).
  const [chapterOrder, setChapterOrder] = useState(chapters.map((c) => c.id))
  const [questionOrder, setQuestionOrder] = useState(questions.map((q) => q.id))
  const [prevChapters, setPrevChapters] = useState(chapters)
  const [prevQuestions, setPrevQuestions] = useState(questions)
  if (chapters !== prevChapters) {
    setPrevChapters(chapters)
    setChapterOrder(chapters.map((c) => c.id))
  }
  if (questions !== prevQuestions) {
    setPrevQuestions(questions)
    setQuestionOrder(questions.map((q) => q.id))
  }

  const chapterById = new Map(chapters.map((c) => [c.id, c]))
  const questionById = new Map(questions.map((q) => [q.id, q]))

  return (
    <>
      {chapters.length > 0 ? (
        <Reorder.Group
          axis="y"
          values={chapterOrder}
          onReorder={(order) => {
            setChapterOrder(order)
            startTransition(async () => {
              await reorderChapters(courseId, order)
            })
          }}
          className="list-none"
        >
          {chapterOrder.flatMap((id) => {
            const node = chapterById.get(id)
            if (!node) return []
            return [
              <ChapterBlock
                key={id}
                courseId={courseId}
                node={node}
                depth={depth}
                allChapters={allChapters}
                expanded={expanded}
                onToggle={onToggle}
                menuId={menuId}
                onMenu={onMenu}
                onMove={onMove}
                callbacks={callbacks}
                pending={pending}
                startTransition={startTransition}
              />,
            ]
          })}
        </Reorder.Group>
      ) : null}

      {questions.length > 0 ? (
        <Reorder.Group
          axis="y"
          values={questionOrder}
          onReorder={(order) => {
            setQuestionOrder(order)
            startTransition(async () => {
              await reorderQuestions(courseId, order)
            })
          }}
          className="list-none"
        >
          {questionOrder.flatMap((id) => {
            const q = questionById.get(id)
            if (!q) return []
            return [
              <QuestionRow
                key={id}
                courseId={courseId}
                question={q}
                menuOpen={menuId === id}
                onMenu={onMenu}
                onMove={onMove}
                callbacks={callbacks}
                pending={pending}
                startTransition={startTransition}
              />,
            ]
          })}
        </Reorder.Group>
      ) : null}
    </>
  )
}

// ------------------------------------------------------------------ export ----

/**
 * L'arbre « Chapitres & Questions » d'un cours : dossiers imbriqués
 * (2 niveaux et plus, plafonnés par MAX_CHAPTER_DEPTH), questions typées,
 * réordonnement par poignée de drag, menu ⋮ par ligne (renommer, déplacer,
 * dupliquer, supprimer) et feuille « Déplacer vers… ».
 */
export default function CourseTree({
  courseId,
  chapters,
  questions,
  onAddQuestion,
  onAddChapter,
  onEditQuestion,
}: {
  courseId: string
  chapters: CourseChapter[]
  questions: CourseQuestionRow[]
} & TreeCallbacks) {
  const router = useRouter()
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [menuId, setMenuId] = useState<string | null>(null)
  const [moveTarget, setMoveTarget] = useState<MoveTarget | null>(null)
  const [pending, startRawTransition] = useTransition()

  // Toute mutation passe ici : action serveur puis refresh de la route.
  const startTransition = (fn: () => Promise<void>) => {
    startRawTransition(async () => {
      await fn()
      router.refresh()
    })
  }

  const tree = useMemo(
    () => buildCourseTree(chapters, questions),
    [chapters, questions],
  )

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  // Destinations possibles du déplacement en cours (chapitres aplatis,
  // indentés par profondeur), validées par la logique pure pour un chapitre.
  const moveDestinations = useMemo(() => {
    if (!moveTarget) return []
    const flat: { id: string | null; title: string; depth: number }[] = [
      { id: null, title: 'Racine du cours', depth: 0 },
    ]
    const walk = (nodes: ChapterNode<CourseQuestionRow>[], depth: number) => {
      for (const n of nodes) {
        flat.push({ id: n.id, title: n.title, depth })
        walk(n.children, depth + 1)
      }
    }
    walk(tree.chapters, 1)
    if (moveTarget.kind === 'question') return flat
    return flat.filter(
      (d) => d.id === null || canMoveChapter(chapters, moveTarget.id, d.id),
    )
  }, [moveTarget, tree, chapters])

  const runMove = (destinationId: string | null) => {
    if (!moveTarget || pending) return
    const target = moveTarget
    setMoveTarget(null)
    setMenuId(null)
    startTransition(async () => {
      if (target.kind === 'chapter') {
        await moveChapter(courseId, target.id, destinationId)
      } else {
        await moveQuestion(courseId, target.id, destinationId)
      }
    })
  }

  const callbacks: TreeCallbacks = { onAddQuestion, onAddChapter, onEditQuestion }

  return (
    <div aria-busy={pending}>
      {chapters.length === 0 && questions.length === 0 ? (
        <p className="rounded-2xl bg-muted/40 px-3 py-4 text-center text-sm text-muted-foreground">
          Ce cours est vide — touche « + » pour créer ta première question ou
          ton premier chapitre.
        </p>
      ) : (
        <TreeLevel
          courseId={courseId}
          chapters={tree.chapters}
          questions={tree.rootQuestions}
          depth={1}
          allChapters={chapters}
          expanded={expanded}
          onToggle={toggle}
          menuId={menuId}
          onMenu={setMenuId}
          onMove={setMoveTarget}
          callbacks={callbacks}
          pending={pending}
          startTransition={startTransition}
        />
      )}

      {/* Feuille « Déplacer vers… ». */}
      <BottomSheet
        open={moveTarget !== null}
        onClose={() => setMoveTarget(null)}
        title={`Déplacer « ${moveTarget?.title ?? ''} »`}
      >
        <ul className="flex flex-col gap-1">
          {moveDestinations.map((d) => (
            <li key={d.id ?? 'racine'}>
              <button
                type="button"
                onClick={() => {
                  sfx.tap()
                  runMove(d.id)
                }}
                style={{ paddingLeft: `${0.75 + d.depth * 1}rem` }}
                className="flex w-full cursor-pointer items-center gap-2 rounded-xl py-2.5 pr-3 text-left text-sm font-semibold text-foreground hover:bg-muted"
              >
                <CHAPTER_ICON
                  className="size-4 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
                <span className="line-clamp-1">{d.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </BottomSheet>
    </div>
  )
}
