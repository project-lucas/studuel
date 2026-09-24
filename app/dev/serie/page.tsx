import { notFound } from 'next/navigation'
import CarnetButton from '@/components/carnet/CarnetButton'
import SerieBar from '@/components/reviser/SerieBar'
import { toDayKey } from '@/lib/streak'

export const dynamic = 'force-dynamic'

// L'APERÇU DE LA BARRE DE SÉRIE — en développement seulement.
//
// La validation du jour ne se joue qu'une fois par jour, au retour d'une
// vraie session : pour la relire (le retournement, la coche qui se trace,
// l'onde), cette page rend la barre avec une semaine de démonstration où le
// jour est fait, sans base ni compte.
//
//   /dev/serie            la barre, le jour fait (la validation se joue une fois)
//   /dev/serie?fete=1     la validation rejoue à chaque chargement
//
// Le bouton « Ma bibliothèque » est posé en pied de carte, comme dans Réviser.
export default function ApercuSerie() {
  if (process.env.NODE_ENV === 'production') notFound()
  const now = new Date()
  const today = toDayKey(now)
  const dow = (now.getUTCDay() + 6) % 7 // lundi = 0
  const week = Array.from({ length: 7 }, (_, i) => ({
    done: i === dow || i === Math.max(0, dow - 1),
    isToday: i === dow,
    isFuture: i > dow,
  }))
  return (
    <div className="rev-monde mx-auto w-full max-w-md px-4 py-6">
      <SerieBar
        streak={2}
        week={week}
        today={today}
        controles={[]}
        subjectMeta={{}}
        subjects={[]}
        goalMinutes={15}
        carnetSlot={<CarnetButton coursesCount={3} questionsCount={42} pleineLargeur />}
      />
    </div>
  )
}
