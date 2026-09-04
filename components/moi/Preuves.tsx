import type { ReactNode } from 'react'
import { Clock } from 'lucide-react'
import { Chiffre } from '@/components/moi/ChiffreCell'
import { formatDuree, libelleCetteSemaine, type SemaineTravail } from '@/lib/moi/temps'

// -----------------------------------------------------------------------------
// LES TROIS PREUVES — série · temps · moyenne — en trois tuiles.
//
// Trois chiffres qu'un élève reconnaît comme siens, et dont deux ne peuvent que
// monter. Ils étaient six sur une plaque, mêlés aux stats d'arène (duels,
// victoires) : on ne garde ici que ce qui NE REDESCEND JAMAIS. Les trophées
// sont montés dans la carte, les duels et victoires ont l'arène pour eux.
//
// Chaque tuile est rendue par le serveur, sauf celle des notes (cliente : elle
// ouvre la saisie des moyennes) — passée en nœud pour cette raison.
// -----------------------------------------------------------------------------

/** La courbe des huit semaines, sous le temps cumulé. */
function CourbeTemps({ semaines }: { semaines: readonly SemaineTravail[] }) {
  if (semaines.length < 2) return null
  const max = Math.max(1, ...semaines.map((s) => s.secondes))
  const largeur = 80
  const hauteur = 18
  const points = semaines.map((s, i) => {
    const x = (i / (semaines.length - 1)) * largeur
    const y = hauteur - 2 - (s.secondes / max) * (hauteur - 4)
    return `${x.toFixed(1)},${y.toFixed(1)}`
  })
  const [dernierX, dernierY] = points[points.length - 1].split(',')
  return (
    <svg
      viewBox={`0 0 ${largeur} ${hauteur}`}
      preserveAspectRatio="none"
      className="h-[18px] w-full"
      aria-hidden="true"
    >
      <polyline
        points={points.join(' ')}
        fill="none"
        stroke="var(--primary)"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx={dernierX} cy={dernierY} r="2.5" fill="var(--highlight)" />
    </svg>
  )
}

export default function Preuves({
  serie,
  record,
  secondesTotal,
  semaines,
  tuileMoyenne,
}: {
  serie: number
  record: number
  secondesTotal: number
  semaines: readonly SemaineTravail[]
  tuileMoyenne: ReactNode
}) {
  const tendance = libelleCetteSemaine(semaines)
  return (
    <section aria-label="Tes trois preuves" className="grid grid-cols-3 gap-2.5">
      <div className="moi-preuve">
        <Chiffre
          ton="serie"
          illustration="/images/serie/flamme.webp"
          illustrationEteinte={serie === 0}
          valeur={serie > 0 ? `${serie} j` : '0 j'}
          legende={
            serie > 0
              ? `de série · record ${record}`
              : record > 0
                ? `Relance ta série · record ${record}`
                : 'Lance ta série : une session'
          }
        />
      </div>
      <div className="moi-preuve">
        <Chiffre
          ton="travail"
          Icon={Clock}
          valeur={secondesTotal > 0 ? formatDuree(secondesTotal) : '0 min'}
          graphe={<CourbeTemps semaines={semaines} />}
          legende={
            tendance ?? (secondesTotal > 0 ? 'de travail au total' : 'Commence une session')
          }
        />
      </div>
      <div className="moi-preuve">{tuileMoyenne}</div>
    </section>
  )
}
