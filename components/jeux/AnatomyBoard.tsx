'use client'

import { useId, useState } from 'react'
import { cn } from '@/lib/utils'
import {
  PLANCHE_HAUTEUR,
  PLANCHE_LARGEUR,
  ZONES,
  isGoodPick,
  zoneAt,
  zoneLabel,
  type Organ,
  type ZonePlanche,
} from '@/lib/jeux/anatomie'
import { CORPS_D, FONDU_DEPUIS } from '@/lib/jeux/anatomie-planche'
import styles from './AnatomyBoard.module.css'

/** L'onde d'un tap tombé à côté de tout organe, là où il est tombé. */
type Onde = { x: number; y: number; cle: number }

/** Épaisseur du halo qui bat autour de la bonne réponse, à la correction. */
const HALO_PLEIN = 4.5
const HALO_TUBE_EN_PLUS = 5

/**
 * La planche d'anatomie : un corps de face, et dedans les organes DESSINÉS —
 * sans étiquette. C'est le schéma à légender du cours de SVT.
 *
 * On répond en touchant l'organe demandé. Aucune proposition à lire, donc
 * aucune possibilité d'éliminer les mauvaises réponses : il faut reconnaître
 * le foie à sa forme et à sa place. Et le geste est précis : la zone de clic
 * est le contour de l'organe, calculé par `zoneAt` sur les mêmes formes que
 * celles qu'on voit — les tests de lib/jeux/anatomie.test.ts mesurent ce que
 * le doigt peut atteindre.
 *
 * Tous les organes sont dans la même teinte : une couleur par organe (ou par
 * appareil) trahirait la réponse. À la correction seulement, la cible passe
 * en vert et l'organe touché à tort en corail, le reste s'efface.
 */
export default function AnatomyBoard({
  target,
  /** Zone touchée par l'élève, ou null tant qu'il n'a pas répondu. */
  picked,
  revealed,
  onPick,
}: {
  target: Organ
  picked: ZonePlanche | null
  revealed: boolean
  /** La zone touchée, ou null si le tap est tombé en dehors de tout organe. */
  onPick: (zone: ZonePlanche | null) => void
}) {
  const id = useId()
  const [onde, setOnde] = useState<Onde | null>(null)

  const handleClick = (event: React.MouseEvent<SVGSVGElement>) => {
    if (revealed) return
    // On convertit le clic écran en coordonnées du viewBox : le SVG est mis à
    // l'échelle par la mise en page, donc les pixels de la page ne veulent rien
    // dire ici. Le SVG garde les proportions du viewBox, la conversion est donc
    // la même sur les deux axes.
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * PLANCHE_LARGEUR
    const y = ((event.clientY - rect.top) / rect.height) * PLANCHE_HAUTEUR
    const zone = zoneAt(x, y)
    if (!zone) setOnde({ x, y, cle: Date.now() })
    onPick(zone)
  }

  const fonduId = `${id}-fondu`
  const masqueId = `${id}-masque`

  return (
    <div className="bg-card mx-auto w-full max-w-[360px] rounded-3xl p-2 shadow-sm ring-1 ring-[color:var(--jeu-accent)]/15">
      <svg
        viewBox={`0 0 ${PLANCHE_LARGEUR} ${PLANCHE_HAUTEUR}`}
        onClick={handleClick}
        // `group` et non `img` : la planche CONTIENT des zones activables.
        // `img` est un rôle feuille — un lecteur d'écran ignorerait tout ce
        // qu'il y a dedans, y compris les zones.
        role="group"
        aria-label={`Planche d’anatomie — trouve ${target.name}`}
        className={cn(styles.planche, !revealed && styles.cliquable)}
      >
        <defs>
          {/* Les cuisses s'estompent vers le bas : la planche s'arrête à
              mi-cuisse, comme celle du manuel, sans couper net. */}
          <linearGradient
            id={fonduId}
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1={FONDU_DEPUIS}
            x2="0"
            y2={PLANCHE_HAUTEUR}
          >
            <stop offset="0" stopColor="#fff" />
            <stop offset="1" stopColor="#000" />
          </linearGradient>
          <mask id={masqueId}>
            <rect width={PLANCHE_LARGEUR} height={PLANCHE_HAUTEUR} fill={`url(#${fonduId})`} />
          </mask>
        </defs>

        <g mask={`url(#${masqueId})`}>
          <path d={CORPS_D} className={styles.corps} />
        </g>

        {ZONES.map((zone, index) => {
          const isTarget = isGoodPick(target, zone)
          const isPicked = picked?.id === zone.id
          const etat = !revealed
            ? undefined
            : isTarget
              ? styles.cible
              : isPicked
                ? styles.ratee
                : styles.eteinte
          const tube = zone.forme.type === 'tube' ? zone.forme : null
          return (
            // Chaque zone est ATTEIGNABLE au clavier, sous un nom qui décrit sa
            // position et jamais son contenu (cf. `zoneLabel`) : la nommer
            // donnerait la réponse à qui tabule.
            <g
              key={zone.id}
              role="button"
              tabIndex={revealed ? -1 : 0}
              aria-label={zoneLabel(zone, index)}
              aria-disabled={revealed || undefined}
              onKeyDown={(event) => {
                if (revealed) return
                if (event.key !== 'Enter' && event.key !== ' ') return
                // Sinon la barre d'espace fait défiler la page sous le jeu.
                event.preventDefault()
                onPick(zone)
              }}
              className={cn(styles.zone, etat)}
            >
              {revealed && isTarget ? (
                <path
                  d={zone.forme.d}
                  className={styles.halo}
                  strokeWidth={tube ? tube.largeur + HALO_TUBE_EN_PLUS : HALO_PLEIN}
                />
              ) : null}
              {tube ? (
                <>
                  <path d={tube.d} className={styles.tubeFond} strokeWidth={tube.largeur + 1.6} />
                  <path d={tube.d} className={styles.tubeCorps} strokeWidth={tube.largeur} />
                </>
              ) : (
                <path d={zone.forme.d} className={styles.plein} />
              )}
              {zone.details?.map((d) => (
                <path key={d} d={d} className={styles.detail} />
              ))}
            </g>
          )
        })}

        {onde ? (
          <circle key={onde.cle} cx={onde.x} cy={onde.y} r={7} className={styles.onde} />
        ) : null}
      </svg>
    </div>
  )
}

/**
 * La carte de correction sous la planche : où était l'organe, ce qu'il fait,
 * et — si l'on s'est trompé — ce qu'on a touché à la place. C'est là que le
 * jeu enseigne au lieu de tester : un élève qui touche le pancréas en
 * cherchant l'estomac repart en sachant les deux.
 */
export function AnatomyCorrection({
  target,
  picked,
}: {
  target: Organ
  picked: ZonePlanche | null
}) {
  const good = isGoodPick(target, picked)
  // « le foie » ouvre une phrase : il lui faut sa majuscule.
  const nom = target.name.charAt(0).toUpperCase() + target.name.slice(1)
  return (
    <p className="animate-in fade-in bg-card mt-3 rounded-2xl px-4 py-3 text-center text-sm shadow-sm">
      {!good && picked ? (
        <>
          <span className="text-destructive font-bold">Tu as touché {picked.nom}.</span>{' '}
        </>
      ) : null}
      {!good && !picked ? (
        <>
          <span className="text-muted-foreground font-bold">Temps écoulé.</span>{' '}
        </>
      ) : null}
      <strong>{nom}</strong>
      {good ? ' — ' : ', c’était là. '}
      {target.hint}
    </p>
  )
}
