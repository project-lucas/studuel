'use client'

import type { CSSProperties } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star } from 'lucide-react'
import { sfx } from '@/lib/sounds'
import { formatRecord } from '@/lib/jeux/records'
import { TOTAL_STARS } from '@/lib/jeux/paliers'
import type { ModeTicket as Ticket } from '@/lib/defi/modes-catalog'
import { cn } from '@/lib/utils'
import styles from './ModeTicket.module.css'

/** La taille du titre : il tient sur une ligne, et se resserre s'il est long. */
function tailleTitre(nom: string, grand: boolean): string | undefined {
  const n = nom.trim().length
  if (n <= 16) return undefined
  const base = grand ? 5.8 : 5.3
  return `${Math.max(3.9, Math.round(((base * 16) / n) * 10) / 10)}cqw`
}

/**
 * UN BILLET DE MODE — la carte « Modes de jeu » de Clash Royale, relevée au
 * pixel (ModeTicket.module.css) : un corps à gauche (titre cartoon, compteur,
 * pastille de règle, scène qui se fond dans la robe), une perforation, et un
 * talon crénelé à droite qui porte l'objet du mode. Une teinte par billet.
 *
 * Le même billet sert à la feuille « Modes de jeu » de l'arène et à l'onglet
 * « Mode de jeu » de chaque matière : une robe, un format, un fichier.
 *
 * Trois états, comme là-bas :
 *   · ouvert — lien vers la carte du jeu (ou la salle du mode) ;
 *   · verrouillé — réservé à Studuel+ : robe assombrie et quadrillée, nom au centre,
 *     condition en or, cadenas au talon, lien vers la Boutique ;
 *   · « Bientôt » — pas de lien, en retrait.
 */
export default function ModeTicket({
  ticket,
  record = null,
  place = null,
  etoiles = null,
  format,
}: {
  ticket: Ticket
  /** Ma place de la semaine (« 7e sur 41 »), null quand il n'y en a pas. */
  place?: string | null
  /**
   * Record personnel à afficher (0 = pas encore de record). `null` quand ce
   * défi n'en garde pas, ou tant que le navigateur n'a pas parlé.
   */
  record?: number | null
  /** Étoiles décrochées sur le jeu (sur 15), null si ce n'est pas un jeu à paliers. */
  etoiles?: number | null
  /** Grand billet (mode du jour) ou compact. Par défaut : grand en vedette. */
  format?: 'grand' | 'compact'
}) {
  const grand = (format ?? (ticket.vedette ? 'grand' : 'compact')) === 'grand'
  const verrou = ticket.verrou === true
  const bientot = !ticket.href
  const teinte = ticket.teinte
  const style = { '--taille': tailleTitre(ticket.name, grand) } as CSSProperties

  const talon = verrou ? (
    <span className={styles.emoji} aria-hidden="true">
      🔒
    </span>
  ) : ticket.image ? (
    <span className={styles.art} aria-hidden="true">
      <Image src={ticket.image} alt="" fill sizes="96px" className="object-contain" />
    </span>
  ) : (
    <span className={styles.emoji} aria-hidden="true">
      {ticket.emoji}
    </span>
  )

  const corps = verrou ? (
    <span className={styles.verrouTexte}>
      <span className={cn(styles.encre, styles.verrouNom, 'font-heading font-extrabold')}>
        {ticket.name}
      </span>
      <span className={cn(styles.encre, styles.verrouCondition, 'font-heading font-extrabold')}>
        Débloqué avec Studuel+
      </span>
    </span>
  ) : (
    <>
      {ticket.scene ? (
        <span className={styles.scene} aria-hidden="true">
          <Image
            src={ticket.scene}
            alt=""
            fill
            sizes="(max-width: 448px) 70vw, 300px"
            className="object-cover object-[70%_45%]"
          />
        </span>
      ) : ticket.vignette ? (
        <span className={styles.vignette} aria-hidden="true">
          <Image src={ticket.vignette} alt="" fill sizes="120px" className="object-contain" />
        </span>
      ) : null}

      <span className={cn(styles.encre, styles.titre, 'font-heading font-extrabold')} style={style}>
        {ticket.name}
      </span>

      <Compteur etoiles={etoiles} record={record} />

      {place || ticket.chip ? (
        <span className={cn(styles.pastille, 'font-heading font-extrabold')}>
          <span className={styles.pastilleIcone} aria-hidden="true">
            {place ? '🏅' : '⏱️'}
          </span>
          <span className={styles.encre}>{place ?? ticket.chip}</span>
        </span>
      ) : null}
    </>
  )

  const billet = (
    <span
      className={styles.billet}
      data-format={grand ? 'grand' : 'compact'}
      data-verrou={verrou ? '' : undefined}
      data-repli={!verrou && !ticket.scene ? '' : undefined}
    >
      <span className={styles.corps}>{corps}</span>
      <span className={styles.talon}>{talon}</span>
    </span>
  )

  const ruban = ticket.badge ? (
    <span
      className={cn(styles.ruban, styles.encre, 'font-heading font-extrabold')}
      data-ton={ticket.badge === 'Bientôt' ? 'muet' : ticket.vedette ? 'or' : undefined}
    >
      {ticket.badge}
    </span>
  ) : null

  const libelle = verrou
    ? `${ticket.name} — réservé à Studuel+, découvrir l’abonnement`
    : `${ticket.name} — ${ticket.tagline}${etoiles !== null ? ` — ${etoiles} étoiles sur ${TOTAL_STARS}` : ''}`

  return (
    <div
      className={cn(styles.cadre, bientot && 'opacity-60')}
      data-teinte={teinte}
      data-vedette={ticket.vedette ? '' : undefined}
    >
      {ruban}
      {ticket.href ? (
        <Link href={ticket.href} onClick={() => sfx.tap()} aria-label={libelle} className={styles.lien}>
          {billet}
        </Link>
      ) : (
        <div aria-label={`${ticket.name} — bientôt`} role="img">
          {billet}
        </div>
      )}
    </div>
  )
}

/**
 * Le compteur du billet — le « 🏆 9286 » du modèle : les étoiles d'un jeu à
 * paliers (sur 15), ou le record d'un mode qui se joue au score. Rien tant que
 * le navigateur n'a pas parlé, plutôt qu'un zéro faux.
 */
function Compteur({ etoiles, record }: { etoiles: number | null; record: number | null }) {
  if (etoiles !== null) {
    return (
      <span className={cn(styles.stat, 'font-heading font-extrabold tabular-nums')} aria-hidden="true">
        {/* L'étoile cartoon : jaune de la récompense, cernée comme le texte. */}
        <Star className={styles.etoile} strokeWidth={2.6} />
        <span className={cn(styles.encre, styles.nombre)}>
          {etoiles}
          <span className={styles.sur}>/{TOTAL_STARS}</span>
        </span>
      </span>
    )
  }
  if (record !== null && record > 0) {
    return (
      <span className={cn(styles.stat, 'font-heading font-extrabold tabular-nums')} aria-hidden="true">
        <span className="text-[1.15em] leading-none">🏅</span>
        <span className={cn(styles.encre, styles.nombre)}>{formatRecord(record)}</span>
      </span>
    )
  }
  return null
}
