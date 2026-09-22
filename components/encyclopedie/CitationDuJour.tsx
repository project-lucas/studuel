import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { hrefFiche } from '@/lib/encyclopedie/matieres'
import { datesDe, estEvenement, teinteDe, type Entree } from '@/lib/encyclopedie/types'
import TexteRiche from './TexteRiche'
import styles from './Encyclopedie.module.css'

// LA CITATION DU JOUR — la porte d'entrée de l'encyclopédie.
//
// Une liste de deux cent cinquante fiches ne donne envie à personne d'en
// ouvrir une : il faut une raison d'entrer. Une phrase par jour, en grand, avec
// qui l'a dite et dans quelles circonstances — c'est exactement ce que cette
// encyclopédie prétend valoir (une citation se retient mieux qu'une date), donc
// autant le montrer dès la première seconde.
//
// La même pour tout le monde, un jour durant : tirée de la clé du jour et non
// au hasard, sinon le serveur et le client n'afficheraient pas la même phrase
// et elle changerait sous les yeux de l'élève au chargement.
export default function CitationDuJour({
  entree,
  slug,
}: {
  entree: Entree
  slug: string
}) {
  const citation = entree.citations[0]
  if (!citation) return null
  const auteur = estEvenement(entree) ? (citation.qui ?? entree.nom) : entree.nom

  return (
    <section
      data-teinte={teinteDe(entree.periode)}
      className={cn(styles.citation, 'mb-4 px-5 py-4')}
      aria-labelledby="citation-du-jour"
    >
      <span className={styles.guillemet} aria-hidden="true">
        “
      </span>
      <div className="relative">
        <p
          id="citation-du-jour"
          className="text-[0.65rem] font-extrabold tracking-[0.14em] text-muted-foreground uppercase"
        >
          La citation du jour
        </p>
        <blockquote
          className={cn(
            styles.citationTexte,
            'font-heading mt-1.5 text-[1.05rem] leading-snug font-extrabold text-foreground',
          )}
        >
          «&nbsp;{citation.texte}&nbsp;»
        </blockquote>
        <p className="mt-1.5 text-sm font-bold text-foreground/80">
          {auteur}
          <span className="font-medium text-muted-foreground">
            {' '}
            · {datesDe(entree)}
          </span>
        </p>
        {citation.contexte ? (
          <p className="mt-0.5 text-xs leading-snug text-muted-foreground italic">
            <TexteRiche texte={citation.contexte} />
          </p>
        ) : null}
        <Link
          href={hrefFiche(slug, entree.id)}
          className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-transform active:scale-95"
        >
          {entree.emoji} Lire la fiche
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  )
}
