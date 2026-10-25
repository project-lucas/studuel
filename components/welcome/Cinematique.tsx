'use client'

import { useCallback, useEffect, useState, useSyncExternalStore } from 'react'
import { preload } from 'react-dom'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import {
  CINEMATIQUE,
  MS_AUTO_AVANCE,
  MS_PAR_MOT,
  dureeEcriture,
  mots,
  type TableauCinematique,
} from '@/lib/welcome/cinematique'
import OnbButton from './OnbButton'
import { POSES } from './MarcelParle'
import s from './cinematique.module.css'

// LA CINÉMATIQUE D'OUVERTURE (25/10/2026) — la première de Studuel, avec
// Marcel. Cinq tableaux peints qui s'enchaînent en fondu, chacun animé d'un
// lent mouvement de caméra ; en bas, sur un dégradé prune, la phrase de Marcel
// s'écrit mot à mot, son médaillon à côté pour signer la voix off.
//
// Les gestes, façon jeu mobile : un tap n'importe où finit la phrase d'un
// coup, le tap suivant passe au tableau d'après ; sans geste, le tableau
// suivant vient tout seul (MS_AUTO_AVANCE) ; « Passer » dès la première
// seconde ; le dernier tableau se termine par « C'est parti ». Aucune vidéo,
// aucun son : ≈ 320 Ko d'images en tout, préchargées pour des fondus nets.
//
// Elle s'auto-suffit (prop `onFin`) : l'onboarding la joue à l'étape `tuto`
// (WelcomeFlow), la page /dev/cinematique la rejoue à volonté.

const DERNIER = CINEMATIQUE.length - 1

/** Précharge les cinq tableaux en priorité basse. À poser sur l'écran d'AVANT
 *  (l'accueil) : le temps que l'élève lise l'intro, les images sont là. */
export function PrechargeCinematique() {
  for (const t of CINEMATIQUE) preload(t.image, { as: 'image', fetchPriority: 'low' })
  return null
}

const REQUETE_MOUVEMENT_REDUIT = '(prefers-reduced-motion: reduce)'

function abonneMouvementReduit(cb: () => void) {
  const mq = window.matchMedia(REQUETE_MOUVEMENT_REDUIT)
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}

function litMouvementReduit() {
  return window.matchMedia(REQUETE_MOUVEMENT_REDUIT).matches
}

function useMouvementReduit() {
  return useSyncExternalStore(abonneMouvementReduit, litMouvementReduit, () => false)
}

export default function Cinematique({
  onFin,
  tableauInitial = 0,
}: {
  /** « Passer », ou « C'est parti » à la fin. */
  onFin: () => void
  /** Le tableau d'ouverture (0-based) — page de développement seulement. */
  tableauInitial?: number
}) {
  const [index, setIndex] = useState(() => Math.min(Math.max(0, tableauInitial), DERNIER))
  const reduit = useMouvementReduit()
  // Les cinq images, dès le montage (et dès le rendu serveur si la page
  // s'ouvre directement ici) : le fondu suivant ne doit jamais attendre.
  for (const t of CINEMATIQUE) preload(t.image, { as: 'image' })

  const suivant = useCallback(() => setIndex((i) => Math.min(i + 1, DERNIER)), [])
  const dernier = index === DERNIER
  const tableau = CINEMATIQUE[index]
  // Le tableau précédent reste monté sous le nouveau le temps du fondu (il
  // garde son mouvement : pas de saut sous le fondu). Au tableau d'après, il
  // est retiré — couvert depuis longtemps.
  const visibles = index === 0 ? [0] : [index - 1, index]

  return (
    <div className={s.scene} role="region" aria-label="Cinématique d’ouverture">
      {visibles.map((i) => (
        <div
          key={i}
          className={s.tableau}
          data-mouvement={CINEMATIQUE[i].mouvement}
          style={{ zIndex: i === index ? 1 : 0 }}
        >
          <Image
            src={CINEMATIQUE[i].image}
            alt={CINEMATIQUE[i].alt}
            fill
            unoptimized
            priority
            sizes="100vw"
            draggable={false}
            className={s.image}
          />
        </div>
      ))}

      {/* La phrase entière pour le lecteur d'écran — la version visible,
          écrite mot à mot, lui est cachée. */}
      <p className="sr-only" aria-live="polite">
        {tableau.texte}
      </p>

      <Scene
        key={index}
        tableau={tableau}
        premier={index === 0}
        dernier={dernier}
        reduit={reduit}
        onSuivant={suivant}
        onFin={onFin}
      />

      <div className={s.haut}>
        <div
          className={s.segments}
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={CINEMATIQUE.length}
          aria-valuenow={index + 1}
          aria-label={`Tableau ${index + 1} sur ${CINEMATIQUE.length}`}
        >
          {CINEMATIQUE.map((t, i) => (
            <span
              key={t.id}
              className={s.segment}
              data-etat={i < index ? 'fait' : i === index ? 'en-cours' : 'a-venir'}
            >
              {i === index ? (
                <span
                  key={index}
                  className={s.remplissage}
                  style={{ animationDuration: `${MS_AUTO_AVANCE}ms` }}
                />
              ) : null}
            </span>
          ))}
        </div>
        <button type="button" className={s.passer} onClick={onFin}>
          Passer
        </button>
      </div>
    </div>
  )
}

// Un tableau : SA phrase, SES minuteurs. Remonté à chaque changement d'index
// (clé), ce qui remet l'écriture et l'avance automatique à zéro sans rien
// réinitialiser à la main.
function Scene({
  tableau,
  premier,
  dernier,
  reduit,
  onSuivant,
  onFin,
}: {
  tableau: TableauCinematique
  premier: boolean
  dernier: boolean
  reduit: boolean
  onSuivant: () => void
  onFin: () => void
}) {
  // Mouvement réduit : la phrase est là d'un coup.
  const [texteFini, setTexteFini] = useState(reduit)
  const lesMots = mots(tableau.texte)
  const duree = reduit ? 0 : dureeEcriture(tableau.texte)

  useEffect(() => {
    const t = window.setTimeout(() => setTexteFini(true), duree)
    return () => window.clearTimeout(t)
  }, [duree])

  useEffect(() => {
    if (dernier) return
    const t = window.setTimeout(onSuivant, MS_AUTO_AVANCE)
    return () => window.clearTimeout(t)
  }, [dernier, onSuivant])

  function tap() {
    if (!texteFini) {
      setTexteFini(true)
      return
    }
    if (!dernier) onSuivant()
  }

  return (
    <>
      <button
        type="button"
        className={s.zone}
        onClick={tap}
        disabled={dernier && texteFini}
        aria-label={texteFini ? 'Tableau suivant' : 'Afficher toute la phrase'}
      />

      <div className={s.panneau}>
        <div className={s.voix}>
          <div className={s.medaillon} aria-hidden="true">
            <Image src={POSES.salut} alt="" sizes="108px" className={s.portrait} />
          </div>
          <p className={cn(s.texte, texteFini && s.fini)} aria-hidden="true">
            {lesMots.map((mot, i) => (
              <span key={`${i}-${mot}`}>
                <span className={s.mot} style={{ animationDelay: `${i * MS_PAR_MOT}ms` }}>
                  {mot}
                </span>{' '}
              </span>
            ))}
          </p>
        </div>

        {premier && texteFini ? (
          <p className={s.indice} aria-hidden="true">
            Touche l’écran pour continuer
          </p>
        ) : null}

        {dernier && texteFini ? (
          <div className={s.cta}>
            <OnbButton onClick={onFin}>C’est parti</OnbButton>
          </div>
        ) : null}
      </div>
    </>
  )
}
