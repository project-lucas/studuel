'use client'

import Image from 'next/image'
import { Crown, Trophy, type LucideIcon } from 'lucide-react'
import { GameCountdown } from '@/components/jeux/GameShell'
import { cn } from '@/lib/utils'
import type { Manche } from '@/lib/quiz-arene'

/**
 * LE RITUEL D'ENTRÉE du quiz en arène : la carte du chapitre, puis le décompte.
 *
 * Le quiz démarrait à froid sur sa première question. Les jeux de salon, eux,
 * passent d'abord par l'intro (la règle, la scène, le record) puis par le
 * 3 · 2 · 1 — c'est ce rituel qui dit « une partie commence », et c'est lui
 * qui manquait le plus au quiz. Le décompte est celui des jeux, à l'identique
 * (`GameCountdown`) : il n'y a aucune raison qu'un quiz compte autrement.
 *
 * La carte reprend la grammaire de `GameIntro` : une scène en bannière (ici
 * l'illustration de la matière, en grand et sans voile, alors que la session
 * la délavait à 30 % dans un angle), une pastille à cheval sur le bas, le
 * titre, puis les CHIFFRES de la partie — combien de questions, quel score
 * vaut la couronne, quel est le record à battre. Et le bouton GO.
 */
export function AreneIntro({
  titre,
  chapitre,
  matiere,
  Icon,
  vignette,
  total,
  objectif,
  meilleure,
  onStart,
}: {
  titre: string
  /** Le chapitre du programme (« Les noms »), ou null. */
  chapitre: string | null
  matiere: string | null
  Icon: LucideIcon
  vignette: string | undefined
  total: number
  /** Le score qui vaut la couronne (`objectifCouronne`). */
  objectif: number
  /** Le meilleur passage de l'élève, ou null la première fois. */
  meilleure: Manche | null
  onStart: () => void
}) {
  return (
    <div className="mx-auto flex w-full max-w-sm flex-1 flex-col items-center gap-5 pt-4 text-center">
      <div className="relative w-full">
        <div
          className={cn(
            'relative aspect-video w-full overflow-hidden rounded-3xl shadow-lg ring-1 ring-black/5',
            // Sans vignette, la scène est un lavis de la matière : jamais nu.
            'bg-[color:var(--jeu-accent)]/20',
          )}
        >
          {vignette ? (
            <>
              {/* Le halo de la matière derrière l'illustration : c'est lui qui
                  fait la scène, l'image seule flotterait sur du blanc. */}
              <span
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  background:
                    'radial-gradient(70% 80% at 50% 60%, var(--jeu-glow), transparent 75%)',
                }}
              />
              <Image
                src={vignette}
                alt=""
                fill
                sizes="(max-width: 448px) 92vw, 384px"
                className="object-contain p-6"
                priority
              />
            </>
          ) : null}
          <span
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/25 to-transparent"
          />
        </div>
        <span
          aria-hidden="true"
          className="absolute -bottom-6 left-1/2 grid size-16 -translate-x-1/2 place-items-center rounded-2xl bg-[color:var(--jeu-accent)] text-[color:var(--jeu-ink)] shadow-lg ring-4 ring-[color:var(--jeu-surface)]"
        >
          <Icon className="size-8" strokeWidth={2.4} />
        </span>
      </div>

      <div className="pt-5">
        {chapitre || matiere ? (
          <p className="text-xs font-extrabold tracking-wide text-[color:var(--jeu-accent)] uppercase">
            {[matiere, chapitre].filter(Boolean).join(' · ')}
          </p>
        ) : null}
        <h1 className="font-heading mt-1 text-2xl leading-tight font-extrabold text-balance">
          {titre}
        </h1>
      </div>

      {/* Les chiffres de la partie, en pilules — ce que l'élève doit savoir
          AVANT le chrono : combien, jusqu'où, et son record. */}
      <ul className="flex flex-wrap items-center justify-center gap-2 text-sm font-semibold">
        <li className="rounded-full bg-card px-4 py-1.5 shadow-sm">
          <span className="font-mono tabular-nums">{total}</span>{' '}
          {total > 1 ? 'questions' : 'question'}
        </li>
        {objectif > 0 ? (
          <li className="flex items-center gap-1.5 rounded-full bg-card px-4 py-1.5 shadow-sm">
            <Crown className="size-4 text-highlight" aria-hidden="true" />
            <span className="font-mono tabular-nums">
              {objectif} / {total}
            </span>{' '}
            pour la couronne
          </li>
        ) : null}
        <li className="flex items-center gap-1.5 rounded-full bg-card px-4 py-1.5 shadow-sm">
          <Trophy className="size-4 text-highlight" aria-hidden="true" />
          {meilleure ? (
            <>
              Record à battre :{' '}
              <span className="font-mono tabular-nums">
                {meilleure.score} / {meilleure.total}
              </span>
            </>
          ) : (
            'Première fois ici'
          )}
        </li>
      </ul>

      <button
        type="button"
        onClick={onStart}
        className="go-pulse font-heading relative mt-2 grid size-28 place-items-center rounded-full bg-[color:var(--jeu-accent)] text-2xl font-extrabold text-[color:var(--jeu-ink)] shadow-xl transition-transform hover:scale-105 active:scale-95"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-5 top-2 h-10 rounded-full bg-gradient-to-b from-white/25 to-transparent"
        />
        GO
      </button>
    </div>
  )
}

/** Le 3 · 2 · 1 · GO des jeux, tel quel. */
export function AreneDecompte({ n }: { n: number }) {
  return <GameCountdown n={n} />
}
