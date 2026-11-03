'use client'

import { Swords } from 'lucide-react'
import { Taniere } from '@/components/defi/BossSheet'
import { accorde } from '@/lib/bosses'
import { CLOCK_STEP_MS, useClock } from '@/lib/use-clock'
import type { TraqueCard } from '@/lib/traque'

/**
 * LA PORTE « BOSS » du dossier de matière (01/11/2026, Lucas : « rajouter un
 * 5e bouton, le bouton boss »).
 *
 * Ce qu'elle montre, en commun à tous les gardiens (Lucas, même jour : « c'est
 * ici que sera visible la progression et dans combien de temps le boss sera
 * disponible », « il faut savoir pourquoi on veut l'affronter », « je veux voir
 * pleinement l'illustration ») : L'AFFICHE de la Traque, la même que dans
 * l'arène — la scène du prof en pleine largeur, sans talon ; le bandeau
 * « Recherché » ; le temps qui reste (son jour, ou son heure une fois sorti) ;
 * la jauge ; les trois gestes qui la remplissent ; le gain en icônes,
 * l'XP et les gemmes en jeu, et le rang qu'il prend une fois vaincu.
 *
 * Le bouton « Défier » mène au VRAI combat de la Traque (`/defi/traque/<id>`),
 * celui qui verse les gemmes : la porte Jeux ouvrait jusqu'ici un combat à
 * part, sans gemmes, qui contredisait la règle « il ne se combat qu'une fois
 * débusqué ». Les gestes et « Réviser » ouvrent la porte Programme, sur place.
 *
 * Une matière sans gardien (les arts plastiques) n'a pas cette porte : c'est
 * `modesFor` qui en décide.
 */
export default function GardienMatiere({
  subject,
  card,
  versProgramme,
}: {
  subject: { slug: string; name: string }
  /** La carte de traque du gardien (lib/traque), `null` quand elle est illisible. */
  card: TraqueCard | null
  /** Ouvre la porte Programme : c'est là que la jauge se remplit. */
  versProgramme: () => void
}) {
  // Une horloge pour les comptes à rebours : le rendu serveur est figé.
  const now = useClock(CLOCK_STEP_MS)

  return (
    <section aria-labelledby="gardien-matiere" className="mt-4">
      <p className="text-sm font-semibold text-muted-foreground">La Traque</p>
      <h2 id="gardien-matiere" className="titre-section mt-0.5 flex items-center gap-2">
        <Swords className="size-5 shrink-0 text-primary" aria-hidden="true" />
        Le gardien · {subject.name}
      </h2>
      {card ? (
        <>
          {/* La règle, en une ligne : l'affiche dit le reste. */}
          <p className="mt-1 text-[0.8rem] leading-snug font-bold text-muted-foreground">
            Révise pour remplir sa jauge : à 100 %, {accorde(card.boss, 'il sort', 'elle sort')} de
            sa tanière et tu as{' '}
            <strong className="text-foreground">une heure</strong>{' '}
            pour {accorde(card.boss, 'le battre', 'la battre')}.
          </p>
          <div className="mt-3">
            <Taniere card={card} now={now} versProgramme={versProgramme} />
          </div>
        </>
      ) : (
        <p className="carte mt-3 p-4 text-sm font-semibold text-muted-foreground">
          Le gardien ne se laisse pas voir pour l’instant. Révise la matière : c’est en
          travaillant qu’on le débusque.
        </p>
      )}
    </section>
  )
}
