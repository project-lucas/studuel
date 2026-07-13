// Logo « crayons croisés » de Studuel — signature de l'onboarding (écrans
// Bienvenue, Motivation, Créer un compte). Vectorisé depuis le design handoff
// (Logo.dc.html) : deux crayons croisés, corps violet + jaune, gomme corail,
// embout métal, bois clair, mine marine. Décoratif → aria-hidden.
export default function PencilLogo({
  size = 140,
  className,
}: {
  size?: number
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 240 240"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-hidden="true"
      style={{ display: 'block' }}
    >
      <g transform="rotate(46 120 120)">
        <rect x="104" y="40" width="32" height="24" rx="10" fill="#F1566C" stroke="#24304F" strokeWidth="7" />
        <rect x="103" y="63" width="34" height="9" fill="#CFD4DE" stroke="#24304F" strokeWidth="5" />
        <rect x="104" y="70" width="32" height="92" fill="#7A3FE0" stroke="#24304F" strokeWidth="7" />
        <polygon points="104,161 136,161 120,197" fill="#F3D3A0" stroke="#24304F" strokeWidth="7" strokeLinejoin="round" />
        <polygon points="112,180 128,180 120,197" fill="#24304F" />
      </g>
      <g transform="rotate(-46 120 120)">
        <rect x="104" y="40" width="32" height="24" rx="10" fill="#F1566C" stroke="#24304F" strokeWidth="7" />
        <rect x="103" y="63" width="34" height="9" fill="#CFD4DE" stroke="#24304F" strokeWidth="5" />
        <rect x="104" y="70" width="32" height="92" fill="#F5B722" stroke="#24304F" strokeWidth="7" />
        <polygon points="104,161 136,161 120,197" fill="#F3D3A0" stroke="#24304F" strokeWidth="7" strokeLinejoin="round" />
        <polygon points="112,180 128,180 120,197" fill="#24304F" />
      </g>
    </svg>
  )
}
