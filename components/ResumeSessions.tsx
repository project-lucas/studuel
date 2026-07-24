'use client'

import { useTransition } from 'react'
import Link from 'next/link'
import { CheckCircle2, Flame, Play, Timer, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { toast } from '@/lib/toast'
import { subjectPastel } from '@/lib/subject-style'
import SubjectIcon from '@/components/SubjectIcon'
import ProgressRing from '@/components/ProgressRing'
import { removeUpcomingExam } from '@/app/moi/actions'
import type { ExamProximity } from '@/lib/next-exam'
import type { Subject } from '@/lib/types'

export type ResumeItem = {
  subject: Subject
  chapterId: string
  chapterTitle: string
  progress: number // 0..1
  isNew: boolean // chapitre jamais commencé (→ « commencer » plutôt que reprise)
  // Carte PRIORITAIRE liée à un contrôle déclaré (Ta semaine → Nouveau
  // contrôle) : rendue EN TÊTE de rangée, plus large et en violet plein.
  // Absente = carte de reprise classique.
  exam?: {
    label: string // « Contrôle demain », « Contrôle dans 3 jours »…
    proximity: ExamProximity
    date: string | null // clé UTC 'YYYY-MM-DD' du contrôle
  }
}

// Durée estimée de la session : courte quand le chapitre est presque acquis,
// longue quand il repart de loin (chapitre fragile).
function sessionMinutes(item: ResumeItem): 3 | 5 | 10 {
  if (item.isNew) return 5
  if (item.progress >= 0.66) return 3
  if (item.progress >= 0.33) return 5
  return 10
}

// La pastille de matière, commune aux deux cartes : rond pastel + icône, puis
// le nom. Sur fond violet (`onDark`), le rond passe en verre clair pour rester
// lisible sans introduire une deuxième couleur.
function SubjectChip({
  subject,
  onDark = false,
}: {
  subject: Subject
  onDark?: boolean
}) {
  return (
    <span
      className={cn(
        'flex min-w-0 items-center gap-1.5 text-[11px] font-bold',
        onDark ? 'text-[color:var(--background)]/80' : 'text-muted-foreground',
      )}
    >
      <span
        aria-hidden="true"
        className="grid size-6 shrink-0 place-items-center rounded-full"
        style={
          onDark
            ? { backgroundColor: 'rgba(255,255,255,0.18)' }
            : { backgroundColor: subjectPastel(subject.color) }
        }
      >
        <SubjectIcon
          slug={subject.slug}
          className={cn('size-3.5', onDark ? 'text-white' : 'text-foreground')}
          strokeWidth={2.6}
        />
      </span>
      <span className="truncate">{subject.name}</span>
    </span>
  )
}

// La chip « durée » / « Série +1 » : même jeton discret que partout ailleurs.
function MetaChip({
  children,
  onDark = false,
}: {
  children: React.ReactNode
  onDark?: boolean
}) {
  return (
    <span
      className={cn(
        'inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold',
        onDark
          ? 'bg-white/15 text-[color:var(--background)]'
          : 'bg-muted text-muted-foreground',
      )}
    >
      {children}
    </span>
  )
}

/**
 * LA carte de tête : celle du prochain contrôle. C'est la seule carte de la
 * rangée à fond violet plein — le reste de l'accueil est en cartes blanches,
 * donc elle sort du lot sans avoir besoin d'un vocabulaire graphique à part
 * (bordures épaisses, ombres dures) qui la coupait du reste de l'app.
 */
function ExamCard({ item }: { item: ResumeItem }) {
  const [removing, startRemove] = useTransition()
  const isImminent = item.exam?.proximity === 'imminent'
  const minutes = sessionMinutes(item)

  // Croix « je me suis trompé » : retire ce contrôle de la liste (RPC
  // remove_upcoming_exam) — la carte disparaît au revalidate.
  const handleRemove = () => {
    if (removing) return
    sfx.tap()
    startRemove(async () => {
      const res = await removeUpcomingExam(item.chapterId)
      toast(res.ok ? 'Contrôle retiré ✓' : 'Impossible de retirer ce contrôle. Réessaie.')
    })
  }

  return (
    <li className={cn('relative w-60 shrink-0', removing && 'opacity-60')}>
      {/* La croix est SŒUR du lien, pas imbriquée dedans : un bouton dans un
          <a> est invalide. */}
      <button
        type="button"
        onClick={handleRemove}
        disabled={removing}
        aria-label="Retirer ce contrôle"
        className="absolute top-2.5 right-2.5 z-10 flex size-7 items-center justify-center rounded-full bg-white/15 text-[color:var(--background)]/80 transition-colors hover:bg-white/25 hover:text-white active:scale-90"
      >
        <X className="size-3.5" strokeWidth={2.8} aria-hidden="true" />
      </button>

      <Link
        href={`/reviser/${item.subject.slug}/${item.chapterId}`}
        onClick={() => sfx.tap()}
        className="rev-card group flex h-full flex-col rounded-3xl bg-primary p-3.5 text-[color:var(--background)] ring-1 ring-black/5 transition-transform hover:-translate-y-0.5"
      >
        {/* 1. L'urgence d'abord : c'est l'info qui justifie la carte. */}
        <span
          className={cn(
            'w-fit rounded-full px-2.5 py-1 pr-8 text-[11px] font-extrabold',
            isImminent
              ? 'bg-destructive text-white'
              : 'bg-highlight text-foreground',
          )}
        >
          ⏰ {item.exam?.label}
        </span>

        <p className="font-heading mt-2 line-clamp-2 text-[0.95rem] leading-tight font-extrabold">
          {item.chapterTitle}
        </p>

        <span className="mt-1.5 flex items-center gap-2">
          <SubjectChip subject={item.subject} onDark />
        </span>

        <span className="mt-1.5 flex flex-wrap items-center gap-1.5">
          <MetaChip onDark>
            <Timer className="size-3" aria-hidden="true" />
            {minutes} min
          </MetaChip>
          <MetaChip onDark>
            <Flame className="size-3 fill-highlight text-highlight" aria-hidden="true" />
            Série +1
          </MetaChip>
        </span>

        {/* CTA principal : violet (couleur d'action de l'app), pas jaune — le
            jaune reste réservé à la monnaie et aux récompenses. */}
        <span className="font-heading mt-auto flex items-center justify-center gap-1.5 rounded-2xl bg-[color:var(--background)] px-3 py-2 pt-2.5 text-[13px] font-extrabold text-primary transition-transform group-active:translate-y-px">
          <Play className="size-4 fill-current" aria-hidden="true" />
          Préparer le contrôle
        </span>
      </Link>
    </li>
  )
}

/**
 * Carte de session ordinaire : carte blanche arrondie, ombre douce et liseré
 * fin — exactement les cartes du reste de l'accueil (Ta semaine, Mes cours,
 * dossiers de matières). Elle portait auparavant un vocabulaire à part
 * (contour navy 3px, ombre dure décalée, intercalaire de classeur en débord),
 * seule de toute l'app à le faire : la rangée ressemblait à un encart collé.
 */
function SessionCard({ item, isStar }: { item: ResumeItem; isStar: boolean }) {
  const pct = Math.round(item.progress * 100)
  const minutes = sessionMinutes(item)

  return (
    <li className="w-48 shrink-0">
      <Link
        href={`/reviser/${item.subject.slug}/${item.chapterId}`}
        onClick={() => sfx.tap()}
        className={cn(
          'rev-card group flex h-full flex-col rounded-3xl bg-white p-3.5 transition-transform hover:-translate-y-0.5',
          // La carte recommandée garde un liseré jaune : mise en avant douce,
          // dans la palette, sans changer de matière.
          isStar ? 'ring-2 ring-highlight' : 'ring-1 ring-black/5',
        )}
      >
        <div className="flex min-h-8 items-start justify-between gap-2">
          <SubjectChip subject={item.subject} />
          {item.isNew ? (
            <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] font-extrabold text-muted-foreground">
              Nouveau
            </span>
          ) : (
            <ProgressRing
              value={item.progress}
              size={30}
              strokeWidth={4}
              label={`${pct}% fait`}
              trackClassName="stroke-muted"
              fillClassName="stroke-primary"
            >
              <span className="font-mono text-[9px] font-bold text-foreground tabular-nums">
                {pct}%
              </span>
            </ProgressRing>
          )}
        </div>

        <p className="font-heading mt-1.5 line-clamp-2 text-sm leading-tight font-extrabold text-foreground">
          {item.chapterTitle}
        </p>

        {isStar ? (
          <span className="mt-1.5 w-fit rounded-full bg-highlight/25 px-2 py-0.5 text-[10px] font-extrabold text-foreground">
            Ta série du jour 🔥
          </span>
        ) : null}

        <span className="mt-1.5 flex flex-wrap items-center gap-1.5">
          <MetaChip>
            <Timer className="size-3" aria-hidden="true" />
            {minutes} min
          </MetaChip>
          <MetaChip>
            <Flame className="size-3 fill-highlight text-highlight" aria-hidden="true" />
            Série +1
          </MetaChip>
        </span>

        <span className="font-heading mt-auto flex items-center justify-center gap-1.5 rounded-2xl bg-primary px-3 py-2 pt-2.5 text-sm font-extrabold text-primary-foreground transition-transform group-active:translate-y-px">
          <Play className="size-4 fill-current" aria-hidden="true" />
          Commencer
        </span>
      </Link>
    </li>
  )
}

/**
 * « On s'y remet ? » — UNE seule rangée horizontale, du plus urgent au moins
 * urgent : les contrôles déclarés d'abord (cartes violettes, tout à gauche),
 * puis les chapitres en cours. Les contrôles vivaient dans une section héro
 * séparée au-dessus ; deux sections pour une même intention (« reprends ici »)
 * coupaient la lecture en deux et repoussaient la grille des matières.
 */
export default function ResumeSessions({
  items,
  goalReached = false,
}: {
  items: ResumeItem[]
  // Objectif du jour ATTEINT — dérivé des minutes travaillées (la seule unité de
  // l'objectif, affichée dans le header). Ici on n'en montre que l'ÉTAT : plus de
  // second compteur « 1/1 session » qui doublait l'unité.
  goalReached?: boolean
}) {
  if (items.length === 0) return null

  // `items` arrive déjà trié par le serveur : contrôles en tête (du plus proche
  // au plus lointain), puis les reprises.
  const examCount = items.filter((i) => i.exam).length

  return (
    <section aria-label="Reprendre une session">
      <div className="mb-2 px-1">
        {/* Titre CONDITIONNEL : renforcement positif quand l'objectif du jour est
            atteint, incitation sinon. « On s'y remet ? » alors qu'on a déjà fait
            sa part sonnait faux. */}
        <h2 className="font-heading text-sm font-bold tracking-wide text-muted-foreground uppercase">
          {goalReached ? 'Beau travail !' : 'On s’y remet ?'}
        </h2>
        {/* Objectif du jour : simple ÉTAT de complétion (l'unité — les minutes —
            vit dans le header). Coche verte quand c'est fait, flamme sinon. */}
        <p className="mt-0.5 flex items-center gap-1 text-xs font-bold text-foreground">
          {goalReached ? (
            <>
              <CheckCircle2
                className="size-3.5 text-[#22C55E]"
                aria-hidden="true"
              />
              Objectif du jour atteint
            </>
          ) : (
            <>
              <Flame className="size-3.5 text-highlight" aria-hidden="true" />
              Encore un peu pour ton objectif du jour
            </>
          )}
        </p>
      </div>

      <ul className="hide-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pt-1 pb-4 sm:mx-0 sm:px-1">
        {items.map((item, i) =>
          item.exam ? (
            <ExamCard key={item.chapterId} item={item} />
          ) : (
            // La carte « série du jour » n'est étoilée que s'il n'y a aucun
            // contrôle devant : deux mises en avant côte à côte n'en font plus.
            <SessionCard
              key={item.chapterId}
              item={item}
              isStar={examCount === 0 && i === 0}
            />
          ),
        )}
      </ul>
    </section>
  )
}
