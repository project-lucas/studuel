'use client'

import { useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { DIVISION_SPAN, rankFor } from '@/lib/rank'
import { quandLaScenePrete } from '@/lib/scene-prete'
import {
  libelleTop,
  lireEtatCompte,
  mouvementCompte,
  type EtatCompte,
} from '@/lib/defi/classement-arene'

/** « 1 234 » — le compte à la française, espace fine insécable. */
export function formatTrophees(n: number): string {
  return Math.round(n).toLocaleString('fr-FR').replace(/\s/g, ' ')
}

/**
 * Ce que le lecteur d'écran lit à la place du chiffre : le total, la bande
 * parmi tous les élèves, le rang et la position dans la division.
 */
export function libelleCompteTrophees(trophees: number, top: number | null): string {
  const rank = rankFor(trophees)
  const division =
    rank.ceiling !== null
      ? ` (${rank.inDivision} sur ${DIVISION_SPAN} dans la division)`
      : ''
  const bande = top !== null ? `, top ${top} % de tous les élèves` : ''
  return `${trophees} trophées${bande}, rang ${rank.label}${division}`
}

// ------------------------------------------------------- la mémoire du compte
// Ce que l'arène a montré la dernière fois vit dans localStorage. Il est LU
// comme un magasin externe (useSyncExternalStore) : la valeur « d'avant » est
// donc connue dès le rendu — sans passer par un état posé dans un effet, et
// sans écart d'hydratation (le serveur ne sait rien, il rend le compte du jour).
//
// « INCONNUE » N'EST PAS « VIDE ». Pendant l'hydratation d'un chargement
// complet, React sert l'instantané SERVEUR, qui ne sait rien du navigateur ;
// l'effet, lui, tourne dès ce premier rendu. Prendre cet instantané pour une
// mémoire vide, c'était l'écraser avec l'état du jour — et la fête ne partait
// jamais sur un vrai chargement (vu sur la capture du 22/09/2026). L'instantané
// serveur porte donc une sentinelle, et l'effet attend le vrai instantané.
const INCONNU = '__inconnu__'
const ecouteurs = new Set<() => void>()

function abonner(cb: () => void): () => void {
  ecouteurs.add(cb)
  return () => {
    ecouteurs.delete(cb)
  }
}

/** L'état mémorisé, ou '' quand il n'y en a pas (le magasin veut une valeur stable). */
function lireMemoire(cle: string | null): string {
  if (!cle) return ''
  try {
    return window.localStorage.getItem(cle) ?? ''
  } catch {
    return ''
  }
}

function ecrireMemoire(cle: string | null, etat: EtatCompte): void {
  if (!cle) return
  try {
    window.localStorage.setItem(cle, JSON.stringify(etat))
  } catch {
    // Stockage indisponible : on fêtera peut-être deux fois, jamais zéro.
  }
  for (const cb of ecouteurs) cb()
}

/** Le temps que met le compte à défiler de l'ancien total au nouveau. */
const DEFILEMENT_MS = 1100

/** Un compte qui défile de `de` à `a` (sortie cubique). Tenue à la fin, ou à l'annulation. */
function defiler(
  de: number,
  a: number,
  onValeur: (v: number) => void,
  signal: { annule: boolean },
): Promise<void> {
  return new Promise((resolve) => {
    let debut: number | null = null
    const pas = (t: number) => {
      if (signal.annule) return resolve()
      if (debut === null) debut = t
      const k = Math.min(1, (t - debut) / DEFILEMENT_MS)
      const e = 1 - Math.pow(1 - k, 3)
      onValeur(Math.round(de + (a - de) * e))
      if (k < 1) requestAnimationFrame(pas)
      else resolve()
    }
    requestAnimationFrame(pas)
  })
}

const attendre = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

type Phase = 'repos' | 'trophees' | 'top'

/**
 * LE COMPTE DE TROPHÉES DE L'ARÈNE — sous la carte du joueur, à gauche, comme
 * le « 🏆 7503 » de Clash Royale sous la bannière (Lucas, 22/09/2026).
 *
 * Une plaque-pilule de l'arène : la coupe illustrée, le NOMBRE en or, et en
 * jaune la bande où l'élève se situe parmi TOUS les élèves (« Top 90 % »), qui
 * baisse à mesure qu'il gagne. Sans bande (base muette), le rang prend la place.
 * Ce n'est PAS un bouton : la porte de l'écran qui explique tout ça est la
 * plaque « Classement » de l'angle droit (ClassementSheet).
 *
 * LA FÊTE DU RETOUR. L'arène mémorise ce qu'elle a montré (une clé par élève).
 * Quand on y revient avec un total différent — après une course, une partie
 * de salon —, le compte DÉFILE de l'ancien total au nouveau pendant que la
 * coupe bondit, un « +8 » s'envole du chiffre et la plaque s'allume ; puis la
 * bande GLISSE de « Top 90 % » à « Top 85 % ». Tant que la scène n'est pas
 * prête (lib/scene-prete : rideau parti, onglet visible), la pilule montre
 * l'ANCIEN état — rien ne saute, et la fête ne se joue pas derrière le rideau.
 * « Moins de mouvement » pose directement les nouveaux chiffres.
 */
export default function CompteTropheesArene({
  trophees,
  top,
  cle,
  className,
}: {
  trophees: number
  /** La bande de pourcentage parmi tous les élèves (lib/defi/classement-arene), ou null. */
  top: number | null
  /** La clé de mémoire (`cleEtatCompte(userId)`), ou null pour ne rien mémoriser ni fêter. */
  cle: string | null
  className?: string
}) {
  const reduce = useReducedMotion()
  const rank = rankFor(trophees)

  const brut = useSyncExternalStore(
    abonner,
    () => lireMemoire(cle),
    () => INCONNU,
  )
  const inconnu = brut === INCONNU
  const avant = useMemo(() => (inconnu ? null : lireEtatCompte(brut)), [brut, inconnu])
  const mouvement = useMemo(
    () => mouvementCompte(avant, { trophees, top }),
    [avant, trophees, top],
  )

  const [phase, setPhase] = useState<Phase>('repos')
  // Le compte en train de défiler ; null hors fête.
  const [progression, setProgression] = useState<number | null>(null)
  const [delta, setDelta] = useState<number | null>(null)
  // Incrémenté à chaque fête : la clé remonte la coupe et rejoue son bond.
  const [bond, setBond] = useState(0)

  useEffect(() => {
    // Instantané serveur (hydratation) : on ne sait encore rien, on attend.
    if (inconnu) return
    const maintenant: EtatCompte = { trophees, top }
    if (!mouvement) {
      // Première visite (rien d'avant) : on pose, et on s'en souvient.
      if (!avant) ecrireMemoire(cle, maintenant)
      return
    }
    if (reduce) {
      ecrireMemoire(cle, maintenant)
      return
    }

    const signal = { annule: false }
    const annuler = quandLaScenePrete(() => {
      void (async () => {
        if (mouvement.trophees) {
          const { de, a } = mouvement.trophees
          setDelta(a - de)
          setProgression(de)
          setPhase('trophees')
          setBond((b) => b + 1)
          await defiler(de, a, setProgression, signal)
          await attendre(350)
          if (signal.annule) return
          setDelta(null)
        }
        if (mouvement.top) {
          setPhase('top')
          await attendre(900)
          if (signal.annule) return
        }
        setPhase('repos')
        setProgression(null)
        ecrireMemoire(cle, maintenant)
      })()
    })
    return () => {
      signal.annule = true
      annuler()
    }
  }, [inconnu, mouvement, avant, trophees, top, cle, reduce])

  // Ce que la pilule MONTRE : l'ancien état tant que la fête n'a pas commencé,
  // le compte qui défile pendant, le nouvel état ensuite — dérivé, jamais posé.
  const trophAffiche =
    progression ?? (mouvement?.trophees && phase === 'repos' ? mouvement.trophees.de : trophees)
  const topAffiche =
    mouvement?.top && phase !== 'top' ? mouvement.top.de : top
  const fete = phase !== 'repos'

  return (
    <div
      role="img"
      aria-label={libelleCompteTrophees(trophees, top)}
      // `grid-flow-col` : la plaque est une grille (globals.css) — on la couche
      // en ligne plutôt que de se battre avec son `display`.
      className={cn(
        'arena-plaque arena-plaque--ronde relative h-11 grid-flow-col gap-1.5 pr-3.5 pl-1',
        className,
      )}
    >
      {/* La plaque qui s'allume le temps de la fête. */}
      <AnimatePresence>
        {fete ? (
          <motion.span
            key="halo"
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-full shadow-[0_0_26px_8px_color-mix(in_oklch,var(--highlight),transparent_35%)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.6] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9 }}
          />
        ) : null}
      </AnimatePresence>

      {/* La coupe : elle bondit et se balance à chaque fête (clé = le bond). */}
      <motion.span
        key={bond}
        aria-hidden="true"
        className="relative grid size-9 place-items-center"
        animate={bond > 0 ? { rotate: [0, -16, 12, -6, 0], scale: [1, 1.3, 1.1, 1] } : undefined}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <Image
          src="/images/defi/icones/trophees-v3.webp"
          alt=""
          aria-hidden="true"
          width={116}
          height={116}
          className="size-9 object-contain drop-shadow-[0_3px_4px_rgba(23,16,48,0.55)]"
        />
      </motion.span>

      {/* Le nombre en or, et le « +8 » qui s'en envole. */}
      <span className="relative" aria-hidden="true">
        <motion.span
          key={`nombre-${bond}`}
          className="font-heading block text-[1.45rem] leading-none font-extrabold text-highlight tabular-nums [text-shadow:0_2px_0_rgba(0,0,0,0.45)]"
          animate={bond > 0 ? { scale: [1, 1.22, 1] } : undefined}
          transition={{ duration: 0.55, delay: DEFILEMENT_MS / 1000 }}
        >
          {formatTrophees(trophAffiche)}
        </motion.span>
        <AnimatePresence>
          {delta !== null ? (
            <motion.span
              key="delta"
              className={cn(
                'font-heading pointer-events-none absolute top-0 left-1/2 text-sm leading-none font-extrabold whitespace-nowrap [text-shadow:0_1px_0_rgba(0,0,0,0.5)]',
                delta > 0 ? 'text-highlight' : 'text-[#faf6ef]/80',
              )}
              initial={{ x: '-50%', y: 2, opacity: 0, scale: 0.8 }}
              animate={{ x: '-50%', y: -28, opacity: [0, 1, 1, 0], scale: [0.8, 1.2, 1, 1] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.4, ease: 'easeOut' }}
            >
              {delta > 0 ? `+${delta}` : `−${-delta}`}
            </motion.span>
          ) : null}
        </AnimatePresence>
      </span>

      {/* La bande en jaune — quand elle change, la nouvelle valeur MONTE en
          place et la plaque la souligne d'un battement. Sans bande, le rang. */}
      <span
        aria-hidden="true"
        className="relative flex h-4 min-w-[3.4rem] items-center overflow-hidden"
      >
        <motion.span
          key={phase === 'top' ? 'nouvelle' : 'ancienne'}
          className={cn(
            'font-heading text-[0.62rem] leading-none font-extrabold tracking-wider whitespace-nowrap uppercase',
            topAffiche === null ? 'text-[#faf6ef]/85' : 'text-highlight',
          )}
          initial={phase === 'top' ? { y: 14, opacity: 0, scale: 1.25 } : false}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          {topAffiche === null ? rank.label : libelleTop(topAffiche)}
        </motion.span>
      </span>
    </div>
  )
}
