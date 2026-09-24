'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import ConfettiRain from '@/components/ConfettiRain'
import { Button } from '@/components/ui/button'
import XpIcon from '@/components/ui/XpIcon'
import { CristalIcon } from '@/components/ui/MonnaieIcon'
import { origineUnique, useRecompenses } from '@/components/recompenses/RecompensesProvider'
import { useSortieAnimee } from '@/components/useSortieAnimee'
import { useDialogFocus } from '@/lib/use-dialog'
import {
  annoncerBilanLigue,
  echelon,
  lignesGainsBilan,
  nombreFr,
  recitBilan, type BilanLigue, type Echelon } from '@/lib/ligue'
import type { Gain } from '@/lib/gains'
import { sfx } from '@/lib/sounds'
import { marquerBilanVu } from '@/app/amis/ligue-actions'
import { cn } from '@/lib/utils'
import s from './BilanSemaine.module.css'

// -----------------------------------------------------------------------------
// LA FIN DE SEMAINE DE LA LIGUE — « l'animation banger entre chaque
// changement » (Lucas, 24/09/2026). Un écran plein, violet profond, qui
// rejoue la clôture de la semaine passée : le blason, puis L'ÉVÉNEMENT à
// 1,1 s — nouveau rang (l'ancien blason s'envole, le nouveau arrive en
// tournoyant dans les rayons), nouvelle division (le blason se gonfle, un
// point s'allume, « Bronze 4 » bascule en « Bronze 3 »), maintien (il flotte)
// ou descente (il se tasse, le nom glisse vers le bas, sans alarme) — puis
// ce que la semaine a rapporté, ligne par ligne, et « Continuer ».
//
// Tout a DÉJÀ été versé par le serveur à la clôture (migration 376) : cet
// écran ne décide de rien. « Continuer » fait voler les gains vers le bandeau
// (le geste de Clash Royale), dit au serveur que le bilan est vu, et éteint la
// pastille de l'onglet.
// -----------------------------------------------------------------------------

const sAbonner = () => () => {}

const MOMENT_EVENEMENT_MS = 1100
const MOMENT_GAINS_MS = 2000

export default function BilanSemaine({ bilan, onFini }: { bilan: BilanLigue; onFini: () => void }) {
  const [open, setOpen] = useState(true)
  const { monte, etat, onAnimationEnd } = useSortieAnimee(open)
  const scene = useRef<HTMLDivElement>(null)
  const bouton = useRef<HTMLButtonElement>(null)
  useDialogFocus(scene, open)
  const { celebrer } = useRecompenses()
  // Le serveur ne rend rien (pas de <body> où porter l'écran) : à
  // l'hydratation non plus, sinon React refuse le portail. Il s'ouvre juste après.
  const client = useSyncExternalStore(sAbonner, () => true, () => false)

  const recit = recitBilan(bilan)
  const avant = echelon(bilan.echelonAvant)
  const apres = echelon(bilan.echelonApres)
  const lignes = lignesGainsBilan(bilan)
  const deuxBlasons = avant.rang.id !== apres.rang.id

  // Le son suit l'image : l'événement à 1,1 s, les gemmes quand elles tombent.
  useEffect(() => {
    const minuteurs = [
      window.setTimeout(() => {
        if (recit.mouvement === 'promu') {
          if (recit.nouveauRang) sfx.complete()
          else sfx.levelUp()
        } else if (recit.mouvement === 'maintenu') sfx.dayComplete()
      }, MOMENT_EVENEMENT_MS),
      window.setTimeout(() => {
        if (lignes.some((l) => l.unite === 'gemme' && l.montant > 0)) sfx.coin()
      }, MOMENT_GAINS_MS),
    ]
    return () => minuteurs.forEach((id) => window.clearTimeout(id))
    // Une seule fois, à l'ouverture : l'écran ne se rejoue pas.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Quand le voile a fini de sortir, l'onglet reprend la main.
  useEffect(() => {
    if (!monte) onFini()
  }, [monte, onFini])

  // Le bouton joue son propre son (components/ui/button).
  const continuer = () => {
    const gains: Gain[] = [
      { unite: 'gemme', montant: lignes.filter((l) => l.unite === 'gemme').reduce((t, l) => t + l.montant, 0) },
      { unite: 'xp', montant: lignes.filter((l) => l.unite === 'xp').reduce((t, l) => t + l.montant, 0) },
    ].filter((g): g is Gain => g.montant > 0)
    celebrer(gains, origineUnique(bouton.current, gains))
    annoncerBilanLigue(false)
    void marquerBilanVu(bilan.semaine)
    setOpen(false)
  }

  if (!monte || !client) return null

  const promu = recit.mouvement === 'promu'
  const sens = recit.mouvement === 'relegue' ? 'bas' : 'haut'

  return createPortal(
    <div
      data-etat={etat}
      onAnimationEnd={onAnimationEnd}
      className={s.voile}
    >
      {promu ? (
        <div className={s.confettis}>
          <ConfettiRain />
        </div>
      ) : null}

      <div
        ref={scene}
        role="dialog"
        aria-modal="true"
        aria-labelledby="bilan-titre"
        aria-describedby="bilan-phrase"
        className={cn(s.scene, 'outline-none')}
      >
        <p className={s.surtitre}>Fin de la semaine</p>

        <div className={cn(s.embleme, recit.nouveauRang && s.rang)} aria-hidden="true">
          {promu ? (
            <>
              <span className={s.halo} />
              <span className={s.rayonsCadre}>
                <span className={cn(s.rayons, 'block')} />
              </span>
              <span className={s.onde} />
              {recit.nouveauRang ? <span className={cn(s.onde, s.onde2)} /> : null}
            </>
          ) : null}
          {deuxBlasons ? (
            <>
              <Blason e={avant} className={cn(s.avant, !promu && s.avantBas)} />
              <Blason e={apres} className={promu ? s.apres : s.apresDoux} />
            </>
          ) : (
            <Blason e={apres} className={s[recit.mouvement]} />
          )}
        </div>

        <div className={s.division} data-sens={sens}>
          {avant.nom === apres.nom ? (
            <span className={s.nom}>{apres.nom}</span>
          ) : (
            <>
              <span aria-hidden="true" className={cn(s.nom, s.nomAvant)}>
                {avant.nom}
              </span>
              <span className={cn(s.nom, s.nomApres, promu && s.nomOr)}>{apres.nom}</span>
            </>
          )}
        </div>
        <PointsDeDivision avant={avant} apres={apres} />

        <p className={s.xp}>
          <XpIcon className="size-4" />
          {nombreFr(bilan.xp)} XP gagnés
        </p>

        <h2 id="bilan-titre" className={s.titre}>
          {recit.titre}
        </h2>
        <p id="bilan-phrase" className={s.phrase}>
          {recit.phrase}
        </p>

        {lignes.length > 0 ? (
          <ul className={s.gains} aria-label="Ce que la semaine t’a rapporté">
            {lignes.map((l, i) => (
              <li key={l.cle} className={s.gain} style={{ '--i': i } as React.CSSProperties}>
                <span>{l.libelle}</span>
                <span className={s.montant}>
                  +{nombreFr(l.montant)}
                  {l.unite === 'gemme' ? (
                    <CristalIcon className="-my-1 size-6" />
                  ) : (
                    <>
                      <XpIcon className="size-5" />
                      <span className="sr-only">XP</span>
                    </>
                  )}
                  {l.unite === 'gemme' ? <span className="sr-only">gemmes</span> : null}
                </span>
              </li>
            ))}
          </ul>
        ) : null}

        <div
          className={s.suite}
          style={{ '--retard-bouton': `${MOMENT_GAINS_MS + lignes.length * 150 + 250}ms` } as React.CSSProperties}
        >
          <Button ref={bouton} type="button" size="xl" shine={promu} className="w-full" onClick={continuer}>
            Continuer
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  )
}

function Blason({ e, className }: { e: Echelon; className?: string }) {
  return (
    <Image
      src={e.rang.image}
      alt=""
      width={320}
      height={320}
      // Le blason est l'image principale de l'écran : chargée d'emblée.
      loading="eager"
      className={cn(s.blason, className)}
    />
  )
}

/**
 * Les quatre points de la division (4 → 1, de gauche à droite) : autant de
 * points allumés que de divisions franchies dans le rang. Le point gagné
 * s'allume en éclatant, le point perdu s'éteint ; un nouveau rang rallume sa
 * rangée depuis le début. Rien au sommet (Maître n'a pas de division).
 */
function PointsDeDivision({ avant, apres }: { avant: Echelon; apres: Echelon }) {
  if (apres.division === null) return null
  const allumes = (e: Echelon) => (e.division === null ? 4 : 5 - e.division)
  const nApres = allumes(apres)
  const memeRang = avant.rang.id === apres.rang.id
  const nAvant = memeRang ? allumes(avant) : 0
  return (
    <div className={cn(s.pips, !memeRang && s.pipsNeufs)} aria-hidden="true">
      {Array.from({ length: 4 }, (_, i) => {
        const allume = i < nApres
        const nouveau = memeRang && allume && i >= nAvant
        const perdu = memeRang && !allume && i < nAvant
        return (
          <span
            key={i}
            className={cn(s.pip, nouveau && s.pipNouveau, perdu && s.pipPerdu)}
            style={{ '--i': i } as React.CSSProperties}
          >
            {allume || perdu ? <span className={s.lumiere} /> : null}
          </span>
        )
      })}
    </div>
  )
}
