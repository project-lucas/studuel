import { notFound } from 'next/navigation'
import CarnetButton from '@/components/carnet/CarnetButton'
import SerieBar from '@/components/reviser/SerieBar'
import { toDayKey } from '@/lib/streak'

export const dynamic = 'force-dynamic'

// L'APERÇU DE LA CARTE DE SÉRIE — en développement seulement.
//
// La semaine en flammes (04/10/2026) : une semaine de démonstration, sans base
// ni compte. La date du jour est forcée au DIMANCHE de la semaine courante
// pour que chaque cas ait ses sept jours.
//
//   /dev/serie                 en série : cinq jours d'affilée, aujourd'hui fait
//   /dev/serie?etat=parfaite   sept jours sur sept : la semaine passe à l'or
//   /dev/serie?etat=trous      des jours manqués (braises), aujourd'hui à faire
//   /dev/serie?etat=avant      aujourd'hui pas encore fait, la veille faite
//   /dev/serie?etat=gel        un jour manqué couvert par un gel (glaçon)
//   ?serie=5                   la flamme bleue (dès 5 jours)
//   ?gels=0|1|2                la réserve de gels posée sur la flamme (1 par défaut)
//   ?fete=1                    rejoue la validation du jour (et la fête parfaite
//                              se rejoue en vidant le stockage du navigateur)
export default async function ApercuSerie({
  searchParams,
}: {
  searchParams: Promise<{ etat?: string; serie?: string; gels?: string }>
}) {
  if (process.env.NODE_ENV === 'production') notFound()
  const { etat = 'serie', serie, gels = '1' } = await searchParams
  const now = new Date()
  const lundi = new Date(now)
  lundi.setUTCDate(now.getUTCDate() - ((now.getUTCDay() + 6) % 7))
  const dimanche = new Date(lundi)
  dimanche.setUTCDate(lundi.getUTCDate() + 6)
  const today = toDayKey(dimanche)

  const motifs: Record<string, string> = {
    serie: '..xxxxX',
    parfaite: 'xxxxxxX',
    trous: 'xx.x..T',
    avant: '.xxxxxT',
    gel: '.xxgxxX',
  }
  const motif = motifs[etat] ?? motifs.serie
  const week = [...motif].map((c) => ({
    done: c === 'x' || c === 'X',
    isToday: c === 'T' || c === 'X',
    isFuture: false,
    ...(c === 'g' ? { gele: true } : {}),
  }))
  const parDefaut = etat === 'parfaite' ? 12 : etat === 'serie' ? 3 : etat === 'avant' || etat === 'gel' ? 5 : 0
  const streak = Number.isFinite(Number(serie)) && serie ? Math.max(0, Math.floor(Number(serie))) : parDefaut

  return (
    <div className="rev-monde mx-auto w-full max-w-md px-4 py-6">
      <SerieBar
        streak={streak}
        week={week}
        today={today}
        controles={[]}
        subjectMeta={{}}
        subjects={[]}
        goalMinutes={15}
        gelsEnReserve={Math.min(2, Math.max(0, Math.floor(Number(gels)) || 0))}
        carnetSlot={<CarnetButton coursesCount={3} questionsCount={42} pleineLargeur />}
      />
    </div>
  )
}
