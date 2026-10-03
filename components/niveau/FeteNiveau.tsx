'use client'

import { useEffect, useRef, useState, useSyncExternalStore, useTransition } from 'react'
import Image from 'next/image'
import coffrePalier from '@/public/images/niveau/coffre-palier-ferme.webp'
import Feuille from '@/components/boutique/Feuille'
import { Button } from '@/components/ui/button'
import { CristalIcon } from '@/components/ui/MonnaieIcon'
import { origineUnique, useRecompenses } from '@/components/recompenses/RecompensesProvider'
import { ouvrirPalierNiveau } from '@/app/niveau-actions'
import { GEMMES_PAR_NIVEAU, gemmesPalier, niveauxAFeter, paliersAOuvrir } from '@/lib/niveaux'
import type { Gain } from '@/lib/gains'
import { sfx } from '@/lib/sounds'

// -----------------------------------------------------------------------------
// LA FÊTE DE NIVEAU ET LES COFFRES DE PALIER (03/10/2026, lib/niveaux).
//
// Le navigateur retient le dernier niveau qu'il a FÊTÉ (localStorage) : quand
// le bandeau en affiche un plus haut, une feuille s'ouvre — « Niveau 9 ! », les
// 15 gemmes déjà versées, et sur un palier (tous les 5 niveaux) le coffre à
// ouvrir. La première fois, rien : on retient le niveau sans fêter ce qui a été
// gagné avant cette version.
// -----------------------------------------------------------------------------

const CLE_VU = 'studuel-niveau-fete'
const abonnes = new Set<() => void>()

function lireVu(): string {
  try {
    return localStorage.getItem(CLE_VU) ?? ''
  } catch {
    return ''
  }
}

function ecrireVu(niveau: number): void {
  try {
    localStorage.setItem(CLE_VU, String(niveau))
  } catch {
    // stockage indisponible : la fête pourra se rejouer, rien de plus
  }
  for (const f of abonnes) f()
}

function abonner(f: () => void): () => void {
  abonnes.add(f)
  return () => abonnes.delete(f)
}

export default function FeteNiveau({
  level,
  levelTitle,
  paliersOuverts,
}: {
  level: number
  levelTitle: string | null
  paliersOuverts: number[]
}) {
  const brut = useSyncExternalStore(abonner, lireVu, () => 'serveur')
  const vu = brut === '' ? null : Number(brut)

  // Première visite : on retient le niveau sans fête (système extérieur).
  useEffect(() => {
    if (brut === '') ecrireVu(level)
  }, [brut, level])

  const fete = brut === 'serveur' ? [] : niveauxAFeter(vu, level)
  if (fete.length === 0) return null

  return (
    <Feuille open onClose={() => ecrireVu(level)} label={`Niveau ${level} atteint`}>
      <div className="flex flex-col items-center gap-3 pt-4 pb-2 text-center">
        <p className="surtitre">Nouveau niveau</p>
        <h2 className="font-heading text-4xl font-extrabold text-primary">Niveau {level}&nbsp;!</h2>
        {levelTitle ? <p className="font-heading text-lg font-extrabold text-foreground">{levelTitle}</p> : null}
        <p className="font-heading inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-sm font-extrabold text-primary">
          <CristalIcon className="size-5" />+{GEMMES_PAR_NIVEAU * fete.length} gemmes reçues
        </p>
        <CoffresPalier niveau={level} ouverts={paliersOuverts} />
        <Button size="xl" className="mt-2 w-full" onClick={() => ecrireVu(level)}>
          Continuer
        </Button>
      </div>
    </Feuille>
  )
}

/**
 * Les coffres de palier atteints et pas encore ouverts — un bouton par coffre.
 * Partagé par la fête de niveau et la bulle du niveau du bandeau.
 */
export function CoffresPalier({ niveau, ouverts }: { niveau: number; ouverts: number[] }) {
  const [ouvertsIci, setOuvertsIci] = useState<number[]>([])
  const [message, setMessage] = useState<string | null>(null)
  const [pending, start] = useTransition()
  const { celebrer } = useRecompenses()
  const bouton = useRef<HTMLButtonElement>(null)
  const restants = paliersAOuvrir(niveau, [...ouverts, ...ouvertsIci])
  if (restants.length === 0) return message ? <p className="text-xs font-bold text-muted-foreground">{message}</p> : null
  const palier = restants[0]

  const ouvrir = () => {
    if (pending) return
    sfx.tap()
    start(async () => {
      const r = await ouvrirPalierNiveau(palier)
      if (r.ok) {
        sfx.coin()
        setOuvertsIci((v) => [...v, palier])
        const gains: Gain[] = [{ unite: 'gemme', montant: r.gemmes }]
        celebrer(gains, origineUnique(bouton.current, gains))
        setMessage(null)
      } else if (r.raison === 'deja_ouvert') {
        setOuvertsIci((v) => [...v, palier])
      } else {
        setMessage(r.raison === 'bientot' ? 'Les coffres de palier arrivent très bientôt.' : 'Le coffre ne s’est pas ouvert. Réessaie.')
      }
    })
  }

  return (
    <div className="flex w-full flex-col items-center gap-2 rounded-2xl bg-secondary/60 p-3">
      {/* Le coffre de palier dessiné (03/10/2026) : violet royal, étoile d'or. */}
      <Image
        src={coffrePalier}
        alt=""
        aria-hidden="true"
        width={256}
        height={256}
        className={pending ? 'size-20 animate-pulse object-contain' : 'size-20 object-contain'}
      />
      <p className="font-heading text-sm font-extrabold text-foreground">Coffre du niveau {palier}</p>
      <Button ref={bouton} type="button" onClick={ouvrir} disabled={pending} className="gap-1.5">
        Ouvrir · <CristalIcon className="size-4" />+{gemmesPalier(palier)}
      </Button>
      {message ? <p className="text-xs font-bold text-muted-foreground">{message}</p> : null}
    </div>
  )
}
