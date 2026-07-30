'use client'

import Image from 'next/image'
import Link from 'next/link'
import PersonnageAnime from '@/components/PersonnageAnime'
import { sfx } from '@/lib/sounds'
import type { Boss } from '@/lib/bosses'

interface ArenaHeroProps {
  /** Prénom gravé sur le socle — absent pour le visiteur (chip masqué). */
  name?: string | null
  /**
   * Le gardien DÉBUSQUÉ (La Traque) : sa silhouette se pose sur l'île, derrière
   * le personnage, et la lumière du sol vire à l'écarlate. Null quand aucun
   * boss n'est sorti — l'île retrouve son calme d'elle-même.
   */
  boss?: Boss | null
}

/**
 * La scène du héros de l'arène : le personnage du joueur debout sur un socle
 * de marbre au laurier d'or (le podium du roi de Clash Royale, version
 * colisée), le prénom incrusté dessous. Niveau et XP vivent UNIQUEMENT dans la
 * pastille du HUD (ProfileChip, haut-gauche) — le socle ne les duplique plus.
 * Le personnage ARRIVE en descendant dans le halo (`.arena-hero-figure`) puis
 * vit en idle via <PersonnageAnime> (respiration, étirement, inclinaison —
 * coupé par prefers-reduced-motion). Un tap mène au vestiaire — la boucle
 * collection → fierté → duel.
 */
export default function ArenaHero({ name, boss }: ArenaHeroProps) {
  return (
    <div className="relative flex flex-col items-center">
      {/* Étincelles d'or qui dérivent autour de la scène. */}
      <i className="arena-spark" style={{ left: '4%', top: '18%' }} />
      <i
        className="arena-spark"
        style={{
          left: '92%',
          top: '34%',
          width: 4,
          height: 4,
          ['--d' as string]: '8s',
          ['--dl' as string]: '1.2s',
        }}
      />
      <i
        className="arena-spark"
        style={{
          left: '12%',
          top: '58%',
          width: 4,
          height: 4,
          ['--d' as string]: '7s',
          ['--dl' as string]: '2.4s',
        }}
      />
      <i
        className="arena-spark"
        style={{ left: '84%', top: '8%', ['--d' as string]: '9s' }}
      />

      {/* Halo doré : le portail rétro-éclaire le personnage. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-[4%] left-1/2 size-48 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,219,128,0.55)_0%,rgba(255,219,128,0)_65%)]"
      />

      {/* LA TRAQUE — le gardien débusqué se pose sur l'île, derrière le
          personnage : plus grand que lui, décalé, la lumière du sol virant à
          l'écarlate. On ne lit pas une notification, on VOIT la menace. Le
          combat, lui, se lance depuis le message éclair (BossFlash) : cette
          silhouette est du décor, pas un bouton — deux cibles tactiles
          superposées sur le podium se disputeraient le pouce. */}
      {boss ? (
        <>
          <span
            aria-hidden="true"
            className="arena-boss-glow pointer-events-none absolute bottom-[14%] left-1/2 size-52 -translate-x-1/2 rounded-full"
          />
          <span
            aria-hidden="true"
            className="arena-boss-loom pointer-events-none absolute -top-[14%] right-[-6%] z-[1] block w-[132px]"
          >
            {boss.image ? (
              <Image
                src={boss.image}
                alt=""
                width={132}
                height={132}
                className="w-full object-contain object-bottom"
              />
            ) : (
              <span className="block text-center text-6xl">{boss.emoji}</span>
            )}
          </span>
        </>
      ) : null}

      <Link
        href="/moi/avatar"
        onClick={() => sfx.tap()}
        aria-label="Ton personnage — ouvrir le vestiaire"
        className="olympe-press relative z-[2] -mb-9 block w-[138px] cursor-pointer drop-shadow-[0_10px_14px_rgba(46,27,84,0.45)] focus-visible:ring-4 focus-visible:ring-highlight/60 focus-visible:outline-none"
      >
        <span className="arena-hero-figure block">
          <PersonnageAnime src="/images/personnage%20user/perso-1.webp" alt="" />
        </span>
      </Link>

      {/* Le socle de marbre au laurier d'or — dessiné par l'UI, aucun asset. */}
      <div className="relative z-[1] w-[190px]" aria-hidden="true">
        <svg viewBox="0 0 180 74" fill="none" className="block w-full">
          {/* flanc du socle */}
          <path
            d="M6 30v16c0 14.4 37.6 26 84 26s84-11.6 84-26V30"
            fill="url(#arenaSocleSide)"
          />
          {/* liseré or du flanc */}
          <path
            d="M8 42c10 11 43.6 19 82 19s72-8 82-19"
            stroke="#d8a93c"
            strokeWidth="2.5"
            opacity=".9"
          />
          {/* plateau */}
          <ellipse cx="90" cy="30" rx="84" ry="25" fill="url(#arenaSocleTop)" />
          <ellipse
            cx="90"
            cy="30"
            rx="84"
            ry="25"
            stroke="#d8a93c"
            strokeWidth="2"
          />
          {/* anneau de laurier gravé */}
          <ellipse
            cx="90"
            cy="30"
            rx="56"
            ry="16"
            stroke="#c9962a"
            strokeWidth="3"
            strokeDasharray="7 5"
            opacity=".75"
          />
          {/* ombre du personnage */}
          <ellipse cx="90" cy="27" rx="36" ry="8.5" fill="rgba(74,37,151,.24)" />
          <defs>
            <linearGradient
              id="arenaSocleTop"
              x1="0"
              y1="6"
              x2="0"
              y2="55"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#fdf8ea" />
              <stop offset="1" stopColor="#e3d7b8" />
            </linearGradient>
            <linearGradient
              id="arenaSocleSide"
              x1="0"
              y1="30"
              x2="0"
              y2="72"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#cbb98d" />
              <stop offset="1" stopColor="#96825a" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* L'identité vit SUR le socle : le prénom seul (niveau + XP dans le
          ProfileChip du HUD, jamais en double ici). */}
      {name ? (
        <p
          className="relative z-[3] -mt-4 inline-flex items-center gap-1.5 rounded-full border-[1.5px] border-highlight/80 bg-foreground px-3 py-1 shadow-[0_4px_12px_rgba(23,16,48,0.5)]"
          aria-label={name}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            className="shrink-0 fill-highlight"
            aria-hidden="true"
          >
            <path d="M12 2l2.4 7.2H22l-6 4.6 2.3 7.2-6.3-4.4-6.3 4.4L8 13.8 2 9.2h7.6z" />
          </svg>
          <span className="font-heading text-[0.65rem] font-extrabold text-white">
            {name}
          </span>
        </p>
      ) : null}
    </div>
  )
}
