'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Decouverte } from '@/lib/decouverte/catalogue'
import s from './FeteNiveau.module.css'

/**
 * LA SECTION « DÉBLOQUÉ » DE LA FÊTE DE NIVEAU (25/10/2026, cadrage « le jeu
 * vivant » § B et § E) : ce que le niveau franchi ouvre, lu dans le catalogue
 * des découvertes (`decouvertesAuNiveau`). Une ligne par nouveauté — son
 * dessin (famille de la barre d'onglets, ou un éclat au trait), son nom, la
 * phrase de Marcel — et « Découvrir », qui mène à la page avec `?decouvrir=`
 * pour y lancer son mini-tour (chantier E). Rien à ouvrir : rien à l'écran.
 */
export default function Debloque({
  decouvertes,
  onDecouvrir,
}: {
  decouvertes: readonly Decouverte[]
  /** Au tap sur « Découvrir » : la fête se ferme et laisse la page s'ouvrir. */
  onDecouvrir: () => void
}) {
  if (decouvertes.length === 0) return null
  return (
    <section className={s.debloque} aria-labelledby="fete-debloque">
      <h3 id="fete-debloque" className={s.debloqueTitre}>
        <Sparkles className="size-4" strokeWidth={2.6} aria-hidden="true" />
        Débloqué
        <Sparkles className="size-4" strokeWidth={2.6} aria-hidden="true" />
      </h3>
      <ul className={s.lignes}>
        {decouvertes.map((d, i) => (
          <li key={d.cle} className={s.ligne} style={{ animationDelay: `${1700 + i * 130}ms` }}>
            <span className={s.dessin} aria-hidden="true">
              {d.dessin ? (
                <Image src={d.dessin} alt="" width={96} height={96} unoptimized className="size-9 object-contain" />
              ) : (
                <Sparkles className="size-5 text-primary" strokeWidth={2.4} />
              )}
            </span>
            <span className={s.ligneTexte}>
              <span className={s.ligneNom}>{d.nom}</span>
              <span className={s.lignePhrase}>{d.phrase}</span>
            </span>
            <Button asChild size="sm" className="shrink-0">
              <Link href={`${d.href}?decouvrir=${d.cle}`} onClick={onDecouvrir}>
                Découvrir
              </Link>
            </Button>
          </li>
        ))}
      </ul>
    </section>
  )
}
