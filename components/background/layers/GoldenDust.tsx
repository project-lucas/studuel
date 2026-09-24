import { makeDustParticles, sensDeDerive } from '@/lib/animated-background'

/**
 * Poussière de lumière ambiante : ~14 points dorés qui flottent lentement
 * vers le haut en pulsant (CSS pur, voir globals.css `.abg-dust`). Le semis
 * est déterministe (graine fixe dans lib/animated-background.ts) : le rendu
 * serveur et l'hydratation produisent exactement les mêmes styles inline.
 * Les délais négatifs font naître chaque point déjà au milieu de son cycle —
 * la lueur est là dès la première image, sans départ groupé.
 *
 * DEUX ÉPAISSEURS PAR POINT, pour que le compositeur joue tout seul : la
 * place, la taille et l'opacité de pointe (propres à chaque point) sur
 * l'enveloppe immobile ; la montée et la pulsation sur le grain, par des
 * images-clés aux valeurs écrites en dur. Elles lisaient des variables — et
 * une animation qui lit une variable tourne sur le fil principal (cf.
 * `sensDeDerive`).
 */
const PARTICLES = makeDustParticles()

export default function GoldenDust() {
  return (
    <div className="abg-layer abg-layer--dust">
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className="abg-dust"
          data-derive={sensDeDerive(p.driftPx)}
          style={{
            left: `${p.leftPct}%`,
            top: `${p.topPct}%`,
            width: p.size,
            height: p.size,
            opacity: p.peakOpacity,
          }}
        >
          <span
            className="abg-dust-grain"
            style={{
              animationDelay: `${p.delaySec}s`,
              animationDuration: `${p.durationSec}s`,
            }}
          />
        </span>
      ))}
    </div>
  )
}
