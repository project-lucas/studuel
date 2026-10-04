'use client'

import { useEffect, useState, useTransition } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import XpIcon from '@/components/ui/XpIcon'
import { CristalIcon } from '@/components/ui/MonnaieIcon'
import PanneauRecompenses from '@/components/recompenses/PanneauRecompenses'
import { commencerAnnale, terminerAnnale } from '@/app/reviser/[subject]/annales/actions'
import { ANNALE_MINUTES_MIN, BAREME_XP, gemmesEpreuve } from '@/lib/economie'
import type { Gain } from '@/lib/gains'

/**
 * LA FIN D'UNE ANNALE (557) : « J'ai traité ce sujet ». Un sujet du bac est
 * l'épreuve la plus lourde de l'app : 150 XP et 10 gemmes, une fois par
 * annale, au bout d'au moins 15 minutes passées dessus (le serveur tient le
 * chrono depuis la première ouverture). La carte dit ce qu'on gagne AVANT,
 * pour donner envie de composer jusqu'au bout.
 */
export default function ValiderAnnale({ annaleId }: { annaleId: string }) {
  const [etat, setEtat] = useState<'inconnu' | 'a_faire' | 'traitee'>('inconnu')
  const [message, setMessage] = useState<string | null>(null)
  const [gains, setGains] = useState<Gain[]>([])
  const [pending, start] = useTransition()

  useEffect(() => {
    let vivant = true
    commencerAnnale(annaleId)
      .then((r) => {
        if (vivant) setEtat(r.traitee ? 'traitee' : 'a_faire')
      })
      .catch(() => {
        if (vivant) setEtat('a_faire')
      })
    return () => {
      vivant = false
    }
  }, [annaleId])

  const valider = () =>
    start(async () => {
      const r = await terminerAnnale(annaleId)
      if (r.ok) {
        setGains(r.gains)
        setEtat('traitee')
        setMessage(null)
      } else if (r.raison === 'trop_tot') {
        setMessage(
          `Prends le temps de composer : encore ${r.minutes} min sur ce sujet avant de le valider.`,
        )
      } else {
        setMessage('La validation n’est pas passée. Réessaie dans un instant.')
      }
    })

  if (etat === 'traitee') {
    return (
      <section className="carte flex flex-col items-center gap-3 p-4 text-center">
        <p className="font-heading flex items-center gap-2 text-lg font-extrabold text-success">
          <CheckCircle2 className="size-5" aria-hidden="true" />
          Sujet traité
        </p>
        <PanneauRecompenses gains={gains} titre="Gagné" className="w-full" />
      </section>
    )
  }

  return (
    <section aria-labelledby="valider-annale" className="carte flex flex-col gap-3 p-4">
      <h2 id="valider-annale" className="titre-section">
        Tu as composé ?
      </h2>
      <p className="text-sm text-muted-foreground">
        Un sujet du bac traité jusqu’au bout, c’est la plus grosse récompense de l’app.
      </p>
      <p className="font-heading flex items-center gap-3 text-base font-extrabold">
        <span className="flex items-center gap-1">
          <XpIcon className="size-5" />+{BAREME_XP.annale.maxPartie} XP
        </span>
        <span className="flex items-center gap-1">
          <CristalIcon className="size-5" />+{gemmesEpreuve('annale', 20)} gemmes
        </span>
      </p>
      <Button size="xl" className="w-full" onClick={valider} disabled={pending || etat === 'inconnu'}>
        J’ai traité ce sujet
      </Button>
      <p className="text-xs text-muted-foreground">
        {message ?? `Il faut au moins ${ANNALE_MINUTES_MIN} minutes sur le sujet pour le valider.`}
      </p>
    </section>
  )
}
