'use client'

import { useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import CoffreDessin from '@/components/amis/CoffreDessin'
import Feuille from '@/components/boutique/Feuille'
import { Button } from '@/components/ui/button'
import { CristalIcon } from '@/components/ui/MonnaieIcon'
import XpIcon from '@/components/ui/XpIcon'
import { origineUnique, useRecompenses } from '@/components/recompenses/RecompensesProvider'
import { useFermeAuMasquage } from '@/components/useFermeAuMasquage'
import { ouvrirCoffre } from '@/app/amis/ligue-actions'
import {
  annoncerCoffrePret,
  gainsOuverture,
  nombreFr,
  type CoffrePret,
  type OuvertureCoffre,
} from '@/lib/ligue'
import { sfx } from '@/lib/sounds'
import { cn } from '@/lib/utils'
import styles from '@/components/amis/PlaquesAmis.module.css'

/** « 14/09 » : le lundi d'une semaine, pour dire de quel coffre il s'agit. */
function dateCourte(semaine: string): string {
  return `${semaine.slice(8, 10)}/${semaine.slice(5, 7)}`
}

const MESSAGE_REFUS: Record<Extract<OuvertureCoffre, { ok: false }>['raison'], string> = {
  anonyme: 'Connecte-toi pour ouvrir ton coffre.',
  introuvable: 'Ce coffre n’existe plus.',
  deja_ouvert: 'Ce coffre a déjà été ouvert.',
  semaine: 'Ce coffre n’existe plus.',
  bientot: 'Le coffre s’ouvrira dès la prochaine mise à jour de l’app.',
  erreur: 'Le coffre ne s’est pas ouvert. Réessaie dans un instant.',
}

/**
 * LE COFFRE D'UNE SEMAINE FINIE, PRÊT À OUVRIR — un billet d'or en tête de la
 * plaque du coffre (Lucas, 24/09/2026 : « il ne pourra l'ouvrir que le lundi,
 * avec la notification que le coffre d'équipe est ouvert »). « Ouvrir »
 * demande l'ouverture au serveur et lève la feuille : le coffre tremble le
 * temps de la réponse, puis s'ouvre sur son contenu ; « Encaisser » fait voler
 * l'XP et les gemmes vers le bandeau. Le serveur a déjà tout versé à ce
 * moment-là : fermer la feuille autrement encaisse aussi.
 */
export default function OuvrirCoffre({ pret }: { pret: CoffrePret }) {
  const [ouverte, setOuverte] = useState(false)
  const [resultat, setResultat] = useState<OuvertureCoffre | null>(null)
  const [encaisse, setEncaisse] = useState(false)
  const [pending, start] = useTransition()
  const bouton = useRef<HTMLButtonElement>(null)
  const { celebrer } = useRecompenses()
  const router = useRouter()
  useFermeAuMasquage(setOuverte, false)

  const ouvrir = () => {
    sfx.tap()
    setOuverte(true)
    if (pending || resultat?.ok) return
    start(async () => {
      const r = await ouvrirCoffre(pret.semaine)
      setResultat(r)
      if (r.ok) sfx.coin()
    })
  }

  const fermer = () => {
    setOuverte(false)
    if (!resultat) return
    if (resultat.ok && !encaisse) {
      setEncaisse(true)
      annoncerCoffrePret(false)
      const gains = gainsOuverture(resultat)
      celebrer(gains, origineUnique(bouton.current, gains))
    } else if (!resultat.ok && resultat.raison === 'deja_ouvert') {
      annoncerCoffrePret(false)
      router.refresh()
    } else if (!resultat.ok) {
      // Un refus passager : on pourra retenter.
      setResultat(null)
    }
  }

  // Encaissé : le billet s'efface sans attendre la relecture de la page.
  if (encaisse) return null

  return (
    <div className={styles.pret}>
      <CoffreDessin ouvert className={styles.pretCoffre} />
      <div className="min-w-0 flex-1">
        <p className="font-heading text-[15px] leading-tight font-extrabold">Ton coffre est ouvert&nbsp;!</p>
        <p className="text-xs font-bold text-foreground/75">
          Niveau {pret.niveau} · semaine du {dateCourte(pret.semaine)}
        </p>
      </div>
      <Button type="button" size="sm" onClick={ouvrir} aria-haspopup="dialog" className="shrink-0">
        Ouvrir
      </Button>

      <Feuille open={ouverte} onClose={fermer} label={`Coffre d’équipe, niveau ${pret.niveau}`}>
        <div className={cn(styles.ouvertureScene, 'flex flex-col items-center gap-3 pt-4 text-center')}>
          {resultat?.ok ? (
            <CoffreDessin ouvert className={cn('size-32', styles.ouverture)} />
          ) : (
            <CoffreDessin className={cn('size-32', pending && styles.secoue)} />
          )}

          {resultat === null || pending ? (
            <p role="status" className="font-heading text-xl font-extrabold">
              Ouverture…
            </p>
          ) : resultat.ok ? (
            <>
              <h2 className="font-heading text-2xl leading-tight font-extrabold">Coffre niveau {resultat.niveau}&nbsp;!</h2>
              <ul aria-label="Contenu du coffre" className="flex w-full justify-center gap-3">
                <li className="font-heading flex flex-1 flex-col items-center gap-1 rounded-2xl bg-highlight/15 px-3 py-3 text-xl font-extrabold tabular-nums ring-2 ring-highlight/50">
                  <XpIcon className="size-8" />+{nombreFr(resultat.xp)}&nbsp;XP
                </li>
                <li className="font-heading flex flex-1 flex-col items-center gap-1 rounded-2xl bg-primary/10 px-3 py-3 text-xl font-extrabold tabular-nums ring-2 ring-primary/30">
                  <CristalIcon className="size-8" />+{resultat.gemmes}
                  <span className="sr-only"> gemmes</span>
                </li>
              </ul>
              {resultat.niveauAvant !== null &&
              resultat.niveauApres !== null &&
              resultat.niveauApres > resultat.niveauAvant ? (
                <p className="text-sm font-bold text-muted-foreground">
                  Niveau {resultat.niveauAvant} → {resultat.niveauApres}
                  {resultat.gemmesNiveau > 0 ? ` : +${resultat.gemmesNiveau} gemmes de plus` : ''}
                </p>
              ) : null}
              <button
                ref={bouton}
                type="button"
                onClick={fermer}
                className="olympe-gold olympe-press font-heading mt-1 flex min-h-13 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl text-base font-extrabold"
              >
                Encaisser
              </button>
            </>
          ) : (
            <>
              <p role="alert" className="text-sm font-bold text-balance text-foreground/80">
                {MESSAGE_REFUS[resultat.raison]}
              </p>
              <Button type="button" size="lg" variant="outline" onClick={fermer} className="w-full">
                Fermer
              </Button>
            </>
          )}
        </div>
      </Feuille>
    </div>
  )
}
