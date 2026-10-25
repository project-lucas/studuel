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
 * Aucun état, aucun effet. Le composant sert dans `ArenaBackdrop` (le fond de
 * l'arène, et le rideau de recherche d'adversaire qui le remonte — vivant lui
 * aussi depuis le 13/10/2026) ; `anime={false}` ne garde que l'illustration,
 * sans feuille, pour qui n'aurait besoin que du décor posé.
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
            style={joue(
              m.lanternes[i],
              carre(lanterne.x, lanterne.y, lanterne.taille ?? LANTERNE_TAILLE),
            )}
          />
        ))}

        <div
          className={cn(styles.cascade, scene.cascade.sens === 'monte' && styles.monte)}
          style={vars({
            ...zone(scene.cascade),
            '--passages': String(scene.cascade.passages),
          })}
        >
          {/* Les trois voiles d'eau (module CSS) : nappes, nappes décalées,
              filets — figés, ils montrent l'instant zéro ; animés, ils
              descendent en boucle, le raccord tombant sur le tuilage. */}
          <div className={styles.chute}>
            <span className={cn(styles.voile, styles.voileEau)} />
            <span className={cn(styles.voile, styles.voileEau, styles.voileDecale)} />
            <span className={cn(styles.voile, styles.voileFilets)} />
          </div>
        </div>

        <div className={styles.ecume} style={joue(m.ecume, zone(scene.ecume))} />

        {/* L'écume qui BOUILLONNE (12/10/2026) : des gouttes qui jaillissent en
            éventail du pied de la chute — chaque jet est un repère tourné, la
            goutte y monte tout droit — et des bulles qui crèvent sur place. */}
        <div
          className={styles.jaillissement}
          style={zone(scene.cascade.sens === 'monte' ? zonePointe(scene) : scene.ecume)}
        >
          {(scene.cascade.sens === 'monte' ? RETOMBEES : GOUTTES).map((g, i) => (
            <span
              key={`jet-${i}`}
              className={styles.jet}
              style={{ transform: `rotate(${g.angle}deg)` }}
            >
              <span
                className={cn(styles.goutte, g.courte && styles.goutteCourte)}
                style={{
                  width: u(g.taille),
                  height: u(g.taille),
                  animationDelay: `${g.delai}s`,
                  animationDuration: `${g.duree}s`,
                }}
              />
            </span>
          ))}
        </div>
        {/* Les bulles qui crèvent, au pied d'une CHUTE seulement. Sur la
            fontaine, elles flottaient au milieu du bassin, loin du jet
            (Lucas, 25/10/2026 : « retire les bulles au milieu de la fontaine ») :
            là, les retombées et l'embrun suffisent. */}
        {scene.cascade.sens === 'monte' ? null : (
        <div className={styles.jaillissement} style={zone(scene.ecume)}>
          {BULLES.map((b, i) => (
            <span
              key={`bulle-${i}`}
              className={styles.bulle}
              style={{
                left: `${b.x}%`,
                top: `${b.y}%`,
                width: u(b.taille),
                height: u(b.taille),
                animationDelay: `${b.delai}s`,
                animationDuration: `${b.duree}s`,
              }}
            />
          ))}
        </div>
        )}

        {/* La BRUME qui remonte le long de la chute : des bouffées qui naissent
            au pied, s'ouvrent et se dissipent à mi-hauteur. */}
        <div
          className={styles.vapeur}
          style={zone(scene.cascade.sens === 'monte' ? zoneEmbrun(scene) : zoneVapeur(scene))}
        >
          {(scene.cascade.sens === 'monte' ? VAPEURS_JET : VAPEURS).map((v, i) => (
            <span
              key={`vapeur-${i}`}
              className={styles.bouffee}
              style={{
                left: `${v.x}%`,
                width: u(v.taille),
                height: u(v.taille),
                animationDelay: `${v.delai}s`,
                animationDuration: `${v.duree}s`,
              }}
            />
          ))}
        </div>

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

/** Les trois copies d'une nappe de brume : à gauche, au centre, à droite. */
const COPIES = [-1, 0, 1] as const

/**
 * Les gouttes de l'écume : l'angle du jet (degrés, 0 = tout droit vers le
 * haut), la taille (pixels de planche), le délai et la durée (secondes) ; les
 * courtes retombent à mi-course. Huit jets en éventail, jamais deux au même
 * instant.
 */
const GOUTTES = [
  { angle: -38, taille: 14, delai: 0, duree: 1.1, courte: false },
  { angle: -22, taille: 11, delai: 0.35, duree: 0.9, courte: true },
  { angle: -8, taille: 16, delai: 0.6, duree: 1.3, courte: false },
  { angle: 6, taille: 12, delai: 0.15, duree: 1.0, courte: true },
  { angle: 18, taille: 15, delai: 0.8, duree: 1.2, courte: false },
  { angle: 32, taille: 11, delai: 0.45, duree: 0.95, courte: true },
  { angle: 44, taille: 13, delai: 1.0, duree: 1.15, courte: false },
  { angle: -50, taille: 10, delai: 0.25, duree: 0.85, courte: true },
] as const

/** Les bulles qui crèvent : position dans la zone d'écume (%), taille, délai, durée. */
const BULLES = [
  { x: 30, y: 60, taille: 18, delai: 0, duree: 1.6 },
  { x: 48, y: 70, taille: 22, delai: 0.5, duree: 1.9 },
  { x: 62, y: 55, taille: 16, delai: 1.1, duree: 1.5 },
  { x: 40, y: 45, taille: 14, delai: 0.8, duree: 1.3 },
  { x: 70, y: 65, taille: 20, delai: 0.3, duree: 1.7 },
] as const

/** Les bouffées de brume : abscisse dans sa zone (%), taille, délai, durée. */
const VAPEURS = [
  { x: 35, taille: 90, delai: 0, duree: 5 },
  { x: 55, taille: 110, delai: 1.7, duree: 6 },
  { x: 65, taille: 80, delai: 3.2, duree: 4.5 },
  { x: 45, taille: 100, delai: 4.4, duree: 5.5 },
] as const

/**
 * Les RETOMBÉES d'un jet de fontaine : les mêmes gouttes, mais lancées depuis
 * la pointe et tournées vers le bas et l'extérieur (au-delà de ±90°, le « haut »
 * du repère pointe vers le sol) — l'eau qui retombe de chaque côté du jet.
 */
const RETOMBEES = [
  { angle: -150, taille: 13, delai: 0, duree: 1.2, courte: false },
  { angle: -130, taille: 11, delai: 0.4, duree: 1.0, courte: true },
  { angle: -115, taille: 14, delai: 0.75, duree: 1.3, courte: false },
  { angle: -100, taille: 10, delai: 0.2, duree: 0.9, courte: true },
  { angle: 100, taille: 10, delai: 0.55, duree: 0.9, courte: true },
  { angle: 115, taille: 14, delai: 0.1, duree: 1.3, courte: false },
  { angle: 130, taille: 11, delai: 0.9, duree: 1.0, courte: true },
  { angle: 150, taille: 13, delai: 0.35, duree: 1.2, courte: false },
] as const

/** Les embruns à la pointe d'un jet : des bouffées plus petites et plus vives. */
const VAPEURS_JET = [
  { x: 40, taille: 50, delai: 0, duree: 3 },
  { x: 60, taille: 60, delai: 1.1, duree: 3.5 },
  { x: 50, taille: 44, delai: 2.2, duree: 2.8 },
] as const

/** La pointe d'un jet : une boîte autour du sommet de la colonne, d'où l'eau retombe. */
function zonePointe({ cascade }: SceneVivante): Zone {
  return { x: cascade.x - cascade.w, y: cascade.y - 30, w: cascade.w * 3, h: 120 }
}

/** Les embruns : juste au-dessus de la pointe du jet. */
function zoneEmbrun({ cascade }: SceneVivante): Zone {
  return { x: cascade.x - cascade.w * 0.75, y: cascade.y - 70, w: cascade.w * 2.5, h: 110 }
}

/** Là où la brume monte : la moitié basse de la chute, élargie, jusqu'à l'écume. */
function zoneVapeur({ cascade, ecume }: SceneVivante): Zone {
  return {
    x: cascade.x - cascade.w * 0.75,
    y: cascade.y + cascade.h * 0.4,
    w: cascade.w * 2.5,
    h: cascade.h * 0.6 + ecume.h * 0.8,
  }
}

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
