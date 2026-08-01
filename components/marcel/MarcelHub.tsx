import Link from 'next/link'
import { BarChart3, GraduationCap, Mic, Timer } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import {
  MARCEL_ENTREES,
  vueHref,
  type MarcelVueSecondaire,
} from '@/lib/coach/marcel-vues'

// LE HUB — les quatre autres métiers de Marcel, en tuiles.
//
// Remplace la barre de cinq filtres (cf. lib/coach/marcel-vues pour le pourquoi).
// Trois choses font le travail que les segments ne faisaient pas :
//
// 1. UNE ICÔNE par entrée. La barre distinguait l'onglet actif à la seule
//    couleur — cinq rectangles de même forme. Une icône se reconnaît sans lire.
// 2. UNE LIGNE D'EXPLICATION sous chaque mot. « Méthode » ne dit rien ;
//    « comment on travaille chaque matière » se comprend du premier coup.
// 3. UN CHIFFRE quand il en existe un (matières prêtes, % du programme). Il
//    répond à la seule question qui compte devant une tuile : est-ce que j'ai
//    quelque chose à y faire ? Le hub n'en fabrique aucun — ils sont déjà
//    calculés par le snapshot de la page, donc gratuits.
//
// Composant serveur : ce sont des liens, il n'y a rien à embarquer côté client.

const ICONE: Record<MarcelVueSecondaire, LucideIcon> = {
  methode: GraduationCap,
  oral: Mic,
  entrainement: Timer,
  progres: BarChart3,
}

export default function MarcelHub({
  matiere,
  stats,
}: {
  /** Matière courante, emportée vers les vues qui en dépendent. */
  matiere?: string | null
  /**
   * Le repère chiffré de chaque tuile, quand il existe — laisser vide plutôt
   * que d'inventer. « L'oral » n'en a pas : son état demande deux requêtes de
   * plus, que l'écran d'accueil n'a aucune raison de payer.
   */
  stats?: Partial<Record<MarcelVueSecondaire, string>>
}) {
  return (
    <section className="mt-4">
      <h2 className="font-heading mx-0.5 mb-2 text-[15px] font-extrabold">
        Ce que je peux faire d’autre
      </h2>

      <ul className="grid grid-cols-2 gap-3">
        {MARCEL_ENTREES.map(({ key, label, hint }) => {
          const Icone = ICONE[key]
          const stat = stats?.[key]

          return (
            <li key={key}>
              <Link
                href={vueHref(key, matiere)}
                className="bg-card flex h-full min-h-[124px] flex-col rounded-[20px] p-3.5 shadow-[0_2px_0_rgba(36,48,79,.06),0_14px_26px_-22px_rgba(36,48,79,.9)] transition-transform active:translate-y-0.5"
              >
                <span className="mb-2 flex items-start justify-between gap-2">
                  <span className="bg-primary/12 text-primary grid size-10 shrink-0 place-items-center rounded-2xl">
                    <Icone aria-hidden="true" className="size-5" strokeWidth={2.2} />
                  </span>
                  {/* Le chiffre est un repère, pas un titre : discret, et jamais
                      seul porteur du sens — la ligne d'explication reste là. */}
                  {stat ? (
                    <span className="bg-foreground/6 text-muted-foreground rounded-full px-2 py-0.5 text-[10.5px] font-extrabold">
                      {stat}
                    </span>
                  ) : null}
                </span>

                <b className="font-heading text-[15px] leading-tight font-extrabold">
                  {label}
                </b>
                <span className="text-muted-foreground mt-1 text-xs leading-snug font-semibold text-balance">
                  {hint}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
