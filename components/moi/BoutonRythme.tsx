'use client'

import { useState } from 'react'
import type { ReactNode } from 'react'
import CompteurVerre from '@/components/moi/CompteurVerre'
import Feuille from '@/components/boutique/Feuille'
import RythmeBarres from '@/components/moi/RythmeBarres'
import { useFermeAuMasquage } from '@/components/useFermeAuMasquage'
import { formatDuree, type SemaineTravail } from '@/lib/moi/temps'
import { sfx } from '@/lib/sounds'

/**
 * « TON RYTHME » EST LA PASTILLE « TRAVAIL » DE LA CARTE (Lucas, 25/09/2026 :
 * « assemble ces deux blocs ») : l'icône du haut disait « 11 min » et la
 * pastille aussi, deux fois le même chiffre à deux endroits. La pastille garde
 * son dessin (CompteurVerre) et ouvre, au toucher, les huit semaines.
 *
 * Avant : « TON RYTHME », DEVENU UNE ICÔNE EN HAUT DE LA CARTE (Lucas, 24/09/2026 :
 * « le bloc Ton rythme va devenir une icône flottante placée en haut ») — il
 * a laissé sa place dans l'onglet Progrès au récap des matières révisées,
 * lui-même remplacé le 01/10/2026 par le classement entre amis
 * (ClassementAmis). Une pastille de verre, comme l'engrenage des réglages
 * à l'autre bout de la rangée : le calendrier et le temps de CETTE semaine.
 * Au toucher, les huit semaines en barres s'ouvrent dans une feuille.
 */
export default function BoutonRythme({
  semaines,
  phrase,
  valeur,
}: {
  semaines: readonly SemaineTravail[]
  phrase: string
  /** Le chiffre de la pastille : le temps de travail total. */
  valeur: ReactNode
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
        aria-label={`Temps de travail : ton rythme, ${cetteSemaine > 0 ? formatDuree(cetteSemaine) : 'rien encore'} cette semaine`}
        className="flex w-full min-w-0 transition active:scale-95"
      >
        <CompteurVerre valeur={valeur} legende="travail" className="w-full" />
      </button>
      <Feuille open={ouvert} onClose={() => setOuvert(false)} label="Ton rythme">
        <RythmeBarres semaines={semaines} phrase={phrase} nu />
      </Feuille>
    </span>
  )
}
