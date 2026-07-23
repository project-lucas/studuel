'use client'

import { cn } from '@/lib/utils'
import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  ORGANS,
  organAt,
  zoneLabel,
  type Organ,
} from '@/lib/jeux/anatomie'

/**
 * La planche d'anatomie : une silhouette et des zones qu'on touche.
 *
 * C'est la seule interaction de l'app où l'on répond en DÉSIGNANT un endroit —
 * aucune proposition à lire, donc aucune possibilité d'éliminer les mauvaises
 * réponses. On sait, ou on ne sait pas.
 *
 * Les zones sont invisibles au repos : les afficher reviendrait à donner huit
 * cibles nommées, c'est-à-dire un QCM déguisé. Elles ne se révèlent qu'à la
 * correction — la bonne en vert, celle qu'on a touchée à tort en corail.
 */
export default function AnatomyBoard({
  target,
  /** Organe touché par l'élève, ou null tant qu'il n'a pas répondu. */
  picked,
  revealed,
  onPick,
}: {
  target: Organ
  picked: Organ | null
  revealed: boolean
  /** L'organe touché, ou null si le tap est tombé en dehors de toute zone. */
  onPick: (organ: Organ | null) => void
}) {
  const handleClick = (event: React.MouseEvent<SVGSVGElement>) => {
    if (revealed) return
    // On convertit le clic écran en coordonnées du viewBox : le SVG est mis à
    // l'échelle par la mise en page, donc les pixels de la page ne veulent rien
    // dire ici.
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * BOARD_WIDTH
    const y = ((event.clientY - rect.top) / rect.height) * BOARD_HEIGHT
    onPick(organAt(x, y))
  }

  return (
    <div className="mx-auto w-full max-w-[260px]">
      <svg
        viewBox={`0 0 ${BOARD_WIDTH} ${BOARD_HEIGHT}`}
        onClick={handleClick}
        // `group` et non `img` : la planche CONTIENT des zones activables.
        // `img` est un rôle feuille — un lecteur d'écran ignorerait tout ce
        // qu'il y a dedans, y compris les huit zones.
        role="group"
        aria-label={`Silhouette humaine — trouve ${target.name}`}
        className={cn(
          'w-full touch-manipulation select-none',
          !revealed && 'cursor-pointer',
        )}
      >
        {/* La silhouette : tête, tronc, bras, jambes. Volontairement schématique
            — une planche trop détaillée donnerait des indices de forme. */}
        <g fill="var(--jeu-accent)" opacity={0.14}>
          <circle cx="50" cy="20" r="16" />
          <rect x="30" y="40" width="40" height="100" rx="16" />
          <rect x="14" y="46" width="13" height="66" rx="6.5" />
          <rect x="73" y="46" width="13" height="66" rx="6.5" />
          <rect x="33" y="136" width="14" height="76" rx="7" />
          <rect x="53" y="136" width="14" height="76" rx="7" />
        </g>
        {/* Contour, pour que la silhouette se lise sur le fond du thème. */}
        <g
          fill="none"
          stroke="var(--jeu-accent)"
          strokeWidth="1.2"
          opacity={0.5}
        >
          <circle cx="50" cy="20" r="16" />
          <rect x="30" y="40" width="40" height="100" rx="16" />
        </g>

        {ORGANS.map((organ, index) => {
          const isTarget = organ.id === target.id
          const isPicked = picked?.id === organ.id
          // Avant la correction, aucune zone n'est peinte : les montrer
          // reviendrait à afficher huit cibles, donc un QCM déguisé. Elles
          // restent en revanche ATTEIGNABLES au clavier, sous un nom qui décrit
          // leur position et jamais leur contenu (cf. `zoneLabel`).
          if (!revealed) {
            return (
              <circle
                key={organ.id}
                cx={organ.zone.cx}
                cy={organ.zone.cy}
                r={organ.zone.r}
                fill="transparent"
                tabIndex={0}
                role="button"
                aria-label={zoneLabel(organ.zone, index)}
                onKeyDown={(event) => {
                  if (event.key !== 'Enter' && event.key !== ' ') return
                  // Sinon la barre d'espace fait défiler la page sous le jeu.
                  event.preventDefault()
                  onPick(organ)
                }}
                // Une zone transparente qui prend le focus sans rien montrer
                // laisse l'élève au clavier totalement perdu : on lui dessine
                // son contour, et seulement au focus clavier.
                className="cursor-pointer stroke-transparent outline-none focus-visible:stroke-primary"
                strokeWidth="1.6"
                strokeDasharray="3 2"
              />
            )
          }
          if (!isTarget && !isPicked) return null
          return (
            <g key={organ.id}>
              <circle
                cx={organ.zone.cx}
                cy={organ.zone.cy}
                r={organ.zone.r}
                className={cn(
                  'jeu-monte',
                  isTarget
                    ? 'fill-success/35 stroke-success'
                    : 'fill-destructive/30 stroke-destructive',
                )}
                strokeWidth="1.6"
              />
            </g>
          )
        })}
      </svg>
    </div>
  )
}
