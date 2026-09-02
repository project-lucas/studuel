import Link from 'next/link'
import { BarChart3, BookOpenCheck, GraduationCap, Mic, Timer } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  MARCEL_ENTREES,
  vueHref,
  type MarcelVueSecondaire,
} from '@/lib/coach/marcel-vues'

// CE QUE MARCEL SAIT FAIRE — le rail de cartes, juste sous le personnage.
//
// Il remplace la grille de quatre tuiles, qui remplaçait elle-même une barre de
// cinq filtres muets. Ce qui l'a fait bouger une fois de plus n'est pas la
// grille (elle marchait) mais sa PLACE : elle arrivait après deux pavés de
// texte, tout en bas d'un écran qu'il fallait faire défiler. Sur un rail posé
// sous la mascotte, les cartes répondent à la bulle qui vient d'être lue, et la
// carte coupée sur le bord droit dit qu'il y en a d'autres — un rail qui déborde
// s'attrape au doigt, une grille qui déborde ne se voit pas.
//
// Trois choses font le travail que les segments ne faisaient pas, et elles ne
// bougent pas :
//
// 1. UNE ICÔNE par entrée — une icône se reconnaît sans lire.
// 2. UNE LIGNE D'EXPLICATION sous chaque mot. « Méthode » ne dit rien ;
//    « comment on travaille chaque matière » se comprend du premier coup.
// 3. UN CHIFFRE quand il en existe un (durée de la séance, matières prêtes, %
//    du programme). Il répond à la seule question qui compte devant une carte :
//    est-ce que j'ai quelque chose à y faire ? Aucun n'est fabriqué ici — ils
//    sont déjà calculés par le snapshot de la page, donc gratuits.
//
// La PREMIÈRE carte est pleine (violet, encre claire) : c'est la mission du
// jour, la réponse par défaut. Les autres sont blanches. Une seule couleur
// d'icône partout, et c'est voulu : ce sont toutes des ACTIONS, et l'action est
// violette dans cette maison — cinq teintes inventées auraient fait croire à
// cinq natures différentes.
//
// Composant serveur : ce sont des liens, il n'y a rien à embarquer côté client.

const ICONE: Record<MarcelVueSecondaire, LucideIcon> = {
  mission: BookOpenCheck,
  methode: GraduationCap,
  oral: Mic,
  entrainement: Timer,
  progres: BarChart3,
}

export default function CoachSuggestions({
  matiere,
  stats,
}: {
  /** Matière courante, emportée vers les vues qui en dépendent. */
  matiere?: string | null
  /**
   * Le repère chiffré de chaque carte, quand il existe — laisser vide plutôt
   * que d'inventer. « L'oral » n'en a pas : son état demande deux requêtes de
   * plus, que l'écran d'accueil n'a aucune raison de payer.
   */
  stats?: Partial<Record<MarcelVueSecondaire, string>>
}) {
  return (
    <nav aria-label="Ce que Marcel peut faire" className="mt-4">
      {/* Le rail déborde des marges de la page (`-mx-4`) et les rend en
          rembourrage : la première carte reste alignée sur le texte, la
          dernière peut aller mourir au bord de l'écran. */}
      <ul className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {MARCEL_ENTREES.map(({ key, label, hint }, index) => {
          const Icone = ICONE[key]
          const stat = stats?.[key]
          const pleine = index === 0

          return (
            <li key={key} className="w-[62%] max-w-[224px] min-w-[172px] shrink-0 snap-start">
              <Link
                href={vueHref(key, matiere)}
                className={cn(
                  'flex h-full min-h-[132px] flex-col rounded-[22px] p-3.5 transition-transform active:translate-y-0.5',
                  pleine
                    ? 'from-primary bg-gradient-to-b to-[color-mix(in_oklch,var(--primary),black_16%)] text-white shadow-[0_4px_0_color-mix(in_oklch,var(--primary),black_34%),0_16px_26px_-20px_color-mix(in_oklch,var(--primary),black_20%)]'
                    : 'bg-card shadow-[0_2px_0_rgba(36,48,79,.06),0_14px_26px_-22px_rgba(36,48,79,.9)]',
                )}
              >
                <span className="mb-2 flex items-start justify-between gap-2">
                  <span
                    className={cn(
                      'grid size-10 shrink-0 place-items-center rounded-2xl',
                      pleine
                        ? 'bg-white/18 text-white'
                        : 'bg-primary/12 text-primary',
                    )}
                  >
                    <Icone aria-hidden="true" className="size-5" strokeWidth={2.2} />
                  </span>
                  {/* Le chiffre est un repère, pas un titre : discret, et jamais
                      seul porteur du sens — la ligne d'explication reste là. */}
                  {stat ? (
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 text-[10.5px] font-extrabold',
                        pleine
                          ? 'bg-white/20 text-white'
                          : 'bg-foreground/6 text-muted-foreground',
                      )}
                    >
                      {stat}
                    </span>
                  ) : null}
                </span>

                <b className="font-heading text-[15px] leading-tight font-extrabold text-balance">
                  {label}
                </b>
                <span
                  className={cn(
                    'mt-1 text-xs leading-snug font-semibold text-balance',
                    pleine ? 'text-white/80' : 'text-muted-foreground',
                  )}
                >
                  {hint}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
