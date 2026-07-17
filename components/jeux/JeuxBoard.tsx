'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Lock } from 'lucide-react'
import { sfx } from '@/lib/sounds'
import {
  SALONS,
  TEAM_GAMES,
  type Salon,
  type SalonState,
} from '@/lib/jeux/catalog'

const LOCKED_STATE: SalonState = { unlocked: false, best: 0 }

type Wing = 'salons' | 'equipes'

// Une vignette de jeu : carrée, lisible d'un coup d'œil. Jouable = lien vif.
// Deux raisons de ne pas pouvoir jouer, deux visuels DIFFÉRENTS : « Bientôt »
// (le jeu n'est pas encore construit — rien à mériter) et le cadenas (le jeu
// existe mais se débloque à la maîtrise) — un seul cadenas mélangerait tout.
function GameTile({
  emoji,
  name,
  tagline,
  href,
  soon = false,
  locked = false,
}: {
  emoji: string
  name: string
  tagline: string
  href?: string
  soon?: boolean
  locked?: boolean
}) {
  const inner = (
    <>
      <span className="text-3xl leading-none" aria-hidden="true">
        {emoji}
      </span>
      <span className="mt-auto block font-heading text-sm leading-tight font-extrabold text-white">
        {name}
      </span>
      <span className="mt-0.5 line-clamp-2 block text-[11px] leading-snug font-semibold text-white/60">
        {tagline}
      </span>
      {soon ? (
        <span className="absolute top-2.5 right-2.5 rounded-full bg-white/15 px-2 py-0.5 text-[9px] font-extrabold tracking-wide text-white/70 uppercase">
          Bientôt
        </span>
      ) : locked ? (
        <span
          className="absolute top-2.5 right-2.5 flex size-6 items-center justify-center rounded-full bg-black/40"
          title="Se débloque avec la maîtrise"
        >
          <Lock className="size-3 text-white/70" aria-hidden="true" />
        </span>
      ) : (
        <span className="absolute top-2.5 right-2.5 rounded-full bg-highlight px-2 py-0.5 text-[9px] font-extrabold tracking-wide text-[oklch(0.24_0.05_300)] uppercase">
          Jouer
        </span>
      )}
    </>
  )

  const base =
    'relative flex aspect-square min-h-[44px] flex-col rounded-3xl border p-3 text-left'

  if (href) {
    return (
      <Link
        href={href}
        onClick={() => sfx.tap()}
        className={`${base} defi2-press border-highlight/40 bg-gradient-to-b from-[oklch(0.34_0.09_300)] to-[oklch(0.26_0.07_300)] shadow-[0_10px_24px_-12px_rgba(0,0,0,0.9)] hover:border-highlight focus-visible:ring-4 focus-visible:ring-white/40 focus-visible:outline-none`}
        aria-label={`${name} — jouer`}
      >
        {inner}
      </Link>
    )
  }
  return (
    <div className={`${base} border-white/10 bg-white/5 opacity-65`}>
      {inner}
    </div>
  )
}

// Le sélecteur de matière : une seule rangée qui défile, au lieu de sept
// cartes empilées. Le salon choisi occupe tout l'écran en dessous.
function SubjectStrip({
  salons,
  board,
  active,
  onSelect,
}: {
  salons: Salon[]
  board: Record<string, SalonState>
  active: string
  onSelect: (subject: string) => void
}) {
  return (
    <div
      role="tablist"
      aria-label="Matières"
      className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {salons.map((salon) => {
        const state = board[salon.subject] ?? LOCKED_STATE
        const isActive = salon.subject === active
        return (
          <button
            key={salon.subject}
            type="button"
            role="tab"
            id={`onglet-${salon.subject}`}
            aria-selected={isActive}
            aria-controls="salon-panneau"
            onClick={() => {
              sfx.tap()
              onSelect(salon.subject)
            }}
            className={`defi2-press flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2.5 font-heading text-sm font-extrabold whitespace-nowrap focus-visible:ring-4 focus-visible:ring-white/40 focus-visible:outline-none ${
              isActive
                ? 'border-highlight bg-highlight text-[oklch(0.24_0.05_300)]'
                : 'border-white/12 bg-white/6 text-white/70'
            }`}
          >
            <span aria-hidden="true">{salon.emoji}</span>
            {salon.subject}
            {!state.unlocked ? (
              <Lock
                className={`size-3 ${isActive ? 'opacity-60' : 'text-white/50'}`}
                aria-label="fermé"
              />
            ) : null}
          </button>
        )
      })}
    </div>
  )
}

/**
 * L'espace Jeux, en un écran : deux ailes en bascule (les salons 1v1 par
 * matière, les équipes 2v2), une matière à la fois via une rangée d'onglets,
 * et les jeux en grille de vignettes. Rien ne s'empile — on choisit, on voit.
 */
export default function JeuxBoard({
  board,
  initialSubject = null,
}: {
  board: Record<string, SalonState>
  // Matière à ouvrir directement (?matiere=… depuis la feuille Modes de jeu).
  // Inconnue ou absente → première matière du catalogue.
  initialSubject?: string | null
}) {
  const [wing, setWing] = useState<Wing>('salons')
  const [subject, setSubject] = useState(
    () =>
      SALONS.find((s) => s.subject === initialSubject)?.subject ??
      SALONS[0].subject,
  )

  const salon = SALONS.find((s) => s.subject === subject) ?? SALONS[0]
  const state = board[salon.subject] ?? LOCKED_STATE
  const pct = Math.round(state.best * 100)

  return (
    <div className="flex flex-col gap-4">
      {/* --------------------------------------------- bascule des deux ailes */}
      <div
        role="tablist"
        aria-label="Type de jeu"
        className="flex gap-1 rounded-full border border-white/12 bg-black/25 p-1"
      >
        {(
          [
            ['salons', '1v1 par matière'],
            ['equipes', 'Équipes 2v2'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={wing === id}
            onClick={() => {
              sfx.tap()
              setWing(id)
            }}
            className={`flex-1 rounded-full px-3 py-2.5 font-heading text-sm font-extrabold focus-visible:ring-4 focus-visible:ring-white/40 focus-visible:outline-none ${
              wing === id
                ? 'bg-white text-[oklch(0.24_0.05_300)]'
                : 'text-white/70'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {wing === 'salons' ? (
        <>
          <SubjectStrip
            salons={SALONS}
            board={board}
            active={subject}
            onSelect={setSubject}
          />

          <section
            id="salon-panneau"
            role="tabpanel"
            aria-labelledby={`onglet-${salon.subject}`}
            className="flex flex-col gap-3"
          >
            {!state.unlocked ? (
              <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[11px] font-bold text-white/70">
                    Maîtrise un chapitre de {salon.subject} à 80 % pour entrer.
                  </p>
                  <span className="shrink-0 font-heading text-sm font-extrabold text-highlight">
                    {pct} %
                  </span>
                </div>
                <div
                  className="mt-2 h-2 w-full overflow-hidden rounded-full bg-black/40"
                  role="progressbar"
                  aria-valuenow={pct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`Progression vers l'ouverture du salon ${salon.subject}`}
                >
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-highlight"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <Link
                  href="/reviser"
                  className="mt-2 inline-flex items-center gap-1 text-xs font-extrabold text-highlight underline underline-offset-2"
                >
                  Fais tes preuves dans Réviser
                </Link>
              </div>
            ) : null}

            <div className="grid grid-cols-2 gap-2.5">
              {salon.games.map((game) => (
                <GameTile
                  key={game.id}
                  emoji={game.emoji}
                  name={game.name}
                  tagline={game.tagline}
                  soon={!game.implemented}
                  locked={game.implemented && !state.unlocked}
                  href={
                    game.implemented && state.unlocked
                      ? `/defi/jeux/${game.id}`
                      : undefined
                  }
                />
              ))}
            </div>
          </section>
        </>
      ) : (
        <section className="flex flex-col gap-3">
          {/* Aucun jeu 2v2 n'est construit : on l'assume (vignettes « Bientôt »),
              sans pousser de CTA « Préparer mon équipe » vers une
              fonctionnalité qui n'existe pas encore. */}
          <p className="text-sm font-semibold text-white/70">
            Les 2v2 entre amis arrivent bientôt — on gagne ou on perd ensemble.
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            {TEAM_GAMES.map((game) => (
              <GameTile
                key={game.id}
                emoji={game.emoji}
                name={game.name}
                tagline={game.tagline}
                soon
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
