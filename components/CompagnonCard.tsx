'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Pencil, ShoppingBag } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import {
  companionMood,
  companionName,
  companionWeeklyLine,
  setCompanionName,
  stageForStreak,
  nextStage,
  stageProgress,
  MOOD_LINES,
  DEFAULT_COMPANION_NAME,
  COMPANION_HUNGRY_IMAGE,
} from '@/lib/compagnon'

// Le compagnon d'étude — la carte tamagotchi de l'onglet Moi. Il grandit avec
// la série, se nourrit des sessions du jour, et porte les accessoires achetés
// au Trésor. Le nom se choisit ici (localStorage : c'est SON compagnon).
export default function CompagnonCard({
  streak,
  activeToday,
  accessories,
  weekSessions = 0,
  weekDelta = 0,
  compact = false,
}: {
  streak: number
  activeToday: boolean
  // Emojis des accessoires « compagnon » possédés (shop_purchases).
  accessories: string[]
  // Sessions de la semaine + écart vs la précédente : il COMMENTE ta semaine.
  weekSessions?: number
  weekDelta?: number
  // `compact` : encart resserré (ligne unique + barre fine), pour « Ma semaine ».
  compact?: boolean
}) {
  const stage = stageForStreak(streak)
  const next = nextStage(streak)
  const mood = companionMood(activeToday, streak)
  const progress = stageProgress(streak)

  // Le nom se lit après montage (localStorage) — pas d'écart d'hydratation.
  const [name, setName] = useState(DEFAULT_COMPANION_NAME)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  useEffect(() => {
    const load = () => setName(companionName())
    load()
  }, [])

  const saveName = () => {
    const clean = draft.trim().slice(0, 20)
    if (clean) {
      setCompanionName(clean)
      setName(clean)
      sfx.tap()
    }
    setEditing(false)
  }

  // Encart resserré pour l'onglet « Ma semaine » : le compagnon vit sa forme et
  // sa progression en une ligne, sans le détail plein écran.
  if (compact) {
    return (
      <section
        className="moi-card flex items-center gap-3 rounded-[1.75rem] bg-white p-4"
        aria-label="Ton compagnon d'étude"
      >
        <span
          className={cn(
            'relative flex size-14 shrink-0 items-center justify-center',
            mood === 'endormi' && 'opacity-80',
          )}
        >
          {mood === 'rayonnant' ? (
            <span
              aria-hidden="true"
              className="moi-glow compagnon-halo absolute -inset-1 rounded-full"
            />
          ) : null}
          <Image
            src={mood === 'affame' ? COMPANION_HUNGRY_IMAGE : stage.image}
            alt=""
            aria-hidden="true"
            width={52}
            height={52}
            className={cn(
              'relative size-full object-contain',
              mood === 'endormi' && 'compagnon-sleep',
              mood === 'affame' && 'compagnon-flicker',
              (mood === 'en_forme' || mood === 'rayonnant') && 'flame-breathe',
            )}
          />
          {accessories.length > 0 ? (
            <span
              aria-hidden="true"
              className="absolute -bottom-1 flex gap-0.5 text-xs drop-shadow-sm"
            >
              {accessories.slice(0, 3).map((a) => (
                <span key={a}>{a}</span>
              ))}
            </span>
          ) : null}
        </span>

        <div className="min-w-0 flex-1">
          <p className="truncate font-heading text-base font-bold">{name}</p>
          <p className="text-[11px] font-semibold text-primary">
            {stage.name}
            {streak > 0
              ? ` · série de ${streak} jour${streak > 1 ? 's' : ''}`
              : ''}
          </p>
          {next ? (
            <div
              className="moi-track mt-1.5 h-2 w-full overflow-hidden rounded-full"
              role="progressbar"
              aria-label={`Évolution vers ${next.name}`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progress * 100)}
            >
              <div
                className="bar-fill h-full rounded-full bg-highlight"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>
          ) : (
            <p className="mt-0.5 text-[11px] font-semibold text-muted-foreground">
              Forme finale atteinte 👑
            </p>
          )}
        </div>
      </section>
    )
  }

  return (
    <section
      className="moi-card rounded-[1.75rem] bg-white p-5"
      aria-label="Ton compagnon d'étude"
    >
      <div className="flex items-center gap-4">
        {/* La flamme : affamée = elle vacille, nourrie = elle respire.
            Pas de tuile de fond — les visuels sont transparents, elle flotte
            sur la carte, avec un halo ambré quand elle rayonne. */}
        <span
          className={cn(
            'relative flex size-20 shrink-0 items-center justify-center',
            mood === 'endormi' && 'opacity-80',
          )}
        >
          {mood === 'rayonnant' ? (
            <span
              aria-hidden="true"
              className="moi-glow compagnon-halo absolute -inset-1 rounded-full"
            />
          ) : null}
          <Image
            src={mood === 'affame' ? COMPANION_HUNGRY_IMAGE : stage.image}
            alt=""
            aria-hidden="true"
            width={76}
            height={76}
            className={cn(
              'relative size-full object-contain',
              // Chaque humeur a sa vie propre : il dort, vacille ou respire.
              mood === 'endormi' && 'compagnon-sleep',
              mood === 'affame' && 'compagnon-flicker',
              (mood === 'en_forme' || mood === 'rayonnant') && 'flame-breathe',
            )}
          />
          {/* Les accessoires du Trésor, épinglés sur la carte. */}
          {accessories.length > 0 ? (
            <span
              aria-hidden="true"
              className="absolute -bottom-1.5 flex gap-0.5 text-sm drop-shadow-sm"
            >
              {accessories.slice(0, 3).map((a) => (
                <span key={a}>{a}</span>
              ))}
            </span>
          ) : null}
        </span>

        <div className="min-w-0 flex-1">
          {editing ? (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                saveName()
              }}
              className="flex items-center gap-1.5"
            >
              <input
                autoFocus
                defaultValue={name}
                onChange={(e) => setDraft(e.target.value)}
                onBlur={saveName}
                maxLength={20}
                aria-label="Nom de ton compagnon"
                className="w-32 rounded-lg border bg-background px-2 py-0.5 text-sm font-bold outline-none focus:border-primary"
              />
            </form>
          ) : (
            <p className="flex items-center gap-1.5">
              <span className="truncate font-heading text-xl font-bold">
                {name}
              </span>
              <button
                type="button"
                onClick={() => {
                  setDraft(name)
                  setEditing(true)
                }}
                aria-label="Renommer ton compagnon"
                className="-m-1.5 flex size-11 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
              >
                <Pencil className="size-3.5" />
              </button>
            </p>
          )}
          <p className="text-xs font-semibold text-primary">
            {stage.name}
            {streak > 0
              ? ` · série de ${streak} jour${streak > 1 ? 's' : ''}`
              : ''}
          </p>
          <p className="text-xs text-muted-foreground">{MOOD_LINES[mood]}</p>
          {/* Il vit ta semaine avec toi — le commentaire de la rétro, chez lui. */}
          <p className="mt-1 text-xs font-medium text-foreground/70 italic">
            {companionWeeklyLine(name, weekSessions, weekDelta)}
          </p>
        </div>
      </div>

      {/* Vers la prochaine évolution : la promesse visible. */}
      {next ? (
        <div className="mt-3">
          <div className="mb-1 flex items-center justify-between text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              Prochaine évolution :
              <Image
                src={next.image}
                alt=""
                aria-hidden="true"
                width={16}
                height={16}
                className="inline-block object-contain"
              />
              {next.name}
            </span>
            <span className="font-mono tabular-nums">
              {streak}/{next.minStreak} j
            </span>
          </div>
          <div
            className="moi-track h-3 w-full overflow-hidden rounded-full"
            role="progressbar"
            aria-label={`Évolution vers ${next.name}`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress * 100)}
          >
            <div
              className="bar-fill h-full rounded-full bg-highlight"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
        </div>
      ) : (
        <p className="mt-3 text-center text-xs font-semibold">
          Forme finale atteinte — {stage.hint}
        </p>
      )}

      {accessories.length === 0 ? (
        <Link
          href="/coffre"
          className="mt-3 flex items-center justify-center gap-1.5 text-xs font-semibold text-primary underline-offset-4 hover:underline"
        >
          <ShoppingBag className="size-3.5" aria-hidden="true" />
          Habille-le avec les accessoires du coffre
        </Link>
      ) : null}
    </section>
  )
}
