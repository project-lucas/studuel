import GoldenDust from './layers/GoldenDust'

/**
 * Fond animé de l'Arène : la poussière de lumière dorée, en boucle continue
 * par-dessus le décor peint (CSS procédural, aucune vidéo, aucune dépendance).
 * Couche `pointer-events: none`, masquée si l'élève préfère réduire le
 * mouvement.
 *
 * Il y avait aussi des feuilles qui tombaient (canvas) et deux braises dorées
 * au sol : retirées le 23/09/2026 à la demande de Lucas. Les braises avaient
 * été calées sur les vasques de l'ancien décor à mascotte ; sur l'académie
 * flottante, elles ne prolongeaient plus aucune flamme dessinée.
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
        <GoldenDust />
      </div>
      {children != null ? <div className="relative z-10">{children}</div> : null}
    </div>
  )
}
