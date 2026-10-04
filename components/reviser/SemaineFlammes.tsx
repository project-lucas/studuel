'use client'

import { useEffect, useState } from 'react'
import ConfettiRain from '@/components/ConfettiRain'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { quandLaScenePrete } from '@/lib/scene-prete'
import {
  PAS_ALLUMAGE_MS,
  enSerie,
  etatDuJour,
  geometrieMeche,
  mechesDeLaSemaine,
  phraseSemaine,
  retardAllumage,
  semaineParfaite,
  type JourSemaine,
} from '@/lib/serie-semaine'
import { FICHIER_FLAMME, palierFlamme } from '@/lib/flamme-serie'
import s from './SemaineFlammes.module.css'

const DAY_SHORT = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
const DAY_FULL = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche']

const FLAMME = '/images/serie/jour-flamme.webp'
// Les flammes ANIMÉES (scripts/flamme-animee.mjs), toutes : chaque jour fait
// danse. Deux danses alternent d'un jour à l'autre (une même image animée
// joue au même pas partout sur la page : sept clones marcheraient au pas), la
// tête de la série prend la danse ample de la grande flamme, et la semaine
// parfaite fait danser ses sept flammes d'or.
// Trois danses tournent d'un jour à l'autre : décalées, sept flammes ont l'air
// vivantes ; synchronisées, elles feraient un seul GIF copié-collé.
const FLAMMES_JOUR = ['flamme-v2', 'flamme-crepite', 'flamme-v3']
const flammeDuJour = (i: number, figee: boolean) =>
  `/images/serie/${FLAMMES_JOUR[i % FLAMMES_JOUR.length]}${figee ? '-fixe' : ''}.webp`

/** La surprise : quand la flamme du jour apparaît, les autres… */
const SURPRISE_DEBUT_MS = 140 // …se figent net, juste après son jaillissement,
const SURPRISE_TENUE_MS = 1400 // …restent bouche bée (penchées vers elle, « ! »),
const SURPRISE_REPRISE_MS = 900 // …puis se remettent à danser, l'une après l'autre.
const FLAMME_OR_VIVE = '/images/serie/flamme-or-v2.webp'
const BRAISE = '/images/serie/jour-braise.webp'
const GLACE = '/images/serie/jour-gele.webp'
const MEDAILLE = '/images/serie/semaine-parfaite.webp'

// La fête de la semaine parfaite ne se joue qu'UNE fois par semaine (le lundi
// de la semaine fait la clé) ; les autres visites montrent la médaille posée.
const cleParfaite = (lundi: string) => `studuel:serie:parfaite:${lundi}`

/**
 * LES SEPT JOURS DE LA CARTE DE SÉRIE, EN FLAMMES (04/10/2026 — logique et
 * tempo dans lib/serie-semaine, mise en scène dans le module CSS voisin).
 *
 * `validation` : le jour vient d'être fait (la première fois qu'on revoit la
 * semaine avec lui) — sa flamme JAILLIT au lieu de s'allumer, avec une onde.
 * Décidée par la carte (SerieBar), qui tient la mémoire du jour.
 */
export default function SemaineFlammes({
  week,
  weekDates,
  streak,
  validation,
  examByDate,
}: {
  week: JourSemaine[]
  /** Les sept clés UTC de la semaine, lundi → dimanche. */
  weekDates: string[]
  streak: number
  validation: boolean
  /** Jour portant un contrôle daté → la classe de couleur de sa matière. */
  examByDate: Map<string, { barClass: string; name: string }>
}) {
  const parfaite = semaineParfaite(week)
  const feu = enSerie(week, streak)
  const meches = mechesDeLaSemaine(week)
  const lundi = weekDates[0] ?? ''

  // L'ALLUMAGE ATTEND LA SCÈNE (lib/scene-prete) : rendu sous le rideau de
  // chargement, il se jouait pour personne. Jusque-là, les animations sont en
  // PAUSE sur leur première image (data-pret="0", module CSS).
  const [pret, setPret] = useState(false)
  useEffect(() => quandLaScenePrete(() => setPret(true)), [])

  // LA SURPRISE (Lucas, 04/10/2026 : « les flammes dansent, le user joue, elles
  // s'arrêtent, sont étonnées et se remettent à danser et brûler »). Quand la
  // flamme du jour JAILLIT (validation), les autres se figent toutes en même
  // temps — le seul instant synchronisé de la semaine —, sursautent et se
  // penchent vers la nouvelle venue, un « ! » au-dessus, puis reprennent leur
  // danse chacune à son tour.
  const [surprise, setSurprise] = useState<'non' | 'arret' | 'reprise'>('non')
  const indexDuJour = week.findIndex((d) => d.isToday)
  const retardDuJour = indexDuJour >= 0 ? retardAllumage(week, indexDuJour) : 0
  useEffect(() => {
    if (!pret || !validation) return
    const t1 = window.setTimeout(() => setSurprise('arret'), retardDuJour + SURPRISE_DEBUT_MS)
    const t2 = window.setTimeout(
      () => setSurprise('reprise'),
      retardDuJour + SURPRISE_DEBUT_MS + SURPRISE_TENUE_MS,
    )
    const t3 = window.setTimeout(
      () => setSurprise('non'),
      retardDuJour + SURPRISE_DEBUT_MS + SURPRISE_TENUE_MS + SURPRISE_REPRISE_MS,
    )
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
      window.clearTimeout(t3)
    }
  }, [pret, validation, retardDuJour])

  // La fête de la semaine parfaite : une fois, quand la scène est prête.
  const [fete, setFete] = useState(false)
  useEffect(() => {
    if (!parfaite || !lundi) return
    try {
      if (window.localStorage.getItem(cleParfaite(lundi))) return
    } catch {
      // Stockage illisible : on fête, une fois par affichage.
    }
    return quandLaScenePrete(() => {
      try {
        window.localStorage.setItem(cleParfaite(lundi), '1')
      } catch {
        // Stockage indisponible : la fête aura lieu, elle ne sera pas mémorisée.
      }
      setFete(true)
      window.setTimeout(() => sfx.weekComplete(), 700)
    })
  }, [parfaite, lundi])

  return (
    <div className={s.semaine} data-parfaite={parfaite ? '1' : '0'} data-pret={pret ? '1' : '0'}>
      {fete ? (
        <div className={s.confettis} aria-hidden="true">
          <ConfettiRain />
        </div>
      ) : null}

      {parfaite ? (
        <div className={s.parfaite} data-fete={fete ? '1' : '0'}>
          <img src={MEDAILLE} alt="" aria-hidden="true" width={256} height={256} className={s.medaille} />
          <span className={s.parfaiteTitre}>Semaine parfaite&nbsp;!</span>
        </div>
      ) : null}

      <div className={s.libelles} aria-hidden="true">
        {week.map((d, i) => (
          <span key={i} className={s.libelle} data-aujourdhui={d.isToday ? '1' : '0'}>
            <span>{Number(weekDates[i]?.slice(8, 10)) || ''}</span>
            <span>{DAY_SHORT[i]}</span>
          </span>
        ))}
      </div>

      <div className={s.piste}>
        {meches.map((m) => {
          const g = geometrieMeche(m)
          const debut = retardAllumage(week, m.debut)
          const duree = (m.fin - m.debut) * PAS_ALLUMAGE_MS
          return (
            <span
              key={m.debut}
              aria-hidden="true"
              className={s.meche}
              style={{ left: `${g.gauche}%`, width: `${g.largeur}%` }}
            >
              <span
                className={s.mecheFeu}
                style={{ animationDelay: `${debut}ms`, animationDuration: `${duree}ms` }}
              />
              {parfaite ? <span className={s.reflet} /> : null}
              <span
                className={s.course}
                style={{ animationDelay: `${debut}ms`, animationDuration: `${duree}ms` }}
              >
                <span className={s.etincelle} />
              </span>
            </span>
          )
        })}

        <ul className={s.jetons}>
          {week.map((d, i) => {
            const etat = etatDuJour(d)
            const exam = examByDate.get(weekDates[i])
            const jour = Number(weekDates[i]?.slice(8, 10)) || ''
            const label = `${DAY_FULL[i]} ${jour}${
              etat === 'fait'
                ? ' — fait'
                : etat === 'gele'
                  ? ' — gelé, la série est protégée'
                  : etat === 'aujourdhui'
                    ? " — aujourd'hui, à faire"
                    : etat === 'manque'
                      ? ' — manqué'
                      : ''
            }${exam ? ` — contrôle de ${exam.name}` : ''}`
            return (
              <li key={i} className={s.case} role="img" aria-label={label}>
                {etat === 'fait' ? (
                  <span
                    // Le sursaut vit sur l'enveloppe : l'image garde son allumage.
                    className={cn(
                      s.sursaut,
                      !d.isToday && surprise === 'arret' && (i < indexDuJour ? s.etonneDroite : s.etonneGauche),
                      !d.isToday && surprise === 'reprise' && s.reprend,
                    )}
                    style={
                      !d.isToday && surprise === 'reprise'
                        ? { animationDelay: `${Math.abs(indexDuJour - i) * 120}ms` }
                        : undefined
                    }
                  >
                    {d.isToday && validation ? <span aria-hidden="true" className={s.onde} /> : null}
                    {!d.isToday && surprise === 'arret' ? (
                      <span aria-hidden="true" className={s.exclam}>
                        !
                      </span>
                    ) : null}
                    <img
                      src={
                        parfaite
                          ? FLAMME_OR_VIVE
                          : d.isToday && (feu || validation)
                            ? // La tête de la série a la flamme de son palier :
                              // orange, ou bleue dès 5 jours.
                              `/images/serie/${FICHIER_FLAMME[palierFlamme(streak)]}.webp`
                            : // Figée pendant la surprise (l'image fixe arrête la
                              // danse net), animée le reste du temps.
                              flammeDuJour(i, !d.isToday && surprise === 'arret')
                      }
                      alt=""
                      aria-hidden="true"
                      width={128}
                      height={128}
                      draggable={false}
                      className={cn(
                        s.jeton,
                        d.isToday && validation ? s.jaillit : d.isToday && feu ? s.tete : s.allume,
                      )}
                      // La tête et le jour qui jaillit portent DEUX animations
                      // (l'allumage, puis la danse) : deux retards.
                      style={{
                        animationDelay:
                          d.isToday && (validation || feu)
                            ? `${retardAllumage(week, i)}ms, ${retardAllumage(week, i) + 1200}ms`
                            : `${retardAllumage(week, i)}ms`,
                      }}
                    />
                  </span>
                ) : etat === 'gele' ? (
                  // LE JOUR GELÉ : un glaçon, la série a tenu. Un reflet passe
                  // de temps en temps sur la glace (un trait blanc qui glisse,
                  // masqué par le cube : transform et opacité seulement).
                  <span className={s.glaceCadre} style={{ ['--phase' as string]: `-${(i * 0.9) % 3.6}s` }}>
                    <img src={GLACE} alt="" aria-hidden="true" width={128} height={128} draggable={false} className={s.glace} />
                    <span aria-hidden="true" className={s.reflet} />
                  </span>
                ) : etat === 'aujourdhui' ? (
                  <>
                    <span aria-hidden="true" className={s.anneau} />
                    <img src={FLAMME} alt="" aria-hidden="true" width={128} height={128} draggable={false} className={s.fantome} />
                  </>
                ) : etat === 'manque' ? (
                  // La braise FUME en continu : trois volutes qui montent,
                  // grossissent, dérivent et s'effacent ; chaque jour manqué
                  // a sa phase (délai négatif), les fumées ne marchent pas au pas.
                  <span className={s.braiseCadre} style={{ ['--phase' as string]: `-${(i * 0.7) % 2.4}s` }}>
                    <span aria-hidden="true" className={cn(s.fumee, s.f1)} />
                    <span aria-hidden="true" className={cn(s.fumee, s.f2)} />
                    <span aria-hidden="true" className={cn(s.fumee, s.f3)} />
                    <img src={BRAISE} alt="" aria-hidden="true" width={128} height={128} draggable={false} className={s.braise} />
                  </span>
                ) : (
                  <span aria-hidden="true" className={s.avenir} />
                )}
              </li>
            )
          })}
        </ul>
      </div>

      <div className={s.reperes} aria-hidden="true">
        {week.map((_, i) => {
          const exam = examByDate.get(weekDates[i])
          return <span key={i} className={cn(s.repere, exam ? exam.barClass : 'bg-transparent')} />
        })}
      </div>

      <p className={s.phrase}>{phraseSemaine(week)}</p>
    </div>
  )
}
