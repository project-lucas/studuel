import type { Document } from '@/lib/exercices/types'
import { cn } from '@/lib/utils'
import { Inline, type ZonesDoc } from './commun'
import { Carte } from './documents/Carte'
import { Circuit } from './documents/Circuit'
import { Chaine } from './documents/Chaine'
import { Droite } from './documents/Droite'
import { Fiche } from './documents/Fiche'
import { Figure } from './documents/Figure'
import { Frise } from './documents/Frise'
import { Graphique } from './documents/Graphique'
import { Horloge, Solide } from './documents/Objets'
import { Schema } from './documents/Schema'
import { Scratch } from './documents/Scratch'
import { Tableau } from './documents/Tableau'
import { Dialogue, Texte } from './documents/Texte'
import s from './manuel.module.css'

/** Le corps d'un document, sans son cadre. */
export function CorpsDocument({ doc, zones, portee }: { doc: Document; zones?: ZonesDoc; portee?: number[] }) {
  switch (doc.type) {
    case 'texte':
      return <Texte doc={doc} zones={zones} portee={portee} />
    case 'dialogue':
      return <Dialogue doc={doc} zones={zones} />
    case 'tableau':
      return <Tableau doc={doc} zones={zones} />
    case 'graphique':
      return <Graphique doc={doc} zones={zones} />
    case 'carte':
      return <Carte doc={doc} zones={zones} />
    case 'frise':
      return <Frise doc={doc} zones={zones} />
    case 'figure':
      return <Figure doc={doc} zones={zones} />
    case 'droite':
      return <Droite doc={doc} zones={zones} />
    case 'schema':
      return <Schema doc={doc} zones={zones} />
    case 'chaine':
      return <Chaine doc={doc} zones={zones} />
    case 'fiche':
      return <Fiche doc={doc} zones={zones} />
    case 'scratch':
      return <Scratch doc={doc} zones={zones} />
    case 'circuit':
      return <Circuit doc={doc} zones={zones} />
    case 'horloge':
      return <Horloge doc={doc} />
    case 'solide':
      return <Solide doc={doc} />
  }
}

/**
 * LE DOCUMENT DANS SON CADRE — l'onglet « Doc 1 », le titre, le document, la
 * source en italique. C'est la signature visuelle du manuel.
 */
export default function DocumentVue({
  doc,
  numero,
  zones,
  portee,
  compact = false,
  id,
}: {
  doc: Document
  numero: number
  zones?: ZonesDoc
  portee?: number[]
  /** Dans une question : le cadre sans ombre, pour ne pas empiler les cartes. */
  compact?: boolean
  id?: string
}) {
  // Les fiches « authentiques » ont leur propre dessin : pas de marge de papier en plus.
  const plein = doc.type === 'fiche'
  return (
    <section id={id} className={cn(s.doc, compact && '!shadow-[0_0_0_1.5px_var(--papier-trait)]')} aria-label={`Document ${numero}${doc.titre ? ` : ${doc.titre}` : ''}`}>
      <header className={s.docTete}>
        <span className={s.docOnglet}>Doc {numero}</span>
        {doc.titre ? (
          <span className={s.docTitre}>
            <Inline texte={doc.titre} />
          </span>
        ) : null}
      </header>
      <div className={cn(s.docCorps, plein && 'bg-[color-mix(in_oklch,var(--papier-trait),white_70%)] py-4')}>
        <CorpsDocument doc={doc} zones={zones} portee={portee} />
      </div>
      {doc.source ? <p className={s.docSource}>{doc.source}</p> : null}
    </section>
  )
}
