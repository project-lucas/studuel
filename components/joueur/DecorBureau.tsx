'use client'

import { useEffect, useState } from 'react'
import {
  arenaPeriodAt,
  isArenaPeriod,
  msUntilNextArenaChange,
  nextArenaSlot,
  type ArenaPeriod,
} from '@/lib/arena-background'
import { decorBureau } from '@/lib/joueur'
import type { PortraitKey } from '@/lib/portraits'
import { cn } from '@/lib/utils'
import s from './DecorBureau.module.css'

// -----------------------------------------------------------------------------
// LE BUREAU DU JOUEUR (27/10/2026). Lucas : « l'avatar assis au bureau, sur la
// chaise, en train de travailler ; qu'on voie surtout la fenêtre avec le
// château ; une animation propre et continue de la lampe, comme la fontaine ;
// et le fond doit suivre l'heure comme l'accueil ».
//
// Le décor est l'une des SIX scènes peintes du portrait (lib/joueur,
// `decorBureau`) : la même chambre à l'aube, le matin, à midi, l'après-midi, le
// soir, la nuit — les plages de la cour d'honneur (lib/arena-background). Le
// personnage est PEINT DANS LA SCÈNE : la page ne pose plus de héros dessus.
//
// L'heure, comme ArenaBackdrop : le serveur rend la plage de l'heure de Paris
// (`initiale`, l'image est là dès le HTML, pas de flash) ; à l'hydratation on
// se cale sur l'heure de l'appareil, un timer se réveille pile à la prochaine
// frontière, on revérifie quand l'app revient au premier plan, et la scène
// suivante est préchargée. Au changement, la nouvelle couche se monte
// PAR-DESSUS l'ancienne en fondu de 500 ms. En dev, `?arena=<plage>` fige.
//
// LA LAMPE : deux halos (la lueur qui respire, le cœur qui vacille) et trois
// poussières qui montent dans la lumière — transform et opacité seulement, en
// valeurs littérales (DecorBureau.module.css), posés en % de l'IMAGE : la boîte
// a la géométrie de la peinture, la lampe tombe juste sur tout écran.
// -----------------------------------------------------------------------------

type Props = {
  portrait: PortraitKey
  /** La plage du premier rendu, calculée par le serveur à l'heure de Paris. */
  initiale: ArenaPeriod
  /** L'image a manqué : la page retombe sur la chambre vide et le héros debout. */
  onErreur: () => void
}

/** Les poussières dans la lumière de la lampe : position en % de l'image, retard. */
const POUSSIERES: readonly { x: number; y: number; retard: number }[] = [
  { x: 24, y: 47, retard: 0 },
  { x: 19, y: 49, retard: -1.8 },
  { x: 28, y: 45, retard: -3.6 },
]

export default function DecorBureau({ portrait, initiale, onErreur }: Props) {
  const [periode, setPeriode] = useState<ArenaPeriod>(initiale)

  useEffect(() => {
    // Override de test (dev uniquement) : fige la plage demandée, sans timer.
    const forcee =
      process.env.NODE_ENV !== 'production' ? new URLSearchParams(window.location.search).get('arena') : null
    let timer: number | undefined

    const sync = () => {
      if (isArenaPeriod(forcee)) {
        setPeriode(forcee)
        return
      }
      const now = new Date()
      setPeriode(arenaPeriodAt(now.getHours()))
      // La scène suivante, préchargée : le fondu partira d'un cache chaud.
      new window.Image().src = decorBureau(portrait, nextArenaSlot(now.getHours()).period)
      // Réveil pile sur la frontière (+1 s de marge d'horloge).
      timer = window.setTimeout(sync, msUntilNextArenaChange(now) + 1_000)
    }
    sync()

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        window.clearTimeout(timer)
        sync()
      }
    }
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => {
      window.clearTimeout(timer)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [portrait])

  // La couche précédente reste sous la nouvelle le temps du fondu — état
  // ajusté pendant le rendu (comparaison avec la valeur précédente), pas d'effet.
  const [pile, setPile] = useState<{ courante: ArenaPeriod; precedente: ArenaPeriod | null }>({
    courante: periode,
    precedente: null,
  })
  if (pile.courante !== periode) {
    setPile({ courante: periode, precedente: pile.courante })
  }
  const couches = pile.precedente ? [pile.precedente, pile.courante] : [pile.courante]

  return (
    <div aria-hidden="true" className={s.boite}>
      {couches.map((p) => (
        // eslint-disable-next-line @next/next/no-img-element -- scène peinte, servie telle quelle
        <img
          key={p}
          src={decorBureau(portrait, p)}
          alt=""
          width={752}
          height={1344}
          draggable={false}
          className={cn(s.image, p === pile.courante && pile.precedente ? s.fondu : null)}
          onError={p === pile.courante ? onErreur : undefined}
        />
      ))}
      <span className={s.halo} />
      <span className={s.coeur} />
      {POUSSIERES.map((g, i) => (
        <span
          key={i}
          className={s.poussiere}
          style={{ left: `${g.x}%`, top: `${g.y}%`, animationDelay: `${g.retard}s` }}
        />
      ))}
    </div>
  )
}
