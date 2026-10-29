'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'
import type { Heros } from '@/lib/heros/catalogue'
import { partPv, pvRestants, tonPv, type Coup } from '@/lib/heros/combat'
import s from './ArenaHeros.module.css'

// L'ARÈNE DES HÉROS (29/10/2026) — la peau « Pokémon » de la course classée,
// avec les héros de l'académie à la place des avatars.
//
// Moi en bas à gauche, vu de DOS ; l'adversaire en haut à droite, vu de FACE ;
// chacun sur son plateau, sa plaque de PV en vis-à-vis. Le composant ne décide
// de rien : il LIT les deux scores de la course et le dernier coup porté.
//
//   · une bonne réponse → l'attaque fétiche : le héros passe dans sa pose
//     d'attaque et fond sur l'autre, la croix de lumière éclate sur la cible,
//     les dégâts volent, sa barre descend (la barre fantôme suit en retard) ;
//   · la question dorée → le coup CRITIQUE : plus grand, l'arène tremble ;
//   · une barre vide → le K.O. : le héros s'assoit, sonné, les étoiles autour.
//
// Tout bouge en transform et opacité, valeurs littérales (règle de l'arène
// vivante). Une animation se rejoue en alternant deux noms d'images-clés
// identiques (parité du coup) : pas de remontage, donc pas d'image qui clignote.

/** La durée de la pose d'attaque (fente + retour), en ms. */
export const MS_POSE_ATTAQUE = 560

export type CoupDate = Coup & { atMs: number }

type Camp = 'moi' | 'rival'

export default function ArenaHeros({
  moi,
  rival,
  coup,
  maintenant,
  ko,
  fin = 'ko',
  entree,
}: {
  moi: { nom: string; heros: Heros; score: number }
  rival: { nom: string; heros: Heros; score: number }
  /** Le dernier coup porté, avec l'instant où il l'a été. */
  coup: CoupDate | null
  /** L'horloge de la course (ms) — elle fait retomber la pose d'attaque. */
  maintenant: number
  /** Le camp mis K.O., ou null. */
  ko: Camp | null
  /** Comment le duel s'est fini : barre vide, ou chrono à zéro (le perdant
   *  tombe aussi, mais le tampon ne ment pas sur ses PV). */
  fin?: 'ko' | 'temps'
  /** L'écran VS : les deux héros entrent en scène. */
  entree: boolean
}) {
  const pvMoi = pvRestants(rival.score)
  const pvRival = pvRestants(moi.score)
  const enAttaque = coup !== null && maintenant - coup.atMs < MS_POSE_ATTAQUE ? coup.camp : null
  const parite = coup ? (coup.id % 2 === 0 ? 'a' : 'b') : null

  return (
    <section
      className={cn(s.arene, coup?.critique && parite && s[`secousse_${parite}`])}
      aria-label={`Duel : ${moi.nom} contre ${rival.nom}`}
      data-entree={entree ? 'true' : undefined}
    >
      <Image
        unoptimized
        src="/images/arene/cour-afternoon.webp"
        alt=""
        fill
        priority
        sizes="(max-width: 640px) 100vw, 640px"
        className={s.decor}
      />
      <div className={s.voile} aria-hidden="true" />

      <Plaque camp="rival" nom={rival.nom} heros={rival.heros} pv={pvRival} />
      <Combattant
        camp="rival"
        heros={rival.heros}
        pose={ko === 'rival' ? 'ko' : enAttaque === 'rival' ? 'attaque' : 'repos'}
        coup={coup}
        parite={parite}
      />
      <Combattant
        camp="moi"
        heros={moi.heros}
        pose={ko === 'moi' ? 'ko' : enAttaque === 'moi' ? 'attaque' : 'repos'}
        coup={coup}
        parite={parite}
      />
      <Plaque camp="moi" nom={moi.nom} heros={moi.heros} pv={pvMoi} chiffres />

      {coup && parite ? <Impact coup={coup} parite={parite} cri={(coup.camp === 'moi' ? moi : rival).heros.attaque.cri} /> : null}

      {entree ? (
        <span className={s.vs} aria-hidden="true">
          VS
        </span>
      ) : null}

      {ko ? (
        <span className={s.ko} data-camp={ko} role="status">
          {fin === 'temps' ? 'Temps !' : 'K.O. !'}
        </span>
      ) : null}
    </section>
  )
}

function Plaque({
  camp,
  nom,
  heros,
  pv,
  chiffres = false,
}: {
  camp: Camp
  nom: string
  heros: Heros
  pv: number
  /** Mes PV s'écrivent en chiffres ; ceux de l'adversaire se lisent à la barre. */
  chiffres?: boolean
}) {
  const part = partPv(pv)
  return (
    <div className={s.plaque} data-camp={camp}>
      <div className={s.plaqueHaut}>
        <span className={cn(s.nom, 'font-heading font-extrabold')}>{nom}</span>
        <span className={s.classe}>{heros.nom}</span>
      </div>
      <div
        className={s.barre}
        role="meter"
        aria-label={`Points de vie de ${nom}`}
        aria-valuemin={0}
        aria-valuemax={1000}
        aria-valuenow={pv}
      >
        <span className={s.pv}>PV</span>
        <span className={s.rail}>
          <span className={s.fantome} style={{ transform: `scaleX(${part})` }} />
          <span className={s.remplissage} data-ton={tonPv(part)} style={{ transform: `scaleX(${part})` }} />
        </span>
      </div>
      {chiffres ? (
        <span className={cn(s.chiffres, 'tabular-nums')}>
          {pv} / 1000
        </span>
      ) : null}
    </div>
  )
}

function Combattant({
  camp,
  heros,
  pose,
  coup,
  parite,
}: {
  camp: Camp
  heros: Heros
  pose: 'repos' | 'attaque' | 'ko'
  coup: CoupDate | null
  parite: 'a' | 'b' | null
}) {
  // Moi de dos, l'adversaire de face — retourné pour qu'il me regarde.
  const images =
    camp === 'moi'
      ? { repos: heros.poses.dos, attaque: heros.poses.attaqueDos, ko: heros.poses.ko }
      : { repos: heros.poses.face, attaque: heros.poses.attaqueFace, ko: heros.poses.ko }
  const geste =
    coup && parite && pose !== 'ko'
      ? coup.camp === camp
        ? s[`attaque_${camp}_${parite}`]
        : s[`touche_${parite}`]
      : undefined
  const touche = coup !== null && coup.camp !== camp && pose !== 'ko'

  return (
    <div className={s.combattant} data-camp={camp} data-pose={pose}>
      <span className={s.plateau} aria-hidden="true" />
      <div className={s.souffle}>
        <div className={cn(s.geste, geste)}>
          <div className={s.miroir}>
            {/* Les trois poses restent montées : la bascule est une opacité,
                jamais un chargement. */}
            {(['repos', 'attaque', 'ko'] as const).map((p) => (
              <Image
                unoptimized
                key={p}
                src={images[p]}
                alt={p === pose ? `${heros.nom}${p === 'ko' ? ', K.O.' : ''}` : ''}
                aria-hidden={p === pose ? undefined : true}
                fill
                priority
                sizes="(max-width: 640px) 50vw, 320px"
                className={cn(s.sprite, p === pose && s.visible, p === 'ko' && pose === 'ko' && s.chute)}
              />
            ))}
            {touche && parite ? (
              <Image
                unoptimized
                src={images.repos}
                alt=""
                aria-hidden="true"
                fill
                sizes="(max-width: 640px) 50vw, 320px"
                className={cn(s.sprite, s.flash, s[`flash_${parite}`])}
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

function Impact({ coup, parite, cri }: { coup: CoupDate; parite: 'a' | 'b'; cri: string }) {
  const cible: Camp = coup.camp === 'moi' ? 'rival' : 'moi'
  return (
    <>
      <span
        className={cn(s.impact, s[`impact_${parite}`], coup.critique && s.impactCritique)}
        data-cible={cible}
        aria-hidden="true"
      >
        <span className={s.eclat} />
        <span className={s.croix} />
      </span>
      <span className={cn(s.degats, s[`degats_${parite}`], 'font-heading font-extrabold tabular-nums')} data-cible={cible}>
        −{coup.degats}
      </span>
      {coup.critique ? (
        <span className={cn(s.critique, s[`critique_${parite}`], 'font-heading font-extrabold')} aria-hidden="true">
          Coup critique !<small>{cri}</small>
        </span>
      ) : null}
    </>
  )
}
