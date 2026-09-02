'use client'

import Link from 'next/link'
import { sfx } from '@/lib/sounds'

/**
 * La scène du héros de l'arène. Elle ne DESSINE plus de personnage : depuis le
 * 02/08/2026, le décor de /defi est une illustration qui porte déjà sa mascotte
 * sur son podium (voir lib/arena-background). Ce composant ne garde donc que ce
 * que l'image ne peut pas faire :
 *
 *   · la PORTE du vestiaire, posée sur le podium peint (un tap → /moi/avatar) ;
 *   · les étincelles d'or qui dérivent sur la scène.
 *
 * Le personnage dessiné (perso-1) et son socle de marbre SVG vivaient ici : ils
 * doublaient la mascotte peinte, deux personnages sur deux podiums.
 *
 * ⚠️ LE GARDIEN DÉBUSQUÉ N'Y SURGIT PLUS (01/09, à la demande). Sa silhouette
 * se posait derrière la mascotte, plus grande qu'elle, avec un halo écarlate au
 * sol : deux personnages sur une île qui n'en contient qu'un, et le gardien
 * mordait sur le podium — c'est-à-dire sur la porte du vestiaire.
 *
 * L'APPEL AU COMBAT NE DISPARAÎT PAS : il vit dans la bannière du bas
 * (`BossFlash`), qui est le seul des deux à être CLIQUABLE. La silhouette était
 * du décor — elle disait la menace, la bannière la nomme et l'ouvre.
 */
export default function ArenaHero() {
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

      {/* PLUS DE PASTILLE DE PRÉNOM SUR LE SOCLE.
          Elle disait « Lucas » à quelqu'un qui sait comment il s'appelle, juste
          sous un personnage qu'il a lui-même habillé — et elle se posait entre
          le socle et la barre d'action, dans le seul couloir vertical que
          l'écran gardait libre. Le prénom vit dans le ProfileChip du HUD, en
          haut, où il sert à identifier le COMPTE. */}
    </div>
  )
}
