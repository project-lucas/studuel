import { Info, Lightbulb } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Citation } from '@/lib/encyclopedie/types'
import TexteRiche from './TexteRiche'
import styles from './Encyclopedie.module.css'

// UNE CITATION, traitée comme une PLAQUE et non comme un paragraphe en
// italique perdu dans le texte.
//
// C'est le cœur de l'encyclopédie : une phrase se retient mieux qu'une date de
// naissance, se recopie en copie, et donne une prise sur quelqu'un dont on ne
// savait rien trente secondes plus tôt. Elle a donc droit au plus gros corps
// de la fiche, au Baloo des titres, et à son guillemet géant en fond.
//
// TROIS LIGNES SOUS LA PHRASE, et chacune a sa raison :
//   · QUI l'a dite — sur un événement, une phrase anonyme n'apprend rien ;
//   · OÙ ET QUAND (`contexte`) — une phrase sans sa situation se cite de
//     travers, et c'est la situation qui la rend mémorable ;
//   · CE QUE ÇA VEUT DIRE (`sens`) — beaucoup sont en vieux français, traduites
//     du latin, ou tendues par un enjeu que l'élève ne peut pas deviner.
//
// Et quand la phrase n'est que PRÊTÉE (« Qu'ils mangent de la brioche »), la
// carte le dit. Faire répéter à un élève une phrase inventée en la donnant
// pour vraie, c'est lui apprendre une faute.
export default function CarteCitation({
  citation,
  principale = false,
}: {
  citation: Citation
  /** La citation phare de la fiche : plus grande, avec le guillemet en fond. */
  principale?: boolean
}) {
  return (
    <figure
      className={cn(
        styles.citation,
        principale ? 'px-5 py-5' : 'px-4 py-3.5',
      )}
    >
      {principale ? (
        <span className={styles.guillemet} aria-hidden="true">
          “
        </span>
      ) : null}
      <div className="relative">
        <blockquote
          className={cn(
            styles.citationTexte,
            'font-heading font-extrabold text-foreground',
            principale ? 'text-xl leading-snug' : 'text-base leading-snug',
          )}
        >
          «&nbsp;{citation.texte}&nbsp;»
        </blockquote>

        <figcaption className="mt-2">
          {citation.qui ? (
            <p className="text-sm font-bold text-foreground/85">
              <TexteRiche texte={citation.qui} />
            </p>
          ) : null}
          {citation.contexte ? (
            <p className="text-xs leading-snug text-muted-foreground italic">
              <TexteRiche texte={citation.contexte} />
            </p>
          ) : null}
        </figcaption>

        {citation.sens ? (
          <p className="mt-2.5 flex gap-2 rounded-xl bg-background/70 px-3 py-2 text-[0.8rem] leading-snug text-foreground/90">
            <Lightbulb
              className="mt-0.5 size-4 shrink-0 text-highlight"
              aria-hidden="true"
            />
            <span>
              <span className="font-bold">Ce que ça veut dire&nbsp;: </span>
              <TexteRiche texte={citation.sens} />
            </span>
          </p>
        ) : null}

        {citation.incertaine ? (
          <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-[0.7rem] font-semibold text-muted-foreground">
            <Info className="size-3.5" aria-hidden="true" />
            Phrase qu’on lui prête — elle n’est pas attestée.
          </p>
        ) : null}
      </div>
    </figure>
  )
}
