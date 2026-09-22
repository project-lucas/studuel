'use client'

import Link from 'next/link'
import { Check, Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'
import { carteBilan, type MouvementTrophees } from '@/lib/jeux/bilan-carte'
import type { BilanPartie } from '@/lib/palmares/bilan'

/**
 * LA CARTE DU BILAN — une seule carte sous le score, à la place de trois blocs.
 *
 * Avant le 22/09/2026, l'écran de fin empilait la carte « Trophées » (le
 * mouvement, le total sur ce jeu, la prochaine victoire), la carte « Palmarès »
 * (le verdict, la place de la semaine, la prochaine marche) et la ligne
 * « Journée validée » : trois nouvelles à lire avant Rejouer, qui se
 * répétaient (« 1er de ta classe » PUIS « Tu mènes ta classe »). Ce que la
 * carte garde, et dans cet ordre, est décidé par lib/jeux/bilan-carte :
 *
 *   [🏅]  Premier score posé !                   [🏆 Rien perdu]
 *         1er de ta classe cette semaine
 *   ─────────────────────────────────────────────────────────
 *   Prochaine victoire +10                    ✓ Journée validée 🔥
 *
 * La « prochaine victoire » n'est pas une décoration : c'est en lisant « +10 »
 * ici et « +3 » sur son jeu habituel que l'élève arbitre tout seul, et va vers
 * la compétence qu'il n'a jamais travaillée. La perte ne prend JAMAIS la
 * couleur d'alerte : un trophée perdu n'est pas une erreur à corriger, et la
 * doctrine du Défi est de ne pas punir l'échec au point de faire fuir un
 * collégien.
 *
 * La carte entière mène au palmarès (/moi) dès que le bilan est là, comme la
 * carte « Palmarès » avant elle — sans chevron : à côté de la pastille, il
 * volait à la place de la semaine la largeur qui la gardait sur une ligne.
 * Sans trophées ni bilan (visiteur, serveur muet), il ne reste que la ligne
 * de la journée, à sa hauteur réservée pour que l'écran ne saute pas.
 */
export default function CarteBilan({
  trophies,
  bilan,
  saved,
}: {
  trophies?: MouvementTrophees | null
  bilan: BilanPartie | null
  saved: boolean | null
}) {
  const carte = carteBilan({ trophies, bilan, saved })

  if (!carte) {
    return (
      <p className="min-h-5 text-sm text-muted-foreground">
        {saved === true
          ? '✓ Journée validée — ta série continue 🔥'
          : saved === false
            ? 'Partie non enregistrée (connecte-toi pour garder ta progression).'
            : ''}
      </p>
    )
  }

  const gain = carte.pastille?.ton === 'gain'

  const corps = (
    <>
      <span className="flex items-center gap-2.5">
        <span
          aria-hidden="true"
          className="grid size-10 shrink-0 place-items-center rounded-xl bg-highlight/25 text-xl"
        >
          {carte.icone === 'palmares' ? '🏅' : '🏆'}
        </span>

        <span className="min-w-0 flex-1">
          <span className="block text-sm leading-tight font-extrabold">{carte.titre}</span>
          {carte.sousTitre ? (
            <span className="mt-0.5 block text-xs font-semibold text-muted-foreground">
              {carte.sousTitre}
            </span>
          ) : null}
          {carte.marche ? (
            <span className="block text-xs text-muted-foreground">{carte.marche}</span>
          ) : null}
        </span>

        {carte.pastille ? (
          <span
            className={cn(
              'flex shrink-0 items-center gap-1 rounded-full py-1 pr-2 pl-1.5 text-[11px] font-extrabold',
              carte.pastille.nombre && 'font-mono text-sm tabular-nums',
              gain ? 'bg-highlight/20 text-foreground' : 'bg-muted text-muted-foreground',
            )}
            aria-label={`Trophées : ${carte.pastille.texte}`}
          >
            <Trophy
              className={cn('size-4', gain && 'fill-highlight text-highlight')}
              aria-hidden="true"
            />
            {carte.pastille.texte}
          </span>
        ) : null}

      </span>

      {carte.prochaineVictoire !== null || carte.journee ? (
        <span className="mt-2.5 flex items-center justify-between gap-3 border-t border-border/70 pt-2.5 text-xs font-semibold text-muted-foreground">
          {carte.prochaineVictoire !== null ? (
            <span className="min-w-0 truncate">
              Prochaine victoire{' '}
              <strong className="font-mono text-sm font-extrabold text-foreground tabular-nums">
                +{carte.prochaineVictoire}
              </strong>
            </span>
          ) : null}
          {carte.journee === 'validee' ? (
            <span className="flex shrink-0 items-center gap-1">
              <Check className="size-3.5 text-success" strokeWidth={3.2} aria-hidden="true" />
              Journée validée <span aria-hidden="true">🔥</span>
            </span>
          ) : carte.journee === 'non-enregistree' ? (
            <span className="shrink-0">Partie non enregistrée</span>
          ) : null}
        </span>
      ) : null}
    </>
  )

  const coque = 'block w-full rounded-2xl bg-card px-4 py-3 text-left shadow-sm'

  if (carte.lien) {
    return (
      <Link href="/moi" className={cn(coque, 'transition active:scale-[0.99]')}>
        {corps}
        <span className="sr-only">Voir mon palmarès</span>
      </Link>
    )
  }

  return <div className={coque}>{corps}</div>
}
