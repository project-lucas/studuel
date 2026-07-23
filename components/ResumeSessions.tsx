'use client'

import Link from 'next/link'
import { CheckCircle2, Flame, Play, Timer } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { subjectInitials, subjectPastel } from '@/lib/subject-style'
import SubjectIcon from '@/components/SubjectIcon'
import ProgressRing from '@/components/ProgressRing'
import NextControleHeroCard from '@/components/NextControleHeroCard'
import type { ExamProximity } from '@/lib/next-exam'
import type { Subject } from '@/lib/types'

export type ResumeItem = {
  subject: Subject
  chapterId: string
  chapterTitle: string
  progress: number // 0..1
  isNew: boolean // chapitre jamais commencé (→ « commencer » plutôt que reprise)
  // Carte PRIORITAIRE liée à un contrôle déclaré (Ta semaine → Nouveau
  // contrôle) : rendue en carte HÉRO pleine largeur dans sa propre section
  // « Pour ton prochain contrôle », au-dessus de « On s'y remet ? ». Absente =
  // carte de reprise classique.
  exam?: {
    label: string // « Contrôle demain », « Contrôle dans 3 jours »…
    proximity: ExamProximity
    date: string | null // clé UTC 'YYYY-MM-DD' — le badge héro recalcule
    // l'urgence côté client en jours calendaires.
  }
}

// Objectif quotidien affiché sous le titre de section : 1 session par jour.
const DAILY_GOAL_SESSIONS = 1

// Durée estimée de la session : courte quand le chapitre est presque acquis,
// longue quand il repart de loin (chapitre fragile).
function sessionMinutes(item: ResumeItem): 3 | 5 | 10 {
  if (item.isNew) return 5
  if (item.progress >= 0.66) return 3
  if (item.progress >= 0.33) return 5
  return 10
}

// Carte de session façon « mock papier » : blanche à contour navy et ombre
// offset dure, pastille d'initiales de la matière ancrée dans le coin
// supérieur droit, CTA plein. Trois humeurs : contrôle (badge compte à
// rebours, corail quand c'est imminent), recommandation du jour (badge série
// + bordure jaune), reprise classique.
function SessionCard({ item, isStar }: { item: ResumeItem; isStar: boolean }) {
  const isImminent = item.exam?.proximity === 'imminent'
  const pct = Math.round(item.progress * 100)
  const minutes = sessionMinutes(item)
  const initials = subjectInitials(item.subject.slug, item.subject.name)
  // Sigles longs (SVT, NSI, HGGSP…) : police réduite pour rester dans l'onglet.
  const initialsSize = initials.length <= 3 ? 'text-[11px]' : 'text-[9px]'
  return (
    <li
      className={cn('w-48 shrink-0', (isStar || item.exam) && 'scale-[1.03]')}
    >
      {/* Toute la carte reste tapable (Link) ; le CTA est le bouton visuel,
          animé au press via group-active. */}
      <Link
        href={`/reviser/${item.subject.slug}/${item.chapterId}`}
        onClick={() => sfx.tap()}
        className={cn(
          'group relative flex h-full flex-col rounded-[20px] border-[3px] bg-white p-3 shadow-[4px_4px_0_#2D2A4A] transition-transform hover:-translate-y-0.5',
          // Carte contrôle : bordure corail quand c'est imminent (≤ 2 jours),
          // jaune sinon. Carte recommandée : jaune.
          item.exam
            ? isImminent
              ? 'border-[#F87171]'
              : 'border-[#F9B233]'
            : isStar
              ? 'border-[#F9B233]'
              : 'border-[#2D2A4A]',
        )}
      >
        {/* Onglet matière façon intercalaire de classeur, posé sur le bord
            supérieur droit : fond pastel de la matière, icône + sigle, contour
            navy ouvert en bas pour se fondre dans la carte. */}
        <span
          aria-hidden="true"
          className="absolute right-4 -top-[25px] flex h-7 items-center gap-1 rounded-t-xl border-[3px] border-b-0 border-[#2D2A4A] px-2.5"
          style={{ backgroundColor: subjectPastel(item.subject.color) }}
        >
          <SubjectIcon
            slug={item.subject.slug}
            className="size-3.5 text-[#2D2A4A]"
            strokeWidth={2.75}
          />
          <span
            className={cn(
              'font-initials font-bold text-[#2D2A4A]',
              initialsSize,
            )}
          >
            {initials}
          </span>
        </span>

        {/* Badge (ou anneau de progression) — l'onglet vit au-dessus de la
            carte, la rangée garde toute la largeur. */}
        <div className="flex min-h-8 items-start">
          {item.exam ? (
            <span
              className={cn(
                'rounded-full border-2 border-[#2D2A4A] px-2 py-0.5 text-[10px] font-extrabold',
                isImminent
                  ? 'bg-[#F87171] text-white'
                  : 'bg-[#F9B233] text-[#2D2A4A]',
              )}
            >
              📝 {item.exam.label}
            </span>
          ) : isStar ? (
            <span className="rounded-full border-2 border-[#2D2A4A] bg-[#F9B233] px-2 py-0.5 text-[10px] font-extrabold text-[#2D2A4A]">
              Ta série du jour 🔥
            </span>
          ) : item.isNew ? (
            // Mêmes gabarits (bordure, padding, corps de texte) que le badge
            // « Ta série du jour » pour que les badges s'alignent d'une carte
            // à l'autre.
            <span className="rounded-full border-2 border-[#2D2A4A]/40 bg-[#FAF6EF] px-2 py-0.5 text-[10px] font-extrabold text-[#2D2A4A]/70">
              Nouveau
            </span>
          ) : (
            <ProgressRing
              value={item.progress}
              size={32}
              strokeWidth={4}
              label={`${pct}% fait`}
              trackClassName="stroke-[#EFE7FB]"
              fillClassName="stroke-[#7B4FD8]"
            >
              <span className="font-mono text-[9px] font-bold text-[#2D2A4A] tabular-nums">
                {pct}%
              </span>
            </ProgressRing>
          )}
        </div>

        <p className="font-heading mt-1.5 line-clamp-2 text-sm leading-tight font-bold text-[#2D2A4A]">
          {item.chapterTitle}
        </p>
        {/* Ligne matière atténuée — l'onglet porte déjà l'identification. */}
        <p className="mt-0.5 truncate text-[11px] font-semibold text-[#2D2A4A]/45">
          {item.subject.name}
        </p>

        {/* Chips : durée + récompense de série (la session du jour ajoute
            un jour à la flamme quand il clique et la termine). */}
        <span className="mt-1.5 flex flex-wrap items-center gap-1.5">
          <span className="inline-flex w-fit items-center gap-1 rounded-full border-2 border-[#2D2A4A] bg-[#FAF6EF] px-2 py-0.5 text-[11px] font-bold text-[#2D2A4A]">
            <Timer className="size-3" aria-hidden="true" />
            {minutes} min
          </span>
          <span className="inline-flex w-fit items-center gap-0.5 rounded-full border-2 border-[#2D2A4A] bg-[#FAF6EF] px-2 py-0.5 text-[11px] font-bold text-[#2D2A4A]">
            <Flame
              className="size-3 fill-[#F9B233] text-[#F9B233]"
              aria-hidden="true"
            />
            +1 jour
          </span>
        </span>

        {/* CTA plein jaune (corail sur contrôle imminent), ombre offset dure
            + effet press. */}
        <span
          className={cn(
            'mt-2.5 flex items-center justify-center gap-1.5 rounded-2xl border-[3px] border-[#2D2A4A] px-3 py-1.5 font-extrabold shadow-[0_4px_0_#2D2A4A] transition-all group-active:translate-y-[3px] group-active:shadow-[0_1px_0_#2D2A4A]',
            isImminent ? 'bg-[#F87171] text-white' : 'bg-[#F9B233] text-[#2D2A4A]',
            item.exam ? 'text-[13px]' : 'text-sm',
          )}
        >
          <Play className="size-4 fill-current" aria-hidden="true" />
          {item.exam ? 'Préparer le contrôle' : 'Commencer'}
        </span>
      </Link>
    </li>
  )
}

// Rangée horizontale de cartes, défilable — le padding haut laisse dépasser
// les onglets matière au-dessus des cartes, le bas absorbe l'ombre offset.
function CardRow({ children }: { children: React.ReactNode }) {
  return (
    <ul className="hide-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4 pt-7 pb-3 sm:mx-0 sm:px-1">
      {children}
    </ul>
  )
}

// Deux sections empilées :
// 1. « Pour ton prochain contrôle » — les cartes générées par les contrôles
//    déclarés dans Ta semaine (une par contrôle, du plus proche au plus
//    lointain). N'existe que s'il y a au moins un contrôle actif.
// 2. « On s'y remet ? » — les dernières sessions non terminées, avec
//    l'objectif du jour.
export default function ResumeSessions({
  items,
  sessionsToday = 0,
  today,
}: {
  items: ResumeItem[]
  sessionsToday?: number
  /** Clé UTC du jour, calculée par le serveur (cf. NextControleHeroCard). */
  today: string
}) {
  if (items.length === 0) return null

  const examItems = items.filter((i) => i.exam)
  const regularItems = items.filter((i) => !i.exam)

  const goalDone = sessionsToday >= DAILY_GOAL_SESSIONS
  const goalCount = Math.min(sessionsToday, DAILY_GOAL_SESSIONS)

  return (
    <>
      {examItems.length > 0 ? (
        // Carte(s) HÉRO pleine largeur — le point focal de la page. La marge
        // basse (mb-2, en plus du gap-4 du conteneur) creuse l'écart avec la
        // grille en dessous pour que la hiérarchie reste nette.
        <section aria-label="Préparer tes prochains contrôles" className="mb-2">
          <h2 className="font-heading mb-2 px-1 text-sm font-bold tracking-wide text-muted-foreground uppercase">
            📝{' '}
            {examItems.length > 1
              ? 'Pour tes prochains contrôles'
              : 'Pour ton prochain contrôle'}
          </h2>
          <div className="flex flex-col gap-3">
            {examItems.map((item) => (
              <NextControleHeroCard
                key={item.chapterId}
                subject={item.subject}
                chapterId={item.chapterId}
                chapterTitle={item.chapterTitle}
                date={item.exam?.date ?? null}
                minutes={sessionMinutes(item)}
                today={today}
              />
            ))}
          </div>
        </section>
      ) : null}

      {regularItems.length > 0 ? (
        <section aria-label="Reprendre une session">
          <div className="mb-2 px-1">
            <h2 className="font-heading text-sm font-bold tracking-wide text-muted-foreground uppercase">
              On s&apos;y remet ?
            </h2>
            {/* Objectif du jour : 1 session — coche verte quand c'est fait,
                flamme tant que ça reste à faire. */}
            <p className="mt-0.5 flex items-center gap-1 text-xs font-bold text-[#2D2A4A]">
              {goalDone ? (
                <CheckCircle2
                  className="size-3.5 text-[#22C55E]"
                  aria-hidden="true"
                />
              ) : (
                <Flame className="size-3.5 text-[#F9B233]" aria-hidden="true" />
              )}
              Objectif du jour : {goalCount}/{DAILY_GOAL_SESSIONS} session
            </p>
          </div>
          <CardRow>
            {regularItems.map((item, i) => (
              <SessionCard key={item.chapterId} item={item} isStar={i === 0} />
            ))}
          </CardRow>
        </section>
      ) : null}
    </>
  )
}
