'use client'

import Link from 'next/link'
import { ArrowRight, Timer } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { subjectVignette } from '@/lib/subject-style'
import SubjectIcon from '@/components/SubjectIcon'
import type { MissionKind } from '@/lib/mission'
import type { ExamHeroUrgency } from '@/lib/next-exam'
import type { Subject } from '@/lib/types'

export type ResumeItem = {
  subject: Subject
  chapterId: string
  chapterTitle: string
  /** Ce que la session EST : préparer un contrôle, reprendre, découvrir. */
  kind: MissionKind
  /** Progression du chapitre (0..1) — null pour une session de contrôle. */
  progress: number | null
  minutes: number
  /**
   * L'échéance du contrôle (« Contrôle demain » + ton d'urgence), non nulle
   * UNIQUEMENT sur `kind === 'controle'`. C'est elle qui remonte sur l'arène de
   * l'accueil l'urgence que `pickMission` calcule déjà.
   */
  urgency: ExamHeroUrgency | null
  /**
   * Les séances de révision du plan de ce contrôle (`derivePlanView`), non
   * nulles UNIQUEMENT sur `kind === 'controle'` : c'est ce que comptent les
   * bâtons verts de la carte.
   */
  prep: { done: number; total: number; missed: number } | null
}

// Le mot qui dit l'état de la session, dans la pastille de la carte de tête.
// Un contrôle parle d'échéance, une découverte de nouveauté, une reprise de
// chemin parcouru — jamais « 0 % », qui n'a de sens pour aucun des trois.
function leadTag(item: ResumeItem): string {
  if (item.kind === 'controle') {
    return item.urgency?.label ?? 'Contrôle à venir'
  }
  if (item.kind === 'decouverte') return 'Nouveau chapitre'
  return `${Math.round((item.progress ?? 0) * 100)} % fait`
}

// Le geste attendu, écrit sur la carte plutôt que deviné à la flèche.
function leadAction(kind: MissionKind): string {
  if (kind === 'controle') return 'Préparer'
  if (kind === 'decouverte') return 'Découvrir'
  return 'Reprendre'
}

/**
 * LA CARTE DE TÊTE — le point focal de l'accueil Réviser.
 *
 * L'écran proposait deux cartes blanches jumelles, dans la même robe que les
 * quinze cartes matières juste en dessous : rien n'y était plus important que
 * rien. Pire, la session de préparation d'un contrôle — la seule raison
 * impérieuse d'ouvrir cet écran un dimanche soir — s'y affichait en « 0 % fait »,
 * parce que la page jetait en route le `kind` et le `countdown` que
 * `pickMission` avait pourtant calculés.
 *
 * Cette carte-ci est VIOLETTE, pleine largeur, et seule de son rang : sur un
 * écran de cartes blanches, c'est le seul bloc plein de la colonne, donc le
 * premier lu. Le violet est le rôle « action » de la DA — et cette carte EST
 * l'action que l'app recommande. Elle passe devant le bouton « + Contrôle »,
 * qui était jusqu'ici le seul objet coloré de l'écran : annoncer un contrôle est
 * une tâche d'intendance, pas ce qu'un élève vient faire.
 *
 * Le corail n'apparaît QUE sur une échéance imminente (≤ 2 jours, décision de
 * `examHeroUrgency`) : une alerte permanente n'alerte plus.
 */
/**
 * LES BÂTONS DE RÉVISION — un par séance du plan de préparation, vert dès
 * qu'elle est faite.
 *
 * L'app planifie déjà 1 à 3 séances espacées avant un contrôle
 * (`lib/prep-plan`), et les compte : « 1/3 ». Mais ce compte ne vivait que dans
 * l'écran de préparation. Sur la carte de tête — le seul bloc que l'élève lit
 * vraiment — la révision espacée était invisible, donc elle ne récompensait
 * rien. Trois bâtons dont deux verts disent d'un coup d'œil ce qu'un « 1/3 »
 * enfoui ne dit jamais : tu es revenu deux fois sur ce chapitre, il t'en reste
 * une, et plus tu y reviens mieux ça tient.
 *
 * Une séance manquée (jour passé, non faite) reste un bâton VIDE, pas rouge :
 * elle n'est pas perdue, elle est encore à faire — l'écran de préparation la
 * replanifie sur aujourd'hui.
 */
function PrepBars({ prep }: { prep: ResumeItem['prep'] }) {
  if (!prep || prep.total === 0) return null

  return (
    <span
      className="mt-1 flex items-center gap-1.5"
      role="img"
      aria-label={`${prep.done} révision${prep.done > 1 ? 's' : ''} sur ${prep.total} avant le contrôle`}
    >
      <span className="flex items-center gap-1" aria-hidden="true">
        {Array.from({ length: prep.total }, (_, i) => (
          <span
            key={i}
            className={cn(
              'h-1.5 w-5 rounded-full transition-colors',
              i < prep.done ? 'bg-success' : 'bg-white/25',
            )}
          />
        ))}
      </span>
      <span
        aria-hidden="true"
        className="text-[10px] font-extrabold text-primary-foreground/70 tabular-nums"
      >
        {prep.done}/{prep.total} révisions
      </span>
    </span>
  )
}

function LeadCard({ item }: { item: ResumeItem }) {
  const vignette = subjectVignette(item.subject.slug)
  const tag = leadTag(item)
  const coral = item.kind === 'controle' && item.urgency?.tone === 'coral'

  return (
    <li className="min-w-0">
      <Link
        href={`/reviser/${item.subject.slug}/${item.chapterId}`}
        onClick={() => sfx.tap()}
        aria-label={`${leadAction(item.kind)} : ${item.chapterTitle}, ${item.subject.name} — ${tag}, ${item.minutes} minutes`}
        className="rev-card group flex items-center gap-3.5 rounded-[1.75rem] bg-primary p-3.5 text-primary-foreground ring-1 ring-black/5 transition-transform hover:-translate-y-0.5 active:scale-[0.99]"
      >
        {/* La vignette peinte de la matière, en grand : à cette taille elle
            identifie la session avant même la lecture du titre. */}
        {vignette ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={vignette}
            alt=""
            aria-hidden="true"
            width={320}
            height={320}
            className="pointer-events-none size-14 shrink-0 select-none object-contain transition-transform duration-200 group-hover:scale-105"
          />
        ) : (
          <span
            aria-hidden="true"
            className="grid size-14 shrink-0 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/20"
          >
            <SubjectIcon
              slug={item.subject.slug}
              className="size-7 text-primary-foreground"
              strokeWidth={2.25}
            />
          </span>
        )}

        <span className="flex min-w-0 flex-1 flex-col gap-1">
          <span
            className={cn(
              'w-fit rounded-full px-2 py-0.5 text-[10px] font-extrabold',
              coral
                ? 'bg-destructive text-white'
                : 'bg-white/18 text-primary-foreground ring-1 ring-white/25',
            )}
          >
            {tag}
          </span>

          <span className="font-heading line-clamp-2 text-base leading-tight font-extrabold text-balance">
            {item.chapterTitle}
          </span>

          <span className="flex items-center gap-2 text-[11px] font-bold text-primary-foreground/75">
            <span className="min-w-0 truncate">{item.subject.name}</span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex shrink-0 items-center gap-1">
              <Timer className="size-3" aria-hidden="true" />
              {item.minutes} min
            </span>
          </span>

          <PrepBars prep={item.prep} />
        </span>

        <ArrowRight
          aria-hidden="true"
          className="size-5 shrink-0 transition-transform group-hover:translate-x-0.5"
          strokeWidth={2.6}
        />
      </Link>
    </li>
  )
}

/**
 * « On commence par ça » — la réponse de l'écran à « qu'est-ce que je fais
 * maintenant ? », en tête de l'accueil Réviser, juste sous la série.
 *
 * UNE carte, et une seule. Le rail horizontal en proposait quatre, la rangée
 * jumelle deux à égalité, et la version d'après gardait encore une « session
 * suivante » en rangée fine sous la carte violette. À chaque fois le même
 * défaut : l'écran rendait à l'élève le choix qu'il est censé lui épargner, et
 * la seconde ligne — un chapitre « Nouveau · 5 min » tiré du classement —
 * n'était la réponse à aucune question qu'il se posait. Le titre promet une
 * recommandation : elle doit être seule pour en être une.
 */
export default function ResumeSessions({ items }: { items: ResumeItem[] }) {
  const lead = items[0]
  if (!lead) return null

  return (
    <section aria-label="Reprendre une session">
      <h2 className="font-heading mb-2 px-1 text-sm font-bold tracking-wide text-muted-foreground uppercase">
        On commence par ça
      </h2>

      <ul className="flex flex-col gap-2">
        <LeadCard item={lead} />
      </ul>
    </section>
  )
}
