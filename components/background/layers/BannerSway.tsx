/**
 * Bannières violettes suspendues de chaque côté de l'Arène : liseré doré en
 * tête, corps violet, pointe en V. Elles ondulent doucement autour de leur
 * point d'accroche (transform-origin en haut), désynchronisées gauche/droite
 * (CSS pur, voir globals.css `.abg-banner*`).
 */
export default function BannerSway() {
  return (
    <div className="abg-layer abg-layer--banners">
      <span className="abg-banner abg-banner--left" />
      <span className="abg-banner abg-banner--right" />
    </div>
  )
}
