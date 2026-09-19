'use client'

import { useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowDown, ArrowUp, Clock, Lock } from 'lucide-react'
import type { League, LeaguePlayer, LeagueZone } from '@/lib/defi/types'
import {
  LEAGUE_TIERS,
  leagueLines,
  promotionSentence,
  tierEtat,
  type LeagueTier,
  type TierEtat,
} from '@/lib/league'
import { cn } from '@/lib/utils'

interface WeeklyLeagueProps {
  league: League
  // true = classement de démonstration (visiteur / migration absente) :
  // badge « Aperçu » pour ne jamais faire passer le mock pour du réel.
  isDemo?: boolean
}

/**
 * LA LIGUE HEBDOMADAIRE, REPRISE DE DUOLINGO (demande de Lucas, 16/09/2026).
 *
 * En haut, le RAIL DES DIVISIONS : les six boucliers côte à côte, qui se font
 * défiler vers la droite. La division où l'on est se tient au centre, en
 * grand ; celles qu'on a traversées restent en couleur, plus petites ; celles
 * qui attendent sont grises et cadenassées. On voit d'un coup d'œil d'où l'on
 * vient et ce qu'il reste à gravir — c'est ce qu'un titre seul ne dit pas.
 *
 * En dessous, LA LISTE ENTIÈRE sur une surface CLAIRE (la feuille de l'arène
 * est sombre autour, comme pour la carte crème du classement) : le rang, un
 * avatar, le nom, l'XP de la semaine. La ligne de l'élève est surlignée. Les
 * bandeaux « ZONE DE PROMOTION » et « ZONE DE RELÉGATION » coupent la liste
 * exactement là où le lundi tranchera — c'est la règle, dessinée.
 *
 * Tout ce qui se calcule (zones, place des bandeaux, phrase de règle, état des
 * boucliers) vit dans `lib/league.ts`, testé ; ici on ne fait que dessiner.
 */
export default function WeeklyLeague({ league, isDemo = false }: WeeklyLeagueProps) {
  const lines = leagueLines(league)

  return (
    <div className="p-4 pt-2">
      <div className="overflow-hidden rounded-3xl bg-card text-foreground shadow-xl ring-1 ring-black/5">
        <RailDivisions courante={league.tier} />

        <div className="px-4 pb-3 text-center">
          <div className="flex items-center justify-center gap-2">
            <h3 className="font-heading text-2xl leading-tight font-extrabold">
              {league.name}
            </h3>
            {isDemo ? (
              <span className="shrink-0 rounded-full bg-highlight/30 px-2 py-0.5 text-[10px] font-extrabold text-foreground">
                Aperçu
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-sm font-semibold text-muted-foreground text-balance">
            {promotionSentence(league)}
          </p>
          <p className="mt-1.5 inline-flex items-center gap-1 text-[0.7rem] font-bold text-muted-foreground/80">
            <Clock className="size-3.5" aria-hidden="true" />
            {league.resetLabel} · classement à l&apos;XP gagnée cette semaine
          </p>
        </div>

        <ol className="border-t border-black/5">
          {lines.map((line, i) =>
            line.kind === 'separateur' ? (
              <Separateur key={`sep-${line.zone}`} zone={line.zone} />
            ) : (
              <PlayerRow
                key={line.player.id}
                player={line.player}
                zone={line.zone}
                dernier={i === lines.length - 1}
              />
            ),
          )}
        </ol>
      </div>
    </div>
  )
}

// --- Le rail des divisions ----------------------------------------------------

const TAILLE: Record<TierEtat, number> = {
  courante: 112,
  passee: 64,
  verrouillee: 64,
}

function RailDivisions({ courante }: { courante: number }) {
  const reduce = useReducedMotion()
  const rail = useRef<HTMLUListElement>(null)
  const actuel = useRef<HTMLLIElement>(null)

  // La division courante au CENTRE du rail à l'ouverture. On déplace le rail
  // lui-même (scrollLeft) plutôt que `scrollIntoView` : celui-ci ferait aussi
  // défiler la feuille verticalement pour amener le bouclier à l'écran.
  useEffect(() => {
    const conteneur = rail.current
    const cible = actuel.current
    if (!conteneur || !cible) return
    const gauche =
      cible.offsetLeft - (conteneur.clientWidth - cible.offsetWidth) / 2
    conteneur.scrollTo({ left: gauche, behavior: reduce ? 'auto' : 'smooth' })
  }, [courante, reduce])

  return (
    <ul
      ref={rail}
      aria-label="Les divisions"
      className="flex snap-x snap-mandatory items-end gap-5 overflow-x-auto px-8 pt-5 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {LEAGUE_TIERS.map((tier, i) => {
        const etat = tierEtat(i, courante)
        const taille = TAILLE[etat]
        const nom = tier.name.replace(/^Division /, '')
        return (
          <li
            key={tier.name}
            ref={etat === 'courante' ? actuel : undefined}
            aria-current={etat === 'courante' ? 'true' : undefined}
            className="flex shrink-0 snap-center flex-col items-center gap-1"
            style={{ minWidth: TAILLE.courante }}
          >
            {/* Le bouclier courant respire doucement : c'est le seul
                mouvement du rail, donc l'œil y va. Immobile en mouvement
                réduit — sa taille le désigne déjà. */}
            <motion.span
              aria-hidden="true"
              animate={
                etat === 'courante' && !reduce ? { y: [0, -5, 0] } : undefined
              }
              transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
              className="relative grid place-items-center"
              style={{ width: taille, height: taille }}
            >
              <Bouclier tier={tier} etat={etat} size={taille} />
              {etat === 'verrouillee' ? (
                <Lock
                  className="absolute text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)]"
                  style={{ width: taille * 0.3, height: taille * 0.3 }}
                  strokeWidth={2.6}
                  aria-hidden="true"
                />
              ) : null}
            </motion.span>
            <span
              className={cn(
                'font-heading text-[11px] font-extrabold',
                etat === 'courante'
                  ? 'text-foreground'
                  : etat === 'passee'
                    ? 'text-muted-foreground'
                    : 'text-muted-foreground/60',
              )}
            >
              {nom}
              <span className="sr-only">
                {etat === 'courante'
                  ? ' — ta division'
                  : etat === 'passee'
                    ? ' — traversée'
                    : ' — à débloquer'}
              </span>
            </span>
          </li>
        )
      })}
    </ul>
  )
}

/**
 * Le bouclier d'une division, en SVG : une plaque à trois pointes sur un
 * socle, comme les trophées de Duolingo. Les couleurs viennent du palier
 * (`LEAGUE_TIERS[].couleur`) — une identité, pas un rôle. Verrouillé : gris,
 * le cadenas se pose par-dessus.
 */
function Bouclier({
  tier,
  etat,
  size,
}: {
  tier: LeagueTier
  etat: TierEtat
  size: number
}) {
  const verrouille = etat === 'verrouillee'
  // Gris neutre pour les divisions verrouillées : dérivé de l'encre de la DA
  // (color-mix), pas une couleur de plus.
  const clair = verrouille
    ? 'color-mix(in oklch, var(--muted-foreground), white 45%)'
    : tier.couleur
  const sombre = verrouille
    ? 'color-mix(in oklch, var(--muted-foreground), white 10%)'
    : tier.couleurSombre
  const id = `bouclier-${tier.name.replace(/\W/g, '')}-${etat}`
  return (
    <svg
      viewBox="0 0 100 110"
      width={size}
      height={size * 1.1}
      aria-hidden="true"
      className="drop-shadow-[0_4px_6px_rgba(0,0,0,0.18)]"
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="white" stopOpacity="0.55" />
          <stop offset="0.45" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Le socle */}
      <ellipse cx="50" cy="100" rx="30" ry="8" fill={sombre} opacity="0.35" />
      <rect x="30" y="86" width="40" height="12" rx="4" fill={sombre} />
      <rect x="36" y="80" width="28" height="10" rx="3" fill={clair} />
      {/* La plaque à trois pointes */}
      <path
        d="M50 6 C56 14 66 18 76 14 C82 22 84 34 78 44 C86 52 86 66 74 76 L50 88 L26 76 C14 66 14 52 22 44 C16 34 18 22 24 14 C34 18 44 14 50 6 Z"
        fill={clair}
        stroke={sombre}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {/* Le reflet */}
      <path
        d="M50 6 C56 14 66 18 76 14 C82 22 84 34 78 44 C86 52 86 66 74 76 L50 88 L26 76 C14 66 14 52 22 44 C16 34 18 22 24 14 C34 18 44 14 50 6 Z"
        fill={`url(#${id})`}
      />
    </svg>
  )
}

// --- La liste ------------------------------------------------------------------

function Separateur({ zone }: { zone: 'promotion' | 'relegation' }) {
  const promo = zone === 'promotion'
  const Fleche = promo ? ArrowUp : ArrowDown
  return (
    <li
      className={cn(
        'font-heading flex items-center justify-center gap-2 py-2.5 text-xs font-extrabold tracking-wider uppercase',
        promo ? 'text-success' : 'text-destructive',
      )}
    >
      <Fleche className="size-4" strokeWidth={3} aria-hidden="true" />
      {promo ? 'Zone de promotion' : 'Zone de relégation'}
      <Fleche className="size-4" strokeWidth={3} aria-hidden="true" />
    </li>
  )
}

function PlayerRow({
  player,
  zone,
  dernier,
}: {
  player: LeaguePlayer
  zone: LeagueZone
  dernier: boolean
}) {
  // La ligne de l'élève : verte si elle monte, violette sinon — la couleur de
  // la zone d'abord, l'identité ensuite.
  const fond = player.isMe
    ? zone === 'promotion'
      ? 'bg-success/15'
      : 'bg-primary/10'
    : ''
  const rang =
    zone === 'promotion'
      ? 'text-success'
      : zone === 'relegation'
        ? 'text-destructive'
        : 'text-muted-foreground'

  return (
    <li
      className={cn(
        'flex items-center gap-3 px-4 py-2.5',
        fond,
        dernier ? 'rounded-b-3xl' : null,
      )}
      aria-current={player.isMe ? 'true' : undefined}
    >
      <span
        className={cn(
          'font-heading w-7 shrink-0 text-center text-lg font-extrabold tabular-nums',
          rang,
        )}
      >
        {player.rank}
      </span>
      <span
        className="grid size-10 shrink-0 place-items-center rounded-full bg-muted text-xl leading-none"
        aria-hidden="true"
      >
        {player.avatar}
      </span>
      <span className="min-w-0 flex-1 truncate font-bold">
        {player.name}
        {player.isMe ? (
          <span className="ml-1.5 rounded-full bg-primary px-1.5 py-0.5 align-middle text-[0.6rem] font-extrabold text-primary-foreground">
            TOI
          </span>
        ) : null}
      </span>
      <span className="shrink-0 text-sm font-extrabold tabular-nums">
        {player.weeklyXp}{' '}
        <span className="text-xs font-bold text-muted-foreground">XP</span>
      </span>
    </li>
  )
}
