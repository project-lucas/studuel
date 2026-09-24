import { notFound } from 'next/navigation'
import WorldBackdrop from '@/components/WorldBackdrop'
import ArenaBackdrop from '@/components/ArenaBackdrop'

export const dynamic = 'force-dynamic'

// L'APERÇU DU FOND DE L'ARÈNE — en développement seulement, sans compte.
//
// Le décor de l'onglet Défi suit l'heure de l'appareil ; pour regarder une
// plage à n'importe quelle heure (et surtout l'arène VIVANTE, qui n'existe
// qu'à l'aube et le soir pour l'instant), cette page rend le même fond que /defi, sans
// le HUD, et honore l'override `?arena=…` d'ArenaBackdrop :
//
//   /dev/arene?arena=dawn        l'aube vivante : nuages, lueur, cascade, brume
//   /dev/arene?arena=evening     le soir vivant : étoiles, rocher, lanternes en plus
//   /dev/arene?arena=night       une plage restée fixe
export default function ApercuArenePage() {
  if (process.env.NODE_ENV === 'production') notFound()
  return (
    <>
      <WorldBackdrop className="defi-arena-bg">
        <ArenaBackdrop />
      </WorldBackdrop>
      <div className="min-h-dvh" />
    </>
  )
}
