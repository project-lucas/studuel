'use client'

import { useEffect, useState } from 'react'
import { onAppReady } from '@/lib/app-ready'
import {
  SPLASH_READY_CAP_MS,
  formatSplashPercent,
  isSplashReady,
  splashProgress,
} from '@/lib/splash'

/**
 * Classe posée sur <body> le temps de la levée : elle déclenche l'arrivée du
 * hub (globals.css). Le rideau ne fait pas que disparaître — la scène entre.
 */
const HUB_ENTERING_CLASS = 'hub-entering'
/** Durée de l'entrée du hub (doit rester alignée sur @keyframes hub-enter). */
const HUB_ENTER_MS = 560

/**
 * Le nom du jeu. Écrit une fois : le wordmark le rend en deux couches (le
 * contour est dessiné par `::before`, qui relit le mot dans `data-mot`).
 */
const WORDMARK = 'Studuel'
/** Baseline du logo — la promesse de l'app en trois temps. */
const BASELINE = 'Apprends · Teste-toi · Progresse'

type Props = {
  /** Astuce du jour, calculée sur le serveur : même texte des deux côtés. */
  tip: string
}

/**
 * Écran de chargement au lancement de l'app, façon jeu mobile : l'illustration
 * plein cadre, le wordmark, l'astuce du jour et la barre de progression.
 *
 * La barre ne mesure rien de réel — le navigateur ne publie pas de « % de
 * l'app chargée ». Elle monte selon une courbe qui s'aplatit (lib/splash) et
 * n'atteint 100 % qu'une fois la page réellement chargée : elle ne recule
 * jamais et ne ment pas sur la fin.
 */
export default function SplashScreen({ tip }: Props) {
  const [progress, setProgress] = useState(0)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    const start = performance.now()
    // `readyState` est peut-être déjà 'complete' au montage (page servie depuis
    // le cache) : on ne peut pas se reposer sur le seul événement 'load'.
    let documentLoaded = document.readyState === 'complete'
    const onLoad = () => {
      documentLoaded = true
    }
    window.addEventListener('load', onLoad)

    // Second verrou, celui qui compte vraiment : le bandeau du haut arrive en
    // flux APRÈS `load`. Sans lui, le rideau s'ouvrait sur des squelettes.
    let appReady = false
    const unsubscribe = onAppReady(() => {
      appReady = true
    })

    let raf = 0
    let fadeTimer: ReturnType<typeof setTimeout> | undefined
    let termine = false

    /** Barre au bout, puis levée du rideau. Idempotent : deux chemins y mènent. */
    const lever = () => {
      if (termine) return
      termine = true
      cancelAnimationFrame(raf)
      setProgress(100)
      // On laisse la barre pleine visible le temps du fondu, sinon l'écran
      // disparaît avant que l'œil ait vu qu'elle arrivait au bout.
      fadeTimer = setTimeout(() => setGone(true), 420)
    }

    const tick = () => {
      const elapsedMs = performance.now() - start
      const value = splashProgress(
        elapsedMs,
        isSplashReady({ documentLoaded, appReady, elapsedMs }),
      )
      setProgress(value)
      if (value >= 100) {
        lever()
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    // Filet de sécurité INDÉPENDANT des frames. `requestAnimationFrame` est
    // gelé tant que le document est caché : un élève qui lance l'app puis
    // bascule sur une autre app (le cas normal d'un lancement à froid un peu
    // long) verrait le rideau rester en place, barre figée, à son retour — et
    // le défilement reste bloqué derrière. Un minuteur, lui, continue de
    // courir : passé le plafond, le rideau lève quoi qu'il arrive.
    const filet = setTimeout(lever, SPLASH_READY_CAP_MS + 200)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(filet)
      if (fadeTimer) clearTimeout(fadeTimer)
      window.removeEventListener('load', onLoad)
      unsubscribe()
    }
  }, [])

  // Levée de rideau : la scène ARRIVE, elle n'est pas juste « déjà là ». La
  // classe vit sur <body> le temps de l'animation puis s'efface — laissée en
  // place, sa transformation ferait de <main> un bloc conteneur et casserait
  // tout `position: fixed` d'une page.
  useEffect(() => {
    if (!gone) return
    document.body.classList.add(HUB_ENTERING_CLASS)
    const timer = setTimeout(
      () => document.body.classList.remove(HUB_ENTERING_CLASS),
      HUB_ENTER_MS,
    )
    return () => {
      clearTimeout(timer)
      document.body.classList.remove(HUB_ENTERING_CLASS)
    }
  }, [gone])

  // Le fondu terminé, on démonte : l'overlay ne doit rien intercepter ensuite.
  const [unmounted, setUnmounted] = useState(false)
  useEffect(() => {
    if (!gone) return
    const timer = setTimeout(() => setUnmounted(true), 460)
    return () => clearTimeout(timer)
  }, [gone])

  // Pas de défilement derrière l'écran de chargement.
  useEffect(() => {
    if (unmounted) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [unmounted])

  if (unmounted) return null

  return (
    <div
      className="splash"
      // Le rideau ne s'efface pas : il AVANCE en s'effaçant (léger zoom, façon
      // caméra qui entre dans la scène). Piloté en CSS via cet attribut plutôt
      // qu'en style en ligne, pour que la transformation reste avec sa
      // transition dans la feuille de styles.
      data-gone={gone ? 'true' : 'false'}
      style={{
        opacity: gone ? 0 : 1,
        pointerEvents: gone ? 'none' : 'auto',
      }}
      role="status"
      aria-live="polite"
      aria-label="Chargement de Studuel"
    >
      <div className="splash-art" aria-hidden />
      <div className="splash-veil" aria-hidden />

      {/* Wordmark — le quart haut de l'illustration lui est réservé */}
      <div className="relative z-10 px-6 pt-[env(safe-area-inset-top)]">
        <p className="splash-wordmark mt-9" data-mot={WORDMARK}>
          {WORDMARK}
        </p>
        <p className="splash-baseline">{BASELINE}</p>
      </div>

      {/* Astuce + barre — la bande basse leur est réservée */}
      <div className="relative z-10 mx-auto w-full max-w-md px-6 pb-[calc(2rem+env(safe-area-inset-bottom))]">
        <p className="mb-4 text-center text-sm font-semibold text-white/90 drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]">
          {tip}
        </p>
        <div
          className="splash-track"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className="splash-fill" style={{ width: `${progress}%` }} />
        </div>
        <p className="mt-2 text-center font-heading text-lg font-extrabold text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]">
          {formatSplashPercent(progress)}
        </p>
      </div>

      {/* Sans JavaScript, rien ne viendrait retirer l'overlay : l'élève
          resterait bloqué sur l'écran de chargement. */}
      <noscript>
        <style>{`.splash { display: none }`}</style>
      </noscript>
    </div>
  )
}
