'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Clock, Gift, Lock, Sparkles, Coins, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import {
  CAPSULES,
  PERSO_CATALOG,
  PERSO_CATEGORIES,
  euroLabel,
  capsuleCta,
  type Capsule,
  type CapsuleAccent,
  type PersoCategory,
} from '@/lib/coffre'

// Dégradés d'« emballage » des capsules — uniquement des tokens du design
// system (violet / jaune / corail / marine), aucun hex en dur.
const ACCENT_BG: Record<CapsuleAccent, string> = {
  violet: 'from-primary to-[color-mix(in_oklch,var(--primary),black_28%)]',
  soleil:
    'from-highlight to-[color-mix(in_oklch,var(--highlight),var(--destructive)_45%)]',
  corail:
    'from-destructive to-[color-mix(in_oklch,var(--destructive),black_22%)]',
  prune:
    'from-[color-mix(in_oklch,var(--primary),var(--destructive)_45%)] to-[color-mix(in_oklch,var(--primary),black_25%)]',
  ocean:
    'from-[color-mix(in_oklch,var(--primary),var(--foreground)_50%)] to-foreground',
}

// Le jaune solaire réclame de l'encre marine ; le reste porte du blanc.
const ACCENT_TEXT: Record<CapsuleAccent, string> = {
  violet: 'text-white',
  soleil: 'text-foreground',
  corail: 'text-white',
  prune: 'text-white',
  ocean: 'text-white',
}

// Une capsule = une fiche produit « tall card » : cartouche colorée en haut
// (emoji + ruban prix), corps blanc (titre, promesse, ce qu'on y apprend), CTA.
function CapsuleCard({ capsule }: { capsule: Capsule }) {
  const free = capsule.priceEuros <= 0
  const ink = ACCENT_TEXT[capsule.accent]

  return (
    <Link
      href={`/coffre/${capsule.id}`}
      onClick={() => sfx.tap()}
      aria-label={`${capsule.title} — ${capsuleCta(capsule)}`}
      className="group flex w-64 shrink-0 snap-start flex-col overflow-hidden rounded-3xl bg-white shadow-md ring-1 ring-black/5 transition-transform hover:-translate-y-0.5 active:scale-[0.99]"
    >
      {/* Cartouche colorée : l'affiche de la mini-formation. */}
      <div
        className={cn(
          'relative flex h-28 items-center justify-center bg-gradient-to-br',
          ACCENT_BG[capsule.accent],
        )}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-white/20 to-transparent"
        />
        <span className="text-5xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] transition-transform group-hover:scale-110">
          {capsule.emoji}
        </span>
        {/* Ruban prix, en haut à droite. */}
        <span
          className={cn(
            'absolute top-2.5 right-2.5 flex items-center gap-1 rounded-full px-2.5 py-1 font-mono text-[11px] font-extrabold shadow-sm tabular-nums',
            free ? 'bg-white text-foreground' : 'bg-foreground text-background',
          )}
        >
          {free ? (
            <>
              <Gift className="size-3" aria-hidden="true" /> Offert
            </>
          ) : (
            euroLabel(capsule.priceEuros)
          )}
        </span>
        {!capsule.available ? (
          <span
            className={cn(
              'absolute bottom-2.5 left-2.5 flex items-center gap-1 rounded-full bg-black/30 px-2 py-0.5 text-[10px] font-bold backdrop-blur-sm',
              ink,
            )}
          >
            <Lock className="size-2.5" aria-hidden="true" /> Bientôt
          </span>
        ) : (
          <span
            className={cn(
              'absolute bottom-2.5 left-2.5 flex items-center gap-1 rounded-full bg-black/25 px-2 py-0.5 text-[10px] font-semibold backdrop-blur-sm',
              ink,
            )}
          >
            <Clock className="size-2.5" aria-hidden="true" /> {capsule.duration}
          </span>
        )}
      </div>

      {/* Corps blanc : le pitch + ce qu'on y apprend. */}
      <div className="flex flex-1 flex-col p-3.5">
        <h3 className="font-heading text-base leading-tight font-extrabold text-balance text-foreground">
          {capsule.title}
        </h3>
        <p className="mt-1 text-xs leading-snug text-muted-foreground">
          {capsule.tagline}
        </p>
        <ul className="mt-2.5 flex flex-1 flex-col gap-1">
          {capsule.covers.slice(0, 3).map((line, i) => (
            <li
              key={i}
              className="flex items-start gap-1.5 text-[11px] leading-tight font-medium text-foreground/75"
            >
              <span
                aria-hidden="true"
                className="mt-1 size-1.5 shrink-0 rounded-full bg-primary/50"
              />
              {line}
            </li>
          ))}
        </ul>
        <span
          className={cn(
            'font-heading mt-3 flex items-center justify-center gap-1 rounded-full px-3 py-2 text-xs font-extrabold transition-colors',
            capsule.available
              ? 'bg-primary text-primary-foreground group-hover:brightness-110'
              : 'bg-muted text-muted-foreground',
          )}
        >
          {capsuleCta(capsule)}
          {capsule.available ? (
            <ChevronRight className="size-3.5" aria-hidden="true" />
          ) : null}
        </span>
      </div>
    </Link>
  )
}

// Un produit de personnalisation : carte compacte (emoji, nom, prix pièces).
function PersoCard({
  emoji,
  name,
  desc,
  priceCoins,
  available,
  affordable,
}: {
  emoji: string
  name: string
  desc: string
  priceCoins: number
  available: boolean
  affordable: boolean
}) {
  return (
    <div className="flex flex-col rounded-2xl bg-white p-3 shadow-sm ring-1 ring-black/5">
      <div className="flex items-start gap-2">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-2xl">
          {emoji}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-heading truncate text-sm font-extrabold text-foreground">
            {name}
          </p>
          <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-muted-foreground">
            {desc}
          </p>
        </div>
      </div>
      <button
        type="button"
        disabled={!available}
        onClick={() => sfx.tap()}
        className={cn(
          'mt-2.5 flex items-center justify-center gap-1 rounded-full px-3 py-1.5 font-mono text-xs font-extrabold tabular-nums transition-colors',
          !available
            ? 'bg-muted text-muted-foreground'
            : affordable
              ? 'bg-highlight text-foreground hover:brightness-105'
              : 'bg-highlight/40 text-foreground/60',
        )}
      >
        {!available ? (
          <>
            <Lock className="size-3" aria-hidden="true" /> Bientôt
          </>
        ) : (
          <>
            <Coins className="size-3.5" aria-hidden="true" /> {priceCoins}
          </>
        )}
      </button>
    </div>
  )
}

/**
 * La devanture du Coffre : les capsules d'apprentissage (micro-formations
 * vidéo, la première offerte) puis la personnalisation (fonds, crédits, skins)
 * payée en pièces. Blocs volontairement resserrés (max-w-md) pour ne pas
 * s'étaler sur toute la largeur.
 */
export default function CoffreStore({ coins }: { coins: number }) {
  const [category, setCategory] = useState<PersoCategory>('fond')
  const visiblePerso = PERSO_CATALOG.filter((p) => p.category === category)

  return (
    <div className="mx-auto w-full max-w-md space-y-7">
      {/* Solde de pièces : la monnaie de la personnalisation. */}
      <div className="flex items-center justify-between rounded-2xl bg-white/70 px-4 py-2.5 ring-1 ring-black/5">
        <span className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground">
          <Sparkles className="size-4 text-primary" aria-hidden="true" />
          Ta boutique
        </span>
        <span className="flex items-center gap-1.5 font-mono text-sm font-extrabold text-foreground tabular-nums">
          <Coins className="size-4 text-highlight" aria-hidden="true" />
          {coins} pièces
        </span>
      </div>

      {/* ---------------------------------------------------- Capsules (€) */}
      <section aria-labelledby="coffre-capsules">
        <div className="mb-3 flex items-end justify-between gap-2 px-1">
          <div>
            <h2
              id="coffre-capsules"
              className="font-heading text-xl font-extrabold text-foreground"
            >
              Capsules d’apprentissage
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Mes mini-formations en vidéo — la première est offerte.
            </p>
          </div>
        </div>
        {/* Carrousel : on fait défiler les fiches produit horizontalement. */}
        <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {CAPSULES.map((capsule) => (
            <CapsuleCard key={capsule.id} capsule={capsule} />
          ))}
        </div>
      </section>

      {/* -------------------------------------------- Personnalisation (pièces) */}
      <section aria-labelledby="coffre-perso">
        <div className="mb-3 px-1">
          <h2
            id="coffre-perso"
            className="font-heading text-xl font-extrabold text-foreground"
          >
            Personnalisation
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Dépense tes pièces : fonds d’écran, cartes mentales, skins.
          </p>
        </div>

        {/* Chips de catégorie. */}
        <div
          role="tablist"
          aria-label="Catégories de personnalisation"
          className="-mx-1 mb-3 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {PERSO_CATEGORIES.map((c) => {
            const active = category === c.id
            return (
              <button
                key={c.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => {
                  sfx.tap()
                  setCategory(c.id)
                }}
                className={cn(
                  'font-heading flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-bold whitespace-nowrap transition-colors',
                  active
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-white/70 text-muted-foreground hover:text-foreground',
                )}
              >
                <span aria-hidden="true">{c.emoji}</span>
                {c.label}
              </button>
            )
          })}
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {visiblePerso.map((p) => (
            <PersoCard
              key={p.id}
              emoji={p.emoji}
              name={p.name}
              desc={p.desc}
              priceCoins={p.priceCoins}
              available={p.available}
              affordable={coins >= p.priceCoins}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
