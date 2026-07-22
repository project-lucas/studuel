import { makeDustParticles } from '@/lib/animated-background'

/**
 * Poussière de lumière ambiante : ~30 points dorés qui flottent lentement
 * vers le haut en pulsant (CSS pur, voir globals.css `.abg-dust`). Le semis
 * est déterministe (graine fixe dans lib/animated-background.ts) : le rendu
 * serveur et l'hydratation produisent exactement les mêmes styles inline.
 * Les délais négatifs font naître chaque point déjà au milieu de son cycle —
 * la lueur est là dès la première image, sans départ groupé.
 */
const PARTICLES = makeDustParticles()

export default function GoldenDust() {
  return (
    <div className="abg-layer abg-layer--dust">
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className="abg-dust"
          style={{
            left: `${p.leftPct}%`,
            top: `${p.topPct}%`,
            width: p.size,
            height: p.size,
            animationDelay: `${p.delaySec}s`,
            ['--dust-duration' as string]: `${p.durationSec}s`,
            ['--dust-opacity' as string]: p.peakOpacity,
            ['--dust-drift' as string]: `${p.driftPx}px`,
          }}
        />
      ))}
    </div>
  )
}
