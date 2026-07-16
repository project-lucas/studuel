'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { SwordsIcon } from './icons'

/**
 * Écran de recherche d'adversaire. Le vrai matchmaking en ligne n'est pas encore
 * branché : plutôt qu'un spinner infini (cul-de-sac), on joue une courte
 * recherche puis on annonce honnêtement que le mode classé arrive bientôt, avec
 * une porte de sortie claire vers le Défi.
 */
export default function MatchmakingScreen() {
  const reduce = useReducedMotion()
  const [phase, setPhase] = useState<'searching' | 'soon'>('searching')

  useEffect(() => {
    const t = setTimeout(() => setPhase('soon'), 2600)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-md flex-col items-center justify-center gap-8 text-center">
      <div className="relative grid place-items-center">
        {/* Ondes de recherche (uniquement pendant la « recherche ») */}
        {!reduce && phase === 'searching'
          ? [0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="absolute size-28 rounded-full border-2 border-highlight/45"
                initial={{ scale: 0.6, opacity: 0.7 }}
                animate={{ scale: 2.2, opacity: 0 }}
                transition={{
                  duration: 2.1,
                  repeat: Infinity,
                  delay: i * 0.7,
                  ease: 'easeOut',
                }}
                aria-hidden
              />
            ))
          : null}

        {/* Avatar central */}
        <motion.div
          className="defi2-card z-10 grid size-28 place-items-center"
          animate={
            reduce || phase === 'soon' ? undefined : { scale: [1, 1.08, 1] }
          }
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden
        >
          <SwordsIcon className="size-12 text-highlight" />
        </motion.div>
      </div>

      <div aria-live="polite">
        {phase === 'searching' ? (
          <>
            <h1 className="font-heading text-2xl font-extrabold text-white">
              Recherche d&apos;adversaire…
            </h1>
            <p className="mt-1 text-sm font-semibold text-white/60">
              On te trouve un rival à ta hauteur. Match classé · BO3.
            </p>
          </>
        ) : (
          <>
            <h1 className="font-heading text-2xl font-extrabold text-white">
              Le mode classé arrive très bientôt !
            </h1>
            <p className="mt-1 text-sm font-semibold text-white/60">
              En attendant, affûte-toi dans les modes libres du Défi — ta place au
              classement se prépare.
            </p>
          </>
        )}
      </div>

      <Link
        href="/defi"
        className="defi2-press cursor-pointer rounded-2xl border border-white/15 bg-white/8 px-6 py-3 text-sm font-extrabold text-white backdrop-blur-sm focus-visible:ring-4 focus-visible:ring-highlight/40 focus-visible:outline-none"
      >
        {phase === 'searching' ? 'Annuler' : 'Retour au Défi'}
      </Link>
    </div>
  )
}
