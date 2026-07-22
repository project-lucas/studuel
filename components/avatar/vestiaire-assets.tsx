// -----------------------------------------------------------------------------
// Assets du vestiaire — bannières (fond du profil) et équipements (accessoire
// porté), en SVG inline. Clés = EQUIPMENT_KEYS / BANNER_KEYS (lib/avatar.ts),
// mêmes slugs que les asset_key du catalogue (migration 189). V1 : dessins
// simples et remplaçables — la structure (couches, mapping) compte plus que le
// trait ; on pourra substituer des visuels générés sans toucher au code.
// -----------------------------------------------------------------------------

import type { JSX } from 'react'

// --- Bannières ----------------------------------------------------------------
// Chaque bannière remplit son conteneur (preserveAspectRatio slice) : utilisée
// en grand derrière l'avatar et en vignette dans la grille.

function BannerSvg({ children, from, to }: { children?: React.ReactNode; from: string; to: string }) {
  return (
    <svg
      viewBox="0 0 320 180"
      preserveAspectRatio="xMidYMid slice"
      className="size-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`ban-${from}-${to}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
      </defs>
      <rect width="320" height="180" fill={`url(#ban-${from}-${to})`} />
      {children}
    </svg>
  )
}

const BANNER_ART: Record<string, () => JSX.Element> = {
  'uni-lavande': () => <BannerSvg from="#d9ccff" to="#b9a6ff" />,

  'terrain-basket': () => (
    <BannerSvg from="#ffb26b" to="#f4845f">
      {/* Lignes du terrain + panneau. */}
      <circle cx="160" cy="180" r="60" fill="none" stroke="#fff" strokeWidth="4" opacity="0.7" />
      <line x1="0" y1="150" x2="320" y2="150" stroke="#fff" strokeWidth="4" opacity="0.7" />
      <rect x="130" y="26" width="60" height="42" rx="6" fill="#fff" opacity="0.85" />
      <rect x="146" y="40" width="28" height="22" rx="4" fill="none" stroke="#f4845f" strokeWidth="4" />
      <line x1="160" y1="68" x2="160" y2="86" stroke="#fff" strokeWidth="5" opacity="0.85" />
    </BannerSvg>
  ),

  bibliotheque: () => (
    <BannerSvg from="#8a6f5c" to="#5d4a3c">
      {/* Deux étagères de livres pastel. */}
      {[46, 116].map((y) => (
        <g key={y}>
          <rect x="0" y={y + 46} width="320" height="10" fill="#3f3229" />
          {Array.from({ length: 9 }, (_, i) => {
            const colors = ['#b9a6ff', '#ffe08a', '#c7f0d8', '#ffd0d6', '#b1e2ff']
            const h = 34 + ((i * 7) % 12)
            return (
              <rect
                key={i}
                x={12 + i * 34}
                y={y + 46 - h}
                width="24"
                height={h}
                rx="3"
                fill={colors[i % colors.length]}
              />
            )
          })}
        </g>
      ))}
    </BannerSvg>
  ),

  'ciel-etoile': () => (
    <BannerSvg from="#3b2a72" to="#1d1440">
      {Array.from({ length: 18 }, (_, i) => (
        <circle
          key={i}
          cx={(i * 53 + 17) % 320}
          cy={(i * 37 + 11) % 160}
          r={i % 3 === 0 ? 2.5 : 1.4}
          fill="#ffe08a"
          opacity={0.5 + (i % 4) * 0.12}
        />
      ))}
      <circle cx="258" cy="42" r="18" fill="#ffe08a" opacity="0.9" />
      <circle cx="250" cy="36" r="16" fill="#3b2a72" />
    </BannerSvg>
  ),

  neon: () => (
    <BannerSvg from="#241a3d" to="#120d24">
      {/* Traits néon violets/jaunes qui vibrent doucement. */}
      <line x1="24" y1="30" x2="140" y2="30" stroke="#a78bfa" strokeWidth="5" strokeLinecap="round" opacity="0.9" />
      <line x1="180" y1="58" x2="300" y2="58" stroke="#ffe08a" strokeWidth="4" strokeLinecap="round" opacity="0.85" />
      <line x1="40" y1="130" x2="120" y2="130" stroke="#f472b6" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
      <line x1="210" y1="140" x2="290" y2="140" stroke="#a78bfa" strokeWidth="5" strokeLinecap="round" opacity="0.9" />
      <circle cx="160" cy="92" r="34" fill="none" stroke="#ffe08a" strokeWidth="3.5" opacity="0.9" />
    </BannerSvg>
  ),
}

/** Rendu d'une bannière (fond violet clair de repli si slug inconnu). */
export function BannerArt({ slug }: { slug: string }) {
  const Art = BANNER_ART[slug] ?? BANNER_ART['uni-lavande']
  return <Art />
}

// --- Équipements --------------------------------------------------------------
// Petits objets cartoon posés en surimpression de l'avatar (coin bas droit).

const EQUIPMENT_ART: Record<string, () => JSX.Element> = {
  'ballon-basket': () => (
    <svg viewBox="0 0 48 48" className="size-full" aria-hidden="true">
      <circle cx="24" cy="24" r="20" fill="#f4845f" stroke="#c05621" strokeWidth="2.5" />
      <path d="M4 24h40M24 4v40M9 10c8 8 8 20 0 28M39 10c-8 8-8 20 0 28" fill="none" stroke="#c05621" strokeWidth="2.5" />
    </svg>
  ),

  'casque-audio': () => (
    <svg viewBox="0 0 48 48" className="size-full" aria-hidden="true">
      <path d="M10 30v-4a14 14 0 0 1 28 0v4" fill="none" stroke="#4c3a92" strokeWidth="4.5" strokeLinecap="round" />
      <rect x="6" y="27" width="10" height="15" rx="4.5" fill="#7c4dff" stroke="#4c3a92" strokeWidth="2.5" />
      <rect x="32" y="27" width="10" height="15" rx="4.5" fill="#7c4dff" stroke="#4c3a92" strokeWidth="2.5" />
    </svg>
  ),

  'lunettes-soleil': () => (
    <svg viewBox="0 0 48 48" className="size-full" aria-hidden="true">
      <rect x="4" y="18" width="17" height="13" rx="5" fill="#2d2a3d" stroke="#12101c" strokeWidth="2" />
      <rect x="27" y="18" width="17" height="13" rx="5" fill="#2d2a3d" stroke="#12101c" strokeWidth="2" />
      <path d="M21 22h6M4 21l-3-3M44 21l3-3" fill="none" stroke="#12101c" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="10" cy="22" r="2.5" fill="#ffffff" opacity="0.5" />
      <circle cx="33" cy="22" r="2.5" fill="#ffffff" opacity="0.5" />
    </svg>
  ),

  livre: () => (
    <svg viewBox="0 0 48 48" className="size-full" aria-hidden="true">
      <path d="M8 8h24a6 6 0 0 1 6 6v26H14a6 6 0 0 1-6-6V8Z" fill="#7c4dff" stroke="#4c3a92" strokeWidth="2.5" />
      <path d="M14 8v24" stroke="#4c3a92" strokeWidth="2.5" />
      <path d="M20 16h12M20 23h12M20 30h8" stroke="#ffe08a" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),

  'sac-a-dos': () => (
    <svg viewBox="0 0 48 48" className="size-full" aria-hidden="true">
      <rect x="10" y="12" width="28" height="30" rx="9" fill="#ffb26b" stroke="#c05621" strokeWidth="2.5" />
      <path d="M18 12v-2a6 6 0 0 1 12 0v2" fill="none" stroke="#c05621" strokeWidth="3" strokeLinecap="round" />
      <rect x="16" y="26" width="16" height="12" rx="4" fill="#ffe08a" stroke="#c05621" strokeWidth="2" />
      <line x1="24" y1="26" x2="24" y2="32" stroke="#c05621" strokeWidth="2" />
    </svg>
  ),
}

/** Rendu d'un équipement (null si slug vide/inconnu : rien à porter). */
export function EquipmentArt({ slug }: { slug: string }) {
  const Art = EQUIPMENT_ART[slug]
  return Art ? <Art /> : null
}
