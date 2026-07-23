'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  BarChart3,
  ChevronDown,
  FileUp,
  FolderPlus,
  Import,
  Pencil,
  Play,
  Plus,
  Sparkles,
  Trash2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import {
  buildCourseTree,
  COURSE_COLORS,
  COURSE_ICONS,
  normalizeCourseColor,
  normalizeCourseIcon,
  QUESTION_TYPES,
  TYPE_LABEL,
  type CourseChapter,
  type CourseQuestionType,
  type CourseStats,
} from '@/lib/carnet-cours'
import {
  createChapter,
  createQuestion,
  deleteCourse,
  updateCourse,
} from '@/app/reviser/cours/actions'
import { generateCourseQuestions } from '@/app/reviser/cours/ai-actions'
import BottomSheet from '@/components/carnet/BottomSheet'
import CourseTree from '@/components/carnet/CourseTree'
import {
  COURSE_DOT,
  COURSE_ICON,
  COURSE_TINT,
  TYPE_ICON,
} from '@/components/carnet/style'
import type { CourseHeader, CourseQuestionRow } from '@/components/carnet/types'

type Tab = 'contenu' | 'resultats' | 'parametres'

const TABS: { id: Tab; label: string }[] = [
  { id: 'contenu', label: 'Contenu' },
  { id: 'resultats', label: 'Résultats' },
  { id: 'parametres', label: 'Paramètres' },
]

// ------------------------------------------------------------ onglet stats ----

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-muted/40 px-3 py-3 text-center">
      <p className="font-heading text-2xl font-extrabold text-foreground tabular-nums">
        {value}
      </p>
      <p className="mt-0.5 text-[11px] font-bold text-muted-foreground">
        {label}
      </p>
    </div>
  )
}

function ResultsPanel({ stats }: { stats: CourseStats }) {
  const totalQuestions = stats.neverSeen + stats.struggling + stats.mastered
  const bar = (n: number) =>
    totalQuestions > 0 ? Math.round((n / totalQuestions) * 100) : 0

  if (stats.totalAttempts === 0) {
    return (
      <p className="rounded-2xl bg-muted/40 px-3 py-4 text-center text-sm text-muted-foreground">
        Pas encore de statistiques — lance ta première session avec le bouton
        « Réviser » 🎯
      </p>
    )
  }

  const rows: { label: string; count: number; className: string }[] = [
    { label: 'Maîtrisées', count: stats.mastered, className: 'bg-primary' },
    {
      label: 'À retravailler',
      count: stats.struggling,
      className: 'bg-destructive',
    },
    { label: 'Jamais vues', count: stats.neverSeen, className: 'bg-muted-foreground/40' },
  ]

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-2">
        <StatTile
          label="Réussite"
          value={stats.successPct !== null ? `${stats.successPct} %` : '—'}
        />
        <StatTile label="Réponses données" value={String(stats.totalAttempts)} />
      </div>
      <div className="flex flex-col gap-2.5 rounded-2xl bg-muted/40 p-3">
        {rows.map((r) => (
          <div key={r.label}>
            <div className="mb-1 flex items-center justify-between text-[11px] font-bold">
              <span className="text-foreground">{r.label}</span>
              <span className="text-muted-foreground tabular-nums">
                {r.count}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-black/5">
              <div
                className={cn('h-full rounded-full', r.className)}
                style={{ width: `${bar(r.count)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// -------------------------------------------------------- onglet paramètres ----

function SettingsPanel({ course }: { course: CourseHeader }) {
  const router = useRouter()
  const [description, setDescription] = useState(course.description ?? '')
  const [pending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)

  const patch = (p: Parameters<typeof updateCourse>[1]) => {
    if (pending) return
    setSaved(false)
    startTransition(async () => {
      await updateCourse(course.id, p)
      router.refresh()
    })
  }

  const remove = () => {
    if (pending) return
    const ok = window.confirm(
      `Supprimer le cours « ${course.title} » et tout son contenu ? Cette action est définitive.`,
    )
    if (!ok) return
    startTransition(async () => {
      const res = await deleteCourse(course.id)
      if (res.ok) router.push('/reviser')
    })
  }

  return (
    <div className="flex flex-col gap-4" aria-busy={pending}>
      {/* Introduction du cours. */}
      <div>
        <label
          htmlFor="cours-intro"
          className="font-heading mb-1.5 block text-sm font-extrabold text-foreground"
        >
          Introduction
        </label>
        <textarea
          id="cours-intro"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          maxLength={500}
          placeholder="De quoi parle ce cours ? (affiché sous le titre)"
          className="w-full rounded-2xl border border-black/10 bg-white px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none"
        />
        <button
          type="button"
          disabled={pending}
          onClick={() => {
            sfx.tap()
            startTransition(async () => {
              await updateCourse(course.id, { description })
              setSaved(true)
              router.refresh()
            })
          }}
          className="font-heading mt-1.5 rounded-full bg-primary px-4 py-2 text-xs font-extrabold text-primary-foreground shadow-sm transition active:translate-y-px disabled:opacity-60"
        >
          {pending ? 'Enregistrement…' : saved ? 'Enregistré ✓' : 'Enregistrer'}
        </button>
      </div>

      {/* Icône. */}
      <div>
        <p className="font-heading mb-1.5 text-sm font-extrabold text-foreground">
          Icône
        </p>
        <div className="grid grid-cols-5 gap-2">
          {COURSE_ICONS.map((iconId) => {
            const Icon = COURSE_ICON[iconId]
            const active = normalizeCourseIcon(course.icon) === iconId
            return (
              <button
                key={iconId}
                type="button"
                aria-pressed={active}
                aria-label={`Icône ${iconId}`}
                onClick={() => {
                  sfx.tap()
                  patch({ icon: iconId })
                }}
                className={cn(
                  'flex aspect-square cursor-pointer items-center justify-center rounded-2xl transition',
                  active
                    ? 'bg-primary text-primary-foreground ring-2 ring-primary'
                    : 'bg-muted/60 text-foreground hover:bg-muted',
                )}
              >
                <Icon className="size-5" strokeWidth={2.2} aria-hidden="true" />
              </button>
            )
          })}
        </div>
      </div>

      {/* Couleur. */}
      <div>
        <p className="font-heading mb-1.5 text-sm font-extrabold text-foreground">
          Couleur
        </p>
        <div className="flex gap-2.5">
          {COURSE_COLORS.map((colorId) => {
            const active = normalizeCourseColor(course.color) === colorId
            return (
              <button
                key={colorId}
                type="button"
                aria-pressed={active}
                aria-label={`Couleur ${colorId}`}
                onClick={() => {
                  sfx.tap()
                  patch({ color: colorId })
                }}
                className={cn(
                  'size-9 cursor-pointer rounded-full transition',
                  COURSE_DOT[colorId],
                  active && 'ring-2 ring-foreground/50 ring-offset-2',
                )}
              />
            )
          })}
        </div>
      </div>

      {/* Zone dangereuse. */}
      <div className="mt-2 border-t border-black/5 pt-4">
        <button
          type="button"
          disabled={pending}
          onClick={remove}
          className="flex cursor-pointer items-center gap-2 rounded-full bg-destructive/10 px-4 py-2.5 text-sm font-bold text-destructive disabled:opacity-60"
        >
          <Trash2 className="size-4" aria-hidden="true" />
          Supprimer ce cours
        </button>
      </div>
    </div>
  )
}

// -------------------------------------------------------------------- écran ----

/**
 * L'écran d'un cours du carnet : header (icône, titre éditable, introduction,
 * bouton « Réviser » à menu), icône statistiques flottante en haut à droite,
 * onglets Contenu / Résultats / Paramètres, arbre des chapitres & questions,
 * bouton flottant « + » → feuille de création (question, IA, chapitre,
 * imports « Bientôt »).
 */
export default function CourseScreen({
  course,
  chapters,
  questions,
  stats,
}: {
  course: CourseHeader
  chapters: CourseChapter[]
  questions: CourseQuestionRow[]
  stats: CourseStats
}) {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('contenu')
  const [editingTitle, setEditingTitle] = useState(false)
  const [titleDraft, setTitleDraft] = useState(course.title)
  const [reviseOpen, setReviseOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  // Conteneur cible de la création (racine par défaut, chapitre via son menu).
  const [createTarget, setCreateTarget] = useState<string | null>(null)
  const [typePickerOpen, setTypePickerOpen] = useState(false)
  const [aiOpen, setAiOpen] = useState(false)
  const [aiTheme, setAiTheme] = useState('')
  const [aiCount, setAiCount] = useState(5)
  const [aiStyle, setAiStyle] = useState<'qcm' | 'flashcard' | 'mixte'>('mixte')
  const [aiMessage, setAiMessage] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  const Icon = COURSE_ICON[normalizeCourseIcon(course.icon)]
  const tint = COURSE_TINT[normalizeCourseColor(course.color)]
  const readyCount = questions.filter((q) => q.ready).length
  const tree = buildCourseTree(chapters, questions)

  const commitTitle = () => {
    setEditingTitle(false)
    const title = titleDraft.trim()
    if (title.length === 0 || title === course.title) {
      setTitleDraft(course.title)
      return
    }
    startTransition(async () => {
      await updateCourse(course.id, { title })
      router.refresh()
    })
  }

  const addChapter = (parentId: string | null) => {
    if (pending) return
    setCreateOpen(false)
    startTransition(async () => {
      await createChapter(course.id, parentId)
      router.refresh()
    })
  }

  const addQuestion = (type: CourseQuestionType) => {
    if (pending) return
    setTypePickerOpen(false)
    setCreateOpen(false)
    startTransition(async () => {
      const res = await createQuestion(course.id, createTarget, type)
      if (res.ok && res.id) {
        router.push(`/reviser/cours/${course.id}/question/${res.id}`)
      }
    })
  }

  const runAi = () => {
    if (pending || aiTheme.trim().length === 0) return
    setAiMessage(null)
    startTransition(async () => {
      const res = await generateCourseQuestions(
        course.id,
        createTarget,
        aiTheme,
        aiCount,
        aiStyle,
      )
      if (res.ok) {
        setAiOpen(false)
        setAiTheme('')
        router.refresh()
      } else if (res.unavailable) {
        setAiMessage('Génération indisponible pour le moment (service IA non configuré).')
      } else if (res.quota) {
        setAiMessage(
          'Tu as atteint ta limite de générations pour aujourd’hui. Elle repart demain.',
        )
      } else {
        setAiMessage('La génération a échoué. Réessaie dans un instant.')
      }
    })
  }

  return (
    <div className="relative mx-auto w-full max-w-md pb-28">
      {/* Icône statistiques flottante, en haut à droite. */}
      <button
        type="button"
        onClick={() => {
          sfx.tap()
          setTab('resultats')
        }}
        aria-label="Voir les statistiques du cours"
        className="absolute top-0 right-0 z-30 flex size-10 cursor-pointer items-center justify-center rounded-2xl bg-highlight/25 text-foreground shadow-sm ring-1 ring-black/5 transition active:scale-95"
      >
        <BarChart3 className="size-5" strokeWidth={2.2} aria-hidden="true" />
      </button>

      {/* Retour au carnet. */}
      <Link
        href="/reviser"
        onClick={() => sfx.tap()}
        className="mb-3 inline-flex items-center gap-1.5 text-sm font-bold text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Mon carnet
      </Link>

      {/* Header : icône + titre éditable + introduction + Réviser. */}
      <header className="rev-card rounded-3xl bg-white p-4 pr-12 shadow-sm ring-1 ring-black/5">
        <div className="flex items-start gap-3">
          <span
            className={cn(
              'flex size-12 shrink-0 items-center justify-center rounded-2xl',
              tint,
            )}
          >
            <Icon className="size-6" strokeWidth={2.2} aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            {editingTitle ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  commitTitle()
                }}
              >
                <input
                  autoFocus
                  value={titleDraft}
                  onChange={(e) => setTitleDraft(e.target.value)}
                  onBlur={commitTitle}
                  maxLength={120}
                  aria-label="Titre du cours"
                  className="font-heading w-full rounded-xl border border-primary/40 bg-white px-2 py-1 text-lg font-extrabold text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none"
                />
              </form>
            ) : (
              <button
                type="button"
                onClick={() => {
                  sfx.tap()
                  setTitleDraft(course.title)
                  setEditingTitle(true)
                }}
                className="group flex w-full cursor-pointer items-start gap-1.5 text-left"
              >
                <h1 className="font-heading line-clamp-2 min-w-0 text-lg leading-snug font-extrabold text-foreground">
                  {course.title}
                </h1>
                <Pencil
                  className="mt-1 size-3.5 shrink-0 text-muted-foreground/60 group-hover:text-primary"
                  aria-hidden="true"
                />
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                sfx.tap()
                setTab('parametres')
              }}
              className="mt-0.5 block w-full cursor-pointer truncate text-left text-xs font-semibold text-muted-foreground"
            >
              {course.description ?? 'Ajouter une introduction'}
            </button>
          </div>
        </div>

        <button
          type="button"
          disabled={readyCount === 0}
          onClick={() => {
            sfx.tap()
            setReviseOpen(true)
          }}
          aria-haspopup="dialog"
          className="font-heading mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-extrabold text-primary-foreground shadow-sm transition active:translate-y-px disabled:opacity-50"
        >
          <Play className="size-4" strokeWidth={2.6} aria-hidden="true" />
          Réviser
          <ChevronDown className="size-4" aria-hidden="true" />
        </button>
        {readyCount === 0 ? (
          <p className="mt-1.5 text-center text-[11px] font-semibold text-muted-foreground">
            Ajoute au moins une question complète pour lancer une session.
          </p>
        ) : null}
      </header>

      {/* Onglets. */}
      <div
        role="tablist"
        aria-label="Sections du cours"
        className="mt-3 flex gap-2"
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => {
              sfx.tap()
              setTab(t.id)
            }}
            className={cn(
              'font-heading flex-1 cursor-pointer rounded-full px-3 py-2 text-xs font-extrabold whitespace-nowrap transition-colors',
              tab === t.id
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-white text-muted-foreground ring-1 ring-black/5 hover:text-foreground',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Panneau actif. */}
      <section className="rev-card mt-3 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-black/5">
        {tab === 'contenu' ? (
          <>
            <div className="mb-2 flex items-center gap-2">
              <h2 className="font-heading min-w-0 flex-1 text-base font-extrabold text-foreground">
                Chapitres &amp; Questions
              </h2>
              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-extrabold text-primary tabular-nums">
                {questions.length}
              </span>
            </div>
            <CourseTree
              courseId={course.id}
              chapters={chapters}
              questions={questions}
              onAddQuestion={(chapterId) => {
                setCreateTarget(chapterId)
                setTypePickerOpen(true)
              }}
              onAddChapter={addChapter}
              onEditQuestion={(id) =>
                router.push(`/reviser/cours/${course.id}/question/${id}`)
              }
            />
          </>
        ) : tab === 'resultats' ? (
          <ResultsPanel stats={stats} />
        ) : (
          <SettingsPanel course={course} />
        )}
      </section>

      {/* Bouton flottant « + » (onglet Contenu). */}
      {tab === 'contenu' ? (
        <button
          type="button"
          onClick={() => {
            sfx.tap()
            setCreateTarget(null)
            setCreateOpen(true)
          }}
          aria-haspopup="dialog"
          aria-label="Ajouter au cours"
          className="press-3d-deep fixed right-4 bottom-20 z-40 flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg transition-transform md:bottom-8"
        >
          <Plus className="size-7" strokeWidth={2.6} aria-hidden="true" />
        </button>
      ) : null}

      {/* Feuille « Réviser » : tout le cours ou un chapitre. */}
      <BottomSheet
        open={reviseOpen}
        onClose={() => setReviseOpen(false)}
        title="Réviser"
      >
        <ul className="flex flex-col gap-1.5">
          <li>
            <Link
              href={`/reviser/cours/${course.id}/reviser`}
              onClick={() => {
                sfx.tap()
                setReviseOpen(false)
              }}
              className="font-heading flex items-center justify-between gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-extrabold text-primary-foreground"
            >
              Tout le cours
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-[11px] tabular-nums">
                {readyCount}
              </span>
            </Link>
          </li>
          {tree.chapters.map((c) => (
            <li key={c.id}>
              <Link
                href={`/reviser/cours/${course.id}/reviser?chapitre=${c.id}`}
                onClick={() => {
                  sfx.tap()
                  setReviseOpen(false)
                }}
                className="flex items-center justify-between gap-2 rounded-2xl bg-muted/60 px-4 py-3 text-sm font-bold text-foreground hover:bg-muted"
              >
                <span className="line-clamp-1">{c.title}</span>
                <span className="rounded-full bg-foreground/5 px-2 py-0.5 text-[11px] font-extrabold text-muted-foreground tabular-nums">
                  {c.totalQuestions}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </BottomSheet>

      {/* Feuille de création (bouton « + »). */}
      <BottomSheet
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Ajouter au cours"
      >
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => {
              sfx.tap()
              setCreateOpen(false)
              setTypePickerOpen(true)
            }}
            className="font-heading flex cursor-pointer items-center gap-3 rounded-2xl bg-primary px-4 py-3.5 text-sm font-extrabold text-primary-foreground shadow-sm"
          >
            <Plus className="size-5" strokeWidth={2.6} aria-hidden="true" />
            Créer une question
          </button>
          <button
            type="button"
            onClick={() => {
              sfx.tap()
              setCreateOpen(false)
              setAiMessage(null)
              setAiOpen(true)
            }}
            className="flex cursor-pointer items-center gap-3 rounded-2xl bg-muted/60 px-4 py-3 text-sm font-bold text-foreground hover:bg-muted"
          >
            <span className="flex size-8 items-center justify-center rounded-xl bg-highlight/30 text-foreground">
              <Sparkles className="size-4" aria-hidden="true" />
            </span>
            Générer des questions avec l’IA
          </button>
          <button
            type="button"
            onClick={() => addChapter(createTarget)}
            className="flex cursor-pointer items-center gap-3 rounded-2xl bg-muted/60 px-4 py-3 text-sm font-bold text-foreground hover:bg-muted"
          >
            <span className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FolderPlus className="size-4" aria-hidden="true" />
            </span>
            Créer un chapitre
          </button>
          {/* Les imports arrivent plus tard : visibles mais inactifs. */}
          {[
            { label: 'Importer des questions', icon: Import },
            { label: 'Insérer un fichier', icon: FileUp },
          ].map((item) => (
            <div
              key={item.label}
              aria-disabled="true"
              className="flex items-center gap-3 rounded-2xl bg-muted/40 px-4 py-3 text-sm font-bold text-muted-foreground opacity-70"
            >
              <span className="flex size-8 items-center justify-center rounded-xl bg-foreground/5">
                <item.icon className="size-4" aria-hidden="true" />
              </span>
              {item.label}
              <span className="ml-auto rounded-full bg-foreground/10 px-2 py-0.5 text-[9px] font-extrabold tracking-wide uppercase">
                Bientôt
              </span>
            </div>
          ))}
        </div>
      </BottomSheet>

      {/* Feuille du choix de type de question. */}
      <BottomSheet
        open={typePickerOpen}
        onClose={() => setTypePickerOpen(false)}
        title="Quel type de question ?"
      >
        <ul className="flex flex-col gap-1.5">
          {QUESTION_TYPES.map((type) => {
            const TypeIcon = TYPE_ICON[type]
            return (
              <li key={type}>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => {
                    sfx.tap()
                    addQuestion(type)
                  }}
                  className="flex w-full cursor-pointer items-center gap-3 rounded-2xl bg-muted/60 px-4 py-3 text-left text-sm font-bold text-foreground hover:bg-muted disabled:opacity-60"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <TypeIcon className="size-4" strokeWidth={2.2} aria-hidden="true" />
                  </span>
                  {TYPE_LABEL[type]}
                </button>
              </li>
            )
          })}
        </ul>
      </BottomSheet>

      {/* Feuille de génération IA. */}
      <BottomSheet
        open={aiOpen}
        onClose={() => setAiOpen(false)}
        title="Générer des questions avec l’IA"
      >
        <div className="flex flex-col gap-3">
          <div>
            <label
              htmlFor="ia-theme"
              className="mb-1 block text-xs font-bold text-muted-foreground"
            >
              Sur quel thème ?
            </label>
            <textarea
              id="ia-theme"
              value={aiTheme}
              onChange={(e) => setAiTheme(e.target.value)}
              rows={3}
              maxLength={500}
              placeholder="Ex. : le présent simple en anglais, la Révolution française, les fractions…"
              className="w-full rounded-2xl border border-black/10 bg-white px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <label
              htmlFor="ia-count"
              className="text-xs font-bold text-muted-foreground"
            >
              Nombre
            </label>
            <select
              id="ia-count"
              value={aiCount}
              onChange={(e) => setAiCount(Number(e.target.value))}
              className="rounded-xl border border-black/10 bg-white px-2 py-1.5 text-sm font-bold text-foreground"
            >
              {[5, 10, 15].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <div
              role="group"
              aria-label="Types de questions"
              className="ml-auto flex gap-1"
            >
              {(
                [
                  ['mixte', 'Mélange'],
                  ['qcm', 'QCM'],
                  ['flashcard', 'Flashcards'],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  aria-pressed={aiStyle === id}
                  onClick={() => {
                    sfx.tap()
                    setAiStyle(id)
                  }}
                  className={cn(
                    'cursor-pointer rounded-full px-2.5 py-1.5 text-[11px] font-extrabold transition-colors',
                    aiStyle === id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted/60 text-muted-foreground',
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          {aiMessage ? (
            <p
              role="alert"
              className="rounded-2xl bg-destructive/10 px-3 py-2 text-xs font-semibold text-destructive"
            >
              {aiMessage}
            </p>
          ) : null}
          <button
            type="button"
            disabled={pending || aiTheme.trim().length === 0}
            onClick={runAi}
            className="font-heading flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-extrabold text-primary-foreground shadow-sm transition active:translate-y-px disabled:opacity-50"
          >
            <Sparkles className="size-4" aria-hidden="true" />
            {pending ? 'Génération en cours…' : 'Générer'}
          </button>
        </div>
      </BottomSheet>
    </div>
  )
}
