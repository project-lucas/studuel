'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ScrollText, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { GainDeNiveau } from '@/lib/niveau-recompenses'
import s from './FeteNiveau.module.css'

/**
 * LES RÉCOMPENSES DE LA FÊTE DE NIVEAU (29/10/2026, Lucas : « on ne voit pas
 * les récompenses du gain de niveau ») — remplace la section « Débloqué » du
 * 25/10. Une CARTE par gain, la recette des objets gagnés (plaque blanche à
 * liseré d'or, socle, elle jaillit) : l'écran ouvert, le cadre de la photo,
 * le nouveau titre (lib/niveau-recompenses). Une découverte garde son bouton
 * « Découvrir », qui ferme la fête et mène à la page avec son mini-tour.
 * Rien de gagné : rien à l'écran (le prochain coffre se lit dessous).
 */
const GENRE: Record<GainDeNiveau['type'], string> = {
  decouverte: 'Nouveau',
  cadre: 'Cadre photo',
  titre: 'Nouveau titre',
}

export default function RecompensesNiveau({
  gains,
  onDecouvrir,
}: {
  gains: readonly GainDeNiveau[]
  /** Au tap sur « Découvrir » : la fête se ferme et laisse la page s'ouvrir. */
  onDecouvrir: () => void
}) {
  if (gains.length === 0) return null
  return (
    <section className={s.recompenses} aria-labelledby="fete-recompenses">
      <h3 id="fete-recompenses" className={s.recompensesTitre}>
        <Sparkles className="size-4" strokeWidth={2.6} aria-hidden="true" />
        Récompenses
        <Sparkles className="size-4" strokeWidth={2.6} aria-hidden="true" />
      </h3>
      <ul className={s.cartesGain} data-seule={gains.length === 1 ? '' : undefined}>
        {gains.map((g, i) => (
          <li key={g.cle} className={s.carteGain} data-type={g.type} style={{ animationDelay: `${1650 + i * 140}ms` }}>
            <span className={s.carteGenre}>{GENRE[g.type]}</span>
            <span className={s.carteVisuel} aria-hidden="true">
              <Visuel gain={g} />
            </span>
            <span className={s.carteNom}>{g.nom}</span>
            {g.type === 'decouverte' ? (
              <Button asChild size="sm" className="mt-1 w-full">
                <Link href={g.href} onClick={onDecouvrir}>
                  Découvrir
                </Link>
              </Button>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  )
}

function Visuel({ gain }: { gain: GainDeNiveau }) {
  if (gain.type === 'titre') return <ScrollText className="size-8" strokeWidth={2.2} />
  const src = gain.type === 'decouverte' ? gain.dessin : gain.image
  if (!src) return <Sparkles className="size-7" strokeWidth={2.4} />
  return <Image src={src} alt="" width={128} height={128} unoptimized className={s.carteImage} />
}
