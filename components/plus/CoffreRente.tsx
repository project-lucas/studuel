'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CristalIcon } from '@/components/ui/MonnaieIcon'
import { origineUnique, useRecompenses } from '@/components/recompenses/RecompensesProvider'
import { recolterRente } from '@/app/plus/actions'
import { RENTE_PLAFOND, SECONDES_PAR_GEMME, etatRente, phraseRente, promesseRente } from '@/lib/studuel-plus/rente'
import { PRIX_FICHE_GEMMES } from '@/lib/studuel-plus/formule'
import { sfx } from '@/lib/sounds'
import { toast } from '@/lib/toast'
import type { Gain } from '@/lib/gains'

/**
 * LE COFFRE DE RENTE (15/10/2026) — la rente de gemmes de Studuel+ qui pousse
 * sous les yeux de l'élève : le compteur monte d'une gemme toutes les 2 h 48,
 * l'anneau se remplit vers 60, et « Récolter » fait voler les gemmes vers le
 * bandeau. Plein, le coffre le dit en or : il ne pousse plus.
 *
 * L'heure vient de la BASE (`maintenantMs`) : l'écran se recale sur elle une
 * fois, puis avance avec l'horloge du téléphone — une montre déréglée ne fait
 * ni gagner ni perdre une gemme (c'est la base qui compte à la récolte).
 *
 * L'ILLUSTRATION du coffre viendra plus tard (Lucas : « les illustrations, nous
 * verrons plus tard ») : en attendant, la gemme de l'app dans un anneau.
 */
export default function CoffreRente({
  depuisMs,
  maintenantMs,
  total,
}: {
  depuisMs: number
  maintenantMs: number
  total: number
}) {
  const [depuis, setDepuis] = useState(depuisMs)
  const [cumul, setCumul] = useState(total)
  // Écart entre l'horloge de la base et celle du téléphone, mesuré au montage.
  const decalage = useRef<number | null>(null)
  const [maintenant, setMaintenant] = useState(maintenantMs)
  const [pending, start] = useTransition()
  const bouton = useRef<HTMLButtonElement>(null)
  const { celebrer } = useRecompenses()

  useEffect(() => {
    decalage.current = maintenantMs - Date.now()
    const tic = () => setMaintenant(Date.now() + (decalage.current ?? 0))
    const id = window.setInterval(tic, 30_000)
    return () => window.clearInterval(id)
  }, [maintenantMs])

  const etat = etatRente(depuis, maintenant)
  const angle = Math.round(etat.remplissage * 360)

  const recolter = () => {
    if (pending || etat.gemmes === 0) return
    start(async () => {
      const r = await recolterRente()
      if (r.ok) {
        sfx.coin()
        const gains: Gain[] = [{ unite: 'gemme', montant: r.gemmes }]
        celebrer(gains, origineUnique(bouton.current, gains))
        // La base a reculé le départ de ce qu'ELLE a payé (r.gemmes, pas ce que
        // l'horloge du téléphone croyait) ; plein, elle repart de maintenant.
        setDepuis(r.gemmes >= RENTE_PLAFOND ? maintenant : depuis + r.gemmes * SECONDES_PAR_GEMME * 1000)
        setCumul((c) => c + r.gemmes)
      } else if (r.raison === 'vide') {
        toast('Ton coffre vient d’être récolté.', 'error')
      } else if (r.raison === 'abonnement') {
        toast('La rente fait partie de Studuel+.', 'error')
      } else if (r.raison === 'indisponible') {
        toast('La rente ouvre très bientôt.', 'error')
      } else {
        toast('Récolte impossible pour le moment. Réessaie.', 'error')
      }
    })
  }

  return (
    <section id="rente" aria-labelledby="rente-titre" className="carte scroll-mt-24 p-4">
      <div className="flex items-center gap-4">
        <div
          className="relative grid size-24 shrink-0 place-items-center rounded-full"
          style={{
            background: `conic-gradient(var(${etat.plein ? '--highlight' : '--primary'}) ${angle}deg, var(--secondary) ${angle}deg)`,
          }}
          aria-hidden="true"
        >
          <div className="bg-card grid size-[4.75rem] place-items-center rounded-full">
            <CristalIcon className="size-10" />
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <h2 id="rente-titre" className="titre-section">
            Ta rente
          </h2>
          <p className="font-heading mt-0.5 text-3xl leading-none font-extrabold tabular-nums">
            {etat.gemmes}
            <span className="text-muted-foreground text-base font-bold"> / {RENTE_PLAFOND}</span>
          </p>
          <p className="text-muted-foreground mt-1 text-xs font-semibold text-balance">{phraseRente(etat)}</p>
        </div>
      </div>

      <Button
        ref={bouton}
        type="button"
        size="xl"
        shine={etat.plein}
        onClick={recolter}
        disabled={pending || etat.gemmes === 0}
        className="mt-4 w-full"
      >
        <CristalIcon className="size-5" />
        {etat.gemmes > 0 ? `Récolter ${etat.gemmes} gemme${etat.gemmes > 1 ? 's' : ''}` : 'Ton coffre se remplit'}
      </Button>

      <p className="text-muted-foreground mt-3 text-center text-[11.5px] font-semibold text-balance">
        {promesseRente()} — une fiche coûte {PRIX_FICHE_GEMMES} gemmes.
        {cumul > 0 ? ` Ta rente t’a déjà versé ${cumul} gemmes.` : ''}{' '}
        <Link href="/carnet?rayon=fiches" className="text-primary font-extrabold underline-offset-4 hover:underline">
          Mes fiches
        </Link>
      </p>
    </section>
  )
}
