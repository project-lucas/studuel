import BannerSway from './layers/BannerSway'
import FallingLeaves from './layers/FallingLeaves'
import TorchFlames from './layers/TorchFlames'
import GoldenDust from './layers/GoldenDust'

/**
 * Fond animé de l'Arène : quatre couches décoratives superposées au décor
 * peint, toutes en boucle continue sans coupure visible (CSS procédural +
 * canvas, aucune vidéo/GIF, aucune dépendance externe).
 *
 * Empilement (z croissant) : image (0) → bannières (1) → feuilles (2) →
 * torches (3) → poussière dorée (4). Les couches sont `pointer-events: none`
 * et respectent prefers-reduced-motion (flammes figées, reste masqué/arrêté).
 *
 * Deux modes d'emploi :
 * - DANS l'Arène (app/defi/layout.tsx → ArenaBackdrop) : sans `imageUrl`,
 *   car ArenaBackdrop peint déjà l'image selon l'heure AVEC fondu enchaîné
 *   au changement de plage — on ne remplace pas ce mécanisme.
 * - Autonome : passer `imageUrl` (et éventuellement `children` pour le
 *   contenu, rendu au-dessus en `relative z-10`).
 */
type Props = {
  /** Image de fond à peindre — à omettre quand le parent la gère déjà. */
  imageUrl?: string
  children?: React.ReactNode
}

export default function AnimatedBackground({ imageUrl, children }: Props) {
  return (
    <div className="abg">
      {imageUrl ? (
        <div
          className="abg-image"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
      ) : null}
      <div aria-hidden="true" className="abg-layers">
        <BannerSway />
        <FallingLeaves />
        <TorchFlames />
        <GoldenDust />
      </div>
      {children != null ? <div className="relative z-10">{children}</div> : null}
    </div>
  )
}
