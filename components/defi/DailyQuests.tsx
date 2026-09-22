'use client'

import { useState, useSyncExternalStore, useTransition } from 'react'
import {
  BookOpen,
  CalendarCheck,
  Check,
  Flame,
  Gift,
  Layers,
  Swords,
  Target,
  Trophy,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { CristalIcon } from '@/components/ui/MonnaieIcon'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { claimDailyQuests } from '@/app/defi/hebdo-actions'
import {
  ALL_DONE_GEMS,
  ALL_DONE_XP,
  BONUS_STEP_ID,
  allDone,
  doneCount,
  libelleRenouvellement,
  minutesAvantMinuitUtc,
  type QuestDef,
  type QuestKind,
  type QuestView,
} from '@/lib/quests'

/** Le dessin de chaque genre de quête — un objet par geste, comme les tuiles de Brawl Stars. */
const ICONE: Record<QuestKind, LucideIcon> = {
  duel_play: Swords,
  duel_win: Trophy,
  correct: Target,
  combo: Flame,
  session_prepa: CalendarCheck,
  revision: Layers,
  chapter: BookOpen,
}

/** La difficulté, en pastille et sur la tuile : vert, or, corail — la rareté du modèle. */
const PALIER: Record<QuestDef['tier'], { label: string; pastille: string; tuile: string }> = {
  facile: {
    label: 'Facile',
    pastille: 'bg-success text-success-foreground',
    tuile: 'bg-success text-success-foreground',
  },
  moyenne: {
    label: 'Moyenne',
    pastille: 'bg-highlight text-foreground',
    tuile: 'bg-highlight text-foreground',
  },
  exigeante: {
    label: 'Exigeante',
    pastille: 'bg-destructive text-white',
    tuile: 'bg-destructive text-white',
  },
}

// Le compte à rebours des prochaines quêtes, lu comme un magasin externe : le
// serveur ne sait pas l'heure du téléphone (null), le navigateur la relit
// chaque minute — sans état posé dans un effet.
function abonnerMinute(cb: () => void): () => void {
  const t = setInterval(cb, 60_000)
  return () => clearInterval(t)
}
function useMinutesAvantMinuit(): number | null {
  return useSyncExternalStore(
    abonnerMinute,
    () => minutesAvantMinuitUtc(Date.now()),
    () => null,
  )
}

/**
 * LES QUÊTES DU JOUR, FAÇON BRAWL STARS (Lucas, 22/09/2026 : « il faut faire
 * bien mieux pour le rendu des quêtes journalières, inspire-toi délibérément
 * du style de Brawl Stars ; ajoute une pastille chaque jour, le gain associé
 * en XP et/ou gemmes »).
 *
 * Trois cartes, une par quête : la TUILE de son geste à gauche (colorée à la
 * difficulté, cochée quand c'est fait), la pastille de difficulté, le nom, une
 * barre épaisse avec son compte, et à droite CE QU'ELLE RAPPORTE — l'XP en or,
 * les gemmes en cristal — écrit sur chaque carte, pas seulement sur le bouton
 * d'encaissement. En tête, les trois pastilles du jour et le compte à rebours
 * des prochaines quêtes ; en pied, le coffre des trois bouclées et le bouton
 * ENCAISSER en or, qui n'apparaît que s'il y a quelque chose à prendre.
 *
 * Il ne calcule aucune récompense : les vues arrivent résolues du serveur
 * (lib/quests-server.fetchQuestViews) et les montants sont recalculés en base
 * à la réclamation. Une quête déjà payée reste affichée, cochée et estompée —
 * l'élève voit ce qu'il a accompli aujourd'hui, pas une liste qui se vide.
 */
export default function DailyQuests({
  views,
  claimedIds,
}: {
  views: QuestView[]
  claimedIds: string[]
}) {
  const [paid, setPaid] = useState<Set<string>>(new Set(claimedIds))
  const [pending, startTransition] = useTransition()
  const [reward, setReward] = useState<{ xp: number; gems: number } | null>(null)
  const minutes = useMinutesAvantMinuit()

  if (views.length === 0) return null

  const done = doneCount(views)
  const complete = allDone(views)

  // Ce qui est encaissable MAINTENANT : les quêtes finies et pas encore payées,
  // plus le bonus si les trois sont bouclées et qu'il n'a jamais été versé.
  const pendingViews = views.filter((v) => v.done && !paid.has(v.def.id))
  const bonusDue = complete && !paid.has(BONUS_STEP_ID)
  const claimableXp =
    pendingViews.reduce((s, v) => s + v.def.xp, 0) + (bonusDue ? ALL_DONE_XP : 0)
  const claimableGems =
    pendingViews.reduce((s, v) => s + v.def.gems, 0) + (bonusDue ? ALL_DONE_GEMS : 0)
  const claimable = claimableXp > 0 || claimableGems > 0

  const claim = () => {
    if (!claimable || pending) return
    sfx.complete()
    startTransition(async () => {
      const r = await claimDailyQuests()
      if (!r.claimed) return
      setPaid((prev) => {
        const next = new Set(prev)
        for (const v of pendingViews) next.add(v.def.id)
        if (r.allDone) next.add(BONUS_STEP_ID)
        return next
      })
      setReward({ xp: r.xp, gems: r.gems })
    })
  }

  return (
    <section className="text-white" aria-label="Quêtes du jour">
      <header className="flex items-center justify-between gap-3">
        <h2 className="font-heading text-xl leading-tight font-extrabold">Quêtes du jour</h2>
        {/* Les trois pastilles : une par quête, allumée quand elle est faite. */}
        <span
          className="flex shrink-0 items-center gap-1.5 rounded-full bg-black/30 px-2.5 py-1.5 ring-1 ring-white/10"
          aria-label={`${done} quête${done > 1 ? 's' : ''} sur ${views.length} bouclée${done > 1 ? 's' : ''}`}
        >
          {views.map((v) => (
            <span
              key={v.def.id}
              aria-hidden="true"
              className={cn(
                'size-2.5 rounded-full',
                v.done ? 'bg-highlight shadow-[0_0_8px_var(--highlight)]' : 'bg-white/25',
              )}
            />
          ))}
          <span className="font-mono ml-0.5 text-[11px] font-extrabold tabular-nums">
            {done}/{views.length}
          </span>
        </span>
      </header>
      {/* La pastille du jour : ces quêtes-là expirent, et il y en aura
          d'autres — c'est ce qui fait revenir. */}
      <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-extrabold whitespace-nowrap text-white/85 ring-1 ring-white/15">
        <CalendarCheck className="size-3.5 text-highlight" strokeWidth={2.6} aria-hidden="true" />
        {libelleRenouvellement(minutes)}
      </p>

      <ul className="mt-3 space-y-2.5">
        {views.map((v) => (
          <CarteQuete key={v.def.id} vue={v} encaissee={paid.has(v.def.id)} />
        ))}
      </ul>

      {/* LE COFFRE DES TROIS : la promesse du bonus doit être visible AVANT
          d'être atteignable — c'est elle qui fait viser les trois. */}
      <div
        className={cn(
          'mt-2.5 flex items-center gap-3 rounded-2xl p-3 ring-1',
          bonusDue
            ? 'bg-highlight/15 ring-highlight/70'
            : paid.has(BONUS_STEP_ID)
              ? 'bg-white/[0.04] ring-white/10 opacity-70'
              : 'bg-primary/25 ring-white/15',
        )}
      >
        <span
          className={cn(
            'grid size-12 shrink-0 place-items-center rounded-2xl shadow-[0_3px_0_rgba(0,0,0,0.35)]',
            complete ? 'bg-highlight text-foreground' : 'bg-white/10 text-highlight',
          )}
          aria-hidden="true"
        >
          <Gift className="size-6" strokeWidth={2.4} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-heading text-[15px] leading-tight font-extrabold">
            {paid.has(BONUS_STEP_ID)
              ? 'Coffre du jour encaissé'
              : complete
                ? 'Les trois sont bouclées — le coffre est à toi !'
                : 'Boucle les 3 quêtes'}
          </p>
          <p className="mt-0.5 text-[11.5px] font-semibold text-white/65">
            {complete ? 'Le bonus du jour :' : `${views.length - done} restante${views.length - done > 1 ? 's' : ''} pour le coffre du jour :`}
          </p>
        </div>
        <Recompenses xp={ALL_DONE_XP} gems={ALL_DONE_GEMS} />
      </div>

      {claimable ? (
        <button
          type="button"
          onClick={claim}
          disabled={pending}
          className="olympe-gold olympe-press font-heading mt-4 flex min-h-13 w-full cursor-pointer items-center justify-center gap-2.5 rounded-2xl text-base font-extrabold disabled:opacity-60"
        >
          <Gift className="size-5" strokeWidth={2.6} aria-hidden="true" />
          Encaisser
          <span className="flex items-center gap-1.5 font-mono text-[15px] tabular-nums">
            <Zap className="size-4 fill-current" aria-hidden="true" />
            {claimableXp}
            <CristalIcon className="ml-1 size-5" />
            {claimableGems}
          </span>
        </button>
      ) : reward ? (
        <p
          role="status"
          className="animate-in zoom-in font-heading mt-4 flex items-center justify-center gap-2 rounded-2xl bg-highlight px-4 py-3 text-[15px] font-extrabold text-foreground"
        >
          +{reward.xp} XP · +{reward.gems} gemmes, dans ta poche !
        </p>
      ) : (
        <p className="mt-3 text-center text-[12px] font-semibold text-white/60">
          {done === 0
            ? 'Termine une quête pour encaisser'
            : 'Tout est encaissé — reviens demain !'}
        </p>
      )}
    </section>
  )
}

/** Une carte de quête : la tuile, la difficulté, le nom, la barre, le gain. */
function CarteQuete({ vue, encaissee }: { vue: QuestView; encaissee: boolean }) {
  const Icone = ICONE[vue.def.kind]
  const palier = PALIER[vue.def.tier]
  return (
    <li
      className={cn(
        'relative flex items-center gap-3 rounded-2xl p-3 ring-1 transition-colors',
        encaissee
          ? 'bg-white/[0.04] ring-white/10 opacity-70'
          : vue.done
            ? 'bg-highlight/12 ring-highlight/60'
            : 'bg-white/[0.07] ring-white/10',
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'grid size-12 shrink-0 place-items-center rounded-2xl shadow-[0_3px_0_rgba(0,0,0,0.35)]',
          vue.done ? 'bg-highlight text-foreground' : palier.tuile,
        )}
      >
        {vue.done ? (
          <Check className="size-6" strokeWidth={3.2} />
        ) : (
          <Icone className="size-6" strokeWidth={2.4} />
        )}
      </span>

      <div className="min-w-0 flex-1">
        <span
          className={cn(
            'font-heading inline-block rounded-full px-1.5 py-px text-[9.5px] font-extrabold tracking-wider uppercase',
            palier.pastille,
          )}
        >
          {encaissee ? 'Encaissée' : vue.done ? 'Terminée' : palier.label}
        </span>
        <p
          className={cn(
            'font-heading mt-0.5 line-clamp-2 text-[14px] leading-tight font-extrabold',
            encaissee && 'text-white/60 line-through',
          )}
        >
          {vue.def.label}
        </p>
        <div className="mt-1.5 flex items-center gap-2">
          <div
            className="h-2.5 flex-1 overflow-hidden rounded-full bg-black/40 ring-1 ring-white/10 ring-inset"
            role="progressbar"
            aria-label={vue.def.label}
            aria-valuemin={0}
            aria-valuemax={vue.def.goal}
            aria-valuenow={vue.current}
          >
            <div
              className="h-full rounded-full bg-highlight transition-[width] duration-500"
              style={{ width: `${Math.round(vue.ratio * 100)}%` }}
            />
          </div>
          <span className="font-mono shrink-0 text-[11px] font-extrabold text-white/85 tabular-nums">
            {vue.label}
          </span>
        </div>
      </div>

      <Recompenses xp={vue.def.xp} gems={vue.def.gems} />
    </li>
  )
}

/** Ce que ça rapporte : l'XP en or, les gemmes en cristal, empilés à droite. */
function Recompenses({ xp, gems }: { xp: number; gems: number }) {
  return (
    <span
      className="flex shrink-0 flex-col items-end gap-1"
      aria-label={`${xp} XP et ${gems} gemme${gems > 1 ? 's' : ''}`}
    >
      <span className="flex items-center gap-1 rounded-full bg-black/30 px-2 py-0.5 font-mono text-[11.5px] font-extrabold text-highlight tabular-nums ring-1 ring-white/10">
        <Zap className="size-3.5 fill-current" aria-hidden="true" />
        {xp}
      </span>
      <span className="flex items-center gap-1 rounded-full bg-black/30 py-0.5 pr-2 pl-1 font-mono text-[11.5px] font-extrabold text-[#d8c9ff] tabular-nums ring-1 ring-white/10">
        <CristalIcon className="size-4" />
        {gems}
      </span>
    </span>
  )
}
