'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import Image from 'next/image'
import coffreFerme from '@/public/images/niveau/coffre-palier-ferme.webp'
import coffreOuvert from '@/public/images/niveau/coffre-palier-ouvert.webp'
import { CristalIcon } from '@/components/ui/MonnaieIcon'
import { useRecompenses } from '@/components/recompenses/RecompensesProvider'
import { ouvrirPalierNiveau, type OuverturePalier } from '@/app/niveau-actions'
import { PLUIE_GEMMES, dureePluie, goutteGemme } from '@/lib/gains'
import { gemmesPalier, paliersAOuvrir } from '@/lib/niveaux'
import { buzz, sfx } from '@/lib/sounds'
import { cn } from '@/lib/utils'
import s from './FeteNiveau.module.css'

/**
 * LE COFFRE DE PALIER (tous les 5 niveaux, migration 556) — un bouton d'or
 * par coffre atteint et pas encore ouvert. Partagé par la fête de niveau
 * (`sombre`, sur son voile violet) et la bulle du niveau du bandeau.
 *
 * DEPUIS LE 25/10/2026 (cadrage « le jeu vivant » § B), l'ouverture est une
 * cérémonie : le coffre tremble le temps de la réponse, s'ouvre, dix cristaux
 * en tombent EN PLUIE (lib/gains → goutteGemme, transform et opacité), puis le
 * ruban « Récompenses » s'ouvre avec ce que le serveur a VERSÉ — un tap, et
 * les gemmes volent vers le bandeau.
 */
export function CoffresPalier({
  niveau,
  ouverts,
  sombre = false,
  ouvrir: demander = ouvrirPalierNiveau,
}: {
  niveau: number
  ouverts: number[]
  sombre?: boolean
  /** L'ouverture au serveur — remplaçable par l'aperçu `/dev/niveau` (sans compte). */
  ouvrir?: (palier: number) => Promise<OuverturePalier>
}) {
  const [ouvertsIci, setOuvertsIci] = useState<number[]>([])
  const [message, setMessage] = useState<string | null>(null)
  const [ouvert, setOuvert] = useState<{ palier: number; gemmes: number } | null>(null)
  const [pending, start] = useTransition()
  const { ouvrirRuban } = useRecompenses()
  const bouton = useRef<HTMLButtonElement>(null)
  const restants = paliersAOuvrir(niveau, [...ouverts, ...ouvertsIci])

  // La pluie finie, le ruban prend la suite avec les gemmes versées.
  useEffect(() => {
    if (!ouvert) return
    const t = setTimeout(
      () =>
        ouvrirRuban([{ unite: 'gemme', montant: ouvert.gemmes }], {
          sousTitre: `Coffre du niveau ${ouvert.palier}`,
        }),
      dureePluie(PLUIE_GEMMES) + 150,
    )
    return () => clearTimeout(t)
  }, [ouvert, ouvrirRuban])

  if (ouvert) {
    return (
      <div className={cn(s.coffre, sombre && s.coffreSombre)}>
        <div className={s.coffreScene}>
          <Image
            src={coffreOuvert}
            alt=""
            aria-hidden="true"
            width={256}
            height={256}
            loading="eager"
            unoptimized
            className={cn(s.coffreImage, s.coffreOuvertPop)}
          />
          <PluieGemmes />
        </div>
        <p className={s.coffreNom}>Coffre du niveau {ouvert.palier} ouvert !</p>
        <p className={s.coffreGain} role="status">
          <CristalIcon className="size-5" />+{ouvert.gemmes}
          <span className="sr-only"> gemmes</span>
        </p>
      </div>
    )
  }

  if (restants.length === 0) return message ? <p className={s.coffreMessage}>{message}</p> : null
  const palier = restants[0]

  const ouvrir = () => {
    if (pending) return
    sfx.tap()
    start(async () => {
      const r = await demander(palier)
      if (r.ok) {
        sfx.treasure()
        buzz(true, 3)
        setOuvertsIci((v) => [...v, palier])
        setOuvert({ palier, gemmes: r.gemmes })
        setMessage(null)
      } else if (r.raison === 'deja_ouvert') {
        setOuvertsIci((v) => [...v, palier])
      } else {
        setMessage(r.raison === 'bientot' ? 'Les coffres de palier arrivent très bientôt.' : 'Le coffre ne s’est pas ouvert. Réessaie.')
      }
    })
  }

  return (
    <div className={cn(s.coffre, sombre && s.coffreSombre)}>
      <div className={s.coffreScene}>
        {/* Le coffre de palier dessiné (03/10/2026) : violet royal, étoile d'or. */}
        <Image
          src={coffreFerme}
          alt=""
          aria-hidden="true"
          width={256}
          height={256}
          loading="eager"
          unoptimized
          className={cn(s.coffreImage, pending && s.coffreSecoue)}
        />
      </div>
      <p className={s.coffreNom}>Coffre du niveau {palier}</p>
      <button
        ref={bouton}
        type="button"
        onClick={ouvrir}
        disabled={pending}
        className={cn('olympe-gold olympe-press', s.boutonOr)}
      >
        {pending ? 'Ouverture…' : 'Ouvrir'}
        <span className={s.boutonOrPrix}>
          <CristalIcon className="size-5" />+{gemmesPalier(palier)}
        </span>
      </button>
      {message ? <p className={s.coffreMessage}>{message}</p> : null}
    </div>
  )
}

/**
 * Dix cristaux qui tombent du coffre ouvert. Chaque goutte est décalée par un
 * style en ligne (sa place, son retard, sa durée, sa taille) ; la CHUTE, elle,
 * est une image-clé littérale, deux sens de rotation.
 */
function PluieGemmes() {
  return (
    <span className={s.pluie} aria-hidden="true">
      {Array.from({ length: PLUIE_GEMMES }, (_, i) => {
        const g = goutteGemme(i, PLUIE_GEMMES)
        return (
          <span key={i} className={s.goutte} style={{ transform: `translateX(${g.x}px)` }}>
            <span
              className={s.cristal}
              data-sens={g.sens}
              style={{
                animationDelay: `${g.retard}ms`,
                animationDuration: `${g.duree}ms`,
                width: `${(g.echelle * 1.5).toFixed(2)}rem`,
              }}
            >
              <CristalIcon className="size-full" />
            </span>
          </span>
        )
      })}
    </span>
  )
}
