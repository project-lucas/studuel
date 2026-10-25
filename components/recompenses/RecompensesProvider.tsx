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
import { CristalIcon } from '@/components/ui/MonnaieIcon'
import XpIcon from '@/components/ui/XpIcon'
import {
  agregerGains,
  definition,
  dureeVolee,
  jetonsPour,
  jetonsVague,
  type VolVague,
  volVague,
  dureeVague,
  repartir,
  volJeton,
  type Gain,
  type UniteGain,
} from '@/lib/gains'
import { emettreGain, premierCentreVisible, selecteurCible } from '@/lib/hud-gains'
import { sfx } from '@/lib/sounds'
import RubanRecompenses from '@/components/recompenses/RubanRecompenses'

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
  celebrer: (gains: readonly Gain[], origines?: OriginesParUnite, options?: OptionsVolee) => void
  /**
   * LE RUBAN « RÉCOMPENSES » (25/10/2026) : un écran plein qui fête les gains,
   * fermé d'un tap n'importe où — à la fermeture, la vague part des cartes
   * vers le bandeau. Pour les gains qu'on ENCAISSE en cérémonie : un coffre,
   * un gardien abattu, une annale traitée, le coffre de palier. Les autres
   * écrans de fin gardent le panneau. Sans gain positif : ne fait rien.
   */
  ouvrirRuban: (gains: readonly Gain[], options?: OptionsRuban) => void
}

export type OriginesParUnite = Partial<Record<UniteGain, Origine | null>>

export type OptionsRuban = {
  /** Le titre du ruban (défaut : « Récompenses »). */
  titre?: string
  /** Une ligne sous le ruban : d'où vient le gain. */
  sousTitre?: string
  /** Appelé à la fermeture, quand la vague part. */
  onFerme?: () => void
}

type Ruban = { cle: number; gains: Gain[]; options: OptionsRuban }

/**
 * `vague` : la gerbe de Clash Royale — tous les éclairs jaillissent ensemble,
 * flottent, puis rentrent en file vers la barre, chacun avec sa note
 * (lib/gains → volVague). Pour les gains qu'on ENCAISSE d'un geste : une
 * quête du jour, le coffre.
 */
export type OptionsVolee = { vague?: boolean }

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

const INERTE: Contexte = { celebrer: () => {}, ouvrirRuban: () => {} }

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
  saut: Origine
  /** Les repères du trajet (vague) ; absents : ceux d'une volée ordinaire. */
  reperes?: readonly [number, number, number]
  /** Son rang dans la vague : la note qu'il tinte en atterrissant. */
  rang?: number
}

let prochainId = 0

/** La classe qui fait descendre le bandeau caché le temps d'une volée. */
const CLASSE_VOLEE = 'hud-volee'
/** Après l'atterrissage, le temps de voir la barre se remplir (ms). */
const BANDEAU_TENU = 1600

/**
 * Le centre d'une cible, À LA PLACE QU'ELLE AURA une fois le bandeau descendu.
 *
 * En plein écran (quiz, dictée, course), le bandeau est monté mais rangé
 * au-dessus de l'écran (`data-hud-dissimule`) : c'est ce qui manquait — sans
 * cible, rien ne volait à la fin d'un quiz. Le bandeau est `fixed top-0` et ne
 * bouge qu'en `translateY` : on retire ce décalage pour viser sa place finale,
 * sans attendre la fin de sa descente.
 */
function cibleDe(cible: string): { arrivee: Origine; dissimule: boolean } | null {
  const elements = document.querySelectorAll(selecteurCible(cible))
  const arrivee = premierCentreVisible(elements)
  if (!arrivee) return null
  for (const el of elements) {
    const bandeau = el.closest('[data-hud-dissimule]')
    if (!bandeau) continue
    const decalage = bandeau.getBoundingClientRect().top
    return { arrivee: { x: arrivee.x, y: arrivee.y - decalage }, dissimule: true }
  }
  return { arrivee, dissimule: false }
}

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
  const voleeRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (resyncRef.current) clearTimeout(resyncRef.current)
      if (voleeRef.current) clearTimeout(voleeRef.current)
      document.documentElement.classList.remove(CLASSE_VOLEE)
    },
    [],
  )

  const celebrer = useCallback(
    (gains: readonly Gain[], origines?: OriginesParUnite, options?: OptionsVolee) => {
      const vague = options?.vague === true
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
      let bandeauCache = false

      for (const gain of propres) {
        const cible = definition(gain.unite).cible
        // Aucune pastille pour cette unité (couronnes, trophées), ou bandeau
        // masqué (écran large) : le gain reste affiché dans le panneau, il ne
        // traverse pas l'écran vers un compteur qui n'existe pas.
        const trouvee = cible ? cibleDe(cible) : null
        if (!trouvee) continue
        const { arrivee } = trouvee
        if (trouvee.dissimule) bandeauCache = true

        const depart = origines?.[gain.unite] ?? centreEcran

        if (sansMouvement) {
          emettreGain({ unite: gain.unite, montant: gain.montant })
          finDeVolee = Math.max(finDeVolee, 200)
          continue
        }

        const n = vague ? jetonsVague(gain.montant) : jetonsPour(gain.montant)
        const parts = repartir(gain.montant, n)
        for (let i = 0; i < n; i += 1) {
          const v = vague ? volVague(i, n) : volJeton(i, n)
          nouveaux.push({
            id: (prochainId += 1),
            unite: gain.unite,
            part: parts[i],
            depart: { x: depart.x + v.ecartX, y: depart.y },
            arrivee,
            retard: v.retard,
            duree: v.duree,
            arc: v.arc,
            saut: { x: v.sautX, y: v.sautY },
            reperes: vague ? (v as VolVague).reperes : undefined,
            rang: vague ? i : undefined,
          })
        }
        finDeVolee = Math.max(finDeVolee, vague ? dureeVague(n) : dureeVolee(n))
      }

      if (nouveaux.length > 0) {
        setJetons((prec) => [...prec, ...nouveaux])
        sfx.coin()
      }

      if (finDeVolee === 0) return

      // Le temps de la volée, le bandeau passe DEVANT tout : caché en plein
      // écran, il descend ; sous le voile d'une feuille (les quêtes, un
      // coffre), il passe au-dessus — l'élève VOIT son XP arriver et la barre
      // se remplir, puis tout reprend sa place.
      void bandeauCache
      document.documentElement.classList.add(CLASSE_VOLEE)
      if (voleeRef.current) clearTimeout(voleeRef.current)
      voleeRef.current = setTimeout(
        () => document.documentElement.classList.remove(CLASSE_VOLEE),
        finDeVolee + BANDEAU_TENU,
      )

      // LE RECALAGE, UNE FOIS LA VOLÉE POSÉE. Les compteurs ont monté de façon
      // optimiste ; ce rafraîchissement va rechercher les vraies valeurs et
      // remet les deltas à zéro. Le faire AVANT l'atterrissage ferait sauter le
      // compteur à sa valeur finale pendant que les jetons volent encore.
      if (resyncRef.current) clearTimeout(resyncRef.current)
      resyncRef.current = setTimeout(() => router.refresh(), finDeVolee + 260)
    },
    [router],
  )

  // LE RUBAN. Un seul à la fois : un second appel remplace le premier (la clé
  // remonte le composant, qui rejoue son entrée). Les gains sont agrégés ici,
  // une fois, pour que les cartes et la vague disent la même chose.
  // (Le même ruban vit dans un ref, écrit au même moment que l'état : la
  // fermeture le lit sans se réabonner à chaque ouverture.)
  const [ruban, setRuban] = useState<Ruban | null>(null)
  const rubanRef = useRef<Ruban | null>(null)

  const ouvrirRuban = useCallback((gains: readonly Gain[], options?: OptionsRuban) => {
    const propres = agregerGains(gains)
    if (propres.length === 0) return
    const r: Ruban = { cle: (prochainId += 1), gains: propres, options: options ?? {} }
    rubanRef.current = r
    setRuban(r)
  }, [])

  // Au tap : la vague part des cartes, puis le ruban s'efface et se démonte.
  const fermerRuban = useCallback(
    (origines: OriginesParUnite) => {
      const r = rubanRef.current
      if (!r) return
      celebrer(r.gains, origines, { vague: true })
      r.options.onFerme?.()
    },
    [celebrer],
  )
  const finirRuban = useCallback(() => {
    rubanRef.current = null
    setRuban(null)
  }, [])

  const valeur = useMemo<Contexte>(() => ({ celebrer, ouvrirRuban }), [celebrer, ouvrirRuban])

  // Développement seulement : rejouer une volée ou un ruban depuis la console
  // (`__celebrer([{ unite: 'xp', montant: 40 }])`, `__ouvrirRuban(…)`) sans
  // finir un quiz.
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return
    const w = window as unknown as {
      __celebrer?: Contexte['celebrer']
      __ouvrirRuban?: Contexte['ouvrirRuban']
    }
    w.__celebrer = celebrer
    w.__ouvrirRuban = ouvrirRuban
    return () => {
      delete w.__celebrer
      delete w.__ouvrirRuban
    }
  }, [celebrer, ouvrirRuban])

  const retirer = useCallback((id: number) => {
    setJetons((prec) => prec.filter((j) => j.id !== id))
  }, [])

  return (
    <RecompensesContext.Provider value={valeur}>
      {children}
      {/* Le ruban, SOUS la couche des jetons (z-75 contre z-90) : à la
          fermeture, les éclairs partent des cartes et passent devant le voile
          qui s'efface. Même règle de montage que les jetons : rien au premier
          rendu, donc rien à hydrater. */}
      {ruban
        ? createPortal(
            <RubanRecompenses
              key={ruban.cle}
              gains={ruban.gains}
              titre={ruban.options.titre}
              sousTitre={ruban.options.sousTitre}
              onFermer={fermerRuban}
              onFini={finirRuban}
            />,
            document.body,
          )
        : null}
      {/* AUCUN ÉTAT « MONTÉ » ICI, ET C'EST VOLONTAIRE. Le portail a besoin de
          `document`, absent au rendu serveur — mais la liste de jetons ne se
          remplit QUE dans `celebrer`, appelé depuis un geste de l'élève. Au
          premier rendu, serveur comme client, elle est vide et cette branche
          rend `null` des deux côtés : rien à hydrater, donc pas besoin d'un
          état qui forcerait un second rendu de toute l'application. */}
      {jetons.length > 0
        ? createPortal(
            <div
              // La couche passe AU-DESSUS du bandeau (z-50, z-80 pendant la
              // volée) ET des feuilles (z-70) : un jeton qui disparaît derrière
              // sa cible, ou sous le voile de la feuille d'où il part, n'arrive
              // jamais, visuellement.
              className="pointer-events-none fixed inset-0 z-[90]"
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
  const eclatRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const { depart, arrivee, arc, saut } = jeton
    // LE JAILLISSEMENT : le jeton est projeté autour du départ, s'y suspend,
    // puis part (Clash Royale). Le sommet de l'arc est pris depuis ce point.
    const projete = { x: depart.x + saut.x, y: depart.y + saut.y }
    const suspendu = { x: projete.x, y: projete.y - 6 }
    const sommet = {
      x: (projete.x + arrivee.x) / 2,
      y: (projete.y + arrivee.y) / 2 - arc,
    }
    const pose = (p: Origine, echelle: number) =>
      `translate3d(${p.x}px, ${p.y}px, 0) translate(-50%, -50%) scale(${echelle})`

    let annule = false
    const atterrir = () => {
      if (annule) return
      // Le compteur monte À L'ATTERRISSAGE, jeton par jeton — c'est là qu'est
      // tout l'effet : le solde ne saute pas, il s'égrène.
      emettreGain({ unite: jeton.unite, montant: jeton.part })
      // Dans une vague, chaque éclair tinte une note plus haute que le précédent.
      if (jeton.rang !== undefined) sfx.perle(jeton.rang)
      // L'éclat à l'arrivée : un anneau qui s'ouvre sur la pastille.
      const eclat = eclatRef.current
      if (eclat && typeof eclat.animate === 'function') {
        const fin = eclat.animate(
          [
            { transform: pose(arrivee, 0.3), opacity: 0.95 },
            { transform: pose(arrivee, 1.5), opacity: 0 },
          ],
          { duration: 360, easing: 'cubic-bezier(0.2, 0.7, 0.3, 1)', fill: 'both' },
        )
        fin.addEventListener('finish', () => onFin(jeton.id))
        return
      }
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

    // Les repères du trajet : ceux de la vague (tous jaillissent ensemble,
    // flottent, puis partent en file), sinon ceux d'une volée ordinaire.
    const [jailli, decroche, auSommet] = jeton.reperes ?? [0.2, 0.36, 0.72]
    const animation = el.animate(
      [
        { transform: pose(depart, 0.2), opacity: 0, offset: 0, easing: 'cubic-bezier(0.2, 0.9, 0.3, 1.25)' },
        { transform: pose(projete, 1.25), opacity: 1, offset: jailli, easing: 'ease-out' },
        { transform: pose(suspendu, 1.1), opacity: 1, offset: decroche, easing: 'cubic-bezier(0.5, 0, 0.75, 0.3)' },
        { transform: pose(sommet, 1), opacity: 1, offset: auSommet, easing: 'cubic-bezier(0.3, 0.2, 0.6, 1)' },
        { transform: pose(arrivee, 0.5), opacity: 1, offset: 1 },
      ],
      {
        duration: jeton.duree,
        delay: jeton.retard,
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
    <>
      <div
        ref={ref}
        className="absolute top-0 left-0 will-change-transform"
        style={{ opacity: 0 }}
      >
        <IconeJeton unite={jeton.unite} />
      </div>
      <span
        ref={eclatRef}
        className={
          'absolute top-0 left-0 block size-9 rounded-full border-[3px] ' +
          (jeton.unite === 'gemme' ? 'border-primary/80' : 'border-highlight')
        }
        style={{ opacity: 0 }}
      />
    </>
  )
}

/**
 * Le dessin du jeton. Le cristal reprend EXACTEMENT l'illustration de
 * la pastille visée — c'est ce qui fait qu'on reconnaît l'objet qui arrive
 * comme celui qui est déjà là-haut.
 *
 * L'XP vole en ÉCLAIRS, l'icône unique de l'XP (Lucas, 05/10/2026 : « je n'ai
 * pas vu d'éclairs apparaître et se diriger vers la barre de niveau »).
 */
function IconeJeton({ unite }: { unite: UniteGain }) {
  if (unite === 'gemme') {
    return <CristalIcon className="size-8 drop-shadow-[0_3px_4px_rgba(40,20,80,0.45)]" />
  }
  return <XpIcon className="size-8 drop-shadow-[0_3px_4px_rgba(40,20,80,0.45)]" />
}
