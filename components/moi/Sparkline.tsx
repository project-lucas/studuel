import { cn } from '@/lib/utils'
import {
  cheminArrondi,
  cheminRempli,
  pointsDeCreneau,
  pointsDeSerie,
} from '@/lib/moi/courbe'

// LA VAGUE — le tracé qui accompagne un chiffre.
//
// Repris des applications de santé (cf. les maquettes du 06/08) : un trait épais
// aux angles arrondis, un halo dégradé en dessous, un point posé au bout. Il ne
// remplace pas un chiffre, il le QUALIFIE — « 12 jours » ne dit pas si la série
// vient de repartir ou si elle tient depuis un mois ; la vague le montre sans un
// mot de plus.
//
// La couleur vient du parent par `currentColor` (classe `text-…` de la famille
// d'habitude) : un seul composant, autant de teintes que de familles, et aucune
// couleur écrite en dur ici.
//
// Composant serveur : c'est du SVG statique, il n'y a rien à embarquer côté
// client. `preserveAspectRatio="none"` laisse la vague s'étirer à la largeur
// disponible sans déformer l'épaisseur du trait (`vector-effect`).

const L = 100
const H = 34

export default function Sparkline({
  jours,
  valeurs,
  className,
  avecPoint = true,
  titre,
}: {
  /** Série de OUI/NON (une habitude tenue ou non) → tracé en créneau. */
  jours?: readonly boolean[]
  /** Série de valeurs continues → vague. Ignorée si `jours` est fourni. */
  valeurs?: readonly number[]
  /** Teinte : une classe `text-…`, reprise par le tracé et le halo. */
  className?: string
  avecPoint?: boolean
  /** Description pour les lecteurs d'écran ; sans elle, le tracé est décoratif. */
  titre?: string
}) {
  const marge = 4
  const points = jours
    ? pointsDeCreneau(jours, L, H, marge)
    : pointsDeSerie(valeurs ?? [], L, H, marge)

  if (points.length === 0) return null

  // Un rayon généreux : c'est lui qui fait la différence entre un graphique de
  // tableur et la vague des maquettes. Il est raboté segment par segment
  // (cf. cheminArrondi), donc une série dense ne part pas en nœud.
  const ligne = cheminArrondi(points, jours ? 7 : 9)
  const surface = cheminRempli(ligne, points, H)
  const bout = points[points.length - 1]
  const id = `spark-${(titre ?? 'x').replace(/[^a-zA-Z0-9]/g, '')}-${points.length}`

  return (
    <span className={cn('relative block h-9 w-full', className)}>
      <svg
        viewBox={`0 0 ${L} ${H}`}
        preserveAspectRatio="none"
        className="block h-full w-full"
        role={titre ? 'img' : 'presentation'}
        aria-label={titre}
        aria-hidden={titre ? undefined : true}
      >
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.22" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={surface} fill={`url(#${id})`} />
        <path
          d={ligne}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          // Sans cet effet, l'étirement horizontal (preserveAspectRatio="none")
          // amincirait le trait autant qu'il élargit le tracé.
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {/* Le point du bout est en HTML, pas en SVG : un <circle> dans un cadre
          étiré (preserveAspectRatio="none") sortirait en ovale. */}
      {avecPoint ? (
        <span
          aria-hidden="true"
          className="absolute size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-current"
          style={{
            left: `${(bout.x / L) * 100}%`,
            top: `${(bout.y / H) * 100}%`,
          }}
        />
      ) : null}
    </span>
  )
}
