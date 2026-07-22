'use client'

import { useEffect, useRef } from 'react'
import {
  leafCountFor,
  spawnLeaf,
  stepLeaf,
  type Leaf,
} from '@/lib/animated-background'

/**
 * Feuilles dorées qui tombent : système de particules sur <canvas> plein
 * écran, piloté par requestAnimationFrame. La physique (chute, vent
 * sinusoïdal, rotation, recyclage feuille par feuille) est pure et testée
 * dans lib/animated-background.ts — ici on ne fait que boucler et dessiner.
 *
 * - Boucle invisible : chaque feuille se recycle indépendamment en sortant
 *   par le bas, aucune réinitialisation globale.
 * - Budget perfs : 15–25 feuilles selon la largeur, dpr plafonné à 2, boucle
 *   suspendue quand l'onglet est caché.
 * - prefers-reduced-motion : aucune boucle lancée (et arrêt si l'utilisateur
 *   active la préférence en cours de route).
 */
export default function FallingLeaves() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    let leaves: Leaf[] = []
    let raf = 0
    let last = performance.now()
    const rng = Math.random

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      // Repeuplement dispersé sur toute la hauteur : la scène est habitée
      // immédiatement, pas de « vague » qui descend d'un bloc.
      leaves = Array.from({ length: leafCountFor(w) }, () =>
        spawnLeaf(rng, w, h, true),
      )
    }

    const drawLeaf = (leaf: Leaf) => {
      ctx.save()
      ctx.translate(leaf.x, leaf.y)
      ctx.rotate(leaf.rotation)
      ctx.globalAlpha = leaf.opacity
      ctx.fillStyle = leaf.color
      ctx.beginPath()
      ctx.ellipse(0, 0, leaf.size / 2, leaf.size / 4.5, 0, 0, Math.PI * 2)
      ctx.fill()
      // Nervure centrale : assez pour lire « feuille » et non « confetti ».
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.18)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(-leaf.size / 2, 0)
      ctx.lineTo(leaf.size / 2, 0)
      ctx.stroke()
      ctx.restore()
    }

    const frame = (now: number) => {
      // Onglet endormi ou grosse pause : on borne dt pour éviter le saut géant.
      const dt = Math.min(now - last, 100)
      last = now
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      leaves = leaves.map((leaf) => stepLeaf(leaf, dt, now, w, h, rng))
      ctx.clearRect(0, 0, w, h)
      for (const leaf of leaves) drawLeaf(leaf)
      raf = requestAnimationFrame(frame)
    }

    const start = () => {
      cancelAnimationFrame(raf)
      last = performance.now()
      raf = requestAnimationFrame(frame)
    }
    const stop = () => {
      cancelAnimationFrame(raf)
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight)
    }

    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') cancelAnimationFrame(raf)
      else if (!reduced.matches) start()
    }
    const onReducedChange = () => {
      if (reduced.matches) stop()
      else start()
    }

    resize()
    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', onVisibilityChange)
    reduced.addEventListener('change', onReducedChange)
    if (!reduced.matches) start()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      reduced.removeEventListener('change', onReducedChange)
    }
  }, [])

  return (
    <div className="abg-layer abg-layer--leaves">
      <canvas ref={canvasRef} className="abg-canvas" />
    </div>
  )
}
