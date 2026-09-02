'use client'

import { useRouter } from 'next/navigation'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { CristalIcon, EcuIcon } from '@/components/ui/MonnaieIcon'
import {
  agregerGains,
  definition,
  dureeVolee,
  jetonsPour,
  repartir,
  volJeton,
  type Gain,
  type UniteGain,
} from '@/lib/gains'
import { centreVisible, emettreGain, selecteurCible } from '@/lib/hud-gains'
import { sfx } from '@/lib/sounds'

/**
 * LE VOL DES RÉCOMPENSES — le geste de Clash Royale, monté une seule fois pour
 * toute l'application.
 *
 * Une fin de partie appelle `celebrer(gains)` ; une poignée de jetons jaillit
 * de l'endroit où la récompense s'affiche, décrit un arc vers la pastille
 * correspondante du bandeau, et le compteur monte à mesure qu'ils y tombent.
 *
 * POURQUOI UN FOURNISSEUR PLUTÔT QU'UN COMPOSANT PAR ÉCRAN. Les jetons doivent
 * survoler TOUTE la page — bandeau compris — donc sortir de tout conteneur qui
 * découpe (`overflow`), et la couche doit être unique : deux écrans de fin
 * montés en même temps (le bilan d'un quiz derrière la fête de série) feraient
 * autrement deux couches superposées et deux rafraîchissements concurrents.
 *
 * CE QUE LE FOURNISSEUR NE FAIT PAS : décider des montants. Il ne fait voler
 * que ce que le serveur a répondu avoir versé. Une animation qui invente un
 * gain est pire qu'une absence d'animation — elle ment sur le solde.
 */

type Origine = { x: number; y: number }

type Contexte = {
  /** Fait voler des gains vers le bandeau. Sans gain positif : ne fait rien. */
  celebrer: (gains: readonly Gain[], origines?: OriginesParUnite) => void
}

export type OriginesParUnite = Partial<Record<UniteGain, Origine | null>>

const RecompensesContext = createContext<Contexte | null>(null)

/**
 * Le point d'entrée des écrans de fin.
 *
 * Hors fournisseur (un composant rendu dans un test isolé, une page hors du
 * layout racine), rend un `celebrer` INERTE plutôt que de jeter : une fin de
 * partie ne doit jamais tomber parce que la décoration manque.
 */
export function useRecompenses(): Contexte {
  const ctx = useContext(RecompensesContext)
  return ctx ?? INERTE
}

const INERTE: Contexte = { celebrer: () => {} }

/**
 * Toutes les unités partent du MÊME point — celui d'un bouton, d'une carte.
 *
 * Le panneau de récompenses fait partir chaque unité de SA pastille ; ici il
 * n'y a pas de panneau, juste l'objet qu'on vient de toucher. « J'ai terminé
 * cette leçon » est le geste le plus fréquent de l'app : y ouvrir un cadre
 * « Récompenses » pour deux pastilles serait plus lourd que le gain lui-même —
 * les jetons jaillissent directement du bouton.
 *
 * Rend `{}` si l'élément n'est pas mesurable : la volée partira du centre de
 * l'écran plutôt que de nulle part.
 */
export function origineUnique(
  element: Element | null,
  gains: readonly Gain[],
): OriginesParUnite {
  if (!element) return {}
  const r = element.getBoundingClientRect()
  if (r.width <= 0 || r.height <= 0) return {}
  const point = { x: r.left + r.width / 2, y: r.top + r.height / 2 }
  const origines: OriginesParUnite = {}
  for (const g of gains) origines[g.unite] = point
  return origines
}

/** Un jeton en vol, tel que la couche le rend. */
type Jeton = {
  id: number
  unite: UniteGain
  /** Ce que ce jeton apporte au compteur en atterrissant. */
  part: number
  depart: Origine
  arrivee: Origine
  retard: number
  duree: number
  arc: number
}

let prochainId = 0

export default function RecompensesProvider({
  children,
}: {
  children: ReactNode
}) {
  const router = useRouter()
  const [jetons, setJetons] = useState<Jeton[]>([])
  // Le rafraîchissement de fin de volée, annulé si une seconde volée part
  // avant : deux `router.refresh()` rapprochés rejoueraient la page pour rien.
  const resyncRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (resyncRef.current) clearTimeout(resyncRef.current)
    },
    [],
  )

  const celebrer = useCallback(
    (gains: readonly Gain[], origines?: OriginesParUnite) => {
      const propres = agregerGains(gains)
      if (propres.length === 0) return

      const centreEcran: Origine = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      }

      // Mouvement réduit : on ne fait rien voler, mais le compteur monte quand
      // même — l'information n'est pas de la décoration. C'est la règle de
      // toute l'app (cf. `prefers-reduced-motion` dans globals.css) : on
      // retire le trajet, jamais le résultat.
      const sansMouvement =
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches

      const nouveaux: Jeton[] = []
      let finDeVolee = 0

      for (const gain of propres) {
        const cible = definition(gain.unite).cible
        // Aucune pastille pour cette unité (couronnes, trophées), ou bandeau
        // masqué (écran large) : le gain reste affiché dans le panneau, il ne
        // traverse pas l'écran vers un compteur qui n'existe pas.
        const arrivee = cible
          ? centreVisible(document.querySelector(selecteurCible(cible)))
          : null
        if (!arrivee) continue

        const depart = origines?.[gain.unite] ?? centreEcran

        if (sansMouvement) {
          emettreGain({ unite: gain.unite, montant: gain.montant })
          finDeVolee = Math.max(finDeVolee, 200)
          continue
        }

        const n = jetonsPour(gain.montant)
        const parts = repartir(gain.montant, n)
        for (let i = 0; i < n; i += 1) {
          const v = volJeton(i, n)
          nouveaux.push({
            id: (prochainId += 1),
            unite: gain.unite,
            part: parts[i],
            depart: { x: depart.x + v.ecartX, y: depart.y },
            arrivee,
            retard: v.retard,
            duree: v.duree,
            arc: v.arc,
          })
        }
        finDeVolee = Math.max(finDeVolee, dureeVolee(n))
      }

      if (nouveaux.length > 0) {
        setJetons((prec) => [...prec, ...nouveaux])
        sfx.coin()
      }

      if (finDeVolee === 0) return

      // LE RECALAGE, UNE FOIS LA VOLÉE POSÉE. Les compteurs ont monté de façon
      // optimiste ; ce rafraîchissement va rechercher les vraies valeurs et
      // remet les deltas à zéro. Le faire AVANT l'atterrissage ferait sauter le
      // compteur à sa valeur finale pendant que les jetons volent encore.
      if (resyncRef.current) clearTimeout(resyncRef.current)
      resyncRef.current = setTimeout(() => router.refresh(), finDeVolee + 260)
    },
    [router],
  )

  const valeur = useMemo<Contexte>(() => ({ celebrer }), [celebrer])

  const retirer = useCallback((id: number) => {
    setJetons((prec) => prec.filter((j) => j.id !== id))
  }, [])

  return (
    <RecompensesContext.Provider value={valeur}>
      {children}
      {/* AUCUN ÉTAT « MONTÉ » ICI, ET C'EST VOLONTAIRE. Le portail a besoin de
          `document`, absent au rendu serveur — mais la liste de jetons ne se
          remplit QUE dans `celebrer`, appelé depuis un geste de l'élève. Au
          premier rendu, serveur comme client, elle est vide et cette branche
          rend `null` des deux côtés : rien à hydrater, donc pas besoin d'un
          état qui forcerait un second rendu de toute l'application. */}
      {jetons.length > 0
        ? createPortal(
            <div
              // La couche passe AU-DESSUS du bandeau (z-50) : un jeton qui
              // disparaît derrière sa cible n'arrive jamais, visuellement.
              className="pointer-events-none fixed inset-0 z-[60]"
              aria-hidden="true"
            >
              {jetons.map((jeton) => (
                <JetonEnVol key={jeton.id} jeton={jeton} onFin={retirer} />
              ))}
            </div>,
            document.body,
          )
        : null}
    </RecompensesContext.Provider>
  )
}

/**
 * Un jeton. Il s'anime par l'API Web Animations plutôt qu'en CSS : le trajet
 * dépend de deux points connus seulement à l'exécution (l'origine et la
 * pastille), donc d'images-clés calculées — ce qu'une classe CSS ne sait pas
 * porter sans injecter une règle par jeton.
 */
function JetonEnVol({
  jeton,
  onFin,
}: {
  jeton: Jeton
  onFin: (id: number) => void
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const { depart, arrivee, arc } = jeton
    // Le sommet de l'arc : à mi-chemin, remonté. Sans lui les jetons suivent
    // une ligne droite — le geste devient un glissement, pas un jet.
    const sommet = {
      x: (depart.x + arrivee.x) / 2,
      y: (depart.y + arrivee.y) / 2 - arc,
    }
    const pose = (p: Origine, echelle: number) =>
      `translate3d(${p.x}px, ${p.y}px, 0) translate(-50%, -50%) scale(${echelle})`

    let annule = false
    const atterrir = () => {
      if (annule) return
      // Le compteur monte À L'ATTERRISSAGE, jeton par jeton — c'est là qu'est
      // tout l'effet : le solde ne saute pas, il s'égrène.
      emettreGain({ unite: jeton.unite, montant: jeton.part })
      onFin(jeton.id)
    }

    // jsdom (et tout navigateur sans Web Animations) ne sait pas animer : on
    // garde alors le RÉSULTAT — le jeton atterrit à l'heure dite, sans trajet.
    if (typeof el.animate !== 'function') {
      const t = setTimeout(atterrir, jeton.retard + jeton.duree)
      return () => {
        annule = true
        clearTimeout(t)
      }
    }

    const animation = el.animate(
      [
        { transform: pose(depart, 0.4), opacity: 0, offset: 0 },
        { transform: pose(depart, 1), opacity: 1, offset: 0.14 },
        { transform: pose(sommet, 1.08), opacity: 1, offset: 0.56 },
        { transform: pose(arrivee, 0.42), opacity: 0.9, offset: 1 },
      ],
      {
        duration: jeton.duree,
        delay: jeton.retard,
        // Départ vif, arrivée qui se pose : la courbe d'un objet lancé.
        easing: 'cubic-bezier(0.32, 0, 0.28, 1)',
        fill: 'both',
      },
    )
    animation.addEventListener('finish', atterrir)

    return () => {
      annule = true
      animation.removeEventListener('finish', atterrir)
      animation.cancel()
    }
    // Un jeton est immuable : son trajet se pose une fois, au montage.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      ref={ref}
      className="absolute top-0 left-0 will-change-transform"
      style={{ opacity: 0 }}
    >
      <IconeJeton unite={jeton.unite} />
    </div>
  )
}

/**
 * Le dessin du jeton. Écus et cristaux reprennent EXACTEMENT l'illustration de
 * la pastille visée — c'est ce qui fait qu'on reconnaît l'objet qui arrive
 * comme celui qui est déjà là-haut.
 *
 * L'XP n'a pas d'illustration : elle prend le médaillon violet à liseré or de
 * l'écusson de niveau, en miniature. Même raison, même effet.
 */
function IconeJeton({ unite }: { unite: UniteGain }) {
  if (unite === 'ecu') return <EcuIcon className="size-6 drop-shadow-md" />
  if (unite === 'gemme') return <CristalIcon className="size-6 drop-shadow-md" />
  return (
    <span className="block size-5 rounded-full bg-gradient-to-b from-primary to-[color-mix(in_oklch,var(--primary),black_24%)] ring-2 ring-highlight/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_2px_6px_rgba(0,0,0,0.35)]" />
  )
}
