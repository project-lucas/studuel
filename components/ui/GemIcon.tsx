// La gemme 💎 — la monnaie du CONTENU (une gemme = un chapitre déverrouillé,
// à vie). Elle doit se distinguer d'un coup d'œil de la pièce (CoinIcon), qui
// n'achète que du cosmétique : d'où une taille facettée anguleuse face au
// disque rond de la pièce, deux silhouettes qu'on ne confond pas même en 16px.
//
// Monochrome (`currentColor`) et calquée sur l'API des icônes lucide
// (`className` + `strokeWidth`), comme CoinIcon : remplacement direct partout
// où l'on affiche un solde.
export default function GemIcon({
  className,
  strokeWidth = 2,
}: {
  className?: string
  strokeWidth?: number
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      role="img"
    >
      {/* La silhouette : table hexagonale allongée en pointe vers le bas. */}
      <path d="M6 3h12l4 6-10 12L2 9z" />
      {/* Les facettes — la table du haut et les arêtes qui filent vers la pointe. */}
      <path d="M2 9h20" />
      <path d="M9.5 3 8 9l4 12 4-12-1.5-6" />
    </svg>
  )
}
