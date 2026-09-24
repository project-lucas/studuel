import type { CSSProperties } from 'react'
import {
  BOUCLE_SECONDES,
  BRUME_DEBORD,
  ETOILE_TAILLE,
  LANTERNE_TAILLE,
  PLANCHE_HAUTEUR,
  PLANCHE_LARGEUR,
  delaiDePhase,
  feuilleDeScene,
  mouvementsDeScene,
  type Mouvement,
  type SceneVivante,
  type Zone,
} from '@/lib/arena-vivante'
import { cn } from '@/lib/utils'
import styles from './ArenaVivante.module.css'

/**
 * L'ARÈNE VIVANTE : le décor horaire de l'onglet Défi qui bouge.
 *
 * Pose les couches d'une scène (lib/arena-vivante.ts) dans l'ordre des exports
 * de Lucas : la planche, les étoiles, la lueur de l'horizon, les nuages, les
 * rochers, la bougie des fenêtres, les lanternes, la cascade et son écume, la
 * brume. Chaque couche périodique reçoit en ligne SA PREMIÈRE IMAGE (la scène
 * figée est donc l'instant zéro de la boucle, pas une moyenne) et, si la scène
 * est animée, l'`animation` qui joue ses images-clés — injectées une fois par
 * scène dans une balise `<style>`.
 *
 * Aucun état, aucun effet. Le composant sert aussi bien dans `ArenaBackdrop`
 * (le fond de l'arène) que dans le rideau de recherche d'adversaire, où
 * `anime={false}` ne garde que l'illustration, sans feuille.
 */
export default function ArenaVivante({
  scene,
  anime = true,
}: {
  scene: SceneVivante
  /** Faux : la scène est posée, figée — l'illustration seule. */
  anime?: boolean
}) {
  const m = mouvementsDeScene(scene)
  const joue = (mouvement: Mouvement, style?: CSSProperties): CSSProperties => ({
    ...style,
    ...mouvement.image(0),
    ...(anime
      ? { animation: `${mouvement.nom} ${BOUCLE_SECONDES}s linear infinite` }
      : null),
  })

  return (
    <div aria-hidden="true" className={styles.cadre}>
      {anime ? <style>{feuilleEnCache(scene)}</style> : null}
      <div
        className={cn(styles.planche, anime && styles.animee)}
        style={vars({
          backgroundImage: `url(${scene.plate})`,
          '--pw': String(PLANCHE_LARGEUR),
          '--ph': String(PLANCHE_HAUTEUR),
          '--boucle': `${BOUCLE_SECONDES}s`,
          '--brume': scene.couleurBrume,
        })}
      >
        {scene.etoiles.map((etoile, i) => (
          <div
            key={`etoile-${i}`}
            className={styles.etoile}
            style={joue(m.etoiles[i], carre(etoile.x, etoile.y, ETOILE_TAILLE))}
          />
        ))}

        <div
          className={styles.lueur}
          style={joue(
            m.lueur,
            vars({
              ...zone(scene.lueur),
              '--centre': scene.lueur.centre,
              '--halo': scene.lueur.halo,
            }),
          )}
        />

        {scene.nuages.map((nuage, i) => (
          <div
            key={nuage.src}
            className={styles.detoure}
            style={joue(m.nuages[i], {
              ...zone(nuage),
              backgroundImage: `url(${nuage.src})`,
            })}
          />
        ))}

        {scene.rochers.map((rocher, i) => (
          <div
            key={rocher.src}
            className={styles.detoure}
            style={joue(m.rochers[i], {
              ...zone(rocher),
              backgroundImage: `url(${rocher.src})`,
            })}
          />
        ))}

        <div className={styles.bougie} style={joue(m.bougie, zone(scene.bougie))} />

        {scene.lanternes.map((lanterne, i) => (
          <div
            key={`lanterne-${i}`}
            className={styles.lanterne}
            style={joue(m.lanternes[i], carre(lanterne.x, lanterne.y, LANTERNE_TAILLE))}
          />
        ))}

        <div
          className={styles.cascade}
          style={vars({
            ...zone(scene.cascade),
            '--passages': String(scene.cascade.passages),
          })}
        >
          {REFLETS.map((phase, i) => (
            // Le RAIL est haut de la course : il glisse de sa propre hauteur
            // (`translateY(100%)`, sans variable dans l'image-clé).
            <span
              key={i}
              className={styles.rail}
              style={{
                left: u(8 + i * 14),
                height: u(scene.cascade.course),
                // Figé (mouvement réduit, rideau), le reflet reste là où la
                // boucle le prend à l'instant zéro — sans cela il resterait
                // au-dessus de la colonne, caché. Animé, l'animation l'emporte.
                transform: `translateY(${phase * 100}%)`,
                animationDelay: `${delaiDePhase(
                  phase,
                  BOUCLE_SECONDES / scene.cascade.passages,
                )}s`,
              }}
            >
              <span className={styles.reflet} />
            </span>
          ))}
        </div>

        <div className={styles.ecume} style={joue(m.ecume, zone(scene.ecume))} />

        {scene.brume.map((nappe, i) => (
          <div
            key={`brume-${i}`}
            className={cn(styles.brume, nappe.sens < 0 && styles.brumeGauche)}
            style={{
              top: u(nappe.y),
              height: u(nappe.h),
              opacity: nappe.opacite,
              // Même règle que les reflets : figée, la nappe est à l'instant zéro.
              // La nappe est large d'une planche : sa phase est un % de SA largeur.
              transform: `translateX(${nappe.sens * nappe.phase * 100}%)`,
              animationDelay: `${delaiDePhase(nappe.phase)}s`,
            }}
          >
            {COPIES.map((o) => (
              <span
                key={o}
                className={styles.nappe}
                style={{
                  left: u(o * PLANCHE_LARGEUR - BRUME_DEBORD),
                  width: u(PLANCHE_LARGEUR + 2 * BRUME_DEBORD),
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

/** Les trois reflets de la cascade, décalés d'un tiers de passage chacun. */
const REFLETS = [0, 1 / 3, 2 / 3] as const
/** Les trois copies d'une nappe de brume : à gauche, au centre, à droite. */
const COPIES = [-1, 0, 1] as const

/**
 * La feuille d'images-clés d'une scène, écrite une fois : elle ne dépend que
 * de la scène, qui ne change jamais.
 */
const FEUILLES = new WeakMap<SceneVivante, string>()
function feuilleEnCache(scene: SceneVivante): string {
  let feuille = FEUILLES.get(scene)
  if (feuille === undefined) {
    feuille = feuilleDeScene(scene)
    FEUILLES.set(scene, feuille)
  }
  return feuille
}

/** `n` pixels de planche, en pixels d'écran. */
function u(n: number): string {
  return `calc(${n} * var(--u))`
}

function zone(z: Zone): CSSProperties {
  return { left: u(z.x), top: u(z.y), width: u(z.w), height: u(z.h) }
}

/** Un halo carré de côté `taille`, centré sur (x, y). */
function carre(x: number, y: number, taille: number): CSSProperties {
  return zone({ x: x - taille / 2, y: y - taille / 2, w: taille, h: taille })
}

/** Un style inline qui porte aussi des propriétés personnalisées (`--x`). */
function vars(style: CSSProperties & Record<`--${string}`, string>): CSSProperties {
  return style
}
