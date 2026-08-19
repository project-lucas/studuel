'use client'

import { Trophy } from 'lucide-react'
import { rankFor, DIVISION_SPAN } from '@/lib/rank'
import RankBadge from '@/components/defi/RankBadge'

/**
 * La cartouche de rang du HUD, JUSTE SOUS la pastille de niveau, en haut à
 * GAUCHE : blason du palier + « BRONZE IV » + trophées dans la division sur une
 * barre de progression. L'unité est DITE (picto trophée + infobulle « trophées
 * gagnés en Classé ») et la barre est VIOLETTE — jamais confondue avec la
 * barre d'XP jaune du niveau.
 *
 * Elle vivait à droite, isolée au-dessus d'une grappe d'objets : le rang se
 * lisait comme une récompense de plus. Rangée sous le niveau, elle forme avec
 * lui la colonne d'IDENTITÉ du joueur (qui je suis, où j'en suis) — et gagne au
 * passage un cran de taille : c'est la porte du mode Classé, elle doit appeler.
 *
 * Verre de nuit comme le reste du HUD : la cartouche crème+or d'avant faisait
 * un QUATRIÈME matériau dans les 15 % hauts de l'écran (pastille crème, pilule
 * jaune pleine, disque crème, cartouche dorée) et le haut de l'arène se lisait
 * comme un patchwork. Ici c'est le BLASON qui porte la couleur du palier —
 * l'or reste l'encre des valeurs. Au sommet (Maître, pas de division), la barre
 * cède la place au total.
 *
 * ELLE N'EST PLUS CLIQUABLE. Elle ouvrait le « Match classé », supprimé le jour
 * où Classé et Duel ont fusionné dans le bouton COMBAT. Un rang est de toute
 * façon un ÉTAT, pas une action : le détail de ce total se lit maintenant dans
 * la Route des trophées, en bas à droite de la rangée de combat.
 */
export default function RankCard({ trophies }: { trophies: number }) {
  const rank = rankFor(trophies)
  const hasDivision = rank.ceiling !== null

  return (
    <div
      aria-label={`Ton rang : ${rank.label}, ${rank.inDivision} trophées sur ${DIVISION_SPAN} dans la division, ${trophies} au total`}
      title={`${trophies.toLocaleString('fr-FR')} trophées au total — la somme de tous tes jeux`}
      className="olympe-glass flex items-center gap-2 rounded-[16px] py-1.5 pr-3 pl-2"
    >
      <RankBadge
        rank={rank}
        size={38}
        hideDivision
        className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]"
      />
      <span className="flex flex-col">
        <span className="text-[0.62rem] leading-tight font-extrabold tracking-wider text-highlight uppercase">
          {rank.label}
        </span>
        <span className="font-heading flex items-center gap-1 text-base leading-tight font-extrabold text-[#faf6ef]">
          {hasDivision ? (
            <>
              {rank.inDivision}
              <span className="text-[0.65rem] text-white/65">
                / {DIVISION_SPAN}
              </span>
            </>
          ) : (
            trophies.toLocaleString('fr-FR')
          )}
          {/* L'unité, en picto du même jeu que le reste de l'app — l'emoji 🏆
              se rendait avec la palette du système, jamais celle du jeu. */}
          <Trophy
            className="size-3.5 shrink-0 text-highlight"
            strokeWidth={2.6}
            aria-hidden="true"
          />
        </span>
        {hasDivision ? (
          <span
            className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-black/40 ring-1 ring-white/12 ring-inset"
            aria-hidden="true"
          >
            {/* Violet (progression de RANG) — la barre jaune, elle, veut dire
                XP : deux compteurs, deux couleurs. Éclairci pour rester lisible
                dans la rainure sombre du verre. */}
            <span
              className="block h-full bg-[color-mix(in_oklch,var(--primary),white_30%)]"
              style={{ width: `${Math.round(rank.progress * 100)}%` }}
            />
          </span>
        ) : null}
      </span>
    </div>
  )
}
