import type { ComponentType, SVGProps } from 'react'
import { cn } from '@/lib/utils'
import { subjectPastel, subjectVignette } from '@/lib/subject-style'

// Illustrations de matières pour les cartes « On s'y remet ? ». Priorité à la
// vraie vignette illustrée (public/images/matieres/vignettes/<slug>.webp, via
// subjectVignette) — la même que sur les cartes matières de l'accueil Réviser.
// Les SVG dessinés à la main ne servent plus que de repli pour les matières
// sans vignette générée (ex. maths-expertes, finances-personnelles).

const NAVY = '#2D2A4A'

export type SubjectIllustrationDef = {
  /** SVG inline (remplaçable plus tard par le fichier `asset`). */
  Svg: ComponentType<SVGProps<SVGSVGElement>>
  /** Couleur principale de la matière. */
  color: string
  /** Fond pâle derrière l'illustration. */
  bg: string
  /** Futur fichier statique dans /public/illustrations/matieres/. */
  asset: string
}

// --- Histoire-Géo : globe sur socle -----------------------------------------
function GlobeSvg(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 80 80" fill="none" {...props}>
      {/* ombre offset dure */}
      <circle cx="43" cy="39" r="26" fill={NAVY} />
      <polygon points="39,63 47,63 50,73 36,73" fill={NAVY} />
      {/* socle */}
      <polygon
        points="36,60 44,60 47,70 33,70"
        fill="#F87171"
        stroke={NAVY}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* globe */}
      <circle
        cx="40"
        cy="36"
        r="26"
        fill="#F87171"
        stroke={NAVY}
        strokeWidth="3"
      />
      <ellipse
        cx="40"
        cy="36"
        rx="11"
        ry="26"
        fill="none"
        stroke={NAVY}
        strokeWidth="2.5"
      />
      <path d="M14 36 H66" stroke={NAVY} strokeWidth="2.5" />
    </svg>
  )
}

// --- Maths : compas + courbe --------------------------------------------------
function CompassSvg(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 80 80" fill="none" {...props}>
      {/* ombre offset dure */}
      <g fill={NAVY} transform="translate(3 3)">
        <rect x="37" y="4" width="6" height="9" rx="2" />
        <circle cx="40" cy="17" r="7" />
        <polygon points="37,21 22,62 30,62" />
        <polygon points="43,21 58,62 50,62" />
      </g>
      {/* courbe */}
      <path
        d="M8 66 Q40 34 72 66"
        stroke={NAVY}
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* compas */}
      <polygon
        points="37,21 22,62 30,62"
        fill="#4D96FF"
        stroke={NAVY}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <polygon
        points="43,21 58,62 50,62"
        fill="#4D96FF"
        stroke={NAVY}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <rect
        x="37"
        y="4"
        width="6"
        height="9"
        rx="2"
        fill="#4D96FF"
        stroke={NAVY}
        strokeWidth="3"
      />
      <circle
        cx="40"
        cy="17"
        r="7"
        fill="#4D96FF"
        stroke={NAVY}
        strokeWidth="3"
      />
    </svg>
  )
}

// --- Physique-Chimie : fiole à liquide ---------------------------------------
function FlaskSvg(props: SVGProps<SVGSVGElement>) {
  const flask =
    'M34 8 H46 V28 L62 58 C64 62 61 66 56 66 H24 C19 66 16 62 18 58 L34 28 Z'
  return (
    <svg viewBox="0 0 80 80" fill="none" {...props}>
      {/* ombre offset dure */}
      <path d={flask} transform="translate(3 3)" fill={NAVY} />
      {/* fiole */}
      <path
        d={flask}
        fill="#FFFFFF"
        stroke={NAVY}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* liquide */}
      <path
        d="M27 46 L53 46 L60 59 C61.5 62 59.5 64 56 64 H24 C20.5 64 18.5 62 20 59 Z"
        fill="#7B4FD8"
        stroke={NAVY}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* bulles */}
      <circle cx="37" cy="38" r="3" fill="#7B4FD8" stroke={NAVY} strokeWidth="2" />
      <circle cx="44" cy="32" r="2.5" fill="#7B4FD8" stroke={NAVY} strokeWidth="2" />
    </svg>
  )
}

// --- Repli générique : livre ouvert -------------------------------------------
function BookSvg(props: SVGProps<SVGSVGElement>) {
  const left = 'M40 22 C30 14 18 14 12 18 V58 C18 54 30 54 40 62 Z'
  const right = 'M40 22 C50 14 62 14 68 18 V58 C62 54 50 54 40 62 Z'
  return (
    <svg viewBox="0 0 80 80" fill="none" {...props}>
      {/* ombre offset dure */}
      <g fill={NAVY} transform="translate(3 3)">
        <path d={left} />
        <path d={right} />
      </g>
      {/* pages */}
      <path
        d={left}
        fill="#F9B233"
        stroke={NAVY}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d={right}
        fill="#F9B233"
        stroke={NAVY}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M40 22 V62" stroke={NAVY} strokeWidth="3" />
    </svg>
  )
}

const ILLUSTRATIONS: Record<string, SubjectIllustrationDef> = {
  'histoire-geo': {
    Svg: GlobeSvg,
    color: '#F87171',
    bg: '#FDE7D8',
    asset: '/illustrations/matieres/histoire-geo.svg',
  },
  maths: {
    Svg: CompassSvg,
    color: '#4D96FF',
    bg: '#DFEBFF',
    asset: '/illustrations/matieres/maths.svg',
  },
  'physique-chimie': {
    Svg: FlaskSvg,
    color: '#7B4FD8',
    bg: '#EFE7FB',
    asset: '/illustrations/matieres/physique-chimie.svg',
  },
}

const FALLBACK: SubjectIllustrationDef = {
  Svg: BookSvg,
  color: '#F9B233',
  bg: '#FBF3DC',
  asset: '/illustrations/matieres/defaut.svg',
}

export function subjectIllustration(
  slug: string,
  color?: string,
): SubjectIllustrationDef {
  const def = ILLUSTRATIONS[slug]
  if (def) return def
  // Fond pastel par couleur de matière (subjectPastel) — même palette que les
  // tuiles de l'accueil Réviser, pour que la bulle reprenne l'ambiance de la
  // matière même sans entrée dédiée ci-dessus.
  const bg = color ? subjectPastel(color) : FALLBACK.bg
  return { ...FALLBACK, bg }
}

export default function SubjectIllustration({
  slug,
  className,
}: {
  slug: string
  className?: string
}) {
  const vignette = subjectVignette(slug)
  if (vignette) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={vignette}
        alt=""
        aria-hidden="true"
        width={320}
        height={320}
        loading="lazy"
        className={cn(
          'pointer-events-none object-contain select-none',
          className,
        )}
      />
    )
  }
  const { Svg } = subjectIllustration(slug)
  return <Svg className={className} aria-hidden="true" focusable="false" />
}
