'use client'

import { useEffect, useRef, useState } from 'react'
import { Clock, Trophy } from 'lucide-react'
import type { Standing } from '@/lib/percentile'
import {
  DEPART_COMPTEUR,
  FILTRES_CLASSEMENT,
  NB_BARRES,
  cadreClassement,
  invitationClassement,
  placeDansLaFoule,
  titreClassement,
  valeurAnimee,
  type CadreClassement,
  type FiltreClassement,
} from '@/lib/moi/classement'
import { sfx } from '@/lib/sounds'
import { cn } from '@/lib/utils'

// -----------------------------------------------------------------------------
// « TON CLASSEMENT » — LE bloc de l'onglet Moi.
//
// LA question que les élèves se posent (« je suis où, par rapport aux
// autres ? ») passe en tête de carte, en grand, et elle est dessinée.
//
// DEUX FILTRES (Lucas, 18/09/2026) : « Temps de travail » (parmi les élèves du
// même niveau) et « Trophées » (classement national de l'arène). Une seule
// place à la fois ; tout ce qui s'empilait dessous (jauge des inscrits, arène
// et meilleure matière en petit, note de méthode) est parti — on ne
// comprenait plus ce qui était classé contre quoi. Les règles d'honnêteté de
// lib/percentile restent entières : plancher de cohorte, arrondis contre
// l'élève.
//
// LA FOULE. Cinquante silhouettes pour la cohorte. À l'ouverture, elles se
// lèvent de gauche à droite ; puis le marqueur de l'élève part de la droite
// (« Top 50 % », vrai pour tout le monde) et REMONTE jusqu'à sa vraie place,
// pendant que le chiffre se précise. Les silhouettes qu'il dépasse passent au
// violet : ce sont celles qu'il devance. L'animation rejoue à chaque filtre
// (le panneau est remonté), jamais en boucle, et elle est coupée par
// `prefers-reduced-motion` (état final direct).
//
// Le rendu du chiffre et des barres pendant l'animation est IMPÉRATIF (refs +
// requestAnimationFrame) : soixante rendus React par seconde pour changer un
// nombre, c'est le genre de chose qui fait ramer un téléphone d'entrée de
// gamme, et la fluidité est précisément ce que ce bloc met en scène.
// -----------------------------------------------------------------------------

/** Durée du trajet du marqueur (ms). */
const DUREE_MARQUEUR_MS = 1300
/** Les silhouettes se lèvent avant que le marqueur ne parte. */
const DELAI_MARQUEUR_MS = 900
/** Écart entre deux silhouettes qui se lèvent. */
const PAS_LEVEE_MS = 12

const ICONES = { travail: Clock, trophees: Trophy } as const

export default function Classement({
  mesures,
  grade,
  initiale,
}: {
  /** Ma place pour chaque filtre — `aucun` quand l'élève n'y est pas classé. */
  mesures: Record<FiltreClassement, Standing>
  grade: string | null
  /** La lettre du marqueur — l'initiale de l'élève. */
  initiale: string
}) {
  const [filtre, setFiltre] = useState<FiltreClassement>('travail')

  return (
    <section aria-label="Ton classement" className="moi-bloc rounded-[22px] p-4">
      <p className="moi-sourcil">Ton classement</p>

      <div
        role="group"
        aria-label="Classer par"
        className="mt-2 grid grid-cols-2 gap-1 rounded-2xl bg-secondary p-1"
      >
        {FILTRES_CLASSEMENT.map((f) => {
          const actif = f.id === filtre
          const Icone = ICONES[f.id]
          return (
            <button
              key={f.id}
              type="button"
              aria-pressed={actif}
              onClick={() => {
                if (actif) return
                sfx.tap()
                setFiltre(f.id)
              }}
              className={cn(
                'font-heading flex min-h-10 cursor-pointer items-center justify-center gap-1.5 rounded-xl px-2 text-[13px] font-extrabold transition',
                actif
                  ? 'bg-card text-primary shadow-[0_3px_0_color-mix(in_oklch,var(--primary),transparent_70%)]'
                  : 'text-secondary-foreground/70 hover:bg-card/60 active:scale-95',
              )}
            >
              <Icone className="size-4 shrink-0" strokeWidth={2.6} aria-hidden="true" />
              <span className="truncate">{f.label}</span>
            </button>
          )
        })}
      </div>

      {/* `key` : changer de filtre REMONTE le panneau, donc rejoue la foule
          depuis le début au lieu de la faire sauter d'une place à l'autre. */}
      <PlaceDansLaCohorte
        key={filtre}
        filtre={filtre}
        standing={mesures[filtre]}
        cadre={cadreClassement(filtre, grade)}
        initiale={initiale}
      />
    </section>
  )
}

function PlaceDansLaCohorte({
  filtre,
  standing,
  cadre,
  initiale,
}: {
  filtre: FiltreClassement
  standing: Standing
  cadre: CadreClassement
  initiale: string
}) {
  const titre = titreClassement(standing, cadre)
  const titreFinal = titre?.grand ?? ''
  const place = placeDansLaFoule(standing)
  // Le pourcentage affiché à l'arrivée du compteur : la valeur de la bande
  // pour un « top », sinon la place réelle (le chiffre n'est qu'un repère du
  // trajet, le titre au-dessus dit la vérité arrondie).
  const arrivee =
    standing.kind === 'pourcentage' && standing.side === 'top'
      ? standing.value
      : place !== null
        ? Math.round(place * 100)
        : DEPART_COMPTEUR

  const fouleRef = useRef<HTMLDivElement>(null)
  const marqueurRef = useRef<HTMLDivElement>(null)
  const compteurRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const foule = fouleRef.current
    const marqueur = marqueurRef.current
    const compteur = compteurRef.current
    if (!foule || !marqueur || place === null) return

    const barres = Array.from(foule.children) as HTMLElement[]
    const cible = place * 100
    const reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduit) {
      marqueur.style.transition = 'none'
      barres.forEach((b, i) => {
        const x = ((i + 0.5) / NB_BARRES) * 100
        b.dataset.etat = x >= cible ? 'devant' : 'derriere'
        b.dataset.levee = 'true'
      })
      // Le compteur garde le titre rendu par le serveur : c'est déjà la
      // valeur finale, arrondie contre l'élève.
      marqueur.style.left = `${cible}%`
      return
    }

    const timers: number[] = []
    let raf = 0

    // 1) La foule se lève, de gauche à droite.
    barres.forEach((b, i) => {
      timers.push(
        window.setTimeout(() => {
          b.dataset.levee = 'true'
          b.dataset.etat = 'derriere'
        }, 200 + i * PAS_LEVEE_MS),
      )
    })

    // 2) Le marqueur remonte, le chiffre se précise, les dépassés s'allument.
    timers.push(
      window.setTimeout(() => {
        marqueur.style.left = `${cible}%`
        const t0 = performance.now()
        const tick = (now: number) => {
          const k = Math.min(1, (now - t0) / DUREE_MARQUEUR_MS)
          const ease = 1 - Math.pow(1 - k, 3)
          if (compteur) {
            // À l'arrivée, le TITRE et non le chiffre du trajet : « Mieux
            // que 62 % » ne doit jamais remplacer le « Mieux que 60 % »
            // arrondi contre l'élève (lib/percentile, règle 3).
            compteur.textContent =
              k >= 1
                ? titreFinal
                : texteCompteur(standing, valeurAnimee(DEPART_COMPTEUR, arrivee, k))
          }
          const pos = 100 - (100 - cible) * ease
          barres.forEach((b, i) => {
            const x = ((i + 0.5) / NB_BARRES) * 100
            if (x >= pos) b.dataset.etat = 'devant'
          })
          if (k < 1) raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
      }, DELAI_MARQUEUR_MS),
    )

    return () => {
      timers.forEach(clearTimeout)
      cancelAnimationFrame(raf)
    }
  }, [place, arrivee, standing, titreFinal])

  if (!titre) {
    const invitation = invitationClassement(filtre)
    const Icone = ICONES[filtre]
    return (
      <div className="mt-3 flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary">
          <Icone className="size-5" strokeWidth={2.4} aria-hidden="true" />
        </span>
        <div>
          <p className="font-heading text-lg leading-tight font-extrabold">
            {invitation.titre}
          </p>
          <p className="mt-1 text-[13px] font-bold text-muted-foreground">
            {invitation.texte}
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <p className="mt-3 flex items-baseline gap-2">
        <span
          ref={compteurRef}
          className="font-heading text-[38px] leading-none font-extrabold tracking-[-0.5px] text-primary tabular-nums"
        >
          {/* Le titre vrai est rendu par le serveur : sans JavaScript, ou
              avec « réduire les animations », c'est lui qu'on lit. */}
          {titre.grand}
        </span>
      </p>
      <p className="mt-1 text-[13px] font-bold text-muted-foreground">{titre.petit}</p>

      {/* LA FOULE */}
      <div className="relative mt-4 mb-1 h-[62px]" aria-hidden="true">
        <div
          ref={fouleRef}
          className="absolute inset-x-0 top-0 bottom-[18px] grid items-end gap-[3px]"
          style={{ gridTemplateColumns: `repeat(${NB_BARRES}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: NB_BARRES }, (_, i) => (
            <i key={i} className="moi-silhouette" />
          ))}
        </div>
        <div ref={marqueurRef} className="moi-marqueur" style={{ left: '100%' }}>
          {initiale}
        </div>
        <div className="absolute inset-x-0 bottom-0 h-4 text-[9px] font-extrabold text-muted-foreground">
          <span className="absolute left-0">Top 1 %</span>
          <span className="absolute left-1/4 -translate-x-1/2">25 %</span>
          <span className="absolute left-1/2 -translate-x-1/2">50 %</span>
          <span className="absolute right-0">{cadre.finDeFoule}</span>
        </div>
      </div>
    </>
  )
}

/** Le texte du compteur pendant le trajet — la même forme que le titre final. */
function texteCompteur(standing: Standing, valeur: number): string {
  if (standing.kind === 'pourcentage') {
    return standing.side === 'top' ? `Top ${valeur} %` : `Mieux que ${100 - valeur} %`
  }
  if (standing.kind === 'rang') {
    // Sous le plancher, le chiffre suit la place réelle en pourcent — mais le
    // titre, lui, reste le rang : on le rétablit à l'arrivée.
    return valeur <= Math.round((standing.rank / standing.total) * 100)
      ? `${standing.rank === 1 ? '1er' : `${standing.rank}e`}`
      : `Top ${valeur} %`
  }
  return ''
}
