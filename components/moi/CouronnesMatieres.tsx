import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import CouronneArt from '@/components/moi/CouronneArt'
import { cn } from '@/lib/utils'
import {
  COURONNE_NOMS,
  type BilanCouronnes,
  type Couronne,
} from '@/lib/moi/couronnes'

// -----------------------------------------------------------------------------
// MES COURONNES — le détail matière par matière, et le seul endroit de l'app où
// l'élève voit TOUTES ses matières côte à côte.
//
// Ce qu'il remplace : « Reprends Anglais », une bande qui désignait UNE matière
// et poussait à l'ouvrir. Elle répondait à « par quoi je commence ? » — une
// question que l'arène, Marcel et Réviser posent déjà chacun à leur manière.
// L'onglet du profil doit répondre à l'autre question, celle que personne ne
// posait : « qu'est-ce que j'ai accompli ? »
//
// UNE LIGNE PAR MATIÈRE, ET LA COURONNE EN TÊTE DE LIGNE. Le métal se lit avant
// le nom, avant le chiffre : c'est un tableau de trophées, pas un bulletin. Les
// matières sont rangées du métal le plus haut au plus bas (lib/moi/couronnes),
// si bien que le haut de la liste est toujours une fierté et le bas toujours un
// chantier — dans cet ordre, jamais l'inverse.
//
// IL N'OUVRE PLUS RIEN LUI-MÊME : IL EST CE QUI S'OUVRE. Ce bloc a d'abord été
// une carte blanche pleine largeur sous la carte de joueur, avec son titre, son
// compteur et son chevron — c'est-à-dire une barre entière dont le seul travail
// était de dire « les couronnes sont ici », trois centimètres sous une rangée de
// couronnes. La poignée est passée à la rangée elle-même
// (`components/moi/CouronnesRangee`, ⋮ au bout de l'étagère) ; ce qui reste ici
// est le contenu du tiroir, rendu à l'intérieur de la carte de joueur.
//
// Le titre et le compteur SURVIVENT à l'intérieur du tiroir : une liste qui
// s'ouvre doit se nommer une fois, et « 2 sur 11 matières » est la seule mesure
// d'ensemble de l'écran — la rangée, elle, montre des cases sans les compter.
//
// LA BARRE PORTE LE MÊME POURCENTAGE QUE LA COURONNE. Pas celui de Réviser
// (qui mesure les chapitres COMMENCÉS) : deux barres au même endroit avec deux
// définitions se contrediraient à la première visite. Le sous-titre le dit en
// clair — « 11 chapitres acquis sur 15 » — pour qu'aucun élève n'ait à deviner.
// -----------------------------------------------------------------------------

function LigneMatiere({ couronne }: { couronne: Couronne }) {
  const { tier, pct, acquis, total, subjectName, subjectSlug, prochain } = couronne
  const gagnee = tier !== 'aucune'

  return (
    <li>
      <Link
        href={`/reviser/${subjectSlug}`}
        className="moi-couronne-ligne flex items-center gap-3 px-3 py-2.5 transition-colors"
      >
        {/* La couronne, ou son emplacement vide. Un cercle pointillé plutôt
            qu'un blanc : la place existe déjà, elle attend. */}
        <span
          className={cn(
            'flex size-11 shrink-0 items-center justify-center rounded-full',
            gagnee
              ? 'bg-white shadow-sm ring-1 ring-black/5'
              : 'border-2 border-dashed border-primary/25',
          )}
        >
          <CouronneArt
            tier={tier}
            className={cn('w-7', gagnee ? 'drop-shadow-sm' : 'opacity-35')}
          />
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex items-baseline justify-between gap-2">
            <span className="font-heading truncate text-[15px] leading-tight font-extrabold text-foreground">
              {subjectName}
            </span>
            <span
              className={cn(
                'shrink-0 text-[11px] font-extrabold tabular-nums',
                gagnee ? 'text-foreground' : 'text-muted-foreground',
              )}
            >
              {pct} %
            </span>
          </span>

          <span
            aria-hidden="true"
            className="moi-track mt-1.5 block h-2 overflow-hidden rounded-full"
          >
            <span
              className={cn(
                'block h-full rounded-full',
                gagnee ? 'moi-couronne-jauge' : 'bg-primary/35',
              )}
              style={{ width: `${Math.max(pct, 2)}%` }}
            />
          </span>

          <span className="mt-1 block truncate text-[11px] font-semibold text-muted-foreground">
            {acquis} chapitre{acquis > 1 ? 's' : ''} acquis sur {total}
            {prochain
              ? ` · encore ${prochain.chapitres} pour ${COURONNE_NOMS[prochain.tier].toLowerCase()}`
              : ' · programme terminé'}
          </span>
        </span>

        <ChevronRight
          className="size-4 shrink-0 text-muted-foreground"
          aria-hidden="true"
        />
      </Link>
    </li>
  )
}

export default function CouronnesMatieres({
  liste,
  bilan,
}: {
  liste: readonly Couronne[]
  bilan: BilanCouronnes
}) {
  if (liste.length === 0) return null

  return (
    <section
      aria-label="Mes couronnes, matière par matière"
      // Blanc sur le violet de la carte, sans le liseré `.moi-card` : ce n'est
      // pas une carte de plus dans la pile de l'onglet, c'est un tiroir ouvert
      // à l'intérieur d'une carte qui a déjà son bord.
      className="overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-black/5"
    >
      <div className="flex items-baseline gap-3 px-4 py-3">
        <h2 className="font-heading text-base leading-tight font-extrabold text-foreground">
          Mes couronnes
        </h2>
        <span className="ml-auto text-xs font-extrabold text-muted-foreground tabular-nums">
          {bilan.gagnees} sur {bilan.matieres} matière
          {bilan.matieres > 1 ? 's' : ''}
        </span>
      </div>

      <ul role="list" className="divide-y divide-border border-t border-border">
        {liste.map((c) => (
          <LigneMatiere key={c.subjectId} couronne={c} />
        ))}
      </ul>
    </section>
  )
}
