import { cn } from '@/lib/utils'
import type { CouronneTier } from '@/lib/moi/couronnes'

// -----------------------------------------------------------------------------
// LA COURONNE, dessinée. Un SVG inline, pas une image : elle apparaît en
// 20 px dans le récapitulatif de la carte de profil et en 44 px dans la liste
// des matières, et un métal doit rester lisible aux deux tailles.
//
// COULEURS EN DUR, ASSUMÉES — même précédent que `lib/profile-banners.ts` et
// `components/avatar/vestiaire-assets.tsx` : c'est une couche ILLUSTRATIVE, pas
// une couleur d'interface. Le bronze, l'argent, l'or et le diamant ne sont pas
// des rôles sémantiques de la charte (ils ne veulent dire ni « action », ni
// « récompense », ni « alerte») : ce sont des métaux, et un métal se peint.
// Les rôles de la charte restent seuls maîtres de tout ce qui les entoure.
//
// Chaque métal porte trois teintes — lumière, corps, ombre — parce qu'un aplat
// ne se lit pas comme du métal. Le dégradé descend en diagonale, comme si
// l'écran était éclairé du haut à gauche : la même lumière que `.moi-panneau`.
// -----------------------------------------------------------------------------

type Metal = { lumiere: string; corps: string; ombre: string; gemme: string }

const METAUX: Record<CouronneTier, Metal> = {
  aucune: { lumiere: '#e7e2ec', corps: '#cdc6d6', ombre: '#a9a1b5', gemme: '#bdb5c8' },
  bronze: { lumiere: '#e8b98a', corps: '#c9814a', ombre: '#8a5223', gemme: '#5f3416' },
  argent: { lumiere: '#ffffff', corps: '#cfd8e3', ombre: '#8f9dae', gemme: '#5c6a7d' },
  or: { lumiere: '#fff3c4', corps: '#f5c53d', ombre: '#c8880f', gemme: '#8a5a06' },
  diamant: { lumiere: '#ffffff', corps: '#a9e8fb', ombre: '#3f9fd8', gemme: '#1d6fa5' },
}

export default function CouronneArt({
  tier,
  className,
}: {
  tier: CouronneTier
  className?: string
}) {
  const m = METAUX[tier]
  // Un id par métal : deux couronnes du même métal partagent leur dégradé, ce
  // qui est exactement ce qu'on veut. Deux métaux différents ne se marchent
  // jamais dessus.
  const id = `couronne-${tier}`

  return (
    <svg
      viewBox="0 0 32 26"
      role="img"
      aria-hidden="true"
      focusable="false"
      className={cn('block', className)}
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor={m.lumiere} />
          <stop offset="45%" stopColor={m.corps} />
          <stop offset="100%" stopColor={m.ombre} />
        </linearGradient>
      </defs>

      {/* Le corps de la couronne : trois pointes, deux vallées. */}
      <path
        d="M2.5 6.5 L10.5 13.5 L16 3 L21.5 13.5 L29.5 6.5 L27.5 19 L4.5 19 Z"
        fill={`url(#${id})`}
        stroke={m.ombre}
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
      {/* Le bandeau, posé dessous : c'est lui qui donne l'assise. */}
      <rect
        x="4"
        y="18.5"
        width="24"
        height="5"
        rx="2.2"
        fill={`url(#${id})`}
        stroke={m.ombre}
        strokeWidth="1.1"
      />
      {/* Les trois pierres, au bout de chaque pointe. */}
      <circle cx="2.8" cy="5.6" r="2.1" fill={m.gemme} />
      <circle cx="16" cy="2.6" r="2.4" fill={m.gemme} />
      <circle cx="29.2" cy="5.6" r="2.1" fill={m.gemme} />
      {/* Reflet du bandeau — la seule chose qui distingue le métal du carton. */}
      <path
        d="M6 20.2 H26"
        stroke={m.lumiere}
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.75"
      />
    </svg>
  )
}
