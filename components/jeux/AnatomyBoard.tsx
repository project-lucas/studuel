'use client'

import { useId, useState } from 'react'
import { cn } from '@/lib/utils'
import { isGoodPick, type Cible as Organ, type Planche, type ZonePlanche } from '@/lib/jeux/planche'
import styles from './AnatomyBoard.module.css'

/** L'onde d'un tap tombé à côté de tout organe, là où il est tombé. */
type Onde = { x: number; y: number; cle: number }

/** « les biceps » → « Biceps » : l'étiquette posée sur le muscle à la correction. */
function etiquette(nom: string): string {
  const sansArticle = nom.replace(/^(le |la |les |l’|l')/, '')
  return sansArticle.charAt(0).toUpperCase() + sansArticle.slice(1)
}

/** Épaisseur du halo qui bat autour de la bonne réponse, à la correction. */
const HALO_PLEIN = 4.5
const HALO_TUBE_EN_PLUS = 5
/** Sur l’écorché peint, le halo reste fin : la peinture porte déjà le relief. */
const HALO_PEINT = 2.2

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
 *
 * Depuis le 14/10/2026 la planche est un PARAMÈTRE (lib/jeux/planche) : les
 * organes pour Anatomie express, les muscles pour Muscles express (Sport) —
 * même corps, même geste, même correction.
 */
export default function AnatomyBoard({
  planche,
  target,
  /** Zone touchée par l'élève, ou null tant qu'il n'a pas répondu. */
  picked,
  revealed,
  onPick,
}: {
  /** La planche à dessiner — les organes (SVT) ou les muscles (Sport). */
  planche: Planche
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
    // Par la matrice de l'écran plutôt que par le rectangle : une planche
    // peinte est plafonnée en hauteur et se centre dans sa largeur — le
    // rectangle du SVG n'est alors plus celui du dessin.
    const svg = event.currentTarget
    const ctm = svg.getScreenCTM()
    let x: number
    let y: number
    if (ctm) {
      const p = new DOMPoint(event.clientX, event.clientY).matrixTransform(ctm.inverse())
      x = p.x
      y = p.y
    } else {
      const rect = svg.getBoundingClientRect()
      x = ((event.clientX - rect.left) / rect.width) * planche.largeur
      y = ((event.clientY - rect.top) / rect.height) * planche.hauteur
    }
    const zone = planche.zoneAt(x, y)
    if (!zone) setOnde({ x, y, cle: Date.now() })
    onPick(zone)
  }

  const fonduId = `${id}-fondu`
  const masqueId = `${id}-masque`
  const projecteurId = `${id}-projecteur`
  const peinte = Boolean(planche.image)
  const cibleZone = planche.zones.find((z) => isGoodPick(target, z)) ?? null
  // L'étiquette du muscle, posée au-dessus de son cœur et gardée dans la planche.
  const nomEtiquette = etiquette(target.name)
  const largeurEtiquette = nomEtiquette.length * 2.35 + 6
  const etiquetteX = cibleZone
    ? Math.min(
        planche.largeur - largeurEtiquette / 2 - 1,
        Math.max(largeurEtiquette / 2 + 1, cibleZone.ancre[0]),
      )
    : 0
  // Au-dessus du HAUT de la zone (et non de son cœur) : posée sur l'organe,
  // l'étiquette cachait justement ce qu'elle désigne.
  const hautZone = cibleZone
    ? Math.min(...planche.zoneLignes(cibleZone.id).flatMap((l) => l.map(([, y]) => y)))
    : 0
  const etiquetteY = cibleZone ? Math.max(5, hautZone - 5) : 0

  return (
    <div className="bg-card relative mx-auto w-full max-w-[360px] overflow-hidden rounded-3xl p-2 shadow-sm ring-1 ring-[color:var(--jeu-accent)]/15">
      {peinte && planche.vue ? (
        <span className={styles.vue} aria-hidden="true">
          {planche.vue === 'dos' ? 'Vue de dos' : 'Vue de face'}
        </span>
      ) : null}
      <svg
        // Une nouvelle vue se monte de neuf : elle PIVOTE en entrant, comme
        // une planche qu'on retourne.
        key={planche.vue ?? 'planche'}
        viewBox={`0 0 ${planche.largeur} ${planche.hauteur}`}
        onClick={handleClick}
        // `group` et non `img` : la planche CONTIENT des zones activables.
        // `img` est un rôle feuille — un lecteur d'écran ignorerait tout ce
        // qu'il y a dedans, y compris les zones.
        role="group"
        aria-label={`Planche d’anatomie — trouve ${target.name}`}
        className={cn(
          styles.planche,
          peinte && styles.plancheDessinee,
          peinte && planche.vue && styles.pivote,
          !revealed && styles.cliquable,
        )}
      >
        <defs>
          {/* Les cuisses s'estompent vers le bas : la planche s'arrête à
              mi-cuisse, comme celle du manuel, sans couper net. */}
          <linearGradient
            id={fonduId}
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1={planche.fonduDepuis}
            x2="0"
            y2={planche.hauteur}
          >
            <stop offset="0" stopColor="#fff" />
            <stop offset="1" stopColor="#000" />
          </linearGradient>
          <mask id={masqueId}>
            <rect width={planche.largeur} height={planche.hauteur} fill={`url(#${fonduId})`} />
          </mask>
          {/* Le projecteur de la correction : tout s'assombrit, sauf la bonne
              réponse et ce qu'on a touché à tort. */}
          {peinte && revealed ? (
            <mask id={projecteurId}>
              <rect width={planche.largeur} height={planche.hauteur} fill="#fff" />
              {cibleZone ? <path d={cibleZone.forme.d} fill="#000" /> : null}
              {picked && picked.id !== cibleZone?.id ? <path d={picked.forme.d} fill="#000" /> : null}
            </mask>
          ) : null}
        </defs>

        {peinte ? (
          <image
            href={planche.image}
            width={planche.largeur}
            height={planche.hauteur}
            preserveAspectRatio="none"
          />
        ) : (
          <g mask={`url(#${masqueId})`}>
            <path d={planche.corpsD} className={styles.corps} />
          </g>
        )}

        {peinte && revealed ? (
          <rect
            width={planche.largeur}
            height={planche.hauteur}
            mask={`url(#${projecteurId})`}
            className={styles.voile}
          />
        ) : null}

        {planche.zones.map((zone, index) => {
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
              aria-label={planche.zoneLabel(zone, index)}
              aria-disabled={revealed || undefined}
              onKeyDown={(event) => {
                if (revealed) return
                if (event.key !== 'Enter' && event.key !== ' ') return
                // Sinon la barre d'espace fait défiler la page sous le jeu.
                event.preventDefault()
                onPick(zone)
              }}
              className={cn(styles.zone, peinte && styles.zonePeinte, etat)}
            >
              {revealed && isTarget ? (
                <path
                  d={zone.forme.d}
                  className={styles.halo}
                  strokeWidth={tube ? tube.largeur + HALO_TUBE_EN_PLUS : peinte ? HALO_PEINT : HALO_PLEIN}
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

        {peinte && revealed && cibleZone ? (
          <g
            className={styles.etiquette}
            transform={`translate(${etiquetteX} ${etiquetteY})`}
            aria-hidden="true"
          >
            <rect
              x={-largeurEtiquette / 2}
              y={-4.2}
              width={largeurEtiquette}
              height={8.4}
              rx={4.2}
              className={styles.etiquetteFond}
            />
            <text textAnchor="middle" dominantBaseline="central" className={styles.etiquetteTexte}>
              {nomEtiquette}
            </text>
          </g>
        ) : null}

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
