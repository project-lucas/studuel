'use client'

import { Lock, Trophy } from 'lucide-react'
import RankBadge from '@/components/defi/RankBadge'
import { LOCKED_HINT, type SubjectLadder } from '@/lib/subject-rank'

/**
 * LA VITRINE DE RANG — tous les blasons de l'élève, matière par matière.
 *
 * L'arène montre UNE matière à la fois (celle qu'on s'apprête à jouer) ; il
 * fallait un endroit qui les montre TOUTES ensemble, sinon le cloisonnement
 * n'aurait produit aucune vue d'ensemble et l'élève n'aurait jamais vu sa
 * collection. La Boutique est cet endroit : c'est déjà l'onglet où l'on regarde
 * ce qu'on possède.
 *
 * Les matières verrouillées ne sont pas retirées mais assombries en silhouette.
 * Une grille pleine de trous serait décourageante ; une grille où l'on distingue
 * les cases à conquérir est une carte au trésor — et c'est exactement le rôle de
 * cet onglet.
 */
export default function RankShowcase({
  ladders,
}: {
  ladders: readonly SubjectLadder[]
}) {
  if (ladders.length === 0) return null

  const ouvertes = ladders.filter((l) => l.unlocked).length

  return (
    <section aria-label="Tes rangs par matière" className="w-full">
      <header className="mb-3 flex items-baseline justify-between gap-2">
        <h2 className="font-heading text-lg font-extrabold tracking-wide">
          Tes rangs
        </h2>
        <p className="text-xs font-medium text-muted-foreground">
          {ouvertes} matière{ouvertes > 1 ? 's' : ''} sur {ladders.length}
        </p>
      </header>

      <ul className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
        {ladders.map((ladder) => (
          <li
            key={ladder.slug}
            className={`flex flex-col items-center gap-1 rounded-2xl bg-card p-2.5 text-center shadow-sm ring-1 ring-black/5 ${
              ladder.unlocked ? '' : 'opacity-60'
            }`}
          >
            <span className={`relative ${ladder.unlocked ? '' : 'grayscale brightness-50'}`}>
              <RankBadge rank={ladder.rank} size={48} hideDivision={!ladder.unlocked} />
              {!ladder.unlocked ? (
                <Lock
                  className="absolute inset-0 m-auto size-5 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                  strokeWidth={3}
                  aria-hidden="true"
                />
              ) : null}
            </span>

            <span className="mt-1 line-clamp-1 text-[11px] leading-tight font-bold">
              {ladder.subject}
            </span>

            {ladder.unlocked ? (
              <>
                <span className="font-heading text-[10px] leading-none font-extrabold tracking-wide text-primary uppercase">
                  {ladder.rank.label}
                </span>
                <span
                  className="flex items-center gap-1 font-mono text-[10px] leading-none font-bold tabular-nums"
                  title={`Record : ${ladder.peakTrophies} trophées`}
                >
                  {ladder.trophies}
                  <Trophy className="size-2.5 text-highlight" aria-hidden="true" />
                </span>
              </>
            ) : (
              <span className="text-[9px] leading-tight font-semibold text-muted-foreground">
                {LOCKED_HINT}
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
