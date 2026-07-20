// La pièce d'or — LA monnaie du jeu Studuel. Remplace l'icône lucide `Coins`
// (deux jetons superposés qui se lisaient comme un maillon de chaîne) par une
// vraie pièce ronde frappée d'une étoile : reconnaissable au premier coup d'œil
// partout où l'on affiche un solde de pièces (bandeau, coffre, débrief…).
//
// Monochrome (`currentColor`) et calquée sur l'API des icônes lucide
// (`className` + `strokeWidth`) pour rester un remplacement direct : elle hérite
// de la couleur du texte, donc lisible aussi bien en encre sur une pastille
// dorée qu'en doré `highlight` sur fond sombre.
export default function CoinIcon({
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
      {/* Le disque de la pièce + son listel intérieur (le relief frappé). */}
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5.6" />
      {/* L'étoile frappée au centre — le motif de la monnaie. */}
      <path d="M12 9.1l.95 1.92 2.12.31-1.53 1.49.36 2.11L12 13.94l-1.9 1l.37-2.11-1.53-1.49 2.12-.31z" />
    </svg>
  )
}
