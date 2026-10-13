'use client'

import Image, { type StaticImageData } from 'next/image'
import { Crown } from 'lucide-react'
import { sfx } from '@/lib/sounds'
import type { ClePorte, Porte } from '@/lib/subject-template'
import programmeImage from '@/public/images/supports/programme.webp'
import cahierImage from '@/public/images/supports/cahier.webp'
import jeuxImage from '@/public/images/defi/icones/modes-v4.webp'
import annalesImage from '@/public/images/defi/icones/historique-v3.webp'
import s from './BanniereMatiere.module.css'

/**
 * L'OBJET DE CHAQUE PORTE — de la famille de la barre d'onglets (cerne prune,
 * volumes brillants, violet · or · crème). Le dé des modes de jeu, que l'élève
 * connaît déjà ; le PROGRAMME et le CAHIER D'EXERCICES ont les leurs depuis
 * le 13/10/2026 (Lucas : « une meilleure illustration pour Programme », « une
 * illustration de cahier d'exercices ») — fabriqués par
 * scripts/supports-icones.mjs, clés `programme` et `cahier`. Le bloc-notes du
 * support « Exercice » reste à la tuile de chaque fiche, pas à la porte. Les
 * ANNALES empruntent l'horloge de l'historique de l'arène (les sujets déjà
 * tombés) en attendant leur dessin.
 *
 * Importés, pas désignés par leur chemin : l'import donne une adresse à
 * empreinte de contenu (cf. SupportChips).
 */
const IMAGES: Record<ClePorte, StaticImageData> = {
  programme: programmeImage,
  exercices: cahierImage,
  jeu: jeuxImage,
  annales: annalesImage,
}

export type PorteVue = Porte & {
  /** L'offre Studuel+ : la porte porte la couronne. */
  couronne?: boolean
  /** Une annonce posée sur la porte (« Boss disponible »), le temps de l'événement. */
  bulle?: string | null
}

/**
 * LE RAIL DE PORTES du dossier de matière (05/10/2026) : Programme · Cahier
 * d'exercices · Jeux · Annales, à la place de six pilules à plat.
 *
 * Ce sont des onglets (la page reste la même, le contenu change dessous), mais
 * dessinés comme les objets qu'ils ouvrent : c'est ce qui donne au dossier sa
 * couleur sans peindre de fond. La porte ouverte est une plaque lavande cerclée
 * de violet, son objet en sort ; les autres sont des cartes blanches. Rien sous
 * le nom (13/10/2026) : les comptes (« 30 fiches ») sont partis, l'objet et son
 * nom suffisent.
 *
 * LA PORTE RÉPOND AU DOIGT : `onIntention` part dès que le doigt se pose
 * (`pointerdown`), une centaine de millisecondes avant le clic — de quoi
 * commencer à lire le cahier pendant que le geste se termine.
 */
export default function PortesMatiere({
  portes,
  active,
  onChange,
  onIntention,
}: {
  portes: PorteVue[]
  active: ClePorte
  onChange: (key: ClePorte) => void
  onIntention?: (key: ClePorte) => void
}) {
  return (
    <nav aria-label="Les portes du dossier" className={s.rail}>
      {portes.map((porte) => {
        const ouverte = porte.key === active
        return (
          <button
            key={porte.key}
            type="button"
            aria-current={ouverte ? 'page' : undefined}
            onPointerDown={() => {
              if (!ouverte) onIntention?.(porte.key)
            }}
            onClick={() => {
              if (ouverte) return
              sfx.tap()
              onChange(porte.key)
            }}
            className={s.porte}
          >
            {porte.bulle ? (
              // Elle n'est pas annoncée deux fois au lecteur d'écran : l'écusson
              // de la bannière dit déjà que le gardien est sorti.
              <span aria-hidden="true" className={s.bulle}>
                {porte.bulle}
              </span>
            ) : null}
            {porte.couronne ? (
              <span aria-hidden="true" title="Studuel+" className={s.couronne}>
                <Crown className="size-3 fill-current" strokeWidth={2.5} />
              </span>
            ) : null}
            <Image
              src={IMAGES[porte.key]}
              alt=""
              aria-hidden="true"
              sizes="56px"
              // Quatre petites images en tête d'écran : chargées d'emblée.
              loading="eager"
              className={s.porteImage}
            />
            {/* Un nom peut tenir sur deux lignes (« Cahier d'exercices ») : la
                boîte du nom fait toujours deux lignes, pour que les objets
                restent à la même hauteur d'une porte à l'autre. */}
            <span className={s.porteNom}>{porte.label}</span>
            {porte.couronne ? <span className="sr-only"> (Studuel+)</span> : null}
          </button>
        )
      })}
    </nav>
  )
}
