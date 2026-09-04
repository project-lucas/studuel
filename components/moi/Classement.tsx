'use client'

import { useEffect, useRef } from 'react'
import { Swords, BookOpenCheck, Users } from 'lucide-react'
import type { Standing } from '@/lib/percentile'
import {
  DEPART_COMPTEUR,
  NB_BARRES,
  jauge,
  libelleAxe,
  placeDansLaFoule,
  progressionCohorte,
  titreClassement,
  valeurAnimee,
  type AxeSecondaire,
} from '@/lib/moi/classement'
import { cn } from '@/lib/utils'

// -----------------------------------------------------------------------------
// « TON CLASSEMENT » — LE bloc de l'onglet Moi.
//
// Le « top X % » existait déjà, en 11 px sous le pseudo, dans la bannière. Or
// c'est LA question que les élèves se posent (« je suis où, par rapport aux
// autres ? ») : il passe en tête de carte, en 46 px, et il est dessiné.
//
// LA FOULE. Cinquante silhouettes pour la classe. À l'ouverture, elles se
// lèvent de gauche à droite ; puis le marqueur de l'élève part de la droite
// (« Top 50 % », vrai pour tout le monde) et REMONTE jusqu'à sa vraie place,
// pendant que le chiffre se précise. Les silhouettes qu'il dépasse passent au
// violet : ce sont celles qu'il devance. L'animation ne décore pas le chiffre,
// elle explique ce qu'il veut dire. Une fois par ouverture, jamais en boucle,
// et coupée par `prefers-reduced-motion` (état final direct).
//
// LES TROIS MESURES, JAMAIS FONDUES EN UNE. L'assiduité en grand — cet onglet
// est le miroir du travail — puis l'arène et la meilleure matière en deux
// lignes à jauge. La règle du 01/08 (lib/percentile) est intacte : pas de
// chiffre unique, arrondis contre l'élève, plancher de cohorte.
//
// SOUS LE PLANCHER, LE RANG VRAI. « 1er sur 1 des 5e » se lisait comme une
// blague. Le bloc dit le rang, explique que le pourcentage s'ouvre à cent
// élèves de la classe, et montre la jauge des inscrits : un état de lancement
// qui donne envie d'inviter sa classe, pas un état vide.
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

const ICONES = { arene: Swords, maitrise: BookOpenCheck } as const

export default function Classement({
  principal,
  grade,
  secondaires,
  initiale,
  verre = false,
}: {
  /** La mesure en grand : l'assiduité sur cet écran. */
  principal: Standing
  grade: string | null
  secondaires: AxeSecondaire[]
  /** La lettre du marqueur — l'initiale de l'élève. */
  initiale: string
  /**
   * EN VERRE, DANS LA CARTE DE JOUEUR. Le bloc a été une plaque blanche sous
   * la carte violette ; il vit maintenant DEDANS (Lucas, 04/09/2026 :
   * « mets ces deux blocs proprement dans le bloc violet »). Même dessin,
   * même animation ; l'encre passe en blanc, le violet des jauges en or, et
   * les silhouettes suivent (`.moi-carte .moi-silhouette`, globals.css).
   */
  verre?: boolean
}) {
  const titre = titreClassement(principal, grade)
  const place = placeDansLaFoule(principal)
  const cohorte = progressionCohorte(principal)
  // Le pourcentage affiché à l'arrivée du compteur : la valeur de la bande
  // pour un « top », sinon la place réelle (le chiffre n'est qu'un repère du
  // trajet, le titre au-dessus dit la vérité arrondie).
  const arrivee =
    principal.kind === 'pourcentage' && principal.side === 'top'
      ? principal.value
      : place !== null
        ? Math.round(place * 100)
        : DEPART_COMPTEUR

  const fouleRef = useRef<HTMLDivElement>(null)
  const marqueurRef = useRef<HTMLDivElement>(null)
  const compteurRef = useRef<HTMLSpanElement>(null)
  const jaugesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const foule = fouleRef.current
    const marqueur = marqueurRef.current
    const compteur = compteurRef.current
    if (!foule || !marqueur || place === null) return

    const barres = Array.from(foule.children) as HTMLElement[]
    const cible = place * 100
    const reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const jauges = Array.from(
      jaugesRef.current?.querySelectorAll<HTMLElement>('[data-jauge]') ?? [],
    )

    const etatFinal = () => {
      barres.forEach((b, i) => {
        const x = ((i + 0.5) / NB_BARRES) * 100
        b.dataset.etat = x >= cible ? 'devant' : 'derriere'
        b.dataset.levee = 'true'
      })
      marqueur.style.left = `${cible}%`
      if (compteur) compteur.textContent = texteCompteur(principal, arrivee)
      jauges.forEach((j) => {
        j.style.width = j.dataset.jauge ?? '0%'
      })
    }

    if (reduit) {
      marqueur.style.transition = 'none'
      jauges.forEach((j) => {
        j.style.transition = 'none'
      })
      etatFinal()
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
            compteur.textContent = texteCompteur(
              principal,
              valeurAnimee(DEPART_COMPTEUR, arrivee, k),
            )
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

    // 3) Les jauges des deux autres mesures suivent.
    timers.push(
      window.setTimeout(() => {
        jauges.forEach((j) => {
          j.style.width = j.dataset.jauge ?? '0%'
        })
      }, DELAI_MARQUEUR_MS + 400),
    )

    return () => {
      timers.forEach(clearTimeout)
      cancelAnimationFrame(raf)
    }
  }, [place, arrivee, principal])

  return (
    <section
      aria-label="Ton classement"
      className={cn(
        verre
          ? 'rounded-2xl border border-white/16 bg-white/10 p-3.5'
          : 'moi-bloc rounded-[22px] p-4',
      )}
    >
      <p className={cn('moi-sourcil', verre && 'text-white/70')}>
        Ton classement · assiduité
      </p>

      {titre ? (
        <>
          <p className="mt-1 flex items-baseline gap-2">
            <span
              ref={compteurRef}
              className={cn(
                'font-heading leading-none font-extrabold tracking-[-0.5px] tabular-nums',
                verre ? 'text-[40px] text-white' : 'text-[46px] text-primary',
              )}
            >
              {/* Le titre vrai est rendu par le serveur : sans JavaScript, ou
                  avec « réduire les animations », c'est lui qu'on lit. */}
              {titre.grand}
            </span>
          </p>
          <p
            className={cn(
              'mt-1 text-[13px] font-bold',
              verre ? 'text-white/80' : 'text-muted-foreground',
            )}
          >
            {titre.petit}
          </p>

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
            <div
              ref={marqueurRef}
              className="moi-marqueur"
              style={{ left: '100%' }}
            >
              {initiale}
            </div>
            <div
              className={cn(
                'absolute inset-x-0 bottom-0 h-4 text-[9px] font-extrabold',
                verre ? 'text-white/60' : 'text-muted-foreground',
              )}
            >
              <span className="absolute left-0">Top 1 %</span>
              <span className="absolute left-1/4 -translate-x-1/2">25 %</span>
              <span className="absolute left-1/2 -translate-x-1/2">50 %</span>
              <span className="absolute right-0">Toute la classe</span>
            </div>
          </div>

          {cohorte ? (
            <div className="mt-3">
              <div
                className={cn(
                  'h-2 overflow-hidden rounded-full',
                  verre ? 'bg-white/15' : 'bg-muted',
                )}
              >
                <i
                  className={cn(
                    'block h-full rounded-full',
                    verre ? 'bg-highlight' : 'bg-primary',
                  )}
                  style={{ width: `${Math.round(cohorte.ratio * 100)}%` }}
                />
              </div>
              {/* Une seule ligne : le compte des inscrits, et pourquoi il
                  compte. Deux phrases disaient la même chose. */}
              <p
                className={cn(
                  'mt-1.5 text-[12px] font-bold tabular-nums',
                  verre ? 'text-white/80' : 'text-foreground/80',
                )}
              >
                {cohorte.total} / {cohorte.requis} inscrits · le % s&rsquo;ouvre à{' '}
                {cohorte.requis} élèves de ta classe — invite-la.
              </p>
            </div>
          ) : null}
        </>
      ) : (
        <div className="mt-2 flex items-start gap-3">
          <span
            className={cn(
              'flex size-10 shrink-0 items-center justify-center rounded-2xl',
              verre ? 'bg-white/14 text-white' : 'bg-secondary text-primary',
            )}
          >
            <Users className="size-5" strokeWidth={2.4} aria-hidden="true" />
          </span>
          <div>
            <p className="font-heading text-lg leading-tight font-extrabold">
              Ta place se joue à la première session.
            </p>
            <p
              className={cn(
                'mt-1 text-[13px] font-bold',
                verre ? 'text-white/80' : 'text-muted-foreground',
              )}
            >
              Révise dix minutes : tu entres dans le classement de ta classe, au
              temps de travail.
            </p>
          </div>
        </div>
      )}

      {secondaires.length > 0 ? (
        <div ref={jaugesRef} className="mt-4 flex flex-col gap-2.5">
          {secondaires.map((axe) => {
            const Icon = ICONES[axe.cle]
            return (
              <div
                key={axe.cle}
                className="grid grid-cols-[22px_minmax(0,1fr)_auto] items-center gap-2.5 text-[12.5px] font-bold"
              >
                <span
                  className={cn(
                    'flex size-[22px] items-center justify-center rounded-lg',
                    verre ? 'bg-white/14 text-white' : 'bg-secondary text-primary',
                  )}
                >
                  <Icon className="size-[13px]" strokeWidth={2.4} aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <span className="block truncate">{axe.titre}</span>
                  <div
                    className={cn(
                      'mt-1 h-1.5 overflow-hidden rounded-full',
                      verre ? 'bg-white/15' : 'bg-muted',
                    )}
                  >
                    <i
                      data-jauge={`${Math.round(jauge(axe.standing) * 100)}%`}
                      className={cn(
                        'moi-jauge block h-full w-0 rounded-full',
                        verre ? 'bg-highlight' : 'bg-primary',
                      )}
                    />
                  </div>
                </div>
                <span
                  className={cn(
                    'font-heading text-sm',
                    verre ? 'text-highlight' : 'text-primary',
                  )}
                >
                  {libelleAxe(axe.standing)}
                </span>
              </div>
            )
          })}
        </div>
      ) : null}

      {/* La note de méthode ne suit pas dans la carte : elle y pesait plus
          que le chiffre qu'elle qualifiait. */}
      {verre ? null : (
        <p className={cn('mt-3 text-[12px] font-extrabold text-primary', !titre && 'hidden')}>
          Classé parmi les élèves de ton niveau, arrondi toujours en ta défaveur.
        </p>
      )}
    </section>
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
