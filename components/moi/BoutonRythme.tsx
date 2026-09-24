'use client'

import { useState } from 'react'
import { CalendarDays } from 'lucide-react'
import Feuille from '@/components/boutique/Feuille'
import RythmeBarres from '@/components/moi/RythmeBarres'
import { useFermeAuMasquage } from '@/components/useFermeAuMasquage'
import { formatDuree, type SemaineTravail } from '@/lib/moi/temps'
import { sfx } from '@/lib/sounds'

/**
 * « TON RYTHME », DEVENU UNE ICÔNE EN HAUT DE LA CARTE (Lucas, 24/09/2026 :
 * « le bloc Ton rythme va devenir une icône flottante placée en haut ») — il
 * a laissé sa place dans l'onglet Progrès au récap des matières révisées
 * (MatieresRevisees). Une pastille de verre, comme l'engrenage des réglages
 * à l'autre bout de la rangée : le calendrier et le temps de CETTE semaine.
 * Au toucher, les huit semaines en barres s'ouvrent dans une feuille.
 */
export default function BoutonRythme({
  semaines,
  phrase,
}: {
  semaines: readonly SemaineTravail[]
  phrase: string
}) {
  const [ouvert, setOuvert] = useState(false)
  useFermeAuMasquage(setOuvert, false)
  const cetteSemaine = semaines.at(-1)?.secondes ?? 0

  return (
    // La carte relance son reflet au moindre toucher : ni le bouton ni sa
    // feuille (un portail, dont les clics remontent l'arbre React) ne le
    // déclenchent.
    <span className="contents" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={() => {
          sfx.tap()
          setOuvert(true)
        }}
        aria-haspopup="dialog"
        aria-label={`Ton rythme : ${cetteSemaine > 0 ? formatDuree(cetteSemaine) : 'rien encore'} cette semaine`}
        className="font-heading flex h-9 items-center gap-1.5 rounded-full bg-white/14 pr-3 pl-2.5 text-[13px] font-extrabold text-white ring-1 ring-white/20 transition active:scale-95"
      >
        <CalendarDays className="size-[18px]" strokeWidth={2.4} aria-hidden="true" />
        {cetteSemaine > 0 ? formatDuree(cetteSemaine) : 'Rythme'}
      </button>
      <Feuille open={ouvert} onClose={() => setOuvert(false)} label="Ton rythme">
        <RythmeBarres semaines={semaines} phrase={phrase} nu />
      </Feuille>
    </span>
  )
}
