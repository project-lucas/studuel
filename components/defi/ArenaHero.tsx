'use client'

import Image from 'next/image'
import Link from 'next/link'
import { sfx } from '@/lib/sounds'
import type { Boss } from '@/lib/bosses'

interface ArenaHeroProps {
  /** Prénom affiché sous le podium — absent pour le visiteur (chip masqué). */
  name?: string | null
  /**
   * Le gardien DÉBUSQUÉ (La Traque) : sa silhouette se pose sur l'île, derrière
   * le personnage, et la lumière du sol vire à l'écarlate. Null quand aucun
   * boss n'est sorti — l'île retrouve son calme d'elle-même.
   */
  boss?: Boss | null
}

/**
 * La scène du héros de l'arène. Elle ne DESSINE plus de personnage : depuis le
 * 02/08/2026, le décor de /defi est une illustration qui porte déjà sa mascotte
 * sur son podium (voir lib/arena-background). Ce composant ne garde donc que ce
 * que l'image ne peut pas faire :
 *
 *   · la PORTE du vestiaire, posée sur le podium peint (un tap → /moi/avatar) ;
 *   · le PRÉNOM du joueur, sous le podium — niveau et XP vivent uniquement dans
 *     le ProfileChip du HUD, jamais en double ici ;
 *   · le gardien de La Traque, qui surgit en surimpression quand il est
 *     débusqué ;
 *   · les étincelles d'or qui dérivent sur la scène.
 *
 * Le personnage dessiné (perso-1) et son socle de marbre SVG vivaient ici : ils
 * doublaient la mascotte peinte, deux personnages sur deux podiums.
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

      {/* Le halo doré qui rétro-éclairait le personnage a été retiré avec lui :
          la nouvelle illustration peint déjà sa propre lumière derrière la
          mascotte, et deux halos superposés ne faisaient que laver la scène. */}

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

      {/* LA ZONE DU PODIUM. Le personnage du joueur (perso-1) et son socle de
          marbre étaient DESSINÉS ici, par-dessus le décor. La nouvelle
          illustration de l'arène porte sa propre mascotte sur son propre
          podium : les garder faisait deux personnages sur deux podiums.

          Ne reste donc que ce que l'image ne peut pas faire — la PORTE. Le
          podium peint mène au vestiaire, comme le personnage avant lui : c'est
          la boucle collection → fierté → duel, et la perdre aurait coûté la
          seule entrée visible du vestiaire depuis l'arène. La zone est
          invisible mais réelle : elle garde sa taille, son libellé et son
          anneau de focus au clavier. */}
      <Link
        href="/moi/avatar"
        onClick={() => sfx.tap()}
        aria-label="Ton personnage — ouvrir le vestiaire"
        className="olympe-press relative z-[2] block h-[150px] w-[150px] cursor-pointer rounded-full focus-visible:ring-4 focus-visible:ring-highlight/60 focus-visible:outline-none"
      />

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
