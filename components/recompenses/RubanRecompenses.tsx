'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import RubanOr from '@/components/recompenses/RubanOr'
import IconeUnite from '@/components/recompenses/IconeUnite'
import { agregerGains, definition, phraseGains, type Gain, type UniteGain } from '@/lib/gains'
import { useDialog } from '@/lib/use-dialog'
import type { OriginesParUnite } from '@/components/recompenses/RecompensesProvider'
import s from './RubanRecompenses.module.css'

/**
 * LE RUBAN DE RÉCOMPENSES (25/10/2026, cadrage « le jeu vivant » § B) — chaque
 * gain est une fête courte et sans friction, comme dans le jeu que Lucas a
 * montré : l'écran s'assombrit, une lumière tourne, un ruban d'or ondule avec
 * « Récompenses », dessous une carte par unité (l'objet en grand, le montant
 * en très gros, le libellé). Un tap N'IMPORTE OÙ ferme ; les jetons partent
 * alors des cartes vers le bandeau, en vague (RecompensesProvider).
 *
 * ⚠️ ON N'AFFICHE QUE CE QUI A ÉTÉ VERSÉ : les gains viennent de la réponse du
 * serveur, jamais d'un barème calculé ici. Rien à fêter = le fournisseur ne
 * l'ouvre pas.
 *
 * Accessible : `role="dialog"`, la phrase des gains lisible, Échap et Entrée
 * ferment, le focus est posé sur le bouton « Continuer ». Sous « mouvement
 * réduit » : ni ondulation, ni lumière, ni reflet — le résultat reste.
 */
export default function RubanRecompenses({
  gains,
  titre = 'Récompenses',
  sousTitre,
  onFermer,
  onFini,
}: {
  gains: readonly Gain[]
  titre?: string
  /** Une ligne sous le ruban : d'où vient le gain (« Coffre d'équipe · niveau 3 »). */
  sousTitre?: string
  /** Au tap : les origines des cartes, pour faire partir la vague de là. */
  onFermer: (origines: OriginesParUnite) => void
  /** Quand le fondu de sortie est fini : le moment de démonter. */
  onFini: () => void
}) {
  const propres = agregerGains(gains)
  const [sortie, setSortie] = useState(false)
  const cartes = useRef(new Map<UniteGain, HTMLElement>())
  const bouton = useRef<HTMLButtonElement>(null)
  const sortieRef = useRef(false)

  // Stable : `useDialog` s'y abonne (Échap, verrou du défilement) et ne doit
  // pas se réabonner à chaque rendu.
  const fermer = useCallback(() => {
    if (sortieRef.current) return
    sortieRef.current = true
    setSortie(true)
    const origines: OriginesParUnite = {}
    for (const [unite, el] of cartes.current) {
      const r = el.getBoundingClientRect()
      if (r.width <= 0 || r.height <= 0) continue
      origines[unite] = { x: r.left + r.width / 2, y: r.top + r.height / 2 }
    }
    onFermer(origines)
  }, [onFermer])

  // Échap ferme, le fond ne défile plus, le focus est piégé dans la scène.
  const scene = useDialog(fermer)

  useEffect(() => {
    bouton.current?.focus({ preventScroll: true })
  }, [])

  // Le fondu de sortie, puis le démontage — les jetons volent déjà au-dessus.
  useEffect(() => {
    if (!sortie) return
    const t = setTimeout(onFini, DUREE_SORTIE)
    return () => clearTimeout(t)
  }, [sortie, onFini])

  return (
    <div
      className={s.voile}
      data-sortie={sortie ? '' : undefined}
      role="dialog"
      aria-modal="true"
      aria-label={titre}
      onClick={fermer}
    >
      <div className={s.lumiere} aria-hidden="true" />
      <div className={s.etincelles} aria-hidden="true">
        {ETINCELLES.map((e, i) => (
          <span key={i} className={s.etincelle} style={{ left: `${e.x}%`, top: `${e.y}%`, animationDelay: `${e.retard}ms` }} />
        ))}
      </div>

      <div ref={scene} className={s.scene}>
        <RubanOr ondule>{titre}</RubanOr>
        {sousTitre ? <p className={s.sousTitre}>{sousTitre}</p> : null}

        <p className="sr-only">{phraseGains(propres)}</p>

        <ul className={s.cartes} aria-hidden="true">
          {propres.map((gain, i) => (
            <li
              key={gain.unite}
              ref={(el) => {
                if (el) cartes.current.set(gain.unite, el)
                else cartes.current.delete(gain.unite)
              }}
              className={s.carte}
              data-unite={gain.unite}
              style={{ animationDelay: `${380 + i * 140}ms` }}
            >
              <span className={s.objet}>
                <IconeUnite unite={gain.unite} className={s.icone} />
              </span>
              <span className={s.montant}>+{gain.montant.toLocaleString('fr-FR')}</span>
              <span className={s.libelle}>
                {gain.montant > 1 ? definition(gain.unite).plusieurs : definition(gain.unite).un}
              </span>
            </li>
          ))}
        </ul>

        <button ref={bouton} type="button" className={s.indice} onClick={fermer}>
          Touche l’écran pour continuer
        </button>
      </div>
    </div>
  )
}

/** Le fondu de sortie (ms) — le voile s'efface pendant que la vague part. */
export const DUREE_SORTIE = 280

/** Huit étincelles autour de la scène, à des places fixes (jamais au hasard : l'image se rejoue). */
const ETINCELLES = [
  { x: 12, y: 22, retard: 0 },
  { x: 86, y: 18, retard: 400 },
  { x: 8, y: 58, retard: 800 },
  { x: 90, y: 54, retard: 1200 },
  { x: 22, y: 78, retard: 300 },
  { x: 76, y: 80, retard: 900 },
  { x: 50, y: 12, retard: 600 },
  { x: 60, y: 88, retard: 1500 },
]
